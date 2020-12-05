import * as formatter from './format'
import uuid from 'uuid'
import * as serverData from './serverData'
import * as constant from '../../constant'
import { SHOW_CLOUDLET, SHOW_ORG_CLOUDLET, CREATE_CLOUDLET, UPDATE_CLOUDLET, STREAM_CLOUDLET, DELETE_CLOUDLET, SHOW_CLOUDLET_INFO, GET_CLOUDLET_MANIFEST, SHOW_ORG_CLOUDLET_INFO } from './endPointTypes'
import { FORMAT_FULL_DATE_TIME } from '../../utils/date_util'

const fields = formatter.fields;

export const getCloudletKey = (data) => {
    return { organization: data[fields.operatorName], name: data[fields.cloudletName] }
}

export const getKey = (data, isCreate) => {
    let cloudlet = {}
    cloudlet.key = getCloudletKey(data)
    if (isCreate) {
        cloudlet.location = data[fields.cloudletLocation]
        cloudlet.num_dynamic_ips = parseInt(data[fields.numDynamicIPs])
        cloudlet.physical_name = data[fields.physicalName]
        cloudlet.ip_support = constant.IPSupport(data[fields.ipSupport])
        cloudlet.platform_type = constant.PlatformType(data[fields.platformType])
        cloudlet.infra_api_access = constant.infraApiAccess(data[fields.infraApiAccess])
        let accessvars = {}
        if (data[fields.openRCData]) {
            accessvars.OPENRC_DATA = data[fields.openRCData]
        }
        if (data[fields.caCertdata]) {
            accessvars.CACERT_DATA = data[fields.caCertdata]
        }
        if (data[fields.openRCData] || data[fields.openRCData]) {
            cloudlet.access_vars = accessvars
        }
        if (data[fields.containerVersion]) {
            cloudlet.container_version = data[fields.containerVersion]
        }
        if (data[fields.vmImageVersion]) {
            cloudlet.vm_image_version = data[fields.vmImageVersion]
        }
        if (data[fields.envVars]) {
            cloudlet.env_var = data[fields.envVars]
        }

        if (data[fields.maintenanceState]) {
            cloudlet.maintenance_state = constant.MaintenanceState(data[fields.maintenanceState])
        }

        if (data[fields.fields]) {
            cloudlet.fields = data[fields.fields]
        }
        let infraConfig = undefined
        if (data[fields.infraFlavorName]) {
            infraConfig = infraConfig ? infraConfig : {}
            infraConfig.flavor_name = data[fields.infraFlavorName]
        }
        if (data[fields.infraExternalNetworkName]) {
            infraConfig = infraConfig ? infraConfig : {}
            infraConfig.external_network_name = data[fields.infraExternalNetworkName]
        }
        if(infraConfig)
        {
            cloudlet.infra_config = infraConfig
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
            cloudletList = mcRequest.response.data
        }
        else if (request.method === SHOW_CLOUDLET_INFO || request.method === SHOW_ORG_CLOUDLET_INFO) {
            cloudletInfoList = mcRequest.response.data
        }
    }
    if (cloudletList && cloudletList.length > 0) {
        for (let i = 0; i < cloudletList.length; i++) {
            let cloudlet = cloudletList[i]
            for (let j = 0; j < cloudletInfoList.length; j++) {
                let cloudletInfo = cloudletInfoList[j]
                if (cloudlet[fields.cloudletName] === cloudletInfo[fields.cloudletName] && cloudlet[fields.operatorName] === cloudletInfo[fields.operatorName]) {
                    cloudlet[fields.cloudletStatus] = cloudlet[fields.maintenanceState] && cloudlet[fields.maintenanceState] !== 0 ? 999 : cloudletInfo[fields.state]
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
    return { method: method, data: data, keys : keys()}
}

export const showOrgCloudlets = (data) => {
    return { method: SHOW_ORG_CLOUDLET, data: data }
}

export const createCloudlet = (self, data, callback) => {
    let requestData = getKey(data, true)
    data.uuid = data[fields.cloudletName]
    let request = { uuid: data.uuid, method: CREATE_CLOUDLET, data: requestData }
    return serverData.sendWSRequest(self, request, callback, data)
}

export const updateCloudlet = (self, data, callback) => {
    let requestData = getKey(data, true)
    data.uuid = data.uuid ? data.uuid : uuid()
    let request = { uuid: data.uuid, method: UPDATE_CLOUDLET, data: requestData }
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
    return { uuid: data.uuid, method: DELETE_CLOUDLET, data: requestData, success: `Cloudlet ${data[fields.cloudletName]} deleted successfully` }
}

export const getCloudletManifest = async (self, data, showSpinner) => {
    let requestData = {} 
    requestData.cloudletkey = getCloudletKey(data)
    requestData.region = data[fields.region]
    let mcRequest =  await serverData.sendRequest(self, {method: GET_CLOUDLET_MANIFEST, data: requestData, showSpinner:showSpinner})
    return mcRequest
}

export const streamCloudlet = (data) => {
    let requestData = {region : data[fields.region], cloudletkey : getCloudletKey(data)}
    return { uuid: data.uuid, method: STREAM_CLOUDLET, data: requestData }
}



export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, group:true },
    { field: fields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet Name', sortable: true, visible: true, filter: true },
    { field: fields.operatorName, serverField: 'key#OS#organization', label: 'Operator', sortable: true, visible: true, filter: true, group:true },
    { field: fields.cloudletLocation, serverField: 'location', label: 'Cloudlet Location', dataType: constant.TYPE_JSON },
    { field: fields.latitude, serverField: 'location#OS#latitude', label: 'Longitude', detailView: false },
    { field: fields.longitude, serverField: 'location#OS#longitude', label: 'Latitude', detailView: false },
    { field: fields.ipSupport, serverField: 'ip_support', label: 'IP Support' },
    { field: fields.numDynamicIPs, serverField: 'num_dynamic_ips', label: 'Number of Dynamic IPs' },
    { field: fields.physicalName, serverField: 'physical_name', label: '	Physical Name' },
    { field: fields.platformType, serverField: 'platform_type', label: 'Platform Type' },
    { field: fields.openRCData, serverField: 'access_vars#OS#OPENRC_DATA', label: 'Open RC Data' },
    { field: fields.caCertdata, serverField: 'access_vars#OS#CACERT_DATA', label: 'CA Cert Data' },
    { field: fields.cloudletStatus, label: 'Cloudlet Status', visible: true },
    { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true },
    { field: fields.status, serverField: 'status', label: 'Status', dataType: constant.TYPE_JSON },
    { field: fields.containerVersion, serverField: 'container_version', label: 'Container Version', roles: ['AdminManager', 'OperatorManager', 'OperatorContributor'] },
    { field: fields.vmImageVersion, serverField: 'vm_image_version', label: 'VM Image Version', roles: ['AdminManager', 'OperatorManager', 'OperatorContributor'] },
    { field: fields.restagmap, serverField: 'res_tag_map', label: 'Resource Mapping', dataType: constant.TYPE_JSON },
    { field: fields.envVars, serverField: 'env_var', label: 'Environment Variables', dataType: constant.TYPE_JSON },
    { field: fields.infraApiAccess, serverField: 'infra_api_access', label: 'Infra API Access'},
    { field: fields.infraFlavorName, serverField: 'infra_config#OS#flavor_name', label: 'Infra Flavor Name'},
    { field: fields.infraExternalNetworkName, serverField: 'infra_config#OS#external_network_name', label: 'Infra External Network Name'},
    { field: fields.maintenanceState, serverField: 'maintenance_state', label: 'Maintenance State', detailView : false},
    { field: fields.errors, serverField: 'errors', label: 'Errors', dataType: constant.TYPE_YAML},
    { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: constant.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.updatedAt, serverField: 'updated_at', label: 'Created', dataType: constant.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true, roles: ['AdminManager', 'OperatorManager', 'OperatorContributor'] }
])

const customData = (value) => {
    value[fields.cloudletStatus] = value[fields.maintenanceState] && value[fields.maintenanceState] !== 0 ? 999 : 4
    value[fields.ipSupport] = constant.IPSupport(value[fields.ipSupport])
    value[fields.platformType] = constant.PlatformType(value[fields.platformType])
    value[fields.infraApiAccess] = constant.infraApiAccess(value[fields.infraApiAccess])
    value[fields.createdAt] = value[fields.createdAt] ? value[fields.createdAt][fields.seconds] : undefined
    value[fields.updatedAt] = value[fields.updatedAt] ? value[fields.updatedAt][fields.seconds] : undefined
    return value
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys(), customData, true)
}