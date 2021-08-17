#!/usr/bin/env bash
# Adapted from https://dev.to/jeffreymfarley/deploy-atomically-with-travis--npm-68b
# and https://github.com/actions/typescript-action#publish-to-a-distribution-branch
set -eo pipefail

RELEASE_BRANCH="${1:-dist}"

# Set the user name and email to match the API token holder
# This will make sure the git commits will have the correct photo
# and the user gets the credit for a checkin
git config --global user.email "${GH_EMAIL}"
git config --global user.name "${GH_USERNAME}"
git config --global push.default matching

# Get the credentials from a file
git config credential.helper "store --file=.git/credentials"

# This associates the API Key with the account
echo "https://${GH_TOKEN}:@github.com" > .git/credentials

# Update indexed files.
# Include 'dist' and exclude '.github' and 'src'.
sed -i"" 's/^dist$//' .gitignore
echo "" >> .gitignore
echo ".github" >> .gitignore
echo "src" >> .gitignore

# Remove ignored files.
git rm -r --cached .

# Stash changed files.
git add .
git stash

# Get latest release branch.
git fetch -a
git checkout -b "${RELEASE_BRANCH}" --track "origin/${RELEASE_BRANCH}"
git pull origin "${RELEASE_BRANCH}"

# Commit changed files to release branch.
git stash pop
git commit -am "chore: publish release branch [skip ci]" || true # skip “no changes” error
git push origin HEAD:"refs/heads/${RELEASE_BRANCH}"