#!/usr/bin/env bash
set -eo pipefail

# Clean up dist folder.
rm -Rf dist

# Build project.
tsc

# Include the 'dist' and 'node_modules' directories.
sed -i.bak -e '/^dist$/d' -e '/^node_modules$/d' .gitignore && rm -f .gitignore.bak

# Exclude the '.github', 'scripts', and 'src' directories.
tee -a .gitignore >/dev/null << EOF
.github
scripts
src
EOF

# Prettify '.gitignore' formatting
sed -i.bak -e '/^$/d' .gitignore && rm -f .gitignore.bak