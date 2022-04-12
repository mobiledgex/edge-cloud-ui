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

import { uniqueId } from "../../helper/constant/shared";
import { map } from "./shared";

export const formatAlertData = (request, response, customData) => {
    let values = [];
    try {
        if (response && response.status === 200 && response.data) {
            let jsonData = response.data
            const keys = request.keys
            for (let i = 0; i < jsonData.length; i++) {
                let data = jsonData[i].data ? jsonData[i].data : jsonData[i];
                let value = {}
                map(value, data, keys)
                value.uuid = uniqueId()
                let newValue = value && customData ? customData(request, value) : value
                if (newValue) {
                    values.push(newValue)
                }
            }
        }
    }
    catch (e) {
        console.log('Response Error', e)
    }
    return values
}