import * as formatter from './format'
import { ADMIN_MANAGER, TYPE_DATE, DEVELOPER_MANAGER } from '../../constant'
import { FORMAT_FULL_DATE_TIME } from '../../utils/date_util'
import { endpoint } from '../../helper/constant'
import { authSyncRequest } from '../service'


let fields = formatter.fields

export const keys = () => (
    [
        { field: fields.name, serverField: 'Name', label: 'Name', visible: true, filter: true },
        { field: fields.type, serverField: 'Type', label: 'Type', sortable: true, visible: true, filter: true },
        { field: fields.firstName, serverField: 'FirstName', label: 'First Name', sortable: true, visible: true, filter: true },
        { field: fields.lastName, serverField: 'LastName', label: 'Last Name', sortable: true, visible: true, filter: true },
        { field: fields.email, serverField: 'Email', label: 'Email', sortable: true, visible: true, filter: true },
        { field: fields.address, serverField: 'Address', label: 'Address', sortable: true, visible: false, filter: false },
        { field: fields.city, serverField: 'City', label: 'City', sortable: true, visible: false, filter: false },
        { field: fields.country, serverField: 'Country', label: 'Country', sortable: true, visible: false, filter: false },
        { field: fields.state, serverField: 'State', label: 'State', sortable: true, visible: false },
        { field: fields.postalCode, serverField: 'PostalCode', label: 'Postal Code', sortable: true, visible: false },
        { field: fields.phone, serverField: 'Phone', label: 'Phone', sortable: true, visible: false },
        { field: fields.children, serverField: 'Children', label: 'Children', sortable: true, visible: false },
        { field: fields.createdAt, serverField: 'CreatedAt', label: 'Created', dataType: TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
        { field: fields.updatedAt, serverField: 'UpdatedAt', label: 'Updated', dataType: TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
        { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true, roles: [ADMIN_MANAGER, DEVELOPER_MANAGER ] }
    ]
)

const getRequestData = (data, edit, isAdd) => {
    let billingOrg = {}
    billingOrg.name = data[fields.organizationName] ? data[fields.organizationName] : data[fields.name]
    if (edit) {
        if (isAdd) {
            billingOrg.type = data[fields.type]
        }
        billingOrg.firstname = data[fields.firstName]
        billingOrg.lastname = data[fields.lastName]

        if (data[fields.email]) {
            billingOrg.email = data[fields.email]
        }
        if (data[fields.address]) {
            billingOrg.address = data[fields.address]
        }
        if (data[fields.country]) {
            billingOrg.country = data[fields.country]
        }
        if (data[fields.state]) {
            billingOrg.state = data[fields.state]
        }
        if (data[fields.city]) {
            billingOrg.city = data[fields.city]
        }
        if (data[fields.postalCode]) {
            billingOrg.postalcode = data[fields.postalCode]
        }
        if (data[fields.phone]) {
            billingOrg.phone = data[fields.phone]
        }
    }
    return billingOrg
}

export const showBillingOrg = (self, data) => {
    return { method: endpoint.SHOW_BILLING_ORG, data }
}

export const createBillingOrg = async (self, data) => {
    let requestData = getRequestData(data, true, true)
    let request = { method: endpoint.CREATE_BILLING_ORG, data: requestData }
    return await authSyncRequest(self, request)
}

export const updateBillingOrg = async (self, data) => {
    let requestData = getRequestData(data, true)
    let request = { method: endpoint.UPDATE_BILLING_ORG, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteBillingOrg = (self, data) => {
    let requestData = getRequestData(data)
    return { method: endpoint.DELETE_BILLING_ORG, data: requestData, success: `Billing Org ${data[fields.name]} deleted successfully` }
}

export const addBillingChild = (data) => {
    return { method: endpoint.BILLING_ORG_ADD_CHILD, data }
}

export const removeBillingChild = (data) => {
    return { method: endpoint.BILLING_ORG_REMOVE_CHILD, data }
}