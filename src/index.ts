#!/usr/bin/env node --es-module-specifier-resolution=node

import core from "@actions/core"
// import github from "@actions/github"

(async () => {
  try {
    // Retrieve token and use it to construct an authenticated REST API client
    const token = process.env.PAT_TOKEN;
    core.debug(
      !!token ? "Retrieved a GitHub token" : "Failed to retrieve a GitHub token"
    );
  } catch (error) {
    core.setFailed(error.message);
  }
})();