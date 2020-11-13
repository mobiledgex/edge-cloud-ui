import * as formatter from './format'

export const SHOW_ORG = "org/show";
export const CREATE_ORG = "createOrg";
export const DELETE_ORG = "deleteOrg";
export const UPDATE_ORG = "updateOrg";
export const SHOW_AUDIT_ORG = "Auditshoworg";
export const SHOW_USERS = "ShowUsers";
export const DELETE_USER = "DeleteUser";
export const SHOW_ACCOUNTS = "ShowAccounts";
export const DELETE_ACCOUNT = "DeleteAccount";
export const SHOW_ROLE = "ShowRole";
export const SHOW_CONTROLLER = "showController"
export const SHOW_CLOUDLET = "ShowCloudlet";
export const SHOW_CLOUDLET_INFO = "ShowCloudletInfo";
export const DELETE_CLOUDLET = "DeleteCloudlet";
export const UPDATE_CLOUDLET = "UpdateCloudlet";
export const CREATE_CLOUDLET = "CreateCloudlet";
export const SHOW_CLUSTER_INST = "ShowClusterInst";
export const CREATE_CLUSTER_INST = "CreateClusterInst";
export const UPDATE_CLUSTER_INST = "UpdateClusterInst";
export const DELETE_CLUSTER_INST = "DeleteClusterInst";
export const SHOW_FLAVOR = "ShowFlavor";
export const CREATE_FLAVOR = "CreateFlavor";
export const DELETE_FLAVOR = "DeleteFlavor"
export const SHOW_APP = "ShowApp";
export const CREATE_APP = "CreateApp";
export const UPDATE_APP = "UpdateApp";
export const DELETE_APP = "DeleteApp";
export const REFRESH_APP_INST = 'RefreshAppInst';
export const SHOW_APP_INST = "ShowAppInst";
export const CREATE_APP_INST = "CreateAppInst";
export const UPDATE_APP_INST = "UpdateAppInst";
export const DELETE_APP_INST = "DeleteAppInst";
export const SHOW_SELF = "showself";
export const LOGIN = "login";
export const SETTING_LOCK = "SettingLock";
export const CURRENT_USER = "current";
export const VERIFY_EMAIL = "verifyemail";
export const RESEND_VERIFY = "resendverify";
export const RESET_PASSWORD = "passwordreset";
export const RESET_PASSWORD_REQUEST = "passwordresetrequest";
export const CREATE_USER = "usercreate";
export const ADD_USER_ROLE = "addUserRole";
export const STREAM_CLUSTER_INST = "StreamClusterInst";
export const STREAM_CLOUDLET = "StreamCloudlet";
export const STREAM_APP_INST = "StreamAppInst";
export const SHOW_CLOUDLET_POOL = "ShowCloudletPool";
export const SHOW_CLOUDLET_LINKORG = "orgcloudletpool";
export const SHOW_LINK_POOL_ORG = "orgcloudletpool";
export const CREATE_CLOUDLET_POOL = "CreateCloudletPool";
export const UPDATE_CLOUDLET_POOL = "UpdateCloudletPool"
export const CREATE_LINK_POOL_ORG = "CreateLinkPoolOrg";
export const DELETE_CLOUDLET_POOL = "DeleteCloudletPool";
export const SHOW_ORG_CLOUDLET = "orgcloudlet/show";
export const SHOW_ORG_CLOUDLET_INFO = "ShowOrgCloudletInfo";
export const DELETE_LINK_POOL_ORG = "DeleteLinkPoolOrg";
export const RUN_COMMAND = "RunCommand";
export const SHOW_LOGS = "ShowLogs";
export const SHOW_CONSOLE = "RunConsole";
export const SHOW_AUTO_PROV_POLICY = "ShowAutoProvPolicy";
export const CREATE_AUTO_PROV_POLICY = "CreateAutoProvPolicy";
export const UPDATE_AUTO_PROV_POLICY = "UpdateAutoProvPolicy";
export const DELETE_AUTO_PROV_POLICY = "DeleteAutoProvPolicy";
export const ADD_AUTO_PROV_POLICY_CLOUDLET = "AddAutoProvPolicyCloudlet";
export const REMOVE_AUTO_PROV_POLICY_CLOUDLET = "RemoveAutoProvPolicyCloudlet";
export const SHOW_PRIVACY_POLICY = "ShowPrivacyPolicy";
export const UPDATE_PRIVACY_POLICY = "UpdatePrivacyPolicy";
export const CREATE_PRIVACY_POLICY = "CreatePrivacyPolicy";
export const DELETE_PRIVACY_POLICY = "DeletePrivacyPolicy";
export const GET_CLOUDLET_MANIFEST = "GetCloudletManifest";
export const SHOW_AUTO_SCALE_POLICY = "ShowAutoScalePolicy";
export const CREATE_AUTO_SCALE_POLICY = "CreateAutoScalePolicy";
export const UPDATE_AUTO_SCALE_POLICY = "UpdateAutoScalePolicy";
export const DELETE_AUTO_SCALE_POLICY = "DeleteAutoScalePolicy";
export const CLOUDLET_EVENT_LOG_ENDPOINT = 'events/cloudlet';
export const CLUSTER_EVENT_LOG_ENDPOINT = 'events/cluster';
export const APP_INST_EVENT_LOG_ENDPOINT = 'events/app';
export const CLOUDLET_METRICS_ENDPOINT = 'metrics/cloudlet';
export const CLUSTER_METRICS_ENDPOINT = 'metrics/cluster';
export const APP_INST_METRICS_ENDPOINT = 'metrics/app';
export const SHOW_APP_INST_CLIENT = 'ShowAppInstClient'
export const CLIENT_METRICS_ENDPOINT = 'metrics/client'
export const EVENTS_FIND = 'events/find'
export const EVENTS_SHOW = 'events/show'
export const SHOW_ALERT = 'ShowAlert'

export const getPath = (request) => {
    switch (request.method) {
        case SHOW_CLOUDLET:
        case SHOW_APP_INST:
        case SHOW_CLUSTER_INST:
        case SHOW_ALERT:
            return `/api/v1/auth/ctrl/${request.method}`;
        case SHOW_ORG_CLOUDLET:
        case SHOW_ORG:
        case EVENTS_SHOW:
        case CLOUDLET_METRICS_ENDPOINT:
        case APP_INST_METRICS_ENDPOINT:
        case CLUSTER_METRICS_ENDPOINT:
        case CLIENT_METRICS_ENDPOINT:
            return `/api/v1/auth/${request.method}`
        default:
            return null;
    }
}

export const getHeader = (request) => {
    return { 'Authorization': `Bearer ${request.token}` }
}

export function formatData(request, response) {
    let data = undefined
    switch (request.method) {
        case SHOW_CLOUDLET:
        case SHOW_APP_INST:
        case SHOW_CLUSTER_INST:
        case SHOW_ALERT:
        case SHOW_ORG_CLOUDLET:
        case SHOW_ORG:
            data = formatter.formatData(response, request.data, request.keys)
            break;
        case CLOUDLET_METRICS_ENDPOINT:
        case APP_INST_METRICS_ENDPOINT:
        case CLUSTER_METRICS_ENDPOINT:
        case CLIENT_METRICS_ENDPOINT:
            data = formatter.formatEventData(response, request.data, request.keys)
            break;
        default:
            data = response.data;
    }
    return { request, response : {status : response.status, data} }
}