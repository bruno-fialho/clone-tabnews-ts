import { NextRequest, NextResponse } from "next/server";

import { user, UserInputValues } from "@/models/user";
import { NotFoundError, ValidationError } from "@/infra/errors";

export async function POST(request: NextRequest) {
  try {
    const userInputValues: UserInputValues = await request.json();
    const newUser = await user.create(userInputValues);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("[migrations POST]:", error);

    if (error instanceof ValidationError || error instanceof NotFoundError) {
      return NextResponse.json(error, { status: error.statusCode });
    }

    return NextResponse.json(
      { error: "Failed to run migrations" },
      { status: 500 },
    );
  }
}
