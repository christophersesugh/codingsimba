import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { generateMetadata } from "~/utils/meta";

export default function ContactSuccess() {
  const title = "Message Sent!";
  const description =
    "Thank you for reaching out. I'll get back to you as soon as possible.";
  const metadata = generateMetadata({ title, description });
  return (
    <>
      {metadata}
      <div className="container mx-auto min-h-screen max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-24 rounded-xl border border-slate-300 bg-white p-8 text-center dark:border-slate-600 dark:bg-slate-900"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold">{title}</h3>
          <p className="text-muted-foreground mb-6">{description}</p>
          <Button variant="outline">
            <Link to={"/contact"}>Back to contact page</Link>
          </Button>
        </motion.div>
      </div>
    </>
  );
}
