import React, {Component} from 'react';
import {hot} from "react-hot-loader/root";
import {Bar, HorizontalBar} from "react-chartjs-2";
import {makeGradientColorList} from "../../dev/PageDevMonitoringService";

export default hot(
    class ColumnChart0003 extends Component {

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

            let gradientList = makeGradientColorList(canvas, 305, CHART_COLOR_MONOKAI, true);

            return {
                labels: ['January', 'February', 'March', 'April', 'May', ],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: gradientList,
                        borderColor: gradientList,
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: [65, 59, 80, 81, 56,]
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
                datalabels: {
                    color: 'blue',
                    labels: {
                        title: {
                            font: {
                                weight: 'bold'
                            }
                        },
                        value: {
                            color: 'green'
                        }
                    }
                }
            }
        }

        render() {
            return (
                <div className="App">
                    <div style={{width: 800, height: 800}}>
                        {/*<Bar
                            data={this.lineChartData22}
                            color="#70CAD1"
                        />*/}
                        <HorizontalBar
                            data={this.lineChartData22}
                            options={this.options}

                        />
                    </div>
                </div>
            );
        }


    }
)
