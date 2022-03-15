import { endpoint, perpetual } from "../../../helper/constant"
import { redux_org } from '../../../helper/reduxData'
import {responseFields} from '../../model/responseFields'
import { fields } from "../../model/format"
import { pick } from "../../../helper/constant/operators"

export const keys = () => ([
    { field: fields.region, label: 'Region', serverField: responseFields.Region, sortable: true, visible: true, filter: true, key: true },
    { field: fields.poolName, serverField: responseFields.CloudletPool, label: 'Pool Name', sortable: true, visible: true, filter: true, key: true },
    { field: fields.operatorName, serverField: responseFields.CloudletPoolOrg, label: 'Operator', sortable: true, visible: true, filter: true, key: true },
    { field: fields.organizationName, serverField: responseFields.Org, label: 'Developer', sortable: true, visible: true, key: true },
    { field: fields.decision, serverField: responseFields.Decision, label: 'Status', visible: true, format: true },
    { field: fields.confirm, label: 'Accepted', detailView: false }
])

const getRequestData = (data) => {
    return {
        [responseFields.Region]: data[fields.region],
        [responseFields.CloudletPool]: data[fields.poolName],
        [responseFields.CloudletPoolOrg]: data[fields.operatorName],
        [responseFields.Org]: data[fields.organizationName],
        [responseFields.Decision]: data[fields.decision],
    }
}

const getShowRequestData = (self, data) => {
    let requestData = pick(data, [fields.region])
    let organizationName = redux_org.isAdmin(self) ? data[fields.organizationName] : redux_org.nonAdminOrg(self)
    if (organizationName) {
        if (data[fields.type] === perpetual.DEVELOPER || redux_org.isDeveloper(self)) {
            requestData[responseFields.Org] = organizationName
        }
        else if (data[fields.type] === perpetual.OPERATOR || redux_org.isOperator(self)) {
            requestData[responseFields.CloudletPoolOrg] = organizationName
        }
    }
    return requestData
}

export const createInvitation = (data) => {
    return { method: endpoint.CREATE_POOL_ACCESS_INVITATION, data: getRequestData(data), success: 'Invitation Created' }
}
export const createConfirmation = (data) => {
    return { method: endpoint.CREATE_POOL_ACCESS_CONFIRMATION, data: getRequestData(data), success: 'Access Granted' }
}

export const showConfirmation = (self, data) => {
    let requestData = getShowRequestData(self, data)
    if (requestData) {
        return { method: endpoint.SHOW_POOL_ACCESS_CONFIRMATION, data: requestData, keys: keys() }
    }
}

export const showInvitation = (self, data) => {
    let requestData = getShowRequestData(self, data)
    if (requestData) {
        return { method: endpoint.SHOW_POOL_ACCESS_INVITATION, data, keys: keys() }
    }
}

export const deleteConfirmation = (data) => {
    return { method: endpoint.DELETE_POOL_ACCESS_CONFIRMATION, data: getRequestData(data), success: 'Access Removed' }
}

export const deleteInvitation = (data) => {
    return { method: endpoint.DELETE_POOL_ACCESS_INVITATION, data: getRequestData(data), success: 'Invitation Removed' }
}

export const accessGranted = (self, orgInfo) => {
    let data = {}
    let organizationName = orgInfo[fields.organizationName]
    if (organizationName) {
        if (orgInfo[fields.type] === perpetual.DEVELOPER) {
            data[responseFields.Org] = organizationName
        }
        else if (orgInfo[fields.type] === perpetual.OPERATOR) {
            data[responseFields.CloudletPoolOrg] = organizationName
        }
    }
    return { method: endpoint.SHOW_POOL_ACCESS_GRANTED, data, keys: keys() }
}

export const accessPending = (self, data) => {
    let requestData = getShowRequestData(self, data)
    if (requestData) {
        return { method: endpoint.SHOW_POOL_ACCESS_PENDING, data }
    }
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
                    if (data[fields.poolName] === confirmation[fields.poolName] && data[fields.organizationName] === confirmation[fields.organizationName] && data[fields.operatorName] === confirmation[fields.operatorName]) {
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