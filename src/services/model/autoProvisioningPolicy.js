import {TYPE_JSON} from '../../hoc/constant';
import * as formatter from './format'

let fields = formatter.fields

export const SHOW_AUTO_PROV_POLICY = "ShowAutoProvPolicy";
export const CREATE_AUTO_PROV_POLICY = "CreateAutoProvPolicy";
export const DELETE_AUTO_PROV_POLICY= "DeleteAutoProvPolicy";
export const ADD_AUTO_PROV_POLICY_CLOUDLET = "AddAutoProvPolicyCloudlet";
export const REMOVE_AUTO_PROV_POLICY_CLOUDLET = "RemoveAutoProvPolicyCloudlet";


export const keys =[
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
  { field: 'actions', label: 'Actions', sortable: false, visible: true }
]

export const showAutoProvPolicies = (data) => {
  if (!formatter.isAdmin()) {
    {
      data.AutoProvPolicy = {
        key: {
          developer: formatter.getOrganization()
        }
      }
    }
    return { method: SHOW_AUTO_PROV_POLICY, data: data }
  }
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
