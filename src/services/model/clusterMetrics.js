
import * as formatter from './format'
import { CLUSTER_METRICS_ENDPOINT } from './endPointTypes'
import { UNIT_BYTES, UNIT_PERCENTAGE } from '../../pages/main/monitoring/helper/unitConvertor';

let fields = formatter.fields;

export const clusterMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', serverField: 'region', visible: true, groupBy: true },
    { label: 'Cluster', serverField: 'cluster', visible: true, groupBy: true },
    { label: 'Cluster Developer', serverField: 'clusterorg', visible: true, groupBy: false },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, groupBy: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, groupBy: true }
]

export const clusterMetricsListKeys = [
    { field: fields.region, label: 'Region', sortable: true, visible: false, groupBy: true },
    { field: fields.clusterName, label: 'Cluster', sortable: true, visible: true, groupBy: true },
    { field: fields.cloudletName, label: 'Cloudlet', sortable: true, visible: true, groupBy: true },
    { field: fields.operatorName, label: 'Operator', sortable: true, visible: true, groupBy: true },
    { field: fields.cloudletLocation, label: 'Location', sortable: false, visible: false, groupBy: false },
    { field: 'cpu', label: 'CPU', sortable: true, visible: true, isArray: true },
    { field: 'disk', label: 'Disk Usage', sortable: true, visible: true, isArray: true },
    { field: 'memory', label: 'Memory', sortable: true, visible: true, isArray: true },
    { field: 'sent', label: 'Network Sent', sortable: true, visible: true, isArray: true },
    { field: 'received', label: 'Network Received', sortable: true, visible: true, isArray: true }
]

export const networkMetricType = [
    { field: 'sent', serverField: 'network', subId: 'sendBytes', header: 'Network Sent', position: 6, unit: UNIT_BYTES },
    { field: 'received', serverField: 'network', subId: 'recvBytes', header: 'Network Received', position: 7, unit: UNIT_BYTES },
]

export const clusterMetricTypeKeys = () => ([
    { field: 'cpu', serverField: 'cpu', header: 'CPU', position: 6, unit: UNIT_PERCENTAGE, serverRequest: CLUSTER_METRICS_ENDPOINT },
    { field: 'memory', serverField: 'mem', header: 'Memory', position: 6, unit: UNIT_PERCENTAGE, serverRequest: CLUSTER_METRICS_ENDPOINT },
    { field: 'disk', serverField: 'disk', header: 'Disk Usage', position: 6, unit: UNIT_PERCENTAGE, serverRequest: CLUSTER_METRICS_ENDPOINT },
    { field: 'network', serverField: 'network', serverRequest: CLUSTER_METRICS_ENDPOINT, keys: networkMetricType },
    { field: 'map', header: 'Map' }
])

export const clusterMetrics = (data, organization, isPrivate) => {
    data.clusterinst = isPrivate ? { cloudlet_key: { organization } } : { organization }
    return { method: CLUSTER_METRICS_ENDPOINT, data: data, keys: clusterMetricsKeys }
}

export const getData = (response, body) => {
    return formatter.formatEventData(response, body, clusterMetricsKeys)
}

