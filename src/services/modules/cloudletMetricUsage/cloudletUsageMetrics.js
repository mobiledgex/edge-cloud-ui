import { endpoint } from '../../../helper/constant';
import { fields } from '../../model/format';

export const deviceKeys = [
    { label: '0 - 5 ms', field: fields._0s },
    { label: '5 - 10 ms', field: fields._5ms },
    { label: '10 - 25 ms', field: fields._10ms },
    { label: '25 - 50 ms', field: fields._25ms },
    { label: '50 - 100 ms', field: fields._50ms },
    { label: '> 100 ms', field: fields._100ms },
    { label: 'Network', field: fields.networkType },
    { label: 'Carrier', field: fields.deviceCarrier },
]

const keys = () => (
    [
        { label: 'Date', field: 'time', serverField: 'time', visible: false, groupBy: 1 },
        { label: 'Region', field: fields.region, visible: true, groupBy: 2 },
        { label: 'Cloudlet', field: fields.cloudletName, serverField: 'cloudlet', visible: true, groupBy: 2 },
        { label: 'Operator', field: fields.operatorName, serverField: 'cloudletorg', visible: true, groupBy: 2 },
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
        { label: 'Location', field: fields.locationtile, serverField: 'locationtile', groupBy: 3 },
        { label: 'Network Type', field: fields.networkType, serverField: 'datanetworktype' },
        { label: 'Device Carrier', field: fields.deviceCarrier, serverField: 'devicecarrier' },
    ]
)

export const cloudletUsageMetrics = (self, data) => {
    return { method: endpoint.METRICS_CLIENT_CLOUDLET_USAGE, data, keys: keys() }
}

