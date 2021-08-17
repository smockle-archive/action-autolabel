#!/usr/bin/env node --es-module-specifier-resolution=node

import core from "@actions/core";
import github from "@actions/github";

import type { IssueResponse } from "./lib/issue";
import { Issue } from "./lib/issue";

(async () => {
  try {
    // Retrieve token and use it to construct an authenticated REST API client
    const token = process.env.GH_TOKEN;
    if (!token) {
      throw new Error("Failed to retrieve a GitHub token");
    }
    const octokit = github.getOctokit(token);

    // Retrieve issue data
    const response: IssueResponse = (
      await octokit.rest.issues.get({
        owner: "smockle",
        repo: "action-autolabel",
        issue_number: 1,
      })
    ).data;
    const issue = new Issue(response);

    // Retrieve the search parameters
    const searchObjects: { text: string; label: string }[] = JSON.parse(
      core.getInput("search_objects", { required: true }) || "[]"
    );
    const limitMatches = Boolean(core.getBooleanInput("limit_matches"));

    // Determine which labels to apply
    const labels: string[] = [];
    for (const { text, label } of searchObjects) {
      if (issue.includes(text)) {
        labels.push(label);
        if (limitMatches) {
          break;
        }
      }
    }

    // Add labels to issue
    core.debug(`Adding labels: ${JSON.stringify(labels)}`);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
