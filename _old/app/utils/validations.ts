import { z } from "zod";

const email = z.string().email();
const password = z.string().min(6).max(20);

export const userAuth = z.object({
  email: email,
  password: password,
});
