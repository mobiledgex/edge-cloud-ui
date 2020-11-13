/* eslint-disable */
/**Fetch monitoring metric data for app, cluster and cloudlet */

import randomColor from 'randomcolor'
import { maxBy, meanBy, minBy } from 'lodash';
import { unit } from '../../utils/math_util'
import {fields} from '../model/format'

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
    Object.keys(data.values).map(key => {
        let value = data.values[key][0]

        let avg = meanBy(data.values[key], v => (v[metric.position]))
        let max = maxBy(data.values[key], v => (v[metric.position]))[metric.position]
        let min = minBy(data.values[key], v => (v[metric.position]))[metric.position]

        if(metric.field === 'connections')
        {
                avg = avg ? avg : '0'
                max = max ? max : '0'
                min = min ? min : '0'
        }
        
        let avgValues = avgData[parentId][region][key]

        if (avgValues === undefined) {
            avgValues = {}
            data.columns.map((column, i) => {
                avgValues[column.serverField] = value[i]
            })
            avgValues['color'] = randomColor({
                count: 1,
            })[0]

            // if (getUserRole().includes(DEVELOPER)) {
            //     if (key.includes('envoy')) {
            //         avgValues['disabled'] = true
            //     }
            // }
            avgValues['selected'] = false
            avgValues = fetchLocation(parentId, avgValues, value, showList)
        }
        let avgUnit = metric.unit ? unit(metric.unit, avg) : avg
        let maxUnit = metric.unit ? unit(metric.unit, max) : max
        let minUnit = metric.unit ? unit(metric.unit, min) : min
        avgValues[metric.field] = [avgUnit, minUnit, maxUnit]
        avgData[parentId][region][key] = avgValues
    })
}

const processData = (data) => {
    let metricDataList = data.metric
    let showList = data.show
    let parentId = data.parentId
    let region = data.region
    let metricTypeKeys = data.metricTypeKeys
    let chartData = {}
    chartData[parentId] = chartData[parentId] ? chartData[parentId] : {}
    chartData[parentId][region] = chartData[parentId][region] ? chartData[parentId][region] : {}

    let avgData = data.avgData
    avgData[parentId] = avgData[parentId] ? avgData[parentId] : {}
    avgData[parentId][region] = avgData[parentId][region] ? avgData[parentId][region] : {}

    if (metricDataList && metricDataList.length > 0) {
        metricDataList.map(metricData => {
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
                        chartData[parentId][region][metricKey] = newData
                        avgCalculator(avgData, parentId, newData, region, metric, showList)
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