import {fields, formatData} from './format'

const keys = [
    { field: fields.type, serverField: 'Type' },
    { field: fields.organizationName, serverField: 'Name' },
    { field: fields.address, serverField: 'Address' },
    { field: fields.phone, serverField: 'Phone' },
]

export const getKey = (data) => {
    return ({
        name: data[fields.organizationName],
        type: data[fields.type],
        address: data[fields.address],
        phone: data[fields.phone]
    })
}

export const getData = (response, body) => {
    return formatData(response, body, keys)
}