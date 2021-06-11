import * as formatter from './format'
import * as serverData from './serverData'
import * as constant from '../../constant'
import { TYPE_JSON } from '../../constant';
import { FORMAT_FULL_DATE_TIME } from '../../utils/date_util'
import { labelFormatter, idFormatter } from '../../helper/formatter';
import { redux_org } from '../../helper/reduxData'
import { endpoint } from '../../helper/constant';

let fields = formatter.fields;

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: fields.organizationName, serverField: 'key#OS#organization', sortable: true, label: 'Organization', visible: true, filter: true, group: true, key: true },
    { field: fields.clusterName, serverField: 'key#OS#cluster_key#OS#name', sortable: true, label: 'Cluster', visible: true, filter: true, key: true, key: true },
    { field: fields.operatorName, serverField: 'key#OS#cloudlet_key#OS#organization', sortable: true, label: 'Operator', visible: false, filter: true, group: true, key: true },
    { field: fields.cloudletName, serverField: 'key#OS#cloudlet_key#OS#name', sortable: true, label: 'Cloudlet', visible: false, filter: true, group: true, key: true },
    { field: fields.cloudlet_name_operator, sortable: true, label: 'Cloudlet [Operator]', visible: true, filter: false, detailView:false},
    { field: fields.flavorName, serverField: 'flavor#OS#name', sortable: true, label: 'Flavor', visible: true, filter: true, group: true },
    { field: fields.ipAccess, serverField: 'ip_access', label: 'IP Access', sortable: true, visible: false, filter: true },
    { field: fields.autoScalePolicyName, serverField: 'auto_scale_policy', label: 'Auto Scale Policy' },
    { field: fields.cloudletLocation, label: 'Cloudlet Location', dataType: TYPE_JSON },
    { field: fields.nodeFlavor, serverField: 'node_flavor', label: 'Node Flavor' },
    { field: fields.numberOfMasters, serverField: 'num_masters', label: 'Number of Masters' },
    { field: fields.numberOfNodes, serverField: 'num_nodes', label: 'Number of Workers' },
    { field: fields.sharedVolumeSize, serverField: 'shared_volume_size', label: 'Shared Volume Size' },
    { field: fields.deployment, serverField: 'deployment', sortable: true, label: 'Deployment', visible: true, filter: true, group: true },
    { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true, format: true },
    { field: fields.status, serverField: 'status', label: 'Status', dataType: TYPE_JSON },
    { field: fields.reservable, serverField: 'reservable', label: 'Reservable', roles: [constant.ADMIN_MANAGER], format: true },
    { field: fields.reservedBy, serverField: 'reserved_by', label: 'Reserved By', roles: [constant.ADMIN_MANAGER] },
    { field: fields.resources, serverField: 'resources', label: 'Resources', dataType: TYPE_JSON },
    { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: constant.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: constant.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true, roles:[constant.ADMIN, constant.DEVELOPER] }
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
                    newData = customData(newData)
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
                    clusterData[fields.cloudletStatus] = clusterData[fields.cloudletStatus] ? clusterData[fields.cloudletStatus] : constant.CLOUDLET_STATUS_UNKNOWN
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
            if (redux_org.isDeveloper(self) || data.type === constant.DEVELOPER) {
                requestData.clusterinst = { key: { organization } }
            }
            else if (redux_org.isOperator(self)  || data.type === constant.OPERATOR) {
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
    }
    return ({
        region: data[fields.region],
        clusterinst: clusterinst
    })
}

export const getClusterInstList = async (self, data) => {
    return await serverData.showDataFromServer(self, showClusterInsts(self, data))
}

export const createClusterInst = (self, data, callback) => {
    let requestData = clusterKey(data, true)
    data.uuid = data[fields.cloudletName]
    let request = { uuid: data.uuid, method: endpoint.CREATE_CLUSTER_INST, data: requestData }
    return serverData.sendWSRequest(self, request, callback, data)
}

export const updateClusterInst = (self, data, callback) => {
    let requestData = clusterKey(data, true)
    let request = { uuid: data.uuid ? data.uuid : formatter.generateUUID(keys(), data), method: endpoint.UPDATE_CLUSTER_INST, data: requestData }
    return serverData.sendWSRequest(self, request, callback, data)
}

export const deleteClusterInst = (self, data) => {
    let requestData = clusterKey(data)
    if (data[fields.cloudletStatus] !== constant.CLOUDLET_STATUS_READY && redux_org.isAdmin(self)) {
        requestData.clusterinst.crm_override = constant.CRM_OVERRIDE_IGNORE_CRM
    }
    return { uuid: data.uuid, method: endpoint.DELETE_CLUSTER_INST, data: requestData, success: `Cluster Instance ${data[fields.appName]} deleted successfully` }
}

export const streamClusterInst = (data) => {
    let requestData = { region: data[fields.region], clusterinstkey: clusterInstanceKey(data) }
    return { uuid: data.uuid, method: endpoint.STREAM_CLUSTER_INST, data: requestData }
}


const customData = (value) => {
    value[fields.ipAccess] = labelFormatter.ipAccess(value[fields.ipAccess])
    value[fields.reservable] = value[fields.reservable] ? value[fields.reservable] : false
    value[fields.numberOfNodes] = value[fields.deployment] === constant.DEPLOYMENT_TYPE_KUBERNETES ? value[fields.numberOfNodes] ? value[fields.numberOfNodes] : 0 : undefined
    value[fields.sharedVolumeSize] = value[fields.deployment] === constant.DEPLOYMENT_TYPE_KUBERNETES ? value[fields.sharedVolumeSize] ? value[fields.sharedVolumeSize] : 0 : undefined
    value[fields.createdAt] = value[fields.createdAt] ? value[fields.createdAt][fields.seconds] : undefined
    value[fields.updatedAt] = value[fields.updatedAt] ? value[fields.updatedAt][fields.seconds] : undefined
    value[fields.cloudlet_name_operator] = `${value[fields.cloudletName]} [${value[fields.operatorName]}]`
    return value
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys(), customData, true)
}
