import { fields } from "../../model/format"
import { primaryKeys as cloudletKeys } from "../../modules/cloudlet/primary"

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

export const primaryKeys = (data, include) => {
  include = include ? include : AIK_APP_ALL
  let appKey = undefined

  if (include === AIK_APP_ORG || include === AIK_APP_ALL) {
    appKey = initialize(appKey, 'organization', data[fields.organizationName])
  }

  if (include === AIK_APP_ALL) {
    appKey = initialize(appKey, 'name', data[fields.appName])
    appKey = initialize(appKey, 'version', data[fields.version])
  }


  let clusterInstKey = undefined
  if (include === AIK_APP_CLOUDLET_CLUSTER || include === AIK_APP_CLOUDLET || include === AIK_CLOUDLET || include === AIK_CLOUDLET_CLUSTER) {
    clusterInstKey = initialize(clusterInstKey, 'cloudlet_key', cloudletKeys(data))
  }

  if (include === AIK_APP_CLOUDLET_CLUSTER || include === AIK_APP_CLUSTER || include === AIK_CLOUDLET_CLUSTER) {
    let clusterKey = undefined
    clusterKey = initialize(clusterKey, 'name', data[fields.clusterName])
    clusterInstKey = initialize(clusterInstKey, 'cluster_key', clusterKey)
    clusterInstKey = initialize(clusterInstKey, 'organization', data[fields.clusterdeveloper])
  }

  let appInstKey = undefined
  if (clusterInstKey) {
    appInstKey = initialize(appInstKey, 'cluster_inst_key', clusterInstKey)
  }

  appInstKey = initialize(appInstKey, 'app_key', appKey)

  return appInstKey
}