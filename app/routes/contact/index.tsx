import type { Route } from "../contact/+types";
import { StatusCodes } from "http-status-codes";
import { ContactForm } from "~/components/contact/form";
import { ContactInformation } from "~/components/contact/information";
import { Markdown } from "~/components/mdx";
import { Header } from "~/components/page-header";
import { generateMetadata } from "~/utils/meta";
import { invariantResponse } from "~/utils/misc";
import { readMdxDirectory } from "~/utils/misc.server";

export async function loader() {
  const files = await readMdxDirectory("contact/faqs");
  invariantResponse(files.length, "No files found", {
    status: StatusCodes.NOT_FOUND,
  });
  return { faqs: files };
}

export default function ContactPage({ loaderData }: Route.ComponentProps) {
  const title = "Get in Touch";
  const metadata = generateMetadata({ title });
  return (
    <>
      {metadata}
      <Header
        title={title}
        description="Have a question or want to work together? I'd love to hear from you."
      />

      <div className="container mx-auto max-w-6xl px-4 py-12">
        <section className="grid items-start gap-12 md:grid-cols-2">
          <ContactInformation />
          <ContactForm />
        </section>
        <section className="mt-24" id="faqs">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
              Find answers to common questions about courses, platform, and
              services.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {loaderData.faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="mb-3 text-xl font-bold">
                  {faq!.frontmatter.question}
                </h3>
                <div className="-my-6">
                  <Markdown source={faq!.content} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
