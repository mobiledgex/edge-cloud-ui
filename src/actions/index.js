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

import * as types from './ActionTypes';
import {TOGGLE_THEME} from "./ActionTypes";


export function viewMode(mode) {
    return {
        type: types.VIEW_MODE,
        mode: mode
    };
}

export function userInfo(data) {
    return {
        type: types.USER_INFO,
        data
    }
}

export function showUserRole(role) {
    return {
        type: types.SHOW_USER_ROLE,
        role
    }
}

export function selectOrganiz(org) {
    return {
        type: types.SELECT_ORG,
        org
    }
}

export function loadingSpinner(loading) {
    return {
        type: types.LOADING_SPINNER,
        loading
    }
}

export const toggleTheme = (themeType) => ({
    type: TOGGLE_THEME,
    themeType
})

export function roleInfo(role) {
    return {
        type: types.ROLE_INFO,
        role
    }
}

export function alertInfo(mode, msg) {
    return {
        type: types.ALERT_INFO,
        mode,
        msg
    }
}

export function regionInfo(data) {
    return {
        type: types.REGION_INFO,
        data
    }
}

/**
 * audit
 * @param data
 * @returns {{data: *, type: string}}
 */
export function showAuditLog(data) {
    return {
        type: types.SHOW_AUDIT,
        data
    }
}

export function userLogout() {
    return {
        type: types.USER_LOGGED_OUT
    }
}

export function privateAccess(isPrivate) {
    return {
        type: types.PRIVATE_ACCESS_EXIST,
        isPrivate
    }
}

export function organizationInfo(data) {
    return {
        type: types.ORGANIZATION_INFO,
        data
    }
}


export function loadMain(data) {
    return {
        type: types.LOAD_MAIN_PAGE,
        data
    }
}