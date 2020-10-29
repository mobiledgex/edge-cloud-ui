
import * as formatter from './format'
import { CLUSTER_METRICS_ENDPOINT } from './endPointTypes'
import { convertByteToMegaGigaByte } from '../../utils/math_util'

let fields = formatter.fields;

export const clusterMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', serverField: 'region', visible: true, groupBy: true },
    { label: 'Cluster', serverField: 'cluster', visible: true, groupBy: true },
    { label: 'Cluster Developer', serverField: 'clusterorg', visible: true, groupBy: true },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, groupBy: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, groupBy: true }
]

export const clusterMetricsListKeys = [
    { field: 'region', label: 'Region', sortable: true, visible: true },
    { field: 'cluster', label: 'Cluster', sortable: true, visible: true },
    { field: 'clusterorg', label: 'Cluster Developer', sortable: true, visible: true },
    { field: 'cloudlet', label: 'Cloudlet', sortable: true, visible: true },
    { field: 'cloudletorg', label: 'Operator', sortable: true, visible: true },
    { field: 'cpu', label: 'CPU', sortable: true, visible: true, isArray: true },
    { field: 'disk', label: 'Disk Usage', sortable: true, visible: true, isArray: true },
    { field: 'mem', label: 'Memory', sortable: true, visible: true, isArray: true },
    { field: 'sent', label: 'Network Sent', sortable: true, visible: true, isArray: true },
    { field: 'received', label: 'Network Received', sortable: true, visible: true, isArray: true }
]

export const clusterMetricTypeKeys = [
    { field: 'cpu', serverField: 'cpu', header: 'CPU', position: 6, unit: (value) => { return value.toFixed(3) + " %" }, serverRequest: true },
    { field: 'mem', serverField: 'mem', header: 'Memory', position: 7, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) }, serverRequest: false },
    { field: 'disk', serverField: 'disk', header: 'Disk Usage', position: 8, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) }, serverRequest: false },
    { field: 'sent', serverField: 'network', subId: 'sendBytes', header: 'Network Sent', position: 9, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) }, serverRequest: false },
    { field: 'received', serverField: 'network', subId: 'recvBytes', header: 'Network Received', position: 10, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) }, serverRequest: false }
]

export const clusterMetrics = (data) => {

    if (!formatter.isAdmin()) {
        {
            data.clusterinst = {
                organization: formatter.getOrganization()
            }
        }
    }
    return { method: CLUSTER_METRICS_ENDPOINT, data: data, showSpinner: false }
}

export const getData = (response, body) => {
    return formatter.formatEventData(response, body, clusterMetricsKeys)
}

