import React from 'react';

import {bb} from "billboard.js";
import * as d3 from 'd3';

import "billboard.js/dist/billboard.css";
import "./bblineStyles.css";


const generateKey = (pre) => {
    return `${ pre }_${ new Date().getTime() }`;
}

let _self = null;
class BBLineChart extends React.Component {
    constructor() {
        super();
        this.state = {
            chartId:generateKey('chartId'),
            dataArray:[
                ["recv", 30, 200, 100, 400, 150, 250, 30, 200, 100, 400, 150, 250],
                ["send", 40, 220, 133, 450, 158, 350, 130, 240, 200, 300, 250, 550],
                ["time", "2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ]
        }
        _self = this;
        this.chart = null;
        this.positionArray = [];
    }
    setPositionTick() {
        //remember postion
        d3.selectAll(".bb-axis-x .tick").each(function(v) {
            let textConTrans = this.attributes.transform.textContent;
            let tPos = textConTrans.indexOf('(');
            let cPos = textConTrans.indexOf(',');
            let rePos = textConTrans.substring(tPos+1, cPos);
            console.log('remember tick position  == '+rePos)
            _self.positionArray.push(textConTrans)

        })
    }
    componentWillReceiveProps(nextProps, nextContext) {
        //this.setState({dataArray:nextProps.data})



        this.reloadChart(nextProps.chartData, nextProps.series, this.positionArray);

    }
    reloadChart(data, series, tickPositions) {
        let seriesData = null;
        if(_self.chart && series) {
            seriesData = data.concat(series);
            //console.log('seriesData == ', seriesData)

            let testData = [
                ["recv", Math.random()*200, 100, Math.random()*200, 500, Math.random()*200, 350, 130, 240, Math.random()*200, 100, 350, Math.random()*200, Math.random()*200],
                ["send", Math.random()*200, 120, 183, 250, Math.random()*200, 150, 530, Math.random()*200, 400, Math.random()*200, Math.random()*200, 450, Math.random()*200],
                ["time", "2019-01-01 12:38:22", "2019-01-01 12:38:23", "2019-01-01 12:38:24", "2019-01-01 12:38:25", "2019-01-01 12:38:26", "2019-01-01 12:38:27", "2019-01-01 12:38:28"]
            ]

            _self.chart.load(
                {
                    columns: seriesData
                }
            )
            // let _cnt = 0;
            // d3.selectAll(".bb-axis-x .tick tspan").each(function(v) {
            //     let format = d3.timeFormat('%H:%M:%S');
            //     let date = format(new Date(seriesData[2][_cnt + 1]))
            //     this.textContent = date;
            //     _cnt ++;
            // })
            // let _translate = 0;
            // d3.selectAll(".bb-axis-x .tick").each(function(v) {
            //     console.log('get tick pos*** '+tickPositions[_translate])
            //     this.attributes.transform.textContent = tickPositions[_translate];
            //     _translate ++ ;
            // })

        }

    }
    getAxisTickValue () {
        console.log('get axis tick value =====================')
        return ["2019-01-01 12:38:22", "2019-01-01 12:38:23", "2019-01-01 12:38:24", "2019-01-01 12:38:25", "2019-01-01 12:38:26", "2019-01-01 12:38:27", "2019-01-01 12:38:28"]
    }
    componentDidMount(){

        let chartMargin = 10;

        let chartWidth = this.props.w || 320;
        let chartHeight = this.props.h || 130;

        let tooltipShouldShowThreshold = 600;
        //let dataset = [{},{},{}]

        let chartId = (this.props.chartId)? this.props.chartId : this.state.chartId;
        this.setState({chartId:chartId})

        this.chart = bb.generate({
            size: {
                height: chartHeight,
                width: chartWidth
            },
            padding: {
                left:40
            },
            data: {
                x: "time",
                xFormat: '%Y-%m-%d %H:%M:%S',
                columns: this.state.dataArray,
                type: "spline",
            },
            axis: {
                x: {
                    type: "timeseries",
                    tick: {
                        count:5,
                        culling:true,
                        format: "%H:%M:%S"
                    }
                },
                y: {
                    label: "Network Receive",
                    tick: {
                        count:5,
                        outer: false,
                        culling: true,
                        format: function(x) {
                            return parseFloat(x).toFixed(2)
                        }
                    }
                }
            },
            point: {
                show: false
            },
            color: {
                pattern: [
                    "#22cccc",
                    "#6699ff",
                    "#ff7f0e",
                    "#ffbb78",
                    "#2ca02c",
                    "#98df8a",
                    "#d62728",
                    "#ff9896",
                    "#9467bd",
                    "#c5b0d5",
                    "#8c564b",
                    "#c49c94",
                    "#e377c2",
                    "#f7b6d2",
                    "#7f7f7f",
                    "#c7c7c7",
                    "#bcbd22",
                    "#dbdb8d",
                    "#17becf",
                    "#9edae5"
                ]
            },
            regions: [
                {
                    axis: "y",
                    start: 300,
                    end: 400,
                    class: "fill_green"
                },
                {
                    axis: "y2",
                    start: 0,
                    end: 100,
                    class: "fill_green"
                }
            ],
            legend: {
                show: false
            },
            bindto: '#'+chartId
        });

        this.setPositionTick()

    }
    render() {

        return(
            <div id={this.state.chartId} style={{width:'100%', backgroundColor:'transparent'}} ></div>
        )
    }
}



export default BBLineChart;