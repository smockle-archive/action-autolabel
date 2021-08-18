import github from "@actions/github";
import { Issue } from "./issue";
export async function autolabel({ token, owner, repo, issueNumber, searchObjects, limitMatches = false, }) {
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
    const labels = [];
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
