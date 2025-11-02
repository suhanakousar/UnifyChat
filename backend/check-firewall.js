/**
 * Check if we can reach the PostgreSQL server port
 */

const net = require('net');

const host = 'sqlservices.postgres.database.azure.com';
const port = 5432;

console.log(`🔍 Checking if port ${port} is reachable on ${host}...\n`);

const socket = new net.Socket();
const timeout = 5000; // 5 seconds

socket.setTimeout(timeout);

socket.on('connect', () => {
  console.log('✅ Port is OPEN - Firewall allows connection!');
  console.log('   The issue might be with authentication.');
  socket.destroy();
  process.exit(0);
});

socket.on('timeout', () => {
  console.log('❌ Connection TIMEOUT - Port might be blocked by firewall');
  console.log('\n💡 Action needed:');
  console.log('   1. Go to Azure Portal → Your PostgreSQL server');
  console.log('   2. Click "Networking"');
  console.log('   3. Add your current IP address to firewall rules');
  console.log('   4. Enable "Allow Azure services"');
  console.log('   5. Save and wait 2-3 minutes');
  socket.destroy();
  process.exit(1);
});

socket.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.log('❌ Connection REFUSED - Server might not be accepting connections');
  } else if (err.code === 'ETIMEDOUT') {
    console.log('❌ Connection TIMEOUT - Firewall is blocking the connection');
    console.log('\n💡 Your IP address is not in the firewall allow list.');
    console.log('   Please add it in Azure Portal → Networking → Firewall rules');
  } else {
    console.log('❌ Error:', err.message);
  }
  process.exit(1);
});

socket.connect(port, host);

