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
import { cloudletKeys } from "../../modules/cloudlet/primary"

const initialize = (parent, field, value) => {
  if (value) {
    parent = parent ? parent : {}
    parent[field] = value
  }
  return parent
}

export const CIK_CLOUDLET_CLUSTER = 1
export const CIK_CLOUDLET = 2
export const CIK_CLUSTER = 3
export const CIK_CLUSTER_ALL = 4

export const clusterInstKeys = (data, include) => {
  include = include !== undefined ? include : CIK_CLUSTER_ALL
  let clusterInstKey = undefined

  clusterInstKey = initialize(clusterInstKey, 'organization', data[localFields.clusterdeveloper] ? data[localFields.clusterdeveloper] : data[localFields.organizationName])

  if (include === CIK_CLOUDLET || include === CIK_CLOUDLET_CLUSTER) {
    clusterInstKey = initialize(clusterInstKey, 'cloudlet_key', cloudletKeys(data))
  }

  if (include === CIK_CLOUDLET_CLUSTER) {
    let clusterKey = undefined
    clusterKey = initialize(clusterKey, 'name', data[localFields.clusterName])
    clusterInstKey = initialize(clusterInstKey, 'cluster_key', clusterKey)
  }
  return clusterInstKey
}