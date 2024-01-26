import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/server-runtime";
import { About, HomeHeader, RecentPosts } from "~/components/home";
import { getPosts } from "~/utils/blog.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const posts = await getPosts(request);
    return json({ posts });
  } catch (error) {
    return json({ error });
  }
}

export default function Index() {
  const loaderData = useLoaderData();
  return (
    <>
      <HomeHeader />
      <About />
      <RecentPosts loaderData={loaderData} />
    </>
  );
}
