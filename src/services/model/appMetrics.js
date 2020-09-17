
import * as formatter from './format'
import { APP_INST_METRICS_ENDPOINT } from './endPointTypes'
import * as dateUtil from '../../utils/date_util'

export const appMetricsKeys = [
    {label:'Date', serverField:'time', visible : false},
    {label:'Region', serverField:'region', visible : true, groupBy:true},
    {label:'App', serverField:'app', visible : true, groupBy : true},
    {label:'Version', serverField:'ver', visible : true, groupBy : true},
    {label:'Cluster', serverField:'cluster', visible : true, groupBy : true},
    {label:'Cluster Developer', serverField:'clusterorg', visible : true, groupBy : true},
    {label:'Cloudlet', serverField:'cloudlet', visible : true, groupBy : true},
    {label:'Operator', serverField:'cloudletorg', visible : true, groupBy : true},
    {label:'App Developer', serverField:'pod', visible : false, groupBy : true},
    {label:'CPU', serverField:'cpu', visible : true},
    // {label:'Memory', serverField:'mem', visible : false},
    // {label:'Disk', serverField:'disk', visible : false},
    // {label:'Send Bytes', serverField:'sendBytes', visible : false},
    // {label:'Receive Bytes', serverField:'recvBytes', visible : false},
    // {label:'Port', serverField:'port', visible : false},
    // {label:'Active', serverField:'active', visible : false},
    // {label:'Handled', serverField:'handled', visible : false},
    // {label:'Accepts', serverField:'accepts', visible : false},
    // {label:'Bytes Sent', serverField:'bytesSent', visible : false},
    // {label:'Bytes Received', serverField:'bytesRecvd', visible : false},
    // {label:'P0', serverField:'P0', visible : false},
    // {label:'P25', serverField:'P25', visible : false},
    // {label:'P50', serverField:'P50', visible : false},
    // {label:'P75', serverField:'P75', visible : false},
    // {label:'P90', serverField:'P90', visible : false},
    // {label:'P95', serverField:'P95', visible : false},
    // {label:'P99', serverField:'P99', visible : false},
    // {label:'P99.5', serverField:'P99.5', visible : false},
    // {label:'P99.9', serverField:'P99.9', visible : false},
    // {label:'P100', serverField:'P100', visible : false},
    // {label:'Port 1', serverField:'port_1', visible : false},
    // {label:'Bytes Sent 1', serverField:'bytesSent_1', visible : false},
    // {label:'Bytes Received 1', serverField:'bytesRecvd_1', visible : false},
    // {label:'Datagrams Sent', serverField:'datagramsSent', visible : false},
    // {label:'Datagrams Received', serverField:'datagramsRecvd', visible : false},
    // {label:'Sent Errors', serverField:'sentErrs', visible : false},
    // {label:'Received Errors', serverField:'recvErrs', visible : false},
    // {label:'Overflow', serverField:'overflow', visible : false},
    // {label:'Missed', serverField:'missed', visible : false},
]

export const appInstMetrics = (data) => {

    if (!formatter.isAdmin()) {
        {
            data.appinst = {
                app_key: {
                    organization: formatter.getOrganization()
                }
            }
            data.selector = 'cpu'
        }
    }
    return { method: APP_INST_METRICS_ENDPOINT, data: data, showSpinner:false}
}

export const getData = (response, body) => { 
    return formatter.formatEventData(response, body, appMetricsKeys)
}

