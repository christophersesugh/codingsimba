import React from "react";
import type { Route } from "../+types/article";
import { Check, Copy, Linkedin, Twitter } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";

export function Share() {
  const loaderData = useLoaderData() as Route.ComponentProps["loaderData"];
  const [copied, setCopied] = React.useState(false);

  const article = loaderData.article;
  const shareText = article.title;

  const shareUrl = `https://codingsimba.com/articles/${article.slug}`;
  const shareHashtags = article.tags
    .map((tag) => tag.slug)
    .join(",")
    .replace(/-/g, "_");

  const shareViaTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText,
  )}&url=${encodeURIComponent(shareUrl)}&hashtags=${encodeURIComponent(
    shareHashtags,
  )}&via=codingsimba_`;

  const shareViaLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl,
  )}&title=${encodeURIComponent(shareText)}`;

  function copyToClipboard() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
      });
    }

    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => {
      window.clearTimeout(timeout);
    };
  }

  return (
    <section className="mb-8 border-t border-b border-gray-200 py-6 dark:border-gray-800">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="font-medium">Share this article</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            asChild
          >
            <Link to={shareViaTwitter} target="_blank">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            asChild
          >
            <Link to={shareViaLinkedIn} target="_blank">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Share on LinkedIn</span>
            </Link>
          </Button>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            {copied ? (
              <Check className="h-4 w-4 font-bold text-blue-500" />
            ) : (
              <Copy className="size-4" />
            )}
            <span className="sr-only">Copy link</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
