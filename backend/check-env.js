/**
 * Environment Variables Checker
 * Run with: node check-env.js
 * This script checks what environment variables are set and what's missing
 */

require('dotenv').config();

const requiredBackend = {
  'Database (CRITICAL)': [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'DATABASE_URL'
  ],
  'Authentication (CRITICAL)': [
    'SESSION_SECRET',
    'JWT_SECRET',
    'JWT_EXPIRES_IN'
  ],
  'Google OAuth (OPTIONAL - for Google login)': [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ],
  'Azure Translation (OPTIONAL - for translation feature)': [
    'AZURE_TRANS_KEY',
    'AZURE_TRANS_LOCATION',
    'VITE_TRANS_KEY',
    'VITE_TRANS_REGION'
  ],
  'Server (OPTIONAL - has default)': [
    'PORT'
  ]
};

console.log('🔍 Checking Backend Environment Variables...\n');
console.log('='.repeat(60));

let allGood = true;

for (const [category, keys] of Object.entries(requiredBackend)) {
  console.log(`\n📋 ${category}:`);
  
  for (const key of keys) {
    const value = process.env[key];
    const isSet = value && value.trim() !== '';
    
    if (isSet) {
      // Mask sensitive values
      if (key.includes('PASSWORD') || key.includes('SECRET') || key.includes('KEY')) {
        const masked = value.length > 8 
          ? value.substring(0, 4) + '...' + value.substring(value.length - 4)
          : '***';
        console.log(`  ✅ ${key}: ${masked}`);
      } else {
        console.log(`  ✅ ${key}: ${value}`);
      }
    } else {
      const isCritical = category.includes('CRITICAL');
      console.log(`  ${isCritical ? '❌' : '⚠️ '} ${key}: NOT SET`);
      if (isCritical) {
        allGood = false;
      }
    }
  }
}

console.log('\n' + '='.repeat(60));

// Check DATABASE_URL format
if (process.env.DATABASE_URL) {
  const dbUrl = process.env.DATABASE_URL;
  console.log('\n🔗 DATABASE_URL Format Check:');
  
  const checks = {
    'Starts with postgresql://': dbUrl.startsWith('postgresql://'),
    'Contains @': dbUrl.includes('@'),
    'Contains :5432': dbUrl.includes(':5432'),
    'Has sslmode=require': dbUrl.includes('sslmode=require'),
    'Has schema=public': dbUrl.includes('schema=public')
  };
  
  for (const [check, passed] of Object.entries(checks)) {
    console.log(`  ${passed ? '✅' : '❌'} ${check}`);
  }
  
  // Check if DB_USER matches DATABASE_URL
  if (process.env.DB_USER && process.env.DB_HOST) {
    const urlHasUser = dbUrl.includes(process.env.DB_USER);
    const urlHasHost = dbUrl.includes(process.env.DB_HOST);
    console.log(`  ${urlHasUser ? '✅' : '⚠️ '} DATABASE_URL contains DB_USER`);
    console.log(`  ${urlHasHost ? '✅' : '⚠️ '} DATABASE_URL contains DB_HOST`);
  }
}

// Check DB_USER format (should NOT have @server for Flexible Server)
if (process.env.DB_USER) {
  console.log('\n👤 DB_USER Format Check:');
  const dbUser = process.env.DB_USER;
  if (dbUser.includes('@')) {
    console.log(`  ⚠️  DB_USER contains '@': ${dbUser}`);
    console.log(`  ℹ️  For Azure Flexible Server, use just username (NOT username@server)`);
    console.log(`  ℹ️  For Azure Cosmos DB, use username@server`);
  } else {
    console.log(`  ✅ DB_USER format looks correct (no @)`);
  }
}

console.log('\n' + '='.repeat(60));

if (allGood) {
  console.log('\n✅ All CRITICAL environment variables are set!');
  console.log('⚠️  Some OPTIONAL variables are missing (features may not work)');
} else {
  console.log('\n❌ Some CRITICAL environment variables are missing!');
  console.log('   Please set the missing variables in backend/.env');
}

console.log('\n💡 Tip: Run "node check-env.js" anytime to verify your configuration');
console.log('💡 See ENV_KEYS_CHECKLIST.md for detailed information\n');

