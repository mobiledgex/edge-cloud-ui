import * as formatter from './format'
import { SHOW_CLOUDLET_POOL, CREATE_CLOUDLET_POOL, DELETE_CLOUDLET_POOL, SHOW_CLOUDLET_LINKORG, UPDATE_CLOUDLET_POOL } from './endPointTypes'

const fields = formatter.fields;

export const keys = [
    { field: fields.region, label: 'Region', sortable: true, visible: true, filter:true },
    { field: fields.poolName, serverField: 'key#OS#name', label: 'Pool Name', sortable: true, visible: true, filter:true },
    { field: fields.operatorName, serverField: 'key#OS#organization', label: 'Operator', sortable: true, visible: true },
    { field: fields.cloudletCount, label: 'Number of  Clouldlets', sortable: true, visible: true },
    { field: fields.organizationCount, label: 'Number of Organizations', sortable: true, visible: true },
    {
        field: fields.cloudlets, label: 'Cloudlets', serverField: 'cloudlets', dataType:'String'
    },
    {
        field: fields.organizations, label: 'Organizations',
        keys: [{ field: fields.organizationName, label: 'Organization Name' }]
    },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const getKey = (data) => {
    let cloudletpool = {}

    cloudletpool.key = { name: data[fields.poolName], organization: data[fields.operatorName] }
    cloudletpool.cloudlets = data[fields.cloudlets]

    if (data[fields.fields]) {
        cloudletpool.fields = data[fields.fields]
    }
    return ({
        region: data[fields.region],
        cloudletpool: cloudletpool
    })
}

const addLinkOrg = (poolList, linkOrgList) => {
    for (let i = 0; i < poolList.length; i++) {
        let pool = poolList[i]
        let organizations = []
        for (let j = 0; j < linkOrgList.length; j++) {
            let linkOrg = linkOrgList[j]
            if (pool[fields.poolName] === linkOrg[fields.poolName]) {
                pool[fields.organizationCount] += 1
                let organization = {}
                organization[fields.organizationName] = linkOrg[fields.organizationName]
                organizations.push(organization)
            }
        }
        pool[fields.organizations] = organizations
    }
}

export const multiDataRequest = (keys, mcRequestList) => {
    let poolList = [];
    let linkOrgList = [];
    for (let i = 0; i < mcRequestList.length; i++) {
        let mcRequest = mcRequestList[i];
        let request = mcRequest.request;
        if (request.method === SHOW_CLOUDLET_POOL) {
            poolList = mcRequest.response.data
        }
        else if (request.method === SHOW_CLOUDLET_LINKORG) {
            linkOrgList = mcRequest.response.data
        }
    }

    if (poolList && poolList.length > 0) {
        addLinkOrg(poolList, linkOrgList)
    }
    return poolList;
}

export const showCloudletPools = (data) => {
    return { method: SHOW_CLOUDLET_POOL, data: data }
}

export const createCloudletPool = (data) => {
    let requestData = getKey(data)
    return { method: CREATE_CLOUDLET_POOL, data: requestData }
}

export const updateCloudletPool = (data) => {
    let requestData = getKey(data)
    return { method: UPDATE_CLOUDLET_POOL, data: requestData }
}

export const deleteCloudletPool = (data) => {
    let requestData = getKey(data)
    return { method: DELETE_CLOUDLET_POOL, data: requestData, success: `Cloudlet Pool ${data[fields.poolName]} deleted successfully` }
}

const customData = (value) => {
    value[fields.cloudletCount] = value[fields.cloudlets] ? value[fields.cloudlets].length : 0
    value[fields.organizationCount] = 0
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData)
}