/**
 * Update .env file with Azure PostgreSQL credentials
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Your Azure PostgreSQL credentials
const config = {
  DB_HOST: 'sqlservices.postgres.database.azure.com',
  DB_USER: 'pgadmin',
  DB_PASSWORD: 'Suhana@2005',
  DB_NAME: 'postgres',
  PORT: '3000'
};

// Generate secrets
const sessionSecret = crypto.randomBytes(32).toString('hex');
const jwtSecret = crypto.randomBytes(32).toString('hex');

// URL encode password for DATABASE_URL
const encodedPassword = encodeURIComponent(config.DB_PASSWORD);

// Build DATABASE_URL
const databaseUrl = `postgresql://${config.DB_USER}:${encodedPassword}@${config.DB_HOST}:5432/${config.DB_NAME}?sslmode=require&schema=public`;

// Read existing .env to preserve optional keys
const envPath = path.join(__dirname, '.env');
let existingEnv = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      const keyTrimmed = key.trim();
      // Preserve optional keys
      if (keyTrimmed.includes('GOOGLE') || keyTrimmed.includes('AZURE_TRANS') || keyTrimmed.includes('VITE_TRANS') || keyTrimmed.includes('EMAILJS')) {
        existingEnv[keyTrimmed] = value.trim();
      }
    }
  });
}

// Build .env content
let envContent = `# Database Configuration for Azure PostgreSQL Flexible Server
# Server: ${config.DB_HOST}
# Updated: ${new Date().toISOString()}

DB_HOST=${config.DB_HOST}
DB_USER=${config.DB_USER}
DB_PASSWORD=${config.DB_PASSWORD}
DB_NAME=${config.DB_NAME}
DATABASE_URL="${databaseUrl}"

# Session & JWT Secrets (auto-generated)
SESSION_SECRET=${sessionSecret}
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=1d

# Server Configuration
PORT=${config.PORT}

`;

// Add optional keys if they exist
if (existingEnv.AZURE_TRANS_KEY || existingEnv.VITE_TRANS_KEY) {
  envContent += `# Azure Translation API
AZURE_TRANS_KEY=${existingEnv.AZURE_TRANS_KEY || existingEnv.VITE_TRANS_KEY || ''}
AZURE_TRANS_LOCATION=${existingEnv.AZURE_TRANS_LOCATION || 'eastus'}
VITE_TRANS_KEY=${existingEnv.VITE_TRANS_KEY || existingEnv.AZURE_TRANS_KEY || ''}
VITE_TRANS_REGION=${existingEnv.VITE_TRANS_REGION || existingEnv.AZURE_TRANS_LOCATION || 'eastus'}

`;
}

if (existingEnv.GOOGLE_CLIENT_ID) {
  envContent += `# Google OAuth
GOOGLE_CLIENT_ID=${existingEnv.GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${existingEnv.GOOGLE_CLIENT_SECRET || ''}

`;
}

// Write .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ .env file updated successfully!');
console.log('\n📋 Configuration Summary:');
console.log(`   Server: ${config.DB_HOST}`);
console.log(`   Database: ${config.DB_NAME}`);
console.log(`   User: ${config.DB_USER}`);
console.log(`   Port: 5432`);
console.log(`   Secrets: Generated automatically`);
console.log('\n🔍 Next: Testing connection...\n');

