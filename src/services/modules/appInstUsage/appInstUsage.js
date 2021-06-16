import * as dateUtil from '../../../utils/date_util'
import { endpoint } from '../../../helper/constant'

export const appUsageKeys = [
    { label: 'Region', serverField: 'region', visible: true, filter: true },
    { label: 'App', serverField: 'app', visible: true, filter: true },
    { label: 'App Developer', serverField: 'apporg', visible: false, filter: true },
    { label: 'Version', serverField: 'version', visible: true },
    { label: 'Cluster', serverField: 'cluster', visible: true, filter: true },
    { label: 'Cluster Developer', serverField: 'clusterorg', visible: true, filter: true },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, filter: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, filter: true },
    { label: 'Flavor', serverField: 'flavor', visible: true, filter: true },
    { label: 'Deployment', serverField: 'deployment', visible: true, filter: true },
    { label: 'Starttime', serverField: 'startime', visible: true, filter: true, formatDate: dateUtil.FORMAT_FULL_DATE_TIME },
    { label: 'Endtime', serverField: 'endtime', visible: true, filter: true, formatDate: dateUtil.FORMAT_FULL_DATE_TIME },
    { label: 'Duration', serverField: 'duration', visible: true, filter: true },
    { label: 'Note', serverField: 'note', visible: true, filter: true },
]

export const appInstUsageLogs = (data, org) => {
    data.appinst = {
        app_key: {
            organization: org
        }
    }
    return { method: endpoint.APP_INST_USAGE_ENDPOINT, data: data, keys: appUsageKeys }
}

