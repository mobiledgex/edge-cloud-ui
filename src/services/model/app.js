import * as formatter from './format'
import { TYPE_YAML } from '../../constant';
import * as serverData from './serverData'
import * as constant from '../../constant'
import { SHOW_APP, CREATE_APP, UPDATE_APP, DELETE_APP } from './endPointTypes'
import { FORMAT_FULL_DATE_TIME } from '../../utils/date_util';

let fields = formatter.fields

export const configs = [
    { field: fields.kind, serverField: 'kind', label: 'Kind' },
    { field: fields.config, serverField: 'config', label: 'Config', dataType: TYPE_YAML }
]

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true },
    { field: fields.organizationName, serverField: 'key#OS#organization', sortable: true, label: 'Organization', visible: true, filter: true, group: true },
    { field: fields.appName, serverField: 'key#OS#name', label: 'App', sortable: true, visible: true, filter: true },
    { field: fields.version, serverField: 'key#OS#version', label: 'Version', visible: true, filter: true },
    { field: fields.deployment, serverField: 'deployment', label: 'Deployment', sortable: true, visible: true, filter: true, group: true },
    { field: fields.command, serverField: 'command', label: 'Command' },
    { field: fields.deploymentManifest, serverField: 'deployment_manifest', label: 'Deployment Manifest', dataType: TYPE_YAML },
    { field: fields.deploymentGenerator, serverField: 'deployment_generator', label: 'Deployment Generator' },
    { field: fields.imageType, serverField: 'image_type', label: 'Image Type' },
    { field: fields.imagePath, serverField: 'image_path', label: 'Image Path' },
    { field: fields.flavorName, serverField: 'default_flavor#OS#name', sortable: true, label: 'Default Flavor'},
    { field: fields.accessPorts, serverField: 'access_ports', label: 'Ports' },
    { field: fields.skipHCPorts, serverField: 'skip_hc_ports', label: 'Skip Health Check' },
    { field: fields.accessType, serverField: 'access_type', label: 'Access Type' },
    { field: fields.authPublicKey, serverField: 'auth_public_key', label: 'Auth Public Key' },
    { field: fields.scaleWithCluster, serverField: 'scale_with_cluster', label: 'Scale With Cluster' },
    { field: fields.officialFQDN, serverField: 'official_fqdn', label: 'Official FQDN' },
    { field: fields.androidPackageName, serverField: 'android_package_name', label: 'Android Package Name' },
    { field: fields.autoPolicyName, serverField: 'auto_prov_policy', label: 'Auto Provisioning Policy' },
    { field: fields.privacyPolicyName, serverField: 'default_privacy_policy', label: 'Default Privacy Policy' },
    { field: fields.configs, serverField: 'configs', label: 'Configs', keys: configs },
    { field: fields.annotations, serverField: 'annotations', label: 'Annotations', visible: false },
    { field: fields.templateDelimiter, serverField: 'template_delimiter', label: 'Template Delimiter' },
    { field: fields.revision, serverField: 'revision', label: 'Revision' },
    { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: constant.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: constant.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
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
        app.deployment = data[fields.deployment]
        app.image_type = constant.imageType(data[fields.imageType])
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
        app.delete_ports = []
        app.default_flavor = { name: data[fields.flavorName] }
        app.auth_public_key = data[fields.authPublicKey]
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
        if (data[fields.autoPolicyName]) {
            app.auto_prov_policy = data[fields.autoPolicyName]
        }
        if (data[fields.privacyPolicyName]) {
            app.default_privacy_policy = data[fields.privacyPolicyName]
        }
        if (data[fields.accessType]) {
            app.access_type = constant.accessType(data[fields.accessType])
        }
        if (data[fields.configs] && data[fields.configs].length > 0) {
            app.configs = data[fields.configs].map(config => {
                config[fields.kind] = constant.configType(config[fields.kind])
                return config
            })
        }
        if (data[fields.templateDelimiter]) {
            app.template_delimiter = data[fields.templateDelimiter]
        }
    }
    return ({
        region: data[fields.region],
        app: app
    })
}

