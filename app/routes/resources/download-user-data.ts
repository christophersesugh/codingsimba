import { requireUserId } from "~/utils/auth.server";
import type { Route } from "./+types/download-user-data";
import { prisma } from "~/utils/db.server";

//To be completed later

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      profile: true,

      password: false, // <-- intentionally omit password
    },
  });

  return { user };
}
