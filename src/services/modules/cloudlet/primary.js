import { fields } from "../../model/format"


export const CK_ORG_NAME_FEDERATOR = 0
export const CK_ORG = 1
export const CK_NAME = 2
export const CK_FEDERATOR = 3

const initialize = (parent, field, value) => {
  if (value) {
    parent = parent ? parent : {}
    parent[field] = value
  }
  return parent
}

export const cloudletKeys = (data, include) => {
  let cloudletKey = undefined
  include = Boolean(include) ? include : CK_ORG_NAME_FEDERATOR
  if (include === CK_ORG_NAME_FEDERATOR || include === CK_NAME) {
    cloudletKey = initialize(cloudletKey, 'name', data[fields.cloudletName])
  }
  if (include === CK_ORG_NAME_FEDERATOR || include === CK_ORG) {
    cloudletKey = initialize(cloudletKey, 'organization', data[fields.operatorName] ? data[fields.operatorName] : data[fields.organizationName])
  }
  if (include === CK_ORG_NAME_FEDERATOR || include === CK_FEDERATOR) {
    cloudletKey = initialize(cloudletKey, 'federated_organization', data[fields.partnerOperator])
  }
  return cloudletKey
}