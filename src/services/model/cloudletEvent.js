
import * as formatter from './format'
import { CLOUDLET_EVENT_LOG_ENDPOINT } from './endPointTypes'
import * as dateUtil from '../../utils/date_util'

const formatDate = (value) => {
    return dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, value)
}


export const showKey = () => (
    { region: 'EU', cloudlet: { organization: "TDG", name: "automationBerlinCloudlet" } }
)

export const cloudletEventKeys = [
    { label: 'Starttime', serverField: 'time', visible: true, detailedView: false, format: formatDate },
    { label: 'Region', serverField: 'region', visible: true, detailedView: false, groupBy: true, filter: true },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, detailedView: false, groupBy: true, filter: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, detailedView: false, groupBy: true },
    { label: 'App Developer', serverField: 'apporg', visible: false, detailedView: false, groupBy: true },
    { label: 'Action', serverField: 'event', visible: true, detailedView: true },
    { label: 'Status', serverField: 'status', visible: true, detailedView: true }
]

export const cloudletEventLogs = (data) => {
    if (!formatter.isAdmin()) {
        {
            data.cloudlet = {
                organization: formatter.getOrganization()
            }
        }
    }
    return { method: CLOUDLET_EVENT_LOG_ENDPOINT, data: data, showSpinner: false }
}

export const getData = (response, body) => {
    return formatter.formatEventData(response, body, cloudletEventKeys)
}

