import { FORMAT_FULL_DATE_TIME } from '../../../utils/date_util';
import { idFormatter } from '../../../helper/formatter';
import { redux_org } from '../../../helper/reduxData'
import { perpetual } from '../../../helper/constant';
import { endpoint } from '../..';
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { localFields } from '../../fields';

export const configs = () => ([
    { field: localFields.kind, serverField: 'kind', label: 'Kind' },
    { field: localFields.config, serverField: 'config', label: 'Config', dataType: perpetual.TYPE_YAML }
])

export const keys = () => ([
    { field: localFields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: localFields.organizationName, serverField: 'key#OS#organization', sortable: true, label: 'Organization', visible: true, filter: true, group: true, key: true },
    { field: localFields.appName, serverField: 'key#OS#name', label: 'App', visible: false, filter: true, key: true, group: true },
    { field: localFields.app_name_version, label: 'App [Version]', visible: true, sortable: true, detailView: false },
    { field: localFields.version, serverField: 'key#OS#version', label: 'Version', visible: false, filter: true, key: true },
    { field: localFields.deployment, serverField: 'deployment', label: 'Deployment', sortable: true, visible: true, filter: true, group: true },
    { field: localFields.vmappostype, serverField: 'vm_app_os_type', label: 'VM App OS Type' },
    { field: localFields.command, serverField: 'command', label: 'Command' },
    { field: localFields.deploymentManifest, serverField: 'deployment_manifest', label: 'Deployment Manifest', dataType: perpetual.TYPE_YAML },
    { field: localFields.deploymentGenerator, serverField: 'deployment_generator', label: 'Deployment Generator' },
    { field: localFields.imageType, serverField: 'image_type', label: 'Image Type' },
    { field: localFields.imagePath, serverField: 'image_path', label: 'Image Path' },
    { field: localFields.flavorName, serverField: 'default_flavor#OS#name', sortable: true, label: 'Default Flavor' },
    { field: localFields.accessPorts, serverField: 'access_ports', label: 'Ports' },
    { field: localFields.skipHCPorts, serverField: 'skip_hc_ports', label: 'Skip Health Check' },
    { field: localFields.accessType, serverField: 'access_type', label: 'Access Type' },
    { field: localFields.authPublicKey, serverField: 'auth_public_key', label: 'Auth Public Key' },
    { field: localFields.scaleWithCluster, serverField: 'scale_with_cluster', label: 'Scale With Cluster', format: true },
    { field: localFields.officialFQDN, serverField: 'official_fqdn', label: 'Official FQDN' },
    { field: localFields.androidPackageName, serverField: 'android_package_name', label: 'Android Package Name' },
    { field: localFields.autoProvPolicies, serverField: 'auto_prov_policies', label: 'Auto Provisioning Policies', dataType: perpetual.TYPE_ARRAY },
    { field: localFields.alertPolicies, serverField: 'alert_policies', label: 'Alert Policies', dataType: perpetual.TYPE_ARRAY },
    { field: localFields.autoPolicyName, serverField: 'auto_prov_policy', label: 'Auto Provisioning Policy' },
    { field: localFields.qosSessionProfile, serverField: 'qos_session_profile', label: 'QOS Network Prioritization' },
    { field: localFields.qosSessionDuration, serverField: 'qos_session_duration', label: 'QOS Session Duration', format: true },
    { field: localFields.trusted, serverField: 'trusted', label: 'Trusted', visible: false, sortable: true, format: true },
    { field: localFields.allowServerless, serverField: 'allow_serverless', label: 'Allow Serverless', format: true },
    { field: localFields.configs, serverField: 'configs', label: 'Configs', keys: configs() },
    { field: localFields.accessServerlessConfig, serverField: 'serverless_config', label: 'Serverless Config', dataType: perpetual.TYPE_JSON },
    { field: localFields.annotations, serverField: 'annotations', label: 'Annotations', visible: false },
    { field: localFields.requiredOutboundConnections, serverField: 'required_outbound_connections', label: 'Required Outbound Connections', visible: false, dataType: perpetual.TYPE_JSON },
    { field: localFields.templateDelimiter, serverField: 'template_delimiter', label: 'Template Delimiter' },
    { field: localFields.revision, serverField: 'revision', label: 'Revision' },
    { field: localFields.createdAt, serverField: 'created_at', label: 'Created', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } },
    { field: localFields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } }
])

export const getAppKey = (data) => {
    return {
        organization: data[localFields.organizationName],
        name: data[localFields.appName],
        version: data[localFields.version]
    }
}

