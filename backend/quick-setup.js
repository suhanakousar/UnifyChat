/**
 * Quick Setup Script for Azure PostgreSQL Flexible Server
 * Run after providing connection details
 * Usage: node quick-setup.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function quickSetup() {
  console.log('🚀 Azure PostgreSQL Flexible Server Quick Setup\n');
  console.log('=' .repeat(60));
  console.log('Please provide the connection details from Azure Portal\n');

  // Get connection details
  const serverName = await question('1. Server Name (hostname ending with .postgres.database.azure.com): ');
  const adminUsername = await question('2. Administrator Username (just username, no @server): ');
  const adminPassword = await question('3. Administrator Password: ');
  const dbName = await question('4. Database Name (default: postgres, press Enter for default): ') || 'postgres';
  const port = await question('5. Port (default: 5432, press Enter for default): ') || '5432';

  // Validate inputs
  if (!serverName || !adminUsername || !adminPassword || !dbName) {
    console.error('\n❌ Error: All fields are required!');
    rl.close();
    return;
  }

  // Check server name format
  if (!serverName.includes('.postgres.database.azure.com')) {
    console.log('\n⚠️  Warning: Server name should include .postgres.database.azure.com');
    console.log(`   Using: ${serverName}`);
  }

  // Check username format
  if (adminUsername.includes('@')) {
    console.log('\n⚠️  Warning: For Flexible Server, username should NOT include @server');
    console.log(`   Using: ${adminUsername}`);
  }

  // Generate secrets if needed
  const sessionSecret = require('crypto').randomBytes(32).toString('hex');
  const jwtSecret = require('crypto').randomBytes(32).toString('hex');

  // URL encode password for connection string
  const encodedPassword = encodeURIComponent(adminPassword);
  
  // Build DATABASE_URL
  const databaseUrl = `postgresql://${adminUsername}:${encodedPassword}@${serverName}:${port}/${dbName}?sslmode=require&schema=public`;

  // Read existing .env to preserve other settings
  const envPath = path.join(__dirname, '.env');
  let existingEnv = {};
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        existingEnv[key.trim()] = value.trim();
      }
    });
  }

  // Update database-related env vars
  existingEnv.DB_HOST = serverName;
  existingEnv.DB_USER = adminUsername;
  existingEnv.DB_PASSWORD = adminPassword;
  existingEnv.DB_NAME = dbName;
  existingEnv.DATABASE_URL = databaseUrl;

  // Add secrets if not present
  if (!existingEnv.SESSION_SECRET) {
    existingEnv.SESSION_SECRET = sessionSecret;
  }
  if (!existingEnv.JWT_SECRET) {
    existingEnv.JWT_SECRET = jwtSecret;
  }
  if (!existingEnv.JWT_EXPIRES_IN) {
    existingEnv.JWT_EXPIRES_IN = '1d';
  }
  if (!existingEnv.PORT) {
    existingEnv.PORT = '3000';
  }

  // Build .env content
  let envContent = `# Database Configuration for Azure PostgreSQL Flexible Server
# Generated on ${new Date().toISOString()}

DB_HOST=${serverName}
DB_USER=${adminUsername}
DB_PASSWORD=${adminPassword}
DB_NAME=${dbName}
DATABASE_URL="${databaseUrl}"

# Session & JWT Secrets
SESSION_SECRET=${existingEnv.SESSION_SECRET}
JWT_SECRET=${existingEnv.JWT_SECRET}
JWT_EXPIRES_IN=${existingEnv.JWT_EXPIRES_IN}

# Server Configuration
PORT=${existingEnv.PORT}

`;

  // Add optional keys if they exist
  if (existingEnv.AZURE_TRANS_KEY) {
    envContent += `# Azure Translation API
AZURE_TRANS_KEY=${existingEnv.AZURE_TRANS_KEY}
AZURE_TRANS_LOCATION=${existingEnv.AZURE_TRANS_LOCATION || 'eastus'}
VITE_TRANS_KEY=${existingEnv.VITE_TRANS_KEY || existingEnv.AZURE_TRANS_KEY}
VITE_TRANS_REGION=${existingEnv.VITE_TRANS_REGION || existingEnv.AZURE_TRANS_LOCATION || 'eastus'}

`;
  }

  if (existingEnv.GOOGLE_CLIENT_ID) {
    envContent += `# Google OAuth
GOOGLE_CLIENT_ID=${existingEnv.GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${existingEnv.GOOGLE_CLIENT_SECRET}

`;
  }

  // Write .env file
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ .env file updated successfully!');
  console.log('\n📋 Configuration Summary:');
  console.log(`   Server: ${serverName}`);
  console.log(`   Database: ${dbName}`);
  console.log(`   User: ${adminUsername}`);
  console.log(`   Port: ${port}`);
  console.log(`   Secrets: Generated automatically`);

  console.log('\n🔍 Next Steps:');
  console.log('   1. Test connection: node check-env.js');
  console.log('   2. Run migrations: npx prisma migrate dev --name init');
  console.log('   3. Start server: npm start');

  rl.close();
}

quickSetup().catch((err) => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});

