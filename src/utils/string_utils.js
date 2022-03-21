export const toFirstUpperCase = (data) => {
    if (data) {
        return data.charAt(0).toUpperCase() + data.slice(1)
    }
}

export const splitByCaps = (data)=>{
    return data.match(/[A-Z][a-z]+|[0-9]+/g).join(" ")
}

export const appendSpaceToLetter = (data)=>{
    return data.replace(/[A-Za-z]/g, '$& ')
}

