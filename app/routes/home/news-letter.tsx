import React from "react";
import { SubscriptionForm } from "~/components/email-subscription-form";

export function NewsLetterSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-white dark:to-gray-950" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <SubscriptionForm />
        </div>
      </div>
    </section>
  );
}
