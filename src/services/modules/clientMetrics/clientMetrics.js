import { endpoint } from '../../../helper/constant';

export const clientMetricsKeys = [
    { label: 'Date', serverField: 'time' },
    { label: 'App', serverField: 'app', groupBy: true },
    { label: 'Version', serverField: 'ver', groupBy: false },
    { label: 'App Developer', serverField: 'apporg', groupBy: true },
    { label: 'Cell ID', serverField: 'cellID' },
    { label: 'DME ID', serverField: 'dmeId' },
    { label: 'Cloudlet', serverField: 'cloudlet', visible: true, groupBy: true },
    { label: 'Operator', serverField: 'cloudletorg', visible: true, groupBy: true },
    { label: 'Found Cloudlet', serverField: 'foundCloudlet' },
    { label: 'Found Operator', serverField: 'foundOperator' },
    { label: 'Method', serverField: 'method' }
]

export const clientMetrics = (data, organization, isPrivate) => {
    data.appinst = isPrivate ? { cluster_inst_key: { cloudlet_key: { organization } } } : { app_key: { organization } }
    return { method: endpoint.CLIENT_METRICS_ENDPOINT, data: data, keys: clientMetricsKeys }
}
