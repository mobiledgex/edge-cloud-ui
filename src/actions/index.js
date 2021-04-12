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

export function changeLoginMode(mode) {
    return {
        type: types.LOGIN_MODE,
        mode
    }
}

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

export function createAccount(created) {
    return {
        type: types.CREATE_ACCOUNT,
        created
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