import * as dateUtil from '../../../utils/date_util'
import { endpoint } from '../../../helper/constant'
import { fields } from '../../model/format'
import { AIK_CLOUDLET, primaryKeys as appInstKeys } from '../appInst/primary'
import { redux_org } from '../../../helper/reduxData'

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

export const appInstEventLogs = (self, data) => {
    let requestData = {
        region: data[fields.region],
        starttime: data[fields.starttime],
        endtime: data[fields.endtime]
    }
    if (redux_org.isOperator(self)) {
        requestData.appinst = appInstKeys(data, AIK_CLOUDLET)
    }
    else {
        requestData.appinst = {
            app_key: {
                organization: data[fields.organizationName]
            }
        }
    }
    return { method: endpoint.APP_INST_EVENT_LOG_ENDPOINT, data: requestData, keys: appEventKeys }
}