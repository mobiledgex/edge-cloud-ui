import React from 'react'
import { Line } from 'react-chartjs-2'
import * as dateUtil from '../../../../../utils/date_util'
import {unit} from '../../../../../utils/math_util'
import isEqual from 'lodash/isEqual';
import uuid from 'uuid'

const optionsGenerator = (header, unitId) => {
    return {
        stacked: true,
        bezierCurve: true,
        animation: {
            duration: 1
        },
        datasetStrokeWidth: 1,
        pointDotStrokeWidth: 2,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            position: "left",
            display: false,
            labels: {
                // boxWidth: 2
            }
        },
        elements: {
            line: {
                tension: 0 // disables bezier curves
            }
        },
        animation: {
            onComplete() {
                this.options.animation.onComplete = null
            }
        },
        scales: {
            xAxes: [{
                type: "time",
                time: {
                    format: dateUtil.FORMAT_FULL_TIME,
                    tooltipFormat: 'MM/DD/YYYY HH:mm:ss',
                    displayFormats: {
                        millisecond: 'HH:mm:ss.SSS',
                        second: 'HH:mm:ss',
                        minute: 'HH:mm',
                        hour: 'HH'
                    }
                },
                scaleLabel: {
                    display: false,
                    labelString: 'Date'
                },
                ticks: {
                    maxTicksLimit: 5
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: false,
                    labelString: header
                },
                ticks: {
                    callback: (label, index, labels) => {
                        return unit ? unit(unitId, label) : label
                    },
                    maxTicksLimit: 5
                }
            }]
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label
                    let value = unit ? unit(unitId, tooltipItem.yLabel) : tooltipItem.yLabel
                    return `${label} : ${value}`
                }
            }
        }
    }
}
class MexLineChart extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            chartData: {},
        }
        this.metric = props.data.metric
        this.header = this.metric ? this.metric.header : ''
        this.unit = this.metric ? this.metric.unit : undefined
        this.position = this.metric ? this.metric.position : 0
        this.tags = props.tags
        this.tagFormats = props.tagFormats
        this.options = optionsGenerator(this.header, this.unit)
    }

    formatLabel = (value) => {
        let metricLabel = ''
        this.tags.map((tag, j) => {
            let labelVal = value[tag]
            if (labelVal && labelVal !== null) {
                let tagFormat = this.tagFormats[j]
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

    formatData = (chartData, avgDataRegion, globalFilter, rowSelected) => {
        let datasets = []
        const values = chartData ? chartData.values : {}
        let keys = Object.keys(values)
        let length = keys.length
        for (let i = 0; i < length; i++) {
            let key = keys[i]
            let valueData = values[key]
            if (key.includes(globalFilter.search) && (rowSelected === 0 || avgDataRegion[key].selected)) {
                let color = avgDataRegion[key] ? avgDataRegion[key].color : '#FFF'
                let data = valueData.map(value => {
                    return { x: dateUtil.time(dateUtil.FORMAT_FULL_TIME, value[0]), y: value[this.position] }
                })
                datasets.push({
                    label: valueData[0][2],
                    fill: false,
                    lineTension: 0.5,
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
                    data: data
                })
            }
        }
        return datasets
    }

    static getDerivedStateFromProps(props, state) {
        let propsValues = props.data.values
        let stateValues = state.chartData.values
        if (propsValues && !isEqual(stateValues, propsValues)) {
            return { chartData: props.data }
        }
        return null
    }

    render() {
        const { chartData } = this.state
        const { avgDataRegion, rowSelected, globalFilter, id } = this.props
        return (
            <div mex-test="component-line-chart">
                <div align="center">
                    <h3>{`${this.header} - ${this.props.data.region}`}</h3>
                </div>
                <div style={{ padding: 20, width: '100%' }}>
                    <Line datasetKeyProvider={()=>(uuid())} options={this.options} data={{ datasets: this.formatData(chartData, avgDataRegion, globalFilter, rowSelected) }} height={200} />
                </div>
            </div>
        )
    }
}

export default MexLineChart