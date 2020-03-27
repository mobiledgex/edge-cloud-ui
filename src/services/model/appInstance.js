import * as formatter from './format'
import uuid from 'uuid'
import { TYPE_JSON } from '../../constant'
import * as serverData from './serverData'
import { SHOW_APP_INST, CREATE_APP_INST, UPDATE_APP_INST, DELETE_APP_INST, STREAM_APP_INST, SHOW_APP } from './endPointTypes'

let fields = formatter.fields;

export const keys = [
  { field: fields.region, label: 'Region', sortable: true, visible: true },
  { field: fields.organizationName, serverField: 'key#OS#app_key#OS#organization', sortable: true, label: 'Organization', visible: true },
  { field: fields.appName, serverField: 'key#OS#app_key#OS#name', sortable: true, label: 'App', visible: true },
  { field: fields.version, serverField: 'key#OS#app_key#OS#version', label: 'Version', visible: true },
  { field: fields.operatorName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#organization', sortable: true, label: 'Operator', visible: true },
  { field: fields.cloudletName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#name', sortable: true, label: 'Cloudlet', visible: true },
  { field: fields.cloudletLocation, serverField: 'cloudlet_loc', label: 'Cloudlet Location', dataType: TYPE_JSON },
  { field: fields.clusterName, serverField: 'key#OS#cluster_inst_key#OS#cluster_key#OS#name', sortable: true, label: 'Cluster Instance', visible: true },
  { field: fields.deployment, label: 'Deployment', sortable: true, visible: true },
  { field: fields.uri, serverField: 'uri', label: 'URI' },
  { field: fields.liveness, serverField: 'liveness', label: 'Liveness' },
  { field: fields.mappedPorts, serverField: 'mapped_ports', label: 'Mapped Port', dataType: TYPE_JSON },
  { field: fields.flavorName, serverField: 'flavor#OS#name', label: 'Flavor' },
  { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true },
  { field: fields.runtimeInfo, serverField: 'runtime_info', label: 'Runtime', dataType: TYPE_JSON },
  { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: TYPE_JSON },
  { field: fields.status, serverField: 'status', label: 'Status', dataType: TYPE_JSON },
  { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const getKey = (data, isCreate) => {
  if (data) {
    return ({
      region: data[fields.region],
      appinst: {
        key: {
          app_key: { organization: data[fields.organizationName], name: data[fields.appName], version: data[fields.version] },
          cluster_inst_key: {
            cloudlet_key: { name: data[fields.cloudletName], organization: data[fields.operatorName] },
            cluster_key: { name: data[fields.clusterName] },
            organization: data[fields.organizationName]
          }
        },
      }
    })
  }
  return {}
}

export const multiDataRequest = (keys, mcRequestList) => {
  let appInstList = [];
  let appList = [];
  for (let i = 0; i < mcRequestList.length; i++) {
    let mcRequest = mcRequestList[i];
    let request = mcRequest.request;
    if (request.method === SHOW_APP_INST) {
      appInstList = mcRequest.response.data
    }
    else if (request.method === SHOW_APP) {
      appList = mcRequest.response.data
    }
  }

  if (appInstList && appInstList.length > 0) {
    for (let i = 0; i < appInstList.length; i++) {
      let appInst = appInstList[i]
      for (let j = 0; j < appList.length; j++) {
        let app = appList[j]
        if (appInst[fields.appName] === app[fields.appName]) {
          appInst[fields.deployment] = app[fields.deployment];
          break;
        }
      }
    }
  }
  return appInstList;
}

export const showAppInsts = (data) => {
  if (!formatter.isAdmin()) {
    {
      data.appinst = {
        key: {
          app_key: {
            organization: formatter.getOrganization(),
          }
        }
      }
    }
  }
  return { method: SHOW_APP_INST, data: data }
}

export const createAppInst = (data, callback) => {
  let requestData = getKey(data, true)
  let request = { uuid: data.uuid ? data.uuid : uuid(), method: CREATE_APP_INST, data: requestData }
  return serverData.sendWSRequest(request, callback)
}

export const deleteAppInst = (data) => {
  let requestData = getKey(data)
  return { uuid: data.uuid, method: DELETE_APP_INST, data: requestData, success: `App Instance ${data[fields.appName]}` }
}

export const streamAppInst = (data) => {
  let requestData = getKey(data)
  return { uuid: data.uuid, method: STREAM_APP_INST, data: requestData }
}

const customData = (value) => {
}

export const getData = (response, body) => {
  return formatter.formatData(response, body, keys, customData, true)
}