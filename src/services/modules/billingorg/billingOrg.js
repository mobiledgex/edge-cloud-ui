import * as formatter from '../../fields'
import { FORMAT_FULL_DATE_TIME } from '../../../utils/date_util'
import { endpoint, perpetual } from '../../../helper/constant'
import { authSyncRequest } from '../../service'

let localFields = formatter.localFields

export const keys = () => (
    [
        { field: localFields.name, serverField: 'Name', label: 'Name', visible: true, filter: true },
        { field: localFields.type, serverField: 'Type', label: 'Type', sortable: true, visible: true, filter: true },
        { field: localFields.firstName, serverField: 'FirstName', label: 'First Name', sortable: true, visible: true, filter: true },
        { field: localFields.lastName, serverField: 'LastName', label: 'Last Name', sortable: true, visible: true, filter: true },
        { field: localFields.email, serverField: 'Email', label: 'Email', sortable: true, visible: true, filter: true },
        { field: localFields.address, serverField: 'Address', label: 'Address', sortable: true, visible: false, filter: false },
        { field: localFields.city, serverField: 'City', label: 'City', sortable: true, visible: false, filter: false },
        { field: localFields.country, serverField: 'Country', label: 'Country', sortable: true, visible: false, filter: false },
        { field: localFields.state, serverField: 'State', label: 'State', sortable: true, visible: false },
        { field: localFields.postalCode, serverField: 'PostalCode', label: 'Postal Code', sortable: true, visible: false },
        { field: localFields.phone, serverField: 'Phone', label: 'Phone', sortable: true, visible: false },
        { field: localFields.children, serverField: 'Children', label: 'Children', sortable: true, visible: false },
        { field: localFields.createdAt, serverField: 'CreatedAt', label: 'Created', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } },
        { field: localFields.updatedAt, serverField: 'UpdatedAt', label: 'Updated', dataType: perpetual.TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME } }
    ]
)

const getRequestData = (data, edit, isAdd) => {
    let billingOrg = {}
    billingOrg.name = data[localFields.organizationName] ? data[localFields.organizationName] : data[localFields.name]
    if (edit) {
        if (isAdd) {
            billingOrg.type = data[localFields.type]
        }
        billingOrg.firstname = data[localFields.firstName]
        billingOrg.lastname = data[localFields.lastName]

        if (data[localFields.email]) {
            billingOrg.email = data[localFields.email]
        }
        if (data[localFields.address]) {
            billingOrg.address = data[localFields.address]
        }
        if (data[localFields.country]) {
            billingOrg.country = data[localFields.country]
        }
        if (data[localFields.state]) {
            billingOrg.state = data[localFields.state]
        }
        if (data[localFields.city]) {
            billingOrg.city = data[localFields.city]
        }
        if (data[localFields.postalCode]) {
            billingOrg.postalcode = data[localFields.postalCode]
        }
        if (data[localFields.phone]) {
            billingOrg.phone = data[localFields.phone]
        }
    }
    return billingOrg
}

export const showBillingOrg = (self, data) => {
    return { method: endpoint.SHOW_BILLING_ORG, data, keys: keys() }
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
    return { method: endpoint.DELETE_BILLING_ORG, data: requestData, success: `Billing Org ${data[localFields.name]} deleted successfully` }
}

export const addBillingChild = (data) => {
    return { method: endpoint.BILLING_ORG_ADD_CHILD, data }
}

export const removeBillingChild = (data) => {
    return { method: endpoint.BILLING_ORG_REMOVE_CHILD, data }
}