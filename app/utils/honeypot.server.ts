import { StatusCodes } from "http-status-codes";
import { Honeypot, SpamError } from "remix-utils/honeypot/server";

export const honeypot = new Honeypot({
  validFromFieldName: process.env.TESTING ? null : undefined,
  encryptionSeed: process.env.HONEYPOT_SECRET,
});

export function checkHoneypot(formData: FormData) {
  try {
    honeypot.check(formData);
  } catch (error) {
    if (error instanceof SpamError) {
      throw new Response("Form not submitted properly", {
        status: StatusCodes.BAD_REQUEST,
      });
    }
    throw error;
  }
}
