
import { UNIT_BYTES, UNIT_PERCENTAGE } from '../../../pages/main/monitoring/helper/unitConvertor';
import { localFields } from '../../fields';
import { endpoint } from '../../../helper/constant';
import { redux_org } from '../../../helper/reduxData';

export const customData = (id, data) => {
    switch (id) {
        case localFields.cloudletName:
            return `${data[localFields.cloudletName]} [${data[localFields.operatorName]}]`
    }
}

export const clusterMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', serverField: 'region', visible: true, groupBy: true },
    { label: 'Cluster', serverField: 'cluster', visible: true, groupBy: true },
    { label: 'Cluster Developer', serverField: 'clusterorg', visible: true, groupBy: false },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, groupBy: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, groupBy: true }
]

export const clusterMetricsListKeys = [
    { field: localFields.region, label: 'Region', sortable: true, visible: true, width: 70 },
    { field: localFields.clusterName, serverField: 'cluster', label: 'Cluster', sortable: true, visible: true, groupBy: true },
    { field: localFields.organizationName, serverField: 'clusterorg', label: 'Developer', sortable: true, groupBy: true },
    { field: localFields.cloudletName, serverField: 'cloudlet', label: 'Cloudlet', sortable: true, groupBy: true, customData: true },
    { field: localFields.operatorName, serverField: 'cloudletorg', label: 'Operator', sortable: true, groupBy: true },
    { field: localFields.cloudletLocation, label: 'Location', sortable: false, visible: false, groupBy: false },
    { field: 'cpu', label: 'CPU', sortable: false, visible: true, format: true, isArray: true },
    { field: 'disk', label: 'Disk Usage', sortable: false, visible: true, format: true, isArray: true },
    { field: 'memory', label: 'Memory', sortable: false, visible: true, format: true, isArray: true },
    { field: 'sent', label: 'Network Sent', sortable: false, visible: true, format: true, isArray: true },
    { field: 'received', label: 'Network Received', sortable: false, visible: true, format: true, isArray: true }
]

export const networkMetricType = [
    { field: 'sent', serverField: 'network', subId: 'sendBytes', header: 'Network Sent', position: 1, unit: UNIT_BYTES },
    { field: 'received', serverField: 'network', subId: 'recvBytes', header: 'Network Received', position: 2, unit: UNIT_BYTES },
]

export const clusterResourceKeys = () => ([
    { field: 'cpu', serverField: 'cpu', header: 'CPU', position: 1, unit: UNIT_PERCENTAGE, serverRequest: endpoint.CLUSTER_METRICS_ENDPOINT },
    { field: 'memory', serverField: 'mem', header: 'Memory', position: 1, unit: UNIT_PERCENTAGE, serverRequest: endpoint.CLUSTER_METRICS_ENDPOINT },
    { field: 'disk', serverField: 'disk', header: 'Disk Usage', position: 1, unit: UNIT_PERCENTAGE, serverRequest: endpoint.CLUSTER_METRICS_ENDPOINT },
    { field: 'network', serverField: 'network', serverRequest: endpoint.CLUSTER_METRICS_ENDPOINT, keys: networkMetricType },
    { field: 'map', header: 'Map' }
])

export const clusterMetrics = (self, data, list, organization) => {
    if (list) {
        data.clusterinsts = list
    }
    else {
        data.clusterinst = redux_org.isOperator(self) ? { cloudlet_key: { organization } } : { organization }
    }
    return { method: endpoint.CLUSTER_METRICS_ENDPOINT, data, keys: clusterMetricsKeys }
}

