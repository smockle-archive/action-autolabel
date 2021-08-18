import github from "@actions/github";
import { Issue } from "./issue";

interface AutolabelParameters {
  /** A [GitHub token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the `public_repo` (for use in public repos) or `repo` (for use in private repos) scope. */
  token: string;

  /** The owner of the repo containing the issue to autolabel. This is a GitHub username if the repo is user-owned, or a GitHub org name if the repo is org-owned. */
  owner: string;

  /** The name of the repo containing the issue to autolabel. */
  repo: string;

  /** The number of the issue to autolabel. This can be found in issue URLs. */
  issueNumber: number;

  /** A list of objects indicating the `text` to search for and the issue `label` to apply when a match is found. For example, `[{ text: "4.1.1", label: "WCAG 4.1.1" }]`. */
  searchObjects: { text: string; label: string }[];

  /** If `true`, searching will stop when a match is found (so one label will be applied at most). If `false`, every search object will be checked (so many labels may be applied). Default: `false`. */
  limitMatches: boolean;
}

export async function autolabel({
  token,
  owner,
  repo,
  issueNumber,
  searchObjects,
  limitMatches = false,
}: AutolabelParameters) {
  // Retrieve an authenticated client
  const client = github.getOctokit(token);

  // Retrieve issue data
  const issue = new Issue(client, {
    owner: owner,
    repo: repo,
    issueNumber: issueNumber,
  });
  await issue.fetch();

  // Determine which labels to apply
  const labels: string[] = [];
  for (const { text, label } of searchObjects) {
    if (issue.mentions(text)) {
      labels.push(label);
      if (limitMatches) {
        break;
      }
    }
  }

  // Add labels to issue
  console.debug(`Adding labels: ${JSON.stringify(labels)}`);
  await issue.addLabels(labels);
}
