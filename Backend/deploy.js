#!/usr/bin/env node

/**
 * Deploy Edge Functions to Supabase without CLI
 * 
 * Usage:
 * 1. Set environment variables or update config below
 * 2. Run: node deploy.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
          process.env[key.trim()] = value;
        }
      }
    });
    console.log('✅ Loaded .env file');
  }
}

// Load environment variables
loadEnv();

// ============================================
// CONFIGURATION - Update these values
// ============================================
const config = {
  // Get from: Supabase Dashboard → Settings → General → Reference ID
  projectRef: process.env.SUPABASE_PROJECT_REF || 'your-project-ref',
  
  // Get from: Supabase Dashboard → Settings → API → Project API keys → service_role
  // OR create access token: https://app.supabase.com/account/tokens
  accessToken: process.env.SUPABASE_ACCESS_TOKEN || 'your-access-token',
  
  // Functions to deploy
  functions: ['check-availability', 'create-booking', 'send-confirmation']
};

// ============================================
// Deployment Logic
// ============================================

function readFunctionCode(functionName) {
  const functionPath = path.join(__dirname, 'supabase', 'functions', functionName, 'index.ts');
  
  if (!fs.existsSync(functionPath)) {
    throw new Error(`Function not found: ${functionPath}`);
  }
  
  return fs.readFileSync(functionPath, 'utf8');
}

async function deployFunction(functionName) {
  return new Promise((resolve, reject) => {
    console.log(`\n📦 Deploying ${functionName}...`);
    
    try {
      const functionCode = readFunctionCode(functionName);
      
      const postData = JSON.stringify({
        slug: functionName,
        name: functionName,
        body: functionCode,
        verify_jwt: false,
        import_map: false
      });

      const options = {
        hostname: 'api.supabase.com',
        port: 443,
        path: `/v1/projects/${config.projectRef}/functions/${functionName}`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log(`✅ ${functionName} deployed successfully!`);
            resolve({ success: true, functionName });
          } else {
            console.error(`❌ Failed to deploy ${functionName}`);
            console.error(`Status: ${res.statusCode}`);
            console.error(`Response: ${data}`);
            reject(new Error(`Deployment failed: ${data}`));
          }
        });
      });

      req.on('error', (error) => {
        console.error(`❌ Error deploying ${functionName}:`, error.message);
        reject(error);
      });

      req.write(postData);
      req.end();
      
    } catch (error) {
      console.error(`❌ Error reading ${functionName}:`, error.message);
      reject(error);
    }
  });
}

async function validateConfig() {
  console.log('🔍 Validating configuration...\n');
  
  if (config.projectRef === 'your-project-ref') {
    console.error('❌ Error: SUPABASE_PROJECT_REF not set');
    console.error('\nPlease set it in one of these ways:');
    console.error('1. Environment variable: export SUPABASE_PROJECT_REF=your-ref');
    console.error('2. Update config.projectRef in deploy.js');
    console.error('\nGet it from: Supabase Dashboard → Settings → General → Reference ID');
    process.exit(1);
  }
  
  if (config.accessToken === 'your-access-token') {
    console.error('❌ Error: SUPABASE_ACCESS_TOKEN not set');
    console.error('\nPlease set it in one of these ways:');
    console.error('1. Environment variable: export SUPABASE_ACCESS_TOKEN=your-token');
    console.error('2. Update config.accessToken in deploy.js');
    console.error('\nGet it from: https://app.supabase.com/account/tokens');
    process.exit(1);
  }
  
  console.log('✅ Configuration valid');
  console.log(`📍 Project: ${config.projectRef}`);
  console.log(`🔧 Functions: ${config.functions.join(', ')}\n`);
}

async function main() {
  console.log('🚀 Supabase Edge Functions Deployment\n');
  console.log('=' .repeat(50));
  
  await validateConfig();
  
  console.log('\n🔄 Starting deployment...\n');
  
  const results = [];
  
  for (const functionName of config.functions) {
    try {
      const result = await deployFunction(functionName);
      results.push(result);
    } catch (error) {
      results.push({ success: false, functionName, error: error.message });
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Deployment Summary:\n');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All functions deployed successfully!');
    console.log('\nYou can now test them at:');
    console.log(`https://${config.projectRef}.supabase.co/functions/v1/[function-name]`);
  } else {
    console.log('\n⚠️  Some deployments failed. Check the errors above.');
    process.exit(1);
  }
}

// Run deployment
main().catch(error => {
  console.error('\n💥 Deployment failed:', error.message);
  process.exit(1);
});