export const showApps = (data) => {
    if (!formatter.isAdmin()) {
        {
            data.app = {
                key: {
                    organization: formatter.getOrganization(),
                }
            }
        }
    }
    return { method: SHOW_APP, data: data }
}

export const getAppList = async (self, data) => {
    return await serverData.showDataFromServer(self, showApps(data))
}

export const createApp = (data) => {
    let requestData = getKey(data, true)
    return { method: CREATE_APP, data: requestData }
}

export const updateApp = async (self, data, originalData) => {
    let updateFields = []
    if (!formatter.compareObjects(data[fields.imagePath], originalData[fields.imagePath])) {
        updateFields.push('4')
    }
    if (!formatter.compareObjects(data[fields.accessPorts], originalData[fields.accessPorts], true)) {
        updateFields.push('7')
    }
    if (!formatter.compareObjects(data[fields.flavorName], originalData[fields.flavorName])) {
        updateFields.push('9.1')
    }
    if (!formatter.compareObjects(data[fields.authPublicKey], originalData[fields.authPublicKey])) {
        updateFields.push('12')
    }
    if (!formatter.compareObjects(data[fields.command], originalData[fields.command])) {
        updateFields.push('13')
    }
    if (!formatter.compareObjects(data[fields.deploymentManifest], originalData[fields.deploymentManifest])) {
        updateFields.push('16')
    }
    if (!formatter.compareObjects(data[fields.androidPackageName], originalData[fields.androidPackageName])) {
        updateFields.push('18')
    }
    if (!formatter.compareObjects(data[fields.configs], originalData[fields.configs])) {
        updateFields.push('21', '21.1', '21.2')
    }
    if (!formatter.compareObjects(data[fields.scaleWithCluster], originalData[fields.scaleWithCluster])) {
        updateFields.push('22')
    }
    if (!formatter.compareObjects(data[fields.officialFQDN], originalData[fields.officialFQDN])) {
        updateFields.push('25')
    }
    if (!formatter.compareObjects(data[fields.autoPolicyName], originalData[fields.autoPolicyName])) {
        updateFields.push('28')
    }
    if (!formatter.compareObjects(data[fields.privacyPolicyName], originalData[fields.privacyPolicyName])) {
        updateFields.push('30')
    }
    if (!formatter.compareObjects(data[fields.templateDelimiter], originalData[fields.templateDelimiter])) {
        updateFields.push('33')
    }
    if (!formatter.compareObjects(data[fields.skipHCPorts], originalData[fields.skipHCPorts], true)) {
        updateFields.push('34')
    }
    if (updateFields.length > 0) {
        let requestData = getKey(data, true)
        requestData.app.fields = updateFields
        let request = { method: UPDATE_APP, data: requestData }
        return await serverData.sendRequest(self, request)
    }
    else
    {
        return self.props.handleAlertInfo('error', 'Nothing to update')
    }
}

export const deleteApp = (data) => {
    let requestData = getKey(data)
    return { uuid: data.uuid, method: DELETE_APP, data: requestData, success: `App ${data[fields.appName]} deleted successfully` }
}


const customData = (value) => {
    value[fields.accessType] = constant.accessType(value[fields.accessType])
    value[fields.imageType] = constant.imageType(value[fields.imageType])
    value[fields.revision] = value[fields.revision] ? value[fields.revision] : '0'
    value[fields.deploymentManifest] = value[fields.deploymentManifest] ? value[fields.deploymentManifest].trim() : value[fields.deploymentManifest]
    value[fields.scaleWithCluster] = value[fields.scaleWithCluster] ? value[fields.scaleWithCluster] : false
    value[fields.createdAt] = value[fields.createdAt] ? value[fields.createdAt][fields.seconds] : undefined
    value[fields.updatedAt] = value[fields.updatedAt] ? value[fields.updatedAt][fields.seconds] : undefined
    if (value[fields.configs]) {
        let configs = value[fields.configs]
        for (let i = 0; i < configs.length; i++) {
            let config = configs[i]
            config.kind = constant.configType(config.kind)
        }
    }
    return value
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys(), customData)
}
