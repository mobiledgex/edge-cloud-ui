/* eslint-disable */
/**Fetch monitoring metric data for app, cluster and cloudlet */

import maxBy from 'lodash/maxBy';
import meanBy from 'lodash/meanBy';
import minBy from 'lodash/minBy';
import { unit } from '../../utils/math_util'
import { fields } from '../model/format'
import cloneDeep from 'lodash/cloneDeep';

const metricKeyGenerator = (parentId, region, metric) => {
    return `${parentId}-${metric.serverField}${metric.subId ? `-${metric.subId}` : ''}-${region}`
}

export const fetchLocation = (parentId, avgValues, metricData, showList) => {
    for (let i = 0; i < showList.length; i++) {
        let show = showList[i]
        let valid = false
        if (parentId === 'appinst') {
            valid = metricData.includes(show[fields.region]) &&
                metricData.includes(show[fields.appName].toLowerCase()) &&
                metricData.includes(show[fields.organizationName]) &&
                metricData.includes(show[fields.clusterName]) &&
                metricData.includes(show[fields.clusterdeveloper]) &&
                metricData.includes(show[fields.cloudletName]) &&
                metricData.includes(show[fields.operatorName])
        }
        else {
            valid = metricData.includes(show[fields.region]) &&
                metricData.includes(show[fields.cloudletName]) &&
                metricData.includes(show[fields.operatorName])
        }
        if (valid) {
            avgValues['location'] = show[fields.cloudletLocation]
            avgValues['showData'] = show
        }
    }
    return avgValues
}

const avgCalculator = (avgData, parentId, data, region, metric, showList) => {
    let chartData = {}
    chartData = cloneDeep(data)
    chartData['values'] = {}
    let avgDataRegion = avgData[region]
    Object.keys(avgDataRegion).map(key => {

        let value = data['values'][key]
        let avgValues = avgDataRegion[key]
        if (value && avgValues) {
            chartData['values'][key] = value
            if (parentId === 'appinst' || parentId === 'cluster') {
                let avg = meanBy(data.values[key], v => (v[metric.position]))
                let max = maxBy(data.values[key], v => (v[metric.position]))[metric.position]
                let min = minBy(data.values[key], v => (v[metric.position]))[metric.position]

                if (metric.field === 'connections') {
                    avg = avg ? avg : 0
                    max = max ? max : 0
                    min = min ? min : 0
                }
                let avgUnit = metric.unit ? unit(metric.unit, avg) : avg
                let maxUnit = metric.unit ? unit(metric.unit, max) : max
                let minUnit = metric.unit ? unit(metric.unit, min) : min
                avgValues[metric.field] = [avgUnit, minUnit, maxUnit]
            }
            else {
                let latestData = value[0]
                let positionValue = latestData[metric.position] ? latestData[metric.position] : 0
                let positionmaxValue = latestData[metric.position + 1] ? latestData[metric.position + 1] : 0
                let convertedMaxValue = metric.unit ? unit(metric.unit, positionmaxValue) : positionmaxValue
                let convertedValue = metric.unit ? unit(metric.unit, positionValue) : positionValue
                avgValues[metric.field] = `${convertedValue} / ${convertedMaxValue}`
            }
        }
    })
    return chartData
}

const processData = (data) => {
    let metricList = data.metric
    let showList = data.show
    let parentId = data.parentId
    let region = data.region
    let metricTypeKeys = data.metricTypeKeys
    let avgData = data.avgData

    let chartData = {}
    chartData[region] = chartData[region] ? chartData[region] : {}
    if (metricList && metricList.length > 0) {
        metricList.map(metricData => {
            let key = Object.keys(metricData)[0]
            metricTypeKeys.map(metric => {
                let objectId = `${parentId}-${metric.serverField}`
                if (key === objectId) {
                    if (metricData[objectId]) {
                        let newData = {}
                        newData.region = region
                        newData.metric = metric
                        newData.values = metricData[objectId].values
                        newData.columns = metricData[objectId].columns
                        let metricKey = metricKeyGenerator(parentId, region, metric)
                        chartData[region][metricKey] = avgCalculator(avgData, parentId, newData, region, metric, showList)
                    }
                }
            })
        })
    }
    self.postMessage({ chartData, avgData })
}

export const format = (worker) => {
    processData(worker)
}