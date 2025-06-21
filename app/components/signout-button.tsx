import { LogOut } from "lucide-react";
import { Form } from "react-router";

export function SignoutButton({ onClick }: { onClick?: () => void }) {
  return (
    <Form
      method="post"
      action="/signout"
      className="px-2 font-bold text-red-600 dark:text-red-500"
      onSubmit={onClick}
    >
      <button type="submit" className="flex items-center">
        <LogOut className="mr-2 size-4 font-bold text-red-600 dark:text-red-500" />
        Sign Out
      </button>
    </Form>
  );
}
