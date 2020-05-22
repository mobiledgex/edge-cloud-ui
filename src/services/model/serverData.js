import * as serviceMC from './serviceMC';

import { SHOW_ROLE, RESEND_VERIFY, SETTING_LOCK, CURRENT_USER, SHOW_CONTROLLER, VERIFY_EMAIL, SHOW_SELF, SHOW_AUDIT_ORG } from './endPointTypes'

const getToken = (self) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    if (store) {
        return store.userToken
    }
    self.props.history.push({
        pathname: '/logout'
    })
}

export const sendRequest = async (self, requestData) => {
    let token = getToken(self)
    if (token) {
        requestData.token = token;
        return await serviceMC.sendSyncRequest(self, requestData)
    }
}
/**
 * orgData : this parameter is useful when we are trying to process multiple 
 *           data and need to access original data for which request was made
 *           because websocket supports multi request response 
 *  **/
export const sendWSRequest = async (self, requestData, callback, orgData) => {
    let token = getToken(self)
    if (token) {
        requestData.token = token;
        requestData.orgData = orgData
        serviceMC.sendWSRequest(requestData, callback)
    }
}

export const sendMultiRequest = (self, requestInfoList, callback) => {
    let token = getToken(self)
    if (token) {
        let requestDataList = [];
        for (let i = 0; i < requestInfoList.length; i++) {
            let requestInfo = requestInfoList[i];
            requestInfo.token = getToken(self);
            requestDataList.push(requestInfo)
        }
        serviceMC.sendMultiRequest(self, requestDataList, callback)
    }
}

export const showDataFromServer = async (self, requestData) => {
    let dataList = []
    let token = getToken(self)
    if (token) {
        requestData.token = token;
        let mcRequest = await serviceMC.sendSyncRequest(self, requestData)
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            dataList = mcRequest.response.data;
        }
    }
    return dataList;
}

export const showMultiDataFromServer = (self, requestType, filter, callback) => {
    let token = getToken(self)
    if (token) {
        let requestDataList = [];
        for (let i = 0; i < requestType.length; i++) {
            let request = requestType[i](Object.assign({}, filter))
            if (request) {
                request.token = token;
                requestDataList.push(request);
            }
        }
        serviceMC.sendMultiRequest(self, requestDataList, callback)
    }
}

/* User Role */
export const showUserRoles = async (self) => {
    let mcRequest = await sendRequest(self, { method: SHOW_ROLE })
    return mcRequest
}

export const sendVerify = async (self, data) => {
    let valid = false;
    let mcRequest = await sendRequest(self, { method: RESEND_VERIFY, data: data })
    if (mcRequest && mcRequest.response) {
        let response = mcRequest.response;
        valid = response.status === 200 ? true : false
    }
    return valid
}

export const currentUser = async (self) => {
    let mcRequest = await sendRequest(self, { method: CURRENT_USER })
    return mcRequest
}

export const controllers = async (self) => {
    let mcRequest = await sendRequest(self, { method: SHOW_CONTROLLER })
    return mcRequest
}

export const verifyEmail = async (self) => {
    let mcRequest = await sendRequest(self, { method: VERIFY_EMAIL })
    return mcRequest
}

export const showSelf = async (self, data) => {
    let mcRequest = await sendRequest(self, { method: SHOW_SELF, data: data })
    return mcRequest
}

export const showAuditOrg = async (self, data) => {
    let mcRequest = await sendRequest(self, { method: SHOW_AUDIT_ORG, data: data })
    return mcRequest
}

export const settingLock = async (self, data) => {
    let valid = false;
    let mcRequest = await sendRequest(self, { method: SETTING_LOCK, data: data })
    if (mcRequest && mcRequest.response) {
        let response = mcRequest.response;
        valid = response.status === 200 ? true : false
    }
    return valid

}

