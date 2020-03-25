import * as formatter from './format'
import * as serverData from './serverData'
import { SHOW_PRIVACY_POLICY, UPDATE_PRIVACY_POLICY, CREATE_PRIVACY_POLICY, DELETE_PRIVACY_POLICY } from './endPointTypes'
export const fields = formatter.fields;

export const outboundSecurityRulesKeys = [
  { field: fields.protocol, serverField: 'protocol', label: 'Protocol' },
  { field: fields.portRangeMin, serverField: 'port_range_min', label: 'Port Range Min' },
  { field: fields.portRangeMax, serverField: 'port_range_max', label: 'Port Range Max' },
  { field: fields.remoteCIDR, serverField: 'remote_cidr', label: 'Remote CIDR' }
]

export const keys = [
  { field: fields.region, label: 'Region', sortable: true, visible: true },
  { field: fields.organizationName, serverField: 'key#OS#developer', label: 'Organization Name', sortable: true, visible: true },
  { field: fields.privacyPolicyName, serverField: 'key#OS#name', label: 'Privacy Policy Name', sortable: true, visible: true },
  { field: fields.outboundSecurityRulesCount, label: 'Rules Count', sortable: true, visible: true },
  {
    field: fields.outboundSecurityRules, serverField: 'outbound_security_rules', label: 'Outbound Security Rules',
    keys: outboundSecurityRulesKeys
  },
  { field: 'actions', label: 'Actions', sortable: false, visible: true, clickable: true }
]

const getKey = (data) => {
  return {
    region: data[fields.region],
    privacypolicy: {
      key: { organization: data[fields.organizationName], name: data[fields.privacyPolicyName] },
      outbound_security_rules: data[fields.outboundSecurityRules]
    }
  }
}


export const showPrivacyPolicies = (data) => {
  if (!formatter.isAdmin()) {
    {
      data.privacypolicy = {
        key: {
          organization: formatter.getOrganization()
        }
      }
    }
  }
  return { method: SHOW_PRIVACY_POLICY, data: data }
}

export const getPrivacyPolicyList = async (self, data) => {
  return await serverData.showDataFromServer(self, showPrivacyPolicies(data))
}

export const updatePrivacyPolicy = (data) => {
  let requestData = getKey(data)
  return { method: UPDATE_PRIVACY_POLICY, data: requestData }
}


export const createPrivacyPolicy = (data) => {
  let requestData = getKey(data)
  return { method: CREATE_PRIVACY_POLICY, data: requestData }
}

export const deletePrivacyPolicy = (data) => {
  let requestData = getKey(data)
  return { method: DELETE_PRIVACY_POLICY, data: requestData, success: `Privacy Policy ${data[fields.privacyPolicyName]}` }
}

const customData = (value) => {
  value[fields.outboundSecurityRulesCount] = value[fields.outboundSecurityRules].length;
}

export const getData = (response, body) => {
  return formatter.formatData(response, body, keys, customData)
}

