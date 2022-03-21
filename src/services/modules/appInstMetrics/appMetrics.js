import { UNIT_BYTES, UNIT_PERCENTAGE, UNIT_FLOOR } from '../../../pages/main/monitoring/helper/unitConvertor';
import { labelFormatter } from '../../../helper/formatter';
import { endpoint } from '../..';
import { redux_org } from '../../../helper/reduxData';
import { localFields } from '../../fields';

export const appMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', field: localFields.region, serverField: 'region', visible: true, groupBy: true },
    { label: 'App', field: localFields.appName, serverField: 'app', visible: true, groupBy: true, filter: true },
    { label: 'Version', field: localFields.version, serverField: 'ver', visible: true, groupBy: true },
    { label: 'App Developer', field: localFields.organizationName, serverField: 'apporg', visible: true, groupBy: false },
    { label: 'Cluster', field: localFields.clusterName, serverField: 'cluster', visible: true, groupBy: true },
    { label: 'Cluster Developer', field: localFields.clusterdeveloper, serverField: 'clusterorg', visible: true, groupBy: true },
    { label: 'Cloudlet', field: localFields.cloudletName, serverField: 'cloudlet', visible: true, groupBy: true },
    { label: 'Operator', field: localFields.operatorName, serverField: 'cloudletorg', visible: true, groupBy: true }
]

export const customData = (id, data) => {
    switch (id) {
        case localFields.healthCheck:
            return labelFormatter.healthCheck(data[localFields.healthCheck])
        case localFields.cloudletName:
            return `${data[localFields.cloudletName]} [${data[localFields.operatorName]}]`
        case localFields.clusterName:
            return `${data[localFields.clusterName]} [${data[localFields.clusterdeveloper]}]`
        case localFields.appName:
            return `${data[localFields.appName]} [${data[localFields.version]}]`
    }
}

export const appMetricsListKeys = [
    { field: localFields.region, serverField: 'region', label: 'Region', sortable: true, visible: false, groupBy: true },
    { field: localFields.appName, serverField:'app', label: 'App', sortable: true, visible: false, groupBy: true},
    { field: localFields.organizationName, serverField:'apporg',label: 'App Developer', sortable: false, visible: false, groupBy: false },
    { field: localFields.version, serverField: 'ver', label: 'Version', sortable: true, visible: false, groupBy: true },
    { field: localFields.clusterName, serverField: 'cluster', label: 'Cluster', sortable: true, visible: true, groupBy: true, customData: true },
    { field: localFields.clusterdeveloper, serverField: 'clusterorg', label: 'Cluster Developer', sortable: true, visible: false, groupBy: true },
    { field: localFields.cloudletName, serverField: 'cloudlet', label: 'Cloudlet', sortable: true, visible: true, groupBy: true, customData: true },
    { field: localFields.operatorName, serverField: 'cloudletorg', label: 'Operator', sortable: true, visible: false, groupBy: true },
    { field: localFields.cloudletLocation, label: 'Location', sortable: false, visible: false, groupBy: false },
    { field: localFields.deployment, label: 'Deployment' },
    { field: localFields.platformType, label: 'Platform Type' },
    { field: localFields.healthCheck, label: 'Health Check', sortable: true, visible: true, format: true, customData: true, width: 100 },
    { field: 'cpu', label: 'CPU', sortable: false, visible: true, format: true, isArray: true, width: 100 },
    { field: 'disk', label: 'Disk Usage', sortable: false, visible: true, format: true, isArray: true, width: 100 },
    { field: 'memory', label: 'Memory', sortable: false, visible: true, format: true, isArray: true, width: 100 },
    { field: 'sent', label: 'N/W Sent', sortable: false, visible: true, format: true, isArray: true, width: 100 },
    { field: 'received', label: 'N/W Recv.', sortable: false, visible: true, format: true, isArray: true, width: 100 },
    { field: 'connections', label: 'Active Conn.', sortable: false, visible: true, format: true, isArray: true, width: 90 },
]

export const networkMetricType = [
    { field: 'sent', serverField: 'network', subId: 'sendBytes', header: 'Network Sent', position: 1, unit: UNIT_BYTES },
    { field: 'received', serverField: 'network', subId: 'recvBytes', header: 'Network Received', position: 2, unit: UNIT_BYTES },
]

export const appInstResourceKeys = () => ([
    { field: 'cpu', serverField: 'cpu', header: 'CPU', position: 1, unit: UNIT_PERCENTAGE, serverRequest: endpoint.APP_INST_METRICS_ENDPOINT },
    { field: 'memory', serverField: 'mem', header: 'Memory', position: 1, unit: UNIT_BYTES, serverRequest: endpoint.APP_INST_METRICS_ENDPOINT },
    { field: 'disk', serverField: 'disk', header: 'Disk Usage', position: 1, unit: UNIT_BYTES, serverRequest: endpoint.APP_INST_METRICS_ENDPOINT },
    { field: 'network', serverField: 'network', serverRequest: endpoint.APP_INST_METRICS_ENDPOINT, keys: networkMetricType },
    { field: 'connections', serverField: 'connections', subId: 'active', header: 'Active Connections', position: 2, unit: UNIT_FLOOR, serverRequest: endpoint.APP_INST_METRICS_ENDPOINT },
    { field: 'map', header: 'Map' },
    { field: 'event', header: 'Event' },
    { field: 'client', header: 'Client Usage' },
])

export const fetchLocation = (avgValues, metricData, showList) => {
    for (let i = 0; i < showList.length; i++) {
        let show = showList[i]
        let valid = metricData.includes(show[localFields.region]) &&
            metricData.includes(show[localFields.appName].toLowerCase()) &&
            metricData.includes(show[localFields.organizationName]) &&
            metricData.includes(show[localFields.clusterName]) &&
            metricData.includes(show[localFields.clusterdeveloper]) &&
            metricData.includes(show[localFields.cloudletName]) &&
            metricData.includes(show[localFields.operatorName])
        if (valid) {
            avgValues['location'] = show[localFields.cloudletLocation]
            avgValues[localFields.healthCheck] = show[localFields.healthCheck]
            avgValues['showData'] = show
        }
    }
    return avgValues
}

export const appInstMetrics = (self, data, list, organization) => {
    if(list)
    {
        data.appinsts = list 
    }
    else if (organization) {
        data.appinst = redux_org.isOperator(self) ? { cluster_inst_key: { cloudlet_key: { organization } } } : { app_key: { organization } }
    }
    return { method: endpoint.APP_INST_METRICS_ENDPOINT, data: data, keys: appMetricsKeys }
}

