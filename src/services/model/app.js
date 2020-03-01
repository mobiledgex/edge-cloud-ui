import { fields, formatData } from './format'

const keys = [
    { field: fields.organizationName, serverField: 'key#OS#developer_key#OS#name' },
    { field: fields.appName, serverField: 'key#OS#name' },
    { field: fields.version, serverField: 'key#OS#version' },
    { field: fields.deployment, serverField: 'deployment' },
    { field: fields.command, serverField: 'command' },
    { field: fields.deploymentManifest, serverField: 'deployment_manifest' },
    { field: fields.deploymentGenerator, serverField: 'deployment_generator' },
    { field: fields.imageType, serverField: 'image_type' },
    { field: fields.imagePath, serverField: 'image_path' },
    { field: fields.defaultFlavorName, serverField: 'default_flavor#OS#name' },
    { field: fields.accessPorts, serverField: 'access_ports' },
    { field: fields.accessType, serverField: 'access_type' },
    { field: fields.authPublicKey, serverField: 'auth_public_key' },
    { field: fields.scaleWithCluster, serverField: 'scale_with_cluster' },
    { field: fields.officialFQDN, serverField: 'official_fqdn' },
    { field: fields.androidPackageName, serverField: 'android_package_name' },
    { field: fields.revision, serverField: 'revision' },
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

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatData(response, body, keys, customData)
}
