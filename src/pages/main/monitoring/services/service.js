import { endpoint } from "../../../../helper/constant";
import { PARENT_APP_INST, PARENT_CLOUDLET, PARENT_CLUSTER_INST } from "../../../../helper/constant/perpetual"
import { redux_org } from "../../../../helper/reduxData";
import { fields } from "../../../../services/model/format";
import { showAppInsts } from "../../../../services/modules/appInst";
import { appInstMetrics, appInstMetricTypeKeys, appMetricsListKeys } from "../../../../services/modules/appInstMetrics";
import { showCloudlets } from "../../../../services/modules/cloudlet";
import { cloudletMetricsListKeys, cloudletMetrics, cloudletUsageMetrics } from "../../../../services/modules/cloudletMetrics";
import { cloudletResourceKeys } from "../../../../services/modules/cloudletMetrics/cloudletMetrics";
import { showClusterInsts } from "../../../../services/modules/clusterInst";
import { clusterMetrics, clusterMetricsListKeys, clusterMetricTypeKeys } from "../../../../services/modules/clusterInstMetrics";
import { authSyncRequest, multiAuthSyncRequest, responseValid } from "../../../../services/service";
import { processWorker } from "../../../../services/worker/interceptor";
import { timezonePref } from "../../../../utils/sharedPreferences_util";
import ShowWorker from '../services/show.worker.js'

const showAPIs = (moduleId) => {
    switch (moduleId) {
        case PARENT_CLOUDLET:
            return [showCloudlets]
        case PARENT_APP_INST:
            return [showAppInsts, showCloudlets]
        case PARENT_CLUSTER_INST:
            return [showCloudlets, showClusterInsts]
    }
}

export const resourceAPIs = (self, method, data, list, org) => {
    switch (method) {
        case endpoint.CLOUDLET_METRICS_ENDPOINT:
            return cloudletMetrics(data, list, org)
        case endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT:
            return cloudletUsageMetrics(data, org)
        case endpoint.APP_INST_METRICS_ENDPOINT:
            return appInstMetrics(self, data, list, org)
        case endpoint.CLUSTER_METRICS_ENDPOINT:
            return clusterMetrics(self, data, list, org)
    }
}

export const legendKeys = (moduleId) => {
    switch (moduleId) {
        case PARENT_CLOUDLET:
            return cloudletMetricsListKeys
        case PARENT_APP_INST:
            return appMetricsListKeys
        case PARENT_CLUSTER_INST:
            return clusterMetricsListKeys
    }
}

export const resourceKeys = (moduleId) => {
    switch (moduleId) {
        case PARENT_CLOUDLET:
            return cloudletResourceKeys()
        case PARENT_APP_INST:
            return appInstMetricTypeKeys()
        case PARENT_CLUSTER_INST:
            return clusterMetricTypeKeys()
    }
}

export const fetchResourceData = async (self, moduleId, data) => {
    const { region, legends, legendList, resourceKey, range, worker } = data
    if (resourceKey.serverRequest && legendList && legendList.length > 0) {
        let data = {}
        data[fields.region] = region
        data[fields.starttime] = range.starttime
        data[fields.endtime] = range.endtime
        data[fields.selector] = resourceKey.serverField
        data[fields.numsamples] = 50
        let request = resourceAPIs(self, resourceKey.serverRequest, data, legendList, redux_org.nonAdminOrg(self))
        let mc = await authSyncRequest(this, { ...request, format: false })
        if (responseValid(mc)) {
            let response = await processWorker(worker, {
                response: { data: mc.response.data },
                request: request,
                parentId: moduleId,
                metricKeys: legendKeys(moduleId),
                region,
                metric: resourceKey,
                legends: legends,
                timezone: timezonePref()
            })
            if (response.status === 200) {
                return response
            }
        }
    }
}

//Fetch Show API (cloudlet, clusterInst, AppInst based on moduleId)
export const fetchShowData = async (self, moduleId, data) => {
    const { region } = data
    let requestList = showAPIs(moduleId).map(request => {
        let org = redux_org.nonAdminOrg(self)
        return request(self, { region, org })
    })
    let mcList = await multiAuthSyncRequest(this, requestList, false)
    if (mcList && mcList.length > 0) {
        let worker = ShowWorker()
        let response = await processWorker(worker, {
            requestList,
            parentId: moduleId,
            region,
            mcList,
            metricListKeys: legendKeys(moduleId),
            isOperator: redux_org.isOperator(self)
        })
        worker.terminate()
        if (response.status === 200 && response.list) {
            return { legends: response.data, legendList: response.list }
        }
    }
}