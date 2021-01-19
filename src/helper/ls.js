import { getOrganization, isAdmin } from "../services/model/format"

export const LS_USER_META_DATA = 'usermetadata'

export const getUserMetaData = () => {
    let data = localStorage.getItem(LS_USER_META_DATA)
    data = data ? JSON.parse(data) : {}
    return data
}

export const orgUserMetaDataLS = () => {
    let data = {}
    if (isAdmin()) {
        data = getUserMetaData()
    }
    else if (getOrganization()) {
        data = getUserMetaData()
        return data[getOrganization()] ? data[getOrganization()] : {}
    }
    return data
}