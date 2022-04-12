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
import { redux_org } from '../../../helper/reduxData';

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

export const clientMetrics = (self, data, organization) => {
    data.appinst = redux_org.isOperator(self) ? { cluster_inst_key: { cloudlet_key: { organization } } } : { app_key: { organization } }
    return { method: endpoint.CLIENT_METRICS_ENDPOINT, data: data, keys: clientMetricsKeys }
}
