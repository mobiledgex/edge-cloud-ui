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

import { perpetual } from '../../../helper/constant';
import { endpoint } from '../..';
import { authSyncRequest } from "../../service";
import { getAppKey } from '../app';
import { getCloudletPoolKey } from '../cloudletPool';
import { tpeState } from '../../../helper/formatter/id';
import { localFields } from '../../fields';

export const keys = () => ([
    { field: localFields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: localFields.trustPolicyExceptionName, label: 'Name', sortable: true, serverField: 'key#OS#name', visible: true, filter: true, group: true, key: true },
    { field: localFields.organizationName, label: 'App Developer', sortable: true, serverField: 'key#OS#app_key#OS#organization', visible: true, filter: true, group: true, key: true },
    { field: localFields.appName, label: 'App Name', sortable: true, serverField: 'key#OS#app_key#OS#name', visible: false, filter: true, group: true, key: true },
    { field: localFields.version, label: 'App Version', sortable: true, serverField: 'key#OS#app_key#OS#version', visible: false, filter: true, group: true, key: true },
    { field: localFields.operatorName, label: 'Operator', sortable: true, serverField: 'key#OS#cloudlet_pool_key#OS#organization', visible: true, filter: true, group: true, key: true },
    { field: localFields.poolName, label: 'Cloudlet Pool Name', serverField: 'key#OS#cloudlet_pool_key#OS#name', visible: false, key: true },
    { field: localFields.requiredOutboundConnections, serverField: 'outbound_security_rules', label: 'Required Outbound Connections', visible: false, dataType: perpetual.TYPE_JSON },
    { field: localFields.state, label: 'State', sortable: true, serverField: 'state', visible: true, filter: true, group: true, key: true, format: true },
])

export const getTPEKey = (data, isCreate) => {
    let trustPolicyException = {}
    trustPolicyException.key = { app_key: getAppKey(data), Name: data[localFields.trustPolicyExceptionName], cloudlet_pool_key: getCloudletPoolKey(data) }
    if (isCreate) {
        if (data[localFields.state]) {
            trustPolicyException.state = tpeState(data[localFields.state])
        }
        if (data[localFields.requiredOutboundConnections]) {
            trustPolicyException.outbound_security_rules = data[localFields.requiredOutboundConnections]
        }
    }
    return ({
        region: data[localFields.region],
        trustPolicyException
    })
}

export const createTrustPolicyException = async (self, data, callback) => {
    let requestData = getTPEKey(data, true)
    let request = { method: endpoint.CREATE_TRUST_POLICY_EXCEPTION, data: requestData }
    return await authSyncRequest(self, request, callback, data)
}

export const showTrustPolicyException = (self, data) => {
    return { method: endpoint.SHOW_TRUST_POLICY_EXCEPTION, data: data, keys: keys() }
}

export const updateTrustPolicyException = async (self, data) => {
    let requestData = getTPEKey(data, true)
    let request = { method: endpoint.UPDATE_TRUST_POLICY_EXCEPTION, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteTrustPolicyException = (self, data) => {
    let requestData = getTPEKey(data)
    return { method: endpoint.DELETE_TRUST_POLICY_EXCEPTION, data: requestData, success: `Trust Policy Exception ${data[localFields.trustPolicyExceptionName]} deleted successfully` }
}
