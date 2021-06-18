import { fields } from "../../model/format"

const initialize = (parent, field, value) => {
  if (value) {
    parent = parent ? parent : {}
    parent[field] = value
  }
  return parent
}

export const primaryKeys = (data) => {

  let appKey = undefined
  appKey = initialize(appKey, 'organization', data[fields.organizationName])
  appKey = initialize(appKey, 'name', data[fields.appName])
  appKey = initialize(appKey, 'version', data[fields.version])
  
  let clusterKey = undefined
  clusterKey = initialize(clusterKey, 'name', data[fields.clusterName])
  
  let cloudletKey = undefined
  cloudletKey = initialize(cloudletKey, 'name', data[fields.cloudletName])
  cloudletKey = initialize(cloudletKey, 'organization', data[fields.operatorName])

  let clusterInstKey = undefined
  clusterInstKey = initialize(clusterInstKey, 'cluster_key', clusterKey)
  clusterInstKey = initialize(clusterInstKey, 'cloudlet_key', cloudletKey)
  clusterInstKey = initialize(clusterInstKey, 'organization', data[fields.clusterdeveloper])
  
  let appInstKey = undefined
  appInstKey = initialize(appInstKey, 'app_key', appKey)
  appInstKey = initialize(appInstKey, 'cluster_inst_key', clusterInstKey)

  return appInstKey
}