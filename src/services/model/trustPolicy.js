import uuid from 'uuid'
import * as formatter from './format'
import * as serverData from './serverData'
import { SHOW_TRUST_POLICY, UPDATE_TRUST_POLICY, CREATE_TRUST_POLICY, DELETE_TRUST_POLICY, SHOW_APP } from './endPointTypes'
import { SHOW_CLOUDLET } from './endpoints';
export const fields = formatter.fields;

export const outboundSecurityRulesKeys = [
  { field: fields.protocol, serverField: 'protocol', label: 'Protocol' },
  { field: fields.portRangeMin, serverField: 'port_range_min', label: 'Port Range Min' },
  { field: fields.portRangeMax, serverField: 'port_range_max', label: 'Port Range Max' },
  { field: fields.remoteCIDR, serverField: 'remote_cidr', label: 'Remote CIDR' }
]

export const keys = () => ([
  { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true },
  { field: fields.operatorName, serverField: 'key#OS#organization', label: 'Organization Name', sortable: true, visible: true, filter: true },
  { field: fields.trustPolicyName, serverField: 'key#OS#name', label: 'Trust Policy Name', sortable: true, visible: true, filter: true },
  { field: fields.outboundSecurityRulesCount, label: 'Rules Count', sortable: true, visible: true },
  {
    field: fields.outboundSecurityRules, serverField: 'outbound_security_rules', label: 'Outbound Security Rules',
    keys: outboundSecurityRulesKeys
  },
  { field: 'actions', label: 'Actions', sortable: false, visible: true, clickable: true }
])

const getKey = (data) => {
  let trustpolicy = {}
  trustpolicy.key = { organization: data[fields.operatorName] ? data[fields.operatorName] : data[fields.organizationName], name: data[fields.trustPolicyName] }
  if (data[fields.outboundSecurityRules]) {
    trustpolicy.outbound_security_rules = data[fields.outboundSecurityRules]
  }
  if (data[fields.fields]) {
    trustpolicy.fields = data[fields.fields]
  }
  return {
    region: data[fields.region],
    trustpolicy: trustpolicy
  }
}


export const showTrustPolicies = (data) => {
  if (!formatter.isAdmin()) {
    {
      data.trustpolicy = {
        key: {
          organization: formatter.getOrganization()
        }
      }
    }
  }
  return { method: SHOW_TRUST_POLICY, data: data }
}

export const getTrustPolicyList = async (self, data) => {
  return await serverData.showDataFromServer(self, showTrustPolicies(data))
}

export const updateTrustPolicy = (self, data, callback) => {
  let requestData = getKey(data)
  let request = { uuid: data.uuid ? data.uuid : uuid(), method: UPDATE_TRUST_POLICY, data: requestData }
  return serverData.sendWSRequest(self, request, callback, data)
}


export const createTrustPolicy = (data) => {
  let requestData = getKey(data)
  return { method: CREATE_TRUST_POLICY, data: requestData }
}

export const deleteTrustPolicy = (data) => {
  let requestData = getKey(data)
  return { method: DELETE_TRUST_POLICY, data: requestData, success: `Trust Policy ${data[fields.trustPolicyName]} deleted successfully` }
}

export const multiDataRequest = (keys, mcRequestList) => {
  let trustPolicyList = [];
  let cloudletList = [];
  for (let i = 0; i < mcRequestList.length; i++) {
    let mcRequest = mcRequestList[i];
    let request = mcRequest.request;
    if (request.method === SHOW_TRUST_POLICY) {
      trustPolicyList = mcRequest.response.data
    }
    else if (request.method === SHOW_CLOUDLET) {
      cloudletList = mcRequest.response.data
    }
  }
  if (trustPolicyList && trustPolicyList.length > 0) {
    for (let i = 0; i < trustPolicyList.length; i++) {
      let trustPolicy = trustPolicyList[i]
      let cloudlets = []
      for (let j = 0; j < cloudletList.length; j++) {
        let cloudlet = cloudletList[j]
        if (trustPolicy[fields.trustPolicyName] === cloudlet[fields.trustPolicyName]) {
          cloudlets.push(cloudlet[fields.cloudletName])
        }
      }
      if (cloudlets.length > 0) {
        trustPolicy[fields.cloudlets] = cloudlets
      }
    }
  }
  return trustPolicyList;
}

const customData = (value) => {
  value[fields.outboundSecurityRulesCount] = value[fields.outboundSecurityRules].length;
  value[fields.outboundSecurityRulesCount] = value[fields.outboundSecurityRulesCount] === 0 ? 'Full Isolation' : value[fields.outboundSecurityRulesCount];
  return value
}

export const getData = (response, body) => {
  return formatter.formatData(response, body, keys(), customData)
}

