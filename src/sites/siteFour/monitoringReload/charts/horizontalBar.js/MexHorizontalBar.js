import React from 'react'
import { HorizontalBar } from 'react-chartjs-2'
import { Icon } from 'semantic-ui-react';
import './style.css'

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
                if (data > 999) {
                    x_postions = x_postions + 17
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
                ctx.fillText(data, x_postions, bar._model.y);
            }
        });
    });
}
const optionsGenerator = () => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
            enabled: false
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [{ stacked: false, display: false, gridLines: false }],
            yAxes: [
                {
                    stacked: false,
                    gridLines: false,
                    ticks: { fontColor: '#FFF', labelOffset: -42, mirror: true, lineHeight: 2 },
                }]
        },
        animation: {
            duration: 0,
            onComplete: showDataLabel,
            onProgress: showDataLabel
        }
    }
}

class MexHorizontalBar extends React.Component {

    constructor(props) {
        super(props)
        this.filter = props.filter
        this.options = optionsGenerator()
        this.color = []
        this.keys = []
    }

    processData = (chartData) => {
        this.color = []
        this.keys = []
        let data = {}
        let datasets = []

        chartData.map(item => {
            let key = item.key
            let values = item.value
            let color = item.color
            if (key === 'labels') {
                data[key] = values
            }
            else {
                this.color.push(color)
                this.keys.push(key)
                datasets.push({ label: key, data: values, backgroundColor: color })
            }
        })
        data['datasets'] = datasets
        return data
    }


    render() {
        const { chartData, header } = this.props
        return (
            <div mex-test="component-pie-chart" style={{ padding: 5, width: '100%' }} >
                <div align="left" style={{ marginBottom: 5 }}>
                    <h3>{header}</h3>
                </div>
                <br />
                <div style={{ height: 'calc(35vh - 0px)', overflow: 'auto', marginLeft: 10 }}>
                    <div style={{ height: 80 * chartData[0].value.length }}>
                        <HorizontalBar data={this.processData(chartData)} options={this.options} />
                    </div>
                </div>
                <div align="center" className="horizontal-legend">
                    {this.keys.map((key, i) => {
                        return <span key={key} style={{ marginRight: 10, display: 'inline', fontSize: 12 }}><Icon name='circle' style={{ color: this.color[i] }} /> {key}</span>
                    })}
                </div>
            </div>
        )
    }
}

export default MexHorizontalBar