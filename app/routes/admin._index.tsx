import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Button } from "~/components/button";
import { Section } from "~/components/section";
import { getPosts } from "~/utils/fetch-mdx";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const posts = await getPosts(request);
    return json(posts);
  } catch (error) {
    throw error;
  }
}

export default function AdminIndexRoute() {
  const posts = useLoaderData<typeof loader>();
  return (
    <Section>
      <ul className="space-y-4">
        {posts?.length
          ? posts.map((post) => (
              <li key={post.frontmatter.slug} className="flex flex-wrap">
                <p>{post.frontmatter.title}</p>
                <Button>
                  {post.frontmatter.published ? "unpublish" : "publish"}
                </Button>
                <Button>delete</Button>
                <Button>delete</Button>
              </li>
            ))
          : null}
      </ul>
    </Section>
  );
}
