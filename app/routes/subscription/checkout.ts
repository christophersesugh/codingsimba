import { Checkout } from "@polar-sh/remix";

export const loader = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  successUrl: `http://localhost:5173/subscription/success?checkout_id={CHECHOUT_ID}`,
  server: "sandbox",
});
