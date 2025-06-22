import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import {
  CheckCircle,
  CreditCard,
  Users,
  BookOpen,
  ArrowRight,
  Download,
  Mail,
  Sparkles,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export default function SubscriptionSuccessPage() {
  const [searchParams] = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get URL parameters
  const sessionId = searchParams.get("session_id");
  const planType = searchParams.get("plan") || "pro";
  const customerId = searchParams.get("customer_id");

  useEffect(() => {
    // Simulate fetching subscription data
    // In a real app, you'd fetch this from your backend using the session_id
    const fetchSubscriptionData = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock subscription data based on plan type
        const mockData = {
          id: sessionId || "sub_1234567890",
          plan: planType,
          status: "active",
          amount: planType === "team" ? 4999 : planType === "pro" ? 1999 : 999,
          currency: "usd",
          interval: "month",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          customer: {
            id: customerId || "cus_1234567890",
            email: "user~example.com",
            name: "John Doe",
          },
          features:
            planType === "team"
              ? [
                  "Access for 5 team members",
                  "Team management dashboard",
                  "Progress tracking",
                  "Custom learning paths",
                  "Dedicated account manager",
                  "Priority support",
                  "Team analytics",
                  "Bulk certificates",
                ]
              : planType === "pro"
                ? [
                    "Access to all premium programs",
                    "Access to all premium courses",
                    "Articles and Premium  tutorials",
                    "Certificates of completion",
                    "Priority email support",
                    "Early access to new content",
                  ]
                : [
                    "Access to basic courses",
                    "Articles and free tutorials",
                    "Discord server access",
                    "Email support",
                  ],
        };

        setSubscriptionData(mockData);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [sessionId, planType, customerId]);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case "team":
        return "Team";
      case "pro":
        return "Pro";
      case "basic":
        return "Basic";
      default:
        return "Pro";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "team":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "pro":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "basic":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Processing your subscription...
          </p>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <span className="text-2xl text-red-600 dark:text-red-400">!</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold">Subscription Not Found</h1>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            We couldn&apos;t find your subscription details. Please check your
            email for confirmation or contact support.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              Welcome to Coding Simba{" "}
              {getPlanDisplayName(subscriptionData.plan)}! 🎉
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your subscription has been successfully activated. Let&apos;s get
              you started on your learning journey!
            </p>
          </motion.div>

          <div className="mb-12 grid items-stretch gap-8 lg:grid-cols-2">
            {/* Subscription Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-full"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Subscription Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Plan
                    </span>
                    <Badge className={getPlanColor(subscriptionData.plan)}>
                      {getPlanDisplayName(subscriptionData.plan)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Amount
                    </span>
                    <span className="font-semibold">
                      {formatPrice(
                        subscriptionData.amount,
                        subscriptionData.currency,
                      )}
                      /{subscriptionData.interval}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Status
                    </span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Next billing
                    </span>
                    <span className="font-medium">
                      {formatDate(subscriptionData.current_period_end)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">
                      Subscription ID
                    </span>
                    <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
                      {subscriptionData.id}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* What's Included */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    What&apos;s Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {subscriptionData.features.map(
                      (feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="mb-2 font-medium">Explore Courses</h3>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                      Browse our extensive library of courses
                    </p>
                    <Button size="sm" asChild>
                      <Link to="/courses">Browse Courses</Link>
                    </Button>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="mb-2 font-medium">Complete Profile</h3>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                      Set up your learning preferences
                    </p>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/profile">Edit Profile</Link>
                    </Button>
                  </div>

                  {subscriptionData.plan === "team" && (
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h3 className="mb-2 font-medium">Invite Team</h3>
                      <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                        Add your team members
                      </p>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/team/members">Invite Members</Link>
                      </Button>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                      <Download className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="mb-2 font-medium">Download Resources</h3>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                      Access downloadable content
                    </p>
                    <Button size="sm" variant="outline" asChild>
                      <Link to="/resources">View Resources</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Important Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Mail className="mt-1 h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h3 className="mb-2 font-medium text-blue-900 dark:text-blue-100">
                      Confirmation Email Sent
                    </h3>
                    <p className="mb-4 text-blue-700 dark:text-blue-200">
                      We&apos;ve sent a confirmation email to{" "}
                      <strong>{subscriptionData.customer.email}</strong> with
                      your subscription details and receipt. Please check your
                      inbox (and spam folder if needed).
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-300 dark:border-blue-700"
                      >
                        Resend Email
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-300 dark:border-blue-700"
                        asChild
                      >
                        <Link to="/profile">Manage Subscription</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white">
              <h2 className="mb-4 text-2xl font-bold">
                Ready to Start Learning?
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-blue-100">
                Your learning journey begins now! Explore our courses, connect
                with the community, and start building amazing projects.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  asChild
                >
                  <Link to="/courses">
                    Start Learning
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
