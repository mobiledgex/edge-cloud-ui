import * as formatter from './format'
import * as serverData from './serverData'
import { authSyncRequest, showAuthSyncRequest } from '../service';
import * as constant from '../../constant'
import { FORMAT_FULL_DATE_TIME } from '../../utils/date_util'
import { idFormatter } from '../../helper/formatter'
import { redux_org } from '../../helper/reduxData'
import { endpoint, perpetual } from '../../helper/constant'
import { customize } from '../modules/cloudlet'
import { generateUUID } from '../format/shared'

const fields = formatter.fields;

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: fields.operatorName, serverField: 'key#OS#organization', label: 'Operator', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: fields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet', sortable: true, visible: true, filter: true, key: true },
    { field: fields.cloudletLocation, serverField: 'location', label: 'Cloudlet Location', dataType: perpetual.TYPE_JSON },
    { field: fields.latitude, serverField: 'location#OS#latitude', label: 'Longitude', detailView: false },
    { field: fields.longitude, serverField: 'location#OS#longitude', label: 'Latitude', detailView: false },
    { field: fields.ipSupport, serverField: 'ip_support', label: 'IP Support' },
    { field: fields.numDynamicIPs, serverField: 'num_dynamic_ips', label: 'Number of Dynamic IPs' },
    { field: fields.physicalName, serverField: 'physical_name', label: '	Physical Name' },
    { field: fields.platformType, serverField: 'platform_type', label: 'Platform Type' },
    { field: fields.vmPool, serverField: 'vm_pool', label: 'VM Pool' },
    { field: fields.openRCData, serverField: 'access_vars#OS#OPENRC_DATA', label: 'Open RC Data' },
    { field: fields.caCertdata, serverField: 'access_vars#OS#CACERT_DATA', label: 'CA Cert Data' },
    { field: fields.cloudletStatus, label: 'Cloudlet Status', visible: true, format: true },
    { field: fields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true, format: true },
    { field: fields.status, serverField: 'status', label: 'Status', dataType: perpetual.TYPE_JSON, detailView: false },
    { field: fields.containerVersion, serverField: 'container_version', label: 'Container Version', roles: constant.operatorRoles },
    { field: fields.vmImageVersion, serverField: 'vm_image_version', label: 'VM Image Version', roles: constant.operatorRoles },
    { field: fields.restagmap, serverField: 'res_tag_map', label: 'Resource Mapping', dataType: perpetual.TYPE_JSON },
    { field: fields.envVars, serverField: 'env_var', label: 'Environment Variables', dataType: perpetual.TYPE_JSON },
    { field: fields.resourceQuotas, serverField: 'resource_quotas', label: 'Resource Quotas', dataType: perpetual.TYPE_JSON },
    { field: fields.defaultResourceAlertThreshold, serverField: 'default_resource_alert_threshold', label: 'Default Resource Alert Threshold' },
    { field: fields.infraApiAccess, serverField: 'infra_api_access', label: 'Infra API Access' },
    { field: fields.infraFlavorName, serverField: 'infra_config#OS#flavor_name', label: 'Infra Flavor Name' },
    { field: fields.infraExternalNetworkName, serverField: 'infra_config#OS#external_network_name', label: 'Infra External Network Name' },
    { field: fields.maintenanceState, serverField: 'maintenance_state', label: 'Maintenance State', detailView: false },
    { field: fields.trustPolicyName, serverField: 'trust_policy', label: 'Trust Policy' },
    { field: fields.kafkaCluster, serverField: 'kafka_cluster', label: 'Kafka Cluster' },
    { field: fields.errors, serverField: 'errors', label: 'Errors', dataType: perpetual.TYPE_YAML },
    { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.trusted, label: 'Trusted', visible: true, format: true },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true, roles: perpetual.operatorRoles }
])

export const getCloudletKey = (data) => {
    return { organization: data[fields.operatorName], name: data[fields.cloudletName] }
}

