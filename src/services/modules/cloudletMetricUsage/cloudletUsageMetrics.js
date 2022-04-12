/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { endpoint } from '../..';
import { localFields } from '../../fields';

export const deviceKeys = [
    { label: '0 - 5 ms', field: localFields._0s, default: 0 },
    { label: '5 - 10 ms', field: localFields._5ms, default: 0 },
    { label: '10 - 25 ms', field: localFields._10ms, default: 0 },
    { label: '25 - 50 ms', field: localFields._25ms, default: 0 },
    { label: '50 - 100 ms', field: localFields._50ms, default: 0 },
    { label: '> 100 ms', field: localFields._100ms, default: 0 },
    { label: 'Network', field: localFields.networkType, default: 'N/A' },
    { label: 'Carrier', field: localFields.deviceCarrier, default: 'N/A' },
]

const keys = () => (
    [
        { label: 'Date', field: 'time', serverField: 'time', visible: false, groupBy: 1 },
        { label: 'Region', field: localFields.region, visible: true, groupBy: 2 },
        { label: 'Cloudlet', field: localFields.cloudletName, serverField: 'cloudlet', visible: true, groupBy: 2 },
        { label: 'Operator', field: localFields.operatorName, serverField: 'cloudletorg', visible: true, groupBy: 2 },
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
        { label: 'Location', field: localFields.locationtile, serverField: 'locationtile', groupBy: 3 },
        { label: 'Network Type', field: localFields.networkType, serverField: 'datanetworktype' },
        { label: 'Device Carrier', field: localFields.deviceCarrier, serverField: 'devicecarrier' },
    ]
)

export const cloudletUsageMetrics = (self, data) => {
    return { method: endpoint.METRICS_CLIENT_CLOUDLET_USAGE, data, keys: keys() }
}

