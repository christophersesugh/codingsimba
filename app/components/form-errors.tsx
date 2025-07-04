import { cn } from "~/utils/misc";

interface FormErrorProps {
  /**
   * The error message(s) to display - can be string or string array
   */
  errors?: string | string[];
  /**
   * Additional class names
   * @default "text-sm text-red-500"
   */
  className?: string;
}

/**
 * Displays form validation errors in the same style as your existing implementation
 * with added accessibility and type safety.
 */
export function FormError({ errors, className }: FormErrorProps) {
  if (!errors) return null;

  // Normalize to array if single string
  const errorArray = typeof errors === "string" ? [errors] : errors;

  return (
    <ul
      aria-live="polite"
      aria-atomic="true"
      role="alert"
      className={cn(
        "mt-1.5 space-y-1 font-mono text-sm text-red-500",
        className,
      )}
    >
      {errorArray.map((error, index) => (
        <li key={index} className="flex items-start gap-1.5">
          <span className="mt-0.5" aria-hidden="true">
            •
          </span>
          {error}
        </li>
      ))}
    </ul>
  );
}
