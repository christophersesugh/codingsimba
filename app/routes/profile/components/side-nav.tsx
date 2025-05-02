import { LogOut, type LucideIcon } from "lucide-react";
import React from "react";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/shadcn";
import type { TabValue } from "..";
import { useUser } from "~/hooks/user";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

type SideNavProps = {
  tabs: { value: TabValue; Icon: LucideIcon }[];
  activeTab: TabValue;
  setActiveTab: (activetab: TabValue) => void;
};

export function SideNav({ tabs, activeTab, setActiveTab }: SideNavProps) {
  const user = useUser();
  const profile = user.profile;
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-200 p-6 text-center dark:border-gray-800">
        <div className="relative mx-auto mb-4 h-24 w-24">
          <Avatar className="size-24">
            {profile?.image ? (
              <AvatarImage src={profile.image} alt={profile!.name!} />
            ) : null}
            <AvatarFallback>{profile!.name!.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <h2 className="text-xl font-bold">{profile!.name!}</h2>
        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            Free Plan
          </span>
        </div>
      </div>
      <nav className="p-4">
        <ul role="tablist" aria-orientation="vertical" className="space-y-1">
          {tabs.map((tab, i) => (
            <TabItem
              key={`${tab.value}-${i}`}
              value={tab.value}
              Icon={tab.Icon}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ))}
        </ul>
      </nav>
      <Form
        method="post"
        action="/logout"
        className="border-t border-gray-200 p-4 dark:border-gray-800"
      >
        <Button variant="destructive" className="w-full font-bold">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </Form>
    </div>
  );
}

interface TabItemProps {
  value: TabValue;
  Icon: LucideIcon;
  activeTab: TabValue;
  setActiveTab: (activeTab: TabValue) => void;
}

function TabItem({ value, Icon, activeTab, setActiveTab }: TabItemProps) {
  const isActive = activeTab === value;

  return (
    <li role="presentation">
      <button
        role="tab"
        aria-selected={isActive}
        aria-label={value}
        tabIndex={isActive ? 0 : -1}
        onClick={() => setActiveTab(value)}
        className={cn(
          "flex w-full items-center rounded-lg px-4 py-2 capitalize text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-800",
          {
            "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400":
              isActive,
          },
        )}
      >
        <Icon className="mr-3 h-5 w-5" aria-hidden="true" />
        {value}
      </button>
    </li>
  );
}
