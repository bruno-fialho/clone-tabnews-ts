import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { chave: "são acima da média" },
    { status: 200 }
  );
}
