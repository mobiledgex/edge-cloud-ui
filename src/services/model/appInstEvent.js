
import * as formatter from './format'
import { APP_INST_EVENT_LOG_ENDPOINT } from './endPointTypes'
import * as dateUtil from '../../utils/date_util'

const formatDate = (value)=>{
    return dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, value)
}

export const appEventKeys = [
    {label:'Starttime', serverField:'time', visible : true, detailedView : false, format: formatDate},
    {label:'Region', serverField:'region', visible : true, detailedView : false, groupBy:true, filter:true},
    {label:'App', serverField:'app', visible : true, detailedView : false, groupBy : true, filter:true},
    {label:'Version', serverField:'ver', visible : true, detailedView : false, groupBy : true},
    {label:'Cluster', serverField:'cluster', visible : true, detailedView : false, groupBy : true},
    {label:'Cluster Developer', serverField:'clusterorg', visible : true, detailedView : false, groupBy : true},
    {label:'Cloudlet', serverField:'cloudlet', visible : true, detailedView : false, groupBy : true},
    {label:'Operator', serverField:'cloudletorg', visible : true, detailedView : false, groupBy : true},
    {label:'App Developer', serverField:'apporg', visible : false, detailedView : false, groupBy : true},
    {label:'Action', serverField:'event', visible : true, detailedView : true},
    {label:'Status', serverField:'status', visible : true, detailedView : true}
]

export const appInstEventLogs = (data) => {
    if (!formatter.isAdmin()) {
        {
            data.appinst = {
                app_key: {
                    organization: formatter.getOrganization()
                }
            }
        }
    }
    return { method: APP_INST_EVENT_LOG_ENDPOINT, data: data, showSpinner:false}
}

export const getData = (response, body) => { 
    return formatter.formatEventData(response, body, appEventKeys)
}

