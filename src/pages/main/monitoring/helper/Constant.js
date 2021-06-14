import { appInstMetrics, appInstMetricTypeKeys, appMetricsListKeys, fetchLocation, customData as appCustomData, appInstActions } from '../../../../services/modules/appInstMetrics'
import { showAppInsts } from '../../../../services/modules/appInst'
import { clusterMetrics, clusterMetricTypeKeys, clusterMetricsListKeys } from '../../../../services/modules/clusterInstMetrics'
import { cloudletMetrics, cloudletMetricTypeKeys, cloudletMetricsListKeys, customData as cloudletCustomData, cloudletUsageMetrics } from '../../../../services/model/cloudletMetrics'
import { showCloudlets } from '../../../../services/modules/cloudlet'
import { showClusterInsts } from '../../../../services/modules/clusterInst'
import { endpoint, perpetual } from '../../../../helper/constant'

export const DEVELOPER = perpetual.DEVELOPER
export const OPERATOR = perpetual.OPERATOR

export const ACTION_REGION = 0
export const ACTION_METRIC_PARENT_TYPE = 1
export const ACTION_METRIC_TYPE = 2
export const ACTION_SUMMARY = 3
export const ACTION_SEARCH = 4
export const ACTION_REFRESH_RATE = 5
export const ACTION_TIME_RANGE = 6
export const ACTION_RELATIVE_TIME = 7
export const ACTION_REFRESH = 8
export const ACTION_MINIMIZE = 9
export const ACTION_ORG = 10

export const PARENT_APP_INST = 'appinst'
export const PARENT_CLUSTER_INST = 'cluster'
export const PARENT_CLOUDLET = 'cloudlet'

export const metricType = (id) => {
    switch (id) {
        case PARENT_APP_INST:
            return appInstMetricTypeKeys()
        case PARENT_CLUSTER_INST:
            return clusterMetricTypeKeys()
        case PARENT_CLOUDLET:
            return cloudletMetricTypeKeys()
    }
}

export const monitoringActions = (id) => {
    switch (id) {
        case PARENT_APP_INST:
            return appInstActions
    }
}

export const metricRequest = (method, data, org, isPrivate) => {
    switch (method) {
        case endpoint.APP_INST_METRICS_ENDPOINT:
            return appInstMetrics(data, org, isPrivate)
        case endpoint.CLUSTER_METRICS_ENDPOINT:
            return clusterMetrics(data, org, isPrivate)
        case endpoint.CLOUDLET_METRICS_ENDPOINT:
            return cloudletMetrics(data, org)
        case endpoint.CLOUDLET_METRICS_USAGE_ENDPOINT:
            return cloudletUsageMetrics(data, org)
    }
}

export const visibility = (id, keys) => {
    keys = keys ? keys : metricType(id)
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

export const summaryList = [
    { label: 'Max', field: 'max', position: 2, metricType: [PARENT_APP_INST, PARENT_CLUSTER_INST] },
    { label: 'Avg', field: 'avg', position: 0, metricType: [PARENT_APP_INST, PARENT_CLUSTER_INST] },
    { label: 'Min', field: 'min', position: 1, metricType: [PARENT_APP_INST, PARENT_CLUSTER_INST] }
]

export const metricParentTypes = () => ([
    { id: PARENT_APP_INST, label: 'App Inst', showRequest: [showAppInsts], metricListKeys: appMetricsListKeys, role: [perpetual.ADMIN, perpetual.DEVELOPER], fetchLocation: fetchLocation, customData: appCustomData },
    { id: PARENT_CLUSTER_INST, label: 'Cluster Inst', showRequest: [showCloudlets, showClusterInsts], metricListKeys: clusterMetricsListKeys, role: [perpetual.ADMIN, perpetual.DEVELOPER] },
    { id: PARENT_CLOUDLET, label: 'Cloudlet', showRequest: [showCloudlets], metricListKeys: cloudletMetricsListKeys, role: [perpetual.ADMIN, perpetual.OPERATOR], customData: cloudletCustomData }
])

export const validateRole = (roles, selectedRole) => {
    let valid = false
    if (selectedRole) {
        for (let i = 0; i < roles.length; i++) {
            if (selectedRole.includes(roles[i])) {
                valid = true
                break;
            }
        }
        return valid
    }
    return true
}


export const relativeTimeRanges = [
    { label: 'Last 5 minutes', duration: 5 },
    { label: 'Last 15 minutes', duration: 15 },
    { label: 'Last 30 minutes', duration: 30 },
    { label: 'Last 1 hour', duration: 60 },
    { label: 'Last 3 hours', duration: 180 },
    { label: 'Last 6 hours', duration: 360 },
    { label: 'Last 12 hours', duration: 720 },
]

export const refreshRates = [
    { label: 'Off', duration: 0 },
    // { label: '5s', duration: 5 },
    // { label: '10s', duration: 10 },
    { label: '30s', duration: 30 },
    { label: '1m', duration: 60 },
    { label: '5m', duration: 300 },
    { label: '15m', duration: 900 },
    { label: '30m', duration: 1800 },
    { label: '1h', duration: 3600 },
    { label: '2h', duration: 7200 },
    { label: '1d', duration: 86400 }
]

export const mapGridHeight = (minimize, selected) => {
    return minimize ? 'calc(100vh - 117px)' : selected === 1 ? 'calc(100vh - 335px)' : 'calc(100vh - 287px)'
}