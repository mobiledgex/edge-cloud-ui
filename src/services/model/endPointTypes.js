
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
import * as ClientMetrics from './clientMetrics';
import * as Flavor from './flavor';
import * as AppInstance from './appInstance';
import * as AutoProvPolicy from './autoProvisioningPolicy';
import * as TrustPolicy from './trustPolicy';
import * as AutoScalePolicy from './autoScalePolicy';
import * as CloudletPool from './cloudletPool';
import * as AppInstClient from './appInstClient';
import * as Alerts from './alerts';
import * as BillingOrg from './billingOrg';
import * as Events from './events';
import * as poolAccess from './privateCloudletAccess';
import * as invoices from './invoices';
import * as reporter from './reporter';
import * as endpoint from '../../helper/constant/endpoint';





export const LOGIN = "login";
export const VERIFY_EMAIL = "verifyemail";
export const RESEND_VERIFY = "resendverify";
export const RESET_PASSWORD = "passwordreset";
export const RESET_PASSWORD_REQUEST = "passwordresetrequest";
export const CREATE_USER = "usercreate";
export const PUBLIC_CONFIG = 'publicconfig'

export function getPath(request) {
    switch (request.method) {
        case endpoint.SHOW_ORG:
        case endpoint.CREATE_ORG:
        case endpoint.UPDATE_ORG:
        case endpoint.DELETE_ORG:
        case endpoint.EDGEBOX_ONLY:
        case endpoint.SHOW_ACCOUNTS:
        case endpoint.DELETE_ACCOUNT:
        case endpoint.SETTING_LOCK:
        case endpoint.SHOW_USERS:
        case endpoint.DELETE_USER:
        case endpoint.CURRENT_USER:
        case endpoint.UPDATE_USER:
        case endpoint.ADD_USER_ROLE:
        case endpoint.SHOW_CLOUDLET:
        case endpoint.CREATE_CLOUDLET:
        case endpoint.UPDATE_CLOUDLET:
        case endpoint.DELETE_CLOUDLET:
        case endpoint.SHOW_ORG_CLOUDLET:
        case endpoint.SHOW_CLOUDLET_INFO:
        case endpoint.SHOW_ORG_CLOUDLET_INFO:
        case endpoint.SHOW_CLUSTER_INST:
        case endpoint.STREAM_CLOUDLET:
        case endpoint.GET_CLOUDLET_MANIFEST:
        case endpoint.GET_CLOUDLET_RESOURCE_QUOTA_PROPS:
        case endpoint.CREATE_CLUSTER_INST:
        case endpoint.UPDATE_CLUSTER_INST:
        case endpoint.DELETE_CLUSTER_INST:
        case endpoint.STREAM_CLUSTER_INST:
        case endpoint.SHOW_APP:
        case endpoint.CREATE_APP:
        case endpoint.UPDATE_APP:
        case endpoint.DELETE_APP:
        case endpoint.SHOW_APP_INST:
        case endpoint.UPDATE_APP_INST:
        case endpoint.CREATE_APP_INST:
        case endpoint.DELETE_APP_INST:
        case endpoint.REFRESH_APP_INST:
        case endpoint.STREAM_APP_INST:
        case endpoint.RUN_COMMAND:
        case endpoint.SHOW_LOGS:
        case endpoint.SHOW_CONSOLE:
        case endpoint.SHOW_FLAVOR:
        case endpoint.CREATE_FLAVOR:
        case endpoint.DELETE_FLAVOR:
        case endpoint.SHOW_CLOUDLET_POOL:
        case endpoint.CREATE_CLOUDLET_POOL:
        case endpoint.UPDATE_CLOUDLET_POOL:
        case endpoint.DELETE_CLOUDLET_POOL:
        case endpoint.SHOW_AUTO_PROV_POLICY:
        case endpoint.CREATE_AUTO_PROV_POLICY:
        case endpoint.UPDATE_AUTO_PROV_POLICY:
        case endpoint.DELETE_AUTO_PROV_POLICY:
        case endpoint.ADD_AUTO_PROV_POLICY_CLOUDLET:
        case endpoint.REMOVE_AUTO_PROV_POLICY_CLOUDLET:   
        case endpoint.SHOW_AUTO_SCALE_POLICY:
        case endpoint.CREATE_AUTO_SCALE_POLICY:
        case endpoint.UPDATE_AUTO_SCALE_POLICY:
        case endpoint.DELETE_AUTO_SCALE_POLICY:   
        case endpoint.SHOW_TRUST_POLICY:
        case endpoint.UPDATE_TRUST_POLICY:
        case endpoint.CREATE_TRUST_POLICY:
        case endpoint.DELETE_TRUST_POLICY:
        case endpoint.SHOW_BILLING_ORG:
        case endpoint.CREATE_BILLING_ORG:
        case endpoint.UPDATE_BILLING_ORG:
        case endpoint.DELETE_BILLING_ORG:
        case endpoint.INVOICE_BILLING:
        case endpoint.BILLING_ORG_ADD_CHILD:
        case endpoint.BILLING_ORG_REMOVE_CHILD: 
        case endpoint.SHOW_ROLE:
        case endpoint.SHOW_CONTROLLER: 
        case endpoint.SHOW_AUDIT_ORG:    
        case endpoint.EVENTS_FIND:
        case endpoint.EVENTS_SHOW:
        case endpoint.ALERT_SHOW_RECEIVER:
        case endpoint.ALERT_CREATE_RECEIVER:
        case endpoint.ALERT_DELETE_RECEIVER:
        case endpoint.SHOW_REPORTER:
        case endpoint.CREATE_REPORTER:
        case endpoint.UPDATE_REPORTER:
        case endpoint.DELETE_REPORTER:
        case endpoint.SHOW_REPORTS:
        case endpoint.DOWNLOAD_REPORT:
        case endpoint.GENERATE_REPORT:
        case endpoint.SHOW_APP_INST_CLIENT:
        case endpoint.SHOW_ALERT:
        case endpoint.REVOKE_ACCESS_KEY:
        case endpoint.CLOUDLET_METRICS_ENDPOINT:
        case endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT:
        case endpoint.CLUSTER_METRICS_ENDPOINT:
        case endpoint.APP_INST_METRICS_ENDPOINT:
        case endpoint.CLOUDLET_EVENT_LOG_ENDPOINT:
        case endpoint.CLUSTER_EVENT_LOG_ENDPOINT:
        case endpoint.APP_INST_EVENT_LOG_ENDPOINT:
        case endpoint.CLIENT_METRICS_ENDPOINT:
        case endpoint.CREATE_POOL_ACCESS_INVITATION:
        case endpoint.DELETE_POOL_ACCESS_INVITATION:
        case endpoint.SHOW_POOL_ACCESS_INVITATION:
        case endpoint.SHOW_POOL_ACCESS_CONFIRMATION:
        case endpoint.CREATE_POOL_ACCESS_CONFIRMATION:
        case endpoint.DELETE_POOL_ACCESS_CONFIRMATION:
        case endpoint.SHOW_POOL_ACCESS_GRANTED:
        case endpoint.SHOW_POOL_ACCESS_PENDING:
        case endpoint.APP_INST_USAGE_ENDPOINT:
        case endpoint.CLUSTER_INST_USAGE_ENDPOINT:
        case endpoint.NEW_PASSWORD:
            return `/api/v1/auth/${request.method}`;
        case LOGIN:
        case RESEND_VERIFY:
        case VERIFY_EMAIL:
        case RESET_PASSWORD:
        case RESET_PASSWORD_REQUEST:
        case CREATE_USER:
        case PUBLIC_CONFIG:
            return `/api/v1/${request.method}`;
        default:
            return null;
    }
}

