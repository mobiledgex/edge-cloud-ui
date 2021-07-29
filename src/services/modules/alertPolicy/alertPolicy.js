import * as formatter from '../../model/format'
import * as serverData from '../../model/serverData'
import { redux_org } from '../../../helper/reduxData'
import { endpoint, perpetual } from '../../../helper/constant';
import { generateUUID } from '../../format/shared';
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { developerRoles } from '../../../constant';

const fields = formatter.fields;

const SF_CUL = 'cpu_utilization_limit'
const SF_MUL= 'mem_utilization_limit'
const SF_DUL = 'disk_utilization_limit'
const SF_ACL = 'active_conn_limit'
const SF_LABELS = 'labels'
const SF_ANNOTATIONS = 'annotations'
const SF_SEVERITY = 'severity'
const SF_TRIGGER_TIME = 'trigger_time'

export const keys = () => ([
  { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, key: true },
  { field: fields.organizationName, serverField: 'key#OS#organization', label: 'Organization', sortable: true, visible: true, filter: true, key: true },
  { field: fields.alertPolicyName, serverField: 'key#OS#name', label: 'Alert Policy Name', sortable: true, visible: true, filter: true, key: true },
  { field: fields.severity, serverField: SF_SEVERITY, label: 'Severity', sortable: true, visible: true, filter: true, format: true },
  { field: fields.triggerTime, serverField: SF_TRIGGER_TIME, label: 'Trigger Time', sortable: true, visible: true, filter: true },
  { field: fields.cpuUtilizationLimit, serverField: SF_CUL, label: 'CPU Utilization Limit', type: 'number' },
  { field: fields.memUtilizationLimit, serverField: SF_MUL, label: 'Memory Utilization Limit', type: 'number' },
  { field: fields.diskUtilizationLimit, serverField: SF_DUL, label: 'Disk Utilization Limit', type: 'number' },
  { field: fields.activeConnectionLimit, serverField: SF_ACL, label: 'Active Connection Limit', type: 'number' },
  { field: fields.labels, serverField: SF_LABELS, label: 'Labels', dataType: perpetual.TYPE_JSON },
  { field: fields.annotations, serverField: SF_ANNOTATIONS, label: 'Annotations', dataType: perpetual.TYPE_JSON },
  {
    field: fields.apps, label: 'Apps',
    keys: [{ field: fields.appName, label: 'App Name' },
    { field: fields.version, label: 'Version' }]
  },
  { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true, roles: developerRoles }
])

const getKey = (data, isCreate) => {
  let alertPolicy = {}
  alertPolicy.key = { organization: data[fields.organizationName], name: data[fields.alertPolicyName] }
  const updateFields = data[fields.fields]
  if (isCreate) {
    for (const item of keys()) {
      if (item.key || item.field === fields.actions) {
        continue;
      }
      if (data[item.field]) {
        const value = item.type === perpetual.NUMBER ? parseInt(data[item.field]) : data[item.field]
        if (updateFields === undefined || updateFields.includes(item.field)) {
          alertPolicy[item.serverField] = value
        }
      }
    }
  }
  return {
    region: data[fields.region],
    alertPolicy
  }
}

export const showAlertPolicy = (self, data) => {
  if (redux_org.isOperator(self)) {
    data.trustpolicy = { key: { organization: redux_org.nonAdminOrg(self) } }
  }
  return { method: endpoint.SHOW_ALERT_POLICY, data: data, keys: keys() }
}

export const getAlertPolicyList = async (self, data) => {
  return await showAuthSyncRequest(self, showAlertPolicy(self, data))
}

export const updateAlertPolicy = async (self, data) => {
  let requestData = getKey(data, true)
  let request = { method: endpoint.UPDATE_ALERT_POLICY, data: requestData }
  return await authSyncRequest(self, request)
}


export const createAlertPolicy = (data) => {
  let requestData = getKey(data, true)
  return { method: endpoint.CREATE_ALERT_POLICY, data: requestData }
}

export const deleteAlertPolicy = (self, data) => {
  let requestData = getKey(data)
  return { method: endpoint.DELETE_ALERT_POLICY, data: requestData, success: `Trust Policy ${data[fields.trustPolicyName]} deleted successfully` }
}

export const multiDataRequest = (keys, mcList, specific) => {
  let alertPolicyList = [];
  let appList = [];
  for (const mc of mcList) {
    let request = mc.request;
    if (request.method === endpoint.SHOW_APP) {
      appList = mc.response.data
    }
    else if (request.method === endpoint.SHOW_ALERT_POLICY) {
      alertPolicyList = mc.response.data
    }
  }
  alertPolicyList.forEach(alertPolicy => {
    let policyName = alertPolicy[fields.alertPolicyName]
    let apps = []
    appList.forEach(app => {
      if (app[fields.alertPolicies] && app[fields.alertPolicies].includes(policyName)) {
        apps.push(app)
      }
    })
    if (apps.length > 0) {
      alertPolicy[fields.apps] = apps
    }
  })
  return alertPolicyList
}