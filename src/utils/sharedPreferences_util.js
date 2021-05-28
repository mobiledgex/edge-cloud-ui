import {timezoneName } from './date_util'
import { getUserMetaData, orgUserMetaDataLS } from '../helper/ls'
import { PREF_MONITORING } from '../pages/main/userSetting/preferences/preferences'

export const PREF_TIMEZONE = 'Timezone'
export const PREF_MAP = 'Map'
export const PREF_M_REGION = 'MRegion'
export const PREF_M_CLOUDLET_VISIBILITY = 'MCloudletVisibility'
export const PREF_M_CLUSTER_VISIBILITY = 'MClusterVisibility'
export const PREF_M_APP_VISIBILITY = 'MAppVisibility'
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

export const monitoringPref = (self, type) => {
    let data = orgUserMetaDataLS(self)
    return data[PREF_MONITORING] ? data[PREF_MONITORING][type] : undefined
}