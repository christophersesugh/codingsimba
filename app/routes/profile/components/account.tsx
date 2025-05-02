import React from "react";
import { motion } from "framer-motion";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { AlertTriangle, Download, Users } from "lucide-react";
import { useUser } from "~/hooks/user";
import { Form } from "react-router";

export function Account() {
  const user = useUser();
  const profile = user.profile;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-xl font-bold">Account Information</h2>
        </div>
        <div className="p-6">
          <Form method="post" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  defaultValue={profile!.name!}
                  className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  disabled
                  id="email"
                  type="email"
                  defaultValue={user.email}
                  className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                defaultValue={profile?.bio ?? ""}
                rows={4}
                className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  defaultValue={profile?.location ?? ""}
                  className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://example.com"
                  defaultValue={profile?.website ?? ""}
                  className="border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </Form>
        </div>
      </div>

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

      {/* Add this after the password change form in the "account" tab */}
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
    </motion.div>
  );
}
