#!/usr/bin/env node --es-module-specifier-resolution=node

import core from "@actions/core";
import github from "@actions/github";
import { autolabel } from "./lib/autolabel";

(async () => {
  try {
    // Retrieve GitHub token from environment.
    /** A [GitHub token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the `public_repo` (for use in public repos) or `repo` (for use in private repos) scope. */
    const token = process.env.GH_TOKEN;
    if (!token) {
      throw new Error(
        "Failed to retrieve a GitHub token. Does this repository have a secret named 'GH_TOKEN'? https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository"
      );
    }

    // Retrieve 'search_objects' from 'inputs'.
    /** A list of objects indicating the `text` to search for and the issue `label` to apply when a match is found. For example, `[{ text: "4.1.1", label: "WCAG 4.1.1" }]`. */
    let searchObjects: { text: string; label: string }[];
    try {
      searchObjects = JSON.parse(
        core.getInput("search_objects", { required: true }) || "[]"
      );
    } catch (error) {
      const originalErrorMessage =
        error instanceof Error ? error.message : error;
      throw new Error(
        `Failed to retrieve input 'search_objects' with error: ${originalErrorMessage}. Is the input a valid JSON string?`
      );
    }

    // Retrieve 'limit_matches' from 'inputs'.
    /** If `true`, searching will stop when a match is found (so one label will be applied at most). If `false`, every search object will be checked (so many labels may be applied). Default: `false`. */
    let limitMatches: boolean;
    try {
      limitMatches = Boolean(core.getBooleanInput("limit_matches"));
    } catch (error) {
      const originalErrorMessage =
        error instanceof Error ? error.message : error;
      throw new Error(
        `Failed to retrieve input 'limit_matches' with error: ${originalErrorMessage}. Is the input a boolean?`
      );
    }

    // Retrieve 'owner' and 'repo' from 'inputs' or from the `github` context.
    // Ref: https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#webhook-payload-object-common-properties
    /** The owner of the repo containing the issue to autolabel. This is a GitHub username if the repo is user-owned, or a GitHub org name if the repo is org-owned. */
    let owner: string | undefined =
      core.getInput("owner") || github.context.payload.repository?.owner?.login;
    core.debug(`owner: #{owner}`);
    if (!owner) {
      throw new Error(
        `Failed to retrieve 'owner' or to determine it from context ('repository' in 'context': ${github.context.payload.repository}).`
      );
    }
    /** The name of the repo containing the issue to autolabel. */
    let repo: string | undefined =
      core.getInput("repo") || github.context.payload.repository?.name;
    core.debug(`owner: #{repo}`);
    if (!repo) {
      throw new Error(
        `Failed to retrieve 'repo' or to determine it from context ('repository' in 'context': ${github.context.payload.repository}).`
      );
    }

    // Retrieve 'issue_numbers' from 'inputs' or from the `github` context.
    /** A set of issue numbers indicating the issues to autolabel. */
    let issueNumbers: Set<number> = new Set();
    // From 'inputs'
    if (typeof core.getInput("issue_numbers") === "string") {
      for (const issueNumber of core.getInput("issue_numbers").split(" ")) {
        if (!Number.isNaN(Number(issueNumber))) {
          issueNumbers.add(Number(issueNumber));
        }
      }
    }
    // From 'issues.opened' context
    else if (
      github.context.eventName === "issues" &&
      github.context.payload.action === "opened"
    ) {
      const issueNumber = github.context.payload.issue?.number;
      core.debug(
        `issueNumber: ${issueNumber}, typeof 'issueNumber': ${typeof issueNumber}`
      );
      if (issueNumber) {
        issueNumbers.add(issueNumber);
      }
    }
    if (issueNumbers.size === 0) {
      throw new Error(
        `Failed to retrieve 'issue_numbers' or to determine it from context ('eventName' and 'action' name in 'context': ${github.context.eventName}.${github.context.payload.action}).`
      );
    }

    // Autolabel specified issue
    autolabel({
      token,
      owner,
      repo,
      issueNumbers,
      searchObjects,
      limitMatches,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : `A top-level error occurred: ${error}`;
    core.setFailed(errorMessage);
  }
})();
