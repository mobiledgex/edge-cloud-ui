import {fields, formatData} from './format'

export const keys = [
    { field: fields.organizationName, serverField: 'Name', label: 'Organization', sortable: true, visible: true },
    { field: fields.type, serverField: 'Type', label: 'Type', sortable: true, visible: true },
    { field: fields.phone, serverField: 'Phone', label: 'Phone', sortable: false, visible: true },
    { field: fields.address, serverField: 'Address', label: 'Address', sortable: false, visible: true },
    { field: 'actions', label: 'Actions', sortable: false, visible: true }
]

export const getKey = (data) => {
    return ({
        name: data[fields.organizationName],
        type: data[fields.type],
        address: data[fields.address],
        phone: data[fields.phone]
    })
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatData(response, body, keys, customData)
}