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

export const generateDataset2 = (tags, metric, timezone, dataList, avgData) => {
    let dataset = {}
    if (dataList && dataList.length > 0) {
        const { position, steppedLine } = metric
        let color = avgData.color

        let data = []
        dataList.forEach(value => {
            if (value[position] !== null) {
                data.push({ x: moment.tz(value[0], timezone).valueOf(), y: value[position] })
            }
        })

        dataset = {
            label: tags['cloudlet'],
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