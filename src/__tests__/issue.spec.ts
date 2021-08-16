import type { RestEndpointMethodTypes } from "@octokit/rest"
type IssueResponse = RestEndpointMethodTypes["issues"]["get"]["response"]["data"];

import { getBody } from "../lib/issue"
import fs from "fs"
import url from "url";
import { promisify } from "util"
const readFile = promisify(fs.readFile)
const { URL } = url;

describe("Issue", () => {
  test("getBody", async () => {
    const path: url.URL = new URL("./issue.json", import.meta.url);
    const unparsedIssueResponse = await readFile(path, "utf8")
    const issueResponse: IssueResponse = JSON.parse(unparsedIssueResponse)
    expect(getBody(issueResponse)).toEqual(
      "Eligendi rerum deleniti quia repudiandae velit at non cumque `class=\"js-button button\"`. Ipsum tempore non doloribus aut labore autem fuga hic a nested `<div>` inside a `<span>`. Sit distinctio est occaecati pariatur ad aut similique et voluptas. Sapiente ut omnis enim quae libero voluptatem unde et.\r\n\r\n#### Fails\r\n\r\n[4.1.1 Parsing (level A)](https://www.w3.org/WAI/WCAG22/Understanding/parsing)\r\n\r\ncc @smockle\r\n\r\nView the [repository](https://github.com/smockle/action-autolabel)."
    );
  });
});