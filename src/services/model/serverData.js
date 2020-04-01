import * as serviceMC from './serviceMC';

export const SHOW_ROLE = "ShowRole";
export const RESEND_VERIFY = "resendverify";
export const SETTING_LOCK = "SettingLock";

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

export const sendWSRequest = async (self, requestData, callback) => {
    let token = getToken(self)
    if (token) {
        requestData.token = token;
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

export const settingLock = async (self, data) => {
    let valid = false;
    let mcRequest = await sendRequest(self, { method: SETTING_LOCK, data: data })
    if (mcRequest && mcRequest.response) {
        let response = mcRequest.response;
        valid = response.status === 200 ? true : false
    }
    return valid

}

