import * as formatter from '../../model/format'
import { showAuthSyncRequest } from '../../service';
import { redux_org } from '../../../helper/reduxData'
import { endpoint } from '../../../helper/constant';

const fields = formatter.fields;

export const keys = () => ([
  { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, key: true },
  { field: fields.organizationName, serverField: 'key#OS#organization', label: 'Organization', sortable: true, visible: true, filter: true, key: true },
  { field: fields.autoScalePolicyName, serverField: 'key#OS#name', label: 'Auto Scale Policy', sortable: true, visible: true, filter: true, key: true },
  { field: fields.minimumNodes, serverField: 'min_nodes', label: 'Minimun Nodes', visible: true },
  { field: fields.maximumNodes, serverField: 'max_nodes', label: 'Maximum Nodes', visible: true },
  { field: fields.stabilizationWindowSec, serverField: 'stabilization_window_sec', label: 'Stabilization Window (sec)' },
  { field: fields.targetActiveConnections, serverField: 'target_active_connections', label: 'Target Active Connections' },
  { field: fields.targetMEM, serverField: 'target_mem', label: 'Target Memory (%)' },
  { field: fields.targetCPU, serverField: 'target_cpu', label: 'Target CPU (%)' },
  { field: fields.triggerTime, serverField: 'trigger_time_sec', label: 'Trigger Time (sec)' },
  { field: 'actions', label: 'Actions', sortable: false, visible: true, clickable: true }
])

const getKey = (data, isCreate) => {
  let autoScalePolicy = {}
  autoScalePolicy.key = {
    organization: data[fields.organizationName], name: data[fields.autoScalePolicyName]
  }

  if (isCreate) {
    if (data[fields.minimumNodes]) {
      autoScalePolicy.min_nodes = parseInt(data[fields.minimumNodes])
    }
    if (data[fields.maximumNodes]) {
      autoScalePolicy.max_nodes = parseInt(data[fields.maximumNodes])
    }
    if (data[fields.targetCPU]) {
      autoScalePolicy.target_cpu = parseInt(data[fields.targetCPU])
    }
    if (data[fields.targetMEM]) {
      autoScalePolicy.target_mem = parseInt(data[fields.targetMEM])
    }
    if (data[fields.targetActiveConnections]) {
      autoScalePolicy.target_active_connections = parseInt(data[fields.targetActiveConnections])
    }
    if (data[fields.stabilizationWindowSec]) {
      autoScalePolicy.stabilization_window_sec = parseInt(data[fields.stabilizationWindowSec])
    }
    if (data[fields.triggerTime]) {
      autoScalePolicy.trigger_time_sec = parseInt(data[fields.triggerTime])
    }
    if (data[fields.fields]) {
      autoScalePolicy.fields = data[fields.fields]
    }
  }

  return {
    region: data[fields.region],
    autoscalepolicy: autoScalePolicy
  }
}

export const showAutoScalePolicies = (self, data) => {
  let organization = redux_org.nonAdminOrg(self)
  if (organization && redux_org.isDeveloper(self)) {
    {
      data.autoscalepolicy = { key: { organization } }
    }
  }
  return { method: endpoint.SHOW_AUTO_SCALE_POLICY, data: data, keys: keys() }
}

export const getAutoScalePolicyList = async (self, data) => {
  return await showAuthSyncRequest(self, showAutoScalePolicies(self, data))
}

export const updateAutoScalePolicy = (data) => {
  let requestData = getKey(data, true)
  return { method: endpoint.UPDATE_AUTO_SCALE_POLICY, data: requestData }
}


export const createAutoScalePolicy = (data) => {
  let requestData = getKey(data, true)
  return { method: endpoint.CREATE_AUTO_SCALE_POLICY, data: requestData }
}

export const deleteAutoScalePolicy = (self, data) => {
  let requestData = getKey(data)
  return { method: endpoint.DELETE_AUTO_SCALE_POLICY, data: requestData, success: `Auto Scale Policy ${data[fields.autoScalePolicyName]} deleted successfully` }
}
