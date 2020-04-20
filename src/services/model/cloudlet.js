import * as formatter from './format'
import uuid from 'uuid'
import * as serverData from './serverData'
import * as constant from '../../constant'
import { SHOW_CLOUDLET, SHOW_ORG_CLOUDLET, CREATE_CLOUDLET, UPDATE_CLOUDLET, STREAM_CLOUDLET, DELETE_CLOUDLET, SHOW_CLOUDLET_INFO } from './endPointTypes'

const fields = formatter.fields;

export const getKey = (data, isCreate) => {
    let cloudlet = {}
    cloudlet.key = {
        organization: data[fields.operatorName],
        name: data[fields.cloudletName]
    }
    if (isCreate) {
        cloudlet.location = data[fields.cloudletLocation]
        cloudlet.num_dynamic_ips = parseInt(data[fields.numDynamicIPs])
        cloudlet.physical_name = data[fields.physicalName]
        cloudlet.ip_support = constant.IPSupport(data[fields.ipSupport])
        cloudlet.platform_type = constant.PlatformType(data[fields.platformType])
        let accessvars = {}
        if (data[fields.openRCData]) {
            accessvars.OPENRC_DATA = data[fields.openRCData]
        }
        if (data[fields.caCertdata]) {
            accessvars.CACERT_DATA = data[fields.caCertdata]
        }
        if (data[fields.openRCData] || data[fields.openRCData]) {
            cloudlet.accessvars = accessvars
        }
        if (data[fields.containerVersion]) {
            cloudlet.container_version = data[fields.containerVersion]
        }
    }
    return ({
        region: data[fields.region],
        cloudlet: cloudlet
    })
}

export const multiDataRequest = (keys, mcRequestList) => {
    let cloudletList = [];
    let cloudletInfoList = [];
    for (let i = 0; i < mcRequestList.length; i++) {
        let mcRequest = mcRequestList[i];
        let request = mcRequest.request;
        if (request.method === SHOW_CLOUDLET || request.method === SHOW_ORG_CLOUDLET) {
            for (let i = 0; i < keys.length > 0; i++) {
                let key = keys[i];
                if (key.field === fields.cloudletStatus) {
                    key.visible = request.method === SHOW_ORG_CLOUDLET ? false : true;
                    break;
                }
            }
            cloudletList = mcRequest.response.data
        }
        else if (request.method === SHOW_CLOUDLET_INFO) {
            cloudletInfoList = mcRequest.response.data
        }
    }

    if (cloudletList && cloudletList.length > 0) {
        for (let i = 0; i < cloudletList.length; i++) {
            let cloudlet = cloudletList[i]
            for (let j = 0; j < cloudletInfoList.length; j++) {
                let cloudletInfo = cloudletInfoList[j]
                if (cloudlet[fields.cloudletName] === cloudletInfo[fields.cloudletName] && cloudlet[fields.operatorName] === cloudletInfo[fields.operatorName]) {
                    cloudlet[fields.cloudletStatus] = cloudletInfo[fields.state]
                    break;
                }
            }
        }
    }
    return cloudletList;
}

export const showCloudlets = (data) => {
    let method = SHOW_ORG_CLOUDLET
    if (formatter.isAdmin()) {
        method = SHOW_CLOUDLET;
    }
    else {
        data.org = formatter.getOrganization()
    }
    return { method: method, data: data }
}

export const showOrgCloudlets = (data) => {
    return { method: SHOW_ORG_CLOUDLET, data: data }
}

export const createCloudlet = (self, data, callback) => {
    let requestData = getKey(data, true)
    let request = { uuid: data.uuid ? data.uuid : uuid(), method: CREATE_CLOUDLET, data: requestData }
    return serverData.sendWSRequest(self, request, callback, data)
}

export const updateCloudlet = (self, data, callback) => {
    let requestData = getKey(data, true)
    requestData.cloudlet.fields = ['20']
    let request = { uuid: data.uuid ? data.uuid : uuid(), method: UPDATE_CLOUDLET, data: requestData }
    return serverData.sendWSRequest(self, request, callback, data)
}

export const getCloudletList = async (self, data) => {
    return await serverData.showDataFromServer(self, showCloudlets(data))
}

export const getOrgCloudletList = async (self, data) => {
    return await serverData.showDataFromServer(self, showOrgCloudlets(data))
}

export const deleteCloudlet = (data) => {
    let requestData = getKey(data)
    return { uuid: data.uuid, method: DELETE_CLOUDLET, data: requestData, success: `Cloudlet ${data[fields.cloudletName]}` }
}

export const streamCloudlet = (data) => {
    let requestData = getKey(data)
    return { uuid: data.uuid, method: STREAM_CLOUDLET, data: requestData }
}



export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter:true },
    { field: fields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet Name', sortable: true, visible: true, filter: true },
    { field: fields.operatorName, serverField: 'key#OS#organization', label: 'Operator', sortable: true, visible: true, filter: true },
    { field: fields.cloudletLocation, serverField: 'location', label: 'Cloudlet Location', dataType: constant.TYPE_JSON },
    { field: fields.latitude, serverField: 'location#OS#latitude', label: 'Longitude', detailView: false },
    { field: fields.longitude, serverField: 'location#OS#longitude', label: 'Latitude', detailView: false },
    { field: fields.ipSupport, serverField: 'ip_support', label: 'IP Support' },
    { field: fields.numDynamicIPs, serverField: 'num_dynamic_ips', label: 'Number of Dynamic IPs' },
    { field: fields.physicalName, serverField: 'physical_name', label: '	Physical Name' },
    { field: fields.platformType, serverField: 'platform_type', label: 'Platform Type' },
    { field: fields.openRCData, serverField: 'accessvars#OS#OPENRC_DATA', label: 'Open RC Data' },
    { field: fields.caCertdata, serverField: 'accessvars#OS#CACERT_DATA', label: 'CA Cert Data' },
    { field: fields.cloudletStatus, label: 'Cloudlet Status', visible: true },
    { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true },
    { field: fields.status, serverField: 'status', label: 'Status', dataType: constant.TYPE_JSON },
    { field: fields.containerVersion, serverField: 'container_version', label: 'Container Version' },
    { field: fields.restagmap, serverField: 'res_tag_map', label: 'Resource Mapping', dataType: constant.TYPE_JSON  },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true, roles: ['AdminManager', 'OperatorManager', 'OperatorContributor'] }
])

const customData = (value) => {
    value[fields.cloudletStatus] = 4
    value[fields.ipSupport] = constant.IPSupport(value[fields.ipSupport])
    value[fields.platformType] = constant.PlatformType(value[fields.platformType])
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys(), customData, true)
}