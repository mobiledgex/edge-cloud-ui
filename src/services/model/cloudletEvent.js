
import * as formatter from './format'
import { CLOUDLET_EVENT_LOG_ENDPOINT } from './endPointTypes'
import * as dateUtil from '../../utils/date_util'

export const cloudletEventKeys = [
    { label: 'Starttime', serverField: 'time', visible: true, detailedView: false, format: dateUtil.FORMAT_FULL_DATE_TIME },
    { label: 'Region', serverField: 'region', visible: true, detailedView: false, groupBy: true, filter: true },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, detailedView: false, groupBy: true, filter: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, detailedView: false, groupBy: true },
    { label: 'App Developer', serverField: 'apporg', visible: false, detailedView: false, groupBy: true },
    { label: 'Action', serverField: 'event', visible: true, detailedView: true },
    { label: 'Status', serverField: 'status', visible: true, detailedView: true }
]

export const cloudletEventLogs = (data, org) => {
    data.cloudlet = {
        organization: org
    }
    return { method: CLOUDLET_EVENT_LOG_ENDPOINT, data: data, keys: cloudletEventKeys }
}

export const getData = (response, body) => {
    return formatter.formatEventData(response, body, cloudletEventKeys)
}

