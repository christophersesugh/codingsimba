import homeImage from "~/assets/home.webp";
type MetaDataParams = {
  data?: any;
  matches?: any;
  error?: any;
  title?: string;
  url?: string;
  // Add other properties as needed
};

type MetaTag = {
  title?: string;
  name?: string;
  property?: string;
  content: string;
};

export function metaData({
  data,
  matches,
  error,
  title,
  url,
  ...mData
}: MetaDataParams): MetaTag[] {
  const postPage = matches?.find((match) => match.id === "routes/blog.$slug");
  const post = postPage?.data.data.post;

  const result: MetaTag[] = [
    {
      content: postPage
        ? post.title
        : error
        ? "An error occurred"
        : `Coding Simba | ${mData?.title}`,
    },
    {
      name: "description",
      content: postPage
        ? post.description
        : error
        ? error.message
          ? error.message
          : "Unknown error"
        : "Helping change the world through building quality software.",
    },
    {
      property: "og:title",
      content: postPage ? post.title : `Coding Simba | ${mData?.title}`,
    },
    {
      property: "og:description",
      content: postPage
        ? post.description
        : "Helping change the world through building quality software.",
    },
    {
      property: "og:url",
      content: postPage
        ? `https://codingsimba.com/blog/${post.slug}`
        : `https://codingsimba.com/${mData?.url ?? ""}`,
    },
    {
      property: "og:image",
      content: postPage ? post.photo : `https://codingsimba.com/${homeImage}`,
    },
    {
      property: "og:type",
      content: postPage ? "article" : "website",
    },
  ];

  return result.filter((tag) => tag.content !== undefined);
}
