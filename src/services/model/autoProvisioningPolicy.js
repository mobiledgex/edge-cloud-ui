import {TYPE_JSON} from '../../hoc/constant';
import { fields, formatData } from './format'

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
  return formatData(response, body, keys, customData)
}
