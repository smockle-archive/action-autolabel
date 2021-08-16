# action-release-branch

Removes source files, then pushes a commit to the release branch.

## Inputs

### `release_branch`

**Optional** Release branch name. Default: `"dist"`.

## Environment Variables

### `GH_EMAIL`

**Required** Email address to associate with the release commit.

### `GH_USERNAME`

**Required** GitHub username to associate with the release commit.

### `GH_TOKEN`

**Required** A [GitHub token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the `repo` scope.

## Example usage

```YAML
- name: Update release branch
  uses: "./.github/actions/action-release-branch"
  with:
    release_branch: "dist"
  env:
    GH_EMAIL: ${{ secrets.GH_EMAIL }}
    GH_USERNAME: ${{ secrets.GH_USERNAME }}
    GH_TOKEN: ${{ secrets.GH_TOKEN }}
```
