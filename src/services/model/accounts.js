import * as formatter from './format'
import { endpoint } from '../../helper/constant'

let fields = formatter.fields

export const keys = () => ([
    { field: fields.username, serverField: 'Name', sortable: true, label: 'Username', visible: true, filter: true },
    { field: fields.email, serverField: 'Email', sortable: true, label: 'Email', visible: true, filter: true },
    { field: fields.emailVerified, serverField: 'EmailVerified', sortable: true, label: 'Email Verified', visible: true, clickable: true, format: true },
    { field: fields.passHash, serverField: 'Passhash', label: 'Passhash' },
    { field: fields.iter, serverField: 'Iter', label: 'Iter' },
    { field: fields.familyName, serverField: 'FamilyName', label: 'Family Name' },
    { field: fields.givenName, serverField: 'GivenName', label: 'GivenName' },
    { field: fields.picture, serverField: 'Picture', label: 'Picture' },
    { field: fields.nickName, serverField: 'Nickname', label: 'Nickname' },
    { field: fields.createdAt, serverField: 'CreatedAt', label: 'Created At' },
    { field: fields.updatedAt, serverField: 'UpdatedAt', label: 'Updated At' },
    { field: fields.locked, serverField: 'Locked', label: 'Locked', sortable: true, visible: true, clickable: true, format: true },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
])

export const getKey = (data) => {
    return ({
        name: data[fields.username]
    })
}

export const showAccounts = () => {
    return { method: endpoint.SHOW_ACCOUNTS, keys:keys() }
}

export const deleteAccount = (self, data) => {
    let requestData = getKey(data)
    return { method: endpoint.DELETE_ACCOUNT, data: requestData, success: `Account ${data[fields.username]} deleted successfully` }
}