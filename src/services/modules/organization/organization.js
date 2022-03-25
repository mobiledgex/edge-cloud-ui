import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { redux_org } from '../../../helper/reduxData'
import { perpetual } from '../../../helper/constant'
import { endpoint } from '../..';
import { localFields } from '../../fields';

export const keys = (nameOnly) => {
    let items = [{ field: localFields.organizationName, serverField: 'Name', label: 'Organization', sortable: true, visible: true, filter: true }]
    if (!nameOnly) {
        items = [...items,
            { field: localFields.type, serverField: 'Type', label: 'Type', sortable: true, visible: true, format: true },
            { field: localFields.role, label: 'Role Type', sortable: true, visible: true, filter: true, group: true, format: true },
            { field: localFields.phone, serverField: 'Phone', label: 'Phone', sortable: true, visible: true },
            { field: localFields.address, serverField: 'Address', label: 'Address' },
            { field: localFields.edgeboxOnly, serverField: 'EdgeboxOnly', label: 'Edgebox Only', roles: [perpetual.ADMIN_MANAGER], format: true },
            { field: localFields.publicImages, serverField: 'PublicImages', label: 'Public Image', sortable: true, visible: true },
        {
            field: localFields.userList, label: 'User List', sortable: true, visible: false,
            keys: [{ field: localFields.username, label: 'Username' }, { field: localFields.userRole, label: 'Role' }]
        },
        { field: localFields.manage, label: 'Manage', visible: true, clickable: true, format: true }
        ]
    }
    return items
}

export const iconKeys = () => ([
    { field: localFields.edgeboxOnly, label: 'Edgebox Only', icon: 'edgeboxonly.svg', clicked: false, count: 0, roles: [perpetual.ADMIN_MANAGER] },
])

export const getKey = (data, isCreate) => {
    let requestData = {
        name: data[localFields.organizationName],
        type: data[localFields.type],
        address: data[localFields.address],
        phone: data[localFields.phone]
    }
    if (isCreate) {
        requestData.publicImages = data[localFields.publicImages]
    }
    return (requestData)
}

export const showOrganizations = (self, data, nameOnly = false) => {
    return { method: endpoint.SHOW_ORG, data, keys: keys(nameOnly) }
}

export const getOrganizationList = async (self, data) => {
    let dataList = []
    let org = redux_org.nonAdminOrg(self)
    if (org) {
        let organization = {}
        organization[localFields.organizationName] = org;
        dataList = [organization]
    }
    else {
        dataList = await showAuthSyncRequest(self, showOrganizations(self, data))
    }
    return dataList;
}

export const createOrganization = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.CREATE_ORG, data: requestData }
    return await authSyncRequest(self, request)
}

export const updateOrganization = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.UPDATE_ORG, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteOrganization = (self, data) => {
    let requestData = getKey(data);
    return { method: endpoint.DELETE_ORG, data: requestData, success: `Organization ${data[localFields.organizationName]} deleted successfully` }
}

export const edgeboxOnlyAPI = (data) => {
    let requestData = {
        edgeboxonly: data[localFields.edgeboxOnly] ? false : true,
        name: data[localFields.organizationName]
    }
    return { method: endpoint.EDGEBOX_ONLY, data: requestData }
}

export const multiDataRequest = (keys, mcList) => {
    let orgDataList = [];
    let userDataList = [];
    let currentUser = undefined;
    for (const mc of mcList) {
        let request = mc.request;
        if (request.method === endpoint.SHOW_USERS) {
            userDataList = mc.response.data
        }
        else if (request.method === endpoint.SHOW_ORG) {
            orgDataList = mc.response.data
        }
        else if (request.method === endpoint.CURRENT_USER) {
            currentUser = mc.response.data
        }
    }
    let dataList = orgDataList
    dataList = orgDataList.map(org => {
        let user = userDataList.find(user => user[localFields.username] === currentUser?.Name && user[localFields.organizationName] === org[localFields.organizationName]);
        if (user) {
            org[localFields.role] = user[localFields.role];
        }
        return org
    });
    return dataList;
}