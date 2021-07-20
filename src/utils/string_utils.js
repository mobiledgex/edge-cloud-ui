export const toFirstUpperCase = (data) => {
    if (data) {
        return data.charAt(0).toUpperCase() + data.slice(1)
    }
}

export const onlyNumeric = (data) => {
    if (data) {
        return data.replace(/\D+/g, '')
    }
}

