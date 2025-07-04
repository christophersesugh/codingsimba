import { requireUserId } from "../../utils/auth.server";
import type { Route } from "./+types/download-user-data";
import { prisma } from "~/utils/db.server";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      teams: true,
      teamInvites: true,
      teamMembers: true,
      image: true,
      password: false,
      roles: true,
      sessions: true,
      connections: true,
      notificationSettings: true,
      likes: true,
      comments: true,
      reviews: true,
      courses: true,
      modules: true,
      subModules: true,
      enrollments: true,
      subscription: true,
      certificates: true,
      timeSpent: true,
    },
  });

  return { user };
}
