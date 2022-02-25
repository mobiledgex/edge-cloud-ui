import { cloudletResourceKeys } from '../../../../services/modules/cloudletMetrics/cloudletMetrics'
import { appInstMetrics, appInstResourceKeys, appMetricsListKeys } from '../../../../services/modules/appInstMetrics'
import { clusterMetrics, clusterMetricsListKeys, clusterResourceKeys } from '../../../../services/modules/clusterInstMetrics'
import { cloudletMetrics, cloudletMetricsListKeys, cloudletUsageMetrics } from '../../../../services/modules/cloudletMetrics'
import { showCloudlets } from "../../../../services/modules/cloudlet";
import { showAppInsts } from "../../../../services/modules/appInst";
import { PARENT_APP_INST, PARENT_CLOUDLET, PARENT_CLUSTER_INST } from '../../../../helper/constant/perpetual'
import { endpoint } from "../../../../helper/constant";
import { showClusterInsts } from '../../../../services/modules/clusterInst'

export const showAPIs = (moduleId) => {
    switch (moduleId) {
        case PARENT_CLOUDLET:
            return [showCloudlets]
        case PARENT_APP_INST:
            return [showAppInsts, showCloudlets]
        case PARENT_CLUSTER_INST:
            return [showCloudlets, showClusterInsts]
    }
}

export const resourceAPIs = (self, method, data, list) => {
    switch (method) {
        case endpoint.CLOUDLET_METRICS_ENDPOINT:
            return cloudletMetrics(self, data, list)
        case endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT:
            return cloudletUsageMetrics(self, data)
        case endpoint.APP_INST_METRICS_ENDPOINT:
            return appInstMetrics(self, data, list)
        case endpoint.CLUSTER_METRICS_ENDPOINT:
            return clusterMetrics(self, data, list)
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
            return appInstResourceKeys()
        case PARENT_CLUSTER_INST:
            return clusterResourceKeys()
    }
}

export const visibility = (id, keys) => {
    keys = keys ? keys : resourceKeys(id)
    let list = []
    for (let key of keys) {
        if (key.keys) {
            list = [...list, ...visibility(id, key.keys)]
        }
        else {
            list.push(key)
        }
    }
    return list
}


export const relativeTimeRanges = [
    { label: 'Last 5 minutes', duration: 5 },
    { label: 'Last 30 minutes', duration: 30 },
    { label: 'Last 1 hour', duration: 60 },
    { label: 'Last 3 hours', duration: 180 },
    { label: 'Last 6 hours', duration: 360 },
    { label: 'Last 12 hours', duration: 720 }
]

export const refreshRates = [
    { label: 'Off', duration: 0 },
    { label: '15s', duration: 15 },
    { label: '30s', duration: 30 },
    { label: '1m', duration: 60 },
    { label: '5m', duration: 300 },
    { label: '15m', duration: 900 },
    { label: '30m', duration: 1800 },
    { label: '1h', duration: 3600 },
    { label: '2h', duration: 7200 }
]