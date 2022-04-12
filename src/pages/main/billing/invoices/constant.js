/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const itemKeys = [
    { label: 'Item', serverField: 'title', visible: true, sub: 4 },
    { label: 'Quantity', serverField: 'quantity', visible: true },
    { field: 'unitPrice', label: 'Unit Price', serverField: 'unit_price', visible: true, custom: true },
    { field: 'amount', label: 'Amount', serverField: 'total_amount', visible: true, custom: true },
    { label: 'Description', serverField: 'description', visible: false },
    { label: 'Component Id', serverField: 'component_id', visible: false },
    { label: 'Discount Amount', serverField: 'discount_amount', visible: false },
    { label: 'Period Range End', serverField: 'period_range_end', visible: false },
    { label: 'Period Range Start', serverField: 'period_range_start', visible: false },
    { label: 'Price Point Id', serverField: 'price_point_id', visible: false },
    { label: 'Product ID', serverField: 'product_id', visible: false },
    { label: 'Product Price Point ID', serverField: 'product_price_point_id', visible: false },
    { label: 'Product Version', serverField: 'product_version', visible: false },
    { label: 'Subtotal Amount', serverField: 'subtotal_amount', visible: false },
    { label: 'Tax Amount', serverField: 'tax_amount', visible: false },
    { label: 'Tiered Unit Price', serverField: 'tiered_unit_price', visible: false },
    { label: 'UID', serverField: 'uid', visible: false },
]

export const amountSummary = [
    { label: 'Subtotal', field: 'subtotalAmount' },
    { label: 'Discounts', field: 'discountAmount' },
    { label: 'Tax', field: 'taxAmount' },
    { label: 'Total', field: 'totalAmount' },
]

export const invoiceInfo = [
    { label: 'Invoice', header: true },
    { label: 'Invoice Number', field: 'number' },
    { label: 'Issue Date', field: 'issueDate' },
    { label: 'Due Date', field: 'dueDate' }
]

export const customerInfo = [
    { label: 'Bill To', header: true },
    { label: 'Name', field: 'first_name', custom: true },
    { label: 'Organization', field: 'organization' },
    { label: 'Email', field: 'email' }
]

export const cutomizeData = (key, data) => {
    if (key.field === 'first_name') {
        return `${data['first_name']} ${data['last_name']}`
    }
    else if (key.field === 'unitPrice' || key.field === 'amount') {
        return `$${data[key.serverField]}`
    }
}

export const statusAmount = (data) => {
    let amount = 0.0
    switch (data['status']) {
        case 'open':
            amount = data['dueAmount']
            break;
        case 'paid':
            amount = data['paidAmount']
            break;
        case 'canceled':
            amount = data['totalAmount']
            break;
    }
    return `$${amount} USD`
}