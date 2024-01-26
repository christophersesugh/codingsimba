import React from "react";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs, json } from "@remix-run/server-runtime";
import { About, HomeHeader, RecentPosts } from "~/components/home";
import { getPosts } from "~/utils/blog.server";
import { FaSpinner } from "react-icons/fa";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const posts = await getPosts(request);
    return json({ posts }, 200);
  } catch (error) {
    return json({ error }, 500);
  }
}

export default function Index() {
  const loaderData = useLoaderData();
  return (
    <>
      <HomeHeader />
      <About />
      <React.Suspense
        fallback={
          <div className="w-full max-3xl">
            <FaSpinner className="animate-spin text-3xl mx-auto" />
          </div>
        }
      >
        <RecentPosts loaderData={loaderData} />
      </React.Suspense>
    </>
  );
}
