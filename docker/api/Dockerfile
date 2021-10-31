FROM ubuntu:bionic
LABEL maintainer="Brian Douglass"

RUN apt-get update && \
    apt-get -y -f --no-install-recommends install gnupg ubuntu-keyring software-properties-common curl sudo && \
    curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - && \
    add-apt-repository ppa:bhdouglass/clickable && \
    apt-get update && \
    apt-get install -y nodejs click-reviewers-tools && \
    apt-get -y remove software-properties-common curl && \
    apt-get -y autoremove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    npm install supervisor -g && \
    mkdir /srv/screenshots

EXPOSE 8080
WORKDIR /srv/openstore
CMD ["npm", "run", "dev"]
