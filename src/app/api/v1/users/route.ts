import { NotFoundError, ValidationError } from "@/infra/errors";
import { user, UserInputValues } from "@/models/user";

export async function POST(req: Request) {
  try {
    const userInputValues: UserInputValues = await req.json();
    const newUser = await user.create(userInputValues);
    return Response.json(newUser, { status: 201 });
  } catch (error) {
    console.error("[migrations POST]:", error);

    if (error instanceof ValidationError || error instanceof NotFoundError) {
      return Response.json(error, { status: error.statusCode });
    }

    return Response.json(
      { error: "Failed to run migrations" },
      { status: 500 },
    );
  }
}
