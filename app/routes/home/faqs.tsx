import type { Route } from "./+types";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Await, useLoaderData } from "react-router";
import { Skeleton } from "~/components/ui/skeleton";
import { Markdown } from "~/components/mdx";

function FaqSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <Skeleton className="h-6 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function FAQSection() {
  const loaderData = useLoaderData() as Route.ComponentProps["loaderData"];

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqs = loaderData.faqs;

  return (
    <section className="relative overflow-hidden bg-gray-50 py-24 dark:bg-gray-900/50">
      <div className="absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions about our platform and services.
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <Suspense fallback={<FaqSkeleton />}>
            <Await
              resolve={faqs}
              errorElement={
                <p>Oh no! Something went wrong loading the FAQs.</p>
              }
            >
              {(resolvedFaqs) => {
                return (
                  <div className="space-y-4">
                    {resolvedFaqs.filter(Boolean).map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
                      >
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <span className="pr-4 font-medium text-gray-900 dark:text-gray-100">
                            {faq?.frontmatter.question}
                          </span>
                          {expandedIndex === index ? (
                            <ChevronUp className="h-5 w-5 flex-shrink-0 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-500" />
                          )}
                        </button>

                        {expandedIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200 dark:border-gray-800"
                          >
                            <div className="px-6">
                              <Markdown source={faq!.content} />
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </section>
  );
}
