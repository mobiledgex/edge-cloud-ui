import { getOrganization, isAdmin } from "../services/model/format"

export const LS_USER_META_DATA = 'usermetadata'
export const LS_ORGANIZATION_INFO = 'organizationInfo'

export const getUserMetaData = () => {
    let data = localStorage.getItem(LS_USER_META_DATA)
    try {
        data = data ? JSON.parse(data) : {}
    }
    catch (e) {
        data = {}
    }
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

export const organizationInfo = () => {
    try {
        return JSON.parse(localStorage.getItem(LS_ORGANIZATION_INFO))
    }
    catch (e) {

    }
}