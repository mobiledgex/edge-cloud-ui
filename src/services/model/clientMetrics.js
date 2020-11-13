
import * as formatter from './format'
import { CLIENT_METRICS_ENDPOINT } from './endPointTypes'

let fields = formatter.fields;

export const clientMetricsKeys = [
    { label: 'Date', serverField: 'time', visible: false },
    { label: 'Region', serverField: 'region', visible: true, groupBy: true },
    { label: '100ms', serverField: '100ms', visible: true, groupBy: false },
    { label: '10ms', serverField: '10ms', visible: true, groupBy: false },
    { label: '25ms', serverField: '25ms', visible: true, groupBy: false },
    { label: '50ms', serverField: '50ms', visible: true, groupBy: false },
    { label: '5ms', serverField: '5ms', visible: true, groupBy: false },
    { label: 'App', serverField: 'app', visible: true, groupBy: true },
    { label: 'App Developer', serverField: 'apporg', visible: true, groupBy: true },
    { label: 'Cell ID', serverField: 'cellID', visible: true, groupBy: false },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, groupBy: false },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, groupBy: false },
    { label: 'Errs', serverField: 'errs', visible: true, groupBy: false },
    { label: 'Found Cloudlet', serverField: 'foundCloudlet', visible: true, groupBy: false },
    { label: 'Found Operator', serverField: 'foundOperator', visible: true, groupBy: false },
    { label: 'INF', serverField: 'inf', visible: true, groupBy: false },
    { label: 'Method', serverField: 'method', visible: true, groupBy: false },
    { label: 'App', serverField: 'reqs', visible: true, groupBy: false },
    { label: 'Version', serverField: 'ver', visible: true, groupBy: false },
]

export const clientMetrics = (data) => {

    if (!formatter.isAdmin()) {
        {
            data.appinst = {
                app_key : {organization: formatter.getOrganization()}
            }
        }
    }
    return { method: CLIENT_METRICS_ENDPOINT, data: data, keys : clientMetricsKeys}
}

export const getData = (response, body) => {
    return formatter.formatEventData(response, body, clientMetricsKeys)
}

