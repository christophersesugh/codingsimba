import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function ChangePassword() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-200 p-6 dark:border-gray-800">
        <h2 className="text-xl font-bold">Change Password</h2>
      </div>
      <div className="p-6">
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Update Password</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
