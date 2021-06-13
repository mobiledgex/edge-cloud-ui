
import * as formatter from './format'
import * as dateUtil from '../../utils/date_util'
import { endpoint } from '../../helper/constant'

export const appEventKeys = [
    { label: 'Starttime', serverField: 'time', visible: true, detailedView: false, format: dateUtil.FORMAT_FULL_DATE_TIME },
    { label: 'Region', serverField: 'region', visible: true, detailedView: false, groupBy: true, filter: true },
    { label: 'App', serverField: 'app', visible: true, detailedView: false, groupBy: true, filter: true },
    { label: 'App Developer', serverField: 'apporg', visible: true, detailedView: false, groupBy: true },
    { label: 'Version', serverField: 'ver', visible: true, detailedView: false, groupBy: true },
    { label: 'Cluster', serverField: 'cluster', visible: true, detailedView: false, groupBy: true },
    { label: 'Cluster Developer', serverField: 'clusterorg', visible: true, detailedView: false, groupBy: true },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, detailedView: false, groupBy: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, detailedView: false, groupBy: true },
    { label: 'Action', serverField: 'event', visible: true, detailedView: true },
    { label: 'Status', serverField: 'status', visible: true, detailedView: true }
]

export const appInstEventLogs = (data, org) => {
    data.appinst = {
        app_key: {
            organization: org
        }
    }
    return { method: endpoint.APP_INST_EVENT_LOG_ENDPOINT, data: data, keys: appEventKeys }
}