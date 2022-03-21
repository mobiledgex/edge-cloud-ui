import { localFields } from "../../fields"
import { cloudletKeys } from "../../modules/cloudlet/primary"

const initialize = (parent, field, value) => {
  if (value) {
    parent = parent ? parent : {}
    parent[field] = value
  }
  return parent
}

export const AIK_APP_CLOUDLET_CLUSTER = 0
export const AIK_APP_CLOUDLET = 1
export const AIK_APP_CLUSTER = 2
export const AIK_CLOUDLET_CLUSTER = 3
export const AIK_CLOUDLET = 4
export const AIK_CLUSTER = 5
export const AIK_APP_ALL = 6
export const AIK_APP_ORG = 7

export const appInstKeys = (data, include) => {
  include = include !== undefined ? include : AIK_APP_ALL
  let appKey = undefined

  if (include === AIK_APP_ORG || include === AIK_APP_ALL || include === AIK_APP_CLOUDLET_CLUSTER) {
    appKey = initialize(appKey, 'organization', data[localFields.organizationName])
  }

  if (include === AIK_APP_ALL || include === AIK_APP_CLOUDLET_CLUSTER) {
    appKey = initialize(appKey, 'name', data[localFields.appName])
    appKey = initialize(appKey, 'version', data[localFields.version])
  }


  let clusterInstKey = undefined
  if (include === AIK_APP_CLOUDLET_CLUSTER || include === AIK_APP_CLOUDLET || include === AIK_CLOUDLET || include === AIK_CLOUDLET_CLUSTER) {
    clusterInstKey = initialize(clusterInstKey, 'cloudlet_key', cloudletKeys(data))
  }

  if (include === AIK_APP_CLOUDLET_CLUSTER || include === AIK_APP_CLUSTER || include === AIK_CLOUDLET_CLUSTER) {
    let clusterKey = undefined
    clusterKey = initialize(clusterKey, 'name', data[localFields.clusterName])
    clusterInstKey = initialize(clusterInstKey, 'cluster_key', clusterKey)
    clusterInstKey = initialize(clusterInstKey, 'organization', data[localFields.clusterdeveloper])
  }

  let appInstKey = undefined
  if (clusterInstKey) {
    appInstKey = initialize(appInstKey, 'cluster_inst_key', clusterInstKey)
  }

  appInstKey = initialize(appInstKey, 'app_key', appKey)

  return appInstKey
}