
import * as formatter from '../../model/format'
import { UNIT_BYTES, UNIT_PERCENTAGE, UNIT_FLOOR } from '../../../pages/main/monitoring/helper/unitConvertor';
import { labelFormatter } from '../../../helper/formatter';
import { endpoint, perpetual } from '../../../helper/constant';
import { developerRoles } from '../../../constant';
import { ADMIN, DEVELOPER, DEVELOPER_VIEWER } from '../../../helper/constant/perpetual';
import { redux_org } from '../../../helper/reduxData';

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
            return labelFormatter.healthCheck(data[fields.healthCheck])
        case fields.cloudletName:
            return `${data[fields.cloudletName]} [${data[fields.operatorName]}]`
        case fields.clusterName:
            return `${data[fields.clusterName]} [${data[fields.clusterdeveloper]}]`
        case fields.appName:
            return `${data[fields.appName]} [${data[fields.version]}]`
    }
}

export const appMetricsListKeys = [
    { field: fields.region, label: 'Region', sortable: true, visible: true, groupBy: false },
    { field: fields.appName, serverField:'app', label: 'App', sortable: true, visible: true, groupBy: true},
    { field: fields.organizationName, serverField:'apporg',label: 'App Developer', sortable: false, visible: false, groupBy: false },
    { field: fields.version, serverField:'ver', label: 'Version', sortable: true, visible: false, groupBy: true },
    { field: fields.clusterName, serverField:'cluster', label: 'Cluster', sortable: true, visible: true, groupBy: true, customData: true },
    { field: fields.clusterdeveloper, serverField:'clusterorg', label: 'Cluster Developer', sortable: true, visible: false, groupBy: true },
    { field: fields.cloudletName,serverField:'cloudlet', label: 'Cloudlet', sortable: true, visible: true, groupBy: true, customData: true },
    { field: fields.operatorName, serverField:'cloudletorg', label: 'Operator', sortable: true, visible: false, groupBy: true },
    { field: fields.cloudletLocation, label: 'Location', sortable: false, visible: false, groupBy: false },
    { field: fields.deployment, label: 'Deployment'},
    { field: fields.platformType, label: 'Platform Type'},
    { field: fields.healthCheck, label: 'Health Check', sortable: true, visible: true, format:true, customData: true },
    { field: 'cpu', label: 'CPU', sortable: false, visible: true, format:true, isArray: true },
    { field: 'disk', label: 'Disk Usage', sortable: false, visible: true, format:true, isArray: true },
    { field: 'memory', label: 'Memory', sortable: false, visible: true, format:true, isArray: true },
    { field: 'sent', label: 'Network Sent', sortable: false, visible: true, format:true, isArray: true },
    { field: 'received', label: 'Network Received', sortable: false, visible: true, format:true, isArray: true },
    { field: 'connections', label: 'Active Connections', sortable: false, visible: true, format:true, isArray: true },
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

