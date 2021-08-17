# action-autolabel

Label issues based on matched strings.

## Inputs

### `search_objects`

**Required** A list of objects indicating the `text` to search for and the issue `label` to apply when a match is found. For example, `search_objects: [{ text: "4.1.1", label: "WCAG 4.1.1" }]`.

### `limit_matches`

**Optional** If truthy, searching will stop when a match is found (so one label will be applied at most). If falsey, every search object will be checked (so many labels may be applied). Default: `""` (which evaluates to `false`).

## Environment Variables

### `GH_TOKEN`

**Required** A [GitHub token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) with `repo` and `org:write` scopes.

## Example usage

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
      - uses: smockle/action-autolabel@main
        with:
          search_objects:
            - text: "4.1.1"
              label: "WCAG 4.1.1"
            - text: "4.1.2"
              label: "WCAG 4.1.2"
          limit_matches: ""
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
```
