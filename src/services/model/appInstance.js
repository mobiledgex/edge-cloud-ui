import * as formatter from './format'
import uuid from 'uuid'
import * as constant from '../../constant'
import * as serverData from './serverData'
import { SHOW_APP_INST, CREATE_APP_INST, UPDATE_APP_INST, DELETE_APP_INST, STREAM_APP_INST, SHOW_APP, REFRESH_APP_INST, SHOW_CLOUDLET_INFO } from './endPointTypes'

let fields = formatter.fields;

export const keys = () => ([
  { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true },
  { field: fields.organizationName, serverField: 'key#OS#app_key#OS#organization', sortable: true, label: 'Organization', visible: true, filter: true },
  { field: fields.appName, serverField: 'key#OS#app_key#OS#name', sortable: true, label: 'App', visible: true, filter: true },
  { field: fields.version, serverField: 'key#OS#app_key#OS#version', label: 'Version', visible: true },
  { field: fields.operatorName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#organization', sortable: true, label: 'Operator', visible: true, filter: true },
  { field: fields.cloudletName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#name', sortable: true, label: 'Cloudlet', visible: true, filter: true },
  { field: fields.cloudletLocation, serverField: 'cloudlet_loc', label: 'Cloudlet Location', dataType: constant.TYPE_JSON },
  { field: fields.clusterdeveloper, serverField: 'key#OS#cluster_inst_key#OS#organization', sortable: true, label: 'Cluster Developer', visible: false },
  { field: fields.clusterName, serverField: 'key#OS#cluster_inst_key#OS#cluster_key#OS#name', sortable: true, label: 'Cluster Instance', visible: true, filter: true },
  { field: fields.privacyPolicyName, serverField: 'privacy_policy', label: 'Privacy Policy', visible: false },
  { field: fields.deployment, label: 'Deployment', sortable: true, visible: true, filter: true },
  { field: fields.accessType, label: 'Access Type' },
  { field: fields.uri, serverField: 'uri', label: 'URI' },
  { field: fields.liveness, serverField: 'liveness', label: 'Liveness' },
  { field: fields.mappedPorts, serverField: 'mapped_ports', label: 'Mapped Port', dataType: constant.TYPE_JSON },
  { field: fields.flavorName, serverField: 'flavor#OS#name', label: 'Flavor' },
  { field: fields.ipAccess, serverField: 'auto_cluster_ip_access', label: 'IP Access'},
  { field: fields.revision, serverField: 'revision', label: 'Revision', visible: false },
  { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true },
  { field: fields.powerState, serverField: 'power_state', label: 'Power State', visible: false },
  { field: fields.runtimeInfo, serverField: 'runtime_info', label: 'Runtime', dataType: constant.TYPE_JSON },
  { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: constant.TYPE_JSON },
  { field: fields.status, serverField: 'status', label: 'Status', dataType: constant.TYPE_JSON },
  { field: fields.configs, serverField: 'configs', label: 'Configs', dataType: constant.TYPE_JSON },
  { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
])

export const getKey = (data, isCreate) => {
  let appinst = {}
  appinst.key = {
    app_key: { organization: data[fields.organizationName], name: data[fields.appName], version: data[fields.version] },
    cluster_inst_key: {
      cloudlet_key: { name: data[fields.cloudletName], organization: data[fields.operatorName] },
      cluster_key: { name: data[fields.clusterName] ? data[fields.clusterName] : 'DefaultVMCluster' },
      organization: data[fields.clusterdeveloper] ? data[fields.clusterdeveloper] : data[fields.organizationName]
    }
  }

  if (isCreate) {
    if (data[fields.privacyPolicyName]) {
      appinst.privacy_policy = data[fields.privacyPolicyName]
    }

    if (data[fields.configs]) {
      appinst.configs = data[fields.configs]
    }

    if (data[fields.ipAccess]) {
      appinst.auto_cluster_ip_access = constant.IPAccessLabel(data[fields.ipAccess])
    }
  }

  return ({
    region: data[fields.region],
    appinst: appinst
  })
}

export const multiDataRequest = (keys, mcRequestList) => {
  let appInstList = [];
  let appList = [];
  let cloudletInfoList = [];
  for (let i = 0; i < mcRequestList.length; i++) {
    let mcRequest = mcRequestList[i];
    let request = mcRequest.request;
    if (request.method === SHOW_APP_INST) {
      appInstList = mcRequest.response.data
    }
    else if (request.method === SHOW_APP) {
      appList = mcRequest.response.data
    }
    else if (request.method === SHOW_CLOUDLET_INFO) {
      cloudletInfoList = mcRequest.response.data
    }
  }
  if (appInstList && appInstList.length > 0) {
    for (let i = 0; i < appInstList.length; i++) {
      let appInst = appInstList[i]
      for (let j = 0; j < appList.length; j++) {
        let app = appList[j]
        if (appInst[fields.appName] === app[fields.appName] && appInst[fields.version] === app[fields.version] && appInst[fields.organizationName] === app[fields.organizationName]) {
          appInst[fields.deployment] = app[fields.deployment];
          appInst[fields.accessType] = app[fields.accessType];
          appInst[fields.updateAvailable] = String(appInst[fields.revision]) !== String(app[fields.revision]);
          break;
        }
      }
      for (let j = 0; j < cloudletInfoList.length; j++) {
        let cloudletInfo = cloudletInfoList[j]
        if (appInst[fields.cloudletName] === cloudletInfo[fields.cloudletName] && appInst[fields.operatorName] === cloudletInfo[fields.operatorName]) {
          appInst[fields.cloudletStatus] = cloudletInfo[fields.state]
        }
      }
      appInst[fields.cloudletStatus] = appInst[fields.cloudletStatus] ? appInst[fields.cloudletStatus] : constant.CLOUDLET_STATUS_UNKNOWN
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

export const getAppInstList = async (self, data) => {
  return await serverData.showDataFromServer(self, showAppInsts(data))
}

export const createAppInst = (self, data, callback) => {
  let requestData = getKey(data, true)
  data.uuid = data[fields.cloudletName]
  let request = { uuid: data.uuid, method: CREATE_APP_INST, data: requestData }
  return serverData.sendWSRequest(self, request, callback, data)
}

export const updateAppInst = (self, data, callback) =>{
  let requestData = getKey(data, true)
  let updateFields = ["27", '27.1', '27.2']
  requestData.appinst.fields = updateFields
  let request = { uuid: data.uuid ? data.uuid : uuid(), method: UPDATE_APP_INST, data: requestData }
  return serverData.sendWSRequest(self, request, callback, data)
}

export const changePowerState = (data) => {
  let requestData = getKey(data)
  requestData.appinst.power_state = data[fields.powerState]
  requestData.appinst.fields = ['31']
  return { uuid: data.uuid, method: UPDATE_APP_INST, data: requestData}
}

export const deleteAppInst = (data) => {
  let requestData = getKey(data)
  if (data[fields.cloudletStatus] !== constant.CLOUDLET_STATUS_READY && formatter.isAdmin()) {
    requestData.appinst.crm_override = constant.CRM_OVERRIDE_IGNORE_CRM
  }
  return { uuid: data.uuid, method: DELETE_APP_INST, data: requestData, success: `App Instance ${data[fields.appName]} deleted successfully` }
}

export const refreshAppInst = (data) => {
  let requestData = getKey(data)
  return { uuid: data.uuid, method: REFRESH_APP_INST, data: requestData, success: `App Instance ${data[fields.appName]}` }
}

export const refreshAllAppInst = (data) => {
  let requestData = {
    region: data[fields.region],
    appinst: {
      key: {
        app_key: {
          organization: data[fields.organizationName],
          name: data[fields.appName],
          version: data[fields.version]
        }
      },
      update_multiple: true
    },
  }
  return { uuid: data.uuid, method: REFRESH_APP_INST, data: requestData }
}

export const streamAppInst = (data) => {
  let requestData = getKey(data)
  return { uuid: data.uuid, method: STREAM_APP_INST, data: requestData }
}

const customData = (value) => {
  value[fields.liveness] = constant.liveness(value[fields.liveness])
  value[fields.ipAccess] = value[fields.ipAccess] ? constant.IPAccessLabel(value[fields.ipAccess]) : undefined
  value[fields.revision] = value[fields.revision] ? value[fields.revision] : '0'
}

export const getData = (response, body) => {
  return formatter.formatData(response, body, keys(), customData, true)
}