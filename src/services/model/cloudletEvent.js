
import * as formatter from './format'
import { CLOUDLET_EVENT_LOG_ENDPOINT } from './endPointTypes'

export const showKey = () => (
    { region: 'EU', cloudlet: { organization: "TDG", name: "automationBerlinCloudlet" } }
)

export const cloudletEventKeys = [
    {label:'Date', serverField:'time', visible : false, detailedView : false},
    {label:'Cloudlet', serverField:'cloudlet', visible : true, detailedView : false, groupBy : true},
    {label:'Operator', serverField:'cloudletorg', visible : true, detailedView : false, groupBy : true},
    {label:'App Developer', serverField:'apporg', visible : false, detailedView : false, groupBy : true},
    {label:'Event', serverField:'event', visible : true, detailedView : true},
    {label:'Status', serverField:'status', visible : true, detailedView : true},
]

export const cloudletEventLogs = (data) => {
    if (!formatter.isAdmin()) {
        {
            data.cloudlet = {
                organization: formatter.getOrganization()
            }
        }
    }
    return { method: CLOUDLET_EVENT_LOG_ENDPOINT, data: data, showSpinner:false }
}

export const getData = (response, body) => { 
    return formatter.formatEventData(response, body, cloudletEventKeys)
}

