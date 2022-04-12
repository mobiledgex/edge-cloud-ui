/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { timezoneName } from './date_util'
import { getUserMetaData, orgUserMetaDataLS } from '../helper/ls'
import { PREF_MONITORING } from '../pages/main/userSetting/preferences/Preferences'

export const PREF_TIMEZONE = 'Timezone'
export const PREF_MAP = 'Map'
export const PREF_LOGS = 'Logs'
export const PREF_M_REGION = 'MRegion'
export const PREF_M_CLOUDLET_VISIBILITY = 'MCloudletVisibility'
export const PREF_M_CLUSTER_VISIBILITY = 'MClusterVisibility'
export const PREF_M_APP_VISIBILITY = 'MAppVisibility'
export const PREF_PREFIX_SEARCH = 'PrefixSearch'

export const timezonePref = () => {
    let data = getUserMetaData()
    return data[PREF_TIMEZONE] ?? timezoneName()
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

export const showLogsPref = () => {
    let data = getUserMetaData()
    return data[PREF_LOGS] !== undefined ? data[PREF_LOGS] : true
}
