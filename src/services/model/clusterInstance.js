import { fields, formatData } from './format'
import * as constant from './shared';
import { TYPE_JSON } from '../../hoc/constant';

export const keys = [
    { field: fields.region, label: 'Region', sortable: true, visible: true },
    { field: fields.clusterName, serverField: 'key#OS#cluster_key#OS#name', label: 'Cluster', visible: true },
    { field: fields.organizationName, serverField: 'key#OS#developer', label: 'Organization', visible: true },
    { field: fields.operatorName, serverField: 'key#OS#cloudlet_key#OS#operator_key#OS#name', label: 'Operator', visible: true },
    { field: fields.cloudletName, serverField: 'key#OS#cloudlet_key#OS#name', label: 'Cloudlet', visible: true },
    { field: fields.flavorName, serverField: 'flavor#OS#name', label: 'Flavor', visible: true },
    { field: fields.ipAccess, serverField: 'ip_access', label: 'IP Access', visible: true, customizedData: constant.getIPAccess },
    { field: fields.cloudletLocation, label: 'Cloudlet Location', dataType: TYPE_JSON },
    { field: fields.nodeFlavor, serverField: 'node_flavor', label:'Node Flavor'},
    { field: fields.numberOfMasters, serverField: 'num_masters', label:'Number of Masters'},
    { field: fields.numberOfNodes, serverField: 'num_nodes', label:'Node of Nodes' },
    { field: fields.state, serverField: 'state', label: 'Progress', visible: true, customizedData: constant.showProgress, clickable: true },
    { field: fields.status, serverField: 'status', label:'Status', dataType:TYPE_JSON },
    { field: fields.reservable, serverField: 'reservable' },
    { field: fields.deployment, serverField: 'deployment', label: 'Deployment', visible: true },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
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

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatData(response, body, keys, customData, true)
}