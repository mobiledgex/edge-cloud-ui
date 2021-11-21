import * as formatter from '../../model/format'
import * as serverData from '../../model/serverData'
import { showAuthSyncRequest } from '../../service';
import { FORMAT_FULL_DATE_TIME } from '../../../utils/date_util'
import { idFormatter } from '../../../helper/formatter';
import { redux_org } from '../../../helper/reduxData'
import { endpoint, perpetual } from '../../../helper/constant';
import { customize } from '../../modules/clusterInst';
import { generateUUID } from '../../format/shared';
import { developerRoles } from '../../../constant';

let fields = formatter.fields;

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: fields.organizationName, serverField: 'key#OS#organization', sortable: true, label: 'Organization', visible: true, filter: true, group: true, key: true },
    { field: fields.clusterName, serverField: 'key#OS#cluster_key#OS#name', sortable: true, label: 'Cluster', visible: true, filter: true, key: true, key: true },
    { field: fields.operatorName, serverField: 'key#OS#cloudlet_key#OS#organization', sortable: true, label: 'Operator', visible: false, filter: true, group: true, key: true },
    { field: fields.cloudletName, serverField: 'key#OS#cloudlet_key#OS#name', sortable: true, label: 'Cloudlet', visible: false, filter: true, group: true, key: true },
    { field: fields.cloudlet_name_operator, sortable: true, label: 'Cloudlet [Operator]', visible: true, filter: false, detailView: false },
    { field: fields.flavorName, serverField: 'flavor#OS#name', sortable: true, label: 'Flavor', visible: true, filter: true, group: true },
    { field: fields.ipAccess, serverField: 'ip_access', label: 'IP Access', sortable: true, visible: false, filter: true },
    { field: fields.autoScalePolicyName, serverField: 'auto_scale_policy', label: 'Auto Scale Policy' },
    { field: fields.cloudletLocation, label: 'Cloudlet Location', dataType: perpetual.TYPE_JSON },
    { field: fields.nodeFlavor, serverField: 'node_flavor', label: 'Node Flavor' },
    { field: fields.numberOfMasters, serverField: 'num_masters', label: 'Number of Masters' },
    { field: fields.numberOfNodes, serverField: 'num_nodes', label: 'Number of Workers' },
    { field: fields.sharedVolumeSize, serverField: 'shared_volume_size', label: 'Shared Volume Size' },
    { field: fields.deployment, serverField: 'deployment', sortable: true, label: 'Deployment', visible: true, filter: true, group: true },
    { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true, format: true },
    { field: fields.status, serverField: 'status', label: 'Status', dataType: perpetual.TYPE_JSON },
    { field: fields.reservable, serverField: 'reservable', label: 'Reservable', roles: [perpetual.ADMIN_MANAGER], format: true },
    { field: fields.reservedBy, serverField: 'reserved_by', label: 'Reserved By', roles: [perpetual.ADMIN_MANAGER] },
    { field: fields.resources, serverField: 'resources', label: 'Resources', dataType: perpetual.TYPE_JSON },
    { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true, roles: developerRoles }
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
                    newData[fields.uuid] = oldData[fields.uuid]
                    newData[fields.cloudletStatus] = oldData[fields.cloudletStatus]
                    newData[fields.cloudletLocation] = oldData[fields.cloudletLocation];
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
                    clusterData[fields.cloudletStatus] = clusterData[fields.cloudletStatus] ? clusterData[fields.cloudletStatus] : perpetual.CLOUDLET_STATUS_UNKNOWN
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
        cluster_key: { name: data[fields.clusterName] },
        cloudlet_key: { organization: data[fields.operatorName], name: data[fields.cloudletName] },
        organization: data[fields.organizationName]
    }
}

export const clusterKey = (data, isCreate) => {
    let clusterinst = {}
    clusterinst.key = clusterInstanceKey(data)

    if (isCreate) {
        clusterinst.deployment = data[fields.deployment]
        if (data[fields.ipAccess]) {
            clusterinst.ip_access = idFormatter.ipAccess(data[fields.ipAccess])
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
        if (data[fields.autoScalePolicyName]) {
            clusterinst.auto_scale_policy = data[fields.autoScalePolicyName]
        }
        if (data[fields.flavorName]) {
            clusterinst.flavor = { name: data[fields.flavorName] }
        }
        if (data[fields.fields]) {
            clusterinst.fields = data[fields.fields]
        }
        if (data[fields.network]) {
            clusterinst.networks = data[fields.network]
        }
    }
    return ({
        region: data[fields.region],
        clusterinst: clusterinst
    })
}

export const getClusterInstList = async (self, data) => {
    return await showAuthSyncRequest(self, showClusterInsts(self, data))
}

export const createClusterInst = (self, data, callback) => {
    let requestData = clusterKey(data, true)
    data.uuid = data[fields.cloudletName]
    let request = { uuid: data.uuid, method: endpoint.CREATE_CLUSTER_INST, data: requestData }
    return serverData.sendWSRequest(self, request, callback, data)
}

export const updateClusterInst = (self, data, callback) => {
    let requestData = clusterKey(data, true)
    let request = { uuid: data.uuid ? data.uuid : generateUUID(keys(), data), method: endpoint.UPDATE_CLUSTER_INST, data: requestData }
    return serverData.sendWSRequest(self, request, callback, data)
}

export const deleteClusterInst = (self, data) => {
    let requestData = clusterKey(data)
    if (data[fields.cloudletStatus] !== perpetual.CLOUDLET_STATUS_READY && redux_org.isAdmin(self)) {
        requestData.clusterinst.crm_override = perpetual.CRM_OVERRIDE_IGNORE_CRM
    }
    return { uuid: data.uuid, method: endpoint.DELETE_CLUSTER_INST, data: requestData, success: `Cluster Instance ${data[fields.appName]} deleted successfully` }
}

export const streamClusterInst = (data) => {
    let requestData = { region: data[fields.region], clusterinstkey: clusterInstanceKey(data) }
    return { uuid: data.uuid, method: endpoint.STREAM_CLUSTER_INST, data: requestData }
}