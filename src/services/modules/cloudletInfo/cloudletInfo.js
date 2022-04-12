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

import { redux_org } from '../../../helper/reduxData'
import { perpetual } from '../../../helper/constant';
import { localFields } from '../../fields';
import { endpoint } from '../..';

export const keys = () => ([
    { field: localFields.cloudletName, serverField: 'key#OS#name' },
    { field: localFields.operatorName, serverField: 'key#OS#organization' },
    { field: localFields.state, serverField: 'state' },
    { field: localFields.notifyId, serverField: 'notify_id' },
    { field: localFields.controller, serverField: 'controller' },
    { field: localFields.status, serverField: 'status' },
    { field: localFields.containerVersion, serverField: 'container_version' },
    { field: localFields.osMaxRam, serverField: 'os_max_ram' },
    { field: localFields.osMaxVCores, serverField: 'os_max_vcores' },
    { field: localFields.osMaxVolGB, serverField: 'os_max_vol_gb' },
    { field: localFields.flavors, serverField: 'flavors' },
    { field: localFields.compatibilityVersion, serverField: 'compatibility_version' },
])

export const getKey = (data) => {
    return ({
        region: data[localFields.region],
        cloudletinfo: {
            key: {
                organization: data[localFields.operatorName],
                name: data[localFields.cloudletName]
            }
        }
    })
}

export const showCloudletInfoData = (self, data, specific) => {
    let requestData = {}
    let isDeveloper = redux_org.isDeveloper(self) || data.type === perpetual.DEVELOPER
    let method = isDeveloper ? endpoint.SHOW_ORG_CLOUDLET_INFO : endpoint.SHOW_CLOUDLET_INFO
    if (specific) {
        let cloudletinfo = { key: data.cloudletkey ? data.cloudletkey : data.cloudlet.key }
        requestData = {
            uuid: data.uuid,
            region: data.region,
            cloudletinfo
        }
    }
    else {
        requestData.region = data.region
        let organization = data.org ? data.org : redux_org.nonAdminOrg(self)
        if (organization) {
            if (isDeveloper) {
                requestData.org = organization
            }
            else if (redux_org.isOperator(self) || data.type === perpetual.OPERATOR) {
                requestData.cloudletinfo = { key: { organization } }
            }
        }
    }
    return { method, data: requestData, keys: keys() }
}