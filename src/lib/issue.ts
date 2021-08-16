#!/usr/bin/env node --es-module-specifier-resolution=node

import type { RestEndpointMethodTypes } from "@octokit/rest"
type IssueResponse = RestEndpointMethodTypes["issues"]["get"]["response"]["data"];

export function getBody(issueResponse: IssueResponse) {
  return issueResponse.body
}