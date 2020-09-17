import React from 'react'
import { Line } from 'react-chartjs-2'
import { Card } from '@material-ui/core'
import * as dateUtil from '../../../../../utils/date_util'
import moment from 'moment'
import randomColor from 'randomcolor'

const covertYAxisUnits = (value) => {
    return value.toFixed(3) + " %"
}

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
                    labelString: 'CPU'
                },
                ticks: {
                    beginAtZero : true,
                    callback: covertYAxisUnits
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

    const formatData = (data) => {
        const columnLength = props.data ? props.data.columns.length : 0
        const values = props.data ? props.data.values : {}
        let keys = Object.keys(values)
        let moreColors = randomColor({
            count: keys.length,
        });
        console.log('Rahul1234', moreColors)
        let datasets = keys.map((key, i) => {
            let data = values[key].map(value => {
                return { x: dateUtil.time(dateUtil.FORMAT_FULL_TIME, value[0]), y: value[columnLength - 1] }
            })
            return {
                label: values[key][0][2],
                fill: false,
                lineTension: 0.5,
                backgroundColor: moreColors[i],
                borderColor: moreColors[i],
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: moreColors[i],
                pointBackgroundColor: moreColors[i],
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: moreColors[i],
                pointHoverBorderColor: moreColors[i],
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
        <Card style={{ width: '50%', height: 400, marginTop: 20, padding: 50 }} mex-test="component-line-chart">
            <div style={{ padding: 10, width: '100%' }}>
                <Line options={options} data={{ labels, datasets }} height={320} />
            </div>
        </Card>
    )
}

export default MexLineChart