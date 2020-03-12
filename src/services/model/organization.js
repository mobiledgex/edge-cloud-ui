import { fields, formatData } from './format'
import { SHOW_ORG, DELETE_ORG } from './endPointTypes'


export const keys = [
    { field: fields.organizationName, serverField: 'Name', label: 'Organization', sortable: true, visible: true },
    { field: fields.type, serverField: 'Type', label: 'Type', sortable: true, visible: true },
    { field: fields.phone, serverField: 'Phone', label: 'Phone', sortable: false, visible: true },
    { field: fields.address, serverField: 'Address', label: 'Address', sortable: false, visible: true },
    { field: 'manage', label: 'Manage', sortable: false, visible: false, clickable: true},
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const getKey = (data) => {
    return ({
        name: data[fields.organizationName],
        type: data[fields.type],
        address: data[fields.address],
        phone: data[fields.phone]
    })
}

export const showOrganizations = (data) => {
    return { method: SHOW_ORG, data: data }
}

export const deleteOrganization = (data) => {
    let requestData = getKey(data);
    return { method: DELETE_ORG, data: requestData, success: `Organization ${data[fields.organizationName]}` }
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatData(response, body, keys, customData)
}