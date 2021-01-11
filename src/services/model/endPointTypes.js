
import * as Organization from './organization';
import * as Users from './users';
import * as Accounts from './accounts';
import * as App from './app';
import * as Cloudlet from './cloudlet';
import * as CloudletEvent from './cloudletEvent';
import * as CloudletInfo from './cloudletInfo';
import * as ClusterInstance from './clusterInstance';
import * as ClusterEvent from './clusterEvent';
import * as AppInstEvent from './appInstEvent';
import * as AppMetrics from './appMetrics';
import * as ClusterMetrics from './clusterMetrics';
import * as CloudletMetrics from './cloudletMetrics';
import * as ClientMetrics from './clientMetrics';
import * as Flavor from './flavor';
import * as AppInstance from './appInstance';
import * as AutoProvPolicy from './autoProvisioningPolicy';
import * as TrustPolicy from './trustPolicy';
import * as AutoScalePolicy from './autoScalePolicy';
import * as CloudletPool from './cloudletPool';
import * as CloudletLinkOrg from './cloudletLinkOrg';
import * as AppInstClient from './appInstClient';
import * as Alerts from './alerts';
import * as Events from './events';

export const SHOW_ORG = "org/show";
export const CREATE_ORG = "createOrg";
export const DELETE_ORG = "deleteOrg";
export const UPDATE_ORG = "updateOrg";
export const SHOW_AUDIT_ORG = "Auditshoworg";
export const SHOW_USERS = "ShowUsers";
export const DELETE_USER = "DeleteUser";
export const SHOW_ACCOUNTS = "ShowAccounts";
export const DELETE_ACCOUNT = "DeleteAccount";
export const SHOW_ROLE = "role/assignment/show";
export const SHOW_CONTROLLER = "controller/show"
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
export const LOGIN = "login";
export const SETTING_LOCK = "SettingLock";
export const CURRENT_USER = "current";
export const VERIFY_EMAIL = "verifyemail";
export const RESEND_VERIFY = "resendverify";
export const RESET_PASSWORD = "passwordreset";
export const RESET_PASSWORD_REQUEST = "passwordresetrequest";
export const CREATE_USER = "usercreate";
export const UPDATE_USER = "user/update"
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
export const SHOW_ORG_CLOUDLET_INFO = "orgcloudletinfo/show";
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
export const SHOW_TRUST_POLICY = "ShowTrustPolicy";
export const UPDATE_TRUST_POLICY = "UpdateTrustPolicy";
export const CREATE_TRUST_POLICY = "CreateTrustPolicy";
export const DELETE_TRUST_POLICY = "DeleteTrustPolicy";
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
export const ALERT_SHOW_RECEIVER = 'alertreceiver/show'
export const ALERT_CREATE_RECEIVER = 'alertreceiver/create'
export const ALERT_DELETE_RECEIVER = 'alertreceiver/delete'
export const PUBLIC_CONFIG = 'publicconfig'
export const REVOKE_ACCESS_KEY = 'RevokeAccessKey'

