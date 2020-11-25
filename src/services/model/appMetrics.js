
import * as formatter from './format'
import { APP_INST_METRICS_ENDPOINT } from './endPointTypes'

let fields = formatter.fields;

export const appMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', serverField: 'region', visible: true, groupBy: true },
    { label: 'App', serverField: 'app', visible: true, groupBy: true, filter: true },
    { label: 'Version', serverField: 'ver', visible: true, groupBy: true },
    { label: 'Cluster', serverField: 'cluster', visible: true, groupBy: true },
    { label: 'Cluster Developer', serverField: 'clusterorg', visible: true, groupBy: true },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, groupBy: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, groupBy: true },
    { label: 'App Developer', serverField: 'apporg', visible: false, groupBy: true }
]

export const appMetricsListKeys = [
    { field: 'region', label: 'Region', sortable: true, visible: true },
    { field: 'app', label: 'App', sortable: true, visible: false },
    { field: 'ver', label: 'Version', sortable: true, visible: false },
    { field: 'cloudlet', label: 'Cloudlet', sortable: true, visible: true },
    { field: 'cloudletorg', label: 'Operator', sortable: true, visible: true },
    { field: 'cluster', label: 'Cluster', sortable: true, visible: true },
    // { field: 'clusterorg', label: 'Cluster Developer', sortable: true, visible: false },
    { field: 'cpu', label: 'CPU', sortable: true, visible: true, isArray: true },
    { field: 'disk', label: 'Disk Usage', sortable: true, visible: true, isArray: true },
    { field: 'mem', label: 'Memory', sortable: true, visible: true, isArray: true },
    { field: 'sent', label: 'Network Sent', sortable: true, visible: true, isArray: true },
    { field: 'received', label: 'Network Received', sortable: true, visible: true, isArray: true },
    { field: 'connections', label: 'Active Connections', sortable: true, visible: true, isArray: true },
]



export const appInstMetricTypeKeys = [
    { field: 'cpu', serverField: 'cpu', header: 'CPU', position: 10, unit: 2, serverRequest: true },
    { field: 'mem', serverField: 'mem', header: 'Memory', position: 11, unit: 1, serverRequest: false },
    { field: 'disk', serverField: 'disk', header: 'Disk Usage', position: 12, unit: 1, serverRequest: false },
    { field: 'sent', serverField: 'network', subId: 'sendBytes', header: 'Network Sent', position: 13, unit: 1, serverRequest: false },
    { field: 'received', serverField: 'network', subId: 'recvBytes', header: 'Network Received', position: 14, unit: 1, serverRequest: false },
    { field: 'connections', serverField: 'connections', subId: 'active', header: 'Active Connections', position: 16, unit: 3, serverRequest: false },
]

export const appActions = [
    { label: 'Show Clients' }
]

export const fetchLocation = (avgValues, metricData, showList) => {
    for (let i = 0; i < showList.length; i++) {
        let show = showList[i]
        let valid = metricData.includes(show[fields.region]) &&
            metricData.includes(show[fields.appName].toLowerCase()) &&
            metricData.includes(show[fields.organizationName]) &&
            metricData.includes(show[fields.clusterName]) &&
            metricData.includes(show[fields.clusterdeveloper]) &&
            metricData.includes(show[fields.cloudletName]) &&
            metricData.includes(show[fields.operatorName])
        if (valid) {
            avgValues['location'] = show[fields.cloudletLocation]
            avgValues[fields.healthCheck] = show[fields.healthCheck]
            avgValues['showData'] = show
        }
    }
    return avgValues
}

export const appInstMetrics = (data, org) => {
    data.appinst = {
        app_key: {
            organization: org
        }
    }

    return { method: APP_INST_METRICS_ENDPOINT, data: data, keys: appMetricsKeys }
}

export const getData = (response, body) => {
    return formatter.formatEventData(response, body, appMetricsKeys)
}

