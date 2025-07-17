import { sql } from '~/server/utils/db';
export default defineEventHandler(async () => {
  const result = await sql`SELECT NOW()`;
  return result;
});