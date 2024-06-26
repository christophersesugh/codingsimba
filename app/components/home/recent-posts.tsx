/* eslint-disable react/prop-types */
import { EmptyContentUI } from "../empty-content-ui";
import { BlogCard } from "../blog-card";
import { Container } from "../container";

type PostProps = {
  data: { [key: string]: string };
  content: string;
};

export function RecentPosts({ posts }: { posts: PostProps[] }) {
  return (
    <Container className="md:max-w-4xl">
      <div className="flex flex-col gap-6 mt-12">
        <h2 className="text-2xl font-bold">Recent posts</h2>
        {posts?.length ? (
          <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-20 justify-evenly mb-12">
            {posts.length &&
              posts.map((post: PostProps, index: number) => (
                <BlogCard post={post} key={`${post.data.slug}-${index}`} />
              ))}
          </div>
        ) : !posts?.length ? (
          <EmptyContentUI
            message="no recent posts found."
            className="!text-2xl !-mt-4"
          />
        ) : null}
      </div>
    </Container>
  );
}
