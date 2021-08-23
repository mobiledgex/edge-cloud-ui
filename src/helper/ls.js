import {redux_org} from '../helper/reduxData'
import { perpetual } from './constant'

export const getUserMetaData = () => {
    let data = localStorage.getItem(perpetual.LS_USER_META_DATA)
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

export const storeObject = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value))
}

export const fetchObject = (key) => {
    let data = undefined
    try {
        data = JSON.parse(localStorage.getItem(key))
    }
    catch (e) {
        data = undefined
    }
    return data
}

export const removeObject = (key) => {
    localStorage.removeItem(key)
}