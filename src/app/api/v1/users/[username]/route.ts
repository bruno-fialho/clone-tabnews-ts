import { NotFoundError, ValidationError } from "@/infra/errors";
import { user } from "@/models/user";

export async function GET(
  _req: Request,
  { params }: { params: { username: string } },
) {
  try {
    const { username } = params;
    const userFound = await user.findOneByUsername(username);
    return Response.json(userFound, { status: 200 });
  } catch (error) {
    console.error("[users GET]:", error);

    if (error instanceof NotFoundError) {
      return Response.json(error, { status: error.statusCode });
    }

    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { username: string } },
) {
  try {
    const { username } = params;
    const userInputValues = await req.json();

    const updatedUser = await user.update(username, userInputValues);
    return Response.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("[users PATCH]:", error);

    if (error instanceof NotFoundError) {
      return Response.json(error, { status: error.statusCode });
    }

    if (error instanceof ValidationError) {
      return Response.json(error, { status: error.statusCode });
    }

    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}
