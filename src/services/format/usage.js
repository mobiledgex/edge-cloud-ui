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

import { MEX_PROMETHEUS_APP_NAME } from "../../helper/constant/perpetual";

export const formatUsageData = (request, response) => {
    let formattedData = []
    try {
        if (response && response.status === 200 && response.data && response.data.data) {
            let dataList = response.data.data;
            if (dataList && dataList.length > 0) {
                let series = dataList[0].Series
                let messages = dataList[0].messages
                if (series && series.length > 0) {
                    series.map(data => {
                        let columns = data.columns
                        let values = data.values
                        for (let value of values) {
                            if (value.includes(MEX_PROMETHEUS_APP_NAME)) {
                                continue;
                            }
                            let data = {}
                            columns.map((column, i) => {
                                data[column] = value[i]
                            })
                            formattedData.push(data)
                        }
                    })
                }
            }
        }
    }
    catch (e) {
        //alert(e)
    }
    return formattedData
}