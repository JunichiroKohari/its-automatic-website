#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const requiredEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
};

const apiToken = requiredEnv('CLOUDFLARE_API_TOKEN');
const accountId = requiredEnv('CLOUDFLARE_ACCOUNT_ID');
const databaseId = requiredEnv('D1_DATABASE_ID');
const migrationFile = requiredEnv('D1_MIGRATION_FILE');

const sql = await readFile(resolve(migrationFile), 'utf8');
const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    authorization: `Bearer ${apiToken}`,
    'content-type': 'application/json',
  },
  body: JSON.stringify({ sql }),
});

const payload = await response.json().catch(() => ({}));
const failedResult = Array.isArray(payload.result)
  ? payload.result.find((result) => result && result.success === false)
  : null;

if (!response.ok || payload.success === false || failedResult) {
  const details = JSON.stringify(payload.errors || payload, null, 2);
  throw new Error(`D1 migration failed: ${details}`);
}

console.log(`Applied D1 migration ${migrationFile} to ${databaseId}.`);
