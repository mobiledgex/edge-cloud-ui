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
import { authSyncRequest } from "../../service";
import { idFormatter } from '../../../helper/formatter'
import { cloudletKeys } from '../cloudlet';
import { endpoint } from '../..';
import { localFields } from '../../fields';

export const keys = () => ([
    { field: localFields.region, label: 'Region', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: localFields.networkName, serverField: 'key#OS#name', label: 'Network Name', sortable: true, visible: true, filter: true, group: true, key: true },
    { field: localFields.connectionType, label: 'Connection Type', serverField: 'connection_type', sortable: true, visible: true, clickable: true },
    { field: localFields.cloudletName, serverField: 'key#OS#cloudlet_key#OS#name', label: 'Cloudlet', sortable: true, visible: true, filter: true, key: true },
    { field: localFields.operatorName, label: 'Operator', serverField: 'key#OS#cloudlet_key#OS#organization', sortable: false, visible: true, clickable: true },
    { field: localFields.partnerOperator, serverField: 'key#OS#cloudlet_key#OS#federated_organization', label: 'Partner Operator', key: true },
    { field: localFields.accessRoutes, label: 'Routes', serverField: 'routes', sortable: false, visible: false, clickable: true, dataType: perpetual.TYPE_JSON }
])

export const getKey = (data, isCreate) => {
    let Network = {}
    Network.key = { cloudlet_key: cloudletKeys(data), name: data[localFields.networkName] }
    if (isCreate) {
        Network.connection_type = idFormatter.connectionType(data[localFields.connectionType])
        if (data[localFields.accessRoutes]) {
            Network.routes = data[localFields.accessRoutes]
        }
    }
    return ({
        region: data[localFields.region],
        Network: Network
    })
}

export const createNetwork = async (self, data, callback) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.CREATE_NETWORKS, data: requestData }
    return await authSyncRequest(self, request, callback, data)
}

export const showNetwork = (self, data) => {
    let requestData = getKey(data, true)
    return { method: endpoint.SHOW_NETWORKS, data: requestData, keys: keys() }
}

export const updateNetwork = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.UPDATE_NETWORKS, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteNetwork = (self, data) => {
    let requestData = getKey(data)
    return { method: endpoint.DELETE_NETWORKS, data: requestData, success: `Network ${data[localFields.networkName]} deleted successfully` }
}