export const getKey = (data, isCreate) => {

    let app = {}

    app.key = getAppKey(data)

    if (isCreate) {
        app.scale_with_cluster = data[localFields.scaleWithCluster]
        app.trusted = data[localFields.trusted]
        app.deployment = data[localFields.deployment]
        app.image_type = idFormatter.imageType(data[localFields.imageType])
        if (data[localFields.imagePath]) {
            app.image_path = data[localFields.imagePath]
        }
        if (data[localFields.accessPorts]) {
            app.access_ports = data[localFields.accessPorts].toLowerCase()
        }
        if (data[localFields.skipHCPorts]) {
            app.skip_hc_ports = data[localFields.skipHCPorts].toLowerCase()
        }
        if (data[localFields.annotations]) {
            app.annotations = data[localFields.annotations]
        }
        if (data[localFields.requiredOutboundConnections]) {
            app.required_outbound_connections = data[localFields.requiredOutboundConnections]
        }

        app.default_flavor = data[localFields.flavorName] ? { name: data[localFields.flavorName] } : undefined
        app.auth_public_key = data[localFields.authPublicKey]
        app.allow_serverless = data[localFields.allowServerless]

        if (data[localFields.allowServerless] || data[localFields.serverlessRam] || data[localFields.serverlessVcpu] || data[localFields.serverlessMinReplicas]) {
            app.serverless_config = {
                vcpus: data[localFields.serverlessVcpu] ? parseFloat(data[localFields.serverlessVcpu]).toFixed(3) : undefined,
                ram: data[localFields.serverlessRam] ? parseInt(data[localFields.serverlessRam]) : undefined,
                min_replicas: data[localFields.serverlessMinReplicas] ? parseInt(data[localFields.serverlessMinReplicas]) : undefined
            }
        }

        if (data[localFields.officialFQDN]) {
            app.official_fqdn = data[localFields.officialFQDN]
        }
        if (data[localFields.androidPackageName]) {
            app.android_package_name = data[localFields.androidPackageName]
        }
        if (data[localFields.command]) {
            app.command = data[localFields.command]
        }
        if (data[localFields.deploymentManifest]) {
            app.deployment_manifest = data[localFields.deploymentManifest]
        }
        if (data[localFields.autoProvPolicies]) {
            app.auto_prov_policies = data[localFields.autoProvPolicies]
        }
        if (data[localFields.alertPolicies]) {
            app.alert_policies = data[localFields.alertPolicies]
        }
        if (data[localFields.autoPolicyName]) {
            app.auto_prov_policy = data[localFields.autoPolicyName]
        }
        if (data[localFields.accessType]) {
            app.access_type = idFormatter.accessType(data[localFields.accessType])
        }
        if (data[localFields.configs] && data[localFields.configs].length > 0) {
            app.configs = data[localFields.configs].map(config => {
                config[localFields.kind] = idFormatter.kind(config[localFields.kind])
                return config
            })
        }
        if (data[localFields.templateDelimiter]) {
            app.template_delimiter = data[localFields.templateDelimiter]
        }

        if (data[localFields.vmappostype]) {
            app.vm_app_os_type = idFormatter.vmAppOS(data[localFields.vmappostype])
        }

        if (data[localFields.qosSessionProfile]) {
            app.qos_session_profile = idFormatter.qosProfile(data[localFields.qosSessionProfile])
            if (data[localFields.qosSessionDuration] && data[localFields.qosSessionProfile] !== perpetual.QOS_NO_PRIORITY) {
                app.qos_session_duration = data[localFields.qosSessionDuration]
            }
        }

        if (data[localFields.fields]) {
            app.fields = Array.from(new Set(data[localFields.fields]))
        }
    }
    return ({
        region: data[localFields.region],
        app: app
    })
}

export const showApps = (self, data) => {
    let organization = redux_org.orgName(self)
    if (organization && redux_org.isDeveloper(self)) {
        {
            data.app = { key: { organization } }
        }
    }
    return { method: endpoint.SHOW_APP, data: data, keys: keys() }
}

export const getAppList = async (self, data) => {
    return await showAuthSyncRequest(self, showApps(self, data))
}

export const createApp = (data) => {
    let requestData = getKey(data, true)
    return { method: endpoint.CREATE_APP, data: requestData }
}

export const updateApp = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.UPDATE_APP, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteApp = (self, data) => {
    let requestData = getKey(data)
    return { uuid: data.uuid, method: endpoint.DELETE_APP, data: requestData, success: `App ${data[localFields.appName]} deleted successfully` }
}

export const showAppCloudlets = (self, data) => {
    const keys = [
        { field: localFields.cloudletName, serverField: 'name' },
        { field: localFields.operatorName, serverField: 'organization' },
    ]
    const requestData = {
        deploymentCloudletRequest: {
            app: {
                default_flavor: { name: data[localFields.flavorName] },
                key: {
                    name: data[localFields.appName],
                    organization: data[localFields.organizationName],
                    version: data[localFields.version]
                }
            }
        },
        region: data[localFields.region]
    }
    return { method: endpoint.SHOW_CLOUDLETS_FOR_APP, data: requestData, keys }
}
