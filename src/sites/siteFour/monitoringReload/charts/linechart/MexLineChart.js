import React from 'react'
import { Line } from 'react-chartjs-2'
import { Card } from '@material-ui/core'
import * as dateUtil from '../../../../../utils/date_util'
import moment from 'moment'
import randomColor from 'randomcolor'

const MexLineChart = (props) => {

    const metric = props.data.metric
    const header = metric ? metric.header : ''
    const unit = metric ? metric.unit : undefined
    const position = metric ? metric.position : 0
    const tags = props.tags
    const tagFormats = props.tagFormats

    const options = {
        stacked: true,
        bezierCurve:true,
        animation: {
            duration: 500
        },
        datasetStrokeWidth : 1,
        pointDotStrokeWidth: 2,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: "bottom",
            display: true
        },
        scales: {
            xAxes: [{
                type: "time",
                time: {
                    format: dateUtil.FORMAT_FULL_TIME,
                    tooltipFormat: 'HH:mm:ss',
                    displayFormats: {
                        millisecond: 'HH:mm:ss.SSS',
                        second: 'HH:mm:ss',
                        minute: 'HH:mm',
                        hour: 'HH'
                    }
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Date'
                },
                ticks : {
                    maxTicksLimit: 15
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: header
                },
                ticks: {
                    callback: (label, index, labels) => {
                        return unit ? unit(label) : label 
                    }
                }
            }]
        }
    }

    const distributeTime = (data, interval) => {
        let labels = []
        if (data) {
            let starttime = data.starttime
            let endtime = moment(data.endtime)
            while (moment(starttime).isBefore(endtime)) {
                starttime = dateUtil.addSeconds(interval, starttime).valueOf()
                labels.push(dateUtil.time(dateUtil.FORMAT_FULL_TIME, starttime))
            }
        }
        return labels
    }

    const formatLabel = (value)=>{
        let metricLabel = ''
        tags.map((tag, j) => {
            let labelVal = value[tag]
            if (labelVal && labelVal !== null) {
                let tagFormat = tagFormats[j]
                switch (tagFormat) {
                    case '[':
                        metricLabel = metricLabel + ` [${labelVal}]`
                        break;
                    default:
                        metricLabel = metricLabel + labelVal
                        break;
                }
            }
        })
        return metricLabel
    }

    const formatData = (chartData) => {
        let datasets = []
        const values = chartData ? chartData.values : {}
        if (values) {
            let keys = Object.keys(values)
            let moreColors = randomColor({
                count: keys.length,
            });
            datasets = keys.map((key, i) => {
                let valueData = values[key]
                let data = valueData.map(value => {
                    return { x: dateUtil.time(dateUtil.FORMAT_FULL_TIME, value[0]), y: value[position] }
                })
                let color = moreColors[i]

                return {
                    label: formatLabel(valueData[0]),
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: color,
                    borderColor: color,
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
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
                    data: data
                }
            })
        }
        return datasets
    }



    const labels = distributeTime(props.data, 15)
    const datasets = formatData(props.data)

    return (
        <Card style={{ height: 400, padding: 30 }} mex-test="component-line-chart">
            <div align="center">
                <h3>{`${header} - ${props.data.region}`}</h3>
            </div>
            <div style={{ padding: 20, width: '100%' }}>
                <Line options={options} data={{ labels, datasets }} height={320} />
            </div>
        </Card>
    )
}

export default MexLineChart