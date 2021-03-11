import React from 'react'
import { Line } from 'react-chartjs-2'
import * as dateUtil from '../../../../../utils/date_util'
import { unit } from '../../../../../utils/math_util'
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import uuid from 'uuid'
import { Box, Card, Dialog, GridListTile, IconButton, LinearProgress } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import { LTTB } from 'downsample';

const formatData = (rawData, avgDataRegion, globalFilter, rowSelected, labelPosition, steppedLine) => {
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
            if (valueData.length > 0 && key.includes(globalFilter.search) && (rowSelected === 0 || avgDataRegion[key].selected)) {
                let color = avgDataRegion[key] ? avgDataRegion[key].color : '#FFF'
                let data = valueData.map(value => {
                    return { x: dateUtil.timeInMilli(value[0]), y: value[rawData.metric.position] }
                })
                datasets.push({
                    label: valueData[0][labelPosition ? labelPosition : 2],
                    fill: false,
                    lineTension: 0.5,
                    steppedLine:steppedLine,
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
        this.range = props.range
        this.options = optionsGenerator(this.header, this.unit, false, this.range)
    }

    static getDerivedStateFromProps(props, state) {
        let propsValues = props.data.values
        if (propsValues) {
            const { data, avgDataRegion, globalFilter, rowSelected, labelPosition } = props
            return { datasets: formatData(data, avgDataRegion, globalFilter, rowSelected, labelPosition, props.steppedLine) }
        }
        return null
    }

    closeFullScreen = () => {
        this.setState({ fullscreen: false })
    }

    openFullScreen = () => {
        this.setState({ fullscreen: true })
    }

    renderFullScreen = (id, fullscreen, datasets) => {
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
                    <Line id={`${id}-fs`} datasetKeyProvider={() => (uuid())} options={optionsGenerator(this.header, this.unit, fullscreen, this.range)} data={{ datasets }} height={200} />
                </div>
            </Dialog>
        )
    }

    render() {
        const { fullscreen, datasets } = this.state
        let id = this.props.id
        id = id.toLowerCase()
        return (
            <div style={{ padding: 5, marginTop: 5, marginRight: 10 }} mex-test="component-line-chart">
                <div className="line-chart-header">
                    <Box display="flex">
                        <Box flexGrow={1} >
                            <h3>{`${this.header} - ${this.props.data.region}`}</h3>
                        </Box>
                        {
                            datasets.length === 0 ?
                                <Box>
                                    <CircularProgress size={20} thickness={3} />
                                </Box> :
                                <Box m={-1.5}>
                                    <IconButton onClick={this.openFullScreen}>
                                        <AspectRatioIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }} />
                                    </IconButton>
                                </Box>
                        }
                    </Box>
                </div>
                <br />
                <div style={{ padding: 20, width: '100%', marginTop: 20 }}>
                    {datasets.length > 0 ?
                        <Line id={id} datasetKeyProvider={() => (uuid())} options={this.options} data={{ datasets }} height={200} /> : null}
                </div>
                {this.renderFullScreen(id, fullscreen, datasets)}
            </div>
        )
    }
}

export default MexLineChart