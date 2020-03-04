import * as serviceMC from './serviceMC';
import * as EP from './endPointTypes';
import _ from 'lodash'
import { fields } from './format';

const getUserRole = ()=>
{
    if(localStorage.selectRole)
    {
        return localStorage.selectRole
    }
}

const getOrganization = ()=>
{
    if(localStorage.selectOrg)
    {
        return localStorage.selectOrg
    }
}

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
    if (getOrganization()) {
        return [{ organizationName: getOrganization(), isDefault: true }]
    }
    else {
        let mcRequest = await sendSyncRequest(self, EP.SHOW_ORG)
        return processData(mcRequest)
    }
}
/* Organization */

/* Clouldet */
export const getCloudletInfo = async (self, data) => {
    let method = EP.SHOW_ORG_CLOUDLET
    let requestData = { region: data.region, org: getOrganization() }
    if (getUserRole() === 'AdminManager') {
        requestData.org = undefined;
        method = EP.SHOW_CLOUDLET;
    }
    let mcRequest = await sendSyncRequest(self, method, requestData)
    return processData(mcRequest)
}
/* Clouldet */

/* Auto Provisioning Policy */
export const getAutoProvPolicy = async (self, data) => {
    if(getOrganization())
    {
        data.AutoProvPolicy = {key:{developer:getOrganization()}}
    }
    let mcRequest = await sendSyncRequest(self, EP.SHOW_AUTO_PROV_POLICY, data)
    return processData(mcRequest)
}

export const deleteAutoProvPolicy = async (self, data) => {
    return await sendSyncRequest(self, EP.DELETE_AUTO_PROV_POLICY, data)
}
/* Auto Provisioning Policy */

/* Privacy Policy */
export const getPrivacyPolicy = async (self, data) => {
    if(getOrganization())
    {
        data.privacypolicy = {key:{developer:getOrganization()}}
    }
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

export const getDataListFromServer = async (self, requestType, filter) => {

    let dataList = [];
    switch (requestType) {
        case EP.SHOW_AUTO_PROV_POLICY:
            dataList = await getAutoProvPolicy(self, filter)
            break;
        case EP.SHOW_PRIVACY_POLICY:
            dataList = await getPrivacyPolicy(self, filter)
            break;
        case EP.SHOW_ORG:
            dataList = await getOrganizationInfo(self)
            break;
    }
    return dataList;
}

