import * as formatter from '../../model/format'
import { authSyncRequest, showAuthSyncRequest } from '../../service';
import { redux_org } from '../../../helper/reduxData'
import { endpoint, perpetual } from '../../../helper/constant'

let fields = formatter.fields;

export const keys = () => ([
    { field: fields.organizationName, serverField: 'Name', label: 'Organization', sortable: true, visible: true, filter: true },
    { field: fields.type, serverField: 'Type', label: 'Type', sortable: true, visible: true, filter: true, group: true },
    { field: fields.phone, serverField: 'Phone', label: 'Phone', sortable: true, visible: true },
    { field: fields.address, serverField: 'Address', label: 'Address', sortable: true, visible: true },
    { field: fields.edgeboxOnly, serverField: 'EdgeboxOnly', label: 'Edgebox Only', visible: true, roles: [perpetual.ADMIN_MANAGER], format: true },
    { field: fields.publicImages, serverField: 'PublicImages', label: 'Public Image', sortable: true, visible: true },
    {
        field: fields.userList, label: 'User List', sortable: true, visible: false,
        keys: [{ field: fields.username, label: 'Username' }, { field: fields.userRole, label: 'Role' }]
    },
    { field: fields.manage, label: 'Manage', visible: false, clickable: true, format: true },
    { field: fields.actions, label: 'Actions', visible: true, clickable: true }
])

export const getKey = (data, isCreate) => {
    let requestData = {
        name: data[fields.organizationName],
        type: data[fields.type],
        address: data[fields.address],
        phone: data[fields.phone]
    }
    if (isCreate) {
        requestData.publicImages = data[fields.publicImages]
    }
    return (requestData)
}

export const showOrganizations = (self, data) => {
    return { method: endpoint.SHOW_ORG, data: data, keys: keys() }
}

export const getOrganizationList = async (self, data) => {
    let dataList = []
    let org = redux_org.nonAdminOrg(self)
    if (org) {
        let organization = {}
        organization[fields.organizationName] = org;
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
    return { method: endpoint.DELETE_ORG, data: requestData, success: `Organization ${data[fields.organizationName]} deleted successfully` }
}

export const edgeboxOnlyAPI = (data) => {
    let requestData = {
        edgeboxonly: data[fields.edgeboxOnly] ? false : true,
        name: data[fields.organizationName]
    }
    return { method: endpoint.EDGEBOX_ONLY, data: requestData }
}