// tools/seed.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  const sql = fs.readFileSync(path.join(__dirname, '../database/seeds/dev_sample_data.sql'), 'utf-8');
  await pool.query(sql);
  console.log('Seed de desenvolvimento aplicado.');
  process.exit(0);
}

seed();
