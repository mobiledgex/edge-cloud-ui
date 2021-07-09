import { endpoint } from '../../../helper/constant';
import { fields } from '../../model/format';

const keys = () => (
    [
        { label: 'Date', field: 'time', serverField: 'time', visible: false, groupBy: 1 },
        { label: 'Region', field: fields.region, visible: true, groupBy: 2 },
        { label: 'App', field: fields.appName, serverField: 'app', visible: true, groupBy: 2, filter: true },
        { label: 'Version', field: fields.version, serverField: 'ver', visible: true, groupBy: 2 },
        { label: 'App Developer', field: fields.organizationName, serverField: 'apporg', visible: true, groupBy: 2 },
        { label: 'Cluster', field: fields.clusterName, serverField: 'cluster', visible: true, groupBy: 2 },
        { label: 'Cluster Developer', field: fields.clusterdeveloper, serverField: 'clusterorg', visible: true, groupBy: 2 },
        { label: 'Cloudlet', field: fields.cloudletName, serverField: 'cloudlet', visible: true, groupBy: 2 },
        { label: 'Operator', field: fields.operatorName, serverField: 'cloudletorg', visible: true, groupBy: 2 },
        { label: 'Network Type', field: fields.networkType, serverField: 'datanetworktype' },
        { label: '0s', field: '0s', serverField: '0s', sum: true },
        { label: '5ms', field: '5ms', serverField: '5ms', sum: true },
        { label: '10ms', field: '10ms', serverField: '10ms', sum: true },
        { label: '25ms', field: '25ms', serverField: '25ms', sum: true },
        { label: '50ms', field: '50ms', serverField: '50ms', sum: true },
        { label: '100ms', field: '100ms', serverField: '100ms', sum: true },
        { label: 'Mmax', field: 'max', serverField: 'max', concat:true },
        { label: 'Min', field: 'min', serverField: 'min', concat:true },
        { label: 'Avg', field: 'avg', serverField: 'avg', concat:true },
        { label: 'Variance', field: 'variance', serverField: 'variance' },
        { label: 'Stddev', field: 'stddev', serverField: 'stddev' },
        { label: 'Samples', field: 'numsamples', serverField: 'numsamples' },
        { label: 'Location', field: fields.locationtile, serverField: 'locationtile', groupBy: 3 }
    ]
)

export const appInstUsageMetrics = (self, data) => {
    return { method: endpoint.METRICS_CLIENT_APP_USAGE, data, keys: keys() }
}

