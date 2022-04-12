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

import * as perpetual from "../../../helper/constant/perpetual"
import { ipAccess } from "../../../helper/formatter/label"
import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.ipAccess] = ipAccess(value[localFields.ipAccess])
    value[localFields.reservable] = value[localFields.reservable] ? value[localFields.reservable] : false
    value[localFields.numberOfNodes] = value[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES ? value[localFields.numberOfNodes] ? value[localFields.numberOfNodes] : 0 : undefined
    value[localFields.sharedVolumeSize] = value[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES ? value[localFields.sharedVolumeSize] ? value[localFields.sharedVolumeSize] : 0 : undefined
    value[localFields.createdAt] = value[localFields.createdAt] ? value[localFields.createdAt] : undefined
    value[localFields.updatedAt] = value[localFields.updatedAt] ? value[localFields.updatedAt] : undefined
    value[localFields.cloudlet_name_operator] = `${value[localFields.cloudletName]} [${value[localFields.operatorName]}]`
    return value
}