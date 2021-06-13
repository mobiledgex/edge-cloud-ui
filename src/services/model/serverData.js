import * as serviceMC from './serviceMC';
import { SHOW_AUDIT_ORG } from '../../helper/constant/endpoint';
import { endpoint } from '../../helper/constant';
import { authSyncRequest, fetchToken, syncRequest } from '../service';

export const responseValid = (mc) => {
    return mc && mc.response && mc.response.status === 200
}

/**
 * orgData : this parameter is useful when we are trying to process multiple 
 *           data and need to access original data for which request was made
 *           because websocket supports multi request response 
 *  **/
export const sendWSRequest = async (self, requestData, callback, orgData) => {
    let token = fetchToken(self)
    if (token) {
        requestData.token = token;
        requestData.orgData = orgData
        serviceMC.sendWSRequest(requestData, callback)
    }
}

/* User Role */
export const showUserRoles = async (self) => {
    let mc = await authSyncRequest(self, { method: endpoint.SHOW_ROLE })
    return mc
}

export const sendVerify = async (self, data) => {
    let mc = await syncRequest(self, { method: endpoint.RESEND_VERIFY, data: data })
    return responseValid(mc)
}

export const verifyEmail = async (self, data) => {
    let mc = await syncRequest(self, { method: endpoint.VERIFY_EMAIL, data: data })
    return mc
}

export const showAuditOrg = async (self, data, showSpinner) => {
    let mc = await authSyncRequest(self, { method: SHOW_AUDIT_ORG, data: data, showSpinner: showSpinner })
    return mc
}

export const settingLock = async (self, data) => {
    let mc = await authSyncRequest(self, { method: endpoint.SETTING_LOCK, data: data })
    return responseValid(mc)
}

export const resetPassword = async (self, data) => {
    let mc = await syncRequest(self, { method: endpoint.RESET_PASSWORD, data: data })
    return mc
}

export const createUser = async (self, data) => {
    let mc = await syncRequest(self, { method: endpoint.CREATE_USER, data: data })
    return mc
}

export const login = async (self, data) => {
    let mc = await syncRequest(self, { method: endpoint.LOGIN, data: data })
    return mc
}

export const resetPasswordRequest = async (self, data) => {
    let mc = await authSyncRequest(self, { method: endpoint.RESET_PASSWORD_REQUEST, data: data })
    return responseValid(mc)
}

