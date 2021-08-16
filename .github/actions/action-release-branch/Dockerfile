FROM node:14-slim

LABEL name="action-release-branch"
LABEL maintainer="Clay Miller <clay@smockle.com>"
LABEL version="1.0.0"
LABEL repository="https://github/smockle/action-autolabel"
LABEL homepage="https://github/smockle/action-autolabel"

LABEL com.github.actions.name="Release Branch"
LABEL com.github.actions.description="Removes source files, then pushes a commit to the release branch."
LABEL com.github.actions.icon="package"
LABEL com.github.actions.color="green"

RUN apt-get update && \
  apt-get install --no-install-recommends -y \
  ca-certificates \
  git && \
  apt-get clean -y && \
  rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
