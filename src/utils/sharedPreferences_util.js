import {timezoneName } from './date_util'
import { getUserMetaData } from '../helper/ls'

export const PREF_TIMEZONE = 'Timezone'
export const PREF_MAP = 'Map'
export const PREF_PREFIX_SEARCH = 'PrefixSearch'

export const timezonePref = () => {
    let data = getUserMetaData()
    return data[PREF_TIMEZONE] ? data[PREF_TIMEZONE] : timezoneName()
}

export const showMapPref = () => {
    let data = getUserMetaData()
    return data[PREF_MAP] !== undefined ? data[PREF_MAP] : true
}

export const prefixSearchPref = () => {
    let data = getUserMetaData()
    return data[PREF_PREFIX_SEARCH] ? data[PREF_PREFIX_SEARCH].toLowerCase() : ''
}