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

import { localFields } from '../../fields'
import { perpetual } from '../../../helper/constant'
import { endpoint } from '../..';
import { authSyncRequest, syncRequest } from '../../service'
import { responseValid } from '../../config'

export const keys = () => ([
    { field: localFields.username, serverField: 'username', label: 'Username', sortable: true, visible: true, filter: true, group: true },
    { field: localFields.organizationName, serverField: 'org', label: 'Organization', sortable: true, visible: true, filter: true, group: true },
    { field: localFields.role, serverField: 'role', label: 'Role Type', sortable: true, visible: true, filter: true, group: true }
])

export const getKey = (data) => {
    return ({
        org: data[localFields.organizationName],
        username: data[localFields.username],
        role: data[localFields.role]
    })
}

export const showUsers = (self, data) => {
    return { method: endpoint.SHOW_USERS, data: data, keys: keys() }
}

export const showUser = (self) => {
    return { method: endpoint.CURRENT_USER }
}

export const showUserRoles = async (self) => {
    let mc = await authSyncRequest(self, { method: endpoint.SHOW_ROLE })
    return mc
}

export const addUser = async (self, data) => {
    let requestData = getKey(data, true)
    let request = { method: endpoint.ADD_USER_ROLE, data: requestData }
    return await authSyncRequest(self, request)
}

export const deleteUser = (self, data) => {
    let requestData = getKey(data);
    return { method: endpoint.DELETE_USER, data: requestData, success: `User ${data[localFields.username]} removed successfully` }
}

export const updateUser = async (self, data)=>{
    let request = {method : endpoint.UPDATE_USER, data}
    return await authSyncRequest(self, request)
}

export const updateUserMetaData = async (self, data) => {
    data = JSON.stringify(data)
    let mc = await updateUser(self, { Metadata: data })
    let valid = responseValid(mc)
    if (valid) {
        localStorage.setItem(perpetual.LS_USER_META_DATA, data)
    }
    return valid
}

export const updatePwd = async (self, data) => {
    let request = { method: endpoint.NEW_PASSWORD, data }
    return await authSyncRequest(self, request)
}