# Copyright 2022 MobiledgeX, Inc
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM ubuntu:18.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y \
	ca-certificates \
	curl \
	git
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
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
ARG REACT_APP_GA_MEASUREMENT_ID
ENV BUILD_VERSION=$TAG
ENV REACT_APP_BUILD_VERSION=$TAG
ENV REACT_APP_GA_MEASUREMENT_ID=$REACT_APP_GA_MEASUREMENT_ID

ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV HTTPS=true
ENV CI=true
CMD ["/usr/bin/npm", "start"]
