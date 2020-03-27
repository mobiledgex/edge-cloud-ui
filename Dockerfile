FROM ubuntu:18.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
	ca-certificates \
	curl \
	git
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get update && apt-get install -y \
	nodejs

# Install dependencies
WORKDIR /edge-cloud-ui
COPY package.json .
RUN npm install

WORKDIR /edge-cloud-ui
COPY . .
RUN sed -i "s/protocol: 'ws'/protocol: 'wss'/" /edge-cloud-ui/node_modules/react-dev-utils/webpackHotDevClient.js

ARG TAG
ENV BUILD_VERSION=$TAG
ENV REACT_APP_BUILD_VERSION=$TAG

ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV HTTPS=true
ENV CI=true
CMD ["/usr/bin/npm", "start"]
