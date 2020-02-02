import 'react-hot-loader'
import {SemanticToastContainer, toast} from 'react-semantic-toasts';
import OutsideClickHandler from 'react-outside-click-handler';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {Button, Dropdown, Grid, Modal, Tab} from 'semantic-ui-react'
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../../../actions';
import {hot} from "react-hot-loader/root";
import {DatePicker,} from 'antd';
import {
    convertNetworkTitle,
    filterUsageByClassification,
    makeBarChartDataForAppInst,
    makeBarChartDataForCluster,
    makeLineChartDataForAppInst,
    makeLineChartDataForCluster,
    makeSelectBoxListWithKeyValuePipe,
    makeSelectBoxListWithThreeValuePipe,
    renderBubbleChartForCloudlet,
} from "./PageDevMonitoringService";
import {CLASSIFICATION, CONNECTIONS_OPTIONS, HARDWARE_OPTIONS_FOR_CLUSTER, HARDWARE_TYPE, NETWORK_OPTIONS, NETWORK_TYPE, RECENT_DATA_LIMIT_COUNT} from "../../../../shared/Constants";
import Lottie from "react-lottie";
import type {TypeBarChartData, TypeGridInstanceList, TypeLineChartData} from "../../../../shared/Types";
import {TypeAppInstance, TypeUtilization} from "../../../../shared/Types";
import moment from "moment";
import ToggleDisplay from 'react-toggle-display';
import '../PageMonitoring.css'
import {getOneYearStartEndDatetime, makeBubbleChartDataForCluster, renderBarChartCore, renderLineChartCore, renderPlaceHolder, renderPlaceHolder3, showToast} from "../PageMonitoringCommonService";
import {getAppLevelUsageList, StylesForMonitoring} from "../admin/PageAdminMonitoringService";
import MapboxComponent from "./MapboxComponent";
import * as reducer from "../../../../utils";
import {CircularProgress} from "@material-ui/core";
import {TabPanel, Tabs} from "react-tabs";
import FlexBox from "flexbox-react";

const FA = require('react-fontawesome')
const {RangePicker} = DatePicker;
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
    userRole: any,
}

type State = {
    date: string,
    time: string,
    dateTime: string,
    datesRange: string,
    appInstanceListGroupByCloudlet: any,
    loading: boolean,
    loading0: boolean,
    dropdownCloudletList: any,
    clusterInstanceGroupList: any,
    startTime: string,
    endTime: string,
    clusterList: any,
    filteredCpuUsageList: any,
    filteredMemUsageList: any,
    filteredDiskUsageList: any,
    filteredNetworkUsageList: any,
    counter: number,
    appInstanceList: Array<TypeAppInstance>,
    allAppInstanceList: Array<TypeAppInstance>,
    appInstanceOne: TypeAppInstance,
    currentRegion: string,
    cloudLetSelectBoxPlaceholder: string,
    clusterSelectBoxPlaceholder: string,
    appInstSelectBoxPlaceholder: string,
    currentCloudLet: string,
    currentCluster: string,
    currentAppInst: string,
    isReady: boolean,
    isModalOpened: false,
    appInstanceListTop5: Array,
    selectBoxTop5InstanceForMem: Array,
    currentAppInstaceListIndex: number,
    loading777: boolean,
    currentUtilization: TypeUtilization,
    regionSelectBoxClearable: boolean,
    cloudLetSelectBoxClearable: boolean,
    clusterSelectBoxClearable: boolean,
    appInstSelectBoxClearable: boolean,
    isShowUtilizationArea: boolean,
    currentGridIndex: number,
    currentTabIndex: number,
    isShowBottomGrid: boolean,
    isShowBottomGridForMap: boolean,
    mapZoomLevel: number,
    currentHardwareType: string,
    bubbleChartData: Array,
    currentNetworkType: string,
    lineChartData: Array,
    isReadyNetWorkCharts: boolean,
    isEnableCloutletDropDown: boolean,
    isEnableClusterDropDown: boolean,
    isEnableAppInstDropDown: boolean,
    currentNetworkTab: number,
    allGridInstanceList: TypeGridInstanceList,
    filteredGridInstanceList: any,
    gridInstanceListMemMax: number,
    networkTabIndex: number,
    gridInstanceListCpuMax: number,
    usageListByDate: Array,
    userType: string,
    placeHolderStateTime: string,
    placeHolderEndTime: string,
    allConnectionsUsageList: Array,
    filteredConnectionsUsageList: Array,
    connectionsTabIndex: number,
    cloudletList: Array,
    maxCpu: number,
    maxMem: number,
    intervalLoading: boolean,
    isRequesting: false,
    clusterDropdownList: Array,
    currentClassification: string,
    cloudletList: Array,
    filteredAppInstanceList: Array,
    appInstDropdown: Array,
    dropdownRequestLoading: boolean,
    cloudletKeys: Array,
    allClusterUsageList: Array,
    filteredClusterUsageList: Array,
    filteredAppInstUsageList: Array,
    allAppInstUsageList: Array,

}


