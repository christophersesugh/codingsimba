// import { createId as cuid } from "@paralleldrive/cuid2";
// import { redirect } from "react-router";
// import { GitHubStrategy } from "remix-auth-github";
// import { z } from "zod";
// import { connectionSessionStorage } from "../connection.server";
// import { type AuthProvider, type ProviderUser } from "./provider";
// import { Strategy } from "remix-auth/strategy";
// import { redirectWithToast } from "../toast.server";

// const GitHubUserSchema = z.object({ login: z.string() });

// const shouldMock = process.env.GITHUB_CLIENT_ID.startsWith("MOCK_");

// interface GitHubProfile {
//   id: number;
//   login: string;
//   name: string | null;
//   email: string | null;
//   avatar_url: string;
// }

// async function getUser(tokens: {
//   accessToken: () => string;
// }): Promise<GitHubProfile> {
//   const response = await fetch("https://api.github.com/user", {
//     headers: {
//       Authorization: `Bearer ${tokens.accessToken()}`,
//       Accept: "application/vnd.github.v3+json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch GitHub user profile");
//   }

//   const profile = await response.json();
//   return profile;
// }

// export class GitHubProvider implements AuthProvider {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   getAuthStrategy(): Strategy<ProviderUser, any> {
//     return new GitHubStrategy(
//       {
//         clientId: process.env.GITHUB_CLIENT_ID,
//         clientSecret: process.env.GITHUB_CLIENT_SECRET,
//         redirectURI: "/auth/github/callback",
//         // cookie: "__cs_connection",
//       },
//       async ({ tokens, request }) => {
//         console.log(tokens, request);
//         const profile = await getUser(tokens);
//         const email = profile.email?.trim().toLowerCase();
//         if (!email) {
//           throw await redirectWithToast("/signin", {
//             title: "No email found",
//             description: "Please add a verified email to your GitHub account.",
//           });
//         }
//         const username = profile.login;
//         const imageUrl = profile.avatar_url;
//         return {
//           email,
//           id: profile.id.toString(),
//           username,
//           name: profile.name ?? undefined,
//           imageUrl,
//         };
//       },
//     );
//   }

//   async resolveConnectionData(providerId: string) {
//     const response = await fetch(`https://api.github.com/user/${providerId}`, {
//       headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
//     });
//     const rawJson = await response.json();
//     const result = GitHubUserSchema.safeParse(rawJson);
//     return {
//       displayName: result.success ? result.data.login : "Unknown",
//       link: result.success ? `https://github.com/${result.data.login}` : null,
//     } as const;
//   }

//   async handleMockAction(request: Request) {
//     if (!shouldMock) return;
//     const connectionSession = await connectionSessionStorage.getSession(
//       request.headers.get("cookie"),
//     );
//     const state = cuid();
//     connectionSession.set("oauth2:state", state);
//     const code = "MOCK_GITHUB_CODE_CS";

//     // const code = "MOCK_GITHUB_CODE_CAS";
//     const searchParams = new URLSearchParams({ code, state });
//     throw redirect(`/auth/github/callback?${searchParams}`, {
//       headers: {
//         "set-cookie":
//           await connectionSessionStorage.commitSession(connectionSession),
//       },
//     });
//   }
// }

import { SetCookie } from "@mjackson/headers";
import { createId as cuid } from "@paralleldrive/cuid2";
import { redirect } from "react-router";
import { GitHubStrategy } from "remix-auth-github";
import { z } from "zod";
import { MOCK_CODE_GITHUB_HEADER, MOCK_CODE_GITHUB } from "./constants";
import { type AuthProvider } from "./provider";

const GitHubUserSchema = z.object({ login: z.string() });
// const GitHubUserParseResult = z
//   .object({
//     success: z.literal(true),
//     data: GitHubUserSchema,
//   })
//   .or(
//     z.object({
//       success: z.literal(false),
//     }),
//   );

const shouldMock =
  process.env.GITHUB_CLIENT_ID?.startsWith("MOCK_") ||
  process.env.NODE_ENV === "test";

const GitHubEmailSchema = z.object({
  email: z.string(),
  verified: z.boolean(),
  primary: z.boolean(),
  visibility: z.string().nullable(),
});

const GitHubEmailsResponseSchema = z.array(GitHubEmailSchema);

const GitHubUserResponseSchema = z.object({
  login: z.string(),
  id: z.number().or(z.string()),
  name: z.string().optional(),
  avatar_url: z.string().optional(),
});

export class GitHubProvider implements AuthProvider {
  getAuthStrategy() {
    if (
      !process.env.GITHUB_CLIENT_ID ||
      !process.env.GITHUB_CLIENT_SECRET ||
      !process.env.GITHUB_REDIRECT_URI
    ) {
      throw new Error(
        "GitHub OAuth strategy not available because environment variables are not set",
      );
    }
    return new GitHubStrategy(
      {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        redirectURI: process.env.GITHUB_REDIRECT_URI,
      },
      async ({ tokens }) => {
        // we need to fetch the user and the emails separately, this is a change in remix-auth-github
        // from the previous version that supported fetching both in one call
        const userResponse = await fetch("https://api.github.com/user", {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${tokens.accessToken()}`,
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });
        const rawUser = await userResponse.json();
        const user = GitHubUserResponseSchema.parse(rawUser);

        const emailsResponse = await fetch(
          "https://api.github.com/user/emails",
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${tokens.accessToken()}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          },
        );
        const rawEmails = await emailsResponse.json();
        const emails = GitHubEmailsResponseSchema.parse(rawEmails);
        const email = emails.find((e) => e.primary)?.email;
        if (!email) {
          throw new Error("Email not found");
        }

        return {
          id: user.id.toString(),
          email,
          name: user.name,
          username: user.login,
          imageUrl: user.avatar_url,
        };
      },
    );
  }

  async resolveConnectionData(providerId: string) {
    const response = await fetch(`https://api.github.com/user/${providerId}`, {
      headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` },
    });
    const rawJson = await response.json();
    const result = GitHubUserSchema.safeParse(rawJson);
    return {
      displayName: result.success ? result.data.login : "Unknown",
      link: result.success ? `https://github.com/${result.data.login}` : null,
    } as const;
  }

  async handleMockAction(request: Request) {
    if (!shouldMock) return;

    const state = cuid();
    // allows us to inject a code when running e2e tests,
    // but falls back to a pre-defined 🐨 constant
    const code =
      request.headers.get(MOCK_CODE_GITHUB_HEADER) || MOCK_CODE_GITHUB;
    const searchParams = new URLSearchParams({ code, state });
    const cookie = new SetCookie({
      name: "github",
      value: searchParams.toString(),
      path: "/",
      sameSite: "Lax",
      httpOnly: true,
      maxAge: 60 * 10,
      secure: process.env.NODE_ENV === "production" || undefined,
    });
    throw redirect(`/auth/github/callback?${searchParams}`, {
      headers: {
        "Set-Cookie": cookie.toString(),
      },
    });
  }
}
