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
        this.reloadCount = 0;
        this.limit = 10;
        this.settingDone = false;
        this.testCount = 0;
    }
    setPositionTick1() {
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

    setPositionTick() {
        //remember postion
        _self.positionArray = [];
        d3.selectAll(".bb-event-rects.bb-event-rects-single rect").each(function(v) {
            _self.positionArray.push({x:this.x.baseVal.value, y:this.y.baseVal.value, width:this.width.baseVal.value})
        })
        console.log('rect pos info == ',_self.positionArray, _self.positionArray.length)
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.reloadChart(nextProps.chartData, nextProps.series, this.positionArray, nextProps.lineLimit);
    }
    reloadChart(data, series, tickPositions, lineLimit) {
        let seriesData = null;
        if(_self.chart && series) {
            seriesData = data.concat(series);
            console.log('reload == ', _self.reloadCount, 'lineLimit='+lineLimit)

            let testData = [
                ["recv", Math.random()*200, 100, Math.random()*200, 500, Math.random()*200, 350, 130, 240, Math.random()*200, 100, 350, Math.random()*200, Math.random()*200],
                ["send", Math.random()*200, 120, 183, 250, Math.random()*200, 150, 530, Math.random()*200, 400, Math.random()*200, Math.random()*200, 450, Math.random()*200],
                ["time", "2019-01-01 12:38:22", "2019-01-01 12:38:23", "2019-01-01 12:38:24", "2019-01-01 12:38:25", "2019-01-01 12:38:26", "2019-01-01 12:38:27", "2019-01-01 12:38:28"]
            ]

            if(lineLimit && !_self.settingDone) {

                console.log('arrive limit = ', series[0].length)

                if(_self.reloadCount === 1) {
                    _self.settingDone = true;
                    _self.setPositionTick()
                }
                _self.reloadCount ++;
            }

            // if(_self.testCount <= 45){
            //     //reset data chart -------------------
            //     _self.chart.load(
            //         {
            //             columns: seriesData
            //         }
            //     )
            // } else {
            //     _self.settingDone = false;
            // }




            _self.chart.load(
                {
                    columns: seriesData
                }
            )




            _self.testCount ++;

            if(_self.settingDone) {
                setTimeout(() => {
                        let idCnt = 0;
                        d3.selectAll(".bb-event-rects.bb-event-rects-single rect").each(function (v) {
                            let className = 'bb-event-rect bb-event-rect-' + idCnt;
                            this.attributes.class.nodeValue = className;
                            this.attributes.width.nodeValue = _self.positionArray[idCnt].width;
                            this.attributes.x.nodeValue = _self.positionArray[idCnt].x;
                            this.attributes.y.nodeValue = _self.positionArray[idCnt].y;
                            let classNm = this.attributes.class.textContent;
                            console.log('- index = ' + classNm.lastIndexOf('-'))
                            console.log('rect --------', classNm)
                            idCnt++;

                        })



                    }, 1500
                )

            }

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
    generateChart () {
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
                //type: "spline",
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
                show: true,
                r: 0.8
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
    }
    componentDidMount(){

        this.generateChart();

    }
    render() {

        return(
            <div id={this.state.chartId} style={{width:'100%', backgroundColor:'transparent'}} ></div>
        )
    }
}



export default BBLineChart;
