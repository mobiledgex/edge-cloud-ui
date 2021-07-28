
import * as dateUtil from '../../../utils/date_util'
import { endpoint } from '../../../helper/constant'
import { primaryKeys as cloudletKeys } from '../cloudlet/primary'
import { fields } from '../../model/format'

export const cloudletEventKeys = [
    { label: 'Starttime', serverField: 'time', visible: true, detailedView: false, format: dateUtil.FORMAT_FULL_DATE_TIME },
    { label: 'Region', serverField: 'region', visible: true, detailedView: false, groupBy: true, filter: true },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, detailedView: false, groupBy: true, filter: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, detailedView: false, groupBy: true },
    { label: 'App Developer', serverField: 'apporg', visible: false, detailedView: false, groupBy: true },
    { label: 'Action', serverField: 'event', visible: true, detailedView: true },
    { label: 'Status', serverField: 'status', visible: true, detailedView: true }
]

export const cloudletEventLogs = (self, data) => {
    let requestData = {
        region: data[fields.region],
        starttime: data[fields.starttime],
        endtime: data[fields.endtime]
    }
    requestData.cloudlet = cloudletKeys(data)
    return { method: endpoint.CLOUDLET_EVENT_LOG_ENDPOINT, data: requestData, keys: cloudletEventKeys }
}