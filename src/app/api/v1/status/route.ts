import { database } from "@/infra/database";
import { InternalServerError } from "@/infra/errors";

export async function GET() {
  try {
    const updatedAt = new Date().toISOString();

    const databaseVersionResult = await database.query({
      text: "SHOW server_version;",
    });
    const databaseVersionValue = databaseVersionResult.rows[0].server_version;

    const databaseMaxConnectionsResult = await database.query({
      text: "SHOW max_connections;",
    });

    const databaseMaxConnectionsValue =
      databaseMaxConnectionsResult.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;

    const databaseOpenedConnectionsResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });

    const databaseOpenedConnectionsValue =
      databaseOpenedConnectionsResult.rows[0].count;

    return Response.json(
      {
        updated_at: updatedAt,
        dependencies: {
          database: {
            max_connections: parseInt(databaseMaxConnectionsValue),
            opened_connections: databaseOpenedConnectionsValue,
            version: databaseVersionValue,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.error("[status.GET]:", publicErrorObject);

    return Response.json(publicErrorObject, { status: 500 });
  }
}
