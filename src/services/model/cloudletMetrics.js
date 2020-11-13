
import * as formatter from './format'
import { CLOUDLET_METRICS_ENDPOINT } from './endPointTypes'
import { convertByteToMegaGigaByte } from '../../utils/math_util'

let fields = formatter.fields;

export const cloudletMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', serverField: 'region', visible: true, groupBy: true },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, groupBy: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, groupBy: true }
]

export const cloudletMetricsListKeys = [
    { field: 'region', label: 'Region', sortable: true, visible: true },
    { field: 'cloudlet', label: 'Cloudlet', sortable: true, visible: true },
    { field: 'cloudletorg', label: 'Operator', sortable: true, visible: true },
    { field: 'cpu', label: 'vCpu Usage', sortable: true, visible: true, isArray: true },
    { field: 'disk', label: 'Disk Usage', sortable: true, visible: true, isArray: true },
    { field: 'mem', label: 'Memory Usage', sortable: true, visible: true, isArray: true },
]

export const cloudletMetricTypeKeys = [
    { field: 'cpu', serverField: 'utilization', subId: 'vCpuUsed', header: 'vCpu Usage', position: 6, unit: 2, serverRequest: true },
    { field: 'disk', serverField: 'utilization', subId: 'diskUsed', header: 'Disk Usage', position: 10, unit: 1, serverRequest: false },
    { field: 'mem', serverField: 'utilization', subId: 'memUsed', header: 'Memory Usage', position: 8, unit: 1, serverRequest: false },
]

export const cloudletMetrics = (data) => {

    if (!formatter.isAdmin()) {
        {
            data.cloudlet = {
                organization: formatter.getOrganization()
            }
        }
    }
    return { method: CLOUDLET_METRICS_ENDPOINT, data: data, keys: cloudletMetricsKeys }
}

export const getData = (response, body) => {
    return formatter.formatEventData(response, body, cloudletMetricsKeys)
}

