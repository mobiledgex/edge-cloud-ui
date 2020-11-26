import React from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { Icon } from 'semantic-ui-react';
import './style.css'

const keys = [
    { color: '#80C684', label: 'Find Cloudlet', id: 'findCloudlet', order: 0 },
    { color: '#4693BC', label: 'Register Client', id: 'registerClient', order: 1 },
    { color: '#FD8D3C', label: 'Verify Location', id: 'verifyLocation', order: 2 }
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
            xAxes: [{ stacked: false, display: false, gridLines: false, ticks: { max: maxValue + 150 } }],
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
        }
    }
}

class MexHorizontalBar extends React.Component {

    constructor(props) {
        super(props)
        this.filter = props.filter
        this.color = []
        this.keys = []
        this.maxValue = 0
    }

    processData = (chartData, filter) => {
        let datasets = []
        let labels = []
        Object.keys(chartData).map(region => {
            if (filter.region.includes(region)) {
                let chartDataRegion = chartData[region]
                chartDataRegion.map(data => {
                    if (data.key.includes(filter.search)) {
                        labels.push(data.key)
                        keys.map(key => {
                            let id = key.order
                            if (datasets[id]) {
                                datasets[id]['data'].push(data[key.id])
                            }
                            else {
                                datasets[id] = { backgroundColor: key.color, label: key.label, data: [data[key.id]] }
                            }
                            this.maxValue = data[key.id] > this.maxValue ? data[key.id] : this.maxValue
                        })
                    }
                })
            }
        })
        return { datasets, labels }
    }

    chartHeight = (processedData) => {
        let labels = processedData.labels
        let length = labels.length
        if (length === 1) {
            processedData.labels.push('')
        }
        return labels.length * 95
    }

    render() {
        const { chartData, header, filter } = this.props
        const processedData = this.processData(chartData, filter)

        return (
            <div mex-test="component-pie-chart" className='horizontal-main' >
                <div align="left" style={{ marginBottom: 10 }}>
                    <h3>{header}</h3>
                </div>
                <div style={{ height: 'calc(32vh - 0px)', overflow: 'auto', width: '23vw' }}>
                    <div style={{ height: this.chartHeight(processedData) }}>
                        <HorizontalBar data={processedData} options={optionsGenerator(this.maxValue)} plugins={plugins} redraw />
                    </div>
                </div>
                <div align="center" className="horizontal-legend">
                    {keys.map((key, i) => {
                        return <span key={i} style={{ marginRight: 10, display: 'inline', fontSize: 12 }}><Icon name='circle' style={{ color: key.color }} /> {key.label}</span>
                    })}
                </div>
            </div>
        )
    }
}

export default MexHorizontalBar