export function formatData(request, response) {
    let data = undefined;
    switch (request.method) {
        case endpoint.SHOW_ORG:
            data = Organization.getData(response, request.data)
            break;
        case endpoint.SHOW_USERS:
            data = Users.getData(response, request.data)
            break;
        case endpoint.SHOW_ACCOUNTS:
            data = Accounts.getData(response, request.data)
            break;
        case endpoint.SHOW_CLOUDLET:
        case endpoint.SHOW_ORG_CLOUDLET:
            data = Cloudlet.getData(response, request.data)
            break;
        case endpoint.SHOW_CLOUDLET_INFO:
        case endpoint.SHOW_ORG_CLOUDLET_INFO:
            data = CloudletInfo.getData(response, request.data)
            break;
        case endpoint.SHOW_CLUSTER_INST:
            data = ClusterInstance.getData(response, request.data)
            break;
        case endpoint.SHOW_FLAVOR:
            data = Flavor.getData(response, request.data)
            break;
        case endpoint.SHOW_APP:
            data = App.getData(response, request.data)
            break;
        case endpoint.SHOW_APP_INST:
            data = AppInstance.getData(response, request.data)
            break;
        case endpoint.SHOW_AUTO_PROV_POLICY:
            data = AutoProvPolicy.getData(response, request.data)
            break;
        case endpoint.SHOW_TRUST_POLICY:
            data = TrustPolicy.getData(response, request.data)
            break;
        case endpoint.SHOW_AUTO_SCALE_POLICY:
            data = AutoScalePolicy.getData(response, request.data)
            break;
        case endpoint.SHOW_CLOUDLET_POOL:
            data = CloudletPool.getData(response, request.data)
            break;
        case endpoint.CLUSTER_EVENT_LOG_ENDPOINT:
            data = ClusterEvent.getData(response, request.data)
            break;
        case endpoint.APP_INST_EVENT_LOG_ENDPOINT:
            data = AppInstEvent.getData(response, request.data)
            break;
        case endpoint.CLOUDLET_EVENT_LOG_ENDPOINT:
            data = CloudletEvent.getData(response, request.data)
            break;
        case endpoint.CLIENT_METRICS_ENDPOINT:
            data = ClientMetrics.getData(response, request.data)
            break;
        case endpoint.SHOW_APP_INST_CLIENT:
            data = AppInstClient.getData(response, request.data)
            break;
        case endpoint.ALERT_SHOW_RECEIVER:
            data = Alerts.getData(response, request.data)
            break;
        case endpoint.SHOW_BILLING_ORG:
            data = BillingOrg.getData(response, request.data)
            break;
        case endpoint.EVENTS_SHOW:
        case endpoint.EVENTS_FIND:
            data = Events.getData(response, request.data)
            break;
        case endpoint.SHOW_POOL_ACCESS_CONFIRMATION:
        case endpoint.SHOW_POOL_ACCESS_INVITATION:
        case endpoint.SHOW_POOL_ACCESS_GRANTED:
        case endpoint.SHOW_POOL_ACCESS_PENDING:
            data = poolAccess.getData(response, request.data)
            break;
        case endpoint.INVOICE_BILLING:
            data = invoices.getData(response, request.data)
            break;
        case endpoint.SHOW_REPORTER:
            data = reporter.getData(response, request.data)
            break;
        default:
            data = undefined;
    }
    if (data) {
        response.data = data;
    }
    return { request: request, response: response }
}
