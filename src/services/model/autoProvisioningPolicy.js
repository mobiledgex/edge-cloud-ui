import { TYPE_JSON } from '../../constant'
import * as formatter from './format'
import * as serverData from './serverData'
import { getCloudletKey } from './cloudlet'
import { SHOW_AUTO_PROV_POLICY, CREATE_AUTO_PROV_POLICY, UPDATE_AUTO_PROV_POLICY, DELETE_AUTO_PROV_POLICY, ADD_AUTO_PROV_POLICY_CLOUDLET, REMOVE_AUTO_PROV_POLICY_CLOUDLET, SHOW_APP } from './endPointTypes'
import { redux_org } from '../../helper/reduxData'

let fields = formatter.fields

export const keys = () => ([
  { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, key:true },
  { field: fields.organizationName, serverField: 'key#OS#organization', label: 'Organization', sortable: true, visible: true, filter: true, key:true },
  { field: fields.autoPolicyName, serverField: 'key#OS#name', label: 'Auto Policy Name', sortable: true, visible: true, filter: true, key:true },
  { field: fields.deployClientCount, serverField: 'deploy_client_count', label: 'Deploy Request Count', sortable: true, visible: true, dataType: 'Integer', defaultValue: 0 },
  { field: fields.deployIntervalCount, serverField: 'deploy_interval_count', label: 'Deploy Interval Count', sortable: true, visible: true, dataType: 'Integer', defaultValue: 0 },
  { field: fields.undeployClientCount, serverField: 'undeploy_client_count', label: 'UnDeploy Request Count', sortable: true, visible: false, dataType: 'Integer', defaultValue: 0 },
  { field: fields.undeployIntervalCount, serverField: 'undeploy_interval_count', label: 'UnDeploy Interval Count', sortable: true, visible: false, dataType: 'Integer', defaultValue: 0 },
  { field: fields.minActiveInstances, serverField: 'min_active_instances', label: 'Min Active Instances', sortable: true, visible: false, dataType: 'Integer' },
  { field: fields.maxInstances, serverField: 'max_instances', label: 'Max Instances', sortable: true, visible: false, dataType: 'Integer' },
  { field: fields.cloudletCount, label: 'Cloudlet Count', sortable: false, visible: true },
  {
    field: fields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets',
    keys: [{ field: fields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet Name' },
    { field: fields.operatorName, serverField: 'key#OS#organization', label: 'Operator' },
    { field: fields.cloudletLocation, serverField: 'loc', label: 'Location', dataType: TYPE_JSON }]
  },
  { field: 'actions', label: 'Actions', sortable: false, visible: true, clickable: true }
])

const getKey = (data) => {
  return { organization: data[fields.organizationName], name: data[fields.autoPolicyName] }
}

const getAutoProvCloudletKey = (data, isCreate) => {
  let autoProvPolicyCloudlet = {}
  autoProvPolicyCloudlet.key = getKey(data)
  if (isCreate) {
    autoProvPolicyCloudlet.cloudlet_key = { name: data[fields.cloudletName], organization: data[fields.operatorName] }
  }
  return ({
    region: data[fields.region],
    autoProvPolicyCloudlet: autoProvPolicyCloudlet
  })
}

const getCloudletList = (cloudlets) => {
  let cloudletList = undefined
  if (cloudlets && cloudlets.length > 0) {
    cloudletList = []
    for (let i = 0; i < cloudlets.length; i++) {
      cloudletList.push({ key: getCloudletKey(cloudlets[i]) })
    }
  }
  return cloudletList
}

const getAutoProvKey = (data, isCreate) => {
  let autoProvPolicy = {}
  autoProvPolicy.key = getKey(data)
  if (isCreate) {
    autoProvPolicy.deploy_client_count = data[fields.deployClientCount] ? parseInt(data[fields.deployClientCount]) : undefined
    autoProvPolicy.undeploy_client_count = data[fields.undeployClientCount] ? parseInt(data[fields.undeployClientCount]) : undefined
    autoProvPolicy.deploy_interval_count = data[fields.deployIntervalCount] ? parseInt(data[fields.deployIntervalCount]) : undefined
    autoProvPolicy.undeploy_interval_count = data[fields.undeployIntervalCount] ? parseInt(data[fields.undeployIntervalCount]) : undefined
    autoProvPolicy.min_active_instances = data[fields.minActiveInstances] ? parseInt(data[fields.minActiveInstances]) : undefined
    autoProvPolicy.max_instances = data[fields.maxInstances] ? parseInt(data[fields.maxInstances]) : undefined
    autoProvPolicy.fields = data[fields.fields] ? data[fields.fields] : undefined
    autoProvPolicy.cloudlets = data[fields.cloudlets] ? getCloudletList(data[fields.cloudlets]) : undefined
  }
  return ({
    region: data[fields.region],
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
  return { method: SHOW_AUTO_PROV_POLICY, data: data }
}

export const getAutoProvPolicyList = async (self, data) => {
  return await serverData.showDataFromServer(self, showAutoProvPolicies(self, data))
}

export const deleteAutoProvPolicy = (self, data) => {
  let requestData = getAutoProvKey(data)
  return { method: DELETE_AUTO_PROV_POLICY, data: requestData, success: `Auto Provisioning Policy ${data[fields.autoPolicyName]} deleted successfully` }
}

export const createAutoProvPolicy = (data) => {
  let requestData = getAutoProvKey(data, true)
  return { method: CREATE_AUTO_PROV_POLICY, data: requestData }
}

export const updateAutoProvPolicy = (data) => {
  let requestData = getAutoProvKey(data, true)
  return { method: UPDATE_AUTO_PROV_POLICY, data: requestData }
}

export const addAutoProvCloudletKey = (data) => {
  let requestData = getAutoProvCloudletKey(data, true)
  return { method: ADD_AUTO_PROV_POLICY_CLOUDLET, data: requestData }
}

export const deleteAutoProvCloudletKey = (data) => {
  let requestData = getAutoProvCloudletKey(data, true)
  return { method: REMOVE_AUTO_PROV_POLICY_CLOUDLET, data: requestData }
}

export const multiDataRequest = (keys, mcRequestList) => {
  let autoProvList = [];
  let appList = [];
  for (let i = 0; i < mcRequestList.length; i++) {
    let mcRequest = mcRequestList[i];
    let request = mcRequest.request;
    if (request.method === SHOW_AUTO_PROV_POLICY) {
      autoProvList = mcRequest.response.data
    }
    else if (request.method === SHOW_APP) {
      appList = mcRequest.response.data
    }
  }
  if (autoProvList && autoProvList.length > 0) {
    for (let i = 0; i < autoProvList.length; i++) {
      let autoProv = autoProvList[i]
      let apps = []
      for (let j = 0; j < appList.length; j++) {
        let app = appList[j]
        if (autoProv[fields.autoPolicyName] === app[fields.autoPolicyName]) {
          apps.push(app[fields.appName])
        }
        else if (app[fields.autoProvPolicies] && app[fields.autoProvPolicies].includes(autoProv[fields.autoPolicyName])) {
          apps.push(app[fields.appName])
        }
      }
      if (apps.length > 0) {
        autoProv[fields.apps] = apps
      }
    }
  }
  return autoProvList;
}

/** 
 * Function to add customized data along with server data
 * **/
const customData = (value) => {
  value[fields.cloudletCount] = value[fields.cloudlets].length;
  return value
}

/** 
 * Format server data to required local data format based on keys object
 * **/
export const getData = (response, body) => {
  return formatter.formatData(response, body, keys(), customData, true)
}
