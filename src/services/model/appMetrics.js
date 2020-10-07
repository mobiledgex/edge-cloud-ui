
import * as formatter from './format'
import { APP_INST_METRICS_ENDPOINT } from './endPointTypes'
import { convertByteToMegaGigaByte } from '../../utils/math_util'

let fields = formatter.fields;

export const appMetricsKeys = [
    {label:'Date', serverField:'time', visible : false},
    {label:'Region', serverField:'region', visible : true, groupBy:true},
    {label: 'App', serverField: 'app', visible: true, groupBy: true, filter: true },
    {label:'Version', serverField:'ver', visible : true, groupBy : true},
    {label:'Cluster', serverField:'cluster', visible : true, groupBy : true},
    {label:'Cluster Developer', serverField:'clusterorg', visible : true, groupBy : true},
    {label:'Cloudlet', serverField:'cloudlet', visible : true, groupBy : true},
    {label:'Operator', serverField:'cloudletorg', visible : true, groupBy : true},
    {label:'App Developer', serverField:'pod', visible : false, groupBy : true}
]

export const appMetricsListKeys = [
    { field: 'region', label: 'Region', sortable: true, visible: true},
    { field: 'app', label: 'App', sortable: true, visible: true },
    { field: 'ver', label: 'Version', sortable: true, visible: true },
    { field: 'cloudlet', label: 'Cloudlet', sortable: true, visible: true },
    { field: 'cloudletorg', label: 'Operator', sortable: true, visible: true },
    { field: 'cluster', label: 'Cluster', sortable: true, visible: true },
    { field: 'clusterorg', label: 'Cluster Developer', sortable: true, visible: true },
    { field: 'cpu', label: 'CPU', sortable: true, visible: true, isArray : true },
    { field: 'disk', label: 'Disk Usage', sortable: true, visible: true, isArray : true },
    { field: 'mem', label: 'Memory', sortable: true, visible: true, isArray : true },
    { field: 'sent', label: 'Network Sent', sortable: true, visible: true, isArray : true },
    { field: 'received', label: 'Network Received', sortable: true, visible: true, isArray : true},
    { field: 'connections', label: 'Active Connections', sortable: true, visible: true, isArray : true},
]

export const appInstMetricTypeKeys = [
    { field: 'cpu', serverField: 'cpu', header: 'CPU', position: 10, unit: (value) => { return value.toFixed(3) + " %" }, serverRequest: true },
    { field: 'mem', serverField: 'mem', header: 'Memory', position: 10, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) }, serverRequest: true },
    { field: 'disk', serverField: 'disk', header: 'Disk Usage', position: 10, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) }, serverRequest: true },
    { field: 'sent', serverField: 'network', subId: 'sendBytes', header: 'Network Sent', position: 10, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) }, serverRequest: true },
    { field: 'received', serverField: 'network', subId: 'recvBytes', header: 'Network Received', position: 11, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) }, serverRequest: false },
    { field: 'connections', serverField: 'connections', subId: 'active', header: 'Active Connections', position: 10, serverRequest: true },
]

export const appActions = [
    {label : 'Show Clients'}
]

export const appInstMetrics = (data) => {

    if (!formatter.isAdmin()) {
        {
            data.appinst = {
                app_key: {
                    organization: formatter.getOrganization()
                }
            }
        }
    }
    return { method: APP_INST_METRICS_ENDPOINT, data: data, showSpinner:false}
}

export const getData = (response, body) => { 
    return formatter.formatEventData(response, body, appMetricsKeys)
}

