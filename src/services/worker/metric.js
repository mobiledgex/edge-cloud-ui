/* eslint-disable */
/**Fetch monitoring metric data for app, cluster and cloudlet */

import maxBy from 'lodash/maxBy';
import meanBy from 'lodash/meanBy';
import minBy from 'lodash/minBy';
import cloneDeep from 'lodash/cloneDeep';
import { convertUnit } from '../../sites/main/monitoring/helper/unitConvertor';
import { generateDataset } from './monitoring/chart'

const processLineChartData = (chartDataList, inp) => {
    const { avgData, timezone } = inp
    chartDataList.forEach(chartData => {
        chartData['datasets'] = generateDataset(chartData, avgData, timezone)
    })
}

const avgCalculator = (parentId, data, metric) => {
    let chartData = {}
    chartData = cloneDeep(data)
    chartData['avgData'] = chartData['avgData'] ? chartData['avgData'] : {}
    Object.keys(data.values).map(valueKey => {
        let value = data.values[valueKey]
        if (value) {
            if (parentId === 'appinst' || parentId === 'cluster') {
                let avg = meanBy(value, v => (v[metric.position]))
                let max = maxBy(value, v => (v[metric.position]))[metric.position]
                let min = minBy(value, v => (v[metric.position]))[metric.position]

                if (metric.field === 'connections') {
                    avg = avg ? avg : 0
                    max = max ? max : 0
                    min = min ? min : 0
                }
                let avgUnit = metric.unit ? convertUnit(metric.unit, avg, true) : avg
                let maxUnit = metric.unit ? convertUnit(metric.unit, max, true) : max
                let minUnit = metric.unit ? convertUnit(metric.unit, min, true) : min
                let avgData = {}
                avgData[metric.field] = [avgUnit, minUnit, maxUnit]
                chartData['avgData'][valueKey] = avgData
            }
            else {
                let latestData = value[0]
                let positionValue = latestData[metric.position] ? latestData[metric.position] : 0
                let positionmaxValue = latestData[metric.position + 1] ? latestData[metric.position + 1] : 0
                let convertedMaxValue = metric.unit ? convertUnit(metric.unit, positionmaxValue, true) : positionmaxValue
                let convertedValue = metric.unit ? convertUnit(metric.unit, positionValue, true) : positionValue
                let avgData = {}
                avgData[metric.field] = `${convertedValue} / ${convertedMaxValue}`
                chartData['avgData'][valueKey] = avgData
            }
        }
    })
    return chartData
}

const processData = (inp) => {
    let dataList = inp.metricList
    let parentId = inp.parentId
    let region = inp.region
    let metricList = inp.metric.keys ? inp.metric.keys : [inp.metric]

    let chartData = []

    if (dataList && dataList.length > 0) {
        dataList.map(metricData => {
            let key = Object.keys(metricData)[0]
            metricList.map(metric => {
                let objectId = metric.serverHead ? metric.serverHead : `${parentId}-${metric.serverField}`
                if (key === objectId) {
                    if (metricData[objectId]) {
                        let newData = {}
                        newData.region = region
                        newData.metric = metric
                        newData.values = metricData[objectId].values
                        newData.columns = metricData[objectId].columns
                        chartData.push(avgCalculator(parentId, newData, metric))
                    }
                }
            })

        })
    }
    processLineChartData(chartData, inp)
    self.postMessage(chartData)
}

export const format = (worker) => {
    processData(worker)
}