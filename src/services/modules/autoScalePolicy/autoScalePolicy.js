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

import { showAuthSyncRequest, authSyncRequest } from '../../service';
import { redux_org } from '../../../helper/reduxData'
import { endpoint } from '../..';
import { localFields } from '../../fields';

export const keys = () => ([
  { field: localFields.region, label: 'Region', sortable: true, visible: true, filter: true, key: true },
  { field: localFields.organizationName, serverField: 'key#OS#organization', label: 'Organization', sortable: true, visible: true, filter: true, key: true },
  { field: localFields.autoScalePolicyName, serverField: 'key#OS#name', label: 'Auto Scale Policy', sortable: true, visible: true, filter: true, key: true },
  { field: localFields.minimumNodes, serverField: 'min_nodes', label: 'Minimun Nodes', visible: true },
  { field: localFields.maximumNodes, serverField: 'max_nodes', label: 'Maximum Nodes', visible: true },
  { field: localFields.stabilizationWindowSec, serverField: 'stabilization_window_sec', label: 'Stabilization Window (sec)' },
  { field: localFields.targetActiveConnections, serverField: 'target_active_connections', label: 'Target Active Connections' },
  { field: localFields.targetMEM, serverField: 'target_mem', label: 'Target Memory (%)' },
  { field: localFields.targetCPU, serverField: 'target_cpu', label: 'Target CPU (%)' }
])

const getKey = (data, isCreate) => {
  let autoScalePolicy = {}
  autoScalePolicy.key = {
    organization: data[localFields.organizationName], name: data[localFields.autoScalePolicyName]
  }

  if (isCreate) {
    if (data[localFields.minimumNodes]) {
      autoScalePolicy.min_nodes = parseInt(data[localFields.minimumNodes])
    }
    if (data[localFields.maximumNodes]) {
      autoScalePolicy.max_nodes = parseInt(data[localFields.maximumNodes])
    }
    if (data[localFields.targetCPU]) {
      autoScalePolicy.target_cpu = parseInt(data[localFields.targetCPU])
    }
    if (data[localFields.targetMEM]) {
      autoScalePolicy.target_mem = parseInt(data[localFields.targetMEM])
    }
    if (data[localFields.targetActiveConnections]) {
      autoScalePolicy.target_active_connections = parseInt(data[localFields.targetActiveConnections])
    }
    if (data[localFields.stabilizationWindowSec]) {
      autoScalePolicy.stabilization_window_sec = parseInt(data[localFields.stabilizationWindowSec])
    }
    if (data[localFields.fields]) {
      autoScalePolicy.fields = data[localFields.fields]
    }
  }

  return {
    region: data[localFields.region],
    autoscalepolicy: autoScalePolicy
  }
}

export const showAutoScalePolicies = (self, data) => {
  let organization = redux_org.nonAdminOrg(self)
  if (organization && redux_org.isDeveloper(self)) {
    {
      data.autoscalepolicy = { key: { organization } }
    }
  }
  return { method: endpoint.SHOW_AUTO_SCALE_POLICY, data: data, keys: keys() }
}

export const getAutoScalePolicyList = async (self, data) => {
  return await showAuthSyncRequest(self, showAutoScalePolicies(self, data))
}

export const updateAutoScalePolicy = async (self, data) => {
  let requestData = getKey(data, true)
  let request = { method: endpoint.UPDATE_AUTO_SCALE_POLICY, data: requestData }
  return await authSyncRequest(self, request)
}


export const createAutoScalePolicy = (data) => {
  let requestData = getKey(data, true)
  return { method: endpoint.CREATE_AUTO_SCALE_POLICY, data: requestData }
}

export const deleteAutoScalePolicy = (self, data) => {
  let requestData = getKey(data)
  return { method: endpoint.DELETE_AUTO_SCALE_POLICY, data: requestData, success: `Auto Scale Policy ${data[localFields.autoScalePolicyName]} deleted successfully` }
}
