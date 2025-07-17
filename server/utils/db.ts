import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

console.log("pool",pool);
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  const text = strings.reduce((acc, str, i) => acc + str + (i < values.length ? `$${i + 1}` : ''), '');
  return pool.query(text, values).then(res => res.rows);
};
