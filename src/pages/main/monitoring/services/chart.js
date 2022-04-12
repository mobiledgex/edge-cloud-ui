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
/*ChartJS Line Chart Datasets*/
import { LTTB } from 'downsample';
import moment from 'moment'
import momentTimezone from "moment-timezone";

/*Generates line chart dataset for given data*/
export const generateDataset = (chartData, values, avgData, timezone, labelPosition) => {
    let datasets = {}
    values = values ? values : {}
    Object.keys(values).forEach(key => {
        if (avgData[key] && (avgData[key].hidden === undefined || avgData[key].hidden === false)) {
            let dataList = values[key]
            if (dataList && dataList.length > 0) {
                let color = avgData[key] ? avgData[key].color : '#FFF'
                let formattedList = []
                dataList.forEach(value => {
                    if (value[chartData.resourceType.position] !== null) {
                        formattedList.push({ x: moment.tz(value[0], timezone).valueOf(), y: value[chartData.resourceType.position] })
                    }
                })
                if (formattedList.length > 0) {
                    let steppedLine = chartData.resourceType.steppedLine ? chartData.resourceType.steppedLine : false
                    datasets[key] = {
                        label: dataList[0][labelPosition ? labelPosition : 2],
                        fill: false,
                        lineTension: 0.5,
                        steppedLine,
                        backgroundColor: color,
                        borderColor: color,
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderWidth: 2,
                        borderJoinStyle: 'miter',
                        pointBorderColor: color,
                        pointBackgroundColor: color,
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: color,
                        pointHoverBorderColor: color,
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: LTTB(formattedList, 50)
                    }
                }
            }
        }
    })
    return datasets
}

export const generateDataset2 = (legend, tags, metric, timezone, dataList, legendField) => {
    let label = ''
    legendField.forEach((item, i) => {
        if(tags[item])
        {
            label = `${label} ${i>0 ? '[' : ''}${tags[item]}${i>0 ? ']' : ''}`
        }
    })
    let dataset = {}
    if (dataList && dataList.length > 0) {
        const { position, steppedLine } = metric
        let color = legend.color

        let data = legend.sorted ? dataList : []
        if (!legend.sorted) {
            dataList.forEach(value => {
                if (value[position] !== null) {
                    data.push({ x: moment.tz(value[0], timezone).valueOf(), y: value[position] })
                }
            })
        }

        dataset = {
            label,
            fill: false,
            lineTension: 0.5,
            steppedLine: steppedLine ? steppedLine : false,
            backgroundColor: color,
            borderColor: color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderWidth: 2,
            borderJoinStyle: 'miter',
            pointBorderColor: color,
            pointBackgroundColor: color,
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: color,
            pointHoverBorderColor: color,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data
        }
    }
    return dataset
}