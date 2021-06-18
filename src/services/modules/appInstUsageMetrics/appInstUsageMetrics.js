import { endpoint } from '../../../helper/constant';
import { fields } from '../../model/format';

const keys = () => (
    [
        { label: 'Date', field: 'time', serverField: 'time', visible: false, groupBy: 2 },
        { label: 'Region', field: fields.region, visible: true, groupBy: 1 },
        { label: 'App', field: fields.appName, serverField: 'app', visible: true, groupBy: 1, filter: true },
        { label: 'Version', field: fields.version, serverField: 'ver', visible: true, groupBy: 1 },
        { label: 'App Developer', field: fields.organizationName, serverField: 'apporg', visible: true, groupBy: 1 },
        { label: 'Cluster', field: fields.clusterName, serverField: 'cluster', visible: true, groupBy: 1 },
        { label: 'Cluster Developer', field: fields.clusterdeveloper, serverField: 'clusterorg', visible: true, groupBy: 1 },
        { label: 'Cloudlet', field: fields.cloudletName, serverField: 'cloudlet', visible: true, groupBy: 1 },
        { label: 'Operator', field: fields.operatorName, serverField: 'cloudletorg', visible: true, groupBy: 1 },
        { label: '0s', field: '0s', serverField: '0s' },
        { label: '5ms', field: '5ms', serverField: '5ms' },
        { label: '10ms', field: '10ms', serverField: '10ms' },
        { label: '25ms', field: '25ms', serverField: '25ms' },
        { label: '50ms', field: '50ms', serverField: '50ms' },
        { label: '100ms', field: '100ms', serverField: '100ms' },
        { label: 'Mmax', field: 'max', serverField: 'max' },
        { label: 'Min', field: 'min', serverField: 'min' },
        { label: 'Avg', field: 'avg', serverField: 'avg' },
        { label: 'Variance', field: 'variance', serverField: 'variance' },
        { label: 'Stddev', field: 'stddev', serverField: 'stddev' },
        { label: 'Samples', field: 'numsamples', serverField: 'numsamples' },
        { label: 'Location', field: 'locationtile', serverField: 'locationtile', groupBy: 3 }
    ]
)

export const appInstUsageMetrics = (self, data) => {
    return { method: endpoint.METRICS_CLIENT_APP_USAGE, data, keys: keys() }
}

