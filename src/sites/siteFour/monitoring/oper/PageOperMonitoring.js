import 'react-hot-loader'
import {SemanticToastContainer, toast} from 'react-semantic-toasts';
import OutsideClickHandler from 'react-outside-click-handler';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {Button, Dropdown, Grid, Modal, Tab, Table} from 'semantic-ui-react'
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../../../actions';
import {hot} from "react-hot-loader/root";
import {DatePicker,} from 'antd';
import {filterListBykeyForCloudlet, renderBubbleChartForCloudlet,} from "../admin/PageAdminMonitoringService";
import {CLASSIFICATION, HARDWARE_OPTIONS_FOR_CLOUDLET, HARDWARE_TYPE, NETWORK_OPTIONS, NETWORK_TYPE, RECENT_DATA_LIMIT_COUNT, REGIONS_OPTIONS} from "../../../../shared/Constants";
import type {TypeGridInstanceList} from "../../../../shared/Types";
import {TypeAppInstance, TypeUtilization} from "../../../../shared/Types";
import moment from "moment";
import ToggleDisplay from 'react-toggle-display';
import {TabPanel, Tabs} from "react-tabs";
import '../PageMonitoring.css'
import {renderGridLoader2, renderLoaderArea, renderPlaceHolderCircular, showToast, PageMonitoringStyles} from "../PageMonitoringCommonService";
import {Button as MButton, CircularProgress} from "@material-ui/core";
import {
    handleBubbleChartDropDownForCloudlet,
    makeBarChartDataForCloudlet,
    makeLineChartForCloudlet,
    renderBottomGridAreaForCloudlet
} from "./PageOperMonitoringService";
import LeafletMap from "./LeafletMapWrapperForOper";
import {filterUsageByClassification, makeSelectBoxListWithKey, sortByKey} from "../dev/PageDevMonitoringService";

import {
    getAllCloudletEventLogs,
    getCloudletEventLog, getCloudletList, getCloudletLevelUsageList,
} from '../PageMonitoringMetricService'

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
    allUsageList: Array,
    allCpuUsageList: Array,
    allMemUsageList: Array,
    allDiskUsageList: Array,
    allNetworkUsageList: Array,
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
    allCloudletUsageList: Array,
    filteredCloudletUsageList: Array,
    filteredCloudletList: Array,
    cloudletEventLogs: Array,
    cloudletSelectLoading: boolean,
    filteredCloudletEventLogs: Array,
    allCloudletEventLogs: Array,
    eventLogColumn: string,
    direction: string,
}