export const getKey = (data, isCreate) => {
    let cloudlet = {}
    cloudlet.key = getCloudletKey(data)
    if (isCreate) {
        if (data[fields.cloudletLocation]) {
            cloudlet.location = data[fields.cloudletLocation]
        }
        if (data[fields.numDynamicIPs]) {
            cloudlet.num_dynamic_ips = parseInt(data[fields.numDynamicIPs])
        }
        if (data[fields.physicalName]) {
            cloudlet.physical_name = data[fields.physicalName]
        }
        if (data[fields.ipSupport]) {
            cloudlet.ip_support = idFormatter.ipSupport(data[fields.ipSupport])
        }
        if (data[fields.platformType]) {
            cloudlet.platform_type = idFormatter.platformType(data[fields.platformType])
        }
        if (data[fields.vmPool]) {
            cloudlet.vm_pool = data[fields.vmPool]
        }
        if (data[fields.infraApiAccess]) {
            cloudlet.infra_api_access = idFormatter.infraApiAccess(data[fields.infraApiAccess])
        }
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
        if (data[fields.resourceQuotas]) {
            cloudlet.resource_quotas = data[fields.resourceQuotas]
        }
        if (data[fields.trustPolicyName]) {
            cloudlet.trust_policy = data[fields.trustPolicyName]
        }

        if (data[fields.maintenanceState]) {
            cloudlet.maintenance_state = idFormatter.maintainance(data[fields.maintenanceState])
        }

        if (data[fields.kafkaCluster]) {
            cloudlet.kafka_cluster = data[fields.kafkaCluster]
        }

        if (data[fields.kafkaUser]) {
            cloudlet.kafka_user = data[fields.kafkaUser]
        }

        if (data[fields.kafkaPassword]) {
            cloudlet.kafka_password = data[fields.kafkaPassword]
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
        if (infraConfig) {
            cloudlet.infra_config = infraConfig
        }

    }
    return ({
        region: data[fields.region],
        cloudlet: cloudlet
    })
}

export const cloudletWithInfo = (mcList) => {
    let cloudletInfoList = []
    let cloudletList = []
    if (mcList && mcList.length > 0) {
        mcList.map(mc => {
            let request = mc.request
            if (request.method === endpoint.SHOW_ORG_CLOUDLET) {
                cloudletList = mc.response.data
            }
            else if (request.method === endpoint.SHOW_ORG_CLOUDLET_INFO) {
                cloudletInfoList = mc.response.data
            }
        })

        if (cloudletList && cloudletList.length > 0) {
            cloudletList = cloudletList.filter(cloudlet => {
                let valid = false
                for (let j = 0; j < cloudletInfoList.length; j++) {
                    let cloudletInfo = cloudletInfoList[j]
                    if (cloudlet[fields.cloudletName] === cloudletInfo[fields.cloudletName] && cloudlet[fields.operatorName] === cloudletInfo[fields.operatorName]) {
                        cloudlet[fields.compatibilityVersion] = cloudletInfo[fields.compatibilityVersion] ? cloudletInfo[fields.compatibilityVersion] : perpetual.CLOUDLET_COMPAT_VERSION_2_4
                        valid = cloudletInfo[fields.state] === 2 && (cloudlet[fields.maintenanceState] === undefined || cloudlet[fields.maintenanceState] === 0)
                        break;
                    }
                }
                return valid
            })
        }
    }
    return cloudletList
}

export const multiDataRequest = (keys, mcRequestList, specific) => {
    if (specific) {
        let newList = mcRequestList.new
        let oldData = mcRequestList.old
        if (newList && newList.length > 0) {
            let cloudlet = {};
            let cloudletInfo = {};
            for (let i = 0; i < newList.length; i++) {
                let mcRequest = newList[i];
                let request = mcRequest.request;
                if (request.method === endpoint.SHOW_CLOUDLET || request.method === endpoint.SHOW_ORG_CLOUDLET) {
                    let dataList = mcRequest.response.data
                    if (dataList && dataList.length > 0) {
                        cloudlet = dataList[0]
                    }
                    else {
                        return null
                    }
                }
                else if (request.method === endpoint.SHOW_CLOUDLET_INFO || request.method === endpoint.SHOW_ORG_CLOUDLET_INFO) {
                    let dataList = mcRequest.response.data
                    if (dataList && dataList.length > 0) {
                        cloudletInfo = dataList[0]
                    }
                }
            }
            cloudlet = customize(undefined, cloudlet)
            cloudlet[fields.uuid] = oldData[fields.uuid]
            cloudlet[fields.cloudletStatus] = cloudlet[fields.maintenanceState] && cloudlet[fields.maintenanceState] !== 0 ? 999 : cloudletInfo[fields.state]
            return cloudlet
        }
        return null
    }
    else {
        let cloudletList = [];
        let cloudletInfoList = [];
        for (let i = 0; i < mcRequestList.length; i++) {
            let mcRequest = mcRequestList[i];
            let request = mcRequest.request;
            if (request.method === endpoint.SHOW_CLOUDLET || request.method === endpoint.SHOW_ORG_CLOUDLET) {
                cloudletList = mcRequest.response.data
            }
            else if (request.method === endpoint.SHOW_CLOUDLET_INFO || request.method === endpoint.SHOW_ORG_CLOUDLET_INFO) {
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
}

export const showCloudlets = (self, data, specific) => {
    let requestData = {}
    let developer = redux_org.isDeveloper(self) || data.type === perpetual.DEVELOPER
    let method = developer ? endpoint.SHOW_ORG_CLOUDLET : endpoint.SHOW_CLOUDLET
    if (specific) {
        let cloudlet = { key: data.cloudletkey ? data.cloudletkey : data.cloudlet.key }
        requestData = {
            uuid: data.uuid,
            region: data.region,
            cloudlet
        }
    }
    else {
        requestData.region = data.region
        let organization = data.org ? data.org : redux_org.nonAdminOrg(self)
        if (organization) {
            if (developer) {
                requestData.org = organization
            }
            else if (redux_org.isOperator(self) || data.type === perpetual.OPERATOR) {
                requestData.cloudlet = { key: { organization } }
            }
        }
    }
    return { method, data: requestData, keys: keys() }
}

export const fetchCloudletData = async (self, data) => {
    return await showAuthSyncRequest(self, showCloudlets(self, data))
}

export const createCloudlet = (self, data, callback) => {
    let requestData = getKey(data, true)
    data.uuid = data[fields.cloudletName]
    let request = { uuid: data.uuid, method: endpoint.CREATE_CLOUDLET, data: requestData }
    return serverData.sendWSRequest(self, request, callback, data)
}

export const updateCloudlet = (self, data, callback) => {
    let requestData = getKey(data, true)
    data.uuid = data.uuid ? data.uuid : generateUUID(keys(), data)
    let request = { uuid: data.uuid, method: endpoint.UPDATE_CLOUDLET, data: requestData }
    return serverData.sendWSRequest(self, request, callback, data)
}

export const deleteCloudlet = (self, data) => {
    let requestData = getKey(data)
    return { uuid: data.uuid, method: endpoint.DELETE_CLOUDLET, data: requestData, success: `Cloudlet ${data[fields.cloudletName]} deleted successfully` }
}

export const getCloudletManifest = async (self, data, showSpinner) => {
    let requestData = {}
    requestData.cloudletkey = getCloudletKey(data)
    requestData.region = data[fields.region]
    let mc = await authSyncRequest(self, { method: endpoint.GET_CLOUDLET_MANIFEST, data: requestData, showSpinner: showSpinner })
    return mc
}

export const revokeAccessKey = async (self, data, showSpinner) => {
    let requestData = {}
    requestData.cloudletkey = getCloudletKey(data)
    requestData.region = data[fields.region]
    let mc = await authSyncRequest(self, { method: endpoint.REVOKE_ACCESS_KEY, data: requestData, showSpinner: showSpinner })
    return mc
}

export const streamCloudlet = (data) => {
    let requestData = { region: data[fields.region], cloudletkey: getCloudletKey(data) }
    return { uuid: data.uuid, method: endpoint.STREAM_CLOUDLET, data: requestData }
}

export const cloudletResourceQuota = (self, data) => {
    let cloudletresourcequotaprops = { platform_type: idFormatter.platformType(data[fields.platformType]) }
    if (redux_org.nonAdminOrg(self)) {
        cloudletresourcequotaprops['organization'] = redux_org.nonAdminOrg(self)
    }
    let requestData = {
        cloudletresourcequotaprops,
        region: data[fields.region]
    }
    return { method: endpoint.GET_CLOUDLET_RESOURCE_QUOTA_PROPS, data: requestData }
}