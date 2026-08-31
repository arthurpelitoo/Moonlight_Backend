import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Função que garante que exista uma tabela cuja unica função é perguntar quantos
 * arquivos de migration foram rodados no banco
 *
 * (util para nao precisarmos ficar passando script sql um pro outro para se atualizar de mudanças)
 *
 * ao rodar npm run migrate ele lê a pasta database/migrations,
 * faz insert, alterações automaticamente com seu banco e registra
 * o ultimo arquivo que o script fez insert pro seu banco na tabela schema_migrations.
 */
async function migrate() {

  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename VARCHAR(255) PRIMARY KEY,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  const [applied] = await pool.query<any[]>('SELECT filename FROM schema_migrations');
  const appliedNames = new Set(applied.map(r => r.filename));

  const files = fs.readdirSync(path.join(__dirname, '../database/migrations')).sort();

  for (const file of files) {
    if (appliedNames.has(file)) continue;
    const sql = fs.readFileSync(path.join(__dirname, '../database/migrations', file), 'utf-8');
    console.log(`Aplicando ${file}...`);
    await pool.query(sql);
    await pool.query('INSERT INTO schema_migrations (filename) VALUES (?)', [file]);
  }

  console.log('Migrations em dia.');
  process.exit(0);
}

migrate();
