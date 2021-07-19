import { fields } from "../../model/format"


export const CLOUDLET_ORG_NAME = 0
export const CLOUDLET_ORG = 1
export const CLOUDLET_NAME = 2

const initialize = (parent, field, value) => {
  if (value) {
    parent = parent ? parent : {}
    parent[field] = value
  }
  return parent
}

export const primaryKeys = (data, include) => {
  let cloudletKey = undefined
  include = include ? include : CLOUDLET_ORG_NAME
  if (include === CLOUDLET_ORG_NAME || include === CLOUDLET_NAME) {
    cloudletKey = initialize(cloudletKey, 'name', data[fields.cloudletName])
  }
  if (include === CLOUDLET_ORG_NAME || include === CLOUDLET_ORG) {
    cloudletKey = initialize(cloudletKey, 'organization', data[fields.operatorName])
  }
  return cloudletKey
}