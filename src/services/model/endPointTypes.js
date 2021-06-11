
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
