FROM ubuntu:18.04

ARG TAG
ENV BUILD_VERSION=$TAG

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
	ca-certificates \
	gnupg
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
RUN echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" >/etc/apt/sources.list.d/mongodb-org-4.0.list
RUN apt-get update && apt-get install -y \
	git \
	mongodb-org=4.0.6 \
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
