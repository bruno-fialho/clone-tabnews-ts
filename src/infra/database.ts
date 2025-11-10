import { Client, QueryConfig } from "pg";

function getSSLValues() {
  // If there is a POSTGRES_CA (Certificate Authority) env var, use it for SSL configuration
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test";
}

async function query(queryObject: QueryConfig) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  
  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("[database.query]  error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query: query,
};
