import React from 'react'
import { Line } from 'react-chartjs-2'
import * as dateUtil from '../../../../../utils/date_util'
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import uuid from 'uuid'
import { Box, Dialog, IconButton } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import { convertUnit } from '../../helper/unitConvertor';

const formatData = (rawData, avgData, globalFilter, rowSelected, disableRowSelectedFilter) => {
    let datasets = []
   
    const values = rawData && rawData.datasets ? rawData.datasets : {}
    let keys = Object.keys(values)
    keys.forEach(key => {
        let valueData = values[key]
        if (key.includes(globalFilter.search) && (disableRowSelectedFilter || rowSelected === 0 || avgData[key].selected)) {
            datasets.push(valueData)
        }
    }) 
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
                    fontColor: "#CCC",
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
                    fontColor: "#CCC",
                    suggestedMax: 1,
                    suggestedMin: 10,
                    precision: 0,
                    callback: (label, index, labels) => {
                        return unitId ? convertUnit(unitId, label) : label
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
                    let value = unitId ? convertUnit(unitId, tooltipItem.yLabel, true) : tooltipItem.yLabel
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
            const { data, avgData, globalFilter, rowSelected, labelPosition, disableRowSelectedFilter } = props
            return { datasets: formatData(data, avgData, globalFilter, rowSelected, disableRowSelectedFilter) }
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

    validateFilter = (rowSelected, search)=>{
       return rowSelected > 0 || search.length > 0
    }

    render() {
        const { fullscreen, datasets } = this.state
        const { rowSelected, globalFilter } = this.props
        let id = this.props.id
        id = id.toLowerCase()
        return (
            <div style={{ padding: 5, marginTop: 5, marginRight: 10 }} mex-test="component-line-chart">
                <div>
                    <Box display="flex">
                        <Box flexGrow={1}>
                            <h3 className='chart-header'>{`${this.header} - ${this.props.data.region}`}</h3>
                        </Box>
                        {
                            datasets.length === 0 && (rowSelected === 0 && globalFilter.search.length === 0) ?
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
                    {
                        datasets.length === 0 && (rowSelected > 0 || globalFilter.search.length > 0) ?
                            <div className='chart-no-data' align='center'>No Data</div> : datasets.length > 0 ?
                                <Line id={id} datasetKeyProvider={() => (uuid())} options={this.options} data={{ datasets }} height={200} /> : null
                    }
                </div>
                {this.renderFullScreen(id, fullscreen, datasets)}
            </div>
        )
    }
}

export default MexLineChart