import React from 'react'
import { Line } from 'react-chartjs-2'
import * as dateUtil from '../../../../../utils/date_util'
import isEqual from 'lodash/isEqual';

const optionsGenerator = (header, unit) => {
    return {
        stacked: true,
        bezierCurve: true,
        animation: {
            duration: 0
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
                    display: false,
                    labelString: 'Date'
                },
                ticks: {
                    maxTicksLimit: 15
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: false,
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
}
class MexLineChart extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            chartData : {}
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

    formatData = (chartData) => {
        let datasets = []
        const values = chartData ? chartData.values : {}
        let selectedCount = 0
        let avgDataRegion = this.props.avgDataRegion
        avgDataRegion.map((avgData)=>{
            if(avgData.selected)
            {
                selectedCount += 1
            }
        })
        if (values) {
            let keys = Object.keys(values)
            datasets = keys.map((key, i) => {
                    let valueData = values[key]
                    let color = avgDataRegion[i] ? avgDataRegion[i].color : '#FFF'
                    let selected = avgDataRegion[i] ? avgDataRegion[i].selected : false
                    let data = key.includes(this.props.globalFilter.search) && selectedCount === 0 || selected ? valueData.map(value => {
                        return { x: dateUtil.time(dateUtil.FORMAT_FULL_TIME, value[0]), y: value[this.position] }
                    }) : []

                    return {
                        label: this.formatLabel(valueData[0]),
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

    static getDerivedStateFromProps(props, state) {
        let propsValues = props.data.values
        let stateValues = state.chartData.values
        if(propsValues && !isEqual(stateValues, propsValues))
        {
            return { chartData : props.data}
        }
        return null
    }

    render() {
        const { chartData } = this.state
        return (
            <div mex-test="component-line-chart">
                <div align="center">
                    <h3>{`${this.header} - ${this.props.data.region}`}</h3>
                </div>
                <div style={{ padding: 20, width: '100%' }}>
                    <Line options={this.options} data={{ datasets : this.formatData(chartData) }} height={320} />
                </div>
            </div>
        )
    }
}

export default MexLineChart