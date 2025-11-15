import { NotFoundError } from "@/infra/errors";
import { user } from "@/models/user";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
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
