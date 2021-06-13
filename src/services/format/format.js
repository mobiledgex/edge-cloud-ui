import * as endpoint from '../../helper/constant/endpoint';
import { customize as organization } from '../modules/organization';
import { customize as users } from '../modules/users';
import { customize as accounts } from '../modules/accounts';
import { customize as cloudlet } from '../modules/cloudlet';
import { customize as cloudletInfo } from '../modules/cloudletInfo';
import { customize as clusterInst } from '../modules/clusterInst';
import { customize as app } from '../modules/app';
import { customize as appInst } from '../modules/appInst';
import { customize as flavor } from '../modules/flavor';
import { customize as cloudletPool } from '../modules/cloudletPool';
import { customize as autoProvPolicy } from '../modules/autoProvPolicy';
import { customize as trustPolicy } from '../modules/trustPolicy';
import { customize as autoScalePolicy } from '../modules/autoScalePolicy';
import { customize as poolAccess } from '../modules/poolAccess';
import { customize as alerts } from '../modules/alerts';
import { customize as billingorg } from '../modules/billingorg';
import { customize as invoices } from '../modules/invoices';
import { customize as reporter } from '../modules/reporter';
import { customize as cloudletEvent } from '../modules/cloudletEvent';
import { customize as clusterInstEvent } from '../modules/clusterInstEvent';
import { customize as appInstEvent } from '../modules/appInstEvent';
import { customize as clientMetrics } from '../modules/clientMetrics';
import { customize as clusterInstMetrics } from '../modules/clusterInstMetrics';
import { customize as appInstMetrics } from '../modules/appInstMetrics';
import { customize as cloudletMetrics } from '../modules/cloudletMetrics';
import { customize as cloudletMetricUsage } from '../modules/cloudletMetricUsage';
import { customize as appInstUsage } from '../modules/appInstUsage';
import { customize as clusterInstUsage } from '../modules/clusterInstUsage';

import { formatShowData } from './show';
import { formatChargifyData } from './chargify';
import { formatAlertData } from './alert';
import { formatEventData } from './event';
import { formatUsageData } from './usage';

export const formatData = (request, response) => {
    let data = undefined
    switch (request.method) {
        case endpoint.SHOW_ORG:
            data = formatShowData(request, response, organization)
            break;
        case endpoint.SHOW_USERS:
            data = formatShowData(request, response, users)
            break;
        case endpoint.SHOW_ACCOUNTS:
            data = formatShowData(request, response, accounts)
            break;
        case endpoint.SHOW_CLOUDLET:
        case endpoint.SHOW_ORG_CLOUDLET:
            data = formatShowData(request, response, cloudlet, true)
            break;
        case endpoint.SHOW_CLOUDLET_INFO:
        case endpoint.SHOW_ORG_CLOUDLET_INFO:
            data = formatShowData(request, response, cloudletInfo, true)
            break;
        case endpoint.SHOW_CLUSTER_INST:
            data = formatShowData(request, response, clusterInst, true)
            break;
        case endpoint.SHOW_FLAVOR:
            data = formatShowData(request, response, flavor)
            break;
        case endpoint.SHOW_APP:
            data = formatShowData(request, response, app)
            break;
        case endpoint.SHOW_APP_INST:
            data = formatShowData(request, response, appInst, true)
            break;
        case endpoint.SHOW_AUTO_PROV_POLICY:
            data = formatShowData(request, response, autoProvPolicy, true)
            break;
        case endpoint.SHOW_TRUST_POLICY:
            data = formatShowData(request, response, trustPolicy, true)
            break;
        case endpoint.SHOW_AUTO_SCALE_POLICY:
            data = formatShowData(request, response, autoScalePolicy, true)
            break;
        case endpoint.SHOW_CLOUDLET_POOL:
            data = formatShowData(request, response, cloudletPool, true)
            break;
        case endpoint.CLOUDLET_METRICS_ENDPOINT:
            data = formatEventData(request, response, cloudletMetrics)
            break;
        case endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT:
            data = formatEventData(request, response, cloudletMetricUsage)
            break;
        case endpoint.APP_INST_METRICS_ENDPOINT:
            data = formatEventData(request, response, appInstMetrics)
            break;
        case endpoint.CLUSTER_METRICS_ENDPOINT:
            data = formatEventData(request, response, clusterInstMetrics)
            break;
        case endpoint.CLUSTER_EVENT_LOG_ENDPOINT:
            data = formatEventData(request, response, clusterInstEvent)
            break;
        case endpoint.APP_INST_EVENT_LOG_ENDPOINT:
            data = formatEventData(request, response, appInstEvent)
            break;
        case endpoint.CLOUDLET_EVENT_LOG_ENDPOINT:
            data = formatEventData(request, response, cloudletEvent)
            break;
        case endpoint.CLIENT_METRICS_ENDPOINT:
            data = formatEventData(request, response, clientMetrics)
            break;
        case endpoint.APP_INST_USAGE_ENDPOINT:
            data = formatUsageData(request, response, appInstUsage)
            break;
        case endpoint.CLUSTER_INST_USAGE_ENDPOINT:
            data = formatUsageData(request, response, clusterInstUsage)
            break;
        case endpoint.ALERT_SHOW_RECEIVER:
            data = formatAlertData(request, response, alerts)
            break;
        case endpoint.SHOW_BILLING_ORG:
            data = formatShowData(request, response, billingorg)
            break;
        case endpoint.SHOW_POOL_ACCESS_CONFIRMATION:
        case endpoint.SHOW_POOL_ACCESS_INVITATION:
        case endpoint.SHOW_POOL_ACCESS_GRANTED:
        case endpoint.SHOW_POOL_ACCESS_PENDING:
            data = formatShowData(request, response, poolAccess)
            break;
        case endpoint.INVOICE_BILLING:
            data = formatChargifyData(request, response, invoices)
            break;
        case endpoint.SHOW_REPORTER:
            data = formatShowData(request, response, reporter)
            break;
        default:
            data = response && response.data ? response.data : [];
    }
    return { request, response: { data, status: response.status } }
}
