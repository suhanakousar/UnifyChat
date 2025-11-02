/**
 * Update .env file with provided credentials
 */

const fs = require('fs');
const path = require('path');

// Provided environment variables
const envVars = {
  AZURE_TRANS_KEY: 'uhhjfxr3FiYaJiQVJLMyUWxzlNyf7C2ap4RlLmLUS2snl07YWyXpJQQJ99BJACGhslBXJ3w3AAAEACOG04n0',
  AZURE_TRANS_LOCATION: 'centralindia',
  VITE_TRANS_KEY: 'uhhjfxr3FiYaJiQVJLMyUWxzlNyf7C2ap4RlLmLUS2snl07YWyXpJQQJ99BJACGhslBXJ3w3AAAEACOG04n0',
  VITE_TRANS_REGION: 'centralindia',
  GOOGLE_CLIENT_ID: '339367030371-gk3isctlpt7cb810qf51e1siugd3g7le.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: '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',
  SESSION_SECRET: '5ce22b78a6ffc2f522171736edb78174611e32e8c35ebeff36cb103e66b7adf99e3f7ec81db2d9f3dff8a023d32cb7fba',
  JWT_SECRET: '3b1503bb6f14b3920fc9807a6204ca5ea1646bbbc21a1ae1366cb4a74ec0ccf66753e1d8f92943a943964e0a46d6faff6',
  JWT_EXPIRES_IN: '1d'
};

const envPath = path.join(__dirname, '.env');

// Read existing .env to preserve database config
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

// Merge provided vars with existing (provided vars take precedence)
const mergedEnv = { ...existingEnv, ...envVars };

// Build .env content
let envContent = `# Database Configuration for Azure PostgreSQL Flexible Server
DB_HOST=${mergedEnv.DB_HOST || 'sqlservices.postgres.database.azure.com'}
DB_USER=${mergedEnv.DB_USER || 'pgadmin'}
DB_PASSWORD=${mergedEnv.DB_PASSWORD || 'Suhana@2005'}
DB_NAME=${mergedEnv.DB_NAME || 'postgres'}
DATABASE_URL="${mergedEnv.DATABASE_URL || `postgresql://${mergedEnv.DB_USER || 'pgadmin'}:${encodeURIComponent(mergedEnv.DB_PASSWORD || 'Suhana@2005')}@${mergedEnv.DB_HOST || 'sqlservices.postgres.database.azure.com'}:5432/${mergedEnv.DB_NAME || 'postgres'}?sslmode=require&schema=public`}"

# Azure Translation API Configuration
AZURE_TRANS_KEY=${envVars.AZURE_TRANS_KEY}
AZURE_TRANS_LOCATION=${envVars.AZURE_TRANS_LOCATION}
VITE_TRANS_KEY=${envVars.VITE_TRANS_KEY}
VITE_TRANS_REGION=${envVars.VITE_TRANS_REGION}

# Google OAuth Configuration
GOOGLE_CLIENT_ID=${envVars.GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${envVars.GOOGLE_CLIENT_SECRET}

# Session & JWT Secrets
SESSION_SECRET=${envVars.SESSION_SECRET}
JWT_SECRET=${envVars.JWT_SECRET}
JWT_EXPIRES_IN=${envVars.JWT_EXPIRES_IN}

# Server Configuration
PORT=${mergedEnv.PORT || '3000'}
`;

fs.writeFileSync(envPath, envContent);
console.log('✅ Backend .env file updated successfully!');
console.log('   Google Client ID:', envVars.GOOGLE_CLIENT_ID.substring(0, 30) + '...');

