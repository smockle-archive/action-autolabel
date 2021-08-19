#!/usr/bin/env node --es-module-specifier-resolution=node
export class Issue {
    #client;
    #data;
    owner;
    repo;
    issueNumber;
    constructor(client, { owner, repo, issueNumber, }) {
        this.#client = client;
        this.owner = owner;
        this.repo = repo;
        this.issueNumber = issueNumber;
    }
    get body() {
        return this.#data?.body;
    }
    mentions(text) {
        return (this.body ?? "").includes(text);
    }
    hasLabel(label) {
        return Boolean(this.#data?.labels.some((x) => x === label || (typeof x !== "string" && x.name === label)));
    }
    async fetch() {
        this.#data = (await this.#client.rest.issues.get({
            owner: this.owner,
            repo: this.repo,
            issue_number: this.issueNumber,
        }))?.data;
    }
    async addLabels(labels) {
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
    async removeLabel(label) {
        await this.#client.rest.issues.removeLabel({
            owner: this.owner,
            repo: this.repo,
            issue_number: this.issueNumber,
            name: label,
        });
    }
}
