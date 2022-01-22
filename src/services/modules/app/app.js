import * as formatter from '../../model/format'
import { FORMAT_FULL_DATE_TIME } from '../../../utils/date_util';
import { idFormatter } from '../../../helper/formatter';
import { redux_org } from '../../../helper/reduxData'
import { endpoint, perpetual } from '../../../helper/constant';
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { developerRoles } from '../../../constant';

let fields = formatter.fields

export const configs = () => ([
    { field: fields.kind, serverField: 'kind', label: 'Kind' },
    { field: fields.config, serverField: 'config', label: 'Config', dataType: perpetual.TYPE_YAML }
])

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: fields.organizationName, serverField: 'key#OS#organization', sortable: true, label: 'Organization', visible: true, filter: true, group: true, key: true },
    { field: fields.appName, serverField: 'key#OS#name', label: 'App', visible: false, filter: true, key: true, group: true },
    { field: fields.app_name_version, label: 'App [Version]', visible: true, sortable: true, detailView: false },
    { field: fields.version, serverField: 'key#OS#version', label: 'Version', visible: false, filter: true, key: true },
    { field: fields.deployment, serverField: 'deployment', label: 'Deployment', sortable: true, visible: true, filter: true, group: true },
    { field: fields.vmappostype, serverField: 'vm_app_os_type', label: 'VM App OS Type' },
    { field: fields.command, serverField: 'command', label: 'Command' },
    { field: fields.deploymentManifest, serverField: 'deployment_manifest', label: 'Deployment Manifest', dataType: perpetual.TYPE_YAML },
    { field: fields.deploymentGenerator, serverField: 'deployment_generator', label: 'Deployment Generator' },
    { field: fields.imageType, serverField: 'image_type', label: 'Image Type' },
    { field: fields.imagePath, serverField: 'image_path', label: 'Image Path' },
    { field: fields.flavorName, serverField: 'default_flavor#OS#name', sortable: true, label: 'Default Flavor' },
    { field: fields.accessPorts, serverField: 'access_ports', label: 'Ports' },
    { field: fields.skipHCPorts, serverField: 'skip_hc_ports', label: 'Skip Health Check' },
    { field: fields.accessType, serverField: 'access_type', label: 'Access Type' },
    { field: fields.authPublicKey, serverField: 'auth_public_key', label: 'Auth Public Key' },
    { field: fields.scaleWithCluster, serverField: 'scale_with_cluster', label: 'Scale With Cluster', format: true },
    { field: fields.officialFQDN, serverField: 'official_fqdn', label: 'Official FQDN' },
    { field: fields.androidPackageName, serverField: 'android_package_name', label: 'Android Package Name' },
    { field: fields.autoProvPolicies, serverField: 'auto_prov_policies', label: 'Auto Provisioning Policies', dataType: perpetual.TYPE_ARRAY },
    { field: fields.alertPolicies, serverField: 'alert_policies', label: 'Alert Policies', dataType: perpetual.TYPE_ARRAY },
    { field: fields.autoPolicyName, serverField: 'auto_prov_policy', label: 'Auto Provisioning Policy' },
    { field: fields.qosSessionProfile, serverField: 'qos_session_profile', label: 'QOS Network Prioritization' },
    { field: fields.qosSessionDuration, serverField: 'qos_session_duration', label: 'QOS Session Duration' },
    { field: fields.trusted, serverField: 'trusted', label: 'Trusted', visible: false, sortable: true, format: true },
    { field: fields.allowServerless, serverField: 'allow_serverless', label: 'Allow Serverless', format: true },
    { field: fields.configs, serverField: 'configs', label: 'Configs', keys: configs() },
    { field: fields.accessServerlessConfig, serverField: 'serverless_config', label: 'Serverless Config', dataType: perpetual.TYPE_JSON },
    { field: fields.annotations, serverField: 'annotations', label: 'Annotations', visible: false },
    { field: fields.requiredOutboundConnections, serverField: 'required_outbound_connections', label: 'Required Outbound Connections', visible: false, dataType: perpetual.TYPE_JSON },
    { field: fields.templateDelimiter, serverField: 'template_delimiter', label: 'Template Delimiter' },
    { field: fields.revision, serverField: 'revision', label: 'Revision' },
    { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } }
])

