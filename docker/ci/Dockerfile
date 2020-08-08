FROM node:12
LABEL maintainer="Brian Douglass"

RUN apt-get update && \
    apt-get install -y openssh-client rsync && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p ~/.ssh && \
    chmod 700 ~/.ssh && \
    touch ~/.ssh/known_hosts && \
    chmod 644 ~/.ssh/known_hosts
