/**
 * Helper script to set up .env file for Azure Database for PostgreSQL Flexible Server
 * Run with: node setup-env.js
 * 
 * NOTE: This app requires PostgreSQL (not MongoDB/NoSQL) because it uses:
 * - Prisma ORM with PostgreSQL provider
 * - Relational database schema with foreign keys
 * - PostgreSQL-specific features (UUIDs, relationships)
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

async function setupEnv() {
  console.log('=== Azure Database for PostgreSQL Flexible Server Setup ===\n');
  console.log('⚠️  IMPORTANT: Your app requires PostgreSQL (not MongoDB/NoSQL)\n');
  console.log('Please provide the following information from your Azure portal:\n');

  const serverName = await question('Server name (e.g., unify-chatlas-server): ');
  const adminUsername = await question('Administrator username (e.g., postgresadmin): ');
  const adminPassword = await question('Administrator password: ');
  const dbName = await question('Database name (default: postgres, press Enter for default): ') || 'postgres';
  
  const transKey = await question('Azure Translation API Key (press Enter to skip): ') || '';
  const googleClientId = await question('Google OAuth Client ID (press Enter to skip): ') || '';
  const googleClientSecret = await question('Google OAuth Client Secret (press Enter to skip): ') || '';
  
  // Generate random secrets
  const sessionSecret = require('crypto').randomBytes(32).toString('hex');
  const jwtSecret = require('crypto').randomBytes(32).toString('hex');

  const dbHost = `${serverName}.postgres.database.azure.com`;
  // For Flexible Server, username is just the username (NOT username@server)
  const dbUser = adminUsername;
  
  // URL encode password for connection string
  const encodedPassword = encodeURIComponent(adminPassword);
  
  // Flexible Server connection string format
  const databaseUrl = `postgresql://${adminUsername}:${encodedPassword}@${dbHost}:5432/${dbName}?sslmode=require&schema=public`;

  const envContent = `# Database Configuration for Azure Database for PostgreSQL Flexible Server
DB_HOST=${dbHost}
DB_USER=${dbUser}
DB_PASSWORD=${adminPassword}
DB_NAME=${dbName}
DATABASE_URL="${databaseUrl}"

# Azure Translation API Configuration
AZURE_TRANS_KEY=${transKey}
VITE_TRANS_KEY=${transKey}
AZURE_TRANS_LOCATION=eastus
VITE_TRANS_REGION=eastus

# Google OAuth Configuration
GOOGLE_CLIENT_ID=${googleClientId}
GOOGLE_CLIENT_SECRET=${googleClientSecret}

# Session & JWT Secrets (auto-generated)
SESSION_SECRET=${sessionSecret}
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=1d

# Server Configuration
PORT=3000
`;

  const envPath = path.join(__dirname, '.env');
  
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('\n.env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ .env file created successfully!');
  console.log('\nNext steps:');
  console.log('1. Review the .env file and update any missing values');
  console.log('2. Run: npx prisma migrate dev --name init');
  console.log('3. Run: npm start');
  
  rl.close();
}

setupEnv().catch((err) => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
});

