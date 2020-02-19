import * as serviceMC from './serviceMC';
import * as EP from './endPointTypes';


const getRequestInfo = (method, data) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    return { token: store.userToken, method: method, data: data }
}

const sendSyncRequest = async (self, method, data) => {
    return await serviceMC.sendSyncRequest(self, getRequestInfo(method, data))
}

const processData = (mcRequest) => {
    let dataList = [];
    if (mcRequest && mcRequest.response) {
        let response = mcRequest.response;
        if (response.data) {
            let data = response.data
            if (data.length > 0) {
                dataList = data
            }
        }
    }
    return dataList;
}

/* Organization */
export const getOrganizationInfo = async (self) => {
    let mcRequest = await sendSyncRequest(self, EP.SHOW_ORG)
    return processData(mcRequest)
}
/* Organization */

/* Clouldet */
export const getCloudletInfo = async (self, data) => {
    let mcRequest = await sendSyncRequest(self, EP.SHOW_CLOUDLET, data)
    return processData(mcRequest)
}
/* Clouldet */

/* Auto Provisioning Policy */
export const getAutoProvPolicy = async (self, data) => {
    let mcRequest = await sendSyncRequest(self, EP.SHOW_AUTO_PROV_POLICY, data)
    return processData(mcRequest)
}

export const deleteAutoProvPolicy = async (self, data) => {
    return await sendSyncRequest(self, EP.DELETE_AUTO_PROV_POLICY, data)
}
/* Auto Provisioning Policy */

/* Privacy Policy */
export const getPrivacyPolicy = async (self, data) => {
    let mcRequest = await sendSyncRequest(self, EP.SHOW_PRIVACY_POLICY, data)
    return processData(mcRequest)
}

export const createPrivacyPolicy = async (self, data) => {
    return await sendSyncRequest(self, EP.CREATE_PRIVACY_POLICY, data)
}

export const updatePrivacyPolicy = async (self, data) => {
    return await sendSyncRequest(self, EP.UPDATE_PRIVACY_POLICY, data)
}

export const deletePrivacyPolicy = async (self, data) => {
    return await sendSyncRequest(self, EP.DELETE_PRIVACY_POLICY, data)
}
/* Privacy Policy */

