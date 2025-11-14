import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { database } from "../infra/database";
import { Client } from "pg";

const defaultMigrationOptions = {
  dir: resolve(process.cwd(), "src", "infra", "migrations"),
  direction: "up" as const,
  dryRun: true,
  migrationsTable: "pgmigrations",
  verbose: true,
};

async function listPendingMigrations() {
  let dbClient: Client;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient: Client;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

export const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};
