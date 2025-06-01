import React from "react";
import { AlertTriangle, Download, Users } from "lucide-react";
import { Button } from "~/components/ui/button";

export function DataAndSecurity() {
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
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
          <div>
            <h3 className="mb-1 text-lg font-medium">Active Sessions</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Sign out from all other devices where you&apos;re logged in
            </p>
          </div>
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Sign Out Other Sessions
          </Button>
        </div>

        <div className="pt-4">
          <h3 className="mb-1 text-lg font-medium text-red-500 dark:text-red-400">
            Danger Zone
          </h3>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Once you delete your account, there is no going back. This action
            cannot be undone.
          </p>
          <Button
            variant="outline"
            className="border-red-300 text-red-500 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
