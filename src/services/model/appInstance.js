import * as formatter from './format'
import * as constant from './shared';
import { TYPE_JSON } from '../../hoc/constant';

let fields = formatter.fields;

export const SHOW_APP_INST = "ShowAppInst";
export const CREATE_APP_INST = "CreateAppInst";
export const UPDATE_APP_INST = "UpdateAppInst";
export const DELETE_APP_INST = "DeleteAppInst";
export const STREAM_APP_INST = "StreamAppInst";

export const keys = [
  { field: fields.region, label: 'Region', sortable: true, visible: true },
  { field: fields.organizationName, serverField: 'key#OS#app_key#OS#developer_key#OS#name', sortable: true, label: 'Organization', visible: true },
  { field: fields.appName, serverField: 'key#OS#app_key#OS#name',  sortable: true, label: 'App', visible: true },
  { field: fields.version, serverField: 'key#OS#app_key#OS#version', label: 'Version', visible: true },
  { field: fields.operatorName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#operator_key#OS#name',  sortable: true, label: 'Operator', visible: true },
  { field: fields.cloudletName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#name',  sortable: true, label: 'Cloudlet', visible: true },
  { field: fields.cloudletLocation, serverField: 'cloudlet_loc', label: 'Cloudlet Location', dataType: TYPE_JSON },
  { field: fields.clusterName, serverField: 'key#OS#cluster_inst_key#OS#cluster_key#OS#name',  sortable: true, label: 'Cluster Instance', visible: true },
  { field: fields.deployment, label:'Deployment',  sortable: true, visible:true },
  { field: fields.uri, serverField: 'uri', label: 'URI' },
  { field: fields.liveness, serverField: 'liveness', label: 'Liveness' },
  { field: fields.mappedPorts, serverField: 'mapped_ports', label: 'Mapped Port', dataType: TYPE_JSON },
  { field: fields.flavorName, serverField: 'flavor#OS#name', label: 'Flavor' },
  { field: fields.state, serverField: 'state', label: 'Progress', visible: true, customizedData: constant.showProgress, clickable: true },
  { field: fields.runtimeInfo, serverField: 'runtime_info', label: 'Runtime', dataType: TYPE_JSON },
  { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: TYPE_JSON },
  { field: fields.status, serverField: 'status', label: 'Status', dataType: TYPE_JSON },
  { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const getKey = (data) => {
  return ({
    region: data[fields.region],
    appinst: {
      key: {
        app_key: { developer_key: { name: data[fields.organizationName] }, name: data[fields.appName], version: data[fields.version] },
        cluster_inst_key: {
          cloudlet_key: { name: data[fields.cloudletName], operator_key: { name: data[fields.operatorName] } },
          cluster_key: { name: data[fields.clusterName] },
          developer: data[fields.organizationName]
        }
      },
    }
  })
}

export const showAppInsts = (data) => {
  if (!formatter.isAdmin()) {
    {
      data.appinst = {
        key: {
          app_key: {
            developer_key: { name: formatter.getOrganization() },
          }
        }
      }
    }
  }
  return { method: SHOW_APP_INST, data: data }
}

export const deleteAppInst = (data) => {
  let requestData = getKey(data)
  return {uuid:data.uuid, method: DELETE_APP_INST, data : requestData, success:`App Instance ${data[fields.appName]}`}
}

export const streamAppInst = (data) => {
  let requestData = getKey(data)
  return {uuid:data.uuid, method: STREAM_APP_INST, data : requestData}
}

const customData = (value) => {
}

export const getData = (response, body) => {
  return formatter.formatData(response, body, keys, customData, true)
}