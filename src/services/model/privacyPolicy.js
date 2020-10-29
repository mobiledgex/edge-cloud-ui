import * as formatter from './format'
import * as serverData from './serverData'
import { SHOW_PRIVACY_POLICY, UPDATE_PRIVACY_POLICY, CREATE_PRIVACY_POLICY, DELETE_PRIVACY_POLICY, SHOW_APP } from './endPointTypes'
export const fields = formatter.fields;

export const outboundSecurityRulesKeys = [
  { field: fields.protocol, serverField: 'protocol', label: 'Protocol' },
  { field: fields.portRangeMin, serverField: 'port_range_min', label: 'Port Range Min' },
  { field: fields.portRangeMax, serverField: 'port_range_max', label: 'Port Range Max' },
  { field: fields.remoteCIDR, serverField: 'remote_cidr', label: 'Remote CIDR' }
]

export const keys = () => ([
  { field: fields.region, label: 'Region', sortable: true, visible: true, filter:true },
  { field: fields.organizationName, serverField: 'key#OS#organization', label: 'Organization Name', sortable: true, visible: true, filter:true },
  { field: fields.privacyPolicyName, serverField: 'key#OS#name', label: 'Privacy Policy Name', sortable: true, visible: true, filter:true },
  { field: fields.outboundSecurityRulesCount, label: 'Rules Count', sortable: true, visible: true },
  {
    field: fields.outboundSecurityRules, serverField: 'outbound_security_rules', label: 'Outbound Security Rules',
    keys: outboundSecurityRulesKeys
  },
  { field: 'actions', label: 'Actions', sortable: false, visible: true, clickable: true }
])

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
  requestData.privacypolicy.fields = ['3', '3.1', '3.2', '3.3', '3.4']
  return { method: UPDATE_PRIVACY_POLICY, data: requestData }
}


export const createPrivacyPolicy = (data) => {
  let requestData = getKey(data)
  return { method: CREATE_PRIVACY_POLICY, data: requestData }
}

export const deletePrivacyPolicy = (data) => {
  let requestData = getKey(data)
  return { method: DELETE_PRIVACY_POLICY, data: requestData, success: `Privacy Policy ${data[fields.privacyPolicyName]} deleted successfully` }
}

export const multiDataRequest = (keys, mcRequestList) => {
  let privacyPolicyList = [];
  let appList = [];
  for (let i = 0; i < mcRequestList.length; i++) {
    let mcRequest = mcRequestList[i];
    let request = mcRequest.request;
    if (request.method === SHOW_PRIVACY_POLICY) {
      privacyPolicyList = mcRequest.response.data
    }
    else if (request.method === SHOW_APP) {
      appList = mcRequest.response.data
    }
  }
  if (privacyPolicyList && privacyPolicyList.length > 0) {
    for (let i = 0; i < privacyPolicyList.length; i++) {
      let privacyPolicy = privacyPolicyList[i]
      let apps = []
      for (let j = 0; j < appList.length; j++) {
        let app = appList[j]
        if (privacyPolicy[fields.privacyPolicyName] === app[fields.privacyPolicyName]) {
          apps.push(app[fields.appName])
        }
      }
      if (apps.length > 0) {
        privacyPolicy[fields.apps] = apps
      }
    }
  }
  return privacyPolicyList;
}

const customData = (value) => {
  value[fields.outboundSecurityRulesCount] = value[fields.outboundSecurityRules].length;
  value[fields.outboundSecurityRulesCount] = value[fields.outboundSecurityRulesCount] === 0 ? 'Full Isolation' : value[fields.outboundSecurityRulesCount];
  return value
}

export const getData = (response, body) => {
  return formatter.formatData(response, body, keys(), customData)
}

