import * as formatter from '../../model/format'
import * as serverData from '../../model/serverData'
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

let fields = formatter.fields;

export const keys = () => ([
  { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true, format: true },
  { field: fields.organizationName, serverField: 'key#OS#app_key#OS#organization', sortable: true, label: 'Organization', visible: true, filter: true, group: true, key: true },
  { field: fields.app_name_version, label: 'App [Version]', visible: true, sortable: true, detailView: false },
  { field: fields.appName, serverField: 'key#OS#app_key#OS#name', sortable: true, label: 'App', visible: false, filter: true, group: true, key: true },
  { field: fields.version, serverField: 'key#OS#app_key#OS#version', label: 'Version', visible: false, key: true },
  { field: fields.cloudlet_name_operator, label: 'Cloudlet [Operator]', sortable: true, visible: true, detailView: false },
  { field: fields.operatorName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#organization', sortable: true, label: 'Operator', visible: false, filter: true, group: true, key: true },
  { field: fields.partnerOperator, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#federated_organization', label: 'Partner Operator', visible: false, key: true },
  { field: fields.cloudletName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#name', sortable: true, label: 'Cloudlet', visible: false, filter: true, group: true, key: true },
  { field: fields.cloudletLocation, serverField: 'cloudlet_loc', label: 'Cloudlet Location', dataType: perpetual.TYPE_JSON },
  { field: fields.clusterdeveloper, serverField: 'key#OS#cluster_inst_key#OS#organization', sortable: true, label: 'Cluster Developer', visible: false, key: true },
  { field: fields.clusterName, serverField: 'key#OS#cluster_inst_key#OS#cluster_key#OS#name', sortable: true, label: 'Cluster Instance', visible: true, filter: true, group: true, key: true },
  { field: fields.realclustername, serverField: 'real_cluster_name', sortable: true, label: 'Real Cluster Name', visible: false, filter: false },
  { field: fields.deployment, label: 'Deployment', sortable: true, visible: true, filter: true, group: true, roles: [perpetual.ADMIN, perpetual.DEVELOPER] },
  { field: fields.accessType, label: 'Access Type' },
  { field: fields.uri, serverField: 'uri', label: 'URI' },
  { field: fields.liveness, serverField: 'liveness', label: 'Liveness' },
  { field: fields.mappedPorts, serverField: 'mapped_ports', label: 'Mapped Port', dataType: perpetual.TYPE_JSON },
  { field: fields.flavorName, serverField: 'flavor#OS#name', label: 'Flavor' },
  { field: fields.ipAccess, serverField: 'auto_cluster_ip_access', label: 'IP Access' },
  { field: fields.sharedVolumeSize, serverField: 'shared_volume_size', label: 'Shared Volume Size' },
  { field: fields.revision, serverField: 'revision', label: 'Revision', visible: false },
  { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true, format: true },
  { field: fields.powerState, serverField: 'power_state', label: 'Power State', visible: false, format: true },
  { field: fields.runtimeInfo, serverField: 'runtime_info', label: 'Runtime', dataType: perpetual.TYPE_JSON },
  { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } },
  { field: fields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } },
  { field: fields.status, serverField: 'status', label: 'Status', dataType: perpetual.TYPE_JSON },
  { field: fields.configs, serverField: 'configs', label: 'Configs', dataType: perpetual.TYPE_JSON },
  { field: fields.healthCheck, serverField: 'health_check', label: 'Health Status', visible: true, format: true },
  { field: fields.autoPolicyName, label: 'Auto Prov Policy', visible: false },
  { field: fields.dedicatedIp, label: 'Dedicated IP', serverFields: 'dedicated_ip', visible: false, format: true },
  { field: fields.trusted, label: 'Trusted', visible: false, sortable: true, format: true }
])


export const getAppInstanceKey = (data) => {
  return {
    app_key: { organization: data[fields.organizationName], name: data[fields.appName], version: data[fields.version] },
    cluster_inst_key: {
      cloudlet_key: cloudletKeys(data),
      cluster_key: { name: data[fields.clusterName] ? data[fields.clusterName] : '' },
      organization: ''
    }
  }
}

export const getKey = (data, isCreate) => {
  let appinst = {}
  appinst.key = getAppInstanceKey(data)

  if (data[fields.forceupdate]) {
    appinst.force_update = data[fields.forceupdate]
  }

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
    if (data[fields.dedicatedIp]) {
      appinst.dedicated_ip = data[fields.dedicatedIp]
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
            appInst[fields.compatibilityVersion] = cloudletInfo[fields.compatibilityVersion]
          }
        }
        appInst[fields.cloudletStatus] = appInst[fields.cloudletStatus] ? appInst[fields.cloudletStatus] : serverFields.UNKNOWN
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
  data.uuid = data[fields.cloudletName]
  let request = { uuid: data.uuid, method: endpoint.CREATE_APP_INST, data: requestData }
  return serverData.sendWSRequest(self, request, callback, data)
}

export const updateAppInst = (self, data, callback) => {
  let requestData = getKey(data, true)
  let request = { uuid: data.uuid ? data.uuid : generateUUID(keys(), data), method: endpoint.UPDATE_APP_INST, data: requestData }
  return serverData.sendWSRequest(self, request, callback, data)
}

export const changePowerState = (data) => {
  let requestData = getKey(data)
  requestData.appinst.power_state = data[fields.powerState]
  requestData.appinst.fields = ['31']
  return { uuid: data.uuid, method: endpoint.UPDATE_APP_INST, data: requestData }
}

export const deleteAppInst = (self, data) => {
  let requestData = getKey(data)
  if (data[fields.cloudletStatus] !== serverFields.READY && redux_org.isAdmin(self)) {
    requestData.appinst.crm_override = perpetual.CRM_OVERRIDE_IGNORE_CRM
  }
  return { uuid: data.uuid, method: endpoint.DELETE_APP_INST, data: requestData, success: `App Instance ${data[fields.appName]} deleted successfully` }
}

export const refreshAppInst = (data) => {
  let requestData = getKey(data)
  return { uuid: data.uuid, method: endpoint.REFRESH_APP_INST, data: requestData, success: `App Instance ${data[fields.appName]}` }
}

export const requestAppInstLatency = async (self, data) => {
  let requestData = {
    region: data[fields.region],
    appInstLatency: { key: appInstKeys(data, AIK_APP_CLOUDLET_CLUSTER) }
  }
  return await authSyncRequest(self, { method: REQUEST_APP_INST_LATENCY, data: requestData })
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
  return { uuid: data.uuid, method: endpoint.REFRESH_APP_INST, data: requestData }
}

export const streamAppInst = (data) => {
  let requestData = { region: data[fields.region], appinstkey: getAppInstanceKey(data) }
  return { uuid: data.uuid, method: endpoint.STREAM_APP_INST, data: requestData }
}