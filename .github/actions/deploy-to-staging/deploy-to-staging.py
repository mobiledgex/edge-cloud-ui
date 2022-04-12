#!/usr/local/bin/python
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


import argparse
import os
import requests
import sys

def die(msg, rc=2):
    print(f"::error::{msg}")
    sys.exit(rc)

def main(args):
    try:
        username = os.environ["INPUT_JENKINS_USERNAME"]
        api_token = os.environ["INPUT_JENKINS_API_TOKEN"]
        build_token = os.environ["INPUT_JENKINS_BUILD_TOKEN"]
    except KeyError as e:
        die(f"Mandatory variable not set: {e}")

    r = requests.get("{0}/crumbIssuer/api/json".format(args.jenkins_server),
                     auth=(username, api_token))
    if r.status_code != requests.codes.ok:
        die("Failed to retrieve Jenkins crumb: {0}".format(r.text))

    resp = r.json()
    crumb = resp["crumb"]
    header = resp["crumbRequestField"]

    r = requests.post("{0}/job/console-deploy/buildWithParameters?token={1}&TAG={2}".format(
                            args.jenkins_server, build_token, args.tag),
                      auth=(username, api_token))
    if r.status_code != requests.codes.created:
        die("Failed to queue deploy job: {0}".format(r.text))

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument("--jenkins-server", help="Jenkins server",
                        default="https://nightly.mobiledgex.net")
    parser.add_argument("--tag", help="Build tag", default="latest")
    args = parser.parse_args()

    main(args)
