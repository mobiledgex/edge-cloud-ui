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

import { OS_LINUX } from "../../../helper/constant/perpetual"
import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.gpuConfig] = `${value[localFields.gpuDriverName]}${value[localFields.organizationName] ? '' : ' [MobiledgeX]'}`
    value[localFields.organizationName] = value[localFields.organizationName] ? value[localFields.organizationName] : 'MobiledgeX'
    value[localFields.operatorName] = value[localFields.organizationName]
    value[localFields.buildCount] = value[localFields.builds] ? value[localFields.builds].length : 0
    value[localFields.licenseConfig] = value[localFields.licenseConfig] !== undefined ? true : false
    if(value[localFields.buildCount] > 0)
    {
        value[localFields.builds].forEach(build=>{
            build[localFields.operatingSystem] = build[localFields.operatingSystem] ? build[localFields.operatingSystem] : OS_LINUX
        })
    }
    return value
}