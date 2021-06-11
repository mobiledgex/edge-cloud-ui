import * as formatter from './format'
import * as serverData from './serverData'
import { redux_org } from '../../helper/reduxData'
import { endpoint } from '../../helper/constant';

export const fields = formatter.fields;

export const keys = () => ([
  { field: fields.region, label: 'Region', sortable: true, visible: true, filter:true, key:true },
  { field: fields.organizationName, serverField: 'key#OS#organization', label: 'Organization', sortable: true, visible: true, filter:true, key:true },
  { field: fields.autoScalePolicyName, serverField: 'key#OS#name', label: 'Auto Scale Policy', sortable: true, visible: true, filter:true, key:true },
  { field: fields.minimumNodes, serverField: 'min_nodes', label: 'Minimun Nodes', visible: true },
  { field: fields.maximumNodes, serverField: 'max_nodes', label: 'Maximum Nodes', visible: true},
  { field: fields.scaleDownCPUThreshold, serverField: 'scale_down_cpu_thresh', label: 'Scale Down CPU Threshold (%)'},
  { field: fields.scaleUpCPUThreshold, serverField: 'scale_up_cpu_thresh', label: 'Scale Up CPU Threshold (%)'},
  { field: fields.triggerTime, serverField: 'trigger_time_sec', label: 'Trigger Time (sec)'},
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
    if (data[fields.scaleUpCPUThreshold]) {
      autoScalePolicy.scale_up_cpu_thresh = parseInt(data[fields.scaleUpCPUThreshold])
    }
    if (data[fields.scaleDownCPUThreshold]) {
      autoScalePolicy.scale_down_cpu_thresh = parseInt(data[fields.scaleDownCPUThreshold])
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
  return { method: endpoint.SHOW_AUTO_SCALE_POLICY, data: data }
}

export const getAutoScalePolicyList = async (self, data) => {
  return await serverData.showDataFromServer(self, showAutoScalePolicies(self, data))
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

const customData = (value) => {
  return value
}

export const getData = (response, body) => {
  return formatter.formatData(response, body, keys(), customData, true)
}

