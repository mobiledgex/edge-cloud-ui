import React from 'react';

import {bb} from "billboard.js";
import "billboard.js/dist/billboard.css";
import "./bblineStyles.css";


const generateKey = (pre) => {
    return `${ pre }_${ new Date().getTime() }`;
}
export default class BBLineChart extends React.Component {
    constructor() {
        super();
        this.state = {
            chartId:generateKey('chartId')
        }
    }
    componentDidMount(){

        let chartMargin = 10;

        let chartWidth = this.props.w || 320;
        let chartHeight = this.props.h || 130;

        let tooltipShouldShowThreshold = 600;
        //let dataset = [{},{},{}]

        let chartId = (this.props.chartId)? this.props.chartId : this.state.chartId;
        this.setState({chartId:chartId})

        var chart = bb.generate({
            size: {
                height: chartHeight,
                width: chartWidth
            },
            data: {
                columns: [
                    ["data1", 30, 200, 100, 400, 150, 250],
                    ["data2", 50, 20, 10, 40, 15, 25]
                ],
                axes: {
                    data1: "y",
                    data2: "y2"
                },
                type: "spline",
            },
            axis: {
                x: {
                    tick: {
                        culling: false
                    }
                },
                y: {
                    label: "Y Axis Label",
                    tick: {
                        count:5,
                        outer: false,
                        culling: true
                    }
                },
                y2: {
                    show: true,
                    label: "Y2 Axis Label",
                    tick: {
                        count:5
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
                  axis: "y",
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

        setTimeout(function() {
            chart.load({
                columns: [
                    ["data1", 230, 190, 300, 200, 300, 400]
                ]
            });
        }, 3000);

        setTimeout(function() {
            chart.load({
                columns: [
                    ["data2", 130, 150, 200, 100, 200, 100]
                ]
            });
        }, 4000);

        // setTimeout(function() {
        //     chart.unload({
        //         ids: "data1"
        //     });
        // }, 2000);
    }
    render() {
        return(
            <div id={this.state.chartId} style={{width:'100%', backgroundColor:'transparent'}} ></div>
        )
    }
}
