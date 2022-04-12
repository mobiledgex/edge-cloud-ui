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

import { showAuthSyncRequest } from '../../service';
import { redux_org } from '../../../helper/reduxData'
import { perpetual } from '../../../helper/constant'
import { endpoint } from '../..';
import { localFields } from '../../fields';
import { cloudletKeys } from '../cloudlet';

export const keys = () => ([
  { field: localFields.region, label: 'Region', sortable: true, visible: true, filter: true, key:true },
  { field: localFields.organizationName, serverField: 'key#OS#organization', label: 'Organization', sortable: true, visible: true, filter: true, key:true },
  { field: localFields.autoPolicyName, serverField: 'key#OS#name', label: 'Auto Policy Name', sortable: true, visible: true, filter: true, key:true },
  { field: localFields.deployClientCount, serverField: 'deploy_client_count', label: 'Deploy Request Count', sortable: true, visible: true, dataType: 'Integer', defaultValue: 0 },
  { field: localFields.deployIntervalCount, serverField: 'deploy_interval_count', label: 'Deploy Interval Count', sortable: true, visible: true, dataType: 'Integer', defaultValue: 0 },
  { field: localFields.undeployClientCount, serverField: 'undeploy_client_count', label: 'UnDeploy Request Count', sortable: true, visible: false, dataType: 'Integer', defaultValue: 0 },
  { field: localFields.undeployIntervalCount, serverField: 'undeploy_interval_count', label: 'UnDeploy Interval Count', sortable: true, visible: false, dataType: 'Integer', defaultValue: 0 },
  { field: localFields.minActiveInstances, serverField: 'min_active_instances', label: 'Min Active Instances', sortable: true, visible: false, dataType: 'Integer' },
  { field: localFields.maxInstances, serverField: 'max_instances', label: 'Max Instances', sortable: true, visible: false, dataType: 'Integer' },
  { field: localFields.cloudletCount, label: 'Cloudlet Count', sortable: false, visible: true },
  {
    field: localFields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets',
    keys: [{ field: localFields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet Name' },
    { field: localFields.operatorName, serverField: 'key#OS#organization', label: 'Operator' },
    { field: localFields.partnerOperator, serverField: 'key#OS#federated_organization', label: 'Partner Operator' },
    { field: localFields.cloudletLocation, serverField: 'loc', label: 'Location', dataType: perpetual.TYPE_JSON }]
  }
])

const getKey = (data) => {
  return { organization: data[localFields.organizationName], name: data[localFields.autoPolicyName] }
}

const getAutoProvCloudletKey = (data, isCreate) => {
  let autoProvPolicyCloudlet = {}
  autoProvPolicyCloudlet.key = getKey(data)
  if (isCreate) {
    autoProvPolicyCloudlet.cloudlet_key = cloudletKeys(data)
  }
  return ({
    region: data[localFields.region],
    autoProvPolicyCloudlet: autoProvPolicyCloudlet
  })
}

const getCloudletList = (cloudlets) => {
  let cloudletList = undefined
  if (cloudlets && cloudlets.length > 0) {
    cloudletList = []
    for (let i = 0; i < cloudlets.length; i++) {
      cloudletList.push({ key: cloudletKeys(cloudlets[i]) })
    }
  }
  return cloudletList
}

const getAutoProvKey = (data, isCreate) => {
  let autoProvPolicy = {}
  autoProvPolicy.key = getKey(data)
  if (isCreate) {
    autoProvPolicy.deploy_client_count = data[localFields.deployClientCount] ? parseInt(data[localFields.deployClientCount]) : undefined
    autoProvPolicy.undeploy_client_count = data[localFields.undeployClientCount] ? parseInt(data[localFields.undeployClientCount]) : undefined
    autoProvPolicy.deploy_interval_count = data[localFields.deployIntervalCount] ? parseInt(data[localFields.deployIntervalCount]) : undefined
    autoProvPolicy.undeploy_interval_count = data[localFields.undeployIntervalCount] ? parseInt(data[localFields.undeployIntervalCount]) : undefined
    autoProvPolicy.min_active_instances = data[localFields.minActiveInstances] ? parseInt(data[localFields.minActiveInstances]) : undefined
    autoProvPolicy.max_instances = data[localFields.maxInstances] ? parseInt(data[localFields.maxInstances]) : undefined
    autoProvPolicy.fields = data[localFields.fields] ? data[localFields.fields] : undefined
    autoProvPolicy.cloudlets = data[localFields.cloudlets] ? getCloudletList(data[localFields.cloudlets]) : undefined
  }
  return ({
    region: data[localFields.region],
    autoProvPolicy: autoProvPolicy
  })
}

export const showAutoProvPolicies = (self, data) => {
  let organization = redux_org.nonAdminOrg(self)
  if (organization && redux_org.isDeveloper(self)) {
    {
      data.AutoProvPolicy = { key: { organization } }
    }
  }
  return { method: endpoint.SHOW_AUTO_PROV_POLICY, data: data, keys: keys() }
}

export const getAutoProvPolicyList = async (self, data) => {
  return await showAuthSyncRequest(self, showAutoProvPolicies(self, data))
}

export const deleteAutoProvPolicy = (self, data) => {
  let requestData = getAutoProvKey(data)
  return { method: endpoint.DELETE_AUTO_PROV_POLICY, data: requestData, success: `Auto Provisioning Policy ${data[localFields.autoPolicyName]} deleted successfully` }
}

export const createAutoProvPolicy = (data) => {
  let requestData = getAutoProvKey(data, true)
  return { method: endpoint.CREATE_AUTO_PROV_POLICY, data: requestData }
}

export const updateAutoProvPolicy = (data) => {
  let requestData = getAutoProvKey(data, true)
  return { method: endpoint.UPDATE_AUTO_PROV_POLICY, data: requestData }
}

export const addAutoProvCloudletKey = (data) => {
  let requestData = getAutoProvCloudletKey(data, true)
  return { method: endpoint.ADD_AUTO_PROV_POLICY_CLOUDLET, data: requestData }
}

export const deleteAutoProvCloudletKey = (data) => {
  let requestData = getAutoProvCloudletKey(data, true)
  return { method: endpoint.REMOVE_AUTO_PROV_POLICY_CLOUDLET, data: requestData }
}

export const multiDataRequest = (keys, mcRequestList) => {
  let autoProvList = [];
  let appList = [];
  for (let i = 0; i < mcRequestList.length; i++) {
    let mcRequest = mcRequestList[i];
    let request = mcRequest.request;
    if (request.method === endpoint.SHOW_AUTO_PROV_POLICY) {
      autoProvList = mcRequest.response.data
    }
    else if (request.method === endpoint.SHOW_APP) {
      appList = mcRequest.response.data
    }
  }
  if (autoProvList && autoProvList.length > 0) {
    for (let i = 0; i < autoProvList.length; i++) {
      let autoProv = autoProvList[i]
      let apps = []
      for (let j = 0; j < appList.length; j++) {
        let app = appList[j]
        if (autoProv[localFields.autoPolicyName] === app[localFields.autoPolicyName]) {
          apps.push(app[localFields.appName])
        }
        else if (app[localFields.autoProvPolicies] && app[localFields.autoProvPolicies].includes(autoProv[localFields.autoPolicyName])) {
          apps.push(app[localFields.appName])
        }
      }
      if (apps.length > 0) {
        autoProv[localFields.apps] = apps
      }
    }
  }
  return autoProvList;
}