import * as formatter from './format'
import { CLOUDLET_METRICS_ENDPOINT } from './endPointTypes'

let fields = formatter.fields;

export const customData = (id, data) => {
    switch (id) {
        case fields.cloudletName:
            return `${data[fields.cloudletName]} [${data[fields.operatorName]}]`

    }
}

export const cloudletMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', serverField: 'region', visible: true, groupBy: true },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, groupBy: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, groupBy: true }
]

export const cloudletMetricsListKeys = [
    { field: fields.region, label: 'Region', sortable: true, visible: false, groupBy: true  },
    { field: fields.cloudletName, label: 'Cloudlet', sortable: true, visible: true, groupBy: true, customData:true  },
    { field: fields.operatorName, label: 'Operator', sortable: true, visible: false, groupBy: true  },
    { field: fields.cloudletLocation, label: 'Location', visible: false  },
    { field: 'cpu', label: 'vCpu Usage', sortable: true, visible: true },
    { field: 'disk', label: 'Disk Usage', sortable: true, visible: true },
    { field: 'memory', label: 'Memory Usage', sortable: true, visible: true },
]

export const cloudletMetricTypeKeys = [
    { field: 'cpu', serverField: 'utilization', subId: 'vCpuUsed', header: 'vCpu Usage', position: 4, serverRequest: true },
    { field: 'disk', serverField: 'utilization', subId: 'diskUsed', header: 'Disk Usage', position: 4, unit: 5, serverRequest: true },
    { field: 'memory', serverField: 'utilization', subId: 'memUsed', header: 'Memory Usage', position: 4, unit: 4, serverRequest: true },
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

