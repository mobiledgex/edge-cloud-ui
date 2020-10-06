import * as mainConstant from '../../../../constant'
import { appInstMetrics, appInstMetricTypeKeys, appMetricsListKeys } from '../../../../services/model/appMetrics'
import { clusterMetrics, clusterMetricTypeKeys, clusterMetricsListKeys } from '../../../../services/model/clusterMetrics'
import { cloudletMetrics, cloudletMetricTypeKeys, cloudletMetricsListKeys } from '../../../../services/model/cloudletMetrics'

export const DEVELOPER = mainConstant.DEVELOPER

export const summaryList = [
    { label: 'Avg', field: 'avg', position: 0 },
    { label: 'Min', field: 'min', position: 1 },
    { label: 'Max', field: 'max', position: 2 },
]

export const metricParentTypes = [
    { id:'appinst', label: 'App Inst', request: appInstMetrics, metricTypeKeys: appInstMetricTypeKeys, metricListKeys: appMetricsListKeys, role: [mainConstant.DEVELOPER] },
    { id:'cluster', label: 'Cluster Inst', request: clusterMetrics, metricTypeKeys: clusterMetricTypeKeys, metricListKeys: clusterMetricsListKeys, role: [mainConstant.DEVELOPER] },
    { id:'cloudlet', label: 'Cloudlet', request: cloudletMetrics, metricTypeKeys: cloudletMetricTypeKeys, metricListKeys: cloudletMetricsListKeys, role: [mainConstant.OPERATOR] },
]