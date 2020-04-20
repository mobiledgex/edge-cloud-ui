import { TYPE_JSON } from '../../constant'
import * as formatter from './format'
import * as serverData from './serverData'
import { SHOW_AUTO_PROV_POLICY, CREATE_AUTO_PROV_POLICY, DELETE_AUTO_PROV_POLICY, ADD_AUTO_PROV_POLICY_CLOUDLET, REMOVE_AUTO_PROV_POLICY_CLOUDLET } from './endPointTypes'

let fields = formatter.fields


export const keys = [
  { field: fields.region, label: 'Region', sortable: true, visible: true, filter:true },
  { field: fields.organizationName, serverField: 'key#OS#organization', label: 'Organization Name', sortable: true, visible: true, filter:true },
  { field: fields.autoPolicyName, serverField: 'key#OS#name', label: 'Auto Policy Name', sortable: true, visible: true, filter:true },
  { field: fields.deployClientCount, serverField: 'deploy_client_count', label: 'Deploy Client Count', sortable: true, visible: true, dataType: 'Integer', defaultValue: 0 },
  { field: fields.deployIntervalCount, serverField: 'deploy_interval_count', label: 'Deploy Interval Count', sortable: true, visible: true, dataType: 'Integer', defaultValue: 0 },
  { field: fields.cloudletCount, label: 'Cloudlet Count', sortable: false, visible: true },
  {
    field: fields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets',
    keys: [{ field: fields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet Name' },
    { field: fields.operatorName, serverField: 'key#OS#organization', label: 'Operator' },
    { field: fields.cloudletLocation, serverField: 'loc', label: 'Location', dataType: TYPE_JSON }]
  },
  { field: 'actions', label: 'Actions', sortable: false, visible: true, clickable: true }
]

const getKey = (data)=>
{
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

const getAutoProvKey = (data, isCreate) => {
  let autoProvPolicy = {}
  autoProvPolicy.key = getKey(data)
  if (isCreate) {
    autoProvPolicy.deploy_client_count = data[fields.deployClientCount] ? parseInt(data[fields.deployClientCount]) : undefined
    autoProvPolicy.deploy_interval_count = data[fields.deployIntervalCount] ? parseInt(data[fields.deployIntervalCount]) : undefined
  }
  return ({
    region: data[fields.region],
    autoProvPolicy: autoProvPolicy
  })
}

export const showAutoProvPolicies = (data) => {
  if (!formatter.isAdmin()) {
    {
      data.AutoProvPolicy = {
        key: {
          organization: formatter.getOrganization()
        }
      }
    }
  }
  return { method: SHOW_AUTO_PROV_POLICY, data: data }
}

export const getAutoProvPolicyList = async (self, data) => {
  return await serverData.showDataFromServer(self, showAutoProvPolicies(data))
}

export const deleteAutoProvPolicy = (data) => {
  let requestData = getAutoProvKey(data)
  return { method: DELETE_AUTO_PROV_POLICY, data: requestData, success: `Auto Provisioning Policy ${data[fields.autoPolicyName]}` }
}

export const createAutoProvPolicy = (data) => {
  let requestData = getAutoProvKey(data, true)
  return { method: CREATE_AUTO_PROV_POLICY, data: requestData}
}

export const addAutoProvCloudletKey = (data) => {
  let requestData = getAutoProvCloudletKey(data, true)
  return { method: ADD_AUTO_PROV_POLICY_CLOUDLET, data: requestData}
}

export const deleteAutoProvCloudletKey = (data) => {
  let requestData = getAutoProvCloudletKey(data, true)
  return { method: REMOVE_AUTO_PROV_POLICY_CLOUDLET, data: requestData}
}

/** 
 * Function to add customized data along with server data
 * **/
const customData = (value) => {
  value[fields.cloudletCount] = value[fields.cloudlets].length;
}

/** 
 * Format server data to required local data format based on keys object
 * **/
export const getData = (response, body) => {
  return formatter.formatData(response, body, keys, customData)
}
