import * as formatter from './format'
import { CLUSTER_EVENT_LOG_ENDPOINT } from './endPointTypes'

export const clusterEventKeys = [
    {label:'Date', serverField:'time', visible : false, detailedView : false},
    {label:'Region', serverField:'region', visible : true, detailedView : false, groupBy:true, filter:true},
    {label:'Cluster', serverField:'cluster', visible : true, detailedView : false, groupBy:true, filter:true},
    {label:'Cluster Developer', serverField:'clusterorg', visible : false, detailedView : false, groupBy:false},
    {label:'Cloudlet', serverField:'cloudlet', visible : true, detailedView : false, groupBy:true},
    {label:'Operator', serverField:'cloudletorg', visible : true, detailedView : false, groupBy:true},
    {label:'Flavor', serverField:'flavor', visible : false, detailedView : true},
    {label:'vCPU', serverField:'vcpu', visible : false, detailedView : true},
    {label:'RAM', serverField:'ram', visible : false, detailedView : true},
    {label:'Disk', serverField:'disk', visible : false, detailedView : true},
    {label:'Other', serverField:'other', visible : false, detailedView : false},
    {label:'Event', serverField:'event', visible : true, detailedView : true},
    {label:'Status', serverField:'status', visible : true, detailedView : true}
]

export const clusterEventLogs = (data) => {
    if (!formatter.isAdmin()) {
        {
            data.clusterinst = {
                organization: formatter.getOrganization()
            }
        }
    }
    return { method: CLUSTER_EVENT_LOG_ENDPOINT, data: data, showSpinner:false}
}

export const getData = (response, body) => { 
    return formatter.formatEventData(response, body, clusterEventKeys)
}
