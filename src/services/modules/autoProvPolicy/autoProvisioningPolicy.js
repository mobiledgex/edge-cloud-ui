import { showAuthSyncRequest } from '../../service';
import { redux_org } from '../../../helper/reduxData'
import { endpoint, perpetual } from '../../../helper/constant'
import { fields } from '../../model/format';
import { cloudletKeys } from '../cloudlet';

export const keys = () => ([
  { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, key:true },
  { field: fields.organizationName, serverField: 'key#OS#organization', label: 'Organization', sortable: true, visible: true, filter: true, key:true },
  { field: fields.autoPolicyName, serverField: 'key#OS#name', label: 'Auto Policy Name', sortable: true, visible: true, filter: true, key:true },
  { field: fields.deployClientCount, serverField: 'deploy_client_count', label: 'Deploy Request Count', sortable: true, visible: true, dataType: 'Integer', defaultValue: 0 },
  { field: fields.deployIntervalCount, serverField: 'deploy_interval_count', label: 'Deploy Interval Count', sortable: true, visible: true, dataType: 'Integer', defaultValue: 0 },
  { field: fields.undeployClientCount, serverField: 'undeploy_client_count', label: 'UnDeploy Request Count', sortable: true, visible: false, dataType: 'Integer', defaultValue: 0 },
  { field: fields.undeployIntervalCount, serverField: 'undeploy_interval_count', label: 'UnDeploy Interval Count', sortable: true, visible: false, dataType: 'Integer', defaultValue: 0 },
  { field: fields.minActiveInstances, serverField: 'min_active_instances', label: 'Min Active Instances', sortable: true, visible: false, dataType: 'Integer' },
  { field: fields.maxInstances, serverField: 'max_instances', label: 'Max Instances', sortable: true, visible: false, dataType: 'Integer' },
  { field: fields.cloudletCount, label: 'Cloudlet Count', sortable: false, visible: true },
  {
    field: fields.cloudlets, serverField: 'cloudlets', label: 'Cloudlets',
    keys: [{ field: fields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet Name' },
    { field: fields.operatorName, serverField: 'key#OS#organization', label: 'Operator' },
    { field: fields.partnerOperator, serverField: 'key#OS#federated_organization', label: 'Partner Operator' },
    { field: fields.cloudletLocation, serverField: 'loc', label: 'Location', dataType: perpetual.TYPE_JSON }]
  }
])

const getKey = (data) => {
  return { organization: data[fields.organizationName], name: data[fields.autoPolicyName] }
}

const getAutoProvCloudletKey = (data, isCreate) => {
  let autoProvPolicyCloudlet = {}
  autoProvPolicyCloudlet.key = getKey(data)
  if (isCreate) {
    autoProvPolicyCloudlet.cloudlet_key = cloudletKeys(data)
  }
  return ({
    region: data[fields.region],
    autoProvPolicyCloudlet: autoProvPolicyCloudlet
  })
}

const getCloudletList = (cloudlets) => {
  let cloudletList = undefined
  if (cloudlets && cloudlets.length > 0) {
    cloudletList = []
    for (let i = 0; i < cloudlets.length; i++) {
      cloudletList.push({ key: cloudletKeys(cloudlets[i]) })
    }
  }
  return cloudletList
}

const getAutoProvKey = (data, isCreate) => {
  let autoProvPolicy = {}
  autoProvPolicy.key = getKey(data)
  if (isCreate) {
    autoProvPolicy.deploy_client_count = data[fields.deployClientCount] ? parseInt(data[fields.deployClientCount]) : undefined
    autoProvPolicy.undeploy_client_count = data[fields.undeployClientCount] ? parseInt(data[fields.undeployClientCount]) : undefined
    autoProvPolicy.deploy_interval_count = data[fields.deployIntervalCount] ? parseInt(data[fields.deployIntervalCount]) : undefined
    autoProvPolicy.undeploy_interval_count = data[fields.undeployIntervalCount] ? parseInt(data[fields.undeployIntervalCount]) : undefined
    autoProvPolicy.min_active_instances = data[fields.minActiveInstances] ? parseInt(data[fields.minActiveInstances]) : undefined
    autoProvPolicy.max_instances = data[fields.maxInstances] ? parseInt(data[fields.maxInstances]) : undefined
    autoProvPolicy.fields = data[fields.fields] ? data[fields.fields] : undefined
    autoProvPolicy.cloudlets = data[fields.cloudlets] ? getCloudletList(data[fields.cloudlets]) : undefined
  }
  return ({
    region: data[fields.region],
    autoProvPolicy: autoProvPolicy
  })
}

export const showAutoProvPolicies = (self, data) => {
  let organization = redux_org.nonAdminOrg(self)
  if (organization && redux_org.isDeveloper(self)) {
    {
      data.AutoProvPolicy = { key: { organization } }
    }
  }
  return { method: endpoint.SHOW_AUTO_PROV_POLICY, data: data, keys: keys() }
}

export const getAutoProvPolicyList = async (self, data) => {
  return await showAuthSyncRequest(self, showAutoProvPolicies(self, data))
}

export const deleteAutoProvPolicy = (self, data) => {
  let requestData = getAutoProvKey(data)
  return { method: endpoint.DELETE_AUTO_PROV_POLICY, data: requestData, success: `Auto Provisioning Policy ${data[fields.autoPolicyName]} deleted successfully` }
}

export const createAutoProvPolicy = (data) => {
  let requestData = getAutoProvKey(data, true)
  return { method: endpoint.CREATE_AUTO_PROV_POLICY, data: requestData }
}

export const updateAutoProvPolicy = (data) => {
  let requestData = getAutoProvKey(data, true)
  return { method: endpoint.UPDATE_AUTO_PROV_POLICY, data: requestData }
}

export const addAutoProvCloudletKey = (data) => {
  let requestData = getAutoProvCloudletKey(data, true)
  return { method: endpoint.ADD_AUTO_PROV_POLICY_CLOUDLET, data: requestData }
}

export const deleteAutoProvCloudletKey = (data) => {
  let requestData = getAutoProvCloudletKey(data, true)
  return { method: endpoint.REMOVE_AUTO_PROV_POLICY_CLOUDLET, data: requestData }
}

export const multiDataRequest = (keys, mcRequestList) => {
  let autoProvList = [];
  let appList = [];
  for (let i = 0; i < mcRequestList.length; i++) {
    let mcRequest = mcRequestList[i];
    let request = mcRequest.request;
    if (request.method === endpoint.SHOW_AUTO_PROV_POLICY) {
      autoProvList = mcRequest.response.data
    }
    else if (request.method === endpoint.SHOW_APP) {
      appList = mcRequest.response.data
    }
  }
  if (autoProvList && autoProvList.length > 0) {
    for (let i = 0; i < autoProvList.length; i++) {
      let autoProv = autoProvList[i]
      let apps = []
      for (let j = 0; j < appList.length; j++) {
        let app = appList[j]
        if (autoProv[fields.autoPolicyName] === app[fields.autoPolicyName]) {
          apps.push(app[fields.appName])
        }
        else if (app[fields.autoProvPolicies] && app[fields.autoProvPolicies].includes(autoProv[fields.autoPolicyName])) {
          apps.push(app[fields.appName])
        }
      }
      if (apps.length > 0) {
        autoProv[fields.apps] = apps
      }
    }
  }
  return autoProvList;
}