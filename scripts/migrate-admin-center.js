#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not defined in the environment variables');
  process.exit(1);
}

async function main() {
  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    await client.connect();
    console.log('Connected to the database');

    const migrationFilePath = path.join(
      __dirname,
      '../lib/db/migrations/admin-center-migration.sql',
    );
    const migrationScript = fs.readFileSync(migrationFilePath, 'utf8');

    console.log('Running admin center migration...');
    await client.query(migrationScript);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error executing migration:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
