/**
 * Test database connection
 */

require('dotenv').config();
const { Pool } = require('pg');

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log('🔌 Attempting to connect to database...');
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   User: ${process.env.DB_USER}`);
console.log(`   Database: ${process.env.DB_NAME}\n`);

db.query('SELECT NOW(), version()', (err, res) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('\n💡 Troubleshooting:');
    
    if (err.message.includes('ECONNRESET') || err.message.includes('refused') || err.code === 'ECONNREFUSED') {
      console.error('   → Connection refused - Check firewall rules in Azure Portal');
      console.error('   → Go to: Azure Portal → Your PostgreSQL Server → Networking');
      console.error('   → Add your current IP address');
      console.error('   → Enable "Allow Azure services" checkbox');
    } else if (err.message.includes('password') || err.message.includes('authentication')) {
      console.error('   → Authentication failed - Verify username and password');
      console.error('   → Check if username format is correct (just username, not username@server)');
    } else if (err.message.includes('timeout')) {
      console.error('   → Connection timeout - Check network connectivity');
      console.error('   → Verify firewall rules allow your IP');
    } else {
      console.error('   → Error details:', err);
    }
    
    db.end();
    process.exit(1);
  } else {
    console.log('✅ Connected successfully!');
    console.log('   Time:', res.rows[0].now);
    console.log('   PostgreSQL version:', res.rows[0].version.split(',')[0]);
    console.log('\n🎉 Database connection is working! You can now run migrations.');
    db.end();
    process.exit(0);
  }
});

