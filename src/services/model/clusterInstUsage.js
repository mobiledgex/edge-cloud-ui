
import * as formatter from './format'
import { CLUSTER_INST_USAGE_ENDPOINT } from './endpoints'
import * as dateUtil from '../../utils/date_util'

export const clusterUsageKeys = [
    { label: 'Region', serverField: 'region', visible: true, filter: true },
    { label: 'Cluster', serverField: 'cluster', visible: true, filter: true },
    { label: 'Cluster Developer', serverField: 'clusterorg', visible: true, filter: true },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, filter: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, filter: true },
    { label: 'Flavor', serverField: 'flavor', visible: true, filter: true },
    { label: 'Number of Workers', serverField: 'numnodes', visible: true, filter: true },
    { label: 'IP Access', serverField: 'ipaccess', visible: true, filter: true },
    { label: 'Starttime', serverField: 'startime', visible: true, filter: true, formatDate: dateUtil.FORMAT_FULL_DATE_TIME },
    { label: 'Endtime', serverField: 'endtime', visible: true, filter: true, formatDate: dateUtil.FORMAT_FULL_DATE_TIME },
    { label: 'Duration', serverField: 'duration', visible: true, filter: true },
    { label: 'Note', serverField: 'note', visible: true, filter: true },
]

export const clusterInstUsageLogs = (data, org) => {
    data.clusterinst = {
        organization: org
    }
    return { method: CLUSTER_INST_USAGE_ENDPOINT, data: data, keys: clusterUsageKeys }
}

export const getData = (response, body) => {
    return formatter.formatUsageData(response, body, clusterUsageKeys)
}

