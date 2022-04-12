/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { localFields } from "../../fields"


export const CK_ORG_NAME_FEDERATOR = 0
export const CK_ORG = 1
export const CK_NAME = 2
export const CK_FEDERATOR = 3

const initialize = (parent, field, value) => {
  if (value) {
    parent = parent ? parent : {}
    parent[field] = value
  }
  return parent
}

export const cloudletKeys = (data, include) => {
  let cloudletKey = undefined
  include = Boolean(include) ? include : CK_ORG_NAME_FEDERATOR
  if (include === CK_ORG_NAME_FEDERATOR || include === CK_NAME) {
    cloudletKey = initialize(cloudletKey, 'name', data[localFields.cloudletName])
  }
  if (include === CK_ORG_NAME_FEDERATOR || include === CK_ORG) {
    cloudletKey = initialize(cloudletKey, 'organization', data[localFields.operatorName] ? data[localFields.operatorName] : data[localFields.organizationName])
  }
  if (include === CK_ORG_NAME_FEDERATOR || include === CK_FEDERATOR) {
    cloudletKey = initialize(cloudletKey, 'federated_organization', data[localFields.partnerOperator])
  }
  return cloudletKey
}