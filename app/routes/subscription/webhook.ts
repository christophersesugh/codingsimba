import { Webhooks } from "@polar-sh/remix";

export const action = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    // Handle payload
    console.log("Webhook payload:", payload);
  },
});
