import type { Route } from "../+types/index";
import { z } from "zod";
import { AlertTriangle, Download, Users } from "lucide-react";
import { useFetcher, useLoaderData } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";

export const SIGNOUT_SESSIONS_INTENT = "signout-other-sessions";
export const DELETE_USER_INTENT = "delete-user";

export const SessionSchema = z.object({ userId: z.string() });
export const DeleteUserSchema = z.object({ userId: z.string() });

export function DataAndSecurity() {
  const fetcher = useFetcher();
  const loaderData = useLoaderData() as Route.ComponentProps["loaderData"];

  const user = loaderData.user;
  const otherSessionsCount = user._count.sessions - 1;

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-200 p-6 dark:border-gray-800">
        <h2 className="text-xl font-bold">Data & Security</h2>
      </div>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
          <div>
            <h3 className="mb-1 text-lg font-medium">Download Your Data</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Get a copy of all your data stored in your account
            </p>
          </div>
          <a href="/download-user-data" download={"codingsimba-data.json"}>
            <Button variant="outline">
              <Download className="mr-2 size-4" />
              Download
            </Button>
          </a>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
          <div>
            <h3 className="mb-1 text-lg font-medium">Active Sessions</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {otherSessionsCount
                ? "Sign out from all other devices where you're logged in"
                : "This is your only session"}
            </p>
          </div>
          {otherSessionsCount ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <Users className="mr-2 size-4" />
                  Sign Out {otherSessionsCount} Other Sessions
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Sign out from other devices?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will sign you out from all other devices where
                    you&apos;re currently logged in. You&apos;ll remain signed
                    in on this device. This is useful if you&apos;ve forgotten
                    to sign out on another device or if you suspect unauthorized
                    access.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      fetcher.submit(
                        { intent: SIGNOUT_SESSIONS_INTENT, userId: user.id },
                        { method: "post" },
                      )
                    }
                  >
                    Yes
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </div>

        <div className="pt-4">
          <h3 className="mb-1 text-lg font-medium text-red-500 dark:text-red-400">
            Danger Zone
          </h3>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Once you delete your account, there is no going back. This action
            cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={"outline"}
                className="border-red-300 text-red-500 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <AlertTriangle className="mr-2 size-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete your account?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. All your data including your
                  profile, courses, certificates, and subscription information
                  will be permanently deleted. You will lose access to all
                  purchased content and will need to create a new account if you
                  wish to return.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    fetcher.submit(
                      { intent: DELETE_USER_INTENT, userId: user.id },
                      { method: "post" },
                    )
                  }
                >
                  Yes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
