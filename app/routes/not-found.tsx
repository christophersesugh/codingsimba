import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Link, useNavigate } from "react-router";
import { navLinks } from "~/constants/navlinks";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 dark:bg-gray-950">
      <div className="w-full max-w-md text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mx-auto mb-8 h-48 w-48">
            {/* 404 animated text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl font-bold text-gray-200 dark:text-gray-800">
                404
              </div>
            </div>

            {/* Animated search icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <Search className="h-24 w-24 text-blue-600 dark:text-blue-500" />
                <motion.div
                  className="absolute left-1/2 top-1/2 h-32 w-32 rounded-full border-2 border-blue-600 dark:border-blue-500"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 1.5] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                  }}
                  style={{ x: "-50%", y: "-50%" }}
                />
              </div>
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            Page Not Found
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              className="flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="size-4" />
              Go Back
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              asChild
            >
              <Link to="/">
                <Home className="size-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Looking for something specific? Try navigating using the links
            below:
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {navLinks.map((link) => (
              <NavLink key={link.name} name={link.name} path={link.path} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function NavLink({ name, path }: { name: string; path: string }) {
  return (
    <Link
      to={path}
      className="capitalize text-blue-600 hover:underline dark:text-blue-400"
    >
      {name}
    </Link>
  );
}
