import { Bookmark } from "lucide-react";
import { Button } from "~/components/ui/button";

export function SubscriptionForm() {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Subscribe</h3>
        <Bookmark className="h-5 w-5 text-gray-400" />
      </div>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Get the latest articles and resources sent straight to your inbox.
      </p>
      <form className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
        <Button className="w-full">Subscribe</Button>
      </form>
    </div>
  );
}
