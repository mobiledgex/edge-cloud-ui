import * as formatter from '../../fields'
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import * as constant from '../../../constant'
import { FORMAT_FULL_DATE_TIME } from '../../../utils/date_util'
import { idFormatter, serverFields } from '../../../helper/formatter'
import { redux_org } from '../../../helper/reduxData'
import { perpetual } from '../../../helper/constant'
import { endpoint } from '../..';
import { customize } from '../../modules/cloudlet'
import { generateUUID } from '../../format/shared'
import { cloudletKeys } from './primary';
import { websocket } from '../..';

const localFields = formatter.localFields;

export const keys = () => ([
    { field: localFields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: localFields.operatorName, serverField: 'key#OS#organization', label: 'Operator', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: localFields.partnerOperator, serverField: 'key#OS#federated_organization', label: 'Partner Operator' },
    { field: localFields.cloudletName, serverField: 'key#OS#name', label: 'Cloudlet', sortable: true, visible: true, filter: true, key: true },
    { field: localFields.cloudletLocation, serverField: 'location', label: 'Cloudlet Location', dataType: perpetual.TYPE_JSON },
    { field: localFields.latitude, serverField: 'location#OS#latitude', label: 'Longitude', detailView: false },
    { field: localFields.longitude, serverField: 'location#OS#longitude', label: 'Latitude', detailView: false },
    { field: localFields.ipSupport, serverField: 'ip_support', label: 'IP Support' },
    { field: localFields.numDynamicIPs, serverField: 'num_dynamic_ips', label: 'Number of Dynamic IPs' },
    { field: localFields.physicalName, serverField: 'physical_name', label: '	Physical Name' },
    { field: localFields.platformType, serverField: 'platform_type', label: 'Platform Type' },
    { field: localFields.vmPool, serverField: 'vm_pool', label: 'VM Pool' },
    { field: localFields.openRCData, serverField: 'access_vars#OS#OPENRC_DATA', label: 'Open RC Data' },
    { field: localFields.caCertdata, serverField: 'access_vars#OS#CACERT_DATA', label: 'CA Cert Data' },
    { field: localFields.cloudletStatus, label: 'Cloudlet Status', visible: true, format: true },
    { field: localFields.state, serverField: 'state', label: 'Progress', visible: true, clickable: true, format: true },
    { field: localFields.status, serverField: 'status', label: 'Status', dataType: perpetual.TYPE_JSON, detailView: false },
    { field: localFields.containerVersion, serverField: 'container_version', label: 'Container Version', roles: constant.operatorRoles },
    { field: localFields.vmImageVersion, serverField: 'vm_image_version', label: 'VM Image Version', roles: constant.operatorRoles },
    { field: localFields.restagmap, serverField: 'res_tag_map', label: 'Resource Mapping', dataType: perpetual.TYPE_JSON },
    { field: localFields.gpuDriverName, serverField: 'gpu_config#OS#driver#OS#name', label: 'GPU Driver' },
    { field: localFields.gpuORG, serverField: 'gpu_config#OS#driver#OS#organization', label: 'GPU Organization' },
    { field: localFields.envVars, serverField: 'env_var', label: 'Environment Variables', dataType: perpetual.TYPE_JSON },
    { field: localFields.resourceQuotas, serverField: 'resource_quotas', label: 'Resource Quotas', dataType: perpetual.TYPE_JSON },
    { field: localFields.defaultResourceAlertThreshold, serverField: 'default_resource_alert_threshold', label: 'Default Resource Alert Threshold' },
    { field: localFields.infraApiAccess, serverField: 'infra_api_access', label: 'Infra API Access' },
    { field: localFields.infraFlavorName, serverField: 'infra_config#OS#flavor_name', label: 'Infra Flavor Name' },
    { field: localFields.infraExternalNetworkName, serverField: 'infra_config#OS#external_network_name', label: 'Infra External Network Name' },
    { field: localFields.maintenanceState, serverField: 'maintenance_state', label: 'Maintenance State', detailView: false },
    { field: localFields.trustPolicyName, serverField: 'trust_policy', label: 'Trust Policy' },
    { field: localFields.kafkaCluster, serverField: 'kafka_cluster', label: 'Kafka Cluster' },
    { field: localFields.errors, serverField: 'errors', label: 'Errors', dataType: perpetual.TYPE_YAML },
    { field: localFields.createdAt, serverField: 'created_at', label: 'Created', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } },
    { field: localFields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } },
    { field: localFields.trusted, label: 'Trusted', icon: 'trusted.svg', detailView: false },
    { field: localFields.gpuExist, label: 'GPU', detailView: false },
    { field: localFields.allianceOrganization, label: 'Alliance Organization', serverField: 'alliance_orgs', dataType: perpetual.TYPE_STRING },
    { field: localFields.platformHighAvailability, serverField: 'platform_high_availability', label: 'Platform High Availability', format:true },
    { field: localFields.deployment, serverField: 'deployment', label: 'Deployment Type' }
])

