import { showAuthSyncRequest } from '../../service';
import { FORMAT_FULL_DATE_TIME } from '../../../utils/date_util'
import { idFormatter, serverFields } from '../../../helper/formatter';
import { redux_org } from '../../../helper/reduxData'
import { perpetual } from '../../../helper/constant';
import { endpoint } from '../..';
import { customize } from '../../modules/clusterInst';
import { generateUUID } from '../../format/shared';
import { cloudletKeys } from '../cloudlet';
import { websocket } from '../..';
import { localFields } from '../../fields';

export const keys = () => ([
    { field: localFields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: localFields.organizationName, serverField: 'key#OS#organization', sortable: true, label: 'Organization', visible: true, filter: true, group: true, key: true, dvisible:true },
    { field: localFields.clusterName, serverField: 'key#OS#cluster_key#OS#name', sortable: true, label: 'Cluster', visible: true, filter: true, key: true, key: true },
    { field: localFields.operatorName, serverField: 'key#OS#cloudlet_key#OS#organization', sortable: true, label: 'Operator', visible: false, filter: true, group: true, key: true, dvisible:true },
    { field: localFields.partnerOperator, serverField: 'key#OS#cloudlet_key#OS#federated_organization', label: 'Partner Operator', visible: false, key: true },
    { field: localFields.cloudletName, serverField: 'key#OS#cloudlet_key#OS#name', sortable: true, label: 'Cloudlet', visible: false, filter: true, group: true, key: true, dvisible:true },
    { field: localFields.cloudlet_name_operator, sortable: true, label: 'Cloudlet [Operator]', visible: true, filter: false, detailView: false, dvisible:true },
    { field: localFields.flavorName, serverField: 'flavor#OS#name', sortable: true, label: 'Flavor', visible: true, filter: true, group: true },
    { field: localFields.ipAccess, serverField: 'ip_access', label: 'IP Access', sortable: true, visible: false, filter: true },
    { field: localFields.autoScalePolicyName, serverField: 'auto_scale_policy', label: 'Auto Scale Policy' },
    { field: localFields.cloudletLocation, label: 'Cloudlet Location', dataType: perpetual.TYPE_JSON },
    { field: localFields.nodeFlavor, serverField: 'node_flavor', label: 'Node Flavor' },
    { field: localFields.numberOfMasters, serverField: 'num_masters', label: 'Number of Masters' },
    { field: localFields.numberOfNodes, serverField: 'num_nodes', label: 'Number of Workers' },
    { field: localFields.sharedVolumeSize, serverField: 'shared_volume_size', label: 'Shared Volume Size' },
    { field: localFields.deployment, serverField: 'deployment', sortable: true, label: 'Deployment', visible: true, filter: true, group: true, dvisible:true },
    { field: localFields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true, format: true },
    { field: localFields.status, serverField: 'status', label: 'Status', dataType: perpetual.TYPE_JSON },
    { field: localFields.reservable, serverField: 'reservable', label: 'Reservable', roles: [perpetual.ADMIN_MANAGER], format: true },
    { field: localFields.reservedBy, serverField: 'reserved_by', label: 'Reserved By', roles: [perpetual.ADMIN_MANAGER] },
    { field: localFields.resources, serverField: 'resources', label: 'Resources', dataType: perpetual.TYPE_JSON },
    { field: localFields.createdAt, serverField: 'created_at', label: 'Created', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } },
    { field: localFields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } }
])

export const multiDataRequest = (keys, mcRequestList, specific) => {
    if (specific) {
        let newList = mcRequestList.new
        if (newList && newList.length > 0) {
            let response = newList[0].response
            if (response && response.status === 200) {
                let dataList = response.data
                if (dataList && dataList.length > 0) {
                    let newData = dataList[0]
                    let oldData = mcRequestList.old
                    newData[localFields.uuid] = oldData[localFields.uuid]
                    newData[localFields.cloudletStatus] = oldData[localFields.cloudletStatus]
                    newData[localFields.cloudletLocation] = oldData[localFields.cloudletLocation];
                    newData = customize(undefined, newData)
                    return newData
                }
            }
        }
        return null
    }
    else {
        let cloudletDataList = [];
        let clusterDataList = [];
        let cloudletInfoList = [];
        let dataList = [];
        for (let i = 0; i < mcRequestList.length; i++) {
            let mcRequest = mcRequestList[i];
            if (mcRequest.response) {
                let method = mcRequest.request.method
                if (method === endpoint.SHOW_CLOUDLET || method === endpoint.SHOW_ORG_CLOUDLET) {
                    cloudletDataList = mcRequest.response.data;
                }
                if (method === endpoint.SHOW_CLUSTER_INST) {
                    clusterDataList = mcRequest.response.data;
                }
                if (method === endpoint.SHOW_CLOUDLET_INFO || method === endpoint.SHOW_ORG_CLOUDLET_INFO) {
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
                    if (clusterData[localFields.cloudletName] === cloudletData[localFields.cloudletName]) {
                        found = true;
                        clusterData[localFields.cloudletLocation] = cloudletData[localFields.cloudletLocation];
                        break;
                    }
                }
                //Filter cluster if cloudlet not found
                if (found) {
                    for (let j = 0; j < cloudletInfoList.length; j++) {
                        let cloudletInfo = cloudletInfoList[j]
                        if (clusterData[localFields.cloudletName] === cloudletInfo[localFields.cloudletName] && clusterData[localFields.operatorName] === cloudletInfo[localFields.operatorName]) {
                            clusterData[localFields.cloudletStatus] = cloudletInfo[localFields.state]
                        }
                    }
                    clusterData[localFields.cloudletStatus] = clusterData[localFields.cloudletStatus] ? clusterData[localFields.cloudletStatus] : serverFields.UNKNOWN
                    dataList.push(clusterData)
                }
            }
        }
        return dataList;
    }
}

