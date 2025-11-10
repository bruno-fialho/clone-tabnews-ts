import { Client, QueryConfig } from "pg";

async function query(queryObject: QueryConfig) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  
  await client.connect();
  
  try {
    const result = await client.query(queryObject);
    
    return result;
  } catch (error) {
    console.error("[database.query]  error:", error);
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};
