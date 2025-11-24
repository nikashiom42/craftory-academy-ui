#!/usr/bin/env node
/**
 * Deploy Supabase Edge Functions using Management API
 * Usage: node scripts/deploy-functions.js
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars from .env.local
function loadEnv() {
  try {
    const envContent = readFileSync('.env.local', 'utf-8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)="?(.+?)"?$/);
      if (match) {
        env[match[1].trim()] = match[2].trim();
      }
    });
    return env;
  } catch (error) {
    console.error('Error loading .env.local:', error.message);
    process.exit(1);
  }
}

const env = loadEnv();

const SUPABASE_URL = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required in .env.local');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('❌ Could not extract project ref from SUPABASE_URL');
  process.exit(1);
}

const functionsDir = join(__dirname, '../supabase/functions');
const functions = ['ipay-auth', 'ipay-create-order', 'ipay-callback'];

async function deployFunction(functionName) {
  const functionDir = join(functionsDir, functionName);
  
  try {
    // Read all files in function directory
    const files = {};
    const readDir = (dir, basePath = '') => {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          readDir(fullPath, join(basePath, entry));
        } else if (stat.isFile()) {
          const relativePath = join(basePath, entry);
          files[relativePath] = readFileSync(fullPath, 'utf-8');
        }
      }
    };
    
    readDir(functionDir);
    
    if (Object.keys(files).length === 0) {
      console.error(`❌ No files found in ${functionName}`);
      return false;
    }

    console.log(`📦 Deploying ${functionName}...`);
    console.log(`   Files: ${Object.keys(files).join(', ')}`);

    // Use Supabase Management API
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/functions/${functionName}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: files['index.ts'] || files['index.js'] || Object.values(files)[0],
          verify_jwt: false,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed to deploy ${functionName}:`, errorText);
      return false;
    }

    console.log(`✅ Deployed ${functionName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error deploying ${functionName}:`, error.message);
    return false;
  }
}

async function deployAll() {
  console.log(`🚀 Deploying functions to project: ${projectRef}`);
  console.log(`   URL: ${SUPABASE_URL}\n`);

  for (const func of functions) {
    await deployFunction(func);
    console.log('');
  }

  console.log('✨ Deployment complete!');
  console.log('\n⚠️  Note: Edge Functions may need to be deployed via Supabase Dashboard');
  console.log('   or using Supabase CLI if Management API deployment fails.');
  console.log('\n   Alternative: Use Supabase Dashboard > Edge Functions > Deploy');
}

deployAll().catch(console.error);

