import { getErrorMessage } from "~/utils/misc";

export const RESEND_URL = "https://api.resend.com/emails" as const;

export async function sendEmail(options: {
  to: string;
  subject: string;
  react: React.ReactNode;
}) {
  const emailData = {
    from: "info@codingsimba.com",
    ...options,
  };

  const response = await fetch(RESEND_URL, {
    method: "POST",
    body: JSON.stringify(emailData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
  });

  const data = await response.json();
  if (response.ok) {
    return { status: "success", data } as const;
  } else {
    return { status: "error", error: getErrorMessage(data) } as const;
  }
}
