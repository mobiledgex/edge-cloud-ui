// @flow
import * as React from 'react';
import {Modal as AModal} from "antd";
import {Line} from 'react-chartjs-2';
import PageDevMonitoring from "./PageDevMonitoring";
import type {TypeLineChartData2} from "../../../../shared/Types";
import {convertByteToMegaByte} from "../PageMonitoringCommonService";
import {makeGradientColor, makeGradientColorOne} from "./PageDevMonitoringService";

type Props = {
    modalIsOpen: boolean,
    parent: PageDevMonitoring,
    currentAppInstLineChartData: Array,
    appInst: string,
};
type State = {
    lineChartData: Array,
    options: any,
    hardwareType: any,

};


export default class ModalForGraph extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            lineChartData: [],
            options: {},
            hardwareType: '',
        }
    }

    componentDidMount(): void {

    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.currentAppInstLineChartData !== nextProps.currentAppInstLineChartData) {

            let paramedlineChartData: TypeLineChartData2 = nextProps.currentAppInstLineChartData
            let hardwareType = paramedlineChartData.hardwareType
            let paramLevelTypeNameList = paramedlineChartData.levelTypeNameList
            let usageSetList = paramedlineChartData.usageSetList
            let newDateTimeList = paramedlineChartData.newDateTimeList

            const lineChartData = (canvas) => {
                let finalSeriesDataSets = [];

                for (let index in usageSetList) {
                    let datasetsOne = {
                        label: paramLevelTypeNameList[index],
                        backgroundColor: makeGradientColorOne(canvas, height),//todo: 리전드box area fill True/false
                        fill: true,//todo: 라인차트 area fill True/false
                        //backgroundColor: '',
                        borderColor: makeGradientColorOne(canvas, height),
                        borderWidth: 3.5, //lineBorder
                        lineTension: 0.5,
                        pointColor: "#fff",
                        pointStrokeColor: 'white',
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: 'white',
                        data: usageSetList[index],
                        radius: 0,
                        pointRadius: 1,
                    }
                    finalSeriesDataSets.push(datasetsOne)
                }

                return {
                    labels: newDateTimeList,
                    datasets: finalSeriesDataSets,
                }
            }

            let height = 500 + 100;
            let options = {
                animation: {
                    duration: 500
                },
                maintainAspectRatio: false,//@todo
                responsive: true,//@todo
                datasetStrokeWidth: 3,
                pointDotStrokeWidth: 4,
                layout: {
                    padding: {
                        left: 0,
                        right: 10,
                        top: 0,
                        bottom: 0
                    }
                },
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
                            fontColor: 'white',
                            callback(value, index, label) {
                                return convertByteToMegaByte(value, hardwareType)
                            },
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
                            //maxRotation: 0.05,
                            //autoSkip: true,
                            maxRotation: 45,
                            minRotation: 45,
                            padding: 10,
                            labelOffset: 0,
                            callback(value, index, label) {
                                return value;

                            },
                        },
                        beginAtZero: false,
                        /* gridLines: {
                             drawTicks: true,
                         },*/
                    }],
                    backgroundColor: {
                        fill: "#1e2124"
                    },
                }

            }


            this.setState({
                lineChartData: lineChartData,
                options: options,
                hardwareType: hardwareType,
            }, () => {
                console.log('lineChartData333333===>', this.state.lineChartData)
            })
        }
    }


    render() {

        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]
        };


        return (
            <div style={{flex: 1, display: 'flex'}}>
                <AModal

                    mask={false}
                    style={{position: 'absolute', bottom: 47, left: 265, color: 'green'}} //container style
                    //title={this.props.currentGraphAppInst + " [" + this.props.cluster + "]" + "  " + this.state.hardwareType}
                    visible={this.props.modalIsOpen}
                    onOk={() => {
                        this.props.parent.setState({
                            modalIsOpen: false,
                        })

                    }}
                    //maskClosable={false}
                    onCancel={() => {
                        this.props.parent.setState({
                            modalIsOpen: false,
                        })

                    }}
                    width={350}
                    height={'85%'}
                    footer={null}
                >
                    <div style={{display: 'flex', height: 55, backgroundColor: 'transparent', width: '100%'}}>
                        <div style={{flex: .85, display: 'flex'}}>
                            <div style={{color: '#fff', fontFamily: 'Karla', fontSize: 20, fontWeight: 'bold', marginLeft: 15,}}>
                                {this.props.currentGraphAppInst + ""}
                            </div>
                            <div style={{color: '#77BD25', fontFamily: 'Karla', fontSize: 20, fontWeight: 'bold', marginLeft: 3,}}>
                                {"[" + this.props.cluster + "]"}
                            </div>
                        </div>
                        <div style={{color: 'white', fontFamily: 'Encode Sans Condensed', fontSize: 20, fontWeight: 'bold', flex: .15}}>
                            {this.state.hardwareType}
                        </div>
                    </div>

                    <Line
                        width={window.innerWidth / 3.5}
                        ref="chart"
                        height={window.innerHeight / 3.5}
                        data={this.state.lineChartData}
                    />

                </AModal>

            </div>
        );
    };
};
