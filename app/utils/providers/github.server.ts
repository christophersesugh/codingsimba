import { createId as cuid } from "@paralleldrive/cuid2";
import { redirect } from "react-router";
import { GitHubStrategy } from "remix-auth-github";
import { z } from "zod";
import { connectionSessionStorage } from "../connection.server";
// import { redirectWithToast } from "../toast.server.ts";
import { type AuthProvider, type ProviderUser } from "./provider";
import { Strategy } from "remix-auth/strategy";

const GitHubUserSchema = z.object({ login: z.string() });

const shouldMock = process.env.GITHUB_CLIENT_ID.startsWith("MOCK_");

interface GitHubProfile {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

async function getUser(tokens: {
  accessToken: () => string;
}): Promise<GitHubProfile> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub user profile");
  }

  const profile = await response.json();
  return profile;
}

export class GitHubProvider implements AuthProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAuthStrategy(): Strategy<ProviderUser, any> {
    return new GitHubStrategy(
      {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        redirectURI: "/auth/github/callback",
      },
      async ({ tokens, request }) => {
        console.log(tokens, request);

        const profile = await getUser(tokens);
        const email = profile.email?.trim().toLowerCase();
        if (!email) {
          throw new Error("No email");
          //   // throw await redirectWithToast("/login", {
          //   //   title: "No email found",
          //   //   description: "Please add a verified email to your GitHub account.",
          //   // });
        }
        const username = profile.login;
        const imageUrl = profile.avatar_url;
        return {
          email,
          id: profile.id.toString(),
          username,
          name: profile.name ?? undefined,
          imageUrl,
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

    const connectionSession = await connectionSessionStorage.getSession(
      request.headers.get("cookie"),
    );
    const state = cuid();
    connectionSession.set("oauth2:state", state);
    const code = "MOCK_GITHUB_CODE_KODY";
    // const code = 'MOCK_GITHUB_CODE_HANNAH'
    const searchParams = new URLSearchParams({ code, state });
    throw redirect(`/auth/github/callback?${searchParams}`, {
      headers: {
        "set-cookie":
          await connectionSessionStorage.commitSession(connectionSession),
      },
    });
  }
}
