import { generateUniqueId } from '../serviceMC';
import { fields, formatData } from './format'

const keys = [
    { field: fields.cloudletName, serverField: 'key#OS#name' },
    { field: fields.operatorName, serverField: 'key#OS#operator_key#OS#name' },
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

export const getKey = (data) => {
    const { CloudletName, Operator, Region } = data
    return ({
        region: Region,
        cloudlet: {
            key: {
                operator_key: { name: Operator },
                name: CloudletName
            }
        }
    })
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatData(response, body, keys, customData)
}