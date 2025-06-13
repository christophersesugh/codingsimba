import { useFormAction, useNavigation } from "react-router";
import { type ClassValue, clsx } from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSpinDelay } from "spin-delay";
import { twMerge } from "tailwind-merge";

/**
 * Extracts a readable error message from various error types.
 * Handles string errors, Error objects, and unknown error types.
 *
 * @param error - The error to extract message from
 * @returns A string containing the error message
 * @throws Will log to console if error type is unknown
 *
 * @example
 * ```ts
 * const error = new Error("Something went wrong");
 * const message = getErrorMessage(error); // "Something went wrong"
 *
 * const stringError = "Invalid input";
 * const message2 = getErrorMessage(stringError); // "Invalid input"
 * ```
 */
export function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  console.error("Unable to get error message for error", error);
  return "Unknown Error";
}

/**
 * Combines multiple class names and merges Tailwind CSS classes efficiently.
 * Uses clsx for conditional classes and tailwind-merge for deduplication.
 *
 * @param inputs - Class names to combine (strings, objects, arrays)
 * @returns A single string of combined and deduplicated class names
 *
 * @example
 * ```ts
 * const classes = cn(
 *   "base-class",
 *   { "conditional-class": true },
 *   ["array-class"],
 *   "tailwind-class"
 * );
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Throws a Response with 400 status if condition is false.
 * Useful for validating request parameters and throwing HTTP errors.
 *
 * @param condition - The condition to check
 * @param message - Error message or function returning message
 * @param responseInit - Additional response options
 * @throws {Response} 400 status response if condition is false
 *
 * @example
 * ```ts
 * invariantResponse(
 *   typeof id === 'string',
 *   'ID must be a string',
 *   { headers: { 'Content-Type': 'application/json' } }
 * );
 * ```
 */
export function invariantResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: any,
  message?: string | (() => string),
  responseInit?: ResponseInit,
): asserts condition {
  if (!condition) {
    throw new Response(
      typeof message === "function"
        ? message()
        : message ||
          "An invariant failed, please provide a message to explain why.",
      { status: 400, ...responseInit },
    );
  }
}

/**
 * Throws an Error if condition is false.
 * Similar to invariantResponse but throws Error instead of Response.
 *
 * @param condition - The condition to check
 * @param message - Error message or function returning message
 * @throws {Error} If condition is false
 *
 * @example
 * ```ts
 * invariant(
 *   typeof value === 'string',
 *   'Value must be a string'
 * );
 * ```
 */
export function invariant(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: any,
  message: string | (() => string),
): asserts condition {
  if (!condition) {
    throw new Error(typeof message === "function" ? message() : message);
  }
}

/**
 * Determines if a form is currently being submitted.
 * Uses React Router's navigation state to check form submission status.
 *
 * @param options - Configuration options
 * @param options.formAction - Specific form action to check (defaults to current route)
 * @param options.formMethod - HTTP method to check (defaults to 'POST')
 * @param options.state - Navigation state to check (defaults to 'non-idle')
 * @returns boolean indicating if form is being submitted
 *
 * @example
 * ```ts
 * const isSubmitting = useIsPending({
 *   formMethod: 'POST',
 *   state: 'submitting'
 * });
 * ```
 */
export function useIsPending({
  formAction,
  formMethod = "POST",
  state = "non-idle",
}: {
  formAction?: string;
  formMethod?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
  state?: "submitting" | "loading" | "non-idle";
} = {}) {
  const contextualFormAction = useFormAction();
  const navigation = useNavigation();
  const isPendingState =
    state === "non-idle"
      ? navigation.state !== "idle"
      : navigation.state === state;
  return (
    isPendingState &&
    navigation.formAction === (formAction ?? contextualFormAction) &&
    navigation.formMethod === formMethod
  );
}

/**
 * Combines useSpinDelay with useIsPending to prevent loading state flicker.
 * Ensures loading spinner shows for minimum duration even if request completes quickly.
 *
 * @param options - Configuration options
 * @param options.delay - Delay before showing spinner (default: 400ms)
 * @param options.minDuration - Minimum spinner display time (default: 300ms)
 * @returns boolean indicating if loading state should be shown
 *
 * @example
 * ```ts
 * const showSpinner = useDelayedIsPending({
 *   delay: 500,
 *   minDuration: 400
 * });
 * ```
 */
