
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
    { field: fields.region, label: 'Region', sortable: true, visible: true, groupBy: true  },
    { field: fields.cloudletName, label: 'Cloudlet', sortable: true, visible: true, groupBy: true  },
    { field: fields.operatorName, label: 'Operator', sortable: true, visible: true, groupBy: true  },
    { field: fields.cloudletLocation, label: 'Location', visible: false  },
    // { field: 'cpu', label: 'vCpu Usage', sortable: true, visible: true },
    // { field: 'disk', label: 'Disk Usage', sortable: true, visible: true },
    // { field: 'mem', label: 'Memory Usage', sortable: true, visible: true },
]

export const cloudletMetricTypeKeys = [
    { field: 'cpu', serverField: 'utilization', subId: 'vCpuUsed', header: 'vCpu Usage', position: 6, serverRequest: true },
    { field: 'disk', serverField: 'utilization', subId: 'diskUsed', header: 'Disk Usage', position: 10, unit: 5, serverRequest: false },
    { field: 'mem', serverField: 'utilization', subId: 'memUsed', header: 'Memory Usage', position: 8, unit: 4, serverRequest: false },
    { field: 'map', header: 'Map', serverRequest: false },
    { field: 'event', header: 'Event', serverRequest: false },
]

export const cloudletMetrics = (data, org) => {
    data.cloudlet = {
        organization: org
    }
    return { method: CLOUDLET_METRICS_ENDPOINT, data: data, keys: cloudletMetricsKeys }
}

export const getData = (response, body) => {
    return formatter.formatEventData(response, body, cloudletMetricsKeys)
}

