import {redux_org} from '../helper/reduxData'

export const LS_USER_META_DATA = 'usermetadata'
export const LS_ORGANIZATION_INFO = 'organizationInfo'
export const LS_REGIONS = 'regions'

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

export const orgUserMetaDataLS = (self) => {
    let data = {}
    let org = redux_org.nonAdminOrg(self)
    if (redux_org.isAdmin(self)) {
        data = getUserMetaData()
    }
    else if (org) {
        data = getUserMetaData()
        return data[org] ? data[org] : {}
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