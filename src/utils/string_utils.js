export const toFirstUpperCase = (data) => {
    if (data) {
        return data.charAt(0).toUpperCase() + data.slice(1)
    }
}

