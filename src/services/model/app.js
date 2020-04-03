import * as formatter from './format'
import { TYPE_JSON_NEW_LINE } from '../../constant';
import * as serverData from './serverData'
import * as constant from '../../constant'
import { SHOW_APP, CREATE_APP, UPDATE_APP, DELETE_APP } from './endPointTypes'

let fields = formatter.fields

export const keys = () => ([
    { field: fields.region, label: 'Region', sortable: true, visible: true },
    { field: fields.organizationName, serverField: 'key#OS#organization', sortable: true, label: 'Organization', visible: true },
    { field: fields.appName, serverField: 'key#OS#name', label: 'App', sortable: true, visible: true },
    { field: fields.version, serverField: 'key#OS#version', label: 'Version', visible: true },
    { field: fields.deployment, serverField: 'deployment', label: 'Deployment', sortable: true, visible: true },
    { field: fields.command, serverField: 'command', label: 'Command' },
    { field: fields.deploymentManifest, serverField: 'deployment_manifest', label: 'Deployment Manifest', dataType: TYPE_JSON_NEW_LINE },
    { field: fields.deploymentGenerator, serverField: 'deployment_generator', label: 'Deployment Generator' },
    { field: fields.imageType, serverField: 'image_type', label: 'Image Type' },
    { field: fields.imagePath, serverField: 'image_path', label: 'Image Path' },
    { field: fields.flavorName, serverField: 'default_flavor#OS#name', sortable: true, label: 'Default Flavor', visible: true },
    { field: fields.accessPorts, serverField: 'access_ports', label: 'Ports', visible: true },
    { field: fields.accessType, serverField: 'access_type', label: 'Access Type' },
    { field: fields.authPublicKey, serverField: 'auth_public_key', label: 'Auth Public Key' },
    { field: fields.scaleWithCluster, serverField: 'scale_with_cluster', label: 'Scale With Cluster' },
    { field: fields.officialFQDN, serverField: 'official_fqdn', label: 'Official FQDN' },
    { field: fields.androidPackageName, serverField: 'android_package_name', label: '' },
    { field: fields.revision, serverField: 'revision', label: 'Revision' },
    { field: fields.autoPolicyName, serverField: 'auto_prov_policy', label: 'Auto Provisioning Policy' },
    { field: fields.privacyPolicyName, serverField: 'default_privacy_policy', label: 'Default Privacy Policy' },
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
        app.image_path = data[fields.imagePath]
        if (data[fields.accessPorts]) {
            app.access_ports = data[fields.accessPorts]
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

export const createApp = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: CREATE_APP, data: requestData }
    return await serverData.sendRequest(self, request)
}

export const updateApp = async (self, data) => {
    let requestData = getKey(data, true)
    requestData.app.fields = ['4', '7', '9.1', '16']
    let request = { method: UPDATE_APP, data: requestData }
    return await serverData.sendRequest(self, request)
}

export const deleteApp = (data) => {
    let requestData = getKey(data)
    return { uuid: data.uuid, method: DELETE_APP, data: requestData, success: `App ${data[fields.appName]}` }
}


const customData = (value) => {
    value[fields.accessType] = constant.accessType(value[fields.accessType])
    value[fields.imageType] = constant.imageType(value[fields.imageType])
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys(), customData)
}
