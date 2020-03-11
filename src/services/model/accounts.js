import * as formatter from './format'
export const SHOW_ACCOUNTS = "ShowAccounts";
export const DELETE_ACCOUNT = "DeleteAccount";

let fields = formatter.fields

export const keys = [
    { field: fields.username, serverField: 'Name', label: 'Username', visible: true },
    { field: fields.email, serverField: 'Email', label: 'Email', visible: true },
    { field: fields.emailVerified, serverField: 'EmailVerified', label: 'Email Verified', visible: true, clickable: true },
    { field: fields.passHash, serverField: 'Passhash', label: 'Passhash' },
    { field: fields.iter, serverField: 'Iter', label: 'Iter' },
    { field: fields.familyName, serverField: 'FamilyName', label: 'Family Name' },
    { field: fields.givenName, serverField: 'GivenName', label: 'GivenName' },
    { field: fields.picture, serverField: 'Picture', label: 'Picture' },
    { field: fields.nickName, serverField: 'Nickname', label: 'Nickname' },
    { field: fields.createdAt, serverField: 'CreatedAt', label: 'Created At' },
    { field: fields.updatedAt, serverField: 'UpdatedAt', label: 'Updated At' },
    { field: fields.locked, serverField: 'Locked', label: 'Locked', visible: true, clickable: true },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
]

export const getKey = (data) => {
    return ({
        name: data[fields.username]
    })
}

export const showAccounts = () => {
    return { method: SHOW_ACCOUNTS }
}

export const deleteAccount = (data) => {
    let requestData = getKey(data)
    return { method: DELETE_ACCOUNT, data: requestData }
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys, customData)
}