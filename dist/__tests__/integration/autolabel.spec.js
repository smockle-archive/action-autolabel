import github from "@actions/github";
import { autolabel } from "../../lib/autolabel";
import { Issue } from "../../lib/issue";
async function removeLabelWithVerification(issue, label) {
    let retriesRemaining = 2;
    while (true) {
        if (retriesRemaining === 0) {
            throw new Error(`Retries exceeded. Failed to remove label '${label}'.`);
        }
        await issue.fetch();
        if (issue.hasLabel(label)) {
            await issue.removeLabel(label);
        }
        else {
            break;
        }
        retriesRemaining--;
    }
}
describe("Autolabel", () => {
    /** The owner of the repo containing the test issue. */
    const owner = "smockle";
    /** The name of the repo containing the test issue. */
    const repo = "action-autolabel";
    /** The number of the test issue. */
    const issueNumber = 1;
    /** A list of objects indicating the `text` to search for and the issue `label` to apply when a match is found. For example, `[{ text: "4.1.1", label: "WCAG 4.1.1" }]`. */
    const searchObjects = [
        { text: "4.1.1", label: "WCAG 4.1.1" },
        { text: "4.1", label: "WCAG 4.1" },
    ];
    /** A [GitHub token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the `public_repo` (for use in public repos) or `repo` (for use in private repos) scope. */
    let token;
    let issue;
    beforeEach(async () => {
        if (!process.env.GH_TOKEN) {
            throw new Error("Failed to retrieve a GitHub token. A GitHub token with the `public_repo` (for use in public repos) or `repo` (for use in private repos) scope is required to be present in the environment as `GH_TOKEN` to run integration tests.");
        }
        token = process.env.GH_TOKEN;
        const client = github.getOctokit(token);
        issue = new Issue(client, { owner, repo, issueNumber });
        // Pre-test cleanup. Remove 'WCAG 4.1.1' and 'WCAG 4.1' labels, if they’re present.
        for (const { label } of searchObjects) {
            await removeLabelWithVerification(issue, label);
        }
    });
    test("one match", async () => {
        // Autolabel test issue.
        await autolabel({
            token,
            owner,
            repo,
            issueNumbers: new Set([issueNumber]),
            searchObjects,
            limitMatches: true,
        });
        // Get labels for test issue. Verify 'WCAG 4.1.1' label is present and 'WCAG 4.1' label is not present.
        await issue.fetch();
        const oneLabelAdded = issue.hasLabel("WCAG 4.1.1");
        const multipleLabelsAdded = issue.hasLabel("WCAG 4.1");
        expect(oneLabelAdded).toBe(true);
        expect(multipleLabelsAdded).toBe(false);
        // Remove 'WCAG 4.1.1' label.
        await issue.removeLabel("WCAG 4.1.1");
    });
    test("multiple matches", async () => {
        // Autolabel test issue.
        await autolabel({
            token,
            owner,
            repo,
            issueNumbers: new Set([issueNumber]),
            searchObjects,
            limitMatches: false,
        });
        // Get labels for test issue. Verify 'WCAG 4.1.1' and 'WCAG 4.1' labels are present.
        await issue.fetch();
        const oneLabelAdded = issue.hasLabel("WCAG 4.1.1");
        const multipleLabelsAdded = issue.hasLabel("WCAG 4.1");
        expect(oneLabelAdded).toBe(true);
        expect(multipleLabelsAdded).toBe(true);
        // Remove 'WCAG 4.1.1' and 'WCAG 4.1' labels.
        await issue.removeLabel("WCAG 4.1.1");
        await issue.removeLabel("WCAG 4.1");
    });
});
