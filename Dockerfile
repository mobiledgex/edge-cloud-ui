FROM ubuntu:18.04

ARG TAG
ENV BUILD_VERSION=$TAG

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
	ca-certificates \
	git \
	nodejs \
	npm \
	supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

WORKDIR /edge-cloud-ui
COPY . .
RUN mkdir server/mongodb_data

RUN npm install
WORKDIR server
RUN npm install

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
