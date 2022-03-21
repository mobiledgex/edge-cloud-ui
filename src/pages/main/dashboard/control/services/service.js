import { appInstKeys, showAppInsts } from "../../../../../services/modules/appInst";
import { appInstMetrics, appInstMetricsElements } from "../../../../../services/modules/appInstMetrics";
import { showCloudlets } from "../../../../../services/modules/cloudlet";
import { showCloudletInfoData } from "../../../../../services/modules/cloudletInfo";
import { cloudletMetricsElements, cloudletUsageMetrics } from "../../../../../services/modules/cloudletMetrics/cloudletMetrics";
import { clusterInstKeys, showClusterInsts } from "../../../../../services/modules/clusterInst";
import { clusterInstMetricsElements, clusterMetrics } from "../../../../../services/modules/clusterInstMetrics";
import { authSyncRequest, multiAuthSyncRequest } from "../../../../../services/service";
import { processWorker } from "../../../../../services/worker/interceptor";
import { sequence } from './sequence';
import { formatMetricData } from "./metric";
import { AIK_APP_CLOUDLET_CLUSTER } from "../../../../../services/modules/appInst/primary";
import { CIK_CLOUDLET_CLUSTER } from "../../../../../services/modules/clusterInst/primary";
import { localFields } from "../../../../../services/fields";

/**
 * 
 * @param {Object} item sunburst selection 
 * @returns resources 
 */
export const fetchSpecificResources = async (self, item) => {
    let resources = undefined
    if (item.data) {
        let data = item.data
        let numsamples = 1
        data.region = 'US'
        data.selector = '*'
        data.numsamples = numsamples
        if (item.field === localFields.cloudletName || item.field === localFields.appName || item.field === localFields.clusterName) {
            let elements
            let request
            if (item.field === localFields.cloudletName) {
                elements = cloudletMetricsElements
                request = cloudletUsageMetrics(self, data, true)
            }
            else if (item.field === localFields.appName) {
                elements = appInstMetricsElements
                request = appInstMetrics(self, data, [appInstKeys(data, AIK_APP_CLOUDLET_CLUSTER)])
            }
            else {
                elements = clusterInstMetricsElements
                request = clusterMetrics(self, data, [clusterInstKeys(data, CIK_CLOUDLET_CLUSTER)])
            }
            await Promise.all(elements.map(async (element) => {
                request.data.selector = element.selector ? element.selector : request.data.selector
                let mc = await authSyncRequest(self, { ...request, format: false })
                let metricData = formatMetricData(element, numsamples, mc)
                if (metricData) {
                    if (element.selector === 'flavorusage' && metricData) {
                        const { flavorName, count } = metricData
                        resources = resources ? resources : {}
                        resources.flavor = { label: 'Flavor', value: `${flavorName?.value} [${count?.value ?? 0}]` }
                    }
                    else {
                        resources = { ...resources, ...metricData }
                    }
                }
            }))
        }
    }
    return resources
}

/**
 * 
 * @param {Object} worker control worker object 
 * @returns 
 */
export const fetchShowData = async (self, worker) => {
    let response = undefined
    await Promise.all(['US'].map(async (region) => {
        let requestList = [];
        [showCloudlets, showCloudletInfoData, showClusterInsts, showAppInsts].forEach(requestType => {
            let request = requestType(self, Object.assign({}, { region }))
            requestList.push(request)
        })
        if (requestList.length > 0) {
            let mcList = await multiAuthSyncRequest(self, requestList, false)
            response = await processWorker(self, worker, {
                region,
                rawList: mcList,
                initFormat: true,
                sequence
            })
        }
    }))
    return response
}