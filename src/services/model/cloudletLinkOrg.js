import * as formatter from './format'
import { SHOW_CLOUDLET_LINKORG, DELETE_LINK_POOL_ORG, CREATE_POOL_ACCESS_INVITATION } from './endPointTypes'

const fields = formatter.fields;

export const keys = [
    { field: fields.region, serverField: 'Region' },
    { field: fields.organizationName, serverField: 'Org' },
    { field: fields.poolName, serverField: 'CloudletPool' }
]

const getKey = (data) => {
        return ({
            region: data[fields.region],
            cloudletpool: data[fields.poolName],
            cloudletpoolorg : data[fields.operatorName],
            org: data[fields.organizationName]
        })
}

export const showCloudletLinkOrg = (data) => {
    return { method: SHOW_CLOUDLET_LINKORG, data: data }
}

export const createLinkPoolOrg = (data) => {
    let requestData = getKey(data)
    return { method: CREATE_POOL_ACCESS_INVITATION, data: requestData }
}

export const deleteLinkPoolOrg = (data) => {
    let requestData = getKey(data)
    return { method: DELETE_LINK_POOL_ORG, data: requestData }
}

const customData = (value) => {
    return value
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData)
}