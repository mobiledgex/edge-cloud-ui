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

import { localFields } from "../../fields"

export const buildKey = (data) => {
    let build = {}
    if (data[localFields.buildName]) {
        build.name = data[localFields.buildName]
    }
    if (data[localFields.driverPath]) {
        build.driver_path = data[localFields.driverPath]
    }
    if (data[localFields.driverPathCreds]) {
        build.driver_path_creds = data[localFields.driverPathCreds]
    }
    if (data[localFields.operatingSystem]) {
        build.operating_system = data[localFields.operatingSystem]
    }
    if (data[localFields.kernelVersion]) {
        build.kernel_version = data[localFields.kernelVersion]
    }
    if (data[localFields.hypervisorInfo]) {
        build.hypervisor_info = data[localFields.hypervisorInfo]
    }
    if (data[localFields.md5Sum]) {
        build.md5sum = data[localFields.md5Sum]
    }
    return build
}