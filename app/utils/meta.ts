import type { MetaFunction } from "@remix-run/node";
import homeImage from "~/assets/home.webp";

interface Postdata {
  title: string;
  description: string;
  page?: string;
  photo: string;
  tags: string;
  slug?: string;
}

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const metaFn: MetaFunction = ({ matches, data }) => {
  const postPage = matches?.find((match) => match.id === "routes/blog.$slug");
  let pageTitle;

  if (matches) {
    matches.forEach((match) => {
      if (match.id !== "root" && match.pathname !== "/") {
        if (match.id !== "routes/blog.$slug") {
          pageTitle = `${match.pathname
            .replace(/\//g, "")
            .replace(/-/g, " ")} | Coding Simba`;
          if (match.id === "routes/blog._index") {
            pageTitle = "The Coding Simba's Blog";
          }
          if (match.id === "routes/about") {
            pageTitle = "About The Coding Simba";
          }

          if (match.id === "routes/contact") {
            pageTitle = "Get in touch with The Coding Simba";
          }
          if (match.id === "routes/discord") {
            pageTitle = "The Coding Simba Community on Discord";
          }
        }
      } else {
        pageTitle = "The Coding Simba";
      }
    });
  }

  type DataProps = {
    post: {
      data: Postdata;
    };
  };

  if (postPage) {
    if (data) {
      const post = (data as DataProps).post?.data;
      if (post) {
        return getPostMeta(post);
      }
    }
  }

  return getPostMeta({
    title: `${pageTitle}`,
    description:
      "Crafting exceptional software solutions for tomorrow's challenges.",
    photo: `https://codingsimba.com/${homeImage}`,
    tags: "coding, programming, web development, software development, remix-run, remix, reactjs, html, css, javascript, typescript",
  });
};

function getPostMeta(post: Postdata) {
  const title = capitalizeFirstLetter(post?.title);

  return [
    { title },
    { name: "description", content: post?.description },
    { name: "keywords", content: post?.tags },
    { property: "og:title", content: title },
    { property: "og:description", content: post?.description },
    { property: "og:keywords", content: post?.tags },
    { property: "og:image", content: post?.photo },
    { property: "og:image:alt", content: post?.title },
    {
      property: "og:url",
      content: `https://codingsimba.com/blog/${post?.slug}`,
    },
    { name: "twitter:title", content: title },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@codingsimba" },
    { name: "twitter:creator", content: "@codingsimba_" },
    { name: "twitter:description", content: post?.description },
    { name: "twitter:image", content: post?.photo },
  ];
}