export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageOperMonitoring extends Component<Props, State> {
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
            allCpuUsageList: [],
            allMemUsageList: [],
            allDiskUsageList: [],
            allNetworkUsageList: [],
            cloudLetSelectBoxPlaceholder: 'Select CloudLet',
            clusterSelectBoxPlaceholder: 'Select Cluster',
            appInstSelectBoxPlaceholder: 'Select Instance',
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
            currentHardwareType: HARDWARE_TYPE.VCPU,
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
            allCloudletUsageList: [],
            filteredCloudletUsageList: [],
            filteredCloudletList: [],
            cloudletSelectLoading: false,
            filteredCloudletEventLogs: [],
            allCloudletEventLogs: [],
            eventLogColumn: null,
            direction: null,
            isNoData: false,
        };

        interval = null;


        constructor(props) {
            super(props);

        }

        componentDidMount = async () => {
            try {

                this.setState({
                    loading: true,
                })
                await this.loadInitDataForCloudlet();
                this.setState({
                    loading: false,
                    isReady: true,
                })


            } catch (e) {
                showToast(e.toString())
            } finally {
                this.setState({
                    isRequesting: false,
                    loading: false,
                    isReady: true,
                })
            }

        }

        componentWillUnmount(): void {
        }


        async loadInitDataForCloudlet() {
            try {
                this.setState({
                    isRequesting: true,
                })

                let cloudletList = [];
                let allCloudletEventLogList = [];
                //fixme : fakedata
                //cloudletList = require('./cloudletList')
                cloudletList = await getCloudletList();

                if (cloudletList.length === 0) {
                    //alert('no data!!!')
                    this.setState({
                        isNoData: true,
                    })
                }

                allCloudletEventLogList = await getAllCloudletEventLogs(cloudletList);
                console.log('cloudletList===>', cloudletList);

                let cloudletListForDropdown = [];
                cloudletList.map(item => {
                    cloudletListForDropdown.push({
                        text: item.CloudletName,
                        value: item.CloudletName + "|" + item.Region,
                    })
                })


                await this.setState({
                    isAppInstaceDataReady: true,
                    allCloudletEventLogs: allCloudletEventLogList,
                    filteredCloudletEventLogs: allCloudletEventLogList,
                    dropdownCloudletList: cloudletListForDropdown,
                }, () => {
                    console.log('dropdownCloudletList===>', this.state.dropdownCloudletList);
                })

                let allCloudletUsageList = await getCloudletLevelUsageList(cloudletList, "*", RECENT_DATA_LIMIT_COUNT);

                console.log("allCloudletUsageList===>", allCloudletUsageList);

                let bubbleChartData = await this.makeBubbleChartDataForCloudlet(allCloudletUsageList);
                await this.setState({
                    bubbleChartData: bubbleChartData,
                })

                let maxCpu = Math.max.apply(Math, allCloudletUsageList.map(function (o) {
                    return o.sumVCpuUsage;
                }));

                let maxMem = Math.max.apply(Math, allCloudletUsageList.map(function (o) {
                    return o.sumMemUsage;
                }));

                await this.setState({
                    allCloudletUsageList: allCloudletUsageList,
                    cloudletList: cloudletList,
                    filteredCloudletUsageList: allCloudletUsageList,
                    filteredCloudletList: cloudletList,
                    maxCpu: maxCpu,
                    maxMem: maxMem,
                    isRequesting: false,
                });
            } catch (e) {
                throw new Error(e)
            }
        }

        async makeBubbleChartDataForCloudlet(usageList: any) {
            let bubbleChartData = []
            usageList.map((item, index) => {
                bubbleChartData.push({
                    index: index,
                    label: item.cloudlet.toString().substring(0, 10) + "...",
                    value: item.avgVCpuMax,
                    favor: item.avgVCpuMax,
                    fullLabel: item.cloudlet.toString(),
                })
            })

            return bubbleChartData;
        }


        renderCpuTabArea() {
            return (
                <div className='page_monitoring_dual_column'>

                    {/*1_column*/}
                    {/*1_column*/}
                    {/*1_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of CPU Count
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : makeBarChartDataForCloudlet(this.state.filteredCloudletUsageList, HARDWARE_TYPE.VCPU)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Transition Of CPU Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : makeLineChartForCloudlet(this, this.state.filteredCloudletUsageList, HARDWARE_TYPE.VCPU)}
                        </div>
                    </div>
                </div>
            )
        }

        renderMemTabArea() {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*1st_column*/}
                    {/*1st_column*/}
                    {/*1st_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of MEM Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : makeBarChartDataForCloudlet(this.state.filteredCloudletUsageList, HARDWARE_TYPE.MEM)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Transition Of MEM Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : makeLineChartForCloudlet(this, this.state.filteredCloudletUsageList, HARDWARE_TYPE.MEM)}
                        </div>
                    </div>

                </div>
            )
        }

        renderDiskTabArea() {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*1_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of DISK Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : makeBarChartDataForCloudlet(this.state.filteredCloudletUsageList, HARDWARE_TYPE.DISK)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Transition Of DISK Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : makeLineChartForCloudlet(this, this.state.filteredCloudletUsageList, HARDWARE_TYPE.DISK)}
                        </div>
                    </div>
                </div>
            )
        }

        renderFloatingIpsTabArea() {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*1_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 Counts of FLOATING IPS
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : makeBarChartDataForCloudlet(this.state.filteredCloudletUsageList, HARDWARE_TYPE.FLOATING_IPS)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Transition Of FLOATING IPS
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : makeLineChartForCloudlet(this, this.state.filteredCloudletUsageList, HARDWARE_TYPE.FLOATING_IPS)}
                        </div>
                    </div>
                </div>
            )
        }

        renderIPV4TabArea() {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*1_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 Counts of IP V4
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : makeBarChartDataForCloudlet(this.state.filteredCloudletUsageList, HARDWARE_TYPE.IPV4)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Transition Of IP V4
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : makeLineChartForCloudlet(this, this.state.filteredCloudletUsageList, HARDWARE_TYPE.IPV4)}
                        </div>
                    </div>
                </div>
            )
        }


        renderNetworkForCloudlet(networkType: string) {
            return (
                <div className='page_monitoring_dual_column'>
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of NETWORK Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular('network') : makeBarChartDataForCloudlet(this.state.allCloudletUsageList, networkType, this)}
                        </div>
                    </div>
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title_select'>
                                Transition Of NETWORK Usage
                            </div>
                            {!this.state.loading &&
                            <Dropdown
                                placeholder='SELECT NET TYPE'
                                selection
                                loading={this.state.loading}
                                options={NETWORK_OPTIONS}
                                defaultValue={NETWORK_OPTIONS[0].value}
                                onChange={async (e, {value}) => {
                                    if (value === NETWORK_TYPE.RECV_BYTES) {
                                        this.setState({
                                            networkTabIndex: 0,
                                        })
                                    } else {
                                        this.setState({
                                            networkTabIndex: 1,
                                        })
                                    }

                                }}
                                value={networkType}
                                // style={Styles.dropDown}
                            />
                            }
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular('network') : makeLineChartForCloudlet(this, this.state.allCloudletUsageList, networkType)}
                        </div>
                    </div>
                </div>
            )
        }

        async handleResetForCloudlet() {
            showToast('reset')
            await this.setState({
                currentRegion: 'ALL',
                currentCloudLet: '',
                filteredCloudletUsageList: this.state.allCloudletUsageList,
                filteredCloudletList: this.state.cloudletList,
                filteredCloudletEventLogs: this.state.allCloudletEventLogs,
                eventLogColumn: null,
            })
        }

        async handleReload_Oper() {
            try {

                await this.setState({
                    placeHolderStateTime: moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'),
                    placeHolderEndTime: moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm'),
                    cloudLetSelectBoxClearable: true,
                    loading: true,
                    cloudletSelectLoading: true,
                })
                await this.loadInitDataForCloudlet();
                await this.setState({
                    loading: false,
                    currentRegion: 'ALL',
                    currentCloudLet: '',
                    currentCluster: '',
                    currentAppInst: '',
                    cloudletSelectLoading: false,
                    eventLogColumn: null,
                })

            } catch (e) {

            } finally {
                toast({
                    type: 'success',
                    //icon: 'smile',
                    title: 'REFRESH ALL DATA',
                    animation: 'bounce',
                    time: 1 * 1000,
                    color: 'black',
                });
            }
        }


        renderHeader = () => {

            return (

                <Grid.Row className='content_title'>
                    <div className='content_title_wrap'>
                        <div className='content_title_label'>Monitoring</div>
                        {/*todo:---------------------------*/}
                        {/*todo:REFRESH, RESET BUTTON DIV  */}
                        {/*todo:---------------------------*/}
                        <Button
                            onClick={async () => {
                                if (!this.state.loading) {
                                    this.handleReload_Oper();
                                } else {
                                    showToast('Currently loading, you can\'t request again.')
                                }
                            }}
                            className="ui circular icon button"
                        >
                            <i aria-hidden="true"
                               className="sync alternate icon"></i>
                        </Button>

                        <Button
                            onClick={async () => {
                                this.handleResetForCloudlet()
                                //await this.filterByEachTypes('ALL', '', '', '')
                            }}
                        >RESET</Button>

                        <div>
                            {this.state.userType}
                        </div>
                        {/*<div style={{color: 'yellow'}}>
                            [OPER_VIEW]
                        </div>*/}
                        {this.state.intervalLoading &&
                        <div>
                            <CircularProgress size={9} style={{fontSize: 9}}/>
                        </div>
                        }
                    </div>
                </Grid.Row>
            )
        }

        handleSelectRegion = (selectedRegion) => {
            //showToast(selectedRegion)

            this.setState({
                currentRegion: selectedRegion,
            }, async () => {
                let filteredCloudletList = filterUsageByClassification(this.state.cloudletList, selectedRegion, CLASSIFICATION.REGION)
                let filteredCloudletUsageList = filterUsageByClassification(this.state.allCloudletUsageList, selectedRegion, CLASSIFICATION.REGION)
                let dropdownCloudletList = makeSelectBoxListWithKey(filteredCloudletList, "CloudletName")
                console.log('dropdownCloudletList===>', dropdownCloudletList);
                await this.setState({
                    cloudLetSelectBoxPlaceholder: 'Select cloudlet',
                    filteredCloudletList: filteredCloudletList,
                    filteredCloudletUsageList: filteredCloudletUsageList,
                    dropdownCloudletList: dropdownCloudletList
                })

            })

        }


        handleSelectCloudlet = async (cloudletSelectedOne, isDropdownAction = false) => {
            try {
                let selectedCloudlet = cloudletSelectedOne.toString().split("|")[0];
                let selectedRegion = cloudletSelectedOne.toString().split("|")[1];
                this.setState({
                    cloudletSelectLoading: true,
                    loading: true,
                    currentCloudLet: cloudletSelectedOne,
                })

                let cloudletEventLogs = []
                try {
                    cloudletEventLogs = await getCloudletEventLog(selectedCloudlet, selectedRegion);
                } catch (e) {
                    showToast(e.toString())
                }


                let filteredCloudletUsageList = filterUsageByClassification(this.state.allCloudletUsageList, selectedCloudlet.toString().trim(), CLASSIFICATION.cloudlet)
                await this.setState({
                    // filteredCloudletList: filteredCloudletList,
                    cloudletSelectLoading: false,
                    filteredCloudletUsageList: filteredCloudletUsageList,
                    filteredCloudletEventLogs: cloudletEventLogs === undefined ? [] : cloudletEventLogs,
                    isReady: true,

                })

                if (isDropdownAction) {
                    let filteredCloudletList = filterListBykeyForCloudlet('CloudletName', selectedCloudlet, this.state.cloudletList)
                    await this.setState({
                        filteredCloudletList: filteredCloudletList,
                    })
                }
                await this.setState({
                    loading: false,
                })
            } catch (e) {

            } finally {
                await this.setState({
                    loading: false,
                    isReady: true,
                })
            }

        }


        renderDropdownAreaOper() {

            return (
                <div className='page_monitoring_select_row'>
                    <div className='page_monitoring_select_area'>

                        {/*todo:---------------------------*/}
                        {/*todo:REGION Dropdown           */}
                        {/*todo:---------------------------*/}
                        <div className="page_monitoring_dropdown_box">
                            <div className="page_monitoring_dropdown_label">
                                Region
                            </div>
                            <Dropdown
                                disabled={this.state.loading}
                                clearable={this.state.regionSelectBoxClearable}
                                placeholder='REGION'
                                selection
                                loading={this.state.loading}
                                options={REGIONS_OPTIONS}
                                defaultValue={REGIONS_OPTIONS[0].value}
                                onChange={async (e, {value}) => {

                                    await this.setState({
                                        currentRegion: value,
                                    })


                                    await this.handleSelectRegion(value)


                                }}
                                value={this.state.currentRegion}
                                // style={Styles.dropDown}
                            />

                        </div>

                        {/*todo:##########################*/}
                        {/*todo:CloudLet Dropdown         */}
                        {/*todo:##########################*/}
                        <div className="page_monitoring_dropdown_box">
                            <div className="page_monitoring_dropdown_label">
                                CloudLet
                            </div>
                            <Dropdown
                                disabled={this.state.loading}
                                value={this.state.currentCloudLet}
                                clearable={this.state.cloudLetSelectBoxClearable}
                                loading={this.state.loading}
                                placeholder={this.state.cloudLetSelectBoxPlaceholder}
                                selection={true}
                                options={this.state.dropdownCloudletList}
                                // style={Styles.dropDown}
                                onChange={async (e, {value}) => {
                                    this.setState({
                                        currentCloudLet: value,
                                    }, () => {
                                        try {
                                            this.handleSelectCloudlet(value, true)

                                        } catch (e) {
                                            showToast(e.toString())
                                        }

                                    })
                                    /*   await this.filterByEachTypes(this.state.currentRegion, value)
                                       setTimeout(() => {
                                           this.setState({
                                               clusterSelectBoxPlaceholder: 'Select Cluster'
                                           })
                                       }, 1000)*/
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


        //@todo:-----------------------
        //@todo:    CPU,MEM,DISK TAB
        //@todo:-----------------------
        CPU_MEM_DISK_CONN_TABS = [

            {
                menuItem: 'vCPU', render: () => {
                    return (
                        <Pane>
                            {this.renderCpuTabArea()}
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'MEM', render: () => {
                    return (
                        <Pane>
                            {this.renderMemTabArea()}
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'DISK', render: () => {
                    return (
                        <Pane>
                            {this.renderDiskTabArea()}
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'FLOATING IPS', render: () => {
                    return (
                        <Pane>
                            {this.renderFloatingIpsTabArea()}
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'IPV4', render: () => {
                    return (
                        <Pane>
                            {this.renderIPV4TabArea()}
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'NETWORK', render: () => {
                    return (
                        <Pane>
                            <Tabs selectedIndex={this.state.networkTabIndex}
                                  className='page_monitoring_tab'>
                                <TabPanel>
                                    {this.renderNetworkForCloudlet(HARDWARE_TYPE.RECVBYTES)}
                                </TabPanel>
                                <TabPanel>
                                    {this.renderNetworkForCloudlet(HARDWARE_TYPE.SENDBYTES)}
                                </TabPanel>
                            </Tabs>
                        </Pane>
                    )
                }
            },

        ]

        renderLeafletMap() {
            return (
                <LeafletMap cloudletList={this.state.filteredCloudletList} loading={this.state.loading} handleSelectCloudlet={this.handleSelectCloudlet}/>
            )
        }

        handleSortForEventLogTable = (clickedColumn) => () => {

            if (this.state.eventLogColumn !== clickedColumn) {
                let filteredCloudletEventLogs = sortByKey(this.state.filteredCloudletEventLogs)
                this.setState({
                    eventLogColumn: clickedColumn,
                    filteredCloudletEventLogs: filteredCloudletEventLogs,
                    direction: 'ascending',
                })
            } else {
                this.setState({
                    filteredCloudletEventLogs: this.state.filteredCloudletEventLogs.reverse(),
                    direction: this.state.direction === 'ascending' ? 'descending' : 'ascending',
                })
            }
        }

        renderCloudletEventLogTable() {
            return (
                <div className='page_monitoring_column'>
                    <div className='page_monitoring_title_area'>
                        <div className='page_monitoring_title_select'>
                            Cloudlet Event Log
                        </div>
                        <Table className="viewListTable" basic='very' sortable celled fixed>
                            <Table.Header className="viewListTableHeader">
                                <Table.Row>
                                    <Table.HeaderCell
                                        sorted={this.state.eventLogColumn === 'Time' ? this.state.direction : null}
                                        onClick={this.handleSortForEventLogTable('Time')}
                                    >
                                        Time
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={this.state.eventLogColumn === 'Cloudlet' ? this.state.direction : null}
                                        onClick={this.handleSortForEventLogTable('Cloudlet')}
                                    >
                                        Cloudlet
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={this.state.eventLogColumn === 'Event' ? this.state.direction : null}
                                        onClick={this.handleSortForEventLogTable('Event')}
                                    >
                                        Event
                                    </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={this.state.eventLogColumn === 'Status' ? this.state.direction : null}
                                        onClick={this.handleSortForEventLogTable('Status')}
                                    >
                                        Status
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body className="">
                                {/*todo: 데이터가 없는경우*/}
                                {!this.state.cloudletSelectLoading && this.state.filteredCloudletEventLogs.length === 0 &&
                                <Table.Row className='' style={{backgroundColor: 'transparent', height: '25'}}>
                                    <Table.Cell style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}>
                                        <div style={{minHeight: 360, fontSize: 30, fontFamily: 'Encode Sans Condensed'}}>
                                            NO DATA
                                        </div>
                                    </Table.Cell>

                                </Table.Row>
                                }
                                {this.state.cloudletSelectLoading &&
                                <div style={PageMonitoringStyles.center2}>
                                    <CircularProgress style={{color: '#1cecff', marginTop: -70,}}/>
                                </div>
                                }
                                {!this.state.cloudletSelectLoading && this.state.filteredCloudletEventLogs.map(item => {
                                    return (
                                        <Table.Row className='page_monitoring_popup_table_row'>

                                            <Table.Cell>
                                                {item[0].split("T")[0]}{`  `}
                                                {item[0].split("T")[1].toString().substring(0, 8)}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {item[1]}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {item[3]}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {item[4]}
                                            </Table.Cell>

                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            )
        }


        render() {
            // todo: Components showing when the loading of graph data is not completed.
            if (!this.state.isAppInstaceDataReady) {
                return (
                    renderLoaderArea(this)
                )
            }

            if (this.state.isNoData) {
                return (
                    <Grid.Row className='view_contents'>
                        <Grid.Column className='contents_body'>
                            {this.renderHeader()}
                            <div style={{position: 'absolute', top: '37%', left: '48%'}}>
                                <div style={{marginLeft: -450, display: 'flex', flexDirection: 'row', fontSize: 30, opacity: 1, color: 'white'}}>
                                    No data to express ( There is no cloudlet you can access )
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
                        <Modal.Header>Status of App Instance</Modal.Header>
                        <Modal.Content>
                            {renderBottomGridAreaForCloudlet(this)}
                        </Modal.Content>
                    </Modal>
                    <SemanticToastContainer position={"top-right"}/>
                    <Grid.Column className='contents_body'>
                        {/*todo:---------------------------------*/}
                        {/*todo:Content Header                   */}
                        {/*todo:---------------------------------*/}
                        {this.renderHeader()}
                        <Grid.Row className='site_content_body'>
                            <Grid.Column>
                                <div className="table-no-resized">

                                    <div className="page_monitoring">
                                        {/*todo:---------------------------------*/}
                                        {/*todo:SELECTBOX_ROW        */}
                                        {/*todo:---------------------------------*/}
                                        {this.renderDropdownAreaOper()}

                                        <div className='page_monitoring_dashboard'>
                                            {/*_____row____1*/}
                                            {/*_____row____1*/}
                                            {/*_____row____1*/}
                                            <div className='page_monitoring_row'>
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                <div className='page_monitoring_column' style={{}}>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Status of Launched Cloudlet
                                                        </div>
                                                    </div>
                                                    {/*todo:---------------------------------*/}
                                                    {/*todo:MAP*/}
                                                    {/*todo:MAP*/}
                                                    {/*todo:MAP*/}
                                                    {/*todo:MAP*/}
                                                    {/*todo:MAP*/}
                                                    {/*todo:---------------------------------*/}
                                                    <div className='leafMapDiv'>
                                                        {/* <MiniMap loading={this.state.loading} cloudletList={this.state.cloudletList}/>*/}
                                                        {this.renderLeafletMap()}
                                                    </div>
                                                </div>

                                                {/* ___col___2nd*/}
                                                {/* ___col___2nd*/}
                                                {/* ___col___2nd*/}
                                                <div className='page_monitoring_column'>

                                                    {/*todo:---------------------------------*/}
                                                    {/*todo: RENDER TAB_AREA                 */}
                                                    {/*todo:---------------------------------*/}
                                                    <Tab
                                                        className='page_monitoring_tab'
                                                        menu={{secondary: true, pointing: true}}
                                                        panes={this.CPU_MEM_DISK_CONN_TABS}
                                                        activeIndex={this.state.currentTabIndex}
                                                        onTabChange={(e, {activeIndex}) => {
                                                            this.setState({
                                                                currentTabIndex: activeIndex,
                                                            })
                                                        }}
                                                        defaultActiveIndex={this.state.currentTabIndex}
                                                    />
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
                                                            Performance State Of Cloudlet
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
                                                            options={HARDWARE_OPTIONS_FOR_CLOUDLET}
                                                            defaultValue={HARDWARE_OPTIONS_FOR_CLOUDLET[0].value}
                                                            onChange={async (e, {value}) => {
                                                                await handleBubbleChartDropDownForCloudlet(value, this);
                                                                this.setState({
                                                                    currentHardwareType: value
                                                                })

                                                            }}
                                                            value={this.state.currentHardwareType}
                                                        />
                                                    </div>
                                                    {/*todo:---------------------------------*/}
                                                    {/*todo: RENDER BUBBLE          */}
                                                    {/*todo:---------------------------------*/}
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolderCircular() : renderBubbleChartForCloudlet(this, this.state.currentHardwareType, this.state.bubbleChartData)}
                                                    </div>
                                                </div>
                                                {/*todo: renderCloudletEventLog*/}
                                                {/*todo: renderCloudletEventLog*/}
                                                {/*todo: renderCloudletEventLog*/}
                                                {this.renderCloudletEventLogTable()}


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
                                                            SHOW CLOUDLET LIST
                                                        </div>
                                                        <div className='page_monitoring_popup_header_button'>
                                                            SHOW CLOUDLET LIST
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
                                                        /*  this.setState({
                                                              isShowBottomGrid: !this.state.isShowBottomGrid,
                                                          })*/
                                                    }}
                                                >
                                                    <div className='page_monitoring_popup_column' style={{zIndex: 999999}}>
                                                        <div className='page_monitoring_popup_header_row' style={{zIndex: 999999}}
                                                             onClick={() => {
                                                                 this.setState({
                                                                     isShowBottomGrid: !this.state.isShowBottomGrid,
                                                                 })

                                                             }}
                                                        >
                                                            <div className='page_monitoring_popup_header_title' style={{zIndex: 999999}}>
                                                                Status of App
                                                            </div>
                                                            <div className='page_monitoring_popup_header_button' style={{zIndex: 999999}}>
                                                                <div>
                                                                    HIDE CLOUDLET LIST
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
                                                        <div className='page_monitoring_popup_table' style={{zIndex: 999999}}>
                                                            {this.state.cloudletList.length && this.state.isReady === 0 ?
                                                                <div style={PageMonitoringStyles.noData}>
                                                                    NO DATA
                                                                </div>
                                                                : renderBottomGridAreaForCloudlet(this)}
                                                        </div>
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

