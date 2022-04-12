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

import { SHOW_APP_INST, SHOW_CLOUDLET, SHOW_CLUSTER_INST } from "../../../../../services/endpoint";
import { MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION } from "../../../../../helper/constant/perpetual";
import * as serverFields from "../../../../../helper/formatter/serverFields";
import { localFields } from "../../../../../services/fields";

/**
 * alerts array order indicates priority with last index indicates high priority
 */

const STATE_IN_PROGRESS = [serverFields.CREATING, serverFields.CREATE_REQUESTED, serverFields.CREATING_DEPENDENCIES, serverFields.DELETE_PREPARE, serverFields.DELETE_REQUESTED, serverFields.DELETING, serverFields.UPDATING, serverFields.UPDATE_REQUESTED, serverFields.CRM_INITOK]

const cloudletAlerts = [{ field: localFields.state, states: [{ values: [serverFields.READY] }, { type: 'transient', color: '#FFA000', values: STATE_IN_PROGRESS }] }]
const clusterAlerts = [{ field: localFields.state, states: [{ values: [serverFields.READY] }, { type: 'transient', color: '#FFA000', values: STATE_IN_PROGRESS }] }]
const appInstAlerts = [{ field: localFields.state, states: [{ values: [serverFields.READY] }, { type: 'transient', color: '#FFA000', values: STATE_IN_PROGRESS }] }, { field: localFields.healthCheck, states: [{ values: [serverFields.OK] }] }]

export const sequence = () => ([
    { label: 'Region', active: true, field: localFields.region },
    { label: 'Operator', active: true, field: localFields.operatorName },
    { label: 'Cloudlet', active: false, field: localFields.cloudletName, alerts: cloudletAlerts },
    { label: 'Developer', active: false, field: localFields.clusterdeveloper },
    { label: 'Cluster', active: false, field: localFields.clusterName, alerts: clusterAlerts },
    // { label: 'App Developer', active: false, field: localFields.appDeveloper },
    { label: 'App', active: false, field: localFields.appName, alerts: appInstAlerts },
])

export const dataForms = [
    {
        method: SHOW_APP_INST,
        field: localFields.appName,
        fields: [localFields.cloudletName, localFields.operatorName, localFields.clusterName, localFields.clusterdeveloper, [localFields.state, localFields.healthCheck], localFields.organizationName],
        alerts: [{ field: localFields.state, values: [serverFields.READY] }, { type: 'transient', field: localFields.state, values: STATE_IN_PROGRESS }],
        skip: [{ field: localFields.appName, values: [MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION] }]
    },
    {
        method: SHOW_CLUSTER_INST,
        field: localFields.clusterName, //field is grouped with array in fields
        fields: [localFields.cloudletName, localFields.organizationName, [localFields.state], localFields.operatorName],
        alerts: [{ field: localFields.state, values: [serverFields.READY] }, { type: 'transient', field: localFields.state, values: STATE_IN_PROGRESS }]
    },
    {
        method: SHOW_CLOUDLET,
        field: localFields.cloudletName,
        fields: [[localFields.state], localFields.operatorName],
        alerts: [{ field: localFields.state, values: [serverFields.READY] }, { type: 'transient', field: localFields.state, values: STATE_IN_PROGRESS }]
    }
]