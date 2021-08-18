#!/usr/bin/env node --es-module-specifier-resolution=node

import core from "@actions/core";
import { autolabel } from "./lib/autolabel";

(async () => {
  try {
    // Retrieve token
    const token = process.env.GH_TOKEN;
    if (!token) {
      throw new Error(
        "Failed to retrieve a GitHub token. Does this repository have a secret named 'GH_TOKEN'? https://docs.github.com/en/actions/reference/encrypted-secrets#creating-encrypted-secrets-for-a-repository"
      );
    }

    // Retrieve inputs
    let searchObjects: { text: string; label: string }[];
    try {
      searchObjects = JSON.parse(
        core.getInput("search_objects", { required: true }) || "[]"
      );
    } catch (error) {
      throw new Error(
        `Failed to retrieve input 'search_objects' with error: ${error.message}. Is the input a valid JSON string?`
      );
    }
    let limitMatches: boolean;
    try {
      limitMatches = Boolean(core.getBooleanInput("limit_matches"));
    } catch (error) {
      throw new Error(
        `Failed to retrieve input 'limit_matches' with error: ${error.message}. Is the input a boolean?`
      );
    }

    // Autolabel specified issue
    autolabel({
      token,
      owner: "smockle",
      repo: "action-autolabel",
      issueNumber: 1,
      searchObjects,
      limitMatches,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
})();
