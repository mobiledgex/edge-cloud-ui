/* eslint-disable */
/*ChartJS Line Chart Datasets*/
import { LTTB } from 'downsample';
import moment from 'moment'
import momentTimezone from "moment-timezone";

/*Generates line chart dataset for given data*/
export const generateDataset = (chartData, avgData, timezone, labelPosition) => {
    let datasets = {}
    const values = chartData ? chartData.values : {}
    Object.keys(values).forEach(key => {
        if (avgData[key] && (avgData[key].hidden === undefined || avgData[key].hidden === false)) {
            let dataList = values[key]
            if (dataList && dataList.length > 0) {
                let color = avgData[key] ? avgData[key].color : '#FFF'
                let formattedList = dataList.map(value => {
                    return { x: moment.tz(value[0], timezone).valueOf(), y: value[chartData.metric.position] }
                })
                let steppedLine = chartData.metric.steppedLine ? chartData.metric.steppedLine : false
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
    })
    return datasets
}