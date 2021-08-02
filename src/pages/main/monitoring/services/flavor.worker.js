/* eslint-disable */
import { fields } from "../../../../services/model/format"
import moment from 'moment'
import randomColor from 'randomcolor'
import { generateDataset } from './chart'
import { formatData } from "../../../../services/format/format"

const FLAVOR_USAGE_TIME = 0
const FLAVOR_USAGE_REGION = 1
const FLAVOR_USAGE_CLOUDLET = 2
const FLAVOR_USAGE_OPERATOR = 3
const FLAVOR_USAGE_COUNT = 4
const FLAVOR_USAGE_FLAVOR = 5

const utcTime = (format, date) => {
    return moment(date).utc().format(format)
}

const processLineChartData = (chartData, avgData, worker) => {
    const { timezone } = worker
    chartData['datasets'] = generateDataset(chartData, avgData, timezone, 5)
}

const processData = (worker) => {
    let metricData = worker.data
    let avgDataEU = worker.avgData
    let rowSelected = worker.rowSelected
    let metric = worker.metric
    let region = worker.region

    if (metricData) {
        let selected = []
        if (rowSelected > 0) {
            Object.keys(avgDataEU).map(key => {
                if (avgDataEU[key].selected) {
                    selected.push(`${avgDataEU[key][fields.cloudletName]}_${avgDataEU[key][fields.operatorName]}`)
                }
            })
        }
        let values = metricData.values
        Object.keys(values).map(valueKey => {
            let formattedList = values[valueKey].reduce((result, dataList) => {
                if (rowSelected === 0 || selected.includes(`${dataList[FLAVOR_USAGE_CLOUDLET]}_${dataList[FLAVOR_USAGE_OPERATOR]}`)) {
                    let time = utcTime('YYYY-MM-DD HH:mm:ss', dataList[FLAVOR_USAGE_TIME])
                    let flavor = dataList[FLAVOR_USAGE_FLAVOR]
                    let key = `${time}_${flavor}`
                    let data = dataList.map((data, i) => {
                        if (i === FLAVOR_USAGE_COUNT) {
                            return data + (result[key] ? result[key][i] : 0)
                        }
                        else {
                            return data
                        }
                    })
                    result[key] = data
                }
                return result
            }, {})

            values[valueKey] = Object.keys(formattedList).map(formatted => {
                return formattedList[formatted]
            })
        })

        let newData = {}
        newData.region = region
        newData.metric = metric
        newData.values = values
        newData.columns = metricData.columns
        return newData
    }
}

const avgFlavorData = (worker) => {
    let metricData = worker.data
    let avgFlavorData = worker.avgFlavorData
    let values = metricData.values
    let columns = metricData.columns
    let valueKeys = Object.keys(values)
    let avgKeys = Object.keys(avgFlavorData)
    let avgData = {}

    if (avgKeys.length > valueKeys.length) {
        avgKeys.map(avgKey => {
            if (valueKeys.includes(avgKey)) {
                avgData[avgKey] = avgFlavorData[avgKey]
            }
        })
        avgFlavorData = avgData
    }

    valueKeys.map((valueKey, i) => {
        let avg = {}
        if (avgFlavorData[valueKey]) {
            avg = avgFlavorData[valueKey]
        }
        else {
            avg['color'] = randomColor({
                count: 1,
            })[0]
        }
        columns.map((column, j) => {
            avg[column.serverField] = values[valueKey][FLAVOR_USAGE_TIME][j]
        })
        avgFlavorData[valueKey] = avg
    })

    return avgFlavorData

}

export const format = (worker) => {
    let avgData = worker.avgFlavorData
    let chartData = undefined
    const { response } = formatData(worker.request, worker.response)
    let data = response.data
    if (data.values && data.columns) {
        let calAvgData = worker.calAvgData
        if (calAvgData) {
            avgData = avgFlavorData({ ...worker, data })
        }
        chartData = processData({ ...worker, data })
        processLineChartData(chartData, avgData, worker)
    }
    self.postMessage({ chartData, avgData })
}

self.addEventListener("message", (event) => {
    format(event.data)
});