
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
    {label:'App Developer', serverField:'pod', visible : false, groupBy : true}
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

