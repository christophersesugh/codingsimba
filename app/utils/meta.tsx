import { slogan } from "~/constants/navlinks";
import { getImgSrc } from "./misc";

interface MetadataProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  keywords?: string;
}

export function generateMetadata({
  title = "Coding Simba",
  description = slogan,
  url = "https://codingsimba.com",
  image = getImgSrc({ path: "assets", fileKey: "icon.png" }),
  imageAlt = "Coding Simba",
  type = "website",
  keywords,
}: MetadataProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Christopher S. Aondona (The Coding Simba)" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={`https://codingsimba.com/${url}`} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@codingsimba_" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  );
}
