import { cn } from "~/lib/shadcn";

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
    <div
      aria-live="polite"
      aria-atomic="true"
      className={cn("font-mono text-sm text-red-500", className)}
    >
      {errorArray.map((error, index) => (
        <p key={index}>{error}</p>
      ))}
    </div>
  );
}
