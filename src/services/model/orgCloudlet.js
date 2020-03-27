import * as formatter from './format'

let fields = formatter.fields;

const keys = [
    { field: fields.cloudletName, serverField: 'key#OS#name' },
    { field: fields.operatorName, serverField: 'key#OS#organization' },
    { field: fields.cloudletLocation, serverField: 'location' },
    { field: fields.ipSupport, serverField: 'ip_support' },
    { field: fields.numDynamicIPs, serverField: 'num_dynamic_ips' },
    { field: fields.physicalName, serverField: 'physical_name' },
    { field: fields.platformType, serverField: 'platform_type' },
    { field: fields.state, serverField: 'state' },
    { field: fields.status, serverField: 'status' }
]

export const getKey = (data) => {
    if (data) {
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
    return {}
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData, true)
}