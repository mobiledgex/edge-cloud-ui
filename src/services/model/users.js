import { fields, formatData } from './format'
import * as serverData from './serverData'
import { SHOW_USERS, DELETE_USER, ADD_USER_ROLE } from './endPointTypes'



export const keys = () => ([
    { field: fields.username, serverField: 'username', label: 'Username', sortable: true, visible: true },
    { field: fields.organizationName, serverField: 'org', label: 'Organization', sortable: true, visible: true },
    { field: fields.role, serverField: 'role', label: 'Role Type', sortable: true, visible: true },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
])

export const getKey = (data) => {
    return ({
        org: data[fields.organizationName],
        username: data[fields.username],
        role: data[fields.role]
    })
}

export const showUsers = (data) => {
    return { method: SHOW_USERS, data: data }
}

export const addUser = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: ADD_USER_ROLE, data: requestData }
    return await serverData.sendRequest(self, request)
}

export const deleteUser = (data) => {
    let requestData = getKey(data);
    return { method: DELETE_USER, data: requestData, success: `User ${data[fields.username]}` }
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatData(response, body, keys(), customData)
}