
import * as Organization from './organization';
import * as Users from './users';
import * as Accounts from './accounts';
import * as App from './app';
import * as Cloudlet from './cloudlet';
import * as CloudletInfo from './cloudletInfo';
import * as ClusterInstance from './clusterInstance';
import * as Flavor from './flavor';
import * as AppInstance from './appInstance';
import * as OrgCloudlet from './orgCloudlet';
import * as AutoProvPolicy from './autoProvisioningPolicy';
import * as PrivacyPolicy from './privacyPolicy';
import * as CloudletPool from './cloudletPool';
import * as CloudletPoolMember from './cloudletPoolMember';
import * as CloudletLinkOrg from './cloudletLinkOrg';


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
export const RESET_PASSWORD_REQUEST = "passwordresetrequest";
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
export const SHOW_LOGS = "ShowLogs";
export const SHOW_CONSOLE = "RunConsole";
export const SHOW_AUTO_PROV_POLICY = "ShowAutoProvPolicy";
export const CREATE_AUTO_PROV_POLICY = "CreateAutoProvPolicy";
export const DELETE_AUTO_PROV_POLICY = "DeleteAutoProvPolicy";
export const ADD_AUTO_PROV_POLICY_CLOUDLET = "AddAutoProvPolicyCloudlet";
export const REMOVE_AUTO_PROV_POLICY_CLOUDLET = "RemoveAutoProvPolicyCloudlet";
export const SHOW_PRIVACY_POLICY = "ShowPrivacyPolicy";
export const UPDATE_PRIVACY_POLICY = "UpdatePrivacyPolicy";
export const CREATE_PRIVACY_POLICY = "CreatePrivacyPolicy";
export const DELETE_PRIVACY_POLICY = "DeletePrivacyPolicy";

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
        case DELETE_CLOUDLET_POOL_MEMBER:
        case SHOW_AUTO_PROV_POLICY:
        case CREATE_AUTO_PROV_POLICY:
        case DELETE_AUTO_PROV_POLICY:
        case ADD_AUTO_PROV_POLICY_CLOUDLET:
        case REMOVE_AUTO_PROV_POLICY_CLOUDLET:
        case SHOW_PRIVACY_POLICY:
        case UPDATE_PRIVACY_POLICY:
        case CREATE_PRIVACY_POLICY:
        case DELETE_PRIVACY_POLICY:
        case RUN_COMMAND:
        case SHOW_LOGS:
        case SHOW_CONSOLE:
            return `/api/v1/auth/ctrl/${request.method}`;
        case LOGIN:
        case RESEND_VERIFY:
        case VERIFY_EMAIL:
        case RESET_PASSWORD:
        case RESET_PASSWORD_REQUEST:
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
            data = Organization.getData(response, request.data)
            break;
        case SHOW_USERS:
            data = Users.getData(response, request.data)
            break;
        case SHOW_ACCOUNTS:
            data = Accounts.getData(response, request.data)
            break;
        case SHOW_CLOUDLET:
            data = Cloudlet.getData(response, request.data)
            break;
        case SHOW_CLOUDLET_INFO:
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
        case SHOW_ORG_CLOUDLET:
            data = OrgCloudlet.getData(response, request.data)
            break;
        case SHOW_AUTO_PROV_POLICY:
            data = AutoProvPolicy.getData(response, request.data)
            break;
        case SHOW_PRIVACY_POLICY:
            data = PrivacyPolicy.getData(response, request.data)
            break;
        case SHOW_CLOUDLET_POOL:
            data = CloudletPool.getData(response, request.data)
            break;
        case SHOW_CLOUDLET_MEMBER:
            data = CloudletPoolMember.getData(response, request.data)
            break;
        case SHOW_CLOUDLET_LINKORG:
            data = CloudletLinkOrg.getData(response, request.data)
            break;
        default:
            data = undefined;
    }
    if (data) {
        response.data = data;
    }
    return { request: request, response: response }
}
