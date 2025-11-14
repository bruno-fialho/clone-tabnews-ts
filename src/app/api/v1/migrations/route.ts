import { NextResponse } from "next/server";

import { migrator } from "@/models/migrator";

export async function GET() {
  try {
    const pendingMigrations = await migrator.listPendingMigrations();
    return NextResponse.json(pendingMigrations, { status: 200 });
  } catch (error) {
    console.error("[migrations GET]:", error);
    return NextResponse.json(
      { error: "Failed to retrieve migrations" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const migratedMigrations = await migrator.runPendingMigrations();

    const status = migratedMigrations.length > 0 ? 201 : 200;
    return NextResponse.json(migratedMigrations, { status });
  } catch (error) {
    console.error("[migrations POST]:", error);
    return NextResponse.json(
      { error: "Failed to run migrations" },
      { status: 500 },
    );
  }
}