export const iconKeys = () => ([
    { field: localFields.gpuExist, label: 'GPU', icon: 'gpu_green.svg', clicked: false, count: 0 },
    { field: localFields.trusted, label: 'Trusted', icon: 'trusted.svg', clicked: false, count: 0 },
    { field: localFields.partnerOperator, label: 'Federation', icon: 'star_rate_outlined', clicked: false, count: 0 }
])

export const getRequestData = (data) => {
    let cloudlet = {}
    cloudlet.key = cloudletKeys(data)

    if (data[localFields.allianceOrganization]) {
        cloudlet.organization = data[localFields.allianceOrganization]
    }
    return ({
        region: data[localFields.region],
        cloudletallianceorg: cloudlet
    })
}

export const getKey = (data, isCreate) => {
    let cloudlet = {}
    cloudlet.key = cloudletKeys(data)
    if (isCreate) {
        if (data[localFields.cloudletLocation]) {
            cloudlet.location = data[localFields.cloudletLocation]
        }
        if (data[localFields.numDynamicIPs]) {
            cloudlet.num_dynamic_ips = parseInt(data[localFields.numDynamicIPs])
        }
        if (data[localFields.physicalName]) {
            cloudlet.physical_name = data[localFields.physicalName]
        }
        if (data[localFields.ipSupport]) {
            cloudlet.ip_support = idFormatter.ipSupport(data[localFields.ipSupport])
        }
        if (data[localFields.platformType]) {
            cloudlet.platform_type = idFormatter.platformType(data[localFields.platformType])
        }
        if (data[localFields.vmPool]) {
            cloudlet.vm_pool = data[localFields.vmPool]
        }
        if (data[localFields.infraApiAccess]) {
            cloudlet.infra_api_access = idFormatter.infraApiAccess(data[localFields.infraApiAccess])
        }
        let accessvars = {}
        if (data[localFields.openRCData] || data[localFields.caCertdata]) {
            accessvars.OPENRC_DATA = data[localFields.openRCData] ? data[localFields.openRCData] : undefined
            accessvars.CACERT_DATA = data[localFields.caCertdata] ? data[localFields.caCertdata] : undefined
            cloudlet.access_vars = accessvars
        }
        if (data[localFields.containerVersion]) {
            cloudlet.container_version = data[localFields.containerVersion]
        }
        if (data[localFields.vmImageVersion]) {
            cloudlet.vm_image_version = data[localFields.vmImageVersion]
        }
        if (data[localFields.envVars]) {
            cloudlet.env_var = data[localFields.envVars]
        }
        if (data[localFields.resourceQuotas]) {
            cloudlet.resource_quotas = data[localFields.resourceQuotas]
        }
        if (data[localFields.trustPolicyName]) {
            cloudlet.trust_policy = data[localFields.trustPolicyName]
        }

        if (data[localFields.maintenanceState]) {
            cloudlet.maintenance_state = idFormatter.maintainance(data[localFields.maintenanceState])
        }

        if (data[localFields.kafkaCluster]) {
            cloudlet.kafka_cluster = data[localFields.kafkaCluster]
        }

        if (data[localFields.kafkaUser]) {
            cloudlet.kafka_user = data[localFields.kafkaUser]
        }

        if (data[localFields.kafkaPassword]) {
            cloudlet.kafka_password = data[localFields.kafkaPassword]
        }
        cloudlet.platform_high_availability = data[localFields.platformHighAvailability]
        if (data[localFields.gpuConfig]) {
            cloudlet.gpu_config = {
                driver: {
                    organization: data[localFields.gpuORG] === perpetual.MOBILEDGEX ? '' : data[localFields.gpuORG],
                    name: data[localFields.gpuDriverName]
                }
            }
        }

        if (data[localFields.fields]) {
            cloudlet.fields = data[localFields.fields]
        }
        let infraConfig = undefined
        if (data[localFields.infraFlavorName]) {
            infraConfig = infraConfig ? infraConfig : {}
            infraConfig.flavor_name = data[localFields.infraFlavorName]
        }
        if (data[localFields.infraExternalNetworkName]) {
            infraConfig = infraConfig ? infraConfig : {}
            infraConfig.external_network_name = data[localFields.infraExternalNetworkName]
        }
        if (infraConfig) {
            cloudlet.infra_config = infraConfig
        }
        if (data[localFields.allianceOrganization]) {
            cloudlet.alliance_orgs = data[localFields.allianceOrganization]
        }
        if (data[localFields.singleK8sClusterOwner]) {
            cloudlet.single_kubernetes_cluster_owner = data[localFields.singleK8sClusterOwner]
        }
        if (data[localFields.deployment]) {
            cloudlet.deployment = data[localFields.deployment]
        }

    }
    return ({
        region: data[localFields.region],
        cloudlet: cloudlet
    })
}

