import React, {Component} from 'react';
import {hot} from "react-hot-loader/root";
import {Bar} from "react-chartjs-2";
import {makeGradientColorList} from "../../dev/PageDevMonitoringService";
import 'chartjs-plugin-labels'

export default hot(
    class BarChart0003 extends Component {

        componentDidMount() {
            /*const {datasets} = this.refs.chart.chartInstance.data
            console.log(datasets[0].data);*/

            //this.getGrapHData();
        }

        lineChartData22 = (canvas) => {
            let chartColorList = ['#DE0000', '#FF9600', '#FFF600', '#5BCB00', '#0096FF', '#66D9EF', '#272822', '#75715E',];

            const CHART_COLOR_LIST2 = ['#65DEF1', '#A8DCD1', '#DCE2C8', '#F96900', '#F17F29', '#66D9EF', '#272822', '#75715E',]

            const CHART_COLOR_LIST3 = ['#008000', '#d7fff1', '#556B2F', '#32CD32', '#8cd790', '#66D9EF', '#272822', '#75715E',]

            const CHART_COLOR_LIST4 = ['#FF0000', '#FFBDAA', '#D4826A', '#802D15', '#551300', '#66D9EF', '#272822', '#75715E',]

            const CHART_COLOR_MONOKAI = ['#F92672', '#FD971F', '#A6E22E', '#E6DB74', '#A6E22E', '#66D9EF', '#272822', '#75715E',]
            const CHART_COLOR_APPLE = ['#0A84FF', '#30D158', '#FF453A', '#FF9F0A', '#FF375F', '#66D9EF', '#272822', '#75715E',]

            let gradientList = makeGradientColorList(canvas, 305, CHART_COLOR_APPLE, true);

            return {
                labels: ['January', 'February', 'March', 'April', 'May',],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: gradientList,
                        borderColor: gradientList,
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: [65, 59, 80, 81, 56, 55]
                    }
                ]
            }
        };

        options = {
            animation: {
                duration: 1000
            },
            datasetStrokeWidth: 3,
            pointDotStrokeWidth: 4,
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 10,
                    fontColor: 'white'
                }
            },
            scales: {
                yAxes: [{

                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        //max: 100,
                        fontColor: 'white',
                    },
                    gridLines: {
                        color: "#505050",
                    },
                    stacked: true

                }],
                xAxes: [{
                    /*ticks: {
                        fontColor: 'white'
                    },*/
                    gridLines: {
                        color: "#505050",
                    },
                    ticks: {
                        fontSize: 14,
                        fontColor: 'white',
                        maxRotation: 45,
                        minRotation: 45,
                        padding: 10,
                        labelOffset: 0,
                    },
                    beginAtZero: false,
                }],
                backgroundColor: {
                    fill: "#1e2124"
                },
            },
            plugins: {
                labels: {
                    // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
                    render: 'value',

                    // precision for percentage, default is 0
                    precision: 0,

                    showZero: true,
                    fontSize: 20,

                    // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
                    fontColor: '#fff',

                    // font style, default is defaultFontStyle
                    fontStyle: 'normal',

                    // font family, default is defaultFontFamily
                    fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

                    // draw text shadows under labels, default is false
                    textShadow: true,

                    // text shadow intensity, default is 6
                    shadowBlur: 10,

                    // text shadow X offset, default is 3
                    shadowOffsetX: -5,

                    // text shadow Y offset, default is 3
                    shadowOffsetY: 5,

                    // text shadow color, default is 'rgba(0,0,0,0.3)'
                    shadowColor: 'rgba(0,0,0,0.75)',

                    // draw label in arc, default is false
                    // bar chart ignores this
                    arc: true,

                    // position to draw label, available value is 'default', 'border' and 'outside'
                    // bar chart ignores this
                    // default is 'default'
                    position: 'default',

                    // draw label even it's overlap, default is true
                    // bar chart ignores this
                    overlap: true,
                    showActualPercentages: true,
                    images: [
                        {
                            src: 'image.png',
                            width: 16,
                            height: 16
                        }
                    ],

                    // add padding when position is `outside`
                    // default is 2
                    outsidePadding: 4,

                    // add margin of text when position is `outside` or `border`
                    // default is 2
                    textMargin: 4
                }
            }
        }

        render() {
            return (
                <div className="App">
                    <div style={{width: 800, height: 800}}>
                        <Bar
                            data={this.lineChartData22}
                            color="#70CAD1"
                            options={this.options}
                        />
                    </div>
                </div>
            );
        }


    }
)
