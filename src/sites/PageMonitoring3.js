import 'react-hot-loader'
import React from 'react';
import FlexBox from "flexbox-react";
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {hot} from "react-hot-loader/root";
import {Dropdown, Grid, Tab,} from "semantic-ui-react";
import {DatePicker, notification} from 'antd';
import * as reducer from "../utils";
import {formatDate, getTodayDate} from "../utils";
import {
    fetchAppInstanceList,
    filterAppInstanceListByCloudLet,
    filterAppInstanceListByClusterInst,
    filterAppInstanceListByRegion,
    filterAppInstOnCloudlet,
    filterCpuOrMemUsageByCloudLet,
    filterCpuOrMemUsageByCluster,
    filterCpuOrMemUsageListByRegion,
    filterInstanceCountOnCloutLetOne, getInstHealth,
    makeCloudletListSelectBox,
    makeClusterListSelectBox, makeHardwareUsageListPerInstance,
    renderBarGraphForCpuMem,
    renderBubbleChart,
    renderInstanceOnCloudletGrid,
    renderLineChart,
    renderPieChart2AndAppStatus,
    renderPlaceHolder,
    renderPlaceHolder2
} from "../services/PageMonitoringService";
import {HARDWARE_TYPE, RECENT_DATA_LIMIT_COUNT, REGIONS_OPTIONS} from "../shared/Constants";
import Lottie from "react-lottie";
import type {TypeAppInstance} from "../shared/Types";
import {toggleLoading} from "../actions";
import axios from "axios";
import {CircularProgress} from "@material-ui/core";
//import './PageMonitoring.css';
const FA = require('react-fontawesome')
const {Column, Row} = Grid;
const {Pane} = Tab

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
    handleLoadingSpinner: Function,
    toggleLoading: Function,
    history: any,
    onSubmit: any,
    sendingContent: any,
    loading: boolean,
    isLoading: boolean,
    toggleLoading: Function,
}

type State = {
    date: string,
    time: string,
    dateTime: string,
    datesRange: string,
    appInstanceListGroupByCloudlet: any,
    loading: boolean,
    loading0: boolean,
    cloudletList: any,
    clusterInstanceGroupList: any,
    startDate: string,
    endDate: string,
    clusterList: any,
    filteredCpuUsageList: any,
    filteredMemUsageList: any,
    counter: number,
    appInstanceList: Array<TypeAppInstance>,
    allAppInstanceList: Array<TypeAppInstance>,
    appInstanceOne: TypeAppInstance,
    currentRegion: string,
    allCpuUsageList: Array,
    allMemUsageList: Array,
    cloudLetSelectBoxPlaceholder: string,
    clusterSelectBoxPlaceholder: string,
    currentCloudLet: string,
    isReady: boolean,
    isAppInstaceDataReady: boolean,
    activeTabIndex: number,
    usageListCPU: Array,
    usageListMEM: Array,
    usageListDISK: Array,
    usageListNETWORK: Array,


}


