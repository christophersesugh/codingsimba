import type React from "react";
import { motion } from "framer-motion";
import { Check, Star, Users, Zap, Crown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface PricingPlan {
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline";
  icon: React.ReactNode;
  maxMembers?: number;
  perSeat?: boolean;
  minSeats?: number;
}

const individualPlans: PricingPlan[] = [
  {
    name: "Basic",
    price: "Free",
    period: "forever",
    description: "Perfect for getting started with coding",
    features: [
      "Access to free courses and tutorials",
      "Basic articles and workshops",
      "Basic monthly coding challenges",
      "Discord community access",
      "Email support",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    name: "Premium",
    price: "$9",
    period: "per month",
    description: "Unlock premium tutorials and advanced content",
    features: [
      "Everything in Basic",
      "Access to all premium tutorials and workshops",
      "Priority community support",
      "Access to premium monthly coding challenges",
      "Basic certificates of completion",
    ],
    buttonText: "Upgrade to Premium",
    buttonVariant: "outline",
    icon: <Star className="h-5 w-5" />,
  },
  {
    name: "Pro",
    price: "$19",
    originalPrice: "$29",
    period: "per month",
    description: "Complete learning experience for serious developers",
    features: [
      "Everything in Premium",
      "Access to all courses and programs",
      "AI Learning Assistant",
      "Advanced certificates and badges",
      "1-on-1 mentorship sessions (2/month)",
      "Priority email support",
      "Early access to new content",
      "Progress analytics and insights",
    ],
    popular: true,
    buttonText: "Start Free Trial",
    buttonVariant: "default",
    icon: <Crown className="h-5 w-5" />,
  },
];

const teamPlans: PricingPlan[] = [
  {
    name: "Team Starter",
    price: "$12",
    period: "per member/month",
    description: "Perfect for small teams getting started",
    features: [
      "Everything in Pro for each member",
      "Team dashboard and analytics",
      "Progress tracking for all members",
      "Team certificates",
      "Basic team reporting",
      "Email support",
    ],
    buttonText: "Start Team Trial",
    buttonVariant: "outline",
    icon: <Users className="h-5 w-5" />,
    minSeats: 3,
    maxMembers: 10,
    perSeat: true,
  },
  {
    name: "Team Pro",
    price: "$18",
    period: "per member/month",
    description: "Advanced features for growing teams",
    features: [
      "Everything in Team Starter",
      "Custom learning paths",
      "Advanced team analytics",
      "Skills assessment tools",
      "Integration with Slack/Teams",
      "Priority support",
      "Bulk user management",
      "Advanced reporting",
      // "Team competitions",
    ],
    popular: true,
    buttonText: "Start Team Trial",
    buttonVariant: "default",
    icon: <Crown className="h-5 w-5" />,
    minSeats: 5,
    maxMembers: 50,
    perSeat: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "Tailored solutions for large organizations",
    features: [
      "Everything in Team Pro",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated account manager",
      "Custom branding",
      "Advanced security features",
      "SLA guarantees",
      "24/7 phone support",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    icon: <Crown className="h-5 w-5" />,
    maxMembers: 999,
  },
];

function PricingCard({ plan, index }: { plan: PricingPlan; index: number }) {
  const isTeam =
    plan.perSeat ||
    plan.name.toLowerCase().includes("team") ||
    plan.name.toLowerCase().includes("enterprise");

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative flex flex-col rounded-2xl border bg-white p-8 shadow-lg dark:bg-gray-900 ${
        plan.popular
          ? `${
              isTeam ? "scale-105" : ""
            } border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400 dark:ring-blue-400/20`
          : "border-gray-200 dark:border-gray-800"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
          <div className="flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white dark:bg-blue-500">
            <Star className="h-4 w-4 fill-current" />
            Most Popular
          </div>
        </div>
      )}

      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          {plan.icon}
          <h3 className="text-2xl font-bold">{plan.name}</h3>
        </div>
        <div className="mb-4">
          <span className="text-4xl font-bold">{plan.price}</span>
          {plan.originalPrice && (
            <span className="ml-2 text-lg text-gray-500 line-through dark:text-gray-400">
              {plan.originalPrice}
            </span>
          )}
          {plan.price !== "Free" && plan.price !== "Custom" && (
            <span className="ml-2 text-gray-500 dark:text-gray-400">
              /{plan.period}
            </span>
          )}
        </div>
        {plan.minSeats && (
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              Minimum {plan.minSeats} members
            </Badge>
          </div>
        )}
        {plan.maxMembers && plan.maxMembers < 999 && (
          <div className="mb-2">
            <Badge variant="outline" className="text-xs">
              Up to {plan.maxMembers} members
            </Badge>
          </div>
        )}
        <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
      </div>

      <ul className="mb-8 flex-grow space-y-4">
        {plan.features.map((feature, featureIndex) => (
          <li key={featureIndex} className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        className={`w-full py-6 text-lg ${
          plan.popular
            ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            : ""
        }`}
        variant={plan.buttonVariant}
      >
        {plan.buttonText}
      </Button>

      {plan.perSeat && plan.price !== "Custom" && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Example: 10 members = $
            {Number.parseInt(plan.price.replace("$", "")) * 10}
            /month
          </p>
        </div>
      )}
    </motion.div>
  );
}

function TeamPricingExplanation() {
  return (
    <div className="mb-12 text-center">
      <div className="mx-auto max-w-4xl rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/30">
        <h3 className="mb-3 text-xl font-semibold text-blue-900 dark:text-blue-100">
          Simple Per-Seat Pricing
        </h3>
        <p className="mb-4 text-blue-700 dark:text-blue-200">
          Our team plans scale with your organization. Pay only for active team
          members with no hidden fees.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          >
            ✓ No setup fees
          </Badge>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          >
            ✓ Add/remove members anytime
          </Badge>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          >
            ✓ Prorated billing
          </Badge>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          >
            ✓ Volume discounts available
          </Badge>
        </div>
      </div>
    </div>
  );
}

function VolumeDiscounts() {
  return (
    <div className="mt-12">
      <div className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-8 dark:border-purple-800 dark:from-purple-950/30 dark:to-blue-950/30">
        <div className="mb-6 text-center">
          <h3 className="mb-2 text-2xl font-bold">
            Volume Discounts Available
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Save more as your team grows with our automatic volume discounts
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { discount: "5%", memberCount: "25+ members" },
            { discount: "10%", memberCount: "50+ members" },
            { discount: "15%", memberCount: "100+ members" },
            { discount: "20%", memberCount: "250+ members" },
          ].map((item) => (
            <MembersCount key={item.discount} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Subscription() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute left-0 top-0 h-1/3 w-1/3 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-1/3 w-1/3 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Choose Your Learning Path
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Flexible pricing that scales with your needs - whether you&apos;re
            learning solo or building a team.
          </p>
        </motion.div>

        <Tabs defaultValue="individual" className="mx-auto max-w-6xl">
          <TabsList className="mx-auto mb-12 flex w-fit">
            <TabsTrigger value="individual" className="py-3 text-lg">
              Individual Plans
            </TabsTrigger>
            <TabsTrigger value="team" className="py-3 text-lg">
              Team Plans
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
              {individualPlans.map((plan, index) => (
                <PricingCard key={index} plan={plan} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team">
            <div className="space-y-8">
              <TeamPricingExplanation />

              <div className="grid gap-8 lg:grid-cols-3">
                {teamPlans.map((plan, index) => (
                  <PricingCard key={index} plan={plan} index={index} />
                ))}
              </div>

              <VolumeDiscounts />
            </div>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            All plans include a 14-day free trial
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Secure payments</span>
            <span>✓ 24/7 support</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MembersCount({
  discount,
  memberCount,
}: {
  discount: string;
  memberCount: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-4 text-center dark:bg-gray-900">
      <div className="mb-1 text-2xl font-bold text-green-600">{discount}</div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        {memberCount}
      </div>
    </div>
  );
}
