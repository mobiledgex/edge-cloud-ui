import * as formatter from '../../fields'
import { redux_org } from '../../../helper/reduxData'
import { endpoint, perpetual } from '../../../helper/constant';
import { generateUUID } from '../../format/shared';
import { showAuthSyncRequest } from '../../service';
import { websocket } from '../..';

const localFields = formatter.localFields;

export const outboundSecurityRulesKeys = [
  { field: localFields.protocol, serverField: 'protocol', label: 'Protocol' },
  { field: localFields.portRangeMin, serverField: 'port_range_min', label: 'Port Range Min' },
  { field: localFields.portRangeMax, serverField: 'port_range_max', label: 'Port Range Max' },
  { field: localFields.remoteCIDR, serverField: 'remote_cidr', label: 'Remote CIDR' }
]

export const keys = () => ([
  { field: localFields.region, label: 'Region', sortable: true, visible: true, filter: true, key: true },
  { field: localFields.operatorName, serverField: 'key#OS#organization', label: 'Organization', sortable: true, visible: true, filter: true, key: true },
  { field: localFields.trustPolicyName, serverField: 'key#OS#name', label: 'Trust Policy Name', sortable: true, visible: true, filter: true, key: true },
  { field: localFields.outboundSecurityRulesCount, label: 'Rules Count', sortable: true, visible: true },
  {
    field: localFields.outboundSecurityRules, serverField: 'outbound_security_rules', label: 'Outbound Security Rules',
    keys: outboundSecurityRulesKeys
  }
])

const getKey = (data) => {
  let trustpolicy = {}
  trustpolicy.key = { organization: data[localFields.operatorName], name: data[localFields.trustPolicyName] }
  if (data[localFields.outboundSecurityRules]) {
    let newRules = []
    for (const rule of data[localFields.outboundSecurityRules]) {
      let newRule = {}
      if (rule[localFields.protocol] !== perpetual.PROTOCOL_ICMP) {
        newRule.port_range_max = rule[localFields.portRangeMin]
        newRule.port_range_min = rule[localFields.portRangeMax]
      }
      newRule.protocol = rule[localFields.protocol]
      newRule.remote_cidr = rule[localFields.remoteCIDR]
      newRules.push(newRule)
    }
    trustpolicy.outbound_security_rules = newRules
  }
  if (data[localFields.fields]) {
    trustpolicy.fields = data[localFields.fields]
  }
  return {
    region: data[localFields.region],
    trustpolicy: trustpolicy
  }
}

export const showTrustPolicies = (self, data) => {
  if (redux_org.isOperator(self)) {
    data.trustpolicy = { key: { organization: redux_org.nonAdminOrg(self) } }
  }
  return { method: endpoint.SHOW_TRUST_POLICY, data: data, keys: keys() }
}

export const getTrustPolicyList = async (self, data) => {
  return await showAuthSyncRequest(self, showTrustPolicies(self, data))
}

export const updateTrustPolicy = (self, data, callback) => {
  let requestData = getKey(data)
  let request = { uuid: data.uuid ?? generateUUID(keys(), data), method: endpoint.UPDATE_TRUST_POLICY, data: requestData }
  return websocket.request(self, request, callback, data)
}


export const createTrustPolicy = (data) => {
  let requestData = getKey(data)
  return { method: endpoint.CREATE_TRUST_POLICY, data: requestData }
}

export const deleteTrustPolicy = (self, data) => {
  let requestData = getKey(data)
  return { method: endpoint.DELETE_TRUST_POLICY, data: requestData, success: `Trust Policy ${data[localFields.trustPolicyName]} deleted successfully` }
}

export const multiDataRequest = (keys, mcRequestList) => {
  let trustPolicyList = [];
  let cloudletList = [];
  for (let i = 0; i < mcRequestList.length; i++) {
    let mcRequest = mcRequestList[i];
    let request = mcRequest.request;
    if (request.method === endpoint.SHOW_TRUST_POLICY) {
      trustPolicyList = mcRequest.response.data
    }
    else if (request.method === endpoint.SHOW_CLOUDLET) {
      cloudletList = mcRequest.response.data
    }
  }
  if (trustPolicyList && trustPolicyList.length > 0) {
    for (let i = 0; i < trustPolicyList.length; i++) {
      let trustPolicy = trustPolicyList[i]
      let cloudlets = []
      for (let j = 0; j < cloudletList.length; j++) {
        let cloudlet = cloudletList[j]
        if (trustPolicy[localFields.trustPolicyName] === cloudlet[localFields.trustPolicyName]) {
          cloudlets.push(cloudlet[localFields.cloudletName])
        }
      }
      if (cloudlets.length > 0) {
        trustPolicy[localFields.cloudlets] = cloudlets
      }
    }
  }
  return trustPolicyList;
}
