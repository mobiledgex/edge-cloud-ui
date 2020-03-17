import * as formatter from './format'
import { SHOW_CLUSTER_INST, STREAM_CLUSTER_INST, DELETE_CLUSTER_INST, SHOW_CLOUDLET, SHOW_ORG_CLOUDLET} from './endPointTypes'
import { TYPE_JSON } from '../../constant';

let fields = formatter.fields;

export const keys = [
    { field: fields.region, label: 'Region', sortable: true, visible: true },
    { field: fields.clusterName, serverField: 'key#OS#cluster_key#OS#name', sortable: true, label: 'Cluster', visible: true },
    { field: fields.organizationName, serverField: 'key#OS#organization', sortable: true, label: 'Organization', visible: true },
    { field: fields.operatorName, serverField: 'key#OS#cloudlet_key#OS#organization', sortable: true, label: 'Operator', visible: true },
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

export const multiDataRequest = (keys, mcRequestList) => {
    let cloudletDataList = [];
    let clusterDataList = [];
    for (let i = 0; i < mcRequestList.length; i++) {
        let mcRequest = mcRequestList[i];
        if (mcRequest.response) {
            let request = mcRequest.request;
            if (request.method === SHOW_CLOUDLET || request.method === SHOW_ORG_CLOUDLET) {
                cloudletDataList = mcRequest.response.data;
            }
            if (mcRequest.request.method === SHOW_CLUSTER_INST) {
                clusterDataList = mcRequest.response.data;
            }
        }
    }

    if (clusterDataList && clusterDataList.length > 0) {
        for (let i = 0; i < clusterDataList.length; i++) {
            let found = false
            let clusterData = clusterDataList[i]
            for (let j = 0; j < cloudletDataList.length; j++) {
                let cloudletData = cloudletDataList[j]
                if (clusterData[fields.cloudletName] === cloudletData[fields.cloudletName]) {
                    found = true;
                    clusterData[fields.cloudletLocation] = cloudletData[fields.cloudletLocation];
                    break;
                }
            }
            if(!found)
            {
                //Remove cluster if cloudlet not found
                clusterDataList.splice(i,1)
            }
        }
    }
    return clusterDataList;
}

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
                cloudlet_key: { organization : data[fields.operatorName], name: data[fields.cloudletName] },
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