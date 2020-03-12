import { fields, formatData } from './format'

export const SHOW_USERS = "ShowUsers";
export const DELETE_USER = "DeleteUser";



export const keys = [
    { field: fields.organizationName, serverField: 'org', label: 'Username', visible: true },
    { field: fields.username, serverField: 'username', label: 'Organization', visible: true },
    { field: fields.role, serverField: 'role', label: 'Role Type', visible: true },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const getKey = (data) => {
    return ({
        org: data[fields.username],
        username: data[fields.username],
        role: data[fields.role]
    })
}

export const showUsers = (data) => {
    return { method: SHOW_USERS, data: data }
}

export const deleteUser = (data) => {
    let requestData = getKey(data);
    return { method: DELETE_USER, data: requestData, success: `User ${data[fields.username]}` }
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatData(response, body, keys, customData)
}