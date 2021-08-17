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
      throw new Error(
        "Failed to retrieve a GitHub token. Does this repository have a secret named 'GH_TOKEN'? https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository"
      );
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

    // Retrieve inputs
    const searchObjects: { text: string; label: string }[] = (() => {
      try {
        return JSON.parse(
          core.getInput("search_objects", { required: true }) || "[]"
        );
      } catch (error) {
        throw new Error(
          `Failed to retrieve input 'search_objects' with error: ${error.message}. Is the input a valid JSON string?`
        );
      }
    })();
    const limitMatches: boolean = (() => {
      try {
        return Boolean(core.getBooleanInput("limit_matches"));
      } catch (error) {
        throw new Error(
          `Failed to retrieve input 'limit_matches' with error: ${error.message}. Is the input a boolean?`
        );
      }
    })();

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
