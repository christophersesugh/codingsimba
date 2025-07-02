import { useState, Suspense } from "react";
import { readMdxDirectory } from "~/utils/misc.server";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { generateMetadata } from "~/utils/meta";
import { Header } from "~/components/page-header";
import { Skeleton } from "~/components/ui/skeleton";
import { Markdown } from "~/components/mdx";
import { Await, useLoaderData } from "react-router";
import { DiscordSupport } from "~/components/discord-support";

interface FAQData {
  frontmatter: {
    question: string;
  };
  content: string;
}

export async function loader() {
  const faqs = readMdxDirectory("faqs");
  return { faqs };
}

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

function FAQSection() {
  const loaderData = useLoaderData() as { faqs: Promise<FAQData[]> };
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqs = loaderData.faqs;

  return (
    <div className="space-y-6" id="faqs">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Suspense fallback={<FaqSkeleton />}>
        <Await
          resolve={faqs}
          errorElement={
            <p className="text-center text-gray-600 dark:text-gray-300">
              Oh no! Something went wrong loading the FAQs.
            </p>
          }
        >
          {(resolvedFaqs) => {
            const filteredFaqs = resolvedFaqs.filter(Boolean).filter((faq) => {
              const question = faq?.frontmatter.question || "";
              const content = faq?.content || "";
              return (
                question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                content.toLowerCase().includes(searchTerm.toLowerCase())
              );
            });

            return (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
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
                        <div className="px-6 pb-6">
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
  );
}

export default function SupportPage() {
  return (
    <>
      {generateMetadata({
        title: "Support - Get Help When You Need It",
        description:
          "Get help with your account, courses, billing, and more. Our support team is here to assist you 24/7.",
      })}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header
          title="How Can We Help?"
          description="Get the support you need to make the most of your learning journey"
        />

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <MessageCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle>Live Chat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                      Chat with our support team in real-time for immediate
                      assistance
                    </p>
                    <Badge variant="secondary" className="mb-4">
                      <Clock className="mr-1 h-3 w-3" />
                      Available 24/7
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle>Email Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                      Send us a detailed message and we&apos;ll get back to you
                      within 24 hours
                    </p>
                    <Button variant="outline" className="w-full">
                      Send Email
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle>Phone Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600 dark:text-gray-300">
                      Call us directly for urgent issues (Enterprise customers
                      only)
                    </p>
                    <Badge variant="secondary">Enterprise Only</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <DiscordSupport
              showStats={true}
              stats={{
                memberCount: 1200,
                onlineCount: 150,
                channelCount: 25,
                responseTime: "< 5 minutes",
              }}
            />
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-12 max-w-4xl"
            >
              <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Find quick answers to common questions
              </p>
            </motion.div>

            <div className="mx-auto max-w-4xl">
              <FAQSection />
            </div>
          </div>
        </section>

        <section className="bg-white py-16 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-2xl"
            >
              <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
                Still Need Help?
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="mb-4 text-xl font-semibold">
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <span>support@codingsimba.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <span>24/7 Support Available</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MessageCircle className="h-5 w-5 text-gray-500" />
                          <span>Live Chat (For Authenticated Users)</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-4 text-xl font-semibold">
                        Response Times
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Live Chat:</span>
                          <Badge variant="secondary">Instant</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Email Support:</span>
                          <Badge variant="secondary">Within 24h</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Phone Support:</span>
                          <Badge variant="secondary">Enterprise Only</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
