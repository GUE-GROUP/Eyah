// Deploy Edge Functions without Supabase CLI
// Run with: node deploy-functions.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration - UPDATE THESE
const SUPABASE_PROJECT_REF = 'your-project-ref'; // Get from project URL
const SUPABASE_ACCESS_TOKEN = 'your-access-token'; // Get from dashboard

const FUNCTIONS_DIR = path.join(__dirname, 'supabase', 'functions');
const SUPABASE_API = `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/functions`;

async function deployFunction(functionName) {
  const functionPath = path.join(FUNCTIONS_DIR, functionName, 'index.ts');
  const functionCode = fs.readFileSync(functionPath, 'utf8');

  console.log(`\nDeploying ${functionName}...`);

  try {
    const response = await fetch(`${SUPABASE_API}/${functionName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug: functionName,
        name: functionName,
        body: functionCode,
        verify_jwt: false
      })
    });

    if (response.ok) {
      console.log(`✅ ${functionName} deployed successfully!`);
    } else {
      const error = await response.text();
      console.error(`❌ Failed to deploy ${functionName}:`, error);
    }
  } catch (error) {
    console.error(`❌ Error deploying ${functionName}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Deploying Edge Functions...\n');
  
  if (SUPABASE_PROJECT_REF === 'your-project-ref') {
    console.error('❌ Please update SUPABASE_PROJECT_REF in deploy-functions.js');
    process.exit(1);
  }

  const functions = ['check-availability', 'create-booking', 'send-confirmation'];

  for (const func of functions) {
    await deployFunction(func);
  }

  console.log('\n✅ Deployment complete!');
}

main();
