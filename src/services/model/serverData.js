import * as serviceMC from './serviceMC';
import { CREATE_USER, LOGIN, RESEND_VERIFY, RESET_PASSWORD_REQUEST, SETTING_LOCK, SHOW_AUDIT_ORG, SHOW_ROLE, VERIFY_EMAIL } from '../../helper/constant/endpoint';
import { authSyncRequest, fetchWSToken, responseValid, syncRequest } from '../service';

/**
 * orgData : this parameter is useful when we are trying to process multiple 
 *           data and need to access original data for which request was made
 *           because websocket supports multi request response 
 *  **/
export const sendWSRequest = async (self, requestData, callback, orgData) => {
    let token = await fetchWSToken(self)
    if (token) {
        requestData.token = token;
        requestData.orgData = orgData
        serviceMC.sendWSRequest(requestData, callback)
    }
}

/* User Role */
export const showUserRoles = async (self) => {
    let mc = await authSyncRequest(self, { method: SHOW_ROLE })
    return mc
}

export const sendVerify = async (self, data) => {
    let mc = await syncRequest(self, { method: RESEND_VERIFY, data: data })
    return responseValid(mc)
}

export const verifyEmail = async (self, data) => {
    let mc = await syncRequest(self, { method: VERIFY_EMAIL, data: data })
    return mc
}

export const showAuditOrg = async (self, data, showSpinner) => {
    let mc = await authSyncRequest(self, { method: SHOW_AUDIT_ORG, data: data, showSpinner: showSpinner })
    return mc
}

export const settingLock = async (self, data) => {
    let mc = await authSyncRequest(self, { method: SETTING_LOCK, data: data })
    return responseValid(mc)
}

export const createUser = async (self, data) => {
    let mc = await syncRequest(self, { method: CREATE_USER, data: data })
    return mc
}

export const login = async (self, data) => {
    let mc = await syncRequest(self, { method: LOGIN, data: data })
    return mc
}

export const resetPasswordRequest = async (self, data) => {
    let mc = await syncRequest(self, { method: RESET_PASSWORD_REQUEST, data: data })
    return responseValid(mc)
}

