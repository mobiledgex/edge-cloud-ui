
import { SHOW_CLOUDLET_INFO } from './endPointTypes'
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
]

export const showCloudletInfos = (data) => {
    let method = undefined;
    if (formatter.isAdmin()) {
        method = SHOW_CLOUDLET_INFO;
    }
    if (method) {
        return { method: method, data: data }
    }
}

export const getKey = (data) => {
        return ({
            region: data[fields.region],
            cloudlet: {
                key: {
                    organization: data[fields.operatorName],
                    name: data[fields.cloudletName]
                }
            }
        })
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData)
}