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

import { endpoint } from '../..'
import { redux_org } from '../../../helper/reduxData'
import { authSyncRequest } from '../../service'

export const orgEvents = (data) => {
    return { method: endpoint.EVENTS_SHOW, data: data, showSpinner: false }
}

export const showEvents = async (self, data, showSpinner) => {
    let mcRequest = await authSyncRequest(self, { method: endpoint.EVENTS_SHOW, data: data, showSpinner: showSpinner })
    return mcRequest
}

export const showAudits = async (self, data, org=undefined, showSpinner) => {
    let match = data.match ? data.match : {}
    match.types = [data.type]
    if (!redux_org.isAdmin(self) || Boolean(org)) {
        match.orgs = redux_org.nonAdminOrg(self) ? [redux_org.nonAdminOrg(self)] : [org]
    }
    data.match = match
    let mcRequest = await authSyncRequest(self, { method: endpoint.EVENTS_SHOW, data: data, showSpinner: showSpinner })
    return mcRequest
}