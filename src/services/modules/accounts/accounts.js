import * as formatter from '../../model/format'
import { endpoint } from '../../../helper/constant'
import { ADMIN_MANAGER } from '../../../helper/constant/perpetual'

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
    { field: fields.locked, serverField: 'Locked', label: 'Locked', sortable: false, visible: true, clickable: true, format: true },
    // { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true },
    { field: fields.role, label: 'Admin Manager', icon: 'admin_manager.svg', detailView: false }
])

export const iconKeys = () => ([
    { field: fields.role, label: 'Admin Manager', icon: 'admin_manager.svg', clicked: false }
])

export const getKey = (data) => {
    return ({
        name: data[fields.username]
    })
}

export const showAccounts = () => {
    return { method: endpoint.SHOW_ACCOUNTS, keys: keys(), iconKeys: iconKeys() }
}

export const deleteAccount = (self, data) => {
    let requestData = getKey(data)
    return { method: endpoint.DELETE_ACCOUNT, data: requestData, success: `Account ${data[fields.username]} deleted successfully` }
}

export const multiDataRequest = (keys, mcList, specific) => {
    let accountDataList = [];
    let userDataList = [];
    for (let i = 0; i < mcList.length; i++) {
        let mc = mcList[i];
        if (mc.response) {
            let method = mc.request.method
            if (method === endpoint.SHOW_USERS) {
                userDataList = mc.response.data;
            }
            if (method === endpoint.SHOW_ACCOUNTS) {
                accountDataList = mc.response.data;
            }
        }
    }
    let dataList = accountDataList.map(account => {
        let user = userDataList.find(user => user[fields.username] === account[fields.username]);
        if (user && user[fields.role] === ADMIN_MANAGER) {
            account[fields.role] = user[fields.role];
        }
        return account
    });
    return dataList;
}
