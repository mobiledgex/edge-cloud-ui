import * as formatter from './format'
import * as constant from './shared';
import { TYPE_JSON } from '../../constant';

let fields = formatter.fields;

export const SHOW_CLUSTER_INST = "ShowClusterInst";
export const STREAM_CLUSTER_INST = "StreamClusterInst";
export const DELETE_CLUSTER_INST = "DeleteClusterInst";

export const keys = [
    { field: fields.region, label: 'Region', sortable: true, visible: true },
    { field: fields.clusterName, serverField: 'key#OS#cluster_key#OS#name', sortable: true, label: 'Cluster', visible: true },
    { field: fields.organizationName, serverField: 'key#OS#developer', sortable: true, label: 'Organization', visible: true },
    { field: fields.operatorName, serverField: 'key#OS#cloudlet_key#OS#operator_key#OS#name', sortable: true, label: 'Operator', visible: true },
    { field: fields.cloudletName, serverField: 'key#OS#cloudlet_key#OS#name', sortable: true, label: 'Cloudlet', visible: true },
    { field: fields.flavorName, serverField: 'flavor#OS#name', sortable: true, label: 'Flavor', visible: true },
    { field: fields.ipAccess, serverField: 'ip_access', label: 'IP Access', sortable: true, visible: true },
    { field: fields.cloudletLocation, label: 'Cloudlet Location', dataType: TYPE_JSON },
    { field: fields.nodeFlavor, serverField: 'node_flavor', label: 'Node Flavor' },
    { field: fields.numberOfMasters, serverField: 'num_masters', label: 'Number of Masters' },
    { field: fields.numberOfNodes, serverField: 'num_nodes', label: 'Node of Nodes' },
    { field: fields.deployment, serverField: 'deployment', sortable: true, label: 'Deployment', visible: true },
    { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true },
    { field: fields.status, serverField: 'status', label: 'Status', dataType: TYPE_JSON },
    { field: fields.reservable, serverField: 'reservable' },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const showClusterInsts = (data) => {
    if (!formatter.isAdmin()) {
        {
            data.clusterinst = {
                key: {
                    developer: formatter.getOrganization()
                }
            }
        }
    }
    return { method: SHOW_CLUSTER_INST, data: data }
}

export const deleteClusterInst = (data) => {
    let requestData = getKey(data)
    return { uuid: data.uuid, method: DELETE_CLUSTER_INST, data: requestData, success: `Cluster Instance ${data[fields.appName]}` }
}

export const streamClusterInst = (data) => {
    let requestData = getKey(data)
    return { uuid: data.uuid, method: STREAM_CLUSTER_INST, data: requestData }
}
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

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData, true)
}