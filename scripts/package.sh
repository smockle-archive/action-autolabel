#!/usr/bin/env bash
set -eo pipefail

# Clean up dist folder.
rm -Rf dist

# Build project.
tsc

# Update indexed files.
sed -i"" 's/^dist$//' .gitignore
sed -i"" 's/^node_modules$//' .gitignore
echo "" >> .gitignore
tee -a .gitignore << EOF
.github
src
EOF
