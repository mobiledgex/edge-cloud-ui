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

import { ipSupport, platformType, infraApiAccess } from "../../../helper/formatter/label"
import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.cloudletStatus] = value[localFields.maintenanceState] && value[localFields.maintenanceState] !== 0 ? 999 : 4
    value[localFields.ipSupport] = ipSupport(value[localFields.ipSupport])
    value[localFields.platformType] = value[localFields.platformType] ? platformType(value[localFields.platformType]) : 'Fake'
    value[localFields.infraApiAccess] = infraApiAccess(value[localFields.infraApiAccess] ? value[localFields.infraApiAccess] : 0)
    value[localFields.createdAt] = value[localFields.createdAt] ? value[localFields.createdAt]: undefined
    value[localFields.updatedAt] = value[localFields.updatedAt] ? value[localFields.updatedAt] : undefined
    value[localFields.gpuConfig] = value[localFields.gpuDriverName] ? `${value[localFields.gpuDriverName]}${value[localFields.gpuORG] ? '' : ' [MobiledgeX]'}` : undefined
    value[localFields.gpuExist] = value[localFields.gpuConfig] ? true : false
    value[localFields.trusted] = value[localFields.trustPolicyName] !== undefined
    return value
}