import {fields, formatData} from './format'

const keys = [
    { field: fields.organizationName, serverField: 'org' },
    { field: fields.username, serverField: 'username' },
    { field: fields.role, serverField: 'role' },
]

export const getKey = (data) => {
    let userArr = [];
    Object.values(data).map((item) => { userArr.push(item); })
    return ({
        org: data[fields.organizationName],
        username: data[fields.username],
        role: data[fields.role]
    })
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatData(response, body, keys, customData)
}