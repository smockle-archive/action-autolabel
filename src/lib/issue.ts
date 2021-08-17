#!/usr/bin/env node --es-module-specifier-resolution=node

import type { getOctokit } from "@actions/github";
import type { RestEndpointMethodTypes } from "@octokit/rest";

export type Client = ReturnType<typeof getOctokit>;

export class Issue {
  #client: Client;
  #data:
    | RestEndpointMethodTypes["issues"]["get"]["response"]["data"]
    | undefined;

  owner: string;
  repo: string;
  issueNumber: number;

  constructor(
    client: Client,
    {
      owner,
      repo,
      issueNumber,
    }: { owner: string; repo: string; issueNumber: number }
  ) {
    this.#client = client;
    this.owner = owner;
    this.repo = repo;
    this.issueNumber = issueNumber;
  }

  get body(): string | null | undefined {
    return this.#data?.body;
  }

  includes(text: string): boolean {
    return (this.body ?? "").includes(text);
  }

  async fetch(): Promise<void> {
    this.#data = (
      await this.#client.rest.issues.get({
        owner: this.owner,
        repo: this.repo,
        issue_number: this.issueNumber,
      })
    )?.data;
  }

  async addLabels(labels: string[]): Promise<void> {
    await this.#client.rest.issues.addLabels({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.issueNumber,
      labels,
    });
  }
}
