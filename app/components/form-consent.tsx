import { Link } from "react-router";

export function FormConsent({ type }: { type: "signup" | "signin" }) {
  return (
    <p className="-my-1 text-xs">
      By signing {type === "signup" ? "up" : "in"}, you agree to our{" "}
      <Link to={"/terms"} className="text-blue-700 dark:text-blue-500">
        Terms of Service
      </Link>{" "}
      and{" "}
      <Link to={"/privacy"} className="text-blue-700 dark:text-blue-500">
        Privacy Policy
      </Link>
      .
    </p>
  );
}
