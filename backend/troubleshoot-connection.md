# Troubleshooting Database Connection

## Current Issue
Connection timeout to: `sqlservices.postgres.database.azure.com:5432`

## Checklist

### 1. Server Status
- [ ] Go to Azure Portal → Your PostgreSQL server (`sqlservices`)
- [ ] Check the **Status** - it should be **"Ready"** (not "Updating" or "Starting")
- [ ] If it says "Updating", wait until it's "Ready"

### 2. Firewall Configuration
- [ ] Azure Portal → PostgreSQL server → **"Networking"**
- [ ] Under **"Public access"** tab
- [ ] Check if your IP address is listed in firewall rules
- [ ] **IMPORTANT**: Enable **"Allow Azure services and resources to access this server"**
- [ ] Click **"Save"** and wait 2-3 minutes

### 3. Verify Your Current IP
The connection is trying to reach IP: `4.213.57.85`

To find your actual IP:
- Go to: https://www.whatismyip.com/
- Make sure this IP matches what you added in Azure Portal

### 4. Test Connection from Azure Portal
1. Azure Portal → Your PostgreSQL server
2. Click **"Connection strings"** in left menu
3. Try connecting using the connection string shown there
4. Or use **"Query editor"** to test if you can connect

### 5. Alternative: Use Azure Cloud Shell
1. Azure Portal → Click the **Cloud Shell** icon (top right)
2. Run: `psql "host=sqlservices.postgres.database.azure.com port=5432 dbname=postgres user=pgadmin sslmode=require"`
3. Enter your password when prompted
4. If this works, the issue is with your local network/firewall

## Quick Fix: Allow All IPs (Development Only)

⚠️ **ONLY FOR DEVELOPMENT/TESTING - NOT FOR PRODUCTION**

1. Azure Portal → Networking → Firewall rules
2. Add rule:
   - Start IP: `0.0.0.0`
   - End IP: `255.255.255.255`
3. Save
4. **⚠️ Remove this rule after testing!**

## Next Steps

After firewall is properly configured:
1. Wait 2-3 minutes for changes to apply
2. Run: `node test-connection.js`
3. If successful, run: `npx prisma migrate dev --name init`
4. Start server: `npm start`

