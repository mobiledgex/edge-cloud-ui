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

import { perpetual } from "../../../../helper/constant"

export const osList = [perpetual.OS_LINUX, perpetual.OS_WINDOWS, perpetual.OS_OTHERS]

export const buildTip = `List of GPU driver build
Build Name:</b> Unique identifier key
Driver Path:</b> Path where the driver package is located, if it is authenticated path, then credentials must be passed as part of URL (one-time download path)
MD5 Sum:</b> Driver package md5sum to ensure package is not corrupted
Driver Path Creds:</b> Optional credentials (username:password) to access driver path
Operating System:</b> Operator System supported by GPU driver build, one of Linux, Windows, Others
Kernel Version:</b> Kernel Version supported by GPU driver build
Hypervisor Info:</b> Info on hypervisor supported by vGPU driver
`