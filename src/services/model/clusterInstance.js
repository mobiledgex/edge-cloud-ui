import * as formatter from './format'
import * as serverData from './serverData'
import * as constant from '../../constant'
import uuid from 'uuid'
import { SHOW_CLUSTER_INST, STREAM_CLUSTER_INST, CREATE_CLUSTER_INST, UPDATE_CLUSTER_INST, DELETE_CLUSTER_INST, SHOW_CLOUDLET, SHOW_ORG_CLOUDLET, SHOW_CLOUDLET_INFO } from './endPointTypes'
import { TYPE_JSON, IPAccessLabel } from '../../constant';

let fields = formatter.fields;

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true },
    { field: fields.clusterName, serverField: 'key#OS#cluster_key#OS#name', sortable: true, label: 'Cluster', visible: true, filter: true },
    { field: fields.organizationName, serverField: 'key#OS#organization', sortable: true, label: 'Organization', visible: true, filter: true },
    { field: fields.operatorName, serverField: 'key#OS#cloudlet_key#OS#organization', sortable: true, label: 'Operator', visible: true, filter: true },
    { field: fields.cloudletName, serverField: 'key#OS#cloudlet_key#OS#name', sortable: true, label: 'Cloudlet', visible: true, filter: true },
    { field: fields.flavorName, serverField: 'flavor#OS#name', sortable: true, label: 'Flavor', visible: true, filter: true },
    { field: fields.ipAccess, serverField: 'ip_access', label: 'IP Access', sortable: true, visible: true, filter: true },
    { field: fields.privacyPolicyName, serverField: 'privacy_policy', label: 'Privacy Policy', sortable: true, filter: true },
    { field: fields.cloudletLocation, label: 'Cloudlet Location', dataType: TYPE_JSON },
    { field: fields.nodeFlavor, serverField: 'node_flavor', label: 'Node Flavor' },
    { field: fields.numberOfMasters, serverField: 'num_masters', label: 'Number of Masters' },
    { field: fields.numberOfNodes, serverField: 'num_nodes', label: 'Number of Workers' },
    { field: fields.sharedVolumeSize, serverField: 'shared_volume_size', label: 'Shared Volume Size' },
    { field: fields.deployment, serverField: 'deployment', sortable: true, label: 'Deployment', visible: true, filter: true },
    { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true },
    { field: fields.status, serverField: 'status', label: 'Status', dataType: TYPE_JSON },
    { field: fields.reservable, serverField: 'reservable', label: 'Reservable', roles: ['AdminManager'] },
    { field: fields.reservedBy, serverField: 'reserved_by', label: 'Reserved By', roles: ['AdminManager'] },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
])

export const multiDataRequest = (keys, mcRequestList) => {
    let cloudletDataList = [];
    let clusterDataList = [];
    let cloudletInfoList = [];
    let dataList = [];
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
            if (mcRequest.request.method === SHOW_CLOUDLET_INFO) {
                cloudletInfoList = mcRequest.response.data;
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
            //Filter cluster if cloudlet not found
            if (found) {
                for (let j = 0; j < cloudletInfoList.length; j++) {
                    let cloudletInfo = cloudletInfoList[j]
                    if (clusterData[fields.cloudletName] === cloudletInfo[fields.cloudletName] && clusterData[fields.operatorName] === cloudletInfo[fields.operatorName]) {
                        clusterData[fields.cloudletStatus] = cloudletInfo[fields.state]
                    }
                }
                clusterData[fields.cloudletStatus] = clusterData[fields.cloudletStatus] ? clusterData[fields.cloudletStatus] : constant.CLOUDLET_STATUS_UNKNOWN
                dataList.push(clusterData)
            }
        }
    }
    return dataList;
}

export const showClusterInsts = (data) => {
    if (!formatter.isAdmin()) {
        {
            data.clusterinst = {
                key: {
                    organization: formatter.getOrganization()
                }
            }
        }
    }
    return { method: SHOW_CLUSTER_INST, data: data }
}

export const clusterKey = (data, isCreate) => {
    let clusterinst = {}
    clusterinst.key = {
        cluster_key: { name: data[fields.clusterName] },
        cloudlet_key: { organization: data[fields.operatorName], name: data[fields.cloudletName] },
        organization: data[fields.organizationName]
    }
    clusterinst.flavor = { name: data[fields.flavorName] }
    if (isCreate) {
        clusterinst.deployment = data[fields.deployment]
        if (data[fields.ipAccess]) {
            clusterinst.ip_access = parseInt(IPAccessLabel(data[fields.ipAccess]))
        }
        clusterinst.reservable = data[fields.reservable]
        if (data[fields.reservedBy]) {
            clusterinst.reserved_by = data[fields.reservedBy]
        }
        if (data[fields.numberOfMasters]) {
            clusterinst.num_masters = parseInt(data[fields.numberOfMasters])
        }
        if (data[fields.numberOfNodes]) {
            clusterinst.num_nodes = parseInt(data[fields.numberOfNodes])
        }
        if (data[fields.sharedVolumeSize]) {
            clusterinst.shared_volume_size = parseInt(data[fields.sharedVolumeSize])
        }
        if (data[fields.privacyPolicyName]) {
            clusterinst.privacy_policy = data[fields.privacyPolicyName]
        }
    }
    return ({
        region: data[fields.region],
        clusterinst: clusterinst
    })
}

export const getClusterInstList = async (self, data) => {
    return await serverData.showDataFromServer(self, showClusterInsts(data))
}

export const createClusterInst = (self, data, callback) => {
    let requestData = clusterKey(data, true)
    data.uuid = data[fields.cloudletName]
    let request = { uuid: data.uuid, method: CREATE_CLUSTER_INST, data: requestData }
    return serverData.sendWSRequest(self, request, callback, data)
}

export const updateClusterInst = (self, data, callback) => {
    let requestData = clusterKey(data, true)
    requestData.clusterinst.fields = ['14']
    let request = { uuid: data.uuid ? data.uuid : uuid(), method: UPDATE_CLUSTER_INST, data: requestData }
    return serverData.sendWSRequest(self, request, callback, data)
}

export const deleteClusterInst = (data) => {
    let requestData = clusterKey(data)
    if (data[fields.cloudletStatus] !== constant.CLOUDLET_STATUS_READY && formatter.isAdmin()) {
        requestData.clusterinst.crm_override = constant.CRM_OVERRIDE_IGNORE_CRM
    }
    return { uuid: data.uuid, method: DELETE_CLUSTER_INST, data: requestData, success: `Cluster Instance ${data[fields.appName]} deleted successfully` }
}

export const streamClusterInst = (data) => {
    let requestData = clusterKey(data)
    return { uuid: data.uuid, method: STREAM_CLUSTER_INST, data: requestData }
}


const customData = (value) => {
    value[fields.ipAccess] = IPAccessLabel(value[fields.ipAccess])
    value[fields.reservable] = value[fields.reservable] ? value[fields.reservable] : false
    value[fields.numberOfNodes] = value[fields.deployment] === constant.DEPLOYMENT_TYPE_KUBERNETES ? value[fields.numberOfNodes] ? value[fields.numberOfNodes] : 0 : undefined
    value[fields.sharedVolumeSize] = value[fields.deployment] === constant.DEPLOYMENT_TYPE_KUBERNETES ? value[fields.sharedVolumeSize] ? value[fields.sharedVolumeSize] : 0 : undefined
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys(), customData, true)
}
