import React from "react";
import type { Route } from "../profile/+types";
import { SideNav } from "./components/side-nav";
import { Account } from "./components/account";
import {
  Award,
  Bell,
  BookOpen,
  CreditCard,
  User,
  type LucideIcon,
} from "lucide-react";
import { Courses } from "./components/courses";
import { Certificates } from "./components/certificates";
import { Subscription } from "./components/subscription";
import { Notifications } from "./components/notifications";
import { requireUser } from "~/utils/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request);
  return {};
}

export type TabValue =
  | "Account"
  | "My Courses"
  | "Certificates"
  | "Subscription"
  | "Notifications";

export default function ProfileRoute() {
  const [activeTab, setActiveTab] = React.useState<TabValue>("Account");

  const tabs = [
    { value: "Account", Icon: User },
    { value: "My Courses", Icon: BookOpen },
    { value: "Certificates", Icon: Award },
    { value: "Subscription", Icon: CreditCard },
    { value: "Notifications", Icon: Bell },
  ] as { value: TabValue; Icon: LucideIcon }[];

  function renderTab() {
    switch (activeTab) {
      case "Account":
        return <Account />;
      case "My Courses":
        return <Courses />;
      case "Certificates":
        return <Certificates />;
      case "Subscription":
        return <Subscription />;
      case "Notifications":
        return <Notifications />;
      default:
        return <Account />;
    }
  }

  return (
    <div className="my-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20">
              <SideNav
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </div>
          <div
            className="lg:col-span-3"
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {renderTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
