import * as formatter from '../../model/format'
import * as serverData from '../../model/serverData'
import { redux_org } from '../../../helper/reduxData'
import { endpoint, perpetual } from '../../../helper/constant';
import { generateUUID } from '../../format/shared';
import { showAuthSyncRequest } from '../../service';

const fields = formatter.fields;

export const outboundSecurityRulesKeys = [
  { field: fields.protocol, serverField: 'protocol', label: 'Protocol' },
  { field: fields.portRangeMin, serverField: 'port_range_min', label: 'Port Range Min' },
  { field: fields.portRangeMax, serverField: 'port_range_max', label: 'Port Range Max' },
  { field: fields.remoteCIDR, serverField: 'remote_cidr', label: 'Remote CIDR' }
]

export const keys = () => ([
  { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, key: true },
  { field: fields.operatorName, serverField: 'key#OS#organization', label: 'Organization', sortable: true, visible: true, filter: true, key: true },
  { field: fields.trustPolicyName, serverField: 'key#OS#name', label: 'Trust Policy Name', sortable: true, visible: true, filter: true, key: true },
  { field: fields.outboundSecurityRulesCount, label: 'Rules Count', sortable: true, visible: true },
  {
    field: fields.outboundSecurityRules, serverField: 'outbound_security_rules', label: 'Outbound Security Rules',
    keys: outboundSecurityRulesKeys
  },
  // { field: 'actions', label: 'Actions', sortable: false, visible: true, clickable: true, roles: [perpetual.ADMIN_MANAGER, perpetual.ADMIN_CONTRIBUTOR, perpetual.OPERATOR_MANAGER, perpetual.OPERATOR_CONTRIBUTOR] }
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
  let request = { uuid: data.uuid ? data.uuid : generateUUID(keys(), data), method: endpoint.UPDATE_TRUST_POLICY, data: requestData }
  return serverData.sendWSRequest(self, request, callback, data)
}


export const createTrustPolicy = (data) => {
  let requestData = getKey(data)
  return { method: endpoint.CREATE_TRUST_POLICY, data: requestData }
}

export const deleteTrustPolicy = (self, data) => {
  let requestData = getKey(data)
  return { method: endpoint.DELETE_TRUST_POLICY, data: requestData, success: `Trust Policy ${data[fields.trustPolicyName]} deleted successfully` }
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
