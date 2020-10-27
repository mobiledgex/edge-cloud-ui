import * as mainConstant from '../../../../constant'
import { appInstMetrics, appInstMetricTypeKeys, appMetricsListKeys, appActions, fetchLocation } from '../../../../services/model/appMetrics'
import { showAppInsts } from '../../../../services/model/appInstance'
import { clusterMetrics, clusterMetricTypeKeys, clusterMetricsListKeys } from '../../../../services/model/clusterMetrics'
import { showClusterInsts } from '../../../../services/model/clusterInstance'
import { cloudletMetrics, cloudletMetricTypeKeys, cloudletMetricsListKeys } from '../../../../services/model/cloudletMetrics'
import { showCloudlets } from '../../../../services/model/cloudlet'

export const DEVELOPER = mainConstant.DEVELOPER
export const OPERATOR = mainConstant.OPERATOR

export const summaryList = [
    { label: 'Avg', field: 'avg', position: 0 },
    { label: 'Min', field: 'min', position: 1 },
    { label: 'Max', field: 'max', position: 2 },
]

export const metricParentTypes = [
    { id: 'appinst', label: 'App Inst', showRequest: showAppInsts, request: appInstMetrics, metricTypeKeys: appInstMetricTypeKeys, metricListKeys: appMetricsListKeys, role: [mainConstant.DEVELOPER], fetchLocation:fetchLocation },
    { id: 'cluster', label: 'Cluster Inst', showRequest: showClusterInsts, request: clusterMetrics, metricTypeKeys: clusterMetricTypeKeys, metricListKeys: clusterMetricsListKeys, role: [mainConstant.DEVELOPER] },
    { id: 'cloudlet', label: 'Cloudlet', showRequest: showCloudlets,request: cloudletMetrics, metricTypeKeys: cloudletMetricTypeKeys, metricListKeys: cloudletMetricsListKeys, role: [mainConstant.OPERATOR] },
]