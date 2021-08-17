#!/usr/bin/env node --es-module-specifier-resolution=node

import type { RestEndpointMethodTypes } from "@octokit/rest";
type IssueResponse =
  RestEndpointMethodTypes["issues"]["get"]["response"]["data"];

export class Issue {
  #response: IssueResponse;

  constructor(response: IssueResponse) {
    this.#response = response;
  }

  get body() {
    return this.#response.body;
  }

  includes(text: string): boolean {
    return (this.body ?? "").includes(text);
  }
}
