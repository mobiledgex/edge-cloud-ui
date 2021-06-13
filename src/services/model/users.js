import { fields } from './format'
import { endpoint } from '../../helper/constant'
import { authSyncRequest } from '../service'



export const keys = () => ([
    { field: fields.username, serverField: 'username', label: 'Username', sortable: true, visible: true, filter: true, group: true },
    { field: fields.organizationName, serverField: 'org', label: 'Organization', sortable: true, visible: true, filter: true, group: true },
    { field: fields.role, serverField: 'role', label: 'Role Type', sortable: true, visible: true, filter: true, group: true },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
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