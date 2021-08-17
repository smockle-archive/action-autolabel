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
    includes(text) {
        return (this.body ?? "").includes(text);
    }
    async fetch() {
        this.#data = (await this.#client.rest.issues.get({
            owner: this.owner,
            repo: this.repo,
            issue_number: this.issueNumber,
        }))?.data;
    }
    async addLabels(labels) {
        await this.#client.rest.issues.addLabels({
            owner: this.owner,
            repo: this.repo,
            issue_number: this.issueNumber,
            labels,
        });
    }
}
