# action-autolabel

Label issues based on matched strings.

## Usage

### Inputs

#### `search_objects`

**Required** A JSON-stringified list of objects indicating the `text` to search for and the issue `label` to apply when a match is found. For example, `search_objects: '[{ "text": "4.1.1", "label": "WCAG 4.1.1" }]'`.

#### `limit_matches`

**Optional** If `true`, searching will stop when a match is found (so one label will be applied at most). If `false`, every search object will be checked (so many labels may be applied). Default: `false`.

#### `owner`

**Optional** The owner of the repo containing the issue to autolabel. This is a GitHub username if the repo is user-owned, or a GitHub org name if the repo is org-owned. For example, `owner: smockle`. By default, `owner` is the owner of the repo containing the workflow running `smockle/action-autolabel`.

#### `repo`

**Optional** The name of the repo containing the issue to autolabel. For example, `repo: action-autolabel`. By default, `repo` is the repo containing the workflow running `smockle/action-autolabel`.

#### `issue_numbers`

**Required** A space-delimited list of issue numbers indicating the issues to autolabel. For example, `issue_numbers: "1 2 3"`. When [`issues.opened`](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#issues) triggers the workflow, `issues_numbers` defaults to the newly-opened issue’s number, so `issue_numbers` is optional. In all other cases, `issue_numbers` is required.

### Environment Variables

#### `GH_TOKEN`

**Required** A [GitHub token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the `public_repo` (for use in public repos) or `repo` (for use in private repos) scope.

### Example workflow

```YAML
name: Autolabel
on:
  # Run manually
  workflow_dispatch:
  # Run daily
  schedule:
    - cron: "0 0 * * *" # https://crontab.guru/daily
  # Run when issues are created
  issues:
    types: [opened]

jobs:
  wcag_labeler:
    name: WCAG Labeler
    runs-on: ubuntu-latest
    steps:
      - uses: smockle/action-autolabel@dist
        with:
          search_objects: '[{ text: "4.1.1", label: "WCAG 4.1.1" }, { text: "4.1.2", label: "4.1.2" }]'
          limit_matches: false
          owner: smockle
          repo: action-autolabel
          issue_numbers: "1"
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
```

## Development

### Testing

`smockle/action-autolabel` includes unit and integration tests. After cloning the `smockle/action-autolabel` repo locally, run `npm install` in the project folder to install dependencies. Run `npm run test:unit` to execute unit tests, or run `npm run test:integration` to execute integration tests. A GitHub token with the `public_repo` (for use in public repos) or `repo` (for use in private repos) scope is required to be present in the environment as `GH_TOKEN` to run integration tests.

### Publishing

After every commit to [`main`](https://github.com/smockle/action-autolabel/tree/main), the [“Publish” workflow](https://github.com/smockle/action-autolabel/blob/main/.github/workflows/publish.yml) uses [smockle/action-release-branch](https://github.com/smockle/action-release-branch) to build and deploy to the [`dist` branch](https://github.com/smockle/action-autolabel/tree/dist) (which, as noted in [Example usage](#example-usage) above, is the branch users should specify in their workflows: `uses: smockle/action-autolabel@dist`).
