
import * as formatter from './format'
import { APP_INST_METRICS_ENDPOINT } from './endPointTypes'
import { healthCheck } from '../../constant'

let fields = formatter.fields;

export const appMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', field: fields.region, serverField: 'region', visible: true, groupBy: true },
    { label: 'App', field: fields.appName, serverField: 'app', visible: true, groupBy: true, filter: true },
    { label: 'Version', field: fields.version, serverField: 'ver', visible: true, groupBy: true },
    { label: 'App Developer', field: fields.organizationName, serverField: 'apporg', visible: true, groupBy: false },
    { label: 'Cluster', field: fields.clusterName, serverField: 'cluster', visible: true, groupBy: true },
    { label: 'Cluster Developer', field: fields.clusterdeveloper, serverField: 'clusterorg', visible: true, groupBy: true },
    { label: 'Cloudlet', field: fields.cloudletName, serverField: 'cloudlet', visible: true, groupBy: true },
    { label: 'Operator', field: fields.operatorName, serverField: 'cloudletorg', visible: true, groupBy: true }
]

export const customData = (id, data) => {
    switch (id) {
        case fields.healthCheck:
            return healthCheck(data[fields.healthCheck])
        case fields.cloudletName:
            return `${data[fields.cloudletName]} [${data[fields.operatorName]}]`
        case fields.clusterName:
            return `${data[fields.clusterName]} [${data[fields.clusterdeveloper]}]`
        case fields.appName:
            return `${data[fields.appName]} [${data[fields.version]}]`
    }
}

export const appMetricsListKeys = [
    { field: fields.region, label: 'Region', sortable: true, visible: false, groupBy: true },
    { field: fields.appName, label: 'App', sortable: true, visible: true, groupBy: true, customData: true },
    { field: fields.organizationName, label: 'App Developer', sortable: false, visible: false, groupBy: false },
    { field: fields.version, label: 'Version', sortable: true, visible: false, groupBy: true },
    { field: fields.clusterName, label: 'Cluster', sortable: true, visible: true, groupBy: true, customData: true },
    { field: fields.clusterdeveloper, label: 'Cluster Developer', sortable: true, visible: false, groupBy: true },
    { field: fields.cloudletName, label: 'Cloudlet', sortable: true, visible: true, groupBy: true, customData: true },
    { field: fields.operatorName, label: 'Operator', sortable: true, visible: false, groupBy: true },
    { field: fields.cloudletLocation, label: 'Location', sortable: false, visible: false, groupBy: false },
    { field: fields.healthCheck, label: 'Health Check', sortable: false, visible: true, groupBy: false, customData: true },
    { field: 'cpu', label: 'CPU', sortable: true, visible: true, isArray: true },
    { field: 'disk', label: 'Disk Usage', sortable: true, visible: true, isArray: true },
    { field: 'memory', label: 'Memory', sortable: true, visible: true, isArray: true },
    { field: 'sent', label: 'Network Sent', sortable: true, visible: true, isArray: true },
    { field: 'received', label: 'Network Received', sortable: true, visible: true, isArray: true },
    { field: 'connections', label: 'Active Connections', sortable: true, visible: true, isArray: true },
]



export const appInstMetricTypeKeys = [
    { field: 'cpu', serverField: 'cpu', header: 'CPU', position: 10, unit: 2, serverRequest: true },
    { field: 'memory', serverField: 'mem', header: 'Memory', position: 10, unit: 1, serverRequest: true },
    { field: 'disk', serverField: 'disk', header: 'Disk Usage', position: 10, unit: 1, serverRequest: true },
    { field: 'sent', serverField: 'network', subId: 'sendBytes', header: 'Network Sent', position: 10, unit: 1, serverRequest: true },
    { field: 'received', serverField: 'network', subId: 'recvBytes', header: 'Network Received', position: 11, unit: 1, serverRequest: false },
    { field: 'connections', serverField: 'connections', subId: 'active', header: 'Active Connections', position: 10, unit: 3, serverRequest: true },
    { field: 'map', header: 'Map', serverRequest: false },
    { field: 'event', header: 'Event', serverRequest: false },
    { field: 'client', header: 'Client Usage', serverRequest: false },
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

