import * as formatter from './format'
import * as serverData from './serverData'
import * as constant from '../../constant'
import { SHOW_ORG, CREATE_ORG, UPDATE_ORG, DELETE_ORG } from './endPointTypes'

let fields = formatter.fields;

export const keys = () => ([
    { field: fields.organizationName, serverField: 'Name', label: 'Organization', sortable: true, visible: true, filter:true },
    { field: fields.type, serverField: 'Type', label: 'Type', sortable: true, visible: true, filter:true, group: true},
    { field: fields.phone, serverField: 'Phone', label: 'Phone', sortable: true, visible: true },
    { field: fields.address, serverField: 'Address', label: 'Address', sortable: true, visible: true },
    { field: fields.publicImages, serverField: 'PublicImages', label: 'Public Image', sortable: true, visible: true},
    { field: fields.userList, label: 'User List', sortable: true, visible: false,
        keys: [{ field: fields.username, label: 'Username' }, { field: fields.userRole, label: 'Role' }]},
    { field: 'manage', label: 'Manage', visible: false, clickable: true },
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

export const showOrganizations = (data) => {
    return { method: SHOW_ORG, data: data }
}

export const getOrganizationList = async (self, data) => {
    let dataList = []
    if (formatter.getOrganization()) {
        let organization = {}
        organization[fields.organizationName] = formatter.getOrganization();
        dataList = [organization]
    }
    else {
        dataList = await serverData.showDataFromServer(self, showOrganizations(data))
    }
    return dataList;
}

export const createOrganization = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: CREATE_ORG, data: requestData }
    return await serverData.sendRequest(self, request)
}

export const updateOrganization = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: UPDATE_ORG, data: requestData }
    return await serverData.sendRequest(self, request)
}

export const deleteOrganization = (data) => {
    let requestData = getKey(data);
    return { method: DELETE_ORG, data: requestData, success: `Organization ${data[fields.organizationName]} deleted successfully` }
}

const customData = (value) => {
    value[fields.publicImages] = value[fields.publicImages] ? constant.YES : constant.NO
    return value
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys(), customData)
}
