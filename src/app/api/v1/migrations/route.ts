import { NextResponse } from "next/server";
import migrationsRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { Client } from "pg";

import { database } from "@/infra/database";

function getDefaultMigrationOptions(dbClient: Client) {
  return {
    dbClient: dbClient,
    dir: resolve(process.cwd(), "src", "infra", "migrations"),
    direction: "up" as const,
    dryRun: true,
    migrationsTable: "pgmigrations",
    verbose: true,
  };
}

export async function GET() {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = getDefaultMigrationOptions(dbClient);

  try {
    const pendingMigrations = await migrationsRunner(defaultMigrationOptions);
    return NextResponse.json(pendingMigrations, { status: 200 });
  } catch (error) {
    console.error("[migrations GET]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve migrations" },
      { status: 500 },
    );
  } finally {
    await dbClient.end();
  }
}

export async function POST() {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = getDefaultMigrationOptions(dbClient);

  try {
    const migratedMigrations = await migrationsRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    const status = migratedMigrations.length > 0 ? 201 : 200;
    return NextResponse.json(migratedMigrations, { status });
  } catch (error) {
    console.error("[migrations POST]:", error);
    return NextResponse.json(
      { error: "Failed to run migrations" },
      { status: 500 },
    );
  } finally {
    await dbClient.end();
  }
}