export const fetchCloudletField = (cloudletList, data, field) => {
    const { cloudletName, operatorName } = data
    if (cloudletName && operatorName) {
        let selection = undefined
        for (const cloudlet of cloudletList) {
            if (cloudlet[localFields.cloudletName] === cloudletName && cloudlet[localFields.operatorName] === operatorName) {
                selection = cloudlet
                break;
            }
        }
        if (selection) {
            return Array.isArray(field) ? field.map(item => selection[item]) : selection[field]
        }
    }
}

export const cloudletWithInfo = (mcList, pageId) => {
    let cloudletInfoList = []
    let cloudletList = []
    if (mcList && mcList.length > 0) {
        mcList.map(mc => {
            let request = mc.request
            if (request.method === endpoint.SHOW_ORG_CLOUDLET || request.method === endpoint.SHOW_CLOUDLETS_FOR_APP) {
                cloudletList = mc.response.data
            }
            else if (request.method === endpoint.SHOW_ORG_CLOUDLET_INFO) {
                cloudletInfoList = mc.response.data
            }
        })

        if (cloudletList && cloudletList.length > 0) {
            cloudletList = cloudletList.filter(cloudlet => {
                let valid = false
                if (pageId === perpetual.PAGE_CLUSTER_INSTANCES && cloudlet.platformType === perpetual.PLATFORM_TYPE_K8S_BARE_METAL || cloudlet[localFields.maintenanceState] > 0) {
                    return valid
                }
                else {
                    for (let j = 0; j < cloudletInfoList.length; j++) {
                        let cloudletInfo = cloudletInfoList[j]
                        if (cloudlet[localFields.cloudletName] === cloudletInfo[localFields.cloudletName] && cloudlet[localFields.operatorName] === cloudletInfo[localFields.operatorName]) {
                            cloudlet[localFields.compatibilityVersion] = cloudletInfo[localFields.compatibilityVersion] ? cloudletInfo[localFields.compatibilityVersion] : perpetual.CLOUDLET_COMPAT_VERSION_2_4
                            valid = cloudletInfo[localFields.state] === serverFields.READY
                            break;
                        }
                    }
                    return valid
                }
            })
        }
    }
    return cloudletList
}

