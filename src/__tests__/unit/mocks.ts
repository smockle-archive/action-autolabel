import type { Client } from "../../lib/issue";
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
  counter.rest.issues.get++;
  // Return mock data read from a file.
  const path: url.URL = new URL("./getIssueResponse.json", import.meta.url);
  const unparsedResponse = await readFile(path, "utf8");
  const response: GetIssueResponse = JSON.parse(unparsedResponse);
  return Promise.resolve(response);
}
getIssueMock.defaults = undefined as any;
getIssueMock.endpoint = undefined as any;

// POST /repos/{owner}/{repo}/issues/{issue_number}/labels

type AddLabelsToIssueResponse =
  RestEndpointMethodTypes["issues"]["addLabels"]["response"];

export async function addLabelsToIssueMock(): Promise<AddLabelsToIssueResponse> {
  // Track the number of times 'addLabelsToIssueMock' has been called.
  counter.rest.issues.addLabels++;
  return Promise.resolve({} as AddLabelsToIssueResponse);
}
addLabelsToIssueMock.defaults = undefined as any;
addLabelsToIssueMock.endpoint = undefined as any;

// DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}

type RemoveLabelFromIssueResponse =
  RestEndpointMethodTypes["issues"]["removeLabel"]["response"];

export async function removeLabelFromIssueMock(): Promise<RemoveLabelFromIssueResponse> {
  // Track the number of times 'removeLabelFromIssueMock' has been called.
  counter.rest.issues.removeLabel++;
  return Promise.resolve({} as RemoveLabelFromIssueResponse);
}
removeLabelFromIssueMock.defaults = undefined as any;
removeLabelFromIssueMock.endpoint = undefined as any;

// Client

export const client = {
  rest: {
    issues: {
      get: getIssueMock,
      addLabels: addLabelsToIssueMock,
      removeLabel: removeLabelFromIssueMock,
    },
  },
} as Client;

// Counter

class Counter {
  #initialCount = {
    rest: {
      issues: {
        get: 0,
        addLabels: 0,
        removeLabel: 0,
      },
    },
  };
  // Deep clone the initial counts
  // Use `rest` for parallelism with `client` keys; for example,
  // `client.rest.issues.get`’s call count is `counter.rest.issues.get`.
  rest = JSON.parse(JSON.stringify(this.#initialCount.rest));
  reset() {
    this.rest = JSON.parse(JSON.stringify(this.#initialCount.rest));
  }
}
export const counter = new Counter();
