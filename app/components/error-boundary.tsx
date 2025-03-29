import type { ErrorResponse } from "react-router";
import {
  isRouteErrorResponse,
  useParams,
  useRouteError,
  useNavigate,
  Link,
} from "react-router";
import { getErrorMessage } from "~/utils/misc";
import { Button } from "./ui/button";
import { AlertOctagon, Home, RefreshCcw } from "lucide-react";

type StatusHandler = (info: {
  error: ErrorResponse;
  params: Record<string, string | undefined>;
}) => React.ReactElement | null;

export function GeneralErrorBoundary({
  defaultStatusHandler = ({ error }) => (
    <p>
      {error.status} | {error.data}
    </p>
  ),
  statusHandlers,
  unexpectedErrorHandler = (error) => <p>{getErrorMessage(error)}</p>,
}: {
  defaultStatusHandler?: StatusHandler;
  statusHandlers?: Record<number, StatusHandler>;
  unexpectedErrorHandler?: (error: unknown) => React.ReactElement | null;
}) {
  const error = useRouteError();
  const params = useParams();
  const navigate = useNavigate();

  if (typeof document !== "undefined") {
    console.error(error);
  }

  return (
    <div className="container mx-auto mt-8 flex h-full w-full max-w-3xl flex-col items-center justify-center rounded-md bg-red-100 p-20 text-xl text-red-600">
      <div className="relative mx-auto mb-8 h-12 w-32">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertOctagon className="size-12 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>
      <h1 className="mb-4 text-3xl font-bold md:text-3xl">Error!</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-600">
        We&apos;re sorry, but an error has occurred in the application.
      </p>
      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <Button className="flex items-center gap-2" onClick={() => navigate(0)}>
          <RefreshCcw className="size-4" />
          Reload Application
        </Button>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="size-4" />
            Try Homepage
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-col items-center border-t border-gray-600 pt-8 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          If the problem persists, please contact our support team.
        </p>
        <Link
          to={"mailto:support@codingsimba.com"}
          className="text-base text-gray-500 dark:text-gray-500"
        >
          support@codingsimba.com
        </Link>
      </div>
      <div className="mt-8 rounded-lg bg-gray-100 p-4 text-left dark:bg-gray-100">
        {isRouteErrorResponse(error) ? (
          <div className="overflow-x-auto font-mono text-sm text-red-600 dark:text-red-400">
            {(statusHandlers?.[error.status] ?? defaultStatusHandler)({
              error,
              params,
            })}
          </div>
        ) : (
          <>
            <h3 className="mb-2 text-sm font-medium">
              Error Details (Development Only):
            </h3>
            <div className="overflow-x-auto font-mono text-sm text-red-600 dark:text-red-400">
              {unexpectedErrorHandler(error)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
