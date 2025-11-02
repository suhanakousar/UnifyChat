/**
 * Update frontend .env file with provided credentials
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Provided environment variables
const envVars = {
  VITE_GOOGLE_CLIENT_ID: '339367030371-gk3isctlpt7cb810qf51e1siugd3g7le.apps.googleusercontent.com',
  REACT_APP_GOOGLE_CLIENT_ID: '339367030371-gk3isctlpt7cb810qf51e1siugd3g7le.apps.googleusercontent.com',
  VITE_TRANS_KEY: 'uhhjfxr3FiYaJiQVJLMyUWxzlNyf7C2ap4RlLmLUS2snl07YWyXpJQQJ99BJACGhslBXJ3w3AAAEACOG04n0',
  VITE_TRANS_REGION: 'centralindia',
  VITE_SPEECH_REGION: 'centralindia',
  VITE_API_BASE_URL: 'http://localhost:3000'
};

const envPath = path.join(__dirname, '.env');

// Read existing .env to preserve other settings
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
let envContent = `# Frontend Environment Variables

# Google OAuth (both prefixes for compatibility)
VITE_GOOGLE_CLIENT_ID=${envVars.VITE_GOOGLE_CLIENT_ID}
REACT_APP_GOOGLE_CLIENT_ID=${envVars.REACT_APP_GOOGLE_CLIENT_ID}

# Azure Translation API
VITE_TRANS_KEY=${envVars.VITE_TRANS_KEY}
VITE_TRANS_REGION=${envVars.VITE_TRANS_REGION}

# Azure Speech Service
VITE_SPEECH_REGION=${envVars.VITE_SPEECH_REGION}

# API Configuration
VITE_API_BASE_URL=${envVars.VITE_API_BASE_URL}

`;

// Add optional keys if they exist
if (existingEnv.VITE_EMAILJS_PUBLIC_KEY) {
  envContent += `# EmailJS (Optional)
VITE_EMAILJS_PUBLIC_KEY=${existingEnv.VITE_EMAILJS_PUBLIC_KEY}
VITE_EMAILJS_SERVICE_ID=${existingEnv.VITE_EMAILJS_SERVICE_ID || ''}
VITE_EMAILJS_TEMPLATE_ID=${existingEnv.VITE_EMAILJS_TEMPLATE_ID || ''}

`;
}

fs.writeFileSync(envPath, envContent);
console.log('✅ Frontend .env file created/updated successfully!');

