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

export const formatColumns = (columns, keys) => {
    columns.splice(1, 0, 'region');
    let newColumns = []
    keys.map(key => {
        newColumns[columns.indexOf(key.serverField)] = key
    })
    return newColumns
}

export const groupByCompare = (dataList, columns, region) => {
    let keys = []
    columns.map((item, i) => {
        if (item.groupBy) {
            keys.push(i)
        }
    })
    return dataList.reduce((accumulator, x) => {
        x.splice(1, 0, region);
        let key = ''
        for (let i = 0; i < keys.length; i++) {
            key = key + x[keys[i]]
            if (i < keys.length - 1) {
                key = key + '_'
            }
        }
        key = key.toLowerCase()
        if (!accumulator[key]) {
            accumulator[key] = [];
        }
        accumulator[key].push(x);
        return accumulator;
    }, {})
}

export const formatBillingData = (request, response) => {
    let formattedData = []
    try {
        if (response && response.data && response.data.data) {
            let dataList = response.data.data;
            if (dataList && dataList.length > 0) {
                const keys = request.keys
                const requestData = request.data
                let series = dataList[0].Series
                let messages = dataList[0].messages
                if (series && series.length > 0) {
                    for (let data of series) {
                        let formatted = {}
                        let formattingData = {}
                        let key = data.name
                        if (key === 'clusterinst-checkpoints' || key === 'appinst-checkpoints') {
                            continue
                        }
                        formattingData.columns = formatColumns(data.columns, keys)
                        formattingData.values = groupByCompare(data.values, formattingData.columns, requestData.region)
                        formatted[key] = formattingData
                        formattedData.push(formatted)
                    }

                }
            }
        }
    }
    catch (e) {
        //alert(e)
    }
    return formattedData
}

export const formatMetricData = (request, response) => {
    let dataList = []
    try {
        let data = response.data.data;
        if (data && data.length > 0) {
            let series = data[0].Series
            if (series && series.length > 0) {
                dataList = series
            }
        }
    }
    catch (e) {
    }
    return dataList
}

export const formatMetricUsageData = (request, response) => {
    let formattedData = {}
        try {
            if (response && response.data && response.data.data) {
                let dataList = response.data.data;
                if (dataList && dataList.length > 0) {
                    const keys = request.keys
                    const requestData = request.data
                    let series = dataList[0].Series
                    let messages = dataList[0].messages
                    if (series && series.length > 0) {
                        let formattingData = { columns: formatColumns(series[0].columns, keys), values: {} }
                        for (let data of series) {
                            formattingData.values = { ...formattingData.values, ...groupByCompare(data.values, formattingData.columns, requestData.region) }
                        }
                        formattedData = formattingData
                    }
                }
            }
        }
        catch (e) {
            //alert(e)
        }
    return formattedData
}