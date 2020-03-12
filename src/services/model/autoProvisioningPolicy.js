import { TYPE_JSON } from '../../constant';
import * as formatter from './format'
import { SHOW_AUTO_PROV_POLICY, CREATE_AUTO_PROV_POLICY, DELETE_AUTO_PROV_POLICY, ADD_AUTO_PROV_POLICY_CLOUDLET, REMOVE_AUTO_PROV_POLICY_CLOUDLET } from './endPointTypes'

let fields = formatter.fields


export const keys = [
  { field: fields.region, label: 'Region', sortable: true, visible: true },
  { field: fields.organizationName, serverField: 'key#OS#developer', label: 'Organization Name', sortable: true, visible: true },
  { field: fields.autoPolicyName, serverField: 'key#OS#name', label: 'Auto Policy Name', sortable: false, visible: true },
  { field: fields.deployClientCount, serverField: 'deploy_client_count', label: 'Deploy Client Count', sortable: false, visible: true, dataType: 'Integer', defaultValue: 0 },
  { field: fields.deployIntervalCount, serverField: 'deploy_interval_count', label: 'Deploy Interval Count', sortable: false, visible: true, dataType: 'Integer', defaultValue: 0 },
  { field: fields.cloudletCount, label: 'Cloudlet Count', sortable: false, visible: true },
  {
    field: fields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets',
    keys: [{ field: fields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet Name' },
    { field: fields.operatorName, serverField: 'key#OS#operator_key#OS#name', label: 'Operator' },
    { field: fields.cloudletLocation, serverField: 'loc', label: 'Location', dataType: TYPE_JSON }]
  },
  { field: 'actions', label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const getKey = (data) => {
  return ({
    region: data[fields.region],
    AutoProvPolicy: { key: { developer: data[fields.organizationName], name: data[fields.autoPolicyName] } }
  })
}

export const showAutoProvPolicies = (data) => {
  if (!formatter.isAdmin()) {
    {
      data.AutoProvPolicy = {
        key: {
          developer: formatter.getOrganization()
        }
      }
    }
  }
  return { method: SHOW_AUTO_PROV_POLICY, data: data }
}

export const deleteAutoProvPolicy = (data) => {
  let requestData = getKey(data)
  return { method: DELETE_AUTO_PROV_POLICY, data: requestData, success: `Auto Provisioning Policy ${data[fields.autoPolicyName]}` }
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
