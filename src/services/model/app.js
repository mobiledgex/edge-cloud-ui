import * as formatter from './format'
import { TYPE_JSON } from '../../hoc/constant';

export const SHOW_APP = "ShowApp";
export const CREATE_APP = "CreateApp";
export const UPDATE_APP = "UpdateApp";
export const DELETE_APP = "DeleteApp";

let fields = formatter.fields

export const keys = [
    { field: fields.region, label: 'Region', sortable: true, visible: true },
    { field: fields.organizationName, serverField: 'key#OS#developer_key#OS#name',  sortable: true, label: 'Organization', visible: true },
    { field: fields.appName, serverField: 'key#OS#name', label: 'App', sortable: true,  visible: true },
    { field: fields.version, serverField: 'key#OS#version', label: 'Version', visible: true },
    { field: fields.deployment, serverField: 'deployment', label: 'Deployment',  sortable: true, visible: true },
    { field: fields.command, serverField: 'command', label: 'Command' },
    { field: fields.deploymentManifest, serverField: 'deployment_manifest', label: 'Deployment Manifest', dataType: TYPE_JSON },
    { field: fields.deploymentGenerator, serverField: 'deployment_generator', label: 'Deployment Generator' },
    { field: fields.imageType, serverField: 'image_type', label: 'Image Type' },
    { field: fields.imagePath, serverField: 'image_path', label: 'Image Path' },
    { field: fields.defaultFlavorName, serverField: 'default_flavor#OS#name',  sortable: true, label: 'Default Flavor', visible: true },
    { field: fields.accessPorts, serverField: 'access_ports', label: 'Ports', visible: true },
    { field: fields.accessType, serverField: 'access_type', label: 'Access Type' },
    { field: fields.authPublicKey, serverField: 'auth_public_key', label: 'Auth Public Key' },
    { field: fields.scaleWithCluster, serverField: 'scale_with_cluster', label: 'Scale With Cluster' },
    { field: fields.officialFQDN, serverField: 'official_fqdn', label: 'Official FQDN' },
    { field: fields.androidPackageName, serverField: 'android_package_name', label: '' },
    { field: fields.revision, serverField: 'revision', label: 'Revision' },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const getKey = (data) => {
    return ({
        region: data[fields.region],
        app: {
            key: {
                developer_key: {
                    name: data[fields.organizationName]
                },
                name: data[fields.appName],
                version: data[fields.version]
            }
        }
    })
}

export const showApps = (data) => {
    if (!formatter.isAdmin()) {
        {
            data.app = {
                key: {
                    developer_key: { name: formatter.getOrganization() },
                }
            }
        }
    }
    return { method: SHOW_APP, data: data }
}

export const deleteApp = (data) => {
    let requestData = getKey(data)
    return { uuid: data.uuid, method: DELETE_APP, data: requestData, success: `App ${data[fields.appName]}` }
}

const newLineToJsonObject = (data) => {
    try {
        let formatedData = {}
        if (data) {
            let dataArray = data.split('\n');
            for (let i = 0; i < dataArray.length; i++) {
                let dataObject = dataArray[i].split(':')
                if(dataObject.length == 2)
                {
                    formatedData[dataObject[0]] = dataObject[1]
                }
            }
            return formatedData
        }
    }
    catch (e) {
        console.log('MexError', e)
    }
}
const customData = (value) => {
    value[fields.deploymentManifest] = newLineToJsonObject(value[fields.deploymentManifest])
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData)
}
