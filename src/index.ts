#!/usr/bin/env node --es-module-specifier-resolution=node

import core from "@actions/core";
import github from "@actions/github";
import { toBoolean } from "./lib/utils";

(async () => {
  try {
    // Retrieve token and use it to construct an authenticated REST API client
    const token = process.env.GH_TOKEN;
    core.debug(
      !!token ? "Retrieved a GitHub token" : "Failed to retrieve a GitHub token"
    );

    // Retrieve the search paramaters
    const searchObjects: { text: string; label: string }[] =
      core.getInput("search_objects") || [];
    const limitMatches = toBoolean(core.getInput("limit_matches" || false));

    const matches;
    for (const { text, label } in searchObjects) {
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
