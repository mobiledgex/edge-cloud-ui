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

/* eslint-disable */

const processData = (request, response) => {
    let formattedData = {}
    const keys = request.keys
    try {
        if (response && response.data && response.data.data) {
            let dataList = response.data.data;
            if (dataList && dataList.length > 0) {
                const keys = request.keys
                const requestData = request.data
                let series = dataList[0].Series
                let messages = dataList[0].messages
                if (series && series.length > 0) {
                    for (const data of series) {
                        let tags = data.tags
                        let values = data.values
                        let key = request.data.region
                        keys.forEach((item, i) => {
                            if (item.groupBy) {
                                key = i > 0 ? key + '_' : key
                                key = key + tags[item.serverField]
                            }
                        })
                        key = key.toLowerCase()
                        formattedData[key] = formattedData[key] ? formattedData[key] : { skip: true }
                        if (formattedData[key]['tags'] === undefined) {
                            formattedData[key]['tags'] = tags
                        }
                        let value = values[0][1]
                        if (formattedData[key].skip) {
                            formattedData[key].skip = value <= 0
                        }
                        formattedData[key][tags['method']]  = formattedData[key][tags['method']]  ? formattedData[key][tags['method']]  : 0
                        formattedData[key][tags['method']] = formattedData[key][tags['method']] + (value ? value : 0)
                    }
                }
            }
        }
    }
    catch (e) {
        //alert(e)
    }
    self.postMessage({ data: formattedData })
}

export const format = (worker) => {
    processData(worker.request, worker.response)
}

self.addEventListener("message", (event) => {
    format(event.data)
});