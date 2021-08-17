#!/usr/bin/env node --es-module-specifier-resolution=node
export class Issue {
    #response;
    constructor(response) {
        this.#response = response;
    }
    get body() {
        return this.#response.body;
    }
    includes(text) {
        return (this.body ?? "").includes(text);
    }
}
