import React from 'react'
import { Line } from 'react-chartjs-2'
import * as dateUtil from '../../../../../utils/date_util'
import { unit } from '../../../../../utils/math_util'
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import uuid from 'uuid'
import { Card, Dialog, GridListTile, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { LTTB } from 'downsample';
import moment from 'moment'


const formatData = (rawData, avgDataRegion, globalFilter, rowSelected) => {
    let datasets = []
    const values = rawData ? rawData.values : {}
    let keys = Object.keys(values)
    let length = keys.length
    for (let i = 0; i < length; i++) {
        let key = keys[i]
        if (avgDataRegion[key]) {
            if (avgDataRegion[key].hidden) {
                continue
            }

            let valueData = values[key]
            if (key.includes(globalFilter.search) && (rowSelected === 0 || avgDataRegion[key].selected)) {
                let color = avgDataRegion[key] ? avgDataRegion[key].color : '#FFF'
                let data = valueData.map(value => {
                    return { x: dateUtil.timeInMilli(value[0]), y: value[rawData.metric.position] }
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
                    data: LTTB(data, 50)
                })
            }
        }
    }
    return datasets
}
const optionsGenerator = (header, unitId, fullscreen, range) => {
    return {
        stacked: true,
        bezierCurve: true,
        animation: false,
        datasetStrokeWidth: 1,
        pointDotStrokeWidth: 2,
        responsive: true,
        spanGaps: true,
        maintainAspectRatio: false,
        legend: {
            position: "top",
            display: fullscreen,
            labels: {
                // boxWidth: 2
            }
        },
        elements: {
            line: {
                tension: 0, // disables bezier curves
                fill: false,
                stepped: false,
                borderDash: []
            }
        },
        scales: {
            xAxes: [{
                type: "time",
                time: {
                    parse: dateUtil.FORMAT_FULL_TIME,
                    tooltipFormat: 'MM/DD/YYYY HH:mm:ss',
                    displayFormats: {
                        millisecond: 'HH:mm:ss.SSS',
                        second: 'HH:mm:ss',
                        minute: 'HH:mm',
                        hour: 'HH:mm'
                    },
                },
                scaleLabel: {
                    display: false,
                    labelString: 'Date'
                },
                ticks: {
                    maxTicksLimit: fullscreen ? 15 : 5,
                    max: dateUtil.timeInMilli(range.endtime),
                    min: dateUtil.timeInMilli(range.starttime)  
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
                    maxTicksLimit: fullscreen ? 15 : 5
                }
            }]
        },
        tooltips: {
            mode: 'single',
            callbacks: {
                label: function (tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label
                    let value = unit ? unit(unitId, tooltipItem.yLabel) : tooltipItem.yLabel
                    return `${label} : ${value ? value : 0}`
                }
            }
        }
    }
}
class MexLineChart extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            datasets: [],
            fullscreen: false
        }
        this.metric = props.data.metric
        this.header = this.metric ? this.metric.header : ''
        this.unit = this.metric ? this.metric.unit : undefined
        this.position = this.metric ? this.metric.position : 0
        this.tags = props.tags
        this.tagFormats = props.tagFormats
        this.range = props.range
        this.options = optionsGenerator(this.header, this.unit, false, this.range)
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



    static getDerivedStateFromProps(props, state) {
        let propsValues = props.data.values
        if (propsValues) {
            const { data, avgDataRegion, globalFilter, rowSelected } = props
            return { datasets: formatData(data, avgDataRegion, globalFilter, rowSelected) }
        }
        return null
    }

    closeFullScreen = () => {
        this.setState({ fullscreen: false })
    }

    openFullScreen = () => {
        this.setState({ fullscreen: true })
    }

    renderFullScreen = (fullscreen, datasets) => {
        return (
            <Dialog fullScreen open={fullscreen} onClose={this.closeFullScreen} >
                <div>
                    <div style={{ display: 'inline-block', float: 'left' }}>
                        <h3 style={{ padding: 10 }}> {`${this.header} - ${this.props.data.region}`}</h3>
                    </div>
                    <div style={{ display: 'inline-block', float: 'right' }}>
                        <IconButton onClick={this.closeFullScreen} style={{ padding: 10 }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
                <div style={{ padding: 20, height: '100vh' }}>
                    <Line datasetKeyProvider={() => (uuid())} options={optionsGenerator(this.header, this.unit, fullscreen, this.range)} data={{ datasets }} height={200} />
                </div>
            </Dialog>
        )
    }

    render() {
        const { fullscreen, datasets } = this.state
        const { id, style } = this.props
        return (
            datasets.length > 0 ?
                <GridListTile key={id} cols={1} style={style} mex-test="component-line-chart">
                    <Card style={{ height: 300 }}>
                        <div style={{ padding: 5, marginTop: 5, marginRight: 10 }}>
                            <div className="line-chart-header">
                                <div className="line-chart-header-left">
                                    <h3>{`${this.header} - ${this.props.data.region}`}</h3>
                                </div>
                                <div className="line-chart-header-right">
                                    <IconButton onClick={this.openFullScreen}>
                                        <AspectRatioIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }} />
                                    </IconButton>
                                </div>
                            </div>
                            <br />
                            <div style={{ padding: 20, width: '100%', marginTop: 20 }}>
                                <Line datasetKeyProvider={() => (uuid())} options={this.options} data={{ datasets }} height={200} />
                            </div>
                            {this.renderFullScreen(fullscreen, datasets)}
                        </div>
                    </Card>
                </GridListTile> : null
        )
    }
}

export default MexLineChart