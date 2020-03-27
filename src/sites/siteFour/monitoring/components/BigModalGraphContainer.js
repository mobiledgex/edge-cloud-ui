// @flow


import React, {Fragment} from 'react';
import {Modal as AModal} from "antd";
import {CLASSIFICATION, GRID_ITEM_TYPE, lineGraphOptions} from "../../../../shared/Constants";
import {Line} from "react-chartjs-2";
import {Chart as Bar_Column_Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import {barChartOption, columnChartOption} from "../PageMonitoringUtils";
import LeafletMapWrapperForDev from "./LeafletMapDevContainer";
import {hot} from "react-hot-loader/root";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import sizeMe from "react-sizeme";
import * as actions from "../../../../actions";
import {renderCircleLoaderForMap} from "../PageMonitoringCommonService";

const FA = require('react-fontawesome')
const mapStateToProps = (state) => {
    return {
        isLoading: state.LoadingReducer.isLoading,
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        toggleLoading: (data) => {
            dispatch(actions.toggleLoading(data))
        }
    };
};
type Props = {
    chartDataForRendering: any,
    isShowBigGraph: boolean,
    popupGraphHWType: string,
    graphType: string,
    appInstanceListGroupByCloudlet: any,
    isLoading: boolean,
    toggleLoading: Function,

};
type State = {
    chartDataForRendering: any,
    options: any,
    graphType: string,
    popupGraphHWType: string,
    appInstanceListGroupByCloudlet: any,
    bigModalLoading: boolean,
};
export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class BigModalGraphContainer extends React.Component<Props, State> {


        constructor(props: Props) {
            super(props)
            this.state = {
                chartDataForRendering: [],
                bigModalLoading: false,
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
                    selectedClientLocationListOnAppInst: nextProps.selectedClientLocationListOnAppInst,
                    loading: nextProps.loading,
                }, () => {
                    //alert(JSON.stringify(this.state.appInstanceListGroupByCloudlet))
                })

            }
        }

        renderPrevBtn() {
            return (
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
            )
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
                        cancelButtonProps={{
                            style: {display: 'none'}
                        }}
                        //maskClosable={true}
                        onCancel={() => {
                            this.props.parent.setState({
                                isShowBigGraph: false,
                            })

                        }}
                        closable={false}
                        bodyStyle={{
                            height: window.innerHeight - 20,
                            backgroundColor: 'rgb(41, 44, 51)',
                        }}
                        width={'100%'}
                        style={{padding: '10px', top: 0}}
                        footer={null}
                    >
                        <div style={{width: '100%'}}>
                            {this.state.graphType === GRID_ITEM_TYPE.MAP ?
                                <div style={{display: 'flex'}}>
                                    {this.renderPrevBtn()}
                                    <div className='page_monitoring_popup_title'>
                                        Deployed Instance
                                    </div>
                                    <div style={{marginLeft: 0}}>
                                        {this.props.isLoading && renderCircleLoaderForMap()}
                                    </div>
                                </div>
                                : this.state.graphType === GRID_ITEM_TYPE.LINE && this.props.parent.state.currentClassification === CLASSIFICATION.CLUSTER ?
                                    <div style={{display: 'flex'}}>
                                        {this.renderPrevBtn()}
                                        <div className='page_monitoring_popup_title'>
                                            Cluster {this.props.popupGraphHWType} Usage
                                        </div>
                                    </div>

                                    : this.state.graphType === GRID_ITEM_TYPE.LINE && this.props.parent.state.currentClassification === CLASSIFICATION.APPINST ?
                                        <div style={{display: 'flex'}}>
                                            {this.renderPrevBtn()}
                                            <div className='page_monitoring_popup_title'>
                                                App Instance {this.props.popupGraphHWType} Usage
                                            </div>
                                        </div>
                                        : this.state.graphType === GRID_ITEM_TYPE.BUBBLE ?

                                            <div style={{display: 'flex'}}>
                                                {this.renderPrevBtn()}
                                                <div className='page_monitoring_popup_title'>
                                                    Bubble Chart
                                                </div>
                                            </div>
                                            :
                                            <div style={{display: 'flex'}}>
                                                {this.renderPrevBtn()}
                                                <div className='page_monitoring_popup_title'>
                                                    Top 5 {this.props.popupGraphHWType} Usage
                                                    of {this.props.parent.state.currentClassification}
                                                </div>
                                            </div>

                            }
                            <div className='page_monitoring_popup_title_divide'/>
                        </div>

                        {this.state.graphType === GRID_ITEM_TYPE.LINE ?
                            <div>
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
                                <div style={{height: 'calc(100% - 62px)'}}>
                                    <Bar_Column_Chart
                                        width={"100%"}
                                        //height={hardwareType === HARDWARE_TYPE.RECV_BYTE || hardwareType === HARDWARE_TYPE.SEND_BYTE ? chartHeight - 10 : '100%'}
                                        height={'100%'}
                                        chartType={this.state.graphType === GRID_ITEM_TYPE.BAR ? 'BarChart' : 'ColumnChart'}
                                        //chartType={'ColumnChart'}
                                        loader={<div><CircularProgress style={{color: '#1cecff', zIndex: 999999}}/>
                                        </div>}
                                        data={this.state.chartDataForRendering}
                                        options={this.state.graphType === GRID_ITEM_TYPE.BAR ? barChartOption(this.state.popupGraphHWType) : columnChartOption(this.state.popupGraphHWType)}
                                    />
                                </div>
                                : this.state.graphType === GRID_ITEM_TYPE.MAP ?

                                    <React.Fragment>
                                        <div style={{height: 'calc(100% - 62px)'}}>
                                            <LeafletMapWrapperForDev
                                                mapPopUploading={false}
                                                parent={this}
                                                isDraggable={true}
                                                isFullScreenMap={true}
                                                handleAppInstDropdown={this.props.parent.handleAppInstDropdown}
                                                markerList={this.state.appInstanceListGroupByCloudlet}
                                                selectedClientLocationListOnAppInst={this.state.selectedClientLocationListOnAppInst}
                                            />
                                        </div>
                                    </React.Fragment>
                                    :
                                    <div></div>


                        }

                    </AModal>

                </div>
            );
        };
    }
))))
