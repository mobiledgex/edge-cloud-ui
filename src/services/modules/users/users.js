import { fields } from '../../model/format'
import { endpoint, perpetual } from '../../../helper/constant'
import { authSyncRequest, responseValid, syncRequest } from '../../service'
import { developerRoles, operatorRoles } from '../../../constant'

export const keys = () => ([
    { field: fields.username, serverField: 'username', label: 'Username', sortable: true, visible: true, filter: true, group: true },
    { field: fields.organizationName, serverField: 'org', label: 'Organization', sortable: true, visible: true, filter: true, group: true },
    { field: fields.role, serverField: 'role', label: 'Role Type', sortable: true, visible: true, filter: true, group: true },
    // { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true, roles: [...developerRoles, ...operatorRoles] }
])

export const getKey = (data) => {
    return ({
        org: data[fields.organizationName],
        username: data[fields.username],
        role: data[fields.role]
    })
}

export const showUsers = (self, data) => {
    return { method: endpoint.SHOW_USERS, data: data, keys: keys() }
}

export const addUser = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.ADD_USER_ROLE, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteUser = (self, data) => {
    let requestData = getKey(data);
    return { method: endpoint.DELETE_USER, data: requestData, success: `User ${data[fields.username]} removed successfully` }
}

export const updateUser = async (self, data)=>{
    let request = {method : endpoint.UPDATE_USER, data}
    return await authSyncRequest(self, request)
}

export const updateUserMetaData = async (self, data) => {
    data = JSON.stringify(data)
    let mc = await updateUser(self, { Metadata: data })
    let valid = responseValid(mc)
    if (valid) {
        localStorage.setItem(perpetual.LS_USER_META_DATA, data)
    }
    return valid
}

export const updatePwd = async (self, data) => {
    let request = { method: endpoint.NEW_PASSWORD, data: data }
    return await authSyncRequest(self, request,)
}

export const resetPwd = async (self, data) => {
    let request = { method: endpoint.RESET_PASSWORD, data: data }
    return await syncRequest(self, request)
}