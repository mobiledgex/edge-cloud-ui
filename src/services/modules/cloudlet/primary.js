import { fields } from "../../model/format"

const initialize = (parent, field, value) => {
  if (value) {
    parent = parent ? parent : {}
    parent[field] = value
  }
  return parent
}

export const primaryKeys = (data) => {
  let cloudletKey = undefined
  cloudletKey = initialize(cloudletKey, 'name', data[fields.cloudletName])
  cloudletKey = initialize(cloudletKey, 'organization', data[fields.operatorName])
  return cloudletKey
}