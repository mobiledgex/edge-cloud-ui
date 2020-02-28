// @flow
import * as React from 'react';
import {Modal as AModal} from "antd";
import {GRID_ITEM_TYPE, lineGraphOptions} from "../../../../shared/Constants";
import {Line} from "react-chartjs-2";
import {Chart as Bar_Column_Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import {barChartOption, columnChartOption} from "../PageMonitoringUtils";
import LeafletMapWrapperForDev from "./LeafletMapWrapperForDev";

const FA = require('react-fontawesome')
type Props = {
    chartDataForRendering: any,
    isShowBigGraph: boolean,
    popupGraphHWType: string,
    graphType: string,
    appInstanceListGroupByCloudlet: any,

};
type State = {
    chartDataForRendering: any,
    options: any,
    graphType: string,
    popupGraphHWType: string,
    appInstanceListGroupByCloudlet: any,
};

export default class BigModalGraph extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            chartDataForRendering: [],
        }
    }

    componentDidMount(): void {
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.chartDataForRendering !== nextProps.chartDataForRendering) {

            console.log("chartDataForRendering===>", nextProps.chartDataForRendering);

            this.setState({
                chartDataForRendering: nextProps.chartDataForRendering,
                graphType: nextProps.graphType.toUpperCase(),
                popupGraphHWType: nextProps.popupGraphHWType,
                appInstanceListGroupByCloudlet: nextProps.appInstanceListGroupByCloudlet,
            }, () => {
                console.log("chartDataForRendering===>", this.state.chartDataForRendering);

                //alert(this.state.graphType)
            })

        }

        if (this.props.isShowBigGraph) {
            this.setState({
                appInstanceListGroupByCloudlet: nextProps.appInstanceListGroupByCloudlet,
            }, () => {
                //alert(JSON.stringify(this.state.appInstanceListGroupByCloudlet))
            })

        }
    }

    render() {
        return (
            <div style={{flex: 1, display: 'flex'}}>
                <AModal
                    mask={false}
                    style={{}}
                    //title={this.props.currentGraphAppInst + " [" + this.props.cluster + "]" + "  " + this.state.hardwareType}
                    visible={this.props.isShowBigGraph}
                    onOk={() => {
                        this.props.parent.setState({
                            isShowBigGraph: false,
                        })

                    }}
                    //maskClosable={true}
                    onCancel={() => {
                        this.props.parent.setState({
                            isShowBigGraph: false,
                        })

                    }}
                    closable={true}
                    bodyStyle={{
                        height: window.innerHeight * 0.98,
                        marginTop: -90,
                        backgroundColor: 'black'
                    }}
                    width={'99%'}
                    footer={null}
                >
                    <div style={{display: 'flex', width: '100%'}}>
                        <div style={{
                            flex: .025,
                            backgroundColor: 'transparent',
                            width: 120,
                            display: 'flex',
                            alignSelf: 'center',
                            justifyContent: 'center'
                        }} onClick={() => {
                            this.props.parent.setState({
                                isShowBigGraph: false,
                            })
                        }}>
                            {/*<ArrowBack  style={{fontSize: 30, color: 'white'}} color={'white'}/>*/}
                            <FA name="arrow-circle-left" style={{fontSize: 40, color: 'white'}}/>

                        </div>
                        {this.state.graphType === GRID_ITEM_TYPE.MAP ?
                            <div style={{
                                color: 'white',
                                fontSize: 35,
                                flex: .9,
                                marginLeft: 25,
                            }}> Deployed Instance
                            </div>
                            : this.state.graphType === GRID_ITEM_TYPE.LINE ?
                                <div style={{
                                    color: 'white',
                                    fontSize: 35,
                                    flex: .9,
                                    marginLeft: 25,
                                }}> Cluster {this.props.popupGraphHWType} Usage
                                </div>
                                : this.state.graphType === GRID_ITEM_TYPE.BUBBLE ?

                                    <div style={{
                                        color: 'white',
                                        fontSize: 35,
                                        flex: .9,
                                        marginLeft: 25,
                                    }}> Bubble Chart
                                    </div>

                                    :
                                <div style={{
                                    color: 'white',
                                    fontSize: 35,
                                    flex: .9,
                                    marginLeft: 25,
                                }}> Top 5 {this.props.popupGraphHWType} Usage of {this.props.parent.state.currentClassification}
                                </div>
                        }


                    </div>

                    {this.state.graphType === GRID_ITEM_TYPE.LINE ?
                        <div style={{marginTop: 50}}>
                            <Line
                                width={window.innerWidth * 0.9}
                                ref="chart"
                                height={window.innerHeight * 0.8}
                                data={this.state.chartDataForRendering}
                                options={lineGraphOptions}
                                //data={data222}
                            />
                        </div>
                        : this.state.graphType === GRID_ITEM_TYPE.BAR || this.state.graphType === GRID_ITEM_TYPE.COLUMN ?
                            <div style={{marginTop: 50, height: '90%'}}>
                                <Bar_Column_Chart
                                    width={"100%"}
                                    //height={hardwareType === HARDWARE_TYPE.RECV_BYTE || hardwareType === HARDWARE_TYPE.SEND_BYTE ? chartHeight - 10 : '100%'}
                                    height={'100%'}
                                    chartType={this.state.graphType === GRID_ITEM_TYPE.BAR ? 'BarChart' : 'ColumnChart'}
                                    //chartType={'ColumnChart'}
                                    loader={<div><CircularProgress style={{color: '#1cecff', zIndex: 999999}}/></div>}
                                    data={this.state.chartDataForRendering}
                                    options={this.state.graphType === GRID_ITEM_TYPE.BAR ? barChartOption(this.state.popupGraphHWType) : columnChartOption(this.state.popupGraphHWType)}
                                />
                            </div>
                            : this.state.graphType === GRID_ITEM_TYPE.MAP ?
                                <div style={{height: window.innerHeight * 0.92}}>
                                    <LeafletMapWrapperForDev
                                        mapPopUploading={false}
                                        parent={this}
                                        isDraggable={true}
                                        handleAppInstDropdown={this.props.parent.handleAppInstDropdown}
                                        markerList={this.state.appInstanceListGroupByCloudlet}/>
                                </div>
                                    :
                                    <div></div>


                    }

                </AModal>

            </div>
        );
    };
};
