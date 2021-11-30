import React from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { Icon } from 'semantic-ui-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './style.css'

const keys = [
    { color: '#80C684', label: 'Find Cloudlet', id: 'FindCloudlet', order: 0 },
    { color: '#4693BC', label: 'Register Client', id: 'RegisterClient', order: 1 },
    { color: '#FD8D3C', label: 'Verify Location', id: 'VerifyLocation', order: 2 }
]

const showDataLabel = (e) => {
    let chartInstance = e.chart;
    let ctx = chartInstance.ctx;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = '#fff';

    chartInstance.data.datasets.forEach(function (dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);

        meta.data.forEach(function (bar, index) {
            var data = dataset.data[index]
            if (data > 0) {
                let x_postions = bar._model.x
                if (data > 99999) {
                    x_postions = x_postions + 23
                }
                else if (data > 9999) {
                    x_postions = x_postions + 20
                }
                else if (data > 999) {
                    x_postions = x_postions + 16
                }
                else if (data > 99) {
                    x_postions = x_postions + 14
                }
                else if (data > 9) {
                    x_postions = x_postions + 12
                }
                else {
                    x_postions = x_postions + 7
                }
                ctx.font = "bold 10pt Arial";
                ctx.fillText(data, x_postions, bar._model.y);
            }
        });
    });
}

const plugins = [{
    beforeDraw: showDataLabel
}]

const optionsGenerator = (maxValue) => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            enabled: true
        },
        legend: {
            display: false
        },
        title: {
            display: true,
            text: ' '
        },
        scales: {
            xAxes: [{ stacked: false, display: false, gridLines: false, ticks: { max: maxValue } }],
            yAxes: [
                {
                    stacked: false,
                    gridLines: false,
                    ticks: { fontColor: '#FFF', labelOffset: -44, mirror: true, lineHeight: 2 },
                }]
        },
        animation: {
            duration: 0,
            // onComplete: showDataLabel,
            // onProgress: showDataLabel
        },
        layout: {
            padding: {
                right: 50
            }
        }
    }
}

const processData = (regions, chartData, search) => {
    let datasets = []
    let labels = []
    let max = 0
    regions.forEach(region => {
        let dataObject = chartData[region]
        if (dataObject) {
            let dataKeys = Object.keys(dataObject)
            dataKeys.forEach(datakey => {
                if (datakey.includes(search)) {
                    const data = dataObject[datakey]
                    if (data.skip === false) {
                        const tags = data.tags
                        labels.push(`${region} - ${tags['app']} [${tags['ver']}]`)
                        keys.forEach(key => {
                            let order = key.order
                            let count = data[key.id] ? data[key.id] : 0
                            if (datasets[order]) {
                                datasets[order]['data'].push(count)
                            }
                            else {
                                datasets[order] = { backgroundColor: key.color, label: key.label, data: [count] }
                            }
                            max = max < count ? count : max
                        })
                    }
                }
            })
        }
    })
    return { datasets, labels, max }
}

class MexHorizontalBar extends React.Component {

    constructor(props) {
        super(props)
        this.color = []
        this.keys = []
        this.maxValue = 0
    }

    

    chartHeight = (labels) => {
        let length = labels.length
        if (length === 1) {
            labels.push('')
        }
        return labels.length * 95
    }

    render() {
        const { chartData, header, search, regions, loading } = this.props
        const {datasets, labels, max} = processData(regions, chartData, search)
        return (
            <div mex-test="component-pie-chart" className='horizontal-main' >
                <div align="left" style={{ marginBottom: 10, display: 'inline-block' }}>
                    <h3 className='chart-header'>{header}</h3>
                </div>
                {loading ? <div align="right" style={{ display: 'inline-block', float: 'right', marginRight: 10 }}>
                    <CircularProgress size={20} thickness={3} />
                </div> : null}
                {
                    loading ? null :
                        <React.Fragment>
                            <div style={{ height: 230, overflow: 'auto', width: '23vw' }}>
                                <div style={{ height: this.chartHeight(labels), width: '20vw' }}>
                                    <HorizontalBar data={{datasets, labels}} options={optionsGenerator(max)} plugins={plugins} redraw />
                                </div>
                            </div>
                            <div align="center" className="horizontal-legend">
                                {keys.map((key, i) => {
                                    return <span key={i} style={{ marginRight: 10, display: 'inline', fontSize: 12 }}><Icon name='circle' style={{ color: key.color }} /> {key.label}</span>
                                })}
                            </div>
                        </React.Fragment>
                }

            </div>
        )
    }
    
}

export default MexHorizontalBar