export function useDelayedIsPending({
  formAction,
  formMethod,
  delay = 400,
  minDuration = 300,
}: Parameters<typeof useIsPending>[0] &
  Parameters<typeof useSpinDelay>[1] = {}) {
  const isPending = useIsPending({ formAction, formMethod });
  const delayedIsPending = useSpinDelay(isPending, {
    delay,
    minDuration,
  });
  return delayedIsPending;
}

/**
 * Creates a debounced version of a function.
 * Prevents function from being called too frequently.
 *
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 *
 * @example
 * ```ts
 * const debouncedSearch = debounce((query) => {
 *   searchAPI(query);
 * }, 300);
 * ```
 */
function debounce<Callback extends (...args: Parameters<Callback>) => void>(
  fn: Callback,
  delay: number,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<Callback>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Calls all provided functions with the same arguments.
 * Useful for combining multiple event handlers.
 *
 * @param fns - Array of functions to call
 * @returns Function that calls all provided functions
 *
 * @example
 * ```ts
 * const combinedHandler = callAll(
 *   onBlur,
 *   props.onBlur,
 *   () => console.log('blurred')
 * );
 * ```
 */
function callAll<Args extends Array<unknown>>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach((fn) => fn?.(...args));
}

/**
 * Creates a debounced function that persists across renders.
 * Uses useRef to maintain the debounced function instance.
 *
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function that persists across renders
 *
 * @example
 * ```ts
 * const debouncedSearch = useDebounce((query) => {
 *   searchAPI(query);
 * }, 300);
 * ```
 */
export function useDebounce<
  Callback extends (...args: Parameters<Callback>) => ReturnType<Callback>,
>(callback: Callback, delay: number) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return useMemo(
    () =>
      debounce(
        (...args: Parameters<Callback>) => callbackRef.current(...args),
        delay,
      ),
    [delay],
  );
}

/**
 * Combines multiple Headers objects into a single Headers instance.
 * Useful for merging headers from different sources.
 *
 * @param headers - Array of Headers objects to combine
 * @returns Combined Headers object
 *
 * @example
 * ```ts
 * const headers = combineHeaders(
 *   new Headers({ 'Content-Type': 'application/json' }),
 *   new Headers({ 'Authorization': 'Bearer token' })
 * );
 * ```
 */
export function combineHeaders(
  ...headers: Array<ResponseInit["headers"] | null>
) {
  const combined = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
      combined.append(key, value);
    }
  }
  return combined;
}

/**
 * Combines multiple ResponseInit objects into a single configuration.
 * Merges headers and other response options.
 *
 * @param responseInits - Array of ResponseInit objects to combine
 * @returns Combined ResponseInit object
 *
 * @example
 * ```ts
 * const responseInit = combineResponseInits(
 *   { status: 200 },
 *   { headers: { 'Content-Type': 'application/json' } }
 * );
 * ```
 */
export function combineResponseInits(
  ...responseInits: Array<ResponseInit | undefined>
) {
  let combined: ResponseInit = {};
  for (const responseInit of responseInits) {
    combined = {
      ...responseInit,
      headers: combineHeaders(combined.headers, responseInit?.headers),
    };
  }
  return combined;
}

/**
 * Hook for implementing double-click confirmation on buttons.
 * First click sets doubleCheck state, second click triggers action.
 *
 * @returns Object containing doubleCheck state and button props
 * @returns {boolean} doubleCheck - Whether button is in confirmation state
 * @returns {function} getButtonProps - Function to get button props
 *
 * @example
 * ```ts
 * const { doubleCheck, getButtonProps } = useDoubleCheck();
 * return (
 *   <button {...getButtonProps({ onClick: handleDelete })}>
 *     {doubleCheck ? "Are you sure?" : "Delete"}
 *   </button>
 * );
 * ```
 */
