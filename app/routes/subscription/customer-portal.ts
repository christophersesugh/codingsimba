import { CustomerPortal } from "@polar-sh/remix";

const { NODE_ENV } = process.env;

export const loader = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCustomerId: async (event) => "some", // Function to resolve a Polar Customer ID
  server: NODE_ENV === "development" ? "sandbox" : "production", // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
});
