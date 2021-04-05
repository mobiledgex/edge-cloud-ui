import { TYPE_JSON } from '../../constant'
import { INVOICE_BILLING } from './endPointTypes'
import * as formatter from './format'

let fields = formatter.fields

// export const keys = () => ([
//     { field: 'uuid', serverField: 'uid', label: 'ID' },
//     { field: 'number', serverField: 'number', label: 'Number', visible: true },
//     { field: 'issueDate', serverField: 'issue_date', label: 'Issued At', visible: true },
//     { field: 'dueDate', serverField: 'due_date', label: 'Due Date', visible: true },
//     { field: 'firstname', serverField: 'customer#OS#first_name', label: 'First Name' },
//     { field: 'lastname', serverField: 'customer#OS#last_name', label: 'Last Name' },
//     { field: 'name', label: 'Name', visible: true },
//     { field: 'Status', serverField: 'status', label: 'Status', visible: false },
//     { field: 'totalAmount', serverField: 'total_amount', label: 'Total Amount', visible: true },
//     { field: 'dueAmount', serverField: 'due_amount', label: 'Amount Due', visible: true },
//     { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
// ])

export const keys = () => ([
    { field: 'uuid', serverField: 'uid', label: 'ID' },
    { field: 'number', serverField: 'number', label: 'Number', visible: true },
    { field: 'issueDate', serverField: 'issue_date', label: 'Issued At', visible: true },
    { field: 'dueDate', serverField: 'due_date', label: 'Due Date', visible: true },
    { field: 'firstname', serverField: 'customer#OS#first_name', label: 'First Name', detailView: false },
    { field: 'lastname', serverField: 'customer#OS#last_name', label: 'Last Name', detailView: false },
    { field: 'name', label: 'Name', visible: true },
    { field: 'status', serverField: 'status', label: 'Status', visible: false },
    { field: 'collectionMethod', serverField: 'collection_method', label: 'Collection Method', visible: false },
    { field: 'paidAmount', serverField: 'paid_amount', label: 'Paid Amount', visible: false, detailView: false },
    { field: 'discountAmount', serverField: 'discount_amount', label: 'Discount Amount', visible: false, detailView: false },
    { field: 'subtotalAmount', serverField: 'subtotal_amount', label: 'Subtotal Amount', visible: false, detailView: false },
    { field: 'taxAmount', serverField: 'tax_amount', label: 'Tax Amount', visible: false, detailView: false },
    { field: 'totalAmount', serverField: 'total_amount', label: 'Total Amount', visible: true, detailView: false },
    { field: 'dueAmount', serverField: 'due_amount', label: 'Amount Due', visible: true },
    { field: 'items', serverField: 'line_items', label: 'Item', visible: false, dataType: TYPE_JSON, detailView: false },
    { field: 'customer', serverField: 'customer', label: 'Customer', visible: false, dataType: TYPE_JSON, detailView: false },
    { field: 'seller', serverField: 'seller', label: 'Seller', visible: false, dataType: TYPE_JSON, detailView: false },
    { field: fields.actions, label: 'Actions', sortable: false, visible: true, clickable: true }
])

export const showInvoices = (data) => {
    let requestData = { name: data[fields.name] }
    return { method: INVOICE_BILLING, data: requestData, keys: keys() }
}

const formatInvoiceNo = (value)=>{
    let number = value['number']
    let length = number.length - 1
    let prefix = '0'
    prefix = length > 5 ? '' : prefix.repeat(5 - length)
    value['number'] = `#${prefix}${number}`
}

const customData = (value) => {
    value['name'] = `${value['firstname']} ${value['lastname']}`
    formatInvoiceNo(value)
    return value
}

export const getData = (response, body) => {
    return formatter.formatChargifyData(response, body, keys(), customData, true)
}