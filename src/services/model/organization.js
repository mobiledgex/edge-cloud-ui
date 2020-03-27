import * as formatter from './format'
import * as serverData from './serverData'
import { SHOW_ORG, CREATE_ORG, DELETE_ORG } from './endPointTypes'

let fields = formatter.fields;

export const keys = () => ([
    { field: fields.organizationName, serverField: 'Name', label: 'Organization', sortable: true, visible: true },
    { field: fields.type, serverField: 'Type', label: 'Type', sortable: true, visible: true },
    { field: fields.phone, serverField: 'Phone', label: 'Phone', sortable: true, visible: true },
    { field: fields.address, serverField: 'Address', label: 'Address', sortable: true, visible: true },
    { field: 'manage', label: 'Manage', visible: false, clickable: true },
    { field: fields.actions, label: 'Actions', visible: true, clickable: true }
])

export const getKey = (data) => {
    if (data) {
        return ({
            name: data[fields.organizationName],
            type: data[fields.type],
            address: data[fields.address],
            phone: data[fields.phone]
        })
    }
    return {}
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

export const deleteOrganization = (data) => {
    let requestData = getKey(data);
    return { method: DELETE_ORG, data: requestData, success: `Organization ${data[fields.organizationName]}` }
}

const customData = (value) => {
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys(), customData)
}