import * as mainConstant from '../../../../constant'
import { appInstMetrics, appInstMetricTypeKeys, appMetricsListKeys, fetchLocation } from '../../../../services/model/appMetrics'
import { showAppInsts  } from '../../../../services/model/appInstance'
import { clusterMetrics, clusterMetricTypeKeys, clusterMetricsListKeys } from '../../../../services/model/clusterMetrics'
import { cloudletMetrics, cloudletMetricTypeKeys, cloudletMetricsListKeys } from '../../../../services/model/cloudletMetrics'
import { showCloudlets } from '../../../../services/model/cloudlet'

export const DEVELOPER = mainConstant.DEVELOPER
export const OPERATOR = mainConstant.OPERATOR

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

export const summaryList = [
    { label: 'Avg', field: 'avg', position: 0 },
    { label: 'Min', field: 'min', position: 1 },
    { label: 'Max', field: 'max', position: 2 },
]

export const metricParentTypes = [
    { id: 'appinst', label: 'App Inst', showRequest: showAppInsts, request: appInstMetrics, metricTypeKeys: appInstMetricTypeKeys, metricListKeys: appMetricsListKeys, role: [mainConstant.DEVELOPER], fetchLocation: fetchLocation },
    { id: 'cluster', label: 'Cluster Inst', showRequest: showCloudlets, request: clusterMetrics, metricTypeKeys: clusterMetricTypeKeys, metricListKeys: clusterMetricsListKeys, role: [mainConstant.DEVELOPER] },
    { id: 'cloudlet', label: 'Cloudlet', showRequest: showCloudlets, request: cloudletMetrics, metricTypeKeys: cloudletMetricTypeKeys, metricListKeys: cloudletMetricsListKeys, role: [mainConstant.OPERATOR] },
]

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
    // { label: '30s', duration: 30 },
    { label: '30s', duration: 30 },
    { label: '1m', duration: 60 },
    { label: '5m', duration: 300 },
    { label: '15m', duration: 900 },
    { label: '30m', duration: 1800 },
    { label: '1h', duration: 3600 },
    { label: '2h', duration: 7200 },
    { label: '1d', duration: 86400 }
]