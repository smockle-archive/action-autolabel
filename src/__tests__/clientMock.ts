import type { Client } from "../lib/issue";
import type { RestEndpointMethodTypes } from "@octokit/rest";

import fs from "fs";
import url from "url";
import { promisify } from "util";
const readFile = promisify(fs.readFile);
const { URL } = url;

// GET /repos/{owner}/{repo}/issues/{issue_number}

type GetIssueResponse = RestEndpointMethodTypes["issues"]["get"]["response"];

export async function getIssueMock(): Promise<GetIssueResponse> {
  // Track the number of times 'getIssueMock' has been called.
  getIssueMock.called++;
  // Return mock data read from a file.
  const path: url.URL = new URL("./getIssueResponse.json", import.meta.url);
  const unparsedResponse = await readFile(path, "utf8");
  const response: GetIssueResponse = JSON.parse(unparsedResponse);
  return Promise.resolve(response);
}
getIssueMock.defaults = undefined as any;
getIssueMock.endpoint = undefined as any;
getIssueMock.called = 0;

// POST /repos/{owner}/{repo}/issues/{issue_number}/labels

type AddLabelsToIssueResponse =
  RestEndpointMethodTypes["issues"]["addLabels"]["response"];

export async function addLabelsToIssueMock(): Promise<AddLabelsToIssueResponse> {
  // Track the number of times 'addLabelsToIssueMock' has been called.
  addLabelsToIssueMock.called++;
  return Promise.resolve({} as AddLabelsToIssueResponse);
}
addLabelsToIssueMock.defaults = undefined as any;
addLabelsToIssueMock.endpoint = undefined as any;
addLabelsToIssueMock.called = 0;

// Client

export const clientMock = {
  rest: {
    issues: {
      get: getIssueMock,
      addLabels: addLabelsToIssueMock,
    },
  },
} as Client & {
  rest: {
    issues: {
      get: { called: number };
      addLabels: { called: number };
    };
  };
};
