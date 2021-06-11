import * as serviceMC from './serviceMC';
import { SHOW_AUDIT_ORG } from '../../helper/constant/endpoint';
import { endpoint } from '../../helper/constant';

export const getToken = (self) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    if (store) {
        return store.userToken
    }
    if (self && self.props && self.props.history) {
        self.props.history.push('/logout');
    }
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
            let request = requestType[i](self, Object.assign({}, filter))
            if (request) {
                request.token = token;
                requestDataList.push(request);
            }
        }
        serviceMC.sendMultiRequest(self, requestDataList, callback)
    }
}

export const showSyncMultiData = async (self, requestType, filter) => {
    let token = getToken(self)
    if (token) {
        let requestDataList = [];
        for (let i = 0; i < requestType.length; i++) {
            let request = filter ? requestType[i](self, Object.assign({}, filter)) : requestType[i]
            if (request) {
                request.token = token;
                requestDataList.push(request);
            }
        }
        return await serviceMC.sendSyncMultiRequest(self, requestDataList)
    }
}

/* User Role */
export const showUserRoles = async (self) => {
    let mcRequest = await sendRequest(self, { method: endpoint.SHOW_ROLE })
    return mcRequest
}

export const sendVerify = async (self, data) => {
    let valid = false;
    let mcRequest = await serviceMC.sendSyncRequest(self, { method: endpoint.RESEND_VERIFY, data: data })
    if (mcRequest && mcRequest.response) {
        let response = mcRequest.response;
        valid = response.status === 200 ? true : false
    }
    return valid
}

export const verifyEmail = async (self, data) => {
    let mcRequest = await serviceMC.sendSyncRequestWithError(self, { method: endpoint.VERIFY_EMAIL, data: data })
    return mcRequest
}

export const showAuditOrg = async (self, data, showSpinner) => {
    let mcRequest = await sendRequest(self, { method: SHOW_AUDIT_ORG, data: data, showSpinner: showSpinner })
    return mcRequest
}

export const settingLock = async (self, data) => {
    let valid = false
    let mcRequest = await sendRequest(self, { method: endpoint.SETTING_LOCK, data: data })
    if (mcRequest && mcRequest.response) {
        let response = mcRequest.response;
        valid = response.status === 200 ? true : false
    }
    return valid
}

export const resetPassword = async (self, data) => {
    let mcRequest = await serviceMC.sendSyncRequestWithError(self, { method: endpoint.RESET_PASSWORD, data: data })
    return mcRequest
}

export const createUser = async (self, data) => {
    let mcRequest = await serviceMC.sendSyncRequest(self, { method: endpoint.CREATE_USER, data: data })
    return mcRequest
}

export const login = async (self, data) => {
    let mcRequest = await serviceMC.sendSyncRequestWithError(self, { method: endpoint.LOGIN, data: data })
    return mcRequest
}

export const resetPasswordRequest = async (self, data) => {
    let valid = false
    let mcRequest = await serviceMC.sendSyncRequest(self, { method: endpoint.RESET_PASSWORD_REQUEST, data: data })
    if (mcRequest && mcRequest.response) {
        let response = mcRequest.response;
        valid = response.status === 200 ? true : false
    }
    return valid
}

export const responseValid = (mc)=>{
    return mc && mc.response && mc.response.status === 200
}