export const getKey = (data, isCreate) => {

    let app = {}

    app.key = {
        organization: data[fields.organizationName],
        name: data[fields.appName],
        version: data[fields.version]
    }

    if (isCreate) {
        app.scale_with_cluster = data[fields.scaleWithCluster]
        app.trusted = data[fields.trusted]
        app.deployment = data[fields.deployment]
        app.image_type = idFormatter.imageType(data[fields.imageType])
        if (data[fields.imagePath]) {
            app.image_path = data[fields.imagePath]
        }
        if (data[fields.accessPorts]) {
            app.access_ports = data[fields.accessPorts].toLowerCase()
        }
        if (data[fields.skipHCPorts]) {
            app.skip_hc_ports = data[fields.skipHCPorts].toLowerCase()
        }
        if (data[fields.annotations]) {
            app.annotations = data[fields.annotations]
        }
        if (data[fields.requiredOutboundConnections]) {
            app.required_outbound_connections = data[fields.requiredOutboundConnections]
        }

        app.default_flavor = data[fields.flavorName] ? { name: data[fields.flavorName] } : undefined
        app.auth_public_key = data[fields.authPublicKey]
        app.allow_serverless = data[fields.allowServerless]
        app.serverless_config = data[fields.allowServerless] ? {
            vcpus: data[fields.serverlessVcpu] ? parseInt(data[fields.serverlessVcpu]) : undefined,
            ram: data[fields.serverlessRam] ? parseInt(data[fields.serverlessRam]) : undefined,
            min_replicas: data[fields.serverlessMinReplicas] ? parseInt(data[fields.serverlessMinReplicas]) : undefined
        } : undefined
        if (data[fields.officialFQDN]) {
            app.official_fqdn = data[fields.officialFQDN]
        }
        if (data[fields.androidPackageName]) {
            app.android_package_name = data[fields.androidPackageName]
        }
        if (data[fields.command]) {
            app.command = data[fields.command]
        }
        if (data[fields.deploymentManifest]) {
            app.deployment_manifest = data[fields.deploymentManifest]
        }
        if (data[fields.autoProvPolicies]) {
            app.auto_prov_policies = data[fields.autoProvPolicies]
        }
        if (data[fields.alertPolicies]) {
            app.alert_policies = data[fields.alertPolicies]
        }
        if (data[fields.autoPolicyName]) {
            app.auto_prov_policy = data[fields.autoPolicyName]
        }
        if (data[fields.accessType]) {
            app.access_type = idFormatter.accessType(data[fields.accessType])
        }
        if (data[fields.configs] && data[fields.configs].length > 0) {
            app.configs = data[fields.configs].map(config => {
                config[fields.kind] = idFormatter.kind(config[fields.kind])
                return config
            })
        }
        if (data[fields.templateDelimiter]) {
            app.template_delimiter = data[fields.templateDelimiter]
        }

        if (data[fields.vmappostype]) {
            app.vm_app_os_type = idFormatter.vmAppOS(data[fields.vmappostype])
        }

        if (data[fields.qosSessionProfile]) {
            app.qos_session_profile = idFormatter.qosProfile(data[fields.qosSessionProfile])
        }

        if (data[fields.qosSessionDuration]) {
            app.qos_session_duration = data[fields.qosSessionDuration]
        }

        if (data[fields.fields]) {
            app.fields = Array.from(new Set(data[fields.fields]))
        }
    }
    return ({
        region: data[fields.region],
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
    return { uuid: data.uuid, method: endpoint.DELETE_APP, data: requestData, success: `App ${data[fields.appName]} deleted successfully` }
}

export const showAppCloudlets = (self, data) => {
    const keys = [
        { field: fields.cloudletName, serverField: 'name' },
        { field: fields.operatorName, serverField: 'organization' },
    ]
    const requestData = {
        deploymentCloudletRequest: {
            app: {
                default_flavor: { name: data[fields.flavorName] },
                key: {
                    name: data[fields.appName],
                    organization: data[fields.organizationName],
                    version: data[fields.version]
                }
            }
        },
        region: data[fields.region]
    }
    return { method: endpoint.SHOW_CLOUDLETS_FOR_APP, data: requestData, keys }
}
