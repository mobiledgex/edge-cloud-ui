// @flow
import * as React from 'react';
import {Modal as AModal} from "antd";
import {Line} from 'react-chartjs-2';
import PageDevMonitoring from "./PageDevMonitoring";
import type {TypeLineChartData2} from "../../../../shared/Types";
import {convertByteToMegaByte} from "../PageMonitoringCommonService";
import {makeGradientColor, makeGradientColorOne} from "./PageDevMonitoringService";
import {Dropdown} from "semantic-ui-react";
import {CHART_COLOR_LIST, CONNECTIONS_OPTIONS, HARDWARE_OPTIONS, HARDWARE_OPTIONS_FOR_APPINST, HARDWARE_TYPE} from "../../../../shared/Constants";

type Props = {
    modalIsOpen: boolean,
    parent: PageDevMonitoring,
    selectedClusterUsageOne: Array,
    appInst: string,
    selectedClusterUsageOneIndex: number
};
type State = {
    lineChartData: Array,
    options: any,
    hardwareType: any,
    cluster_cloudlet: string,

};


export default class ModalGraphForCluster extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            lineChartData: [],
            options: {},
            hardwareType: '',
            cluster_cloudlet: '',
        }
    }

    componentDidMount(): void {

    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.selectedClusterUsageOne !== nextProps.selectedClusterUsageOne) {
            let clusterUsageOne: TypeLineChartData2 = nextProps.selectedClusterUsageOne

            let hardwareType = clusterUsageOne.hardwareType
            let currentClusterName = clusterUsageOne.levelTypeNameList
            this.setState({
                cluster_cloudlet: currentClusterName
            })

            let usageSetList = clusterUsageOne.usageSetList
            let newDateTimeList = clusterUsageOne.newDateTimeList

            let index = nextProps.selectedClusterUsageOneIndex

            let arrayDatasetsList = []
            let datasetsOne = {
                label: currentClusterName,
                backgroundColor: CHART_COLOR_LIST[index],
                borderColor: CHART_COLOR_LIST[index],
                borderCapStyle: 'butt',
                fill: false,//todo: 라인차트 area fill True/false
                //backgroundColor: '',
                borderWidth: 3.5, //lineBorder
                lineTension: 0.5,
                pointColor: "#fff",
                pointStrokeColor: 'white',
                pointHighlightFill: "#fff",
                pointHighlightStroke: 'white',
                data: usageSetList,
                radius: 0,
                pointRadius: 1,
            }

            arrayDatasetsList.push(datasetsOne)

            let lineChartData = {
                labels: newDateTimeList,
                datasets: arrayDatasetsList,
            }

            let options = {
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
                            beginAtZero:true,
                            min: 0,
                            max: 100,
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

            console.log('lineChartData===>', lineChartData);


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

        return (
            <div style={{flex: 1, display: 'flex'}}>
                <AModal
                    mask={false}
                    style={{position: 'absolute', bottom: 150, left: 265, color: 'green'}} //container style
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
                    <div style={{display: 'flex', backgroundColor: 'transparent', width: '100%', height: 59}}>
                        <div style={{flex: .85, display: 'flex', color: '#FFF',fontFamily: 'Barlow Semi', fontSize: 28, fontWeight: 'bold', marginLeft: 3,}}>
                            {this.state.cluster_cloudlet}
                        </div>
                        <div
                            style={{
                                flex: .15,
                                color: 'white',
                                fontFamily: 'Barlow Semi',
                                fontSize: 30,
                                fontWeight: 'bold',
                                textAlign: 'right',
                                display: 'flex',
                            }}>
                            {this.state.hardwareType}
                        </div>
                    </div>
                    <Line
                        width={window.innerWidth / 3.5}
                        ref="chart"
                        height={window.innerHeight / 3.5}
                        data={this.state.lineChartData}
                        options={this.state.options}
                        //data={data222}
                    />

                </AModal>

            </div>
        );
    };
};
