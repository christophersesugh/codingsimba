import { requireUserId } from "../../utils/auth.server";
import type { Route } from "./+types/download-user-data";
import { prisma } from "~/utils/db.server";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      profile: true,
      password: false,
      roles: true,
      sessions: true,
      connections: true,
      notificationSettings: true,
      likes: true,
      comments: true,
      reviews: true,
      courseProgress: true,
      moduleProgress: true,
      enrollments: true,
      subscription: true,
      certificates: true,
      timeSpent: true,
    },
  });

  return { user };
}
