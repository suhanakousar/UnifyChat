/**
 * Script to install missing dependencies
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Installing socket.io-client...\n');

try {
  // Change to frontend directory
  const forentendDir = __dirname;
  process.chdir(forentendDir);
  
  // Install socket.io-client
  console.log('Running: npm install socket.io-client');
  execSync('npm install socket.io-client', { 
    stdio: 'inherit',
    cwd: forentendDir 
  });
  
  console.log('\n✅ socket.io-client installed successfully!');
} catch (error) {
  console.error('❌ Error installing socket.io-client:', error.message);
  process.exit(1);
}

