import { Octokit } from "octokit";

const { GITHUB_TOKEN } = process.env;
if (!GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN required.");
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });

export { octokit };
