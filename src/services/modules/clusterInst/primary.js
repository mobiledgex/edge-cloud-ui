import { localFields } from "../../fields"
import { cloudletKeys } from "../../modules/cloudlet/primary"

const initialize = (parent, field, value) => {
  if (value) {
    parent = parent ? parent : {}
    parent[field] = value
  }
  return parent
}

export const CIK_CLOUDLET_CLUSTER = 1
export const CIK_CLOUDLET = 2
export const CIK_CLUSTER = 3
export const CIK_CLUSTER_ALL = 4

export const clusterInstKeys = (data, include) => {
  include = include !== undefined ? include : CIK_CLUSTER_ALL
  let clusterInstKey = undefined

  clusterInstKey = initialize(clusterInstKey, 'organization', data[localFields.clusterdeveloper] ? data[localFields.clusterdeveloper] : data[localFields.organizationName])

  if (include === CIK_CLOUDLET || include === CIK_CLOUDLET_CLUSTER) {
    clusterInstKey = initialize(clusterInstKey, 'cloudlet_key', cloudletKeys(data))
  }

  if (include === CIK_CLOUDLET_CLUSTER) {
    let clusterKey = undefined
    clusterKey = initialize(clusterKey, 'name', data[localFields.clusterName])
    clusterInstKey = initialize(clusterInstKey, 'cluster_key', clusterKey)
  }
  return clusterInstKey
}