export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageDevMonitoring extends Component<Props, State> {
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
            clusterList: [],
            filteredCpuUsageList: [],
            filteredMemUsageList: [],
            filteredDiskUsageList: [],
            filteredNetworkUsageList: [],
            isReady: false,
            counter: 0,
            appInstanceList: [],
            allAppInstanceList: [],
            appInstanceOne: {},
            cloudLetSelectBoxPlaceholder: 'Select CloudLet',
            clusterSelectBoxPlaceholder: 'Select Cluster',
            appInstSelectBoxPlaceholder: 'Select App Inst',
            currentRegion: 'ALL',
            currentCloudLet: '',
            currentCluster: '',
            currentAppInst: '',
            isModalOpened: false,
            appInstanceListTop5: [],
            selectBoxTop5InstanceForMem: [],
            startTime: '',
            endTime: '',
            currentAppInstaceListIndex: 0,
            loading777: false,
            currentUtilization: '',
            regionSelectBoxClearable: false,
            cloudLetSelectBoxClearable: false,
            clusterSelectBoxClearable: false,
            appInstSelectBoxClearable: false,
            isShowUtilizationArea: false,
            currentGridIndex: -1,
            currentTabIndex: 0,
            isShowBottomGrid: false,
            isShowBottomGridForMap: false,
            mapZoomLevel: 0,
            currentHardwareType: HARDWARE_TYPE.CPU.toUpperCase(),
            bubbleChartData: [],
            currentNetworkType: NETWORK_TYPE.RECV_BYTES,
            lineChartData: [],
            isReadyNetWorkCharts: false,
            isEnableCloutletDropDown: true,
            isEnableClusterDropDown: false,
            isEnableAppInstDropDown: false,
            currentNetworkTab: 0,
            allGridInstanceList: [],
            filteredGridInstanceList: [],
            gridInstanceListMemMax: 0,
            networkTabIndex: 0,
            gridInstanceListCpuMax: 0,
            usageListByDate: [],
            userType: '',
            placeHolderStateTime: moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'),
            placeHolderEndTime: moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm'),
            allConnectionsUsageList: [],
            filteredConnectionsUsageList: [],
            connectionsTabIndex: 0,
            dropdownCloudletList: [],
            allUsageList: [],
            maxCpu: 0,
            maxMem: 0,
            intervalLoading: false,
            isRequesting: false,
            clusterDropdownList: [],
            currentClassification: 'Cluster',
            selectOrg: '',
            filteredAppInstanceList: [],
            appInstDropdown: [],
            dropdownRequestLoading: false,
            cloudletKeys: [],
            filteredClusterUsageList: [],
            allClusterUsageList: [],
            filteredAppInstUsageList: [],
            allAppInstUsageList: [],
        };

        interval = null;


        constructor(props) {
            super(props);
        }

        componentDidMount = async () => {

            this.setState({
                loading: true,
                selectOrg: localStorage.selectOrg.toString(),
            })
            await this.loadInitDataForCluster();

            this.setState({
                loading: false,
            })
        }

        componentWillUnmount(): void {
            clearInterval(this.interval)
        }


        async loadInitDataForCluster(isInterval: boolean = false) {
            this.setState({dropdownRequestLoading: true})
            /*   let clusterList = await getClusterList();
               let cloudletList = await getCloudletList()
               let appInstanceList: Array<TypeAppInstance> = await getAppInstList();*/

            let clusterList = require('./clusterList')
            let cloudletList = require('./cloudletList')
            let appInstanceList = require('./appInstList')

            console.log('clusterList===>', clusterList);

            let clusterDropdownList = makeSelectBoxListWithKeyValuePipe(clusterList, 'ClusterName', 'Cloudlet')

            //ClusterInst
            let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, CLASSIFICATION.CLOUDLET);

            console.log('appInstanceList===>', appInstanceList);

            await this.setState({
                isReady: true,
                clusterDropdownList: clusterDropdownList,
                cloudletList: cloudletList,
                clusterList: clusterList,
                isAppInstaceDataReady: true,
                appInstanceList: appInstanceList,
                filteredAppInstanceList: appInstanceList,
                dropdownRequestLoading: false,

            });

            if (!isInterval) {
                this.setState({
                    appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
                })
            }


            //let allClusterUsageList = await getClusterLevelUsageList(clusterList, "*", RECENT_DATA_LIMIT_COUNT);
            let allClusterUsageList = require('./allClusterUsageList')
            await this.setState({
                allClusterUsageList: allClusterUsageList,
            });
            console.log('filteredAppInstanceList===>', appInstanceList)

            let bubbleChartData = await makeBubbleChartDataForCluster(allClusterUsageList, HARDWARE_TYPE.CPU);
            await this.setState({
                bubbleChartData: bubbleChartData,
            })

            let maxCpu = Math.max.apply(Math, allClusterUsageList.map(function (o) {
                return o.sumCpuUsage;
            }));

            let maxMem = Math.max.apply(Math, allClusterUsageList.map(function (o) {
                return o.sumMemUsage;
            }));

            await this.setState({
                allClusterUsageList: allClusterUsageList,
                filteredClusterUsageList: allClusterUsageList,
                maxCpu: maxCpu,
                maxMem: maxMem,
                isRequesting: false,
                currentCluster: '',
            })

        }

        async resetAllData() {
            await this.setState({
                currentGridIndex: -1,
                currentTabIndex: 0,
                currentClassification: CLASSIFICATION.CLUSTER,
            })

            await this.setState({
                filteredClusterUsageList: this.state.allClusterUsageList,
                filteredAppInstanceList: this.state.appInstanceList,
                appInstanceListGroupByCloudlet: reducer.groupBy(this.state.appInstanceList, CLASSIFICATION.CLOUDLET),
            })
            this.setState({
                dropdownRequestLoading: false,
                currentCluster: '',
                currentAppInst: '',
            })
        }


        async refreshAllData() {

            toast({
                type: 'success',
                //icon: 'smile',
                title: 'FETCH NEW DATA!',
                animation: 'bounce',
                time: 3 * 1000,
                color: 'black',
            });
            await this.setState({
                currentClassification: CLASSIFICATION.CLUSTER,
                placeHolderStateTime: moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'),
                placeHolderEndTime: moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm'),
            })
            await this.setState({
                cloudLetSelectBoxClearable: true,
            })
            await this.setState({
                loading: true,
                dropdownRequestLoading: true
            })
            await this.loadInitDataForCluster();
            this.setState({
                loading: false,
            })
            await this.setState({
                currentRegion: 'ALL',
                currentCloudLet: '',
                currentCluster: '',
                currentAppInst: '',
            })
        }

        makeChartDataAndRenderTabBody(hwType, subCategoryType = '') {
            let barChartDataSet: TypeBarChartData = [];
            let lineChartDataSet: TypeLineChartData = [];
            if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                barChartDataSet = makeBarChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
                lineChartDataSet = makeLineChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
            }
            //@todo:클러스터인 경우
            else if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                barChartDataSet = makeBarChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
                lineChartDataSet = makeLineChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
            }

            console.log(`barChartDataSet===${hwType}>`, barChartDataSet);
            if (hwType === HARDWARE_TYPE.RECVBYTES
                || hwType === HARDWARE_TYPE.SENDBYTES
                || hwType === HARDWARE_TYPE.ACTIVE_CONNECTION
                || hwType === HARDWARE_TYPE.ACCEPTS_CONNECTION
                || hwType === HARDWARE_TYPE.HANDLED_CONNECTION
            ) {
                return this.renderGraphForMultiTabGraphArea(subCategoryType, barChartDataSet, lineChartDataSet)

            } else {
                return this.renderGraphArea(hwType, barChartDataSet, lineChartDataSet)
            }
        }

        renderGraphForMultiTabGraphArea(subCategoryType, barChartDataSet, lineChartDataSet) {
            return (
                <div className='page_monitoring_dual_column'>
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of {convertNetworkTitle(subCategoryType)} Usage on {this.state.currentClassification}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderBarChartCore(barChartDataSet.chartDataList, barChartDataSet.hardwareType)}
                        </div>
                    </div>
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title_select'>
                                {convertNetworkTitle(subCategoryType)} Usage of {this.state.currentClassification}
                            </div>
                            {!this.state.loading && this.renderDropDownForMultiTab(subCategoryType)}
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderLineChartCore(lineChartDataSet.levelTypeNameList, lineChartDataSet.usageSetList, lineChartDataSet.newDateTimeList, lineChartDataSet.hardwareType)}
                        </div>
                    </div>
                </div>
            )
        }


        renderDropDownForMultiTab(cate) {
            if (cate === HARDWARE_TYPE.SENDBYTES || cate === HARDWARE_TYPE.RECVBYTES) {
                return this.renderDropdownForNetwork(cate)
            } else {
                return this.renderDropdownForConnections(cate)
            }

        }

        renderDropdownForConnections(subCategoryType) {
            return (
                <Dropdown
                    placeholder='SELECT CONN TYPE'
                    selection
                    loading={this.state.loading}
                    options={CONNECTIONS_OPTIONS}
                    defaultValue={CONNECTIONS_OPTIONS[0].value}
                    onChange={async (e, {value}) => {
                        //TAB0 IS SENDBYTES
                        if (value === HARDWARE_TYPE.ACTIVE_CONNECTION) {
                            this.setState({
                                connectionsTabIndex: 0,
                            })
                        } else if (value === HARDWARE_TYPE.HANDLED_CONNECTION) {
                            this.setState({
                                connectionsTabIndex: 1,
                            })
                        } else if (value === HARDWARE_TYPE.ACCEPTS_CONNECTION) {
                            this.setState({
                                connectionsTabIndex: 2,
                            })
                        }

                    }}
                    value={subCategoryType}
                    // style={Styles.dropDown}
                />
            )
        }

        renderDropdownForNetwork(subCategoryType) {
            return (
                <Dropdown
                    placeholder='SELECT NET TYPE'
                    selection
                    loading={this.state.loading}
                    options={NETWORK_OPTIONS}
                    defaultValue={NETWORK_OPTIONS[0].value}
                    onChange={async (e, {value}) => {
                        //TAB0 IS SENDBYTES
                        if (value === HARDWARE_TYPE.RECVBYTES) {
                            this.setState({
                                connectionsTabIndex: 0,
                            })
                        } else if (value === HARDWARE_TYPE.SENDBYTES) {
                            this.setState({
                                connectionsTabIndex: 1,
                            })
                        }
                    }}
                    value={subCategoryType}
                    // style={Styles.dropDown}
                />
            )
        }

        //@todo:-----------------------
        //@todo:    CPU,MEM,DISK TAB
        //@todo:-----------------------
        TAB_FOR_APP_INST = [

            {
                menuItem: 'CPU', render: () => {
                    return (
                        <Pane>
                            {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.CPU)}
                        </Pane>
                    )
                },
            },
            {
                menuItem: 'MEM', render: () => {
                    return (
                        <Pane>
                            {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.MEM)}
                        </Pane>
                    )
                }
            },

            {
                menuItem: 'DISK', render: () => {
                    return (
                        <Pane>
                            {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.DISK)}
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'CONNECTIONS', render: () => {
                    return (
                        <Pane>
                            <Tabs selectedIndex={this.state.connectionsTabIndex} className='page_monitoring_tab'>

                                <TabPanel>
                                    {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.ACTIVE_CONNECTION, HARDWARE_TYPE.ACTIVE_CONNECTION)}
                                </TabPanel>
                                <TabPanel>
                                    {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.HANDLED_CONNECTION, HARDWARE_TYPE.HANDLED_CONNECTION)}
                                </TabPanel>
                                <TabPanel>
                                    {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.ACCEPTS_CONNECTION, HARDWARE_TYPE.ACCEPTS_CONNECTION)}
                                </TabPanel>
                            </Tabs>
                        </Pane>
                    )
                }
            },
        ]

        TAB_FOR_CLUSTER = [

            {
                menuItem: 'CPU', render: () => {
                    return (
                        <Pane>
                            {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.CPU)}
                        </Pane>
                    )
                },
            },
            {
                menuItem: 'MEM', render: () => {
                    return (
                        <Pane>
                            {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.MEM)}
                        </Pane>
                    )
                }
            },

            {
                menuItem: 'DISK', render: () => {
                    return (
                        <Pane>
                            {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.DISK)}
                        </Pane>
                    )
                }
            },
        ]


        renderGraphArea(pHardwareType, barChartDataSet, lineChartDataSet) {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*@todo:BarChartCore*/}
                    {/*@todo:BarChartCore*/}
                    {/*@todo:BarChartCore*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of {pHardwareType} on {this.state.loading ?
                                <CircularProgress style={{color: '#77BD25', zIndex: 9999999, fontSize: 7}} size={9}/> : this.state.currentClassification}

                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderBarChartCore(barChartDataSet.chartDataList, barChartDataSet.hardwareType)}
                        </div>
                    </div>
                    {/*2_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                {pHardwareType} Usage of {this.state.loading ?
                                <CircularProgress size={9} style={{fontSize: 9, color: '#77BD25', marginLeft: 5, marginBottom: 1,}}/> : this.state.currentClassification}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderLineChartCore(lineChartDataSet.levelTypeNameList, lineChartDataSet.usageSetList, lineChartDataSet.newDateTimeList, lineChartDataSet.hardwareType)}
                        </div>
                    </div>


                </div>
            )
        }


        renderHeader = () => {

            return (

                <div>
                    <SemanticToastContainer position="center-left"/>
                    <Grid.Row className='content_title'
                              style={{width: 'fit-content', display: 'inline-block'}}>
                        <Grid.Column className='title_align'
                                     style={{lineHeight: '36px'}}>Monitoring</Grid.Column>
                        <div style={{marginLeft: '10px'}}>
                            <button className="ui circular icon button"><i aria-hidden="true"
                                                                           className="info icon"></i></button>
                        </div>
                        {/*todo:---------------------------*/}
                        {/*todo:REFRESH, RESET BUTTON DIV  */}
                        {/*todo:---------------------------*/}
                        <div style={{marginLeft: '10px'}}>
                            <Button
                                onClick={async () => {
                                    if (!this.state.loading) {
                                        this.refreshAllData();
                                    } else {
                                        showToast('Currently loading, you can\'t request again.')
                                    }

                                }}
                                className="ui circular icon button"
                            >
                                <i aria-hidden="true"
                                   className="sync alternate icon"></i>
                            </Button>
                        </div>
                        <div style={{marginLeft: '10px'}}>
                            <Button
                                onClick={async () => {
                                    this.resetAllData();
                                }}
                            >RESET</Button>
                        </div>
                        <div style={{marginLeft: 50, color: 'green', fontWeight: 'bold', fontFamily: 'Righteous'}}>
                            {this.state.userType}
                            [ This is Developer View ]
                        </div>
                        <div style={{marginLeft: 50, color: '#6de1ff', fontWeight: 'bold', fontFamily: 'Encode Sans Condensed'}}>
                            {this.state.selectOrg}
                        </div>
                        {this.state.intervalLoading &&

                        <div style={{marginLeft: 15}}>
                            <div style={{marginLeft: 15}}>
                                <CircularProgress style={{color: 'grey', zIndex: 9999999, fontSize: 10}}
                                                  size={20}/>
                            </div>
                        </div>
                        }

                        {/*   {this.state.dropdownRequestLoading &&

                        <div style={{marginLeft: 15}}>
                            <CircularProgress style={{color: '#77BD25', zIndex: 9999999, fontSize: 10}}
                                              size={20}/>
                        </div>
                        }*/}
                    </Grid.Row>
                </div>
            )
        }


        renderSelectBoxRow() {
            return (
                <div className='page_monitoring_select_row'>
                    <div className='page_monitoring_select_area'>

                        {/*todo:##########################*/}
                        {/*todo:Cluster_Dropdown         */}
                        {/*todo:##########################*/}
                        <div className="page_monitoring_dropdown_box">
                            <div className="page_monitoring_dropdown_label">
                                Cluster | Cloudlet
                            </div>
                            <Dropdown
                                value={this.state.currentCluster}
                                clearable={this.state.clusterSelectBoxClearable}
                                disabled={this.state.loading}
                                placeholder={this.state.clusterSelectBoxPlaceholder}
                                selection
                                loading={this.state.loading}
                                options={this.state.clusterDropdownList}
                                style={StylesForMonitoring.dropDown}
                                onChange={async (e, {value}) => {
                                    this.handleClusterDropdown(value.trim())
                                }}

                            />
                        </div>

                        {/*todo:---------------------------*/}
                        {/*todo: App Instance_Dropdown      */}
                        {/*todo:---------------------------*/}
                        <div className="page_monitoring_dropdown_box">
                            <div className="page_monitoring_dropdown_label">
                                App Inst
                            </div>
                            <Dropdown
                                disabled={this.state.currentCluster === '' || this.state.loading || this.state.appInstDropdown.length === 0}
                                clearable={this.state.appInstSelectBoxClearable}
                                loading={this.state.loading}
                                value={this.state.currentAppInst}
                                placeholder={this.state.appInstSelectBoxPlaceholder}
                                selection
                                options={this.state.appInstDropdown}
                                //style={Styles.dropDown}

                                onChange={async (e, {value}) => {
                                    this.handleAppInstDropdown(value.trim())
                                }}
                            />
                        </div>


                        {/*todo:##########################*/}
                        {/*todo: Time Range Dropdown       */}
                        {/*todo:##########################*/}
                        <div className="page_monitoring_dropdown_box">
                            {/* <div className="page_monitoring_dropdown_label">
                                TimeRange
                            </div>*/}
                            <RangePicker
                                disabled={this.state.loading}
                                //disabled={true}
                                showTime={{format: 'HH:mm'}}
                                format="YYYY-MM-DD HH:mm"
                                placeholder={[moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'), moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm')]}
                                onOk={async (date) => {
                                    let stateTime = date[0].format('YYYY-MM-DD HH:mm')
                                    let endTime = date[1].format('YYYY-MM-DD HH:mm')
                                    await this.setState({
                                        startTime: stateTime,
                                        endTime: endTime,
                                    })
                                    //this.filterUsageListByDate()
                                }}
                                ranges={{
                                    Today: [moment(), moment()],
                                    'Last 7 Days': [moment().subtract(7, 'd'), moment().subtract(1, 'd')],
                                    'Last 30 Days': [moment().subtract(30, 'd'), moment().subtract(1, 'd')],
                                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                                    'Last Month': [moment().date(-30), moment().date(-1)],
                                    'Last 90 Days': [moment().subtract(89, 'd'), moment().subtract(0, 'd')],
                                    'Last 182 Days': [moment().subtract(181, 'd'), moment().subtract(0, 'd')],
                                    'Last 365 Days': [moment().subtract(364, 'd'), moment().subtract(0, 'd')],
                                    'Last 730 Days': [moment().subtract(729, 'd'), moment().subtract(0, 'd')],
                                    'Last 1095 Days': [moment().subtract(1094, 'd'), moment().subtract(0, 'd')],
                                }}
                                style={{width: 300}}
                            />
                        </div>

                    </div>
                </div>

            )
        }


        handleAppInstDropdown = async (pCurrentAppInst) => {
            clearInterval(this.interval)
            await this.setState({
                currentAppInst: pCurrentAppInst,
                loading: true,
            })

            let AppName = pCurrentAppInst.split('|')[0].trim()
            let Cloudlet = pCurrentAppInst.split('|')[1].trim()
            let ClusterInst = pCurrentAppInst.split('|')[2].trim()


            console.log('Instance_Dropdown===>', pCurrentAppInst);

            console.log('Instance_Dropdown=1==>', AppName);
            console.log('Instance_Dropdown=2==>', Cloudlet);
            console.log('Instance_Dropdown=3==>', this.state.appInstanceList);

            let filteredAppList = filterUsageByClassification(this.state.appInstanceList, AppName, 'AppName');
            filteredAppList = filterUsageByClassification(filteredAppList, Cloudlet, 'Cloudlet');
            filteredAppList = filterUsageByClassification(filteredAppList, ClusterInst, 'ClusterInst');
            console.log('Instance_Dropdown==filteredAppList=>', filteredAppList);

            let appInstDropdown = makeSelectBoxListWithThreeValuePipe(filteredAppList, CLASSIFICATION.APPNAME, CLASSIFICATION.CLOUDLET, CLASSIFICATION.CLUSTER_INST)
            await this.setState({
                appInstDropdown,
            })


            let arrDateTime = getOneYearStartEndDatetime();

            let allAppInstUsageList = [];
            await this.setState({dropdownRequestLoading: true})
            try {
                allAppInstUsageList = await getAppLevelUsageList(filteredAppList, "*", RECENT_DATA_LIMIT_COUNT, arrDateTime[0], arrDateTime[1]);
            } catch (e) {
                showToast(e.toString())
            } finally {
                this.setState({dropdownRequestLoading: false})
            }
            // Cluster | AppInst
            let currentCluster = pCurrentAppInst.split("|")[2].trim() + " | " + pCurrentAppInst.split('|')[1].trim()
            pCurrentAppInst = pCurrentAppInst.trim();
            pCurrentAppInst = pCurrentAppInst.split("|")[0].trim() + " | " + pCurrentAppInst.split('|')[1].trim() + " | " + pCurrentAppInst.split('|')[2].trim()

            await this.setState({
                currentClassification: CLASSIFICATION.APPINST,
                allAppInstUsageList: allAppInstUsageList,
                filteredAppInstUsageList: allAppInstUsageList,
                loading: false,
                currentAppInst: pCurrentAppInst,
                currentCluster: currentCluster,
            })

            /*
            this.interval = setInterval(async () => {
                   this.setState({
                       intervalLoading: true,
                   })
                   let arrDateTime2 = getOneYearStartEndDatetime();
                   allAppInstUsageList = await getAppLevelUsageList(filteredAppList, "*", RECENT_DATA_LIMIT_COUNT, arrDateTime2[0], arrDateTime2[1]);

                   console.log('allAppInstUsageList77===>', allAppInstUsageList);

                   this.setState({
                       intervalLoading: false,
                       filteredAppInstUsageList: allAppInstUsageList,
                   })

               }, 1000 * 7)
            */

        }


        async handleClusterDropdown(value) {
            clearInterval(this.interval)

            let selectData = value.split("|")
            let selectedCluster = selectData[0].trim();
            let selectedCloudlet = selectData[1].trim();

            await this.setState({
                currentCluster: value,
                currentClassification: CLASSIFICATION.CLUSTER,
                dropdownRequestLoading: true,
            })


            let allClusterUsageList = this.state.allClusterUsageList;
            await this.setState({
                dropdownRequestLoading: false,
            });

            let allUsageList = allClusterUsageList;
            console.log('allUsageList===>', allUsageList)
            let filteredUsageList = []
            allUsageList.map(item => {
                if (item.cluster === selectedCluster && item.cloudlet === selectedCloudlet) {
                    filteredUsageList.push(item)
                }
                // console.log('Cluster_Dropdown===>', item);
            })

            console.log('filteredUsageList===>', filteredUsageList);
            this.setState({
                filteredClusterUsageList: filteredUsageList,
            })

            let appInstanceList = this.state.appInstanceList;

            let filteredAppInstList = []
            appInstanceList.map((item: TypeAppInstance, index) => {
                if (item.ClusterInst === selectedCluster && item.Cloudlet === selectedCloudlet) {
                    filteredAppInstList.push(item)
                }
            })
            console.log('appInstDropdown===filteredAppInstList>', filteredAppInstList);
            let appInstDropdown = makeSelectBoxListWithThreeValuePipe(filteredAppInstList, CLASSIFICATION.APPNAME, CLASSIFICATION.CLOUDLET, CLASSIFICATION.CLUSTER_INST)
            console.log('appInstDropdown===>', appInstDropdown);
            await this.setState({
                appInstDropdown: appInstDropdown,
                currentAppInst: '',
                appInstSelectBoxPlaceholder: 'Select App Inst',
                filteredAppInstanceList: filteredAppInstList,
                appInstanceListGroupByCloudlet: reducer.groupBy(filteredAppInstList, CLASSIFICATION.CLOUDLET),
            })
        }


        render() {
            // todo: Components showing when the loading of graph data is not completed.
            if (!this.state.isReady) {
                return (
                    <Grid.Row className='view_contents'>
                        <Grid.Column className='contents_body'>
                            {this.renderHeader()}
                            <div style={{position: 'absolute', top: '37%', left: '48%'}}>
                                <div style={{marginLeft: -120, display: 'flex', flexDirection: 'row'}}>
                                    <Lottie
                                        options={{
                                            loop: true,
                                            autoplay: true,
                                            animationData: require('../../../../lotties/loader001'),
                                            rendererSettings: {
                                                preserveAspectRatio: 'xMidYMid slice'
                                            }
                                        }}
                                        height={240}
                                        width={240}
                                        isStopped={false}
                                        isPaused={false}
                                    />
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }


            return (

                <Grid.Row className='view_contents'>
                    {/*todo:---------------------------------*/}
                    {/*todo: POPUP APP INSTACE LIST DIV      */}
                    {/*todo:---------------------------------*/}
                    <Modal
                        closeIcon={true}
                        open={this.state.isModalOpened}
                        closeOnDimmerClick={true}
                        onClose={() => {
                            this.setState({
                                isModalOpened: false,
                            })
                        }}
                        style={{width: '80%'}}
                    >
                        <Modal.Header>Status of Cluster</Modal.Header>
                        {/*<Modal.Content>
                            {this.renderBottomGridAreaForCloudlet()}
                        </Modal.Content>*/}
                    </Modal>
                    <Grid.Column className='contents_body'>
                        {/*todo:---------------------------------*/}
                        {/*todo:Content Header                   */}
                        {/*todo:---------------------------------*/}
                        {this.renderHeader()}
                        <Grid.Row className='site_content_body'>
                            <Grid.Column>
                                <div className="table-no-resized"
                                     style={{height: '100%', display: 'flex', overflow: 'hidden'}}>

                                    <div className="page_monitoring">
                                        {/*todo:---------------------------------*/}
                                        {/*todo:SELECTBOX_ROW        */}
                                        {/*todo:---------------------------------*/}
                                        {this.renderSelectBoxRow()}

                                        <div className='page_monitoring_dashboard'>
                                            {/*_____row____1*/}
                                            {/*_____row____1*/}
                                            {/*_____row____1*/}
                                            <div className='page_monitoring_row'>

                                                <div className='page_monitoring_column' style={{}}>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Launch status of the {this.state.currentClassification}
                                                        </div>
                                                    </div>
                                                    {/*todo:---------------------------------*/}
                                                    {/*@todo: MapboxComponent*/}
                                                    {/*@todo: MapboxComponent*/}
                                                    {/*@todo: MapboxComponent*/}
                                                    {/*todo:---------------------------------*/}
                                                    <div className='page_monitoring_container'>
                                                        <MapboxComponent handleAppInstDropdown={this.handleAppInstDropdown} markerList={this.state.appInstanceListGroupByCloudlet}/>
                                                    </div>
                                                </div>

                                                {/* ___col___2nd*/}
                                                {/* ___col___2nd*/}
                                                {/* ___col___2nd*/}
                                                <div className='page_monitoring_column'>

                                                    {/*fixme:---------------------------------*/}
                                                    {/*fixme: RENDER TAB_AREA                 */}
                                                    {/*fixme:---------------------------------*/}
                                                    {this.state.loading ? renderPlaceHolder3()
                                                        :
                                                        <Tab
                                                            className='page_monitoring_tab'
                                                            menu={{secondary: true, pointing: true}}
                                                            panes={this.state.currentClassification === CLASSIFICATION.CLUSTER ? this.TAB_FOR_CLUSTER : this.TAB_FOR_APP_INST}
                                                            activeIndex={this.state.currentTabIndex}
                                                            onTabChange={(e, {activeIndex}) => {
                                                                this.setState({
                                                                    currentTabIndex: activeIndex,
                                                                })
                                                            }}
                                                            defaultActiveIndex={this.state.currentTabIndex}
                                                        />
                                                    }

                                                </div>
                                            </div>
                                            {/*_____row____2*/}
                                            {/*_____row____2*/}
                                            {/*_____row____2*/}
                                            <div className='page_monitoring_row'>
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title_select'>
                                                            Performance status of Cluster hardware
                                                        </div>
                                                        {/*todo:---------------------------------*/}
                                                        {/*todo: bubbleChart DropDown            */}
                                                        {/*todo:---------------------------------*/}
                                                        <Dropdown
                                                            disabled={this.state.loading}
                                                            clearable={this.state.regionSelectBoxClearable}
                                                            placeholder='SELECT HARDWARE'
                                                            selection
                                                            loading={this.state.loading}
                                                            options={HARDWARE_OPTIONS_FOR_CLUSTER}
                                                            defaultValue={HARDWARE_OPTIONS_FOR_CLUSTER[0].value}
                                                            onChange={async (e, {value}) => {
                                                                try {
                                                                    let bubbleChartData = makeBubbleChartDataForCluster(this.state.allUsageList, value);
                                                                    this.setState({
                                                                        bubbleChartData: bubbleChartData,
                                                                        currentHardwareType: value,
                                                                    })
                                                                } catch (e) {

                                                                }


                                                            }}
                                                            value={this.state.currentHardwareType}
                                                        />
                                                    </div>
                                                    {/*todo:---------------------------------*/}
                                                    {/*todo: RENDER BUBBLE_CHART          */}
                                                    {/*todo:---------------------------------*/}
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderBubbleChartForCloudlet(this, this.state.currentHardwareType, this.state.bubbleChartData)}
                                                    </div>
                                                </div>
                                                {/* row2___col___2*/}
                                                {/* row2___col___2*/}
                                                {/* row2___col___2*/}
                                                <div className='page_monitoring_column'>
                                                    {/*todo:---------------------------------*/}
                                                    {/*todo: NETWORK TAB PANEL AREA           */}
                                                    {/*todo:---------------------------------*/}
                                                    <Tabs selectedIndex={this.state.connectionsTabIndex} className='page_monitoring_tab'>
                                                        <TabPanel>
                                                            {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.RECVBYTES, HARDWARE_TYPE.RECVBYTES)}
                                                        </TabPanel>
                                                        <TabPanel>
                                                            {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.SENDBYTES, HARDWARE_TYPE.SENDBYTES)}
                                                        </TabPanel>
                                                    </Tabs>
                                                </div>


                                            </div>

                                            {/*todo:---------------------------------*/}
                                            {/*todo: BOTTOM GRID TOGGLE UP BUTTON   */}
                                            {/*todo:---------------------------------*/}
                                            <div className='page_monitoring_row'
                                                 onClick={() => {
                                                     this.setState({
                                                         isShowBottomGrid: !this.state.isShowBottomGrid,
                                                     })
                                                 }}
                                            >
                                                <div className='page_monitoring_table_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            SHOW CLUSTER LIST
                                                        </div>
                                                        <div className='page_monitoring_popup_header_button'>
                                                            SHOW CLUSTER LIST
                                                            <div style={{display: 'inline-block', marginLeft: 10}}>
                                                                <FA name="chevron-up"/>
                                                            </div>
                                                        </div>
                                                        <div/>
                                                    </div>
                                                </div>
                                            </div>

                                            {/*todo:---------------------------------*/}
                                            {/*todo: BOTTOM_GRID_AREA_SHOW_UP_AREA   */}
                                            {/*todo:---------------------------------*/}
                                            <ToggleDisplay if={this.state.isShowBottomGrid} tag="section" className='bottomGridArea'>
                                                <OutsideClickHandler
                                                    onOutsideClick={() => {
                                                    }}
                                                >
                                                    <div className='page_monitoring_popup_column'>
                                                        <div className='page_monitoring_popup_header_row'
                                                             onClick={() => {
                                                                 this.setState({
                                                                     isShowBottomGrid: !this.state.isShowBottomGrid,
                                                                 })

                                                             }}
                                                        >
                                                            <div className='page_monitoring_popup_header_title'>
                                                                Status of Cluster
                                                            </div>
                                                            <div className='page_monitoring_popup_header_button'>
                                                                <div>
                                                                    HIDE CLUSTER LIST
                                                                </div>
                                                                <div style={{marginLeft: 10}}>
                                                                    <FA name="chevron-down"/>
                                                                </div>
                                                            </div>
                                                            <div/>
                                                        </div>
                                                        {/*todo:---------------------------------*/}
                                                        {/*todo: BOTTOM APP INSTACE LIST         */}
                                                        {/*todo:---------------------------------*/}
                                                        {/*  <div className='page_monitoring_popup_table'>
                                                            {this.state.cloudletList.length && this.state.isReady === 0 ?
                                                                <div style={Styles.noData}>
                                                                    NO DATA
                                                                </div>
                                                                : this.renderBottomGridAreaForCloudlet()}
                                                        </div>*/}
                                                    </div>
                                                </OutsideClickHandler>
                                            </ToggleDisplay>

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


