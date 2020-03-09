import * as formatter from './format'

let fields = formatter.fields;

const keys = [
    { field: fields.cloudletName, serverField: 'key#OS#name' },
    { field: fields.operatorName, serverField: 'key#OS#operator_key#OS#name' },
    { field: fields.cloudletLocation, serverField: 'location' },
    { field: fields.ipSupport, serverField: 'ip_support' },
    { field: fields.numDynamicIPs, serverField: 'num_dynamic_ips' },
    { field: fields.physicalName, serverField: 'physical_name' },
    { field: fields.platformType, serverField: 'platform_type' },
    { field: fields.state, serverField: 'state' },
    { field: fields.status, serverField: 'status' }
]

export const getKey = (data) => {
    return ({
        region: data[fields.region],
        cloudlet: {
            key: {
                operator_key: { name: data[fields.operatorName] },
                name: data[fields.cloudletName]
            }
        }
    })
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData, true)
}