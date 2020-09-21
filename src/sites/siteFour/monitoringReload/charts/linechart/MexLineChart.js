import React from 'react'
import { Line } from 'react-chartjs-2'
import { Card } from '@material-ui/core'
import * as dateUtil from '../../../../../utils/date_util'
import moment from 'moment'
import randomColor from 'randomcolor'

const MexLineChart = (props) => {
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
                    labelString: props.label(props.id)
                },
                ticks: {
                    callback: (label, index, labels) => {
                        return props.convertUnit(props.id, label);
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

    const formatData = (chartData) => {
        const columnLength = chartData ? chartData.columns.length : 0
        const values = chartData ? chartData.values : {}
        let keys = Object.keys(values)
        let moreColors = randomColor({
            count: keys.length,
        });
        let datasets = keys.map((key, i) => {
            let data = values[key].map(value => {
                return { x: dateUtil.time(dateUtil.FORMAT_FULL_TIME, value[0]), y: value[columnLength] }
            })
            let color = moreColors[i]
            return {
                label: values[key][0][2],
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
        return datasets
    }

    

    const labels = distributeTime(props.data, 15)
    const datasets = formatData(props.data)

    return (
        <Card style={{ height: 400, padding: 30 }} mex-test="component-line-chart">
            <div align="center">
                <h3>{props.data.region}</h3>
            </div>
            <div style={{ padding: 20, width: '100%' }}>
                <Line options={options} data={{ labels, datasets }} height={320} />
            </div>
        </Card>
    )
}

export default MexLineChart