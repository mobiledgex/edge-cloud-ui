/* eslint-disable */
/**Fetch monitoring metric data for app, cluster and cloudlet */

import maxBy from 'lodash/maxBy';
import meanBy from 'lodash/meanBy';
import minBy from 'lodash/minBy';
import cloneDeep from 'lodash/cloneDeep';
import { convertUnit } from '../helper/unitConvertor';
import { generateDataset, generateDataset2 } from './chart';
import { formatData } from '../../../../services/format/format';
import { fields } from '../../../../services/model/format';
import { DEPLOYMENT_TYPE_VM, PARENT_APP_INST, PARENT_CLUSTER_INST, PLATFORM_TYPE_OPEN_STACK, PLATFORM_TYPE_VCD } from '../../../../helper/constant/perpetual';
import { CLOUDLET_METRICS_ENDPOINT, APP_INST_METRICS_ENDPOINT, CLUSTER_METRICS_ENDPOINT } from '../../../../helper/constant/endpoint';

const processLineChartData = (chartDataList, values, worker, legendsSkip) => {
    const { legends, timezone } = worker
    chartDataList.forEach(chartData => {
        chartData['datasets'] = generateDataset(chartData, values, legends, timezone, undefined, legendsSkip)
    })
}

const avgCalculator = (parentId, values, metric, legends, legendsSkip) => {
    let chartData = {}
    let resources = {}
    const keys = Object.keys(values)
    for (let valueKey of keys) {
        if (parentId === PARENT_APP_INST) {
            let avgValue = legends[valueKey]
            let skip = metric.field === fields.disk || metric.field === fields.sent || metric.field === fields.received
            if (skip && avgValue) {
                skip = avgValue[fields.deployment] === DEPLOYMENT_TYPE_VM
                skip = skip ? (avgValue[fields.platformType] === PLATFORM_TYPE_OPEN_STACK || avgValue[fields.platformType] === PLATFORM_TYPE_VCD) : skip
            }
            if (skip) {
                legendsSkip.push(valueKey)
                continue;
            }
        }
        let value = values[valueKey]
        if (value && legends[valueKey]) {
            let latestData = value[0]

            resources[valueKey] = resources[valueKey] ? resources[valueKey] : {}
            resources[valueKey][metric.field] = { used: latestData[metric.position] }
        }
    }
    return {chartData, resources}
}

const processData = (worker) => {

    const { metric, dataList, parentId, region, legends } = worker
    const metricList = metric.keys ? metric.keys : [metric]
    let legendsSkip = []
    let chartList = []
    let resources = {}
    if (dataList.values && dataList.columns) {
        metricList.forEach(metric => {
            let dataObject = avgCalculator(parentId, dataList.values, metric, legends, legendsSkip)
            let chartData = dataObject.chartData
            chartData.region = region
            chartData.resourceType = metric
            resources = dataObject.resources
            chartList.push(chartData)
        })
    }
    processLineChartData(chartList, dataList.values, worker, legendsSkip)
    self.postMessage({ status: 200, data: chartList, resources })
}

const generateKey = (metricKeys, data) => {
    let key = ''
    metricKeys.forEach((item, i) => {
        if (item.groupBy) {
            if (key.length > 0) {
                key = key + '_'
            }
            key = key + data[item.serverField]
        }
    })
    return key.toLowerCase()
}

const processData2 = (worker) => {
    const { metric, dataList, region, legends, timezone, metricKeys, parentId } = worker
    const metricList = metric.keys ? metric.keys : [metric]
    let finalData = []
    let resources = {}
    if (dataList && dataList.length > 0) {
        let chartData = {}
        for (let data of dataList) {
            let tags = data.tags
            let values = data.values
            let currentData = values[0]
            let count = 1
            while (currentData[metricList[0].position] === null) {
                currentData = values[count]
                count++
            }
            let key = generateKey(metricKeys, tags)
            if (legends[key]) {
                for (let item of metricList) {
                    chartData[item.field] = chartData[item.field] ? chartData[item.field] : { resourceType: item, region, datasets: {}}
                    if (parentId === PARENT_APP_INST || parentId === PARENT_CLUSTER_INST) {
                        let avg = meanBy(values, v => (v[item.position]))
                        let max = maxBy(values, v => (v[item.position]))[item.position]
                        let min = minBy(values, v => (v[item.position]))[item.position]

                        if (item.field === 'connections') {
                            avg = avg ? avg : 0
                            max = max ? max : 0
                            min = min ? min : 0
                        }
                        let avgUnit = item.unit ? convertUnit(item.unit, avg, true) : avg
                        let maxUnit = item.unit ? convertUnit(item.unit, max, true) : max
                        let minUnit = item.unit ? convertUnit(item.unit, min, true) : min
                        chartData[item.field]['legends'][key] = {}
                        chartData[item.field]['legends'][key][item.field] = [avgUnit, minUnit, maxUnit]
                    }
                    else {
                        let positionValue = currentData[item.position] ? currentData[item.position] : 0
                        let positionmaxValue = currentData[item.position + 1] ? currentData[item.position + 1] : 0
                        let convertedMaxValue = item.unit ? convertUnit(item.unit, positionmaxValue, true) : positionmaxValue
                        let convertedValue = item.unit ? convertUnit(item.unit, positionValue, true) : positionValue
                        resources[key] = resources[key] ? resources[key] : {}
                        resources[key][item.field] = {infraUsed:convertedValue, infraAllotted:convertedMaxValue}
                    }
                    chartData[item.field]['datasets'][key] = generateDataset2(tags, item, timezone, values, legends[key])
                }
            }
        }

        for (let item of metricList) {
            finalData.push(chartData[item.field])
        }
    }
    self.postMessage({ status: 200, data: finalData, resources })
}

export const format = (worker) => {
    const { request, response } = formatData(worker.request, worker.response)
    if (request.method === CLOUDLET_METRICS_ENDPOINT || request.method === APP_INST_METRICS_ENDPOINT || request.method === CLUSTER_METRICS_ENDPOINT) {
        processData2({ ...worker, dataList: response.data })
    }
    else {
        processData({ ...worker, dataList: response.data })
    }
}

self.addEventListener("message", (event) => {
    format(event.data)
});