export const multiDataRequest = (keys, mcList, specific) => {
    if (specific) {
        let newList = mcList.new
        let oldData = mcList.old
        if (newList && newList.length > 0) {
            let cloudlet = {};
            let cloudletInfo = {};
            for (let i = 0; i < newList.length; i++) {
                let mc = newList[i];
                let request = mc.request;
                if (request.method === endpoint.SHOW_CLOUDLET || request.method === endpoint.SHOW_ORG_CLOUDLET) {
                    let dataList = mc.response.data
                    if (dataList && dataList.length > 0) {
                        cloudlet = dataList[0]
                    }
                    else {
                        return null
                    }
                }
                else if (request.method === endpoint.SHOW_CLOUDLET_INFO || request.method === endpoint.SHOW_ORG_CLOUDLET_INFO) {
                    let dataList = mc.response.data
                    if (dataList && dataList.length > 0) {
                        cloudletInfo = dataList[0]
                    }
                }
            }
            cloudlet = customize(undefined, cloudlet)
            cloudlet[localFields.uuid] = oldData[localFields.uuid]
            cloudlet[localFields.cloudletStatus] = cloudlet[localFields.maintenanceState] && cloudlet[localFields.maintenanceState] !== 0 ? perpetual.STATUS_UNDER_MAINTAINANCE : cloudletInfo[localFields.state]
            return cloudlet
        }
        return null
    }
    else {
        let cloudletList = [];
        let cloudletInfoList = [];
        for (let i = 0; i < mcList.length; i++) {
            let mc = mcList[i];
            let request = mc.request;
            if (request.method === endpoint.SHOW_CLOUDLET || request.method === endpoint.SHOW_ORG_CLOUDLET) {
                cloudletList = mc.response.data
            }
            else if (request.method === endpoint.SHOW_CLOUDLET_INFO || request.method === endpoint.SHOW_ORG_CLOUDLET_INFO) {
                cloudletInfoList = mc.response.data
            }
        }
        if (cloudletList && cloudletList.length > 0) {
            for (let i = 0; i < cloudletList.length; i++) {
                let cloudlet = cloudletList[i]
                for (let j = 0; j < cloudletInfoList.length; j++) {
                    let cloudletInfo = cloudletInfoList[j]
                    if (cloudlet[localFields.cloudletName] === cloudletInfo[localFields.cloudletName] && cloudlet[localFields.operatorName] === cloudletInfo[localFields.operatorName]) {
                        cloudlet[localFields.cloudletStatus] = cloudlet[localFields.maintenanceState] && cloudlet[localFields.maintenanceState] !== 0 ? perpetual.STATUS_UNDER_MAINTAINANCE : cloudletInfo[localFields.state]
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
    return { method, data: requestData, keys: keys(), iconKeys: iconKeys() }
}

export const fetchCloudletData = async (self, data) => {
    return await showAuthSyncRequest(self, showCloudlets(self, data))
}

export const createCloudlet = (self, data, callback) => {
    let requestData = getKey(data, true)
    data.uuid = data[localFields.cloudletName]
    let request = { uuid: data.uuid, method: endpoint.CREATE_CLOUDLET, data: requestData }
    return websocket.request(self, request, callback, data)
}

export const updateCloudlet = (self, data, callback) => {
    let requestData = getKey(data, true)
    data.uuid = data.uuid ? data.uuid : generateUUID(keys(), data)
    let request = { uuid: data.uuid, method: endpoint.UPDATE_CLOUDLET, data: requestData }
    return websocket.request(self, request, callback, data)
}

export const deleteCloudlet = (self, data) => {
    let requestData = getKey(data)
    return { uuid: data.uuid, method: endpoint.DELETE_CLOUDLET, data: requestData, success: `Cloudlet ${data[localFields.cloudletName]} deleted successfully` }
}

export const getCloudletManifest = async (self, data, showSpinner) => {
    let requestData = {}
    requestData.cloudletkey = cloudletKeys(data)
    requestData.region = data[localFields.region]
    let mc = await authSyncRequest(self, { method: endpoint.GET_CLOUDLET_MANIFEST, data: requestData, showSpinner: showSpinner })
    return mc
}

export const revokeAccessKey = async (self, data, showSpinner) => {
    let requestData = {}
    requestData.cloudletkey = cloudletKeys(data)
    requestData.region = data[localFields.region]
    let mc = await authSyncRequest(self, { method: endpoint.REVOKE_ACCESS_KEY, data: requestData, showSpinner: showSpinner })
    return mc
}

export const streamCloudlet = (data) => {
    let requestData = { region: data[localFields.region], cloudletkey: cloudletKeys(data) }
    return { uuid: data.uuid, method: endpoint.STREAM_CLOUDLET, data: requestData }
}

export const cloudletResourceQuota = (self, data) => {
    let cloudletresourcequotaprops = { platform_type: idFormatter.platformType(data[localFields.platformType]) }
    if (redux_org.nonAdminOrg(self)) {
        cloudletresourcequotaprops['organization'] = redux_org.nonAdminOrg(self)
    }
    let requestData = {
        cloudletresourcequotaprops,
        region: data[localFields.region]
    }
    return { method: endpoint.GET_CLOUDLET_RESOURCE_QUOTA_PROPS, data: requestData }
}

export const cloudletProps = (self, data) => {
    let cloudletProps = { platform_type: idFormatter.platformType(data[localFields.platformType]) }
    if (redux_org.nonAdminOrg(self)) {
        cloudletProps['organization'] = redux_org.nonAdminOrg(self)
    }
    let requestData = {
        cloudletProps,
        region: data[localFields.region]
    }
    return { method: endpoint.GET_CLOUDLET_PROPS, data: requestData }
}

export const fetchShowNode = async (self, data) => {
    let requestData = {
        node: {
            key: {
                cloudlet_key: cloudletKeys(data),
                region: data[localFields.region]
            }
        }
    }

    return await authSyncRequest(self, { method: endpoint.SHOW_NODE, data: requestData })
}

export const addClouldletAllianceOrgs = (data) => {
    return { method: endpoint.ADD_CLOUDLET_ALLIANCE_ORG, data: getRequestData(data), success: 'Alliance Organizations Added Successfully' }
}

export const removeClouldletAllianceOrgs = (data) => {
    return { method: endpoint.REMOVE_CLOUDLET_ALLIANCE_ORG, data: getRequestData(data), success: 'Alliance Organization Removed Successfully' }
}
