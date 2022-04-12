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


export const toJson = (data) => {
    let toJson = []
    if (data) {
        if (typeof data === 'object') {
            if(data)
            {
                toJson = Array.isArray(data) ? data : [data]
            }
        } else {
            let toArray = data.split('\n')
            toArray.pop();
            toJson = toArray.map((str) => (JSON.parse(str)))
        }
    }
    return toJson
}

export const isEmpty = (obj) => {
    return obj === undefined || Object.keys(obj).length === 0;
}