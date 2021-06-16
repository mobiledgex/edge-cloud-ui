import { endpoint, perpetual } from "../../../helper/constant"
import { redux_org } from '../../../helper/reduxData'
import { fields } from "../../model/format"

export const keys = () => ([
    { field: fields.region, label: 'Region', serverField: 'Region', sortable: true, visible: true, filter: true, key: true },
    { field: fields.poolName, serverField: 'CloudletPool', label: 'Pool Name', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorOrg, serverField: 'CloudletPoolOrg', label: 'Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.developerOrg, serverField: 'Org', label: 'Developer', sortable: true, visible: true, key: true },
    { field: fields.decision, serverField: 'Decision', label: 'Status', visible: true, format: true },
    { field: fields.confirm, label: 'Accepted', detailView: false },
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
    return { method: endpoint.CREATE_POOL_ACCESS_INVITATION, data: getRequestData(data), success: 'Invitation Created' }
}
export const createConfirmation = (data) => {
    return { method: endpoint.CREATE_POOL_ACCESS_CONFIRMATION, data: getRequestData(data), success: 'Access Granted' }
}

export const showConfirmation = (self, data) => {
    data = data ? data : {}
    let org = redux_org.nonAdminOrg(self)
    if (org) {
        if (redux_org.isDeveloper(self)) {
            data['Org'] = org
        }
        else if (redux_org.isOperator(self)) {
            data['CloudletPoolOrg'] = org
        }
    }
    return { method: endpoint.SHOW_POOL_ACCESS_CONFIRMATION, data, keys: keys() }
}

export const showInvitation = (self, data) => {
    data = data ? data : {}
    let org = redux_org.nonAdminOrg(self)
    if (org) {
        if (redux_org.isDeveloper(self)) {
            data['Org'] = org
        }
        else if (redux_org.isOperator(self)) {
            data['CloudletPoolOrg'] = org
        }
    }
    return { method: endpoint.SHOW_POOL_ACCESS_INVITATION, data, keys: keys() }
}

export const deleteConfirmation = (data) => {
    return { method: endpoint.DELETE_POOL_ACCESS_CONFIRMATION, data: getRequestData(data), success: 'Access Removed' }
}

export const deleteInvitation = (data) => {
    return { method: endpoint.DELETE_POOL_ACCESS_INVITATION, data: getRequestData(data), success: 'Invitation Removed' }
}

export const accessGranted = (self, orgInfo) => {
    let data = {}
    let org = orgInfo[fields.organizationName]
    if (org) {
        if (orgInfo[fields.type] === perpetual.DEVELOPER) {
            data['Org'] = org
        }
        else if (orgInfo[fields.type] === perpetual.OPERATOR) {
            data['CloudletPoolOrg'] = org
        }
    }
    return { method: endpoint.SHOW_POOL_ACCESS_GRANTED, data }
}

export const accessPending = (self, data) => {
    data = data ? data : {}
    let org = redux_org.nonAdminOrg(self)
    if (org) {
        if (redux_org.isDeveloper(self)) {
            data['Org'] = org
        }
        else if (redux_org.isOperator(self)) {
            data['CloudletPoolOrg'] = org
        }
    }
    return { method: endpoint.SHOW_POOL_ACCESS_PENDING, data }
}

export const multiDataRequest = (keys, mcList) => {
    let invitationList = []
    let confirmationList = []
    let dataList = []
    if (mcList && mcList.length > 0) {
        mcList.forEach(mc => {
            let request = mc.request
            let response = mc.response
            if (response && response.status === 200) {
                let data = response.data
                if (request.method === endpoint.SHOW_POOL_ACCESS_CONFIRMATION) {
                    confirmationList = data
                }
                else if (request.method === endpoint.SHOW_POOL_ACCESS_INVITATION) {
                    invitationList = data
                }
            }
        })

        if (invitationList.length > 0) {
            invitationList.forEach(invitation => {
                dataList.push({ ...invitation, invite: true })
            })
        }
        if (confirmationList.length > 0) {
            confirmationList.forEach(confirmation => {
                let exist = false
                dataList.forEach(data => {
                    if (data[fields.poolName] === confirmation[fields.poolName] && data[fields.developerOrg] === confirmation[fields.developerOrg] && data[fields.operatorOrg] === confirmation[fields.operatorOrg]) {
                        data.confirm = true
                        data.decision = confirmation[fields.decision]
                        exist = true
                    }
                })

                if (!exist) {
                    dataList.push({ ...confirmation, confirm: true })
                }
            })
        }
    }
    return dataList
}