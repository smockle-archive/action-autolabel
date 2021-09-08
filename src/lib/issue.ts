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

  mentions(text: string): boolean {
    return (this.body ?? "").includes(text);
  }

  hasLabel(label: string): boolean {
    return Boolean(
      this.#data?.labels.some(
        (x) => x === label || (typeof x !== "string" && x.name === label)
      )
    );
  }

  async fetch(): Promise<void> {
    try {
      this.#data = (
        await this.#client.rest.issues.get({
          owner: this.owner,
          repo: this.repo,
          issue_number: this.issueNumber,
        })
      )?.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      console.error(`Failed to fetch issue with error: ${errorMessage}`);
    }
  }

  async addLabels(labels: string[]): Promise<void> {
    if (labels.length === 0) {
      return;
    }
    await this.#client.rest.issues.addLabels({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.issueNumber,
      labels,
    });
  }

  async removeLabel(label: string): Promise<void> {
    await this.#client.rest.issues.removeLabel({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.issueNumber,
      name: label,
    });
  }
}
