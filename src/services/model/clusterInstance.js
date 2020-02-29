import { fields, formatData } from './format'

const keys = [
    { field: fields.clusterName, serverField: 'key#OS#cluster_key#OS#name' },
    { field: fields.organizationName, serverField: 'key#OS#developer' },
    { field: fields.operatorName, serverField: 'key#OS#cloudlet_key#OS#operator_key#OS#name' },
    { field: fields.cloudletName, serverField: 'key#OS#cloudlet_key#OS#name' },
    { field: fields.flavorName, serverField: 'flavor#OS#name' },
    { field: fields.ipAccess, serverField: 'ip_access' },
    { field: fields.nodeFlavor, serverField: 'node_flavor' },
    { field: fields.numberOfMasters, serverField: 'num_masters' },
    { field: fields.numberOfNodes, serverField: 'num_nodes' },
    { field: fields.state, serverField: 'state' },
    { field: fields.status, serverField: 'status' },
    { field: fields.reservable, serverField: 'reservable' },
    { field: fields.deployment, serverField: 'deployment' }
]

export const getKey = (data) => {
    return ({
        region: data[fields.region],
        clusterinst: {
            key: {
                cluster_key: { name: data[fields.clusterName] },
                cloudlet_key: { operator_key: { name: data[fields.operatorName] }, name: data[fields.cloudletName] },
                developer: data[fields.organizationName]
            },
            flavor: { name: data[fields.flavorName] }
        }
    })
}

export const getData = (response, body) => {
    return formatData(response, body, keys, true)
}