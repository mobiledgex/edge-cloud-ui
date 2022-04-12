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
import { toJson } from "../../utils/json_util";
import { generateUUID, map } from "./shared";

export const formatShowData = (request, response, customData, isUnique, self = null) => {
    let values = [];
    if (response && response.status === 200) {
        try {
            if (response.data) {
                let dataArray = toJson(response.data);
                if (dataArray && dataArray.length > 0) {
                    const requestData = request.data
                    const keys = request.keys
                    for (let dataObject of dataArray) {
                        let data = dataObject.data ? dataObject.data : dataObject;
                        let value = {}
                        if (keys) {
                            map(value, data, keys)
                        }
                        else {
                            value = data
                        }
                        if (requestData && value.region === undefined) { value.region = requestData.region }
                        value.uuid = keys ? (isUnique) ? generateUUID(keys, value) : uniqueId() : undefined
                        let newValue = customData ? customData(request, value, self) : value
                        if (newValue) {
                            if (keys && keys.length === 1) {
                                newValue = newValue[keys[0].field]
                            }
                            values.push(newValue)
                        }
                    }
                }
            }
        }
        catch (e) {
            console.log('Response Error', e)
        }
    }
    return values
}