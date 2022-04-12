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

import { responseValid } from "../../../../../services/config"
import { convertUnit } from "../../../monitoring/helper/unitConvertor"

export const formatMetricData = (metricResource, numsamples, mc) => {
    const latest = numsamples === 1
    let formattedData = latest ? {} : []
    if (responseValid(mc)) {
        let responseData = mc.response.data
        if (responseData.data) {
            let metricDataList = responseData.data
            if (metricDataList.length > 0) {
                metricDataList.forEach(metricData => {
                    let series = metricData.Series
                    if (series && series.length > 0) {
                        const { tags, values, columns, name } = series[0]
                        const { keys } = metricResource
                        if (values.length > 0 && latest) {
                            let resourceTypes = keys
                            resourceTypes.map(type => {
                                let index = columns.indexOf(type.serverField)
                                if (index >= 0) {
                                    let value = values[0][index]
                                    value = type.unit ? convertUnit(type.unit, value) : value
                                    let resource = { 'label': type.label, icon: type.icon, value }
                                    if (type.serverFieldMax) {
                                        resource.max = values[0][columns.indexOf(type.serverFieldMax)]
                                    }
                                    formattedData[type.field] = resource
                                }
                            })
                        }
                        else {
                            let resourceTypes = keys.filter(key => {
                                let index = columns.indexOf(key.serverField)
                                key.index = index
                                if (key.serverFieldMax) {
                                    let maxIndex = columns.indexOf(key.serverFieldMax)
                                    if (maxIndex >= 0) {
                                        key.maxIndex = maxIndex
                                    }
                                }
                                return index >= 0
                            })
                        }
                    }
                })
            }
        }
    }
    return formattedData
}