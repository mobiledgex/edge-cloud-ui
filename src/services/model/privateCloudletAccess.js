import { CREATE_POOL_ACCESS_CONFIRMATION, CREATE_POOL_ACCESS_INVITATION, DELETE_POOL_ACCESS_CONFIRMATION, DELETE_POOL_ACCESS_INVITATION, SHOW_POOL_ACCESS_CONFIRMATION, SHOW_POOL_ACCESS_GRANTED, SHOW_POOL_ACCESS_INVITATION, SHOW_POOL_ACCESS_PENDING } from "./endPointTypes"
import * as formatter from './format'

const fields = formatter.fields

export const keys = () => ([
    { field: fields.region, label: 'Region', serverField: 'Region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.poolName, serverField: 'CloudletPool', label: 'Pool Name', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorOrg, serverField: 'CloudletPoolOrg', label: 'Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.developerOrg, serverField: 'Org', label: 'Developer', sortable: true, visible: true, key: true },
    { field: fields.confirm, label: 'Accepted', visible: true, format: true },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
])

const getRequestData = (data) => {
    return {
        Region: data[fields.region],
        CloudletPool: data[fields.poolName],
        CloudletPoolOrg: data[fields.operatorOrg],
        Org: data[fields.developerOrg],
        Decision: data[fields.decision],
    }
}

export const createInvitation = (data) => {
    return { method: CREATE_POOL_ACCESS_INVITATION, data: getRequestData(data), success: 'Invitation Created' }
}
export const createConfirmation = (data) => {
    return { method: CREATE_POOL_ACCESS_CONFIRMATION, data: getRequestData(data), success: 'Access Granted' }
}

export const showConfirmation = (data) => {
    data = data ? data : {}
    return { method: SHOW_POOL_ACCESS_CONFIRMATION, data, keys: keys() }
}

export const showInvitation = (data) => {
    data = data ? data : {}
    return { method: SHOW_POOL_ACCESS_INVITATION, data, keys: keys() }
}

export const deleteConfirmation = (data) => {
    return { method: DELETE_POOL_ACCESS_CONFIRMATION, data: getRequestData(data), success: 'Access Removed' }
}

export const deleteInvitation = (data) => {
    return { method: DELETE_POOL_ACCESS_INVITATION, data: getRequestData(data), success: 'Invitation Removed' }
}

export const accessGranted = (data) => {
    data = data ? data : {}
    return { method: SHOW_POOL_ACCESS_GRANTED, data }
}

export const accessPending = (data) => {
    data = data ? data : {}
    return { method: SHOW_POOL_ACCESS_PENDING, data }
}

export const multiDataRequest = (keys, mcList) => {
    let pendingList = []
    let grantedList = []
    let dataList = []
    if (mcList && mcList.length > 0) {
        mcList.forEach(mc => {
            let request = mc.request
            let response = mc.response
            if (response && response.status === 200) {
                let data = response.data
                if (request.method === SHOW_POOL_ACCESS_GRANTED) {
                    grantedList = data
                }
                else if (request.method === SHOW_POOL_ACCESS_PENDING) {
                    pendingList = data
                }
            }
        })

        if (pendingList.length > 0) {
            pendingList.forEach(pending => {
                dataList.push({ ...pending, confirm: false })
            })
        }

        if (grantedList.length > 0) {
            grantedList.forEach(granted => {
                dataList.push({ ...granted, confirm: true })
            })
        }
    }
    return dataList
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys())
}