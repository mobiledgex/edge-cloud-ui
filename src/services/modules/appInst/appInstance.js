import * as formatter from '../../fields'
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { FORMAT_FULL_DATE_TIME } from '../../../utils/date_util'
import { redux_org } from '../../../helper/reduxData'
import { endpoint, perpetual } from '../../../helper/constant'
import { customize } from '.'
import { generateUUID } from '../../format/shared'
import { REQUEST_APP_INST_LATENCY } from '../../../helper/constant/endpoint';
import { AIK_APP_CLOUDLET_CLUSTER,  appInstKeys } from './primary';
import {  cloudletKeys } from '../cloudlet';
import { serverFields } from '../../../helper/formatter';
import { websocket } from '../..';

const localFields = formatter.localFields;

export const keys = () => ([
  { field: localFields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true, format: true },
  { field: localFields.organizationName, serverField: 'key#OS#app_key#OS#organization', sortable: true, label: 'Organization', visible: true, filter: true, group: true, key: true },
  { field: localFields.app_name_version, label: 'App [Version]', visible: true, sortable: true, detailView: false },
  { field: localFields.appName, serverField: 'key#OS#app_key#OS#name', sortable: true, label: 'App', visible: false, filter: true, group: true, key: true },
  { field: localFields.version, serverField: 'key#OS#app_key#OS#version', label: 'Version', visible: false, key: true },
  { field: localFields.cloudlet_name_operator, label: 'Cloudlet [Operator]', sortable: true, visible: true, detailView: false },
  { field: localFields.operatorName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#organization', sortable: true, label: 'Operator', visible: false, filter: true, group: true, key: true },
  { field: localFields.partnerOperator, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#federated_organization', label: 'Partner Operator', visible: false, key: true },
  { field: localFields.cloudletName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#name', sortable: true, label: 'Cloudlet', visible: false, filter: true, group: true, key: true },
  { field: localFields.cloudletLocation, serverField: 'cloudlet_loc', label: 'Cloudlet Location', dataType: perpetual.TYPE_JSON },
  { field: localFields.clusterdeveloper, serverField: 'key#OS#cluster_inst_key#OS#organization', sortable: true, label: 'Cluster Developer', visible: false, key: true },
  { field: localFields.clusterName, serverField: 'key#OS#cluster_inst_key#OS#cluster_key#OS#name', sortable: true, label: 'Cluster Instance', visible: true, filter: true, group: true, key: true },
  { field: localFields.realclustername, serverField: 'real_cluster_name', sortable: true, label: 'Real Cluster Name', visible: false, filter: false },
  { field: localFields.deployment, label: 'Deployment', sortable: true, visible: true, filter: true, group: true, roles: [perpetual.ADMIN, perpetual.DEVELOPER] },
  { field: localFields.accessType, label: 'Access Type' },
  { field: localFields.uri, serverField: 'uri', label: 'URI' },
  { field: localFields.liveness, serverField: 'liveness', label: 'Liveness' },
  { field: localFields.mappedPorts, serverField: 'mapped_ports', label: 'Mapped Port', dataType: perpetual.TYPE_JSON },
  { field: localFields.flavorName, serverField: 'flavor#OS#name', label: 'Flavor' },
  { field: localFields.ipAccess, serverField: 'auto_cluster_ip_access', label: 'IP Access' },
  { field: localFields.sharedVolumeSize, serverField: 'shared_volume_size', label: 'Shared Volume Size' },
  { field: localFields.revision, serverField: 'revision', label: 'Revision', visible: false },
  { field: localFields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true, format: true },
  { field: localFields.powerState, serverField: 'power_state', label: 'Power State', visible: false, format: true },
  { field: localFields.runtimeInfo, serverField: 'runtime_info', label: 'Runtime', dataType: perpetual.TYPE_JSON },
  { field: localFields.createdAt, serverField: 'created_at', label: 'Created', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } },
  { field: localFields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } },
  { field: localFields.status, serverField: 'status', label: 'Status', dataType: perpetual.TYPE_JSON },
  { field: localFields.configs, serverField: 'configs', label: 'Configs', dataType: perpetual.TYPE_JSON },
  { field: localFields.healthCheck, serverField: 'health_check', label: 'Health Status', visible: true, format: true },
  { field: localFields.autoPolicyName, label: 'Auto Prov Policy', visible: false },
  { field: localFields.dedicatedIp, label: 'Dedicated IP', serverFields: 'dedicated_ip', visible: false, format: true },
  { field: localFields.trusted, label: 'Trusted', visible: false, sortable: true, format: true }
])

const getClusterOrg = (data) => {
  if (data[localFields.autoClusterInstance]) {
    return data[localFields.compatibilityVersion] >= perpetual.CLOUDLET_COMPAT_VERSION_2_4_1 ? 'MobiledgeX' : data[localFields.organizationName]
  }
  else {
    return data[localFields.clusterdeveloper] ? data[localFields.clusterdeveloper] : data[localFields.organizationName]
  }
}

export const getAppInstanceKey = (data) => {
  return {
    app_key: { organization: data[localFields.organizationName], name: data[localFields.appName], version: data[localFields.version] },
    cluster_inst_key: {
      cloudlet_key: cloudletKeys(data),
      cluster_key: { name: data[localFields.clusterName] ? data[localFields.clusterName] : 'DefaultVMCluster' },
      organization: getClusterOrg(data)
    }
  }
}

export const getKey = (data, isCreate) => {
  let appinst = {}
  appinst.key = getAppInstanceKey(data)

  if (data[localFields.forceupdate]) {
    appinst.force_update = data[localFields.forceupdate]
  }

  if (isCreate) {

    if (data[localFields.configs]) {
      appinst.configs = data[localFields.configs]
    }

    if (data[localFields.flavorName]) {
      appinst.flavor = { name: data[localFields.flavorName] }
    }

    if (data[localFields.fields]) {
      appinst.fields = data[localFields.fields]
    }
    if (data[localFields.dedicatedIp]) {
      appinst.dedicated_ip = data[localFields.dedicatedIp]
    }

  }

  return ({
    region: data[localFields.region],
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
          newData[localFields.uuid] = oldData[localFields.uuid]
          newData[localFields.accessType] = oldData[localFields.accessType]
          newData[localFields.autoPolicyName] = oldData[localFields.autoPolicyName]
          newData[localFields.deployment] = oldData[localFields.deployment]
          newData[localFields.updateAvailable] = oldData[localFields.updateAvailable]
          newData[localFields.appRevision] = oldData[localFields.appRevision]
          newData[localFields.cloudletStatus] = oldData[localFields.cloudletStatus]
          newData = customize(undefined, newData)
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
      if (request.method === endpoint.SHOW_APP_INST) {
        appInstList = mcRequest.response.data
      }
      else if (request.method === endpoint.SHOW_APP) {
        appList = mcRequest.response.data
      }
      else if (request.method === endpoint.SHOW_CLOUDLET_INFO || request.method === endpoint.SHOW_ORG_CLOUDLET_INFO) {
        cloudletInfoList = mcRequest.response.data
      }
    }
    if (appInstList && appInstList.length > 0) {
      for (let i = 0; i < appInstList.length; i++) {
        let appInst = appInstList[i]
        for (let j = 0; j < appList.length; j++) {
          let app = appList[j]
          if (appInst[localFields.appName] === app[localFields.appName] && appInst[localFields.version] === app[localFields.version] && appInst[localFields.organizationName] === app[localFields.organizationName]) {
            appInst[localFields.autoPolicyName] = app[localFields.autoPolicyName] ? app[localFields.autoPolicyName] : 'NA';
            appInst[localFields.deployment] = app[localFields.deployment];
            appInst[localFields.accessType] = app[localFields.accessType];
            appInst[localFields.trusted] = app[localFields.trusted];
            appInst[localFields.updateAvailable] = String(appInst[localFields.revision]) !== String(app[localFields.revision]);
            appInst[localFields.appRevision] = app[localFields.revision]
            break;
          }
        }
        for (let j = 0; j < cloudletInfoList.length; j++) {
          let cloudletInfo = cloudletInfoList[j]
          if (appInst[localFields.cloudletName] === cloudletInfo[localFields.cloudletName] && appInst[localFields.operatorName] === cloudletInfo[localFields.operatorName]) {
            appInst[localFields.cloudletStatus] = cloudletInfo[localFields.state]
            appInst[localFields.compatibilityVersion] = cloudletInfo[localFields.compatibilityVersion]
          }
        }
        appInst[localFields.cloudletStatus] = appInst[localFields.cloudletStatus] ? appInst[localFields.cloudletStatus] : serverFields.UNKNOWN
      }
    }
    return appInstList;
  }
}


export const showAppInsts = (self, data, specific) => {
  let requestData = {}
  if (specific) {
    let appinst = { key: data.appinstkey ? data.appinstkey : data.appinst.key }
    requestData = {
      uuid: data.uuid,
      region: data.region,
      appinst
    }
  }
  else {
    requestData.region = data.region
    let organization = data.org ? data.org : redux_org.orgName(self)
    if (organization) {
      if (redux_org.isDeveloper(self) || data.type === perpetual.DEVELOPER) {
        requestData.appinst = { key: { app_key: { organization } } }
      }
      else if (redux_org.isOperator(self) || data.type === perpetual.OPERATOR) {
        requestData.appinst = {
          key: {
            cluster_inst_key: {
              cloudlet_key: {
                organization
              }
            }
          }
        }
      }
    }
  }
  return { method: endpoint.SHOW_APP_INST, data: requestData, keys: keys() }
}

export const getAppInstList = async (self, data) => {
  return await showAuthSyncRequest(self, showAppInsts(data))
}

export const createAppInst = (self, data, callback) => {
  let requestData = getKey(data, true)
  data.uuid = data[localFields.cloudletName]
  let request = { uuid: data.uuid, method: endpoint.CREATE_APP_INST, data: requestData }
  return websocket.request(self, request, callback, data)
}

export const updateAppInst = (self, data, callback) => {
  let requestData = getKey(data, true)
  let request = { uuid: data.uuid ? data.uuid : generateUUID(keys(), data), method: endpoint.UPDATE_APP_INST, data: requestData }
  return websocket.request(self, request, callback, data)
}

export const changePowerState = (data) => {
  let requestData = getKey(data)
  requestData.appinst.power_state = data[localFields.powerState]
  requestData.appinst.fields = ['31']
  return { uuid: data.uuid, method: endpoint.UPDATE_APP_INST, data: requestData }
}

export const deleteAppInst = (self, data) => {
  let requestData = getKey(data)
  if (data[localFields.cloudletStatus] !== serverFields.READY && redux_org.isAdmin(self)) {
    requestData.appinst.crm_override = perpetual.CRM_OVERRIDE_IGNORE_CRM
  }
  return { uuid: data.uuid, method: endpoint.DELETE_APP_INST, data: requestData, success: `App Instance ${data[localFields.appName]} deleted successfully` }
}

export const refreshAppInst = (data) => {
  let requestData = getKey(data)
  return { uuid: data.uuid, method: endpoint.REFRESH_APP_INST, data: requestData, success: `App Instance ${data[localFields.appName]}` }
}

export const requestAppInstLatency = async (self, data) => {
  let requestData = {
    region: data[localFields.region],
    appInstLatency: { key: appInstKeys(data, AIK_APP_CLOUDLET_CLUSTER) }
  }
  return await authSyncRequest(self, { method: REQUEST_APP_INST_LATENCY, data: requestData })
}

export const refreshAllAppInst = (data) => {
  let requestData = {
    region: data[localFields.region],
    appinst: {
      key: {
        app_key: {
          organization: data[localFields.organizationName],
          name: data[localFields.appName],
          version: data[localFields.version]
        }
      },
      update_multiple: true
    },
  }
  return { uuid: data.uuid, method: endpoint.REFRESH_APP_INST, data: requestData }
}

export const streamAppInst = (data) => {
  let requestData = { region: data[localFields.region], appinstkey: getAppInstanceKey(data) }
  return { uuid: data.uuid, method: endpoint.STREAM_APP_INST, data: requestData }
}