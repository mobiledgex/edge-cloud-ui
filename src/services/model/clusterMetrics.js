
import * as formatter from './format'
import { CLUSTER_METRICS_ENDPOINT } from './endPointTypes'

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
    { field: fields.region, label: 'Region', sortable: true, visible: true, groupBy: true  },
    { field: fields.clusterName, label: 'Cluster', sortable: true, visible: true, groupBy: true  },
    { field: fields.cloudletName, label: 'Cloudlet', sortable: true, visible: true, groupBy: true  },
    { field: fields.operatorName, label: 'Operator', sortable: true, visible: true, groupBy: true  },
    { field: fields.cloudletLocation, label: 'Location', sortable: false, visible: false, groupBy: false },
    { field: 'cpu', label: 'CPU', sortable: true, visible: true, isArray: true },
    { field: 'disk', label: 'Disk Usage', sortable: true, visible: true, isArray: true },
    { field: 'memory', label: 'Memory', sortable: true, visible: true, isArray: true },
    { field: 'sent', label: 'Network Sent', sortable: true, visible: true, isArray: true },
    { field: 'received', label: 'Network Received', sortable: true, visible: true, isArray: true }
]

export const clusterMetricTypeKeys = [
    { field: 'cpu', serverField: 'cpu', header: 'CPU', position: 6, unit: 2, serverRequest: true },
    { field: 'memory', serverField: 'mem', header: 'Memory', position: 7, unit: 1, serverRequest: false },
    { field: 'disk', serverField: 'disk', header: 'Disk Usage', position: 8, unit: 1, serverRequest: false },
    { field: 'sent', serverField: 'network', subId: 'sendBytes', header: 'Network Sent', position: 9, unit: 1, serverRequest: false },
    { field: 'received', serverField: 'network', subId: 'recvBytes', header: 'Network Received', position: 10, unit: 1, serverRequest: false },
    { field: 'map', header: 'Map', serverRequest: false }
]

export const clusterMetrics = (data, org) => {
    data.clusterinst = {
        organization: org
    }
    return { method: CLUSTER_METRICS_ENDPOINT, data: data, keys: clusterMetricsKeys }
}

export const getData = (response, body) => {
    return formatter.formatEventData(response, body, clusterMetricsKeys)
}

