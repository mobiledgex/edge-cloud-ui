FROM ubuntu:18.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
	ca-certificates \
	git \
	nodejs \
	npm \
	supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Install dependencies
WORKDIR /edge-cloud-ui
COPY package.json .
RUN mkdir server
COPY server/package.json server/package.json
RUN npm install
WORKDIR server
RUN npm install

WORKDIR /edge-cloud-ui
COPY . .

ARG TAG
ENV BUILD_VERSION=$TAG

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
