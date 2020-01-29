
import * as FormatComputeOrganization from './formatter/formatComputeOrganization';
import * as FormatComputeUsers from './formatter/formatComputeUsers';
import * as FormatComputeAccounts from './formatter/formatComputeAccounts';
import * as FormatComputeCloudlet from './formatter/formatComputeCloudlet';
import * as FormatComputeClstInst from './formatter/formatComputeClstInstance';
import * as FormatComputeFlavor from './formatter/formatComputeFlavor';
import * as FormatComputeApp from './formatter/formatComputeApp';
import * as FormatComputeInst from './formatter/formatComputeInstance';
import * as FormatComputeCluster from './formatter/formatComputeCluster';
import * as FormatMonitorCloudlet from "./formatter/formatMonitorCloudlet";
import * as FormatMonitorCluster from "./formatter/formatMonitorCluster";
import * as FormatMonitorApp from "./formatter/formatMonitorApp";
import * as FormatComputeCloudletPool from './formatter/formatComputeCloudletPool';
import * as FormatComputeCloudletPoolDelete from './formatter/formatComputeCloudletPoolDelete';
import * as FormatComputeCloudletPoolMember from './formatter/formatComputeCloudletPoolMember';
import * as FormatComputeCloudletPoolMemberDelete from './formatter/formatComputeCloudletPoolMemberDelete';
import * as FormatComputeOrgCloudlet from './formatter/formatComputeOrgCloudlet';
import * as FormatComputeLinkPoolOrgDelete from './formatter/formatComputeLinkPoolOrgDelete';


export const SHOW_ORG = "showOrg";
export const CREATE_ORG = "createOrg";
export const DELETE_ORG = "deleteOrg";
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
export const CREATE_CLOUDLET = "CreateCloudlet";
export const SHOW_CLUSTER_INST = "ShowClusterInst";
export const CREATE_CLUSTER_INST = "CreateClusterInst";
export const DELETE_CLUSTER_INST = "DeleteClusterInst";
export const SHOW_CLUSTER_FLAVOR = "ShowClusterFlavor";
export const SHOW_FLAVOR = "ShowFlavor";
export const CREATE_FLAVOR = "CreateFlavor";
export const DELETE_FLAVOR = "DeleteFlavor"
export const SHOW_APP = "ShowApp";
export const CREATE_APP = "CreateApp";
export const UPDATE_APP = "UpdateApp";
export const DELETE_APP = "DeleteApp";
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
export const CREATE_USER = "usercreate";
export const ADD_USER_ROLE = "addUserRole";
export const STREAM_CLUSTER_INST = "StreamClusterInst";
export const STREAM_CLOUDLET = "StreamCloudlet";
export const STREAM_APP_INST = "StreamAppInst";
export const CLOUDLET_METRICS_APP = "CloudletMetricsApp";
export const CLUSTER_INST_METRICS_APP = "ClusterInstMetricsApp";
export const APP_INST_METRICS_APP = "AppInstMetricsApp";
export const SHOW_CLOUDLET_POOL = "ShowCloudletPool";
export const SHOW_CLOUDLET_MEMBER = "ShowCloudletPoolMember";
export const SHOW_CLOUDLET_LINKORG = "orgcloudletpool";
export const SHOW_LINK_POOL_ORG = "orgcloudletpool";
export const CREATE_CLOUDLET_POOL = "CreateCloudletPool";
export const CREATE_CLOUDLET_POOL_MEMBER = "CreateCloudletPoolMember";
export const CREATE_LINK_POOL_ORG = "CreateLinkPoolOrg";
export const DELETE_CLOUDLET_POOL = "DeleteCloudletPool";
export const DELETE_CLOUDLET_POOL_MEMBER = "DeleteCloudletPoolMember";
export const SHOW_ORG_CLOUDLET = "orgcloudlet";
export const DELETE_LINK_POOL_ORG = "DeleteLinkPoolOrg";
export const RUN_COMMAND = "RunCommand";

export function getPath(request) {
    switch (request.method) {
        case SHOW_ORG:
            return '/api/v1/auth/org/show';
        case DELETE_ORG:
            return '/api/v1/auth/org/delete';
        case SHOW_AUDIT_ORG:
            return '/api/v1/auth/audit/showorg';
        case SHOW_USERS:
            return '/api/v1/auth/role/showuser';
        case DELETE_USER:
            return '/api/v1/auth/role/removeuser';
        case SHOW_ACCOUNTS:
            return '/api/v1/auth/user/show';
        case DELETE_ACCOUNT:
            return '/api/v1/auth/user/delete';
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
        case ADD_USER_ROLE:
            return '/api/v1/auth/role/adduser';
        case CREATE_ORG:
            return '/api/v1/auth/org/create';
        case SHOW_CLOUDLET:
        case SHOW_CLOUDLET_INFO:
        case CREATE_CLOUDLET:
        case DELETE_CLOUDLET:
        case STREAM_CLOUDLET:
        case SHOW_CLUSTER_INST:
        case CREATE_CLUSTER_INST:
        case DELETE_CLUSTER_INST:
        case STREAM_CLUSTER_INST:
        case SHOW_FLAVOR:
        case CREATE_FLAVOR:
        case DELETE_FLAVOR:
        case SHOW_CLUSTER_FLAVOR:
        case SHOW_APP:
        case CREATE_APP:
        case UPDATE_APP:
        case DELETE_APP:
        case SHOW_APP_INST:
        case UPDATE_APP_INST:
        case CREATE_APP_INST:
        case DELETE_APP_INST:
        case STREAM_APP_INST:
        case SHOW_CLOUDLET_POOL:
        case SHOW_CLOUDLET_MEMBER:
        case DELETE_CLOUDLET_POOL:
        case CREATE_CLOUDLET_POOL:
        case CREATE_CLOUDLET_POOL_MEMBER:
        case RUN_COMMAND:
            return `/api/v1/auth/ctrl/${request.method}`;
        case LOGIN:
        case RESEND_VERIFY:
        case VERIFY_EMAIL:
        case RESET_PASSWORD:
        case CREATE_USER:
            return `/api/v1/${request.method}`;
        case CLOUDLET_METRICS_APP:
        case CLUSTER_INST_METRICS_APP:
        case APP_INST_METRICS_APP:
            return '/api/v1/auth/metrics/app';
        case SHOW_CLOUDLET_LINKORG:
            return `/api/v1/auth/orgcloudletpool/show`;
        case CREATE_LINK_POOL_ORG:
            return `/api/v1/auth/orgcloudletpool/create`;
        case DELETE_LINK_POOL_ORG:
            return `/api/v1/auth/orgcloudletpool/delete`;
        case SHOW_ORG_CLOUDLET:
            return `/api/v1/auth/orgcloudlet/show`;
        default:
            return null;
    }
}

