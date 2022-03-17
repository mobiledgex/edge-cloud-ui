import { endpoint } from '../../../helper/constant'
import { localFields } from '../../fields'
import { AIK_CLOUDLET, appInstKeys } from '../appInst/primary'
import { redux_org } from '../../../helper/reduxData'

export const appEventKeys = [
    { field: localFields.time, label: 'Starttime', serverField: 'time', visible: true, detailedView: false, format: true },
    { label: 'Region', serverField: 'region', visible: true, detailedView: false, groupBy: true, filter: true },
    { field: localFields.appName, label: 'App', serverField: 'app', visible: true, detailedView: false, groupBy: true, filter: true, format: true },
    { label: 'App Developer', serverField: 'apporg', visible: false, detailedView: false, groupBy: true },
    { label: 'Version', serverField: 'ver', visible: false, detailedView: false, groupBy: true },
    { field: localFields.clusterName, label: 'Cluster', serverField: 'cluster', visible: true, detailedView: false, groupBy: true, format: true },
    { label: 'Cluster Developer', serverField: 'clusterorg', visible: false, detailedView: false, groupBy: true },
    { field: localFields.cloudletName, label: 'Cloudlet', serverField: 'cloudlet', visible: true, detailedView: false, groupBy: true, format: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: false, detailedView: false, groupBy: true },
    { label: 'Action', serverField: 'event', visible: true, detailedView: true },
    { label: 'Status', serverField: 'status', visible: true, detailedView: true }
]

export const appInstEventLogs = (self, data, isOperator = false) => {
    let requestData = {
        region: data[localFields.region],
        starttime: data[localFields.starttime],
        endtime: data[localFields.endtime]
    }
    if (isOperator) {
        requestData.appinst = appInstKeys(data, AIK_CLOUDLET)
    }
    else {
        requestData.appinst = {
            app_key: {
                organization: data[localFields.organizationName]
            }
        }
    }
    return { method: endpoint.APP_INST_EVENT_LOG_ENDPOINT, data: requestData, keys: appEventKeys }
}