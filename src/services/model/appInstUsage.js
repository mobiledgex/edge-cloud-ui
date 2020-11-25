
import * as formatter from './format'
import { APP_INST_USAGE_ENDPOINT } from './endpoints'
import * as dateUtil from '../../utils/date_util'

export const appUsageKeys = [
    { label: 'Region', serverField: 'region', groupBy: true, filter: true },
    { label: 'App', serverField: 'app', groupBy: true, filter: true },
    { label: 'App Developer', serverField: 'apporg', groupBy: true, filter: true },
    { label: 'Version', serverField: 'version', groupBy: true },
    { label: 'Cluster', serverField: 'cluster', groupBy: true, filter: true },
    { label: 'Cluster Developer', serverField: 'clusterorg', groupBy: true, filter: true },
    { label: 'Cloudlet', serverField: 'cloudlet', groupBy: true, filter: true },
    { label: 'Operator', serverField: 'cloudletorg', groupBy: true, filter: true },
    { label: 'Flavor', serverField: 'flavor', summary: true, filter: true },
    { label: 'Deployment', serverField: 'deployment', summary: true, filter: true },
    { label: 'Starttime', serverField: 'starttime', summary: true, filter: true },
    { label: 'Endtime', serverField: 'endtime', summary: true, filter: true },
    { label: 'Duration', serverField: 'duration', summary: true, filter: true },
    { label: 'Note', serverField: 'note', summary: true, filter: true },
]

export const appInstUsageLogs = (data, org) => {
    data.appinst = {
        app_key: {
            organization: org
        }
    }
    return { method: APP_INST_USAGE_ENDPOINT, data: data, keys: appUsageKeys }
}

export const getData = (response, body) => {
    return formatter.formatUsageData(response, body, appUsageKeys)
}

