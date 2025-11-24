#!/usr/bin/env node
/**
 * Run database migration directly using PostgreSQL connection
 * Usage: node scripts/run-migration.js
 * Requires: POSTGRES_URL_NON_POOLING in .env.local
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';

const { Client } = pg;

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

const POSTGRES_URL = env.POSTGRES_URL_NON_POOLING || env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error('❌ POSTGRES_URL_NON_POOLING or POSTGRES_URL not found in .env.local');
  process.exit(1);
}

const migrationFile = join(__dirname, '../supabase/migrations/20251124110000_add_ipay_support.sql');
const sql = readFileSync(migrationFile, 'utf-8');

async function runMigration() {
  const client = new Client({
    connectionString: POSTGRES_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected');

    console.log('📝 Running migration...');
    await client.query(sql);
    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.code === '42710') {
      console.log('ℹ️  Some objects already exist (this is OK)');
    } else {
      process.exit(1);
    }
  } finally {
    await client.end();
  }
}

runMigration();

