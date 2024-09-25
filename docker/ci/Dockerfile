FROM node:22
LABEL maintainer="Brian Douglass"

RUN apt-get update && \
    apt-get install -y openssh-client rsync python3 python3-pip python3-distutils-extra python3-apt && \
    pip3 install --break-system-packages click-reviewers-tools && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p ~/.ssh && \
    chmod 700 ~/.ssh && \
    touch ~/.ssh/known_hosts && \
    chmod 644 ~/.ssh/known_hosts
