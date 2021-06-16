const formatInvoiceNo = (value) => {
    let number = value['number']
    let length = number.length - 1
    let prefix = '0'
    prefix = length > 5 ? '' : prefix.repeat(5 - length)
    value['number'] = `#${prefix}${number}`
}

export const customize = (request, value) => {
    value['name'] = `${value['firstname']} ${value['lastname']}`
    formatInvoiceNo(value)
    return value
}