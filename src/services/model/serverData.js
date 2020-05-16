import * as serviceMC from "./serviceMC";

export const SHOW_ROLE = "ShowRole";
export const RESEND_VERIFY = "resendverify";
export const SETTING_LOCK = "SettingLock";

const getToken = (self) => {
    const store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;
    if (store) {
        return store.userToken;
    }
    self.props.history.push({
        pathname: "/logout",
    });
};

export const sendRequest = async (self, requestData) => {
    const token = getToken(self);
    if (token) {
        requestData.token = token;
        const result = await serviceMC.sendSyncRequest(self, requestData);
        return result;
    }
};
/**
 * orgData : this parameter is useful when we are trying to process multiple
 *           data and need to access original data for which request was made
 *           because websocket supports multi request response
 *  * */
export const sendWSRequest = async (self, requestData, callback, orgData) => {
    const token = getToken(self);
    if (token) {
        requestData.token = token;
        requestData.orgData = orgData;
        serviceMC.sendWSRequest(requestData, callback);
    }
};

export const sendMultiRequest = (self, requestInfoList, callback) => {
    const token = getToken(self);
    if (token) {
        const requestDataList = [];
        for (let i = 0; i < requestInfoList.length; i++) {
            const requestInfo = requestInfoList[i];
            requestInfo.token = getToken(self);
            requestDataList.push(requestInfo);
        }
        serviceMC.sendMultiRequest(self, requestDataList, callback);
    }
};

export const showDataFromServer = async (self, requestData) => {
    let dataList = [];
    const token = getToken(self);
    if (token) {
        requestData.token = token;
        const mcRequest = await serviceMC.sendSyncRequest(self, requestData);
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            dataList = mcRequest.response.data;
        }
    }
    return dataList;
};

export const showMultiDataFromServer = (self, requestType, filter, callback) => {
    const token = getToken(self);
    if (token) {
        const requestDataList = [];
        for (let i = 0; i < requestType.length; i++) {
            const request = requestType[i]({ ...filter });
            if (request) {
                request.token = token;
                requestDataList.push(request);
            }
        }
        serviceMC.sendMultiRequest(self, requestDataList, callback);
    }
};

/* User Role */
export const showUserRoles = async (self) => {
    const mcRequest = await sendRequest(self, { method: SHOW_ROLE });
    return mcRequest;
};

export const sendVerify = async (self, data) => {
    let valid = false;
    const mcRequest = await sendRequest(self, { method: RESEND_VERIFY, data });
    if (mcRequest && mcRequest.response) {
        const { response } = mcRequest;
        valid = response.status === 200;
    }
    return valid;
};

export const settingLock = async (self, data) => {
    let valid = false;
    const mcRequest = await sendRequest(self, { method: SETTING_LOCK, data });
    if (mcRequest && mcRequest.response) {
        const { response } = mcRequest;
        valid = response.status === 200;
    }
    return valid;
};
