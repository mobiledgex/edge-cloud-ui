import React from 'react'
import { Line } from 'react-chartjs-2'
import * as dateUtil from '../../../../../utils/date_util'
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import uuid from 'uuid'
import { Box, Dialog, IconButton } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import { convertUnit } from '../../helper/unitConvertor';
import { LS_LINE_GRAPH_FULL_SCREEN } from '../../../../../helper/constant/perpetual';

const formatData = (props) => {
    const { data, search, selection, disableSelection } = props
    let datasets = []
    const temp = data && data.datasets ? data.datasets : {}
    let keys = Object.keys(temp)
    keys.forEach(key => {
        //filter by selection
        let valid = disableSelection || selection[key] || selection.count === 0
        //filter by search
        valid = valid && (search.length === 0 || key.includes(search))
        if (valid) {
            datasets.push(temp[key])
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
                fontColor:'#CCC',
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
                    suggestedMax: 10,
                    suggestedMin: 1,
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
            fullscreen: this.props.id === localStorage.getItem(LS_LINE_GRAPH_FULL_SCREEN)
        }
        if (props.data) {
            this.resourceType = props.data.resourceType
            this.header = this.resourceType ? this.resourceType.header : ''
            this.unit = this.resourceType ? this.resourceType.unit : undefined
            this.position = this.resourceType ? this.resourceType.position : 0
            this.range = props.range
            this.options = optionsGenerator(this.header, this.unit, false, this.range)
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data) {
            let datasets = props.data.datasets
            if (datasets) {
                return { datasets: formatData(props) }
            }
        }
        return null
    }

    closeFullScreen = () => {
        localStorage.removeItem(LS_LINE_GRAPH_FULL_SCREEN)
        this.setState({ fullscreen: false })
    }

    openFullScreen = () => {
        localStorage.setItem(LS_LINE_GRAPH_FULL_SCREEN, this.props.id)
        this.setState({ fullscreen: true })
    }

    renderFullScreen = () => {
        const { fullscreen, datasets } = this.state
        const { selection, search, data, id } = this.props
        return (
            <Dialog fullScreen open={fullscreen} onClose={this.closeFullScreen} >
                <div>
                    <div style={{ display: 'inline-block', float: 'left' }}>
                        <h3 style={{ padding: 10 }}> {`${this.header} - ${data.region}`}</h3>
                    </div>
                    <div style={{ display: 'inline-block', float: 'right' }}>
                        <IconButton onClick={this.closeFullScreen} style={{ padding: 10 }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
                {
                    datasets.length === 0 && (selection.count === 0 && search.length === 0) ?
                        <div align='center' style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            WebkitTransform: 'translate(-50%, -50%)',
                            transform: 'translate(-50%, -50%)'
                        }}>
                            <CircularProgress size={100} thickness={3} />
                        </div> :
                        <div style={{ padding: 20, height: '100vh' }}>
                            <Line id={`${id}-fs`} datasetKeyProvider={() => (uuid())} options={optionsGenerator(this.header, this.unit, fullscreen, this.range)} data={{ datasets }} height={200} />
                        </div>
                }
            </Dialog>
        )
    }

    validateFilter = (selection, search)=>{
       return selection.count > 0 || search.length > 0
    }

    render() {
        const { fullscreen, datasets } = this.state
        const { selection, search, data } = this.props
        let id = this.props.id ? this.props.id.toLowerCase() : uuid()
        return (
            data ? <div style={{ padding: 5, marginTop: 5, marginRight: 10 }} mex-test="component-line-chart">
                <div>
                    <Box display="flex">
                        <Box flexGrow={1}>
                            <h3 className='chart-header'>{`${this.header} - ${data.region}`}</h3>
                        </Box>
                        {
                            datasets.length === 0 && (selection.count === 0 && search.length === 0) ?
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
                        datasets.length === 0 && (selection.count > 0 || search.length > 0) ?
                            <div className='chart-no-data' align='center'>No Data</div> : datasets.length > 0 ?
                                <Line id={id} datasetKeyProvider={() => (uuid())} options={this.options} data={{ datasets }} height={200} /> : null
                    }
                </div>
                {this.renderFullScreen()}
            </div> : null
        )
    }
}

export default MexLineChart