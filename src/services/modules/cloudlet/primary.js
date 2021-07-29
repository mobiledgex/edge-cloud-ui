import { fields } from "../../model/format"


export const CK_ORG_NAME = 0
export const CK_ORG = 1
export const CK_NAME = 2

const initialize = (parent, field, value) => {
  if (value) {
    parent = parent ? parent : {}
    parent[field] = value
  }
  return parent
}

export const primaryKeys = (data, include) => {
  let cloudletKey = undefined
  include = include !== undefined ? include : CK_ORG_NAME
  if (include === CK_ORG_NAME || include === CK_NAME) {
    cloudletKey = initialize(cloudletKey, 'name', data[fields.cloudletName])
  }
  if (include === CK_ORG_NAME || include === CK_ORG) {
    cloudletKey = initialize(cloudletKey, 'organization', data[fields.operatorName] ? data[fields.operatorName] : data[fields.organizationName])
  }
  return cloudletKey
}