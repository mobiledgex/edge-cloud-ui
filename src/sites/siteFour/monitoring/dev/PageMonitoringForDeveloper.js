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
    getClusterLevelUsageList,
    getClusterList,
    makeSelectBoxListForClusterList, makeSelectBoxListWithKeyValuePipe,
    renderBarGraphForCluster,
    renderBubbleChartForCloudlet,
    renderLineChartForCluster,
} from "./PageMonitoringServiceForDeveloper";
import {
    CLASSIFICATION,
    HARDWARE_OPTIONS_FOR_CLUSTER,
    HARDWARE_TYPE,
    INSTANCE_TEST_OPTIONS,
    NETWORK_OPTIONS,
    NETWORK_TYPE,
    RECENT_DATA_LIMIT_COUNT,
    REGIONS_OPTIONS
} from "../../../../shared/Constants";
import Lottie from "react-lottie";
import type {TypeGridInstanceList} from "../../../../shared/Types";
import {TypeAppInstance, TypeUtilization} from "../../../../shared/Types";
import moment from "moment";
import ToggleDisplay from 'react-toggle-display';
import {TabPanel, Tabs} from "react-tabs";
import '../PageMonitoring.css'
import {makeBubbleChartDataForCluster, renderPlaceHolder, showToast} from "../PageMonitoringCommonService";
import {CircularProgress} from "@material-ui/core";
import {getCloudletList, getAppInstList, StylesForMonitoring} from "../admin/PageMonitoringServiceForAdmin";
import MiniMapComponent2 from "./MiniMapComponent2____.jsskadjfksdjfkj";
import MapboxComponent from "./MapboxComponent";
import * as reducer from "../../../../utils";

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
    currentLevelType: string,
    filteredUsageList: Array,
    cloudletList: Array,
    filteredAppInstanceList: Array,
    appInstDropdown: Array,
    appInstLoading: boolean,
    cloudletKeys: Array,

}