export function useDoubleCheck() {
  const [doubleCheck, setDoubleCheck] = useState(false);

  function getButtonProps(
    props?: React.ButtonHTMLAttributes<HTMLButtonElement>,
  ) {
    const onBlur: React.ButtonHTMLAttributes<HTMLButtonElement>["onBlur"] =
      () => setDoubleCheck(false);

    const onClick: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"] =
      doubleCheck
        ? undefined
        : (e) => {
            e.preventDefault();
            setDoubleCheck(true);
          };

    const onKeyUp: React.ButtonHTMLAttributes<HTMLButtonElement>["onKeyUp"] = (
      e,
    ) => {
      if (e.key === "Escape") {
        setDoubleCheck(false);
      }
    };

    return {
      ...props,
      onBlur: callAll(onBlur, props?.onBlur),
      onClick: callAll(onClick, props?.onClick),
      onKeyUp: callAll(onKeyUp, props?.onKeyUp),
    };
  }

  return { doubleCheck, getButtonProps };
}

/**
 * Extracts the domain URL from a Request object.
 * Handles both development and production environments.
 *
 * @param request - Request object to extract domain from
 * @returns Full domain URL including protocol
 * @throws {Error} If host cannot be determined
 *
 * @example
 * ```ts
 * const domainUrl = getDomainUrl(request);
 * // Returns "https://example.com" or "http://localhost:3000"
 * ```
 */
export function getDomainUrl(request: Request) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol =
    host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
  return `${protocol}://${host}`;
}

/**
 * Extracts the referrer route from a Request object.
 * Returns the path portion of the referrer URL if it matches the current domain.
 *
 * @param request - Request object to extract referrer from
 * @returns Referrer route path or "/" if referrer is from different domain
 *
 * @example
 * ```ts
 * const referrerRoute = getReferrerRoute(request);
 * // Returns "/dashboard" or "/" if referrer is from different domain
 * ```
 */
export function getReferrerRoute(request: Request) {
  // spelling errors and whatever makes this annoyingly inconsistent
  // in my own testing, `referer` returned the right value, but 🤷‍♂️
  const referrer =
    request.headers.get("referer") ??
    request.headers.get("referrer") ??
    request.referrer;
  const domain = getDomainUrl(request);
  if (referrer?.startsWith(domain)) {
    return referrer.slice(domain.length);
  } else {
    return "/";
  }
}

/**
 * Generates initials from a person's name.
 * Handles various name formats and edge cases.
 *
 * @param name - The full name to generate initials from
 * @returns A string containing the initials (e.g., "JD" for "John Doe")
 *
 * @example
 * ```ts
 * const initials = getInitials("John Doe"); // "JD"
 * const singleName = getInitials("John"); // "J"
 * const withMiddle = getInitials("John A. Doe"); // "JD"
 * ```
 */
export function getInitials(name: string): string {
  if (!name || typeof name !== "string") return "";

  const words = name
    .split(/\s+/)
    .filter(
      (word) => word.length > 0 && !(word.length === 2 && word.endsWith(".")),
    );

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  const firstInitial = words[0].charAt(0).toUpperCase();
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

/**
 * Capitalizes each word in a name string.
 * Handles multiple spaces and preserves existing capitalization patterns.
 *
 * @param name - The name string to capitalize
 * @returns The capitalized name string
 *
 * @example
 * ```ts
 * const name = capitalizeName("john doe"); // "John Doe"
 * const complex = capitalizeName("mary-jane O'connor"); // "Mary-Jane O'Connor"
 * ```
 */
export function capitalizeName(name: string) {
  return name
    .trim()
    .replace(
      /\b\w+/g,
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    );
}

/**
 * Formats a number of seconds into a time string with hours, minutes, and seconds.
 * Returns HH:MM:SS format if hours are present, otherwise MM:SS format.
 * Pads minutes and seconds with leading zeros for consistent formatting.
 *
 * @param seconds - The number of seconds to format
 * @returns A string in the format "HH:MM:SS" or "MM:SS"
 *
 * @example
 * ```ts
 * formatTime(3665) // "1:01:05"
 * formatTime(65)   // "1:05"
 * formatTime(5)    // "0:05"
 * ```
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const remainingSecondsAfterHours = seconds % 3600;
  const mins = Math.floor(remainingSecondsAfterHours / 60);
  const secs = remainingSecondsAfterHours % 60;

  return hours > 0
    ? `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    : `${mins}:${secs.toString().padStart(2, "0")}`;
}