export function getPath(request) {
    switch (request.method) {
        case CLOUDLET_METRICS_ENDPOINT:
        case CLUSTER_METRICS_ENDPOINT:
        case APP_INST_METRICS_ENDPOINT:
        case CLOUDLET_EVENT_LOG_ENDPOINT:
        case CLUSTER_EVENT_LOG_ENDPOINT:
        case APP_INST_EVENT_LOG_ENDPOINT:
        case CLIENT_METRICS_ENDPOINT:
        case EVENTS_FIND:
        case EVENTS_SHOW:
        case ALERT_SHOW_RECEIVER:  
        case ALERT_CREATE_RECEIVER: 
        case ALERT_DELETE_RECEIVER:   
        case SHOW_ORG:
        case SHOW_ORG_CLOUDLET:
        case SHOW_ORG_CLOUDLET_INFO:
        case SHOW_ROLE:
        case SHOW_CONTROLLER:
        case UPDATE_USER:
            return `/api/v1/auth/${request.method}`
        case DELETE_ORG:
            return '/api/v1/auth/org/delete';
        case CREATE_ORG:
            return '/api/v1/auth/org/create';
        case UPDATE_ORG:
            return '/api/v1/auth/org/update';
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
        case SETTING_LOCK:
            return '/api/v1/auth/restricted/user/update';
        case CURRENT_USER:
            return '/api/v1/auth/user/current';
        case ADD_USER_ROLE:
            return '/api/v1/auth/role/adduser';
        case SHOW_CLOUDLET:
        case SHOW_CLOUDLET_INFO:
        case CREATE_CLOUDLET:
        case UPDATE_CLOUDLET:
        case DELETE_CLOUDLET:
        case STREAM_CLOUDLET:
        case SHOW_CLUSTER_INST:
        case CREATE_CLUSTER_INST:
        case UPDATE_CLUSTER_INST:
        case DELETE_CLUSTER_INST:
        case STREAM_CLUSTER_INST:
        case SHOW_FLAVOR:
        case CREATE_FLAVOR:
        case DELETE_FLAVOR:
        case SHOW_APP:
        case CREATE_APP:
        case UPDATE_APP:
        case DELETE_APP:
        case SHOW_APP_INST:
        case UPDATE_APP_INST:
        case CREATE_APP_INST:
        case DELETE_APP_INST:
        case REFRESH_APP_INST:
        case STREAM_APP_INST:
        case SHOW_CLOUDLET_POOL:
        case DELETE_CLOUDLET_POOL:
        case CREATE_CLOUDLET_POOL:
        case UPDATE_CLOUDLET_POOL:
        case SHOW_AUTO_PROV_POLICY:
        case CREATE_AUTO_PROV_POLICY:
        case UPDATE_AUTO_PROV_POLICY:
        case DELETE_AUTO_PROV_POLICY:
        case ADD_AUTO_PROV_POLICY_CLOUDLET:
        case REMOVE_AUTO_PROV_POLICY_CLOUDLET:
        case SHOW_TRUST_POLICY:
        case UPDATE_TRUST_POLICY:
        case CREATE_TRUST_POLICY:
        case DELETE_TRUST_POLICY:
        case SHOW_AUTO_SCALE_POLICY:
        case CREATE_AUTO_SCALE_POLICY:
        case UPDATE_AUTO_SCALE_POLICY:
        case DELETE_AUTO_SCALE_POLICY:
        case RUN_COMMAND:
        case SHOW_LOGS:
        case SHOW_CONSOLE:
        case GET_CLOUDLET_MANIFEST:
        case SHOW_APP_INST_CLIENT:
        case SHOW_ALERT:
        case REVOKE_ACCESS_KEY:
            return `/api/v1/auth/ctrl/${request.method}`;
        case LOGIN:
        case RESEND_VERIFY:
        case VERIFY_EMAIL:
        case RESET_PASSWORD:
        case RESET_PASSWORD_REQUEST:
        case CREATE_USER:
        case PUBLIC_CONFIG:
            return `/api/v1/${request.method}`;
        case SHOW_CLOUDLET_LINKORG:
            return `/api/v1/auth/orgcloudletpool/show`;
        case CREATE_LINK_POOL_ORG:
            return `/api/v1/auth/orgcloudletpool/create`;
        case DELETE_LINK_POOL_ORG:
            return `/api/v1/auth/orgcloudletpool/delete`;
        default:
            return null;
    }
}

export function formatData(request, response) {
    let data = undefined;
    switch (request.method) {
        case SHOW_ORG:
            data = Organization.getData(response, request.data)
            break;
        case SHOW_USERS:
            data = Users.getData(response, request.data)
            break;
        case SHOW_ACCOUNTS:
            data = Accounts.getData(response, request.data)
            break;
        case SHOW_CLOUDLET:
        case SHOW_ORG_CLOUDLET:
            data = Cloudlet.getData(response, request.data)
            break;
        case SHOW_CLOUDLET_INFO:
        case SHOW_ORG_CLOUDLET_INFO:
            data = CloudletInfo.getData(response, request.data)
            break;
        case SHOW_CLUSTER_INST:
            data = ClusterInstance.getData(response, request.data)
            break;
        case SHOW_FLAVOR:
            data = Flavor.getData(response, request.data)
            break;
        case SHOW_APP:
            data = App.getData(response, request.data)
            break;
        case SHOW_APP_INST:
            data = AppInstance.getData(response, request.data)
            break;
        case SHOW_AUTO_PROV_POLICY:
            data = AutoProvPolicy.getData(response, request.data)
            break;
        case SHOW_TRUST_POLICY:
            data = TrustPolicy.getData(response, request.data)
            break;
        case SHOW_AUTO_SCALE_POLICY:
            data = AutoScalePolicy.getData(response, request.data)
            break;
        case SHOW_CLOUDLET_POOL:
            data = CloudletPool.getData(response, request.data)
            break;
        case SHOW_CLOUDLET_LINKORG:
            data = CloudletLinkOrg.getData(response, request.data)
            break;
        case CLUSTER_EVENT_LOG_ENDPOINT:
            data = ClusterEvent.getData(response, request.data)
            break;
        case APP_INST_EVENT_LOG_ENDPOINT:
            data = AppInstEvent.getData(response, request.data)
            break;
        case CLOUDLET_EVENT_LOG_ENDPOINT:
            data = CloudletEvent.getData(response, request.data)
            break;
        case APP_INST_METRICS_ENDPOINT:
            data = AppMetrics.getData(response, request.data)
            break;
        case CLIENT_METRICS_ENDPOINT:
            data = ClientMetrics.getData(response, request.data)
            break;
        case CLUSTER_METRICS_ENDPOINT:
            data = ClusterMetrics.getData(response, request.data)
            break;
        case CLOUDLET_METRICS_ENDPOINT:
            data = CloudletMetrics.getData(response, request.data)
            break;
        case SHOW_APP_INST_CLIENT:
            data = AppInstClient.getData(response, request.data)
            break;
        case ALERT_SHOW_RECEIVER:
            data = Alerts.getData(response, request.data)
            break;
        case EVENTS_SHOW:
        case EVENTS_FIND:
            data = Events.getData(response, request.data)
            break;
        default:
            data = undefined;
    }
    if (data) {
        response.data = data;
    }
    return { request: request, response: response }
}
