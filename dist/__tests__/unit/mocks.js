import fs from "fs";
import url from "url";
import { promisify } from "util";
import v8 from "v8";
const readFile = promisify(fs.readFile);
const { URL } = url;
export async function getIssueMock() {
    // Track the number of times 'getIssueMock' has been called.
    counter.rest.issues.get++;
    // Return mock data read from a file.
    const path = new URL("./getIssueResponse.json", import.meta.url);
    const unparsedResponse = await readFile(path, "utf8");
    const response = JSON.parse(unparsedResponse);
    return Promise.resolve(response);
}
getIssueMock.defaults = undefined;
getIssueMock.endpoint = undefined;
export async function addLabelsToIssueMock() {
    // Track the number of times 'addLabelsToIssueMock' has been called.
    counter.rest.issues.addLabels++;
    return Promise.resolve({});
}
addLabelsToIssueMock.defaults = undefined;
addLabelsToIssueMock.endpoint = undefined;
export async function removeLabelFromIssueMock() {
    // Track the number of times 'removeLabelFromIssueMock' has been called.
    counter.rest.issues.removeLabel++;
    return Promise.resolve({});
}
removeLabelFromIssueMock.defaults = undefined;
removeLabelFromIssueMock.endpoint = undefined;
// Client
export const client = {
    rest: {
        issues: {
            get: getIssueMock,
            addLabels: addLabelsToIssueMock,
            removeLabel: removeLabelFromIssueMock,
        },
    },
};
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
    rest = v8.deserialize(v8.serialize(this.#initialCount.rest));
    reset() {
        this.rest = v8.deserialize(v8.serialize(this.#initialCount.rest));
    }
}
export const counter = new Counter();
