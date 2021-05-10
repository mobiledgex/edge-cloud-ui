import { SHOW_BILLING_ORG, CREATE_BILLING_ORG, DELETE_BILLING_ORG, BILLING_ORG_ADD_CHILD, BILLING_ORG_REMOVE_CHILD } from './endPointTypes'
import * as serverData from './serverData'
import * as formatter from './format'
import { ADMIN_MANAGER, OPERATOR_MANAGER, OPERATOR_CONTRIBUTOR, TYPE_DATE } from '../../constant'
import { FORMAT_FULL_DATE_TIME } from '../../utils/date_util'


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
        { field: fields.createdAt, serverField: 'created_at', label: 'Created', dataType: TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
        { field: fields.updatedAt, serverField: 'updated_at', label: 'Updated', dataType: TYPE_DATE, date: { format: FORMAT_FULL_DATE_TIME, dataFormat: 'seconds' } },
        { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true, roles: [ADMIN_MANAGER, OPERATOR_MANAGER, OPERATOR_CONTRIBUTOR] }
    ]
)

const getRequestData = (data, edit) => {
    let billingOrg = {}
    billingOrg.name = data[fields.organizationName] ? data[fields.organizationName] : data[fields.name]
    if (edit) {
        billingOrg.type = data[fields.type].toLowerCase()
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
        if (data[fields.postalcode]) {
            billingOrg.postalcode = data[fields.postalcode]
        }
        if (data[fields.phone]) {
            billingOrg.phone = data[fields.phone]
        }
    }
    return billingOrg
}

export const showBillingOrg = (self, data) => {
    return { method: SHOW_BILLING_ORG, data }
}

export const createBillingOrg = async (self, data) => {
    let requestData = getRequestData(data, true)
    let request = { method: CREATE_BILLING_ORG, data: requestData }
    return await serverData.sendRequest(self, request)
}

export const deleteBillingOrg = (self, data) => {
    let requestData = getRequestData(data)
    return { method: DELETE_BILLING_ORG, data: requestData, success: `Billing Org ${data[fields.name]} deleted successfully` }
}

export const addBillingChild = (data) => {
    return { method: BILLING_ORG_ADD_CHILD, data }
}

export const removeBillingChild = (data) => {
    return { method: BILLING_ORG_REMOVE_CHILD, data }
}

const customData = (value) => {
    return value
}

export const getData = (response, body) => {
    return formatter.formatData(response, body, keys(), customData)
}
