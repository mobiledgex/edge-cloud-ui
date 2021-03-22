
import { SHOW_CLOUDLET_INFO, SHOW_ORG_CLOUDLET_INFO } from './endPointTypes'
import * as formatter from './format'

let fields = formatter.fields;

const keys = [
    { field: fields.cloudletName, serverField: 'key#OS#name' },
    { field: fields.operatorName, serverField: 'key#OS#organization' },
    { field: fields.state, serverField: 'state' },
    { field: fields.notifyId, serverField: 'notify_id' },
    { field: fields.controller, serverField: 'controller' },
    { field: fields.status, serverField: 'status' },
    { field: fields.containerVersion, serverField: 'container_version' },
    { field: fields.osMaxRam, serverField: 'os_max_ram' },
    { field: fields.osMaxVCores, serverField: 'os_max_vcores' },
    { field: fields.osMaxVolGB, serverField: 'os_max_vol_gb' },
    { field: fields.flavors, serverField: 'flavors' },
    { field: fields.compatibilityVersion, serverField: 'compatibility_version' },
]

export const showCloudletInfos = (data, specific) => {
    let method = SHOW_ORG_CLOUDLET_INFO;
    if (formatter.isAdmin()) {
        method = SHOW_CLOUDLET_INFO;
    }
    let requestData = {}
    if (specific) {
        let cloudletinfo = { key: data.cloudletkey ? data.cloudletkey : data.cloudlet.key }
        requestData = {
            uuid: data.uuid,
            region: data.region,
            cloudletinfo
        }
    }
    else {
        requestData = data
    }
    if (!formatter.isAdmin()) {
        requestData.org = formatter.getOrganization()
    }
    return { method: method, data: requestData, keys: keys }
}

export const showOrgCloudletInfos = (data) => {
    return { method: SHOW_ORG_CLOUDLET_INFO, data: data,  keys: keys }
}

export const getKey = (data) => {
    return ({
        region: data[fields.region],
        cloudletinfo: {
            key: {
                organization: data[fields.operatorName],
                name: data[fields.cloudletName]
            }
        }
    })
}

const customData = (value) => {
    return value
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData)
}