export function formatData(request, response) {
    let data = undefined;
    switch (request.method) {
        case SHOW_ORG:
            data = FormatComputeOrganization.formatData(response, request.data)
            break;
        case SHOW_USERS:
            data = FormatComputeUsers.formatData(response, request.data)
            break;
        case SHOW_ACCOUNTS:
            data = FormatComputeAccounts.formatData(response, request.data)
            break;
        case SHOW_CLOUDLET:
            data = FormatComputeCloudlet.formatData(response, request.data)
            break;
        case SHOW_CLUSTER_INST:
            data = FormatComputeClstInst.formatData(response, request.data)
            break;
        case SHOW_FLAVOR:
            data = FormatComputeFlavor.formatData(response, request.data)
            break;
        case SHOW_CLUSTER_FLAVOR:
            data = FormatComputeCluster.formatData(response, request.data)
            break;
        case SHOW_APP:
            data = FormatComputeApp.formatData(response, request.data)
            break;
        case SHOW_APP_INST:
            data = FormatComputeInst.formatData(response, request.data)
            break;
        case CLOUDLET_METRICS_APP:
            data = FormatMonitorCloudlet.formatData(response, request.data)
            break;
        case CLUSTER_INST_METRICS_APP:
            data = FormatMonitorCluster.formatData(response, request.data)
            break;
        case APP_INST_METRICS_APP:
            data = FormatMonitorApp.formatData(response, request.data)
            break;
        case SHOW_CLOUDLET_POOL:
            data = FormatComputeCloudletPool.formatData(response, request.data)
            break;
        case SHOW_CLOUDLET_MEMBER:
            data = FormatComputeCloudletPoolMember.formatData(response, request.data)
            break;
        case SHOW_ORG_CLOUDLET:
            data = FormatComputeOrgCloudlet.formatData(response, request.data)
            break;
        default:
            data = undefined;
    }
    if (data) {
        response.data = data;
    }
    return { request: request, response: response }
}

export function getKey(keyId, data) {
    switch (keyId) {
        case 'Cloudlet':
            return FormatComputeCloudlet.getKey(data)
        case 'ClusterInst':
            return FormatComputeClstInst.getKey(data)
        case 'appinst':
            return FormatComputeInst.getKey(data)
        case 'Organization':
            return FormatComputeOrganization.getKey(data)
        case 'Flavors':
            return FormatComputeFlavor.getKey(data)
        case 'App':
            return FormatComputeApp.getKey(data)
        case 'User':
            return FormatComputeUsers.getKey(data)
        case 'Account':
            return FormatComputeAccounts.getKey(data)
        case 'Cloudlet Pool':
            return FormatComputeCloudletPoolDelete.getKey(data)
        case 'delete member':
            return FormatComputeCloudletPoolMemberDelete.getKey(data)
        case 'delete link':
            return FormatComputeLinkPoolOrgDelete.getKey(data)
        default:
            return null;
    }
}

export function getDeleteMethod(keyId) {
    switch (keyId) {
        case 'Cloudlet':
            return DELETE_CLOUDLET;
        case 'ClusterInst':
            return DELETE_CLUSTER_INST;
        case 'appinst':
            return DELETE_APP_INST;
        case 'Organization':
            return DELETE_ORG;
        case 'Flavors':
            return DELETE_FLAVOR;
        case 'App':
            return DELETE_APP;
        case 'User':
            return DELETE_USER;
        case 'Account':
            return DELETE_ACCOUNT;
        case 'Cloudlet Pool':
            return DELETE_CLOUDLET_POOL;
        case 'delete member':
            return DELETE_CLOUDLET_POOL_MEMBER;
        case 'delete link':
            return DELETE_LINK_POOL_ORG;
        default:
            return null;
    }
}

export function getStreamMethod(keyId) {
    switch (keyId) {
        case 'Cloudlet':
            return STREAM_CLOUDLET;
        case 'ClusterInst':
            return STREAM_CLUSTER_INST;
        case 'appinst':
            return STREAM_APP_INST;
    }
}   