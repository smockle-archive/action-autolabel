import fs from "fs";
import url from "url";
import { promisify } from "util";
const readFile = promisify(fs.readFile);
const { URL } = url;
export async function getIssueMock() {
    // Track the number of times 'getIssueMock' has been called.
    getIssueMock.called++;
    // Return mock data read from a file.
    const path = new URL("./getIssueResponse.json", import.meta.url);
    const unparsedResponse = await readFile(path, "utf8");
    const response = JSON.parse(unparsedResponse);
    return Promise.resolve(response);
}
getIssueMock.defaults = undefined;
getIssueMock.endpoint = undefined;
getIssueMock.called = 0;
export async function addLabelsToIssueMock() {
    // Track the number of times 'addLabelsToIssueMock' has been called.
    addLabelsToIssueMock.called++;
    return Promise.resolve({});
}
addLabelsToIssueMock.defaults = undefined;
addLabelsToIssueMock.endpoint = undefined;
addLabelsToIssueMock.called = 0;
export async function removeLabelFromIssueMock() {
    // Track the number of times 'removeLabelFromIssueMock' has been called.
    removeLabelFromIssueMock.called++;
    return Promise.resolve({});
}
removeLabelFromIssueMock.defaults = undefined;
removeLabelFromIssueMock.endpoint = undefined;
removeLabelFromIssueMock.called = 0;
// Client
export const clientMock = {
    rest: {
        issues: {
            get: getIssueMock,
            addLabels: addLabelsToIssueMock,
            removeLabel: removeLabelFromIssueMock,
        },
    },
};
