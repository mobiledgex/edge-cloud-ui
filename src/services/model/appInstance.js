import * as formatter from './format'
import * as constant from '../../constant'
import * as serverData from './serverData'
import { SHOW_APP_INST, CREATE_APP_INST, UPDATE_APP_INST, DELETE_APP_INST, STREAM_APP_INST, SHOW_APP, REFRESH_APP_INST, SHOW_CLOUDLET_INFO, SHOW_ORG_CLOUDLET_INFO, SHOW_AUTO_PROV_POLICY } from './endPointTypes'
import { FORMAT_FULL_DATE_TIME } from '../../utils/date_util'

let fields = formatter.fields;
const userRole = formatter.getUserRole()

export const keys = () => ([
  { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key:true },
  { field: fields.organizationName, serverField: 'key#OS#app_key#OS#organization', sortable: true, label: 'Organization', visible: true, filter: true, group: true, key:true },
  { field: fields.appName, serverField: 'key#OS#app_key#OS#name', sortable: true, label: 'App', visible: true, filter: true, group: true, key:true },
  { field: fields.version, serverField: 'key#OS#app_key#OS#version', label: 'Version', visible: true, key:true },
  { field: fields.operatorName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#organization', sortable: true, label: 'Operator', visible: true, filter: true, group: true, key:true },
  { field: fields.cloudletName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#name', sortable: true, label: 'Cloudlet', visible: true, filter: true, group: true, key:true },
  { field: fields.cloudletLocation, serverField: 'cloudlet_loc', label: 'Cloudlet Location', dataType: constant.TYPE_JSON },
  { field: fields.clusterdeveloper, serverField: 'key#OS#cluster_inst_key#OS#organization', sortable: true, label: 'Cluster Developer', visible: false, key:true },
  { field: fields.clusterName, serverField: 'key#OS#cluster_inst_key#OS#cluster_key#OS#name', sortable: true, label: 'Cluster Instance', visible: true, filter: true, group: true, key:true },
  { field: fields.realclustername, serverField: 'real_cluster_name', sortable: true, label: 'Real Cluster Name', visible: false, filter: false},
  { field: fields.deployment, label: 'Deployment', sortable: true, visible: true, filter: true, group: true },
  { field: fields.accessType, label: 'Access Type' },
  { field: fields.uri, serverField: 'uri', label: 'URI' },
  { field: fields.liveness, serverField: 'liveness', label: 'Liveness' },
  { field: fields.mappedPorts, serverField: 'mapped_ports', label: 'Mapped Port', dataType: constant.TYPE_JSON },
  { field: fields.flavorName, serverField: 'flavor#OS#name', label: 'Flavor' },
  { field: fields.ipAccess, serverField: 'auto_cluster_ip_access', label: 'IP Access' },
  { field: fields.sharedVolumeSize, serverField: 'shared_volume_size', label: 'Shared Volume Size' },
  { field: fields.revision, serverField: 'revision', label: 'Revision', visible: false },
  { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true },
  { field: fields.powerState, serverField: 'power_state', label: 'Power State', visible: false },
  { field: fields.runtimeInfo, serverField: 'runtime_info', label: 'Runtime', dataType: constant.TYPE_JSON },
  { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: constant.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
  { field: fields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: constant.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
  { field: fields.status, serverField: 'status', label: 'Status', dataType: constant.TYPE_JSON },
  { field: fields.configs, serverField: 'configs', label: 'Configs', dataType: constant.TYPE_JSON },
  { field: fields.healthCheck, serverField: 'health_check', label: 'Health Status', visible: true },
  { field: fields.autoPolicyName, label: 'Auto Prov Policy', visible: false },
  { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
])

export const getAppInstanceKey = (data) => {
  return {
    app_key: { organization: data[fields.organizationName], name: data[fields.appName], version: data[fields.version] },
    cluster_inst_key: {
      cloudlet_key: { name: data[fields.cloudletName], organization: data[fields.operatorName] },
      cluster_key: { name: data[fields.clusterName] ? data[fields.clusterName] : 'DefaultVMCluster' },
      organization: data[fields.autoClusterInstance] ? 'MobiledgeX' : data[fields.clusterdeveloper] ? data[fields.clusterdeveloper] : data[fields.organizationName]
    }
  }
}

export const getKey = (data, isCreate) => {
  let appinst = {}
  appinst.key = getAppInstanceKey(data)

  if (isCreate) {

    if (data[fields.configs]) {
      appinst.configs = data[fields.configs]
    }

    if (data[fields.flavorName]) {
      appinst.flavor = { name: data[fields.flavorName] }
    }

    if (data[fields.fields]) {
      appinst.fields = data[fields.fields]
    }

  }

  return ({
    region: data[fields.region],
    appinst: appinst
  })
}

export const multiDataRequest = (keys, mcRequestList, specific) => {

  if (specific) {
    let newList = mcRequestList.new
    if (newList && newList.length > 0) {
      let response = newList[0].response
      if (response && response.status === 200) {
        let dataList = response.data
        if (dataList && dataList.length > 0) {
          let newData = dataList[0]
          let oldData = mcRequestList.old
          newData[fields.uuid] = oldData[fields.uuid]
          newData[fields.accessType] = oldData[fields.accessType]
          newData[fields.autoPolicyName] = oldData[fields.autoPolicyName]
          newData[fields.deployment] = oldData[fields.deployment]
          newData[fields.updateAvailable] = oldData[fields.updateAvailable]
          newData[fields.appRevision] = oldData[fields.appRevision]
          newData[fields.cloudletStatus] = oldData[fields.cloudletStatus]
          newData = customData(newData)
          return newData
        }
      }
    }
    return null
  }
  else {
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
      else if (request.method === SHOW_CLOUDLET_INFO || request.method === SHOW_ORG_CLOUDLET_INFO) {
        cloudletInfoList = mcRequest.response.data
      }
    }
    if (appInstList && appInstList.length > 0) {
      for (let i = 0; i < appInstList.length; i++) {
        let appInst = appInstList[i]
        for (let j = 0; j < appList.length; j++) {
          let app = appList[j]
          if (appInst[fields.appName] === app[fields.appName] && appInst[fields.version] === app[fields.version] && appInst[fields.organizationName] === app[fields.organizationName]) {
            appInst[fields.autoPolicyName] = app[fields.autoPolicyName] ? app[fields.autoPolicyName] : 'NA';
            appInst[fields.deployment] = app[fields.deployment];
            appInst[fields.accessType] = app[fields.accessType];
            appInst[fields.trusted] = app[fields.trusted];
            appInst[fields.updateAvailable] = String(appInst[fields.revision]) !== String(app[fields.revision]);
            appInst[fields.appRevision] = app[fields.revision]
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
}

export const showAppInsts = (data, isSpecific) => {
  let requestData = {}
  if (isSpecific) {
    let appinst = { key: data.appinstkey ? data.appinstkey : data.appinst.key }
    requestData = {
      uuid: data.uuid,
      region: data.region,
      appinst
    }
  }
  else {
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
    requestData = data
  }
  return { method: SHOW_APP_INST, data: requestData, keys: keys() }
}

export const showOrgAppInsts = (data) => {
  let requestData = {}
  requestData.region = data.region
  requestData.appinst = { key: { app_key: { organization: data.org } } }
  return { method: SHOW_APP_INST, data: requestData, keys: keys() }
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

export const updateAppInst = (self, data, callback) => {
  let requestData = getKey(data, true)
  let request = { uuid: data.uuid ? data.uuid : formatter.generateUUID(keys(), data), method: UPDATE_APP_INST, data: requestData }
  return serverData.sendWSRequest(self, request, callback, data)
}

export const changePowerState = (data) => {
  let requestData = getKey(data)
  requestData.appinst.power_state = data[fields.powerState]
  requestData.appinst.fields = ['31']
  return { uuid: data.uuid, method: UPDATE_APP_INST, data: requestData }
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
  let requestData = { region: data[fields.region], appinstkey: getAppInstanceKey(data) }
  return { uuid: data.uuid, method: STREAM_APP_INST, data: requestData }
}

export const customData = (value) => {
  value[fields.liveness] = constant.liveness(value[fields.liveness])
  value[fields.createdAt] = value[fields.createdAt] ? value[fields.createdAt][fields.seconds] : undefined
  value[fields.updatedAt] = value[fields.updatedAt] ? value[fields.updatedAt][fields.seconds] : undefined
  value[fields.ipAccess] = value[fields.ipAccess] ? constant.IPAccessLabel(value[fields.ipAccess]) : undefined
  value[fields.revision] = value[fields.revision] ? value[fields.revision] : '0'
  value[fields.healthCheck] = value[fields.healthCheck] ? value[fields.healthCheck] : 0
  value[fields.sharedVolumeSize] = value[fields.autoClusterInstance] ? value[fields.sharedVolumeSize] ? value[fields.sharedVolumeSize] : 0 : undefined
  if (userRole && userRole.includes(constant.DEVELOPER) && value[fields.appName] === 'MEXPrometheusAppName') {
    value = undefined
  }
  return value
}

export const getData = (response, body) => {
  return formatter.formatData(response, body, keys(), customData, true)
}
