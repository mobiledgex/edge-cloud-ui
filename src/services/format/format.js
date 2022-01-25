import * as endpoint from '../../helper/constant/endpoint';
import { customize as organization } from '../modules/organization/custom';
import { customize as users } from '../modules/users/custom';
import { customize as accounts } from '../modules/accounts/custom';
import { customize as cloudlet } from '../modules/cloudlet/custom';
import { customize as cloudletInfo } from '../modules/cloudletInfo/custom';
import { customize as clusterInst } from '../modules/clusterInst/custom';
import { customize as app } from '../modules/app/custom';
import { customize as appInst } from '../modules/appInst/custom';
import { customize as flavor } from '../modules/flavor/custom';
import { customize as cloudletPool } from '../modules/cloudletPool/custom';
import { customize as autoProvPolicy } from '../modules/autoProvPolicy/custom';
import { customize as trustPolicy } from '../modules/trustPolicy/custom';
import { customize as autoScalePolicy } from '../modules/autoScalePolicy/custom';
import { customize as poolAccess } from '../modules/poolAccess/custom';
import { customize as alerts } from '../modules/alerts/custom';
import { customize as billingorg } from '../modules/billingorg/custom';
import { customize as invoices } from '../modules/invoices/custom';
import { customize as reporter } from '../modules/reporter/custom';
import { customize as cloudletEvent } from '../modules/cloudletEvent/custom';
import { customize as clusterInstEvent } from '../modules/clusterInstEvent/custom';
import { customize as appInstEvent } from '../modules/appInstEvent/custom';
import { customize as clusterInstMetrics } from '../modules/clusterInstMetrics/custom';
import { customize as appInstMetrics } from '../modules/appInstMetrics/custom';
import { customize as cloudletMetrics } from '../modules/cloudletMetrics/custom';
import { customize as cloudletMetricUsage } from '../modules/cloudletMetricUsage/custom';
import { customize as appInstUsage } from '../modules/appInstUsage/custom';
import { customize as clusterInstUsage } from '../modules/clusterInstUsage/custom';
import { customize as gpuDriver } from '../modules/gpudriver/custom';
import { customize as alertPolicy } from '../modules/alertPolicy/custom';
import { customize as network } from '../modules/network/custom';
import { customize as federation } from '../modules/federation/custom';
import { customize as federator } from '../modules/federator/custom';
import { customize as selfZone } from '../modules/zones/custom';
import { formatShowData } from './show';
import { formatChargifyData } from './chargify';
import { formatAlertData } from './alert';
import { formatBillingData, formatMetricData, formatMetricUsageData } from './event';
import { formatUsageData } from './usage';
import { formatCloudletPropsData } from './cloudletProps';

export const formatData = (request, response, self = null) => {
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
        case endpoint.SHOW_NODE:
            data = formatShowData(request, response)
            break;
        case endpoint.SHOW_CLOUDLET:
        case endpoint.SHOW_ORG_CLOUDLET:
            data = formatShowData(request, response, cloudlet, true)
            break;
        case endpoint.SHOW_CLOUDLET_INFO:
        case endpoint.SHOW_ORG_CLOUDLET_INFO:
            data = formatShowData(request, response, cloudletInfo, true)
            break;
        case endpoint.GET_CLOUDLET_PROPS:
            data = formatCloudletPropsData(request, response)
            break;
        case endpoint.SHOW_GPU_DRIVER:
            data = formatShowData(request, response, gpuDriver)
            break;
        case endpoint.SHOW_CLUSTER_INST:
            data = formatShowData(request, response, clusterInst, true)
            break;
        case endpoint.SHOW_FLAVOR:
            data = formatShowData(request, response, flavor)
            break;
        case endpoint.SHOW_FLAVORS_FOR_CLOUDLET:
            data = formatShowData(request, response, undefined)
            break;
        case endpoint.SHOW_APP:
            data = formatShowData(request, response, app)
            break;
        case endpoint.SHOW_CLOUDLETS_FOR_APP:
            data = formatShowData(request, response, undefined)
            break;
        case endpoint.SHOW_APP_INST:
            data = formatShowData(request, response, appInst, true, self)
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
            data = formatMetricData(request, response, cloudletMetrics)
            break;
        case endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT:
            data = formatMetricUsageData(request, response, cloudletMetricUsage)
            break;
        case endpoint.APP_INST_METRICS_ENDPOINT:
            data = formatMetricData(request, response, appInstMetrics)
            break;
        case endpoint.CLUSTER_METRICS_ENDPOINT:
            data = formatMetricData(request, response, clusterInstMetrics)
            break;
        case endpoint.CLUSTER_EVENT_LOG_ENDPOINT:
            data = formatBillingData(request, response, clusterInstEvent)
            break;
        case endpoint.APP_INST_EVENT_LOG_ENDPOINT:
            data = formatBillingData(request, response, appInstEvent)
            break;
        case endpoint.CLOUDLET_EVENT_LOG_ENDPOINT:
            data = formatBillingData(request, response, cloudletEvent)
            break;
        case endpoint.APP_INST_USAGE_ENDPOINT:
            data = formatUsageData(request, response, appInstUsage)
            break;
        case endpoint.CLUSTER_INST_USAGE_ENDPOINT:
            data = formatUsageData(request, response, clusterInstUsage)
            break;
        case endpoint.SHOW_ALERT:
            data = formatShowData(request, response, alerts, true)
            break;
        case endpoint.ALERT_SHOW_RECEIVER:
            data = formatAlertData(request, response, alerts)
            break;
        case endpoint.SHOW_BILLING_ORG:
            data = formatShowData(request, response, billingorg)
            break;
        case endpoint.SHOW_NETWORKS:
            data = formatShowData(request, response, network)
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
        case endpoint.SHOW_ALERT_POLICY:
            data = formatShowData(request, response, alertPolicy)
            break;
        case endpoint.SHOW_NETWORKS:
            data = formatShowData(request, response, network)
            break;
        case endpoint.SHOW_FEDERATION:
            data = formatShowData(request, response, federation)
            console.log(data, "data")
            break;
        case endpoint.SHOW_FEDERATOR:
            data = formatShowData(request, response, federator)
            break;
        case endpoint.SHOW_SELF_ZONES:
            data = formatShowData(request, response, selfZone)
            break;
        default:
            data = response && response.data ? response.data : [];
    }
    return { request, response: { data, status: response.status } }
}
