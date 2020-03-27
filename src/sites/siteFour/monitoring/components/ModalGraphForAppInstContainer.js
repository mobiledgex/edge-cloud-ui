// @flow
import * as React from 'react';
import {Modal as AModal} from "antd";
import {Line} from 'react-chartjs-2';
import PageDevMonitoring from "../dev/PageDevMonitoring";
import type {TypeLineChartData2} from "../../../../shared/Types";
import {convertByteToMegaByte} from "../PageMonitoringCommonService";
import {makeGradientColorOne} from "../dev/PageDevMonitoringService";
import {Dropdown} from "semantic-ui-react";
import {HARDWARE_OPTIONS_FOR_APPINST} from "../../../../shared/Constants";

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


export default class ModalGraphForAppInstContainer extends React.Component<Props, State> {

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
                    duration: 1000
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

                console.log('lineChartData===>', lineChartData);
            })
        }
    }


    render() {


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
                    <div style={{display: 'flex', backgroundColor: 'transparent', width: '100%', height: 50}}>
                        <div style={{flex: .45, display: 'flex'}}>
                            <div style={{color: '#fff', fontFamily: 'Karla', fontSize: 20, fontWeight: 'bold', marginLeft: 15,}}>
                                {this.props.currentGraphAppInst + ""}
                            </div>
                            <div style={{color: '#77BD25', fontFamily: 'Karla', fontSize: 20, fontWeight: 'bold', marginLeft: 3,}}>
                                {"[" + this.props.cluster + "]"}
                            </div>
                        </div>
                        <div style={{flex: .3, display: 'flex', backgroundColor: 'transparent'}}>
                            <Dropdown
                                placeholder='SELECT CONN TYPE'
                                selection
                                //loading={this.state.loading}
                                options={HARDWARE_OPTIONS_FOR_APPINST}
                                defaultValue={HARDWARE_OPTIONS_FOR_APPINST[0].value}
                                onChange={async (e, {value}) => {

                                }}
                                //value={subCategoryType}
                                style={{height: 35}}
                            />
                        </div>
                        <div
                            style={{color: 'white', fontSize: 20, fontWeight: 'bold', flex: .35, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom:12}}>
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
