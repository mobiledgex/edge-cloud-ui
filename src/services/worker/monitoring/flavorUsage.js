/* eslint-disable */
import cloneDeep from 'lodash/cloneDeep'
import * as dateUtil from '../../../utils/date_util'

const processData = (worker) => {
    let metricList = worker.metricList
    let avgData = worker.avgData
    let rowSelected = worker.rowSelected
    if (metricList && metricList.length > 0) {
        let selected = []
        if (rowSelected > 0) {
            let avgDataEU = avgData['EU']
            Object.keys(avgDataEU).map(key => {
                if (avgDataEU[key].selected) {
                    selected.push(`${avgDataEU[key][fields.cloudletName]}_${avgDataEU[key][fields.operatorName]}`)
                }
            })
        }
        let metricData = metricList[0]['cloudlet-flavor-usage']
        let values = cloneDeep(metricData.values)
        Object.keys(values).map(valueKey => {
            let formattedList = values[valueKey].reduce((result, dataList) => {
                if (rowSelected === 0 || selected.includes(`${dataList[FLAVOR_USAGE_CLOUDLET]}_${dataList[FLAVOR_USAGE_OPERATOR]}`)) {
                    let time = dateUtil.utcTime(dateUtil.FORMAT_FULL_DATE_TIME, dataList[FLAVOR_USAGE_TIME])
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
        newData.region = 'EU'
        newData.metric = metric
        newData.values = values
        newData.columns = metricData.columns
        self.postMessage(newData)
    }
}
export const format = (worker) => {
    processData(worker)
}