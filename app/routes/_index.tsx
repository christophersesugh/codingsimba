import { useLoaderData } from "@remix-run/react";
import { motion } from "framer-motion";
import { LoaderFunctionArgs, json } from "@remix-run/server-runtime";
import { About, HomeHeader, RecentPosts } from "~/components/home";
import { getPosts } from "~/utils/blog.server";
import { containerVariants } from "~/animation-config";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const port1 = request.headers.get("x-forwarded-port");
    const port2 = new URL(request.url).port;

    console.log(port1, port2);

    const posts = await getPosts(request);
    return json({ posts }, 200);
  } catch (error) {
    throw new Error("Failed to load posts");
  }
}

export default function Index() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <HomeHeader />
      <About />
      <RecentPosts posts={posts} />
    </motion.div>
  );
}
