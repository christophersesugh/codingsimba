import { useEffect, useState } from "react";

/**
 * A hook that detects if the current viewport is mobile based on a breakpoint.
 * Uses window resize events to update the state and includes proper cleanup.
 *
 * @param {number} breakpoint - The width in pixels below which the viewport is considered mobile
 * @returns {boolean} True if the viewport width is less than the breakpoint
 *
 * @example
 * ```tsx
 * // Basic usage with default breakpoint (768px)
 * const isMobile = useMobile();
 *
 * // Custom breakpoint
 * const isTablet = useMobile(1024);
 *
 * // Usage in a component
 * function ResponsiveComponent() {
 *   const isMobile = useMobile();
 *
 *   return (
 *     <div>
 *       {isMobile ? (
 *         <MobileLayout />
 *       ) : (
 *         <DesktopLayout />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === "undefined") return;

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize with debounce
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIfMobile, 100);
    };

    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [breakpoint]);

  return isMobile;
}
