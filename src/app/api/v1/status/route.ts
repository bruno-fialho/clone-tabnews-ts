import { NextResponse } from "next/server";

import database from "@/infra/database";

export async function GET() {
  const result = await database.query({
    text: "SELECT 1 + 1 as sum;",
  });
  console.log(result.rows);

  return NextResponse.json(
    { chave: "são acima da média" },
    { status: 200 }
  );
}