export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageMonitoringForDeveloper extends Component<Props, State> {
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
            currentLevelType: 'Cluster',
            filteredUsageList: [],
            selectOrg: '',
            filteredAppInstanceList: [],
            appInstDropdown: [],
            appInstLoading: false,
            cloudletKeys: [],
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

            this.interval = setInterval(async () => {
                this.setState({
                    intervalLoading: true,
                })
                await this.loadInitDataForCluster();
                this.setState({
                    intervalLoading: false,
                })

            }, 1000 * 15)
        }

        componentWillUnmount(): void {
            clearInterval(this.interval)
        }

        async loadInitDataForCluster() {

            let clusterList = await getClusterList();
            let cloudletList = await getCloudletList()

            this.setState({appInstLoading: true})
            let appInstanceList: Array<TypeAppInstance> = await getAppInstList();

            console.log('clusterList===>', clusterList);
            console.log('appInstanceList===>', appInstanceList);

            let clusterDropdownList = makeSelectBoxListWithKeyValuePipe(clusterList, 'ClusterName', 'Cloudlet')

            let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, CLASSIFICATION.CLOUDLET);

            await this.setState({
                isReady: true,
                clusterDropdownList: clusterDropdownList,
                cloudletList: cloudletList,
                clusterList: clusterList,
                isAppInstaceDataReady: true,
                appInstanceList: appInstanceList,
                filteredAppInstanceList: appInstanceList,
                appInstLoading: false,
                appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
            });
            /*  cloudletKeys.map(key=>{
                  let listOne=groupedDatas[key];

                  listOne.map((item, index)=>{
                  })
                  console.log('listOne.length===>', listOne.length);

              })*/


            let allUsageList = await getClusterLevelUsageList(clusterList, "*", RECENT_DATA_LIMIT_COUNT);
            await this.setState({
                allUsageList: allUsageList,
            });
            console.log('filteredAppInstanceList===>', appInstanceList)

            let bubbleChartData = await makeBubbleChartDataForCluster(allUsageList, HARDWARE_TYPE.CPU);
            await this.setState({
                bubbleChartData: bubbleChartData,
            })

            let maxCpu = Math.max.apply(Math, allUsageList.map(function (o) {
                return o.sumCpuUsage;
            }));

            let maxMem = Math.max.apply(Math, allUsageList.map(function (o) {
                return o.sumMemUsage;
            }));

            await this.setState({
                allUsageList: allUsageList,
                filteredUsageList: allUsageList,
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
            })

            await this.setState({
                filteredUsageList: this.state.allUsageList,
                filteredAppInstanceList: this.state.appInstanceList,
                appInstanceListGroupByCloudlet: reducer.groupBy(this.state.appInstanceList, CLASSIFICATION.CLOUDLET),
            })
            this.setState({
                appInstLoading: false,
                currentCluster: '',
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
                placeHolderStateTime: moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'),
                placeHolderEndTime: moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm'),
            })
            await this.setState({
                cloudLetSelectBoxClearable: true,
            })
            await this.setState({
                loading: true,
                appInstLoading: true
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

        renderCpuTabArea() {
            return (
                <div className='page_monitoring_dual_column'>

                    {/*1_column*/}
                    {/*1_column*/}
                    {/*1_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of CPU Usage on {this.state.currentLevelType}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderBarGraphForCluster(this.state.filteredUsageList, HARDWARE_TYPE.CPU, this)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                CPU Usage of {this.state.currentLevelType}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderLineChartForCluster(this, this.state.filteredUsageList, HARDWARE_TYPE.CPU)}
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
                                TOP5 of MEM Usage on {this.state.currentLevelType}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderBarGraphForCluster(this.state.filteredUsageList, HARDWARE_TYPE.MEM, this)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                MEM Usage of {this.state.currentLevelType}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderLineChartForCluster(this, this.state.filteredUsageList, HARDWARE_TYPE.MEM)}
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
                                TOP5 of DISK Usage on {this.state.currentLevelType}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderBarGraphForCluster(this.state.filteredUsageList, HARDWARE_TYPE.DISK, this)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                DISK Usage of {this.state.currentLevelType}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderLineChartForCluster(this, this.state.filteredUsageList, HARDWARE_TYPE.DISK)}
                        </div>
                    </div>
                </div>
            )
        }

        renderTcpTab() {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*1_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of TCP on {this.state.currentLevelType}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderBarGraphForCluster(this.state.filteredUsageList, HARDWARE_TYPE.TCPCONNS, this)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TCP of on {this.state.currentLevelType}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderLineChartForCluster(this, this.state.filteredUsageList, HARDWARE_TYPE.TCPCONNS)}
                        </div>
                    </div>
                </div>
            )
        }

        renderUdpTab() {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*1_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of UDP on {this.state.currentLevelType}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderBarGraphForCluster(this.state.filteredUsageList, HARDWARE_TYPE.UDPSENT, this)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                UDP of {this.state.currentLevelType}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderLineChartForCluster(this, this.state.filteredUsageList, HARDWARE_TYPE.UDPSENT)}
                        </div>
                    </div>
                </div>
            )
        }


        renderNetworkAreaForCluster(networkType: string) {

            return (
                <div className='page_monitoring_dual_column'>
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of NETWORK Usage on {this.state.currentLevelType}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder('network') : renderBarGraphForCluster(this.state.filteredUsageList, networkType, this)}
                        </div>
                    </div>
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title_select'>
                                NETWORK Usage of {this.state.currentLevelType}
                            </div>
                            {!this.state.loading &&
                            <Dropdown
                                placeholder='SELECT NET TYPE'
                                selection
                                loading={this.state.loading}
                                options={NETWORK_OPTIONS}
                                defaultValue={NETWORK_OPTIONS[0].value}
                                onChange={async (e, {value}) => {
                                    //TAB0 IS SENDBYTES
                                    if (value === HARDWARE_TYPE.RECV_BYTES) {
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
                            {this.state.loading ? renderPlaceHolder('network') : renderLineChartForCluster(this, this.state.filteredUsageList, networkType, this)}
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
                            <Lottie
                                options={{
                                    loop: true,
                                    autoplay: true,
                                    animationData: require('../../../../lotties/loader003'),
                                    rendererSettings: {
                                        preserveAspectRatio: 'xMidYMid slice'
                                    }
                                }}
                                height={35}
                                width={35}
                                isStopped={false}
                                isPaused={false}
                            />
                        </div>
                        }
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


                                    let selectData = value.split("|")
                                    let selectedCluster = selectData[0].trim();
                                    let selectedCloudlet = selectData[1].trim();

                                    await this.setState({
                                        currentCluster: value,
                                    })

                                    let allUsageList = this.state.allUsageList

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
                                        filteredUsageList: filteredUsageList,
                                    })


                                    let appInstanceList = this.state.appInstanceList;

                                    let filteredAppInstList = []
                                    appInstanceList.map((item: TypeAppInstance, index) => {
                                        if (item.ClusterInst === selectedCluster && item.Cloudlet === selectedCloudlet) {
                                            filteredAppInstList.push(item)
                                        }
                                    })

                                    console.log('filteredAppInstList===>', filteredAppInstList);
                                    let appInstDropdown = makeSelectBoxListWithKeyValuePipe(filteredAppInstList, 'AppName', CLASSIFICATION.CLOUDLET)


                                    await this.setState({
                                        appInstDropdown: appInstDropdown,
                                        currentAppInst: '',
                                        appInstSelectBoxPlaceholder: 'Select App Inst',
                                        filteredAppInstanceList: filteredAppInstList,
                                        appInstanceListGroupByCloudlet: reducer.groupBy(filteredAppInstList, CLASSIFICATION.CLOUDLET),
                                    })


                                }}
                            />
                        </div>

                        {/*todo:---------------------------*/}
                        {/*todo: App Instance Dropdown      */}
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

                                    this.setState({
                                        currentAppInst: value,
                                    })

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
        CPU_MEM_DISK_ETCS_TABS = [

            {
                menuItem: 'CPU', render: () => {
                    return (
                        <Pane>
                            {this.renderCpuTabArea()}
                        </Pane>
                    )
                },
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
                menuItem: 'TCP', render: () => {
                    return (
                        <Pane>
                            {this.renderTcpTab()}
                        </Pane>
                    )
                }
            },
            /*


             {
                 menuItem: 'UDP', render: () => {
                     return (
                         <Pane>
                             {this.renderUdpTab()}
                         </Pane>
                     )
                 }
             },
 */
        ]

        filterOnCluster(pCluster) {


            console.log('filterOnCluster===>', this.state.allUsageList);

            console.log('filterOnCluster===>', pCluster);


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
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                <div className='page_monitoring_column' style={{}}>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Launch status of the {this.state.currentLevelType}
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        <MapboxComponent appInstLoading={this.state.appInstLoading} markerList={this.state.appInstanceListGroupByCloudlet}/>
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
                                                        panes={this.CPU_MEM_DISK_ETCS_TABS}
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
                                                            Performance status of {this.state.currentLevelType} hardware
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
                                                    <Tabs selectedIndex={this.state.networkTabIndex}
                                                          className='page_monitoring_tab'>
                                                        <TabPanel>
                                                            {this.renderNetworkAreaForCluster(HARDWARE_TYPE.RECV_BYTES)}
                                                        </TabPanel>
                                                        <TabPanel>
                                                            {this.renderNetworkAreaForCluster(HARDWARE_TYPE.SEND_BYTES)}
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


