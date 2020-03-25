import * as formatter from './format'
import { SHOW_CLOUDLET_MEMBER, CREATE_CLOUDLET_POOL_MEMBER, DELETE_CLOUDLET_POOL_MEMBER } from './endPointTypes'

const fields = formatter.fields;

export const keys = [
    { field: fields.region, label: 'Region' },
    { field: fields.poolName, serverField: 'pool_key#OS#name' },
    { field: fields.cloudletName, serverField: 'cloudlet_key#OS#name' },
    { field: fields.operatorName, serverField: 'cloudlet_key#OS#organization' }
]

export const getKey = (data) => {
    return ({
        region: data[fields.region],
        cloudletpoolmember: {
            cloudlet_key: {
                name: data[fields.cloudletName],
                organization: data[fields.operatorName]
            },
            pool_key: {
                name: data[fields.poolName]
            }
        }
    })
}

export const showCloudletPoolMembers = (data) => {
    return { method: SHOW_CLOUDLET_MEMBER, data: data }
}

export const createCloudletPoolMember = (data) => {
    let requestData = getKey(data)
    return { method: CREATE_CLOUDLET_POOL_MEMBER, data: requestData }
}

export const deleteCloudletPoolMember = (data) => {
    let requestData = getKey(data)
    return { method: DELETE_CLOUDLET_POOL_MEMBER, data: requestData }
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData)
}