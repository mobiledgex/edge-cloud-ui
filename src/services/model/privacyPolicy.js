
import { fields, formatData } from './format'

export const actionMenu = (self) => {
  return [
    { label: 'View', onClick: self.onView },
    { label: 'Update', onClick: self.onAddPolicy },
    { label: 'Delete', onClick: self.onDelete }
  ]
}

export const outboundSecurityRulesKeys = (self) => ([
  { field: fields.protocol, serverField: 'protocol', label: 'Protocol' },
  { field: fields.portRangeMin, serverField: 'port_range_min', label: 'Port Range Min' },
  { field: fields.portRangeMax, serverField: 'port_range_max', label: 'Port Range Max' },
  { field: fields.remoteCIDR, serverField: 'remote_cidr', label: 'Remote CIDR' }
])

export const keys = (self)=> ([
  { field: fields.region, label: 'Region', sortable: true, visible: true },
  { field: fields.organizationName, serverField: 'key#OS#developer', label: 'Organization Name', sortable: true, visible: true  },
  { field: fields.privacyPolicyName, serverField: 'key#OS#name', label: 'Privacy Policy Name', sortable: true, visible: true },
  { field: fields.outboundSecurityRulesCount, label: 'Rules Count', sortable: true, visible: true },
  {
    field: fields.outboundSecurityRules, serverField: 'outbound_security_rules', label: 'Outbound Security Rules',
    keys: outboundSecurityRulesKeys(self)
  },  
  { field: 'actions', label: 'Actions', sortable: false, visible: true }
])

const customData = (value) => {
  value[fields.outboundSecurityRulesCount] = value[fields.outboundSecurityRules].length;
}

export const getData = (response, body) => {
  return formatData(response, body, keys(), customData)
}

