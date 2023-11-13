import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { response } from "~/utils/response.server";
import { HomeHeader, About, RecentPosts } from "~/components/home";
import { getPosts } from "~/utils/fetch-mdx";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const posts = await getPosts(request);
    return json(response({ data: { posts } }));
  } catch (error) {
    return json(response({ error, ok: false }));
  }
}
export default function Index() {
  const loaderData = useLoaderData();
  return (
    <main>
      <HomeHeader />
      <About />
      <RecentPosts loaderData={loaderData} />
    </main>
  );
}