export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageMonitoring3 extends React.Component<Props, State> {
        state = {
            date: '',
            time: '',
            dateTime: '',
            datesRange: '',
            appInstanceListGroupByCloudlet: [],
            loading: false,
            loading0: false,
            cloudletList: [],
            clusterInstanceGroupList: [],
            startDate: '',
            endDate: '',
            clusterList: [],
            filteredCpuUsageList: [],
            filteredMemUsageList: [],
            isReady: false,
            counter: 0,
            appInstanceList: [],
            allAppInstanceList: [],
            appInstanceOne: {},
            currentRegion: '',
            allCpuUsageList: [],
            allMemUsageList: [],
            cloudLetSelectBoxPlaceholder: 'Select CloudLet',
            clusterSelectBoxPlaceholder: 'Select cluster',
            currentCloudLet: '',
            isAppInstaceDataReady: false,
            activeTabIndex: 1,
            usageListCPU: [],
            usageListMEM: [],
            usageListDISK: [],
            usageListNETWORK: [],
        };

        intervalHandle = null;

        constructor(props) {
            super(props);

        }


        componentDidMount = async () => {

            let appInstanceList: Array<TypeAppInstance> = await fetchAppInstanceList(['EU', 'US']);

            let usageList = await Promise.all([
                makeHardwareUsageListPerInstance(appInstanceList, HARDWARE_TYPE.CPU, RECENT_DATA_LIMIT_COUNT),
                makeHardwareUsageListPerInstance(appInstanceList, HARDWARE_TYPE.MEM, RECENT_DATA_LIMIT_COUNT),
                makeHardwareUsageListPerInstance(appInstanceList, HARDWARE_TYPE.DISK, RECENT_DATA_LIMIT_COUNT),
                makeHardwareUsageListPerInstance(appInstanceList, HARDWARE_TYPE.NETWORK, RECENT_DATA_LIMIT_COUNT),
            ])
            console.log('CPUusageList===>', usageList[0]);
            console.log('MEMusageList===>', usageList[1]);
            console.log('DISKusageList===>', usageList[2]);
            console.log('NETWORKusageList===>', usageList[3]);


            this.setState({
                appInstanceList: appInstanceList,
                usageListCPU: usageList[0],
                usageListMEM: usageList[1],
                usageListDISK: usageList[2],
                usageListNETWORK: usageList[3],
            }, () => {

                alert('Readt!!!')
                this.setState({
                    isReady: true,
                })
            })
        }

        componentWillUnmount() {
            clearInterval(this.intervalHandle)
        }


        renderHeader = () => {
            return (
                <Grid.Row className='content_title'
                          style={{width: 'fit-content', display: 'inline-block'}}>
                    <Grid.Column className='title_align'
                                 style={{lineHeight: '36px'}}>Monitoring</Grid.Column>
                    <div style={{marginLeft: '10px'}}>
                        <button className="ui circular icon button"><i aria-hidden="true"
                                                                       className="info icon"></i></button>
                    </div>
                </Grid.Row>
            )
        }


        renderAppInstaceList() {
            const colors = [
                'red',
                'orange',
                'yellow',
                'olive',
                'green',
                'teal',
                'blue',
                'violet',
                'purple',
                'pink',
                'brown',
                'grey',
                'black',
            ]

            return (
                <div style={{marginTop: 10}}>
                    {!this.state.isReady && <CircularProgress style={{color: 'red'}}/>}
                    <Grid columns={7} padded={true}>
                        <Row>
                            <Column color={'grey'}>
                                NAME
                            </Column>
                            <Column color={'grey'}>
                                CPU(%)
                            </Column>
                            <Column color={'grey'}>
                                RSS MEM
                            </Column>
                            <Column color={'grey'}>
                                RecvBytes
                            </Column>
                            <Column color={'grey'}>
                                SendBytes
                            </Column>
                            <Column color={'grey'}>
                                Status
                            </Column>
                            <Column color={'grey'}>
                                Start
                            </Column>
                        </Row>
                        {this.state.isReady && this.state.appInstanceList.map((item: TypeAppInstance, index) => {


                            /*   sumCpuUsage: sumCpuUsage,
                               sumMemUsage: sumMemUsage,
                               sumDiskUsage: sumDiskUsage,
                               sumRecvBytes: sumRecvBytes,
                               sumSendBytes: sumSendBytes,*/

                            return (
                                <Row>
                                    <Column>
                                        {item.AppName}
                                    </Column>
                                    <Column>
                                        {this.state.usageListCPU[index].sumCpuUsage.toFixed(2) + "%"}
                                    </Column>
                                    <Column>
                                        {this.state.usageListMEM[index].sumMemUsage.toFixed(0) + ' Byte'}
                                    </Column>
                                    <Column>
                                        {this.state.usageListNETWORK[index].sumRecvBytes}
                                    </Column>
                                    <Column>
                                        {this.state.usageListNETWORK[index].sumSendBytes}
                                    </Column>
                                    <Column>
                                        asdasdasd
                                    </Column>
                                    <Column>
                                        adasd
                                    </Column>
                                </Row>
                            )
                        })}
                    </Grid>
                </div>
            )
        }


        render() {

            const panes = [
                {
                    menuItem: 'CPU', render: () => {
                        return (
                            <Pane>
                                {this.renderAppInstaceList()}
                            </Pane>
                        )
                    }
                },
                {
                    menuItem: 'MEMORY', render: () => {
                        return (
                            <Pane>Tab 1 Content</Pane>
                        )
                    }
                },
                {
                    menuItem: 'NETWORK', render: () => {
                        return (
                            <Pane>Tab 1 Content</Pane>
                        )
                    }
                },
            ]


            return (

                <Grid.Row className='view_contents'>
                    <Grid.Column className='contents_body'>
                        {/*todo:####################*/}
                        {/*todo:Content Header part      */}
                        {/*todo:####################*/}
                        {this.renderHeader()}


                        <Grid.Row className='site_content_body'>
                            <Grid.Column>
                                <div className="table-no-resized"
                                     style={{height: '100%', display: 'flex', overflow: 'hidden'}}>

                                    <div className="page_monitoring">
                                        <div className='page_monitoring_dashboard'>

                                            <Tab
                                                panes={panes}
                                                /*activeIndex={this.state.activeTabIndex}
                                                onTabChange={(e, {activeIndex}) => {
                                                    this.setState({
                                                        activeTabIndex:activeIndex,
                                                    })
                                                }}*/
                                            />
                                        </div>
                                    </div>


                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid.Column>

                </Grid.Row>


            );
        }

    }
))));