export const showClusterInsts = (self, data, specific) => {
    let requestData = {}
    if (specific) {
        let clusterinst = { key: data.clusterinstkey ? data.clusterinstkey : data.clusterinst.key }
        requestData = {
            uuid: data.uuid,
            region: data.region,
            clusterinst
        }
    }
    else {
        requestData.region = data.region
        let organization = data.org ? data.org : redux_org.nonAdminOrg(self)
        if (organization) {
            if (redux_org.isDeveloper(self) || data.type === perpetual.DEVELOPER) {
                requestData.clusterinst = { key: { organization } }
            }
            else if (redux_org.isOperator(self) || data.type === perpetual.OPERATOR) {
                requestData.clusterinst = {
                    key: { cloudlet_key: { organization } }
                }
            }
        }
    }
    return { method: endpoint.SHOW_CLUSTER_INST, data: requestData, keys: keys() }
}

export const clusterInstanceKey = (data) => {
    return {
        cluster_key: { name: data[localFields.clusterName] },
        cloudlet_key: cloudletKeys(data),
        organization: data[localFields.organizationName]
    }
}

export const clusterKey = (data, isCreate) => {
    let clusterinst = {}
    clusterinst.key = clusterInstanceKey(data)

    if (isCreate) {
        clusterinst.deployment = data[localFields.deployment]
        if (data[localFields.ipAccess]) {
            clusterinst.ip_access = idFormatter.ipAccess(data[localFields.ipAccess])
        }
        clusterinst.reservable = data[localFields.reservable]
        if (data[localFields.reservedBy]) {
            clusterinst.reserved_by = data[localFields.reservedBy]
        }
        if (data[localFields.numberOfMasters]) {
            clusterinst.num_masters = parseInt(data[localFields.numberOfMasters])
        }
        if (data[localFields.numberOfNodes]) {
            clusterinst.num_nodes = parseInt(data[localFields.numberOfNodes])
        }
        if (data[localFields.sharedVolumeSize]) {
            clusterinst.shared_volume_size = parseInt(data[localFields.sharedVolumeSize])
        }
        if (data[localFields.autoScalePolicyName]) {
            clusterinst.auto_scale_policy = data[localFields.autoScalePolicyName]
        }
        if (data[localFields.flavorName]) {
            clusterinst.flavor = { name: data[localFields.flavorName] }
        }
        if (data[localFields.fields]) {
            clusterinst.fields = data[localFields.fields]
        }
        if (data[localFields.network]) {
            clusterinst.networks = data[localFields.network]
        }
    }
    return ({
        region: data[localFields.region],
        clusterinst: clusterinst
    })
}

export const getClusterInstList = async (self, data) => {
    return await showAuthSyncRequest(self, showClusterInsts(self, data))
}

export const createClusterInst = (self, data, callback) => {
    let requestData = clusterKey(data, true)
    data.uuid = data[localFields.cloudletName]
    let request = { uuid: data.uuid, method: endpoint.CREATE_CLUSTER_INST, data: requestData }
    return websocket.request(self, request, callback, data)
}

export const updateClusterInst = (self, data, callback) => {
    let requestData = clusterKey(data, true)
    let request = { uuid: data.uuid ? data.uuid : generateUUID(keys(), data), method: endpoint.UPDATE_CLUSTER_INST, data: requestData }
    return websocket.request(self, request, callback, data)
}

export const deleteClusterInst = (self, data) => {
    let requestData = clusterKey(data)
    if (data[localFields.cloudletStatus] !== serverFields.READY && redux_org.isAdmin(self)) {
        requestData.clusterinst.crm_override = perpetual.CRM_OVERRIDE_IGNORE_CRM
    }
    return { uuid: data.uuid, method: endpoint.DELETE_CLUSTER_INST, data: requestData, success: `Cluster Instance ${data[localFields.appName]} deleted successfully` }
}

export const streamClusterInst = (data) => {
    let requestData = { region: data[localFields.region], clusterinstkey: clusterInstanceKey(data) }
    return { uuid: data.uuid, method: endpoint.STREAM_CLUSTER_INST, data: requestData }
}