import axios from 'axios';

import FormatComputeOrganization from './formatter/formatComputeOrganization';
import FormatComputeUsers from './formatter/formatComputeUsers';
import FormatComputeAccounts from './formatter/formatComputeAccounts';
import FormatComputeCloudlet from './formatter/formatComputeCloudlet';
import FormatComputeClstInst from './formatter/formatComputeClstInstance';
import FormatComputeFlavor from './formatter/formatComputeFlavor';
import FormatComputeApp from './formatter/formatComputeApp';
import FormatComputeInst from './formatter/formatComputeInstance';

export const SHOW_ORG = "showOrg";
export const SHOW_USERS = "ShowUsers";
export const SHOW_ACCOUNTS = "ShowAccounts";
export const SHOW_ROLE = "ShowRole";
export const SHOW_CONTROLLER = "showController"
export const SHOW_CLOUDLET = "ShowCloudlet";
export const SHOW_CLUSTER_INST = "ShowClusterInst";
export const SHOW_FLAVOR = "ShowFlavor";
export const SHOW_APP = "ShowApp";
export const SHOW_APP_INST = "ShowAppInst";
export const SHOW_SELF = "showself";
export const LOGIN = "login";
export const SETTING_LOCK = "SettingLock";
export const CURRENT_USER = "current";
export const VERIFY_EMAIL = "verifyemail"


function responseError(request, error, callback, self)
{
    try {
        if (String(error).indexOf('Network Error') > -1) {
            console.log("NETWORK ERROR");
        } else {
            callback({ error: error }, request.method, self);
        }
    } catch (e) {
        console.log('any error ??? ')
    }
}

function responseValid(request, response, callback, self)
{
    let parseData = null;
    if (response.data) {
        if (response.data.error) {
            if (response.data.error.indexOf('Expired') > -1) {
                localStorage.setItem('userInfo', null)
                localStorage.setItem('sessionData', null)
                callback({ error: 'Login Timeout Expired.<br/>Please login again' }, request.method, self);
                return;
            } else {
                callback({ error: response.data.error }, request.method, self);
                return;
            }
        } else {
            parseData = JSON.parse(JSON.stringify(response));
        }
    } else {
        parseData = response;
    }
    return parseData;
}

function formatData(request, response) {
    switch (request.method) {
        case SHOW_ORG:
            return { data: FormatComputeOrganization(response, request.data)}
        case SHOW_USERS:
            return { data: FormatComputeUsers(response, request.data) }
        case SHOW_ACCOUNTS:
            return { data: FormatComputeAccounts(response, request.data) }
        case SHOW_CLOUDLET:
            return { data: FormatComputeCloudlet(response, request.data) }
        case SHOW_CLUSTER_INST:
            return { data: FormatComputeClstInst(response, request.data) }
        case SHOW_FLAVOR:
            return { data: FormatComputeFlavor(response, request.data) }
        case SHOW_APP:
            return { data: FormatComputeApp(response, request.data) }
        case SHOW_APP_INST:
            return { data: FormatComputeInst(response, request.data) }
        case SHOW_SELF:
            return {response : response, method:request.method};
        default:
            return {response:response} ;
    }
}

function getPath(request) {
    switch (request.method) {
        case SHOW_ORG:
            return '/api/v1/auth/org/show';
        case SHOW_USERS:
            return '/api/v1/auth/role/showuser';
        case SHOW_ACCOUNTS:
            return '/api/v1/auth/user/show';
        case SHOW_ROLE:
            return '/api/v1/auth/role/assignment/show';
        case SHOW_CONTROLLER:
            return '/api/v1/auth/controller/show';
        case SETTING_LOCK:
            return '/api/v1/auth/restricted/user/update';
        case CURRENT_USER:
            return '/api/v1/auth/user/current';
        case SHOW_SELF:
            return '/api/v1/auth/audit/showself';
        case SHOW_CLOUDLET:
        case SHOW_CLUSTER_INST:
        case SHOW_FLAVOR:
        case SHOW_APP:
        case SHOW_APP_INST:
            return `/api/v1/auth/ctrl/${request.method}`;
        case LOGIN:
            return `/api/v1/${request.method}`
        case VERIFY_EMAIL:
            return `/api/v1/${request.method}`;
        default:
            return null;
    }
}

export function sendRequest(request, callback, self) {
    let headers = {};
    if(request.token)
    {
        headers = {
            'Authorization': `Bearer ${request.token}`
        }
    }
    return axios.post(getPath(request), request.data,
        {
            headers: headers
        })
        .then(function (response) {
            if(responseValid(request, response, callback, self))
            {
                callback(formatData(request, response));
            }
        })
        .catch(function (error) {
            responseError(request, error, callback)
        })
}




