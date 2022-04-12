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

import { liveness, ipAccess } from "../../../helper/formatter/label"
import { localFields } from "../../fields"
import { redux_org } from "../../../helper/reduxData"
import { MEX_PROMETHEUS_APP_NAME, NFS_AUTO_PROVISION } from "../../../helper/constant/perpetual"

export const customize = (request, value, self = null) => {
    if ((value[localFields.appName] === MEX_PROMETHEUS_APP_NAME || value[localFields.appName] === NFS_AUTO_PROVISION) && !redux_org.isAdmin(self)) {
        value = undefined
    }
    else {
        value[localFields.liveness] = value[localFields.liveness]
        value[localFields.createdAt] = value[localFields.createdAt] ? value[localFields.createdAt] : undefined
        value[localFields.updatedAt] = value[localFields.updatedAt] ? value[localFields.updatedAt] : undefined
        value[localFields.ipAccess] = value[localFields.ipAccess] ? ipAccess(value[localFields.ipAccess]) : undefined
        value[localFields.revision] = value[localFields.revision] ? value[localFields.revision] : '0'
        value[localFields.healthCheck] = value[localFields.healthCheck] ? value[localFields.healthCheck] : 0
        value[localFields.sharedVolumeSize] = value[localFields.autoClusterInstance] ? value[localFields.sharedVolumeSize] ? value[localFields.sharedVolumeSize] : 0 : undefined
        value[localFields.cloudlet_name_operator] = `${value[localFields.cloudletName]} [${value[localFields.operatorName]}]`
        value[localFields.app_name_version] = `${value[localFields.appName]} [${value[localFields.version]}]`
    }
    return value
}