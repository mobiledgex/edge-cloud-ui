import * as formatter from './format'
import { CLUSTER_EVENT_LOG_ENDPOINT } from './endPointTypes'
import * as dateUtil from '../../utils/date_util'
import * as serverData from './serverData'

let fields = formatter.fields

export const clusterEventKeys = [
    {label:'Date', serverField:'time', visible : false, detailedView : false},
    {label:'Cluster', serverField:'cluster', visible : true, detailedView : false},
    {label:'Cluster Developer', serverField:'clusterorg', visible : true, detailedView : false},
    {label:'Cloudlet', serverField:'cloudlet', visible : true, detailedView : false},
    {label:'Operator', serverField:'cloudletorg', visible : true, detailedView : false},
    {label:'Flavor', serverField:'flavor', visible : false, detailedView : true},
    {label:'vCPU', serverField:'vcpu', visible : false, detailedView : true},
    {label:'RAM', serverField:'ram', visible : false, detailedView : true},
    {label:'Disk', serverField:'disk', visible : false, detailedView : true},
    {label:'Other', serverField:'other', visible : false, detailedView : false},
    {label:'Event', serverField:'event', visible : true, detailedView : true},
    {label:'Status', serverField:'status', visible : true, detailedView : true},
]

export const showKey = (data) => (
    {
        region : data[fields.region],
        clusterinst: {
            cluster_key: { name: data[fields.clusterName] },
            cloudlet_key: { organization: data[fields.operatorName], name: data[fields.cloudletName] },
            organization: data[fields.organizationName]
        }
    }
)


export const clusterEventLogs = (data) => {
    return { method: CLUSTER_EVENT_LOG_ENDPOINT, data: showKey(data)}
}

const customData = (value) => {
    value[fields.time] = dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, value[fields.time])
}

export const getData = (response, body) => {
    
    return formatter.formatEventData(response, body, clusterEventKeys)
}
