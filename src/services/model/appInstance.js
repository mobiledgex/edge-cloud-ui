import { fields, formatData } from './format'

const keys = [
  { field: fields.organizationName, serverField: 'key#OS#app_key#OS#developer_key#OS#name' },
  { field: fields.appName, serverField: 'key#OS#app_key#OS#name' },
  { field: fields.version, serverField: 'key#OS#app_key#OS#version' },
  { field: fields.operatorName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#operator_key#OS#name' },
  { field: fields.cloudletName, serverField: 'key#OS#cluster_inst_key#OS#cloudlet_key#OS#name' },
  { field: fields.cloudletLocation, serverField: 'cloudlet_loc' },
  { field: fields.clusterName, serverField: 'key#OS#cluster_inst_key#OS#cluster_key#OS#name' },
  { field: fields.uri, serverField: 'uri' },
  { field: fields.liveness, serverField: 'liveness' },
  { field: fields.mappedPorts, serverField: 'mapped_ports' },
  { field: fields.flavorName, serverField: 'flavor#OS#name' },
  { field: fields.state, serverField: 'state' },
  { field: fields.runtimeInfo, serverField: 'runtime_info' },
  { field: fields.createdAt, serverField: 'created_at' },
  { field: fields.status, serverField: 'status' },
]

export const getKey = (data) => {
  return ({
    region: data[fields.region],
    appinst: {
      key: {
        app_key: { developer_key: { name: data[fields.organizationName] }, name: data[fields.appName], version: data[fields.version] },
        cluster_inst_key: {
          cloudlet_key: { name: data[fields.cloudletName], operator_key: { name: data[fields.operatorName] } },
          cluster_key: { name: data[fields.clusterName] },
          developer: data[fields.organizationName]
        }
      },
    }
  })
}

export const getData = (response, body) => {
  return formatData(response, body, keys, true)
}
