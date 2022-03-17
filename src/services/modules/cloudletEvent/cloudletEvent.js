import { endpoint } from '../../../helper/constant'
import { cloudletKeys } from '../cloudlet/primary'
import { localFields } from '../../fields'

export const cloudletEventKeys = [
    { field: localFields.time, label: 'Starttime', serverField: 'time', visible: true, detailedView: false, format: true },
    { label: 'Region', serverField: 'region', visible: true, detailedView: false, groupBy: true, filter: true },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, detailedView: false, groupBy: true, filter: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, detailedView: false, groupBy: true },
    { label: 'Action', serverField: 'event', visible: true, detailedView: true },
    { label: 'Status', serverField: 'status', visible: true, detailedView: true }
]

export const cloudletEventLogs = (self, data) => {
    let requestData = {
        region: data[localFields.region],
        starttime: data[localFields.starttime],
        endtime: data[localFields.endtime]
    }
    requestData.cloudlet = cloudletKeys(data)
    return { method: endpoint.CLOUDLET_EVENT_LOG_ENDPOINT, data: requestData, keys: cloudletEventKeys }
}