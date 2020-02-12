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
import {Button as MButton, CircularProgress} from '@material-ui/core'
import {hot} from "react-hot-loader/root";
import {DatePicker, Progress,} from 'antd';
import {
    convertHwTypePhrases,
    filterUsageByClassification,
    getClusterLevelUsageList,
    getClusterList,
    makeBarChartDataForAppInst,
    makeBarChartDataForCluster,
    makeLineChartDataForAppInst,
    makeLineChartDataForCluster,
    makeSelectBoxListWithKeyValuePipe,
    makeSelectBoxListWithThreeValuePipe,
    renderBubbleChartCoreForDev_Cluster,
    sortUsageListByTypeForCluster,
} from "./PageDevMonitoringService";
import {
    CLASSIFICATION,
    CONNECTIONS_OPTIONS,
    HARDWARE_OPTIONS_FOR_CLUSTER,
    HARDWARE_TYPE,
    NETWORK_OPTIONS,
    NETWORK_TYPE,
    RECENT_DATA_LIMIT_COUNT,
    TCP_OPTIONS,
    UDP_OPTIONS
} from "../../../../shared/Constants";
import Lottie from "react-lottie";
import type {TypeBarChartData, TypeClusterUsageList, TypeGridInstanceList, TypeLineChartData} from "../../../../shared/Types";
import {TypeAppInstance, TypeUtilization} from "../../../../shared/Types";
import moment from "moment";
import ToggleDisplay from 'react-toggle-display';
import '../PageMonitoring.css'
import {
    getOneYearStartEndDatetime,
    makeBubbleChartDataForCluster,
    numberWithCommas,
    renderBarChartCore,
    renderLineChartCore, renderGridLoader2,
    renderPlaceHolderCircular,
    showToast,
    StylesForMonitoring
} from "../PageMonitoringCommonService";
import {getAppInstList, getAppLevelUsageList, getCloudletList} from "../admin/PageAdminMonitoringService";
import * as reducer from "../../../../utils";
import {TabPanel, Tabs} from "react-tabs";
import Icon from "@material-ui/core/Icon";
import LeafletMapWrapperForDev from "./LeafletMapWrapperForDev";
import TerminalViewer from "../../../../container/TerminalViewer";

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
    terminalData: Array,
    openTerminal: Boolean,
    connectionsTabIndex: number,
    tcpTabIndex: number,
    udpTabIndex: number,
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
    clusterListLoading: boolean,
    bubbleChartLoader: boolean,

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
            tcpTabIndex: 0,
            udpTabIndex: 0,

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
            clusterListLoading: true,
            allClusterUsageList003: [],
            isStream: false,
            bubbleChartLoader: false,
        };

        intervalForAppInst = null;


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
            clearInterval(this.intervalForAppInst)
        }


        async loadInitDataForCluster(isInterval: boolean = false) {
            clearInterval(this.intervalForAppInst)
            this.setState({dropdownRequestLoading: true})
            let clusterList = await getClusterList();
            let cloudletList = await getCloudletList()
            let appInstanceList: Array<TypeAppInstance> = await getAppInstList();


            //fixme: fakeData
            //fixme: fakeData
            /*  let clusterList = require('./clusterList')
              let cloudletList = require('./cloudletList')
              let appInstanceList = require('./appInstList')*/

            console.log('appInstanceList====>', appInstanceList);

            console.log('clusterList===>', clusterList);

            let clusterDropdownList = makeSelectBoxListWithKeyValuePipe(clusterList, 'ClusterName', 'Cloudlet')

            //ClusterInst
            let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, CLASSIFICATION.CLOUDLET);

            console.log('appInstanceListGroupByCloudlet===>', appInstanceListGroupByCloudlet);

            await this.setState({
                isReady: true,
                clusterDropdownList: clusterDropdownList,
                dropDownCloudletList: cloudletList,
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
            let allClusterUsageList = []
            try {
                allClusterUsageList = await getClusterLevelUsageList(clusterList, "*", RECENT_DATA_LIMIT_COUNT);
            } catch (e) {

            }


            //fixme: fakeData
            //fixme: fakeData
            //let allClusterUsageList = require('./allClusterUsageList')

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

            //allClusterUsageList = sortUsageListByTypeForCluster(allClusterUsageList, HARDWARE_TYPE.CPU)


            console.log('allClusterUsageList333====>', allClusterUsageList);

            await this.setState({
                clusterListLoading: false,
                allCloudletUsageList: allClusterUsageList,
                allClusterUsageList: allClusterUsageList,
                filteredClusterUsageList: allClusterUsageList,
                maxCpu: maxCpu,
                maxMem: maxMem,
                isRequesting: false,
                currentCluster: '',
            })

        }

        async resetAllDataForDev() {
            clearInterval(this.intervalForAppInst)
            await this.setState({
                currentGridIndex: -1,
                currentTabIndex: 0,
                intervalLoading: false,
                currentClassification: CLASSIFICATION.CLUSTER,
            })

            await this.setState({
                filteredClusterUsageList: this.state.allClusterUsageList,
                filteredAppInstanceList: this.state.appInstanceList,
                appInstanceListGroupByCloudlet: reducer.groupBy(this.state.appInstanceList, CLASSIFICATION.CLOUDLET),
            });
            //todo: reset bubble chart data
            let bubbleChartData = await makeBubbleChartDataForCluster(this.state.allClusterUsageList, HARDWARE_TYPE.CPU);
            await this.setState({
                bubbleChartData: bubbleChartData,
                dropdownRequestLoading: false,
                currentCluster: '',
                currentAppInst: '',
                //currentTabIndex: 1,
            })

            /* setTimeout(() => {
                 this.setState({
                     currentTabIndex: 0,
                 })
             }, 3500)*/
        }

        async refreshAllData() {
            clearInterval(this.intervalForAppInst)
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
            if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                barChartDataSet = makeBarChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
                lineChartDataSet = makeLineChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
            } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                barChartDataSet = makeBarChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
                lineChartDataSet = makeLineChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
            }

            console.log(`barChartDataSet===${hwType}>`, barChartDataSet);
            if (hwType === HARDWARE_TYPE.RECVBYTES
                || hwType === HARDWARE_TYPE.SENDBYTES
                || hwType === HARDWARE_TYPE.ACTIVE_CONNECTION
                || hwType === HARDWARE_TYPE.ACCEPTS_CONNECTION
                || hwType === HARDWARE_TYPE.TCPCONNS
                || hwType === HARDWARE_TYPE.TCPRETRANS
                || hwType === HARDWARE_TYPE.UDPRECV
                || hwType === HARDWARE_TYPE.UDPSENT

            ) {
                return this.renderGraphAreaMulti(subCategoryType, barChartDataSet, lineChartDataSet)
            } else {

                return this.renderGraphArea(hwType, barChartDataSet, lineChartDataSet)
            }
        }


        convertToClassification(pClassfication) {
            if (pClassfication === CLASSIFICATION.APPINST) {
                return "App Instance"
            } else {
                return pClassfication
            }
        }

        renderGraphAreaMultiForAppInst(pHardwareType, barChartDataSet, lineChartDataSet) {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*@todo:LInechart*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title_select'>
                                {convertHwTypePhrases(pHardwareType)} Usage of {this.convertToClassification(this.state.currentClassification)}
                            </div>
                            {!this.state.loading && this.renderDropDownForMultiTab(pHardwareType)}
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : renderLineChartCore(lineChartDataSet.levelTypeNameList, lineChartDataSet.usageSetList, lineChartDataSet.newDateTimeList, lineChartDataSet.hardwareType)}
                        </div>
                    </div>
                </div>
            )
        }


        renderGraphAreaMulti(pHardwareType, barChartDataSet, lineChartDataSet) {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*@todo:LInechart*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title_select'>
                                {convertHwTypePhrases(pHardwareType)} Usage of {this.convertToClassification(this.state.currentClassification)}
                            </div>
                            {!this.state.loading && this.renderDropDownForMultiTab(pHardwareType)}
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : renderLineChartCore(lineChartDataSet.levelTypeNameList, lineChartDataSet.usageSetList, lineChartDataSet.newDateTimeList, lineChartDataSet.hardwareType)}
                        </div>
                    </div>
                    {/*@todo:BarChart*/}
                    {/*@todo:BarChart*/}
                    {/*@todo:BarChart*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Top 5 {convertHwTypePhrases(pHardwareType)} usage of {this.convertToClassification(this.state.currentClassification)}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : renderBarChartCore(barChartDataSet.chartDataList, barChartDataSet.hardwareType)}
                        </div>
                    </div>

                </div>
            )
        }


        renderGraphAreaForAppInst(pHardwareType, barChartDataSet, lineChartDataSet) {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*@todo:LInechart*/}
                    {/*@todo:LInechart*/}
                    {/*@todo:LInechart*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                {convertHwTypePhrases(pHardwareType)} Usage of {this.state.loading ?
                                <CircularProgress size={9} style={{
                                    fontSize: 9,
                                    color: '#77BD25',
                                    marginLeft: 5,
                                    marginBottom: 1,
                                }}/> : this.convertToClassification(this.state.currentClassification)}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : renderLineChartCore(lineChartDataSet.levelTypeNameList, lineChartDataSet.usageSetList, lineChartDataSet.newDateTimeList, lineChartDataSet.hardwareType)}
                        </div>
                    </div>
                </div>
            )
        }


        renderGraphArea(pHardwareType, barChartDataSet, lineChartDataSet) {
            return (
                <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
                    {/*@todo:LInechart*/}
                    {/*@todo:LInechart*/}
                    {/*@todo:LInechart*/}
                    <div className='page_monitoring_dual_container' style={{flex: .5}}>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                {convertHwTypePhrases(pHardwareType)} Usage of {this.state.loading ?
                                <CircularProgress size={9} style={{
                                    fontSize: 9,
                                    color: '#77BD25',
                                    marginLeft: 5,
                                    marginBottom: 1,
                                }}/> : this.convertToClassification(this.state.currentClassification)}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : renderLineChartCore(lineChartDataSet.levelTypeNameList, lineChartDataSet.usageSetList, lineChartDataSet.newDateTimeList, lineChartDataSet.hardwareType)}
                        </div>
                    </div>
                    {/*@todo:BarChart*/}
                    {/*@todo:BarChart*/}
                    {/*@todo:BarChart*/}
                    <div className='page_monitoring_dual_container' style={{flex: .5}}>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Top 5 {convertHwTypePhrases(pHardwareType)} usage of {this.convertToClassification(this.state.currentClassification)}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : renderBarChartCore(barChartDataSet.chartDataList, barChartDataSet.hardwareType, this)}
                        </div>
                    </div>
                </div>
            )
        }


        renderDropDownForMultiTab(cate) {
            if (cate === HARDWARE_TYPE.SENDBYTES || cate === HARDWARE_TYPE.RECVBYTES) {
                return this.renderDropdownForNetwork(cate)
            } else if (cate === HARDWARE_TYPE.TCPCONNS || cate === HARDWARE_TYPE.TCPRETRANS) {
                return this.renderDropdownForTCP(cate)
            } else if (cate === HARDWARE_TYPE.UDPRECV || cate === HARDWARE_TYPE.UDPSENT) {
                return this.renderDropdownForUDP(cate)
            } else if (cate === HARDWARE_TYPE.RECVBYTES || cate === HARDWARE_TYPE.SENDBYTES) {
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


        renderDropdownForTCP(subCategoryType) {
            return (
                <Dropdown
                    placeholder='SELECT TCP TYPE'
                    selection
                    loading={this.state.loading}
                    options={TCP_OPTIONS}
                    defaultValue={TCP_OPTIONS[0].value}
                    onChange={async (e, {value}) => {
                        //TAB0 IS SENDBYTES
                        if (value === HARDWARE_TYPE.TCPCONNS) {
                            this.setState({
                                tcpTabIndex: 0,
                            })
                        } else if (value === HARDWARE_TYPE.TCPRETRANS) {
                            this.setState({
                                tcpTabIndex: 1,
                            })
                        }
                    }}
                    value={subCategoryType}
                    // style={Styles.dropDown}
                />
            )
        }


        renderDropdownForUDP(subCategoryType) {
            return (
                <Dropdown
                    placeholder='SELECT UDP TYPE'
                    selection
                    loading={this.state.loading}
                    options={UDP_OPTIONS}
                    defaultValue={UDP_OPTIONS[0].value}
                    onChange={async (e, {value}) => {
                        //TAB0 IS SENDBYTES
                        if (value === HARDWARE_TYPE.UDPRECV) {
                            this.setState({
                                udpTabIndex: 0,
                            })
                        } else if (value === HARDWARE_TYPE.UDPSENT) {
                            this.setState({
                                udpTabIndex: 1,
                            })
                        }
                    }}
                    value={subCategoryType}
                    // style={Styles.dropDown}
                />
            )
        }


        //@todo:-----------------------
        //@todo:    TAB_FOR_APP_INST
        //@todo:-----------------------`
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


        //@todo:-----------------------
        //@todo:    TAB_FOR_CLUSTER
        //@todo:-----------------------
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
            {
                menuItem: 'TCP', render: () => {
                    return (
                        <Pane>
                            <Tabs selectedIndex={this.state.tcpTabIndex} className='page_monitoring_tab'>

                                <TabPanel>
                                    {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.TCPCONNS, HARDWARE_TYPE.TCPCONNS)}
                                </TabPanel>
                                <TabPanel>
                                    {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.TCPRETRANS, HARDWARE_TYPE.TCPRETRANS)}
                                </TabPanel>

                            </Tabs>
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'UDP', render: () => {
                    return (
                        <Pane>
                            <Tabs selectedIndex={this.state.udpTabIndex} className='page_monitoring_tab'>
                                <TabPanel>
                                    {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.UDPRECV, HARDWARE_TYPE.UDPRECV)}
                                </TabPanel>
                                <TabPanel>
                                    {this.makeChartDataAndRenderTabBody(HARDWARE_TYPE.UDPSENT, HARDWARE_TYPE.UDPSENT)}
                                </TabPanel>

                            </Tabs>
                        </Pane>
                    )
                }
            },

        ]
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
                        <Button
                            onClick={async () => {
                                this.resetAllDataForDev();
                            }}
                        >Reset</Button>

                        {this.state.currentClassification === CLASSIFICATION.APPINST &&
                        <div>
                            <MButton
                                style={{backgroundColor: this.state.isStream ? 'green' : '#6c6c6c', color: 'white', height: 37}}
                                onClick={async () => {
                                    this.setState({
                                        isStream: !this.state.isStream,
                                    }, () => {
                                        if (!this.state.isStream) {
                                            clearInterval(this.intervalForAppInst)
                                        } else {
                                            this.handleAppInstDropdown(this.state.currentAppInst)
                                        }
                                    })
                                }}
                            >STREAM {this.state.isStream ? 'on' : 'off'}</MButton>
                        </div>

                        }
                        {this.state.currentClassification === CLASSIFICATION.APPINST && this.state.terminalData ?
                            <div style={{}}>
                                <MButton
                                    style={{backgroundColor: '#6c6c6c', color: 'white', height: 37}}
                                    onClick={() => this.setState({openTerminal: true})}>Terminal</MButton>
                            </div>
                            : null
                        }
                        {this.state.intervalLoading &&
                        <div>
                            <div style={{marginLeft: 15}}>
                                <CircularProgress style={{color: this.state.currentClassification === CLASSIFICATION.APPINST ? 'grey' : 'green', zIndex: 9999999, fontSize: 10}}
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
                    </div>
                </Grid.Row>
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
                                    'Last 3 Months': [moment().subtract(89, 'd'), moment().subtract(0, 'd')],
                                    'Last 6 Months': [moment().subtract(181, 'd'), moment().subtract(0, 'd')],
                                    'Last 1 Year': [moment().subtract(364, 'd'), moment().subtract(0, 'd')],
                                    'Last 2 Years': [moment().subtract(729, 'd'), moment().subtract(0, 'd')],
                                    'Last 3 Years': [moment().subtract(1094, 'd'), moment().subtract(0, 'd')],
                                }}
                                style={{width: 300}}
                            />
                        </div>

                    </div>
                </div>

            )
        }

        validateTerminal = (appInst) => {
            if (appInst && appInst.length > 0) {
                let runtime = appInst[0].Runtime
                if (runtime && runtime.container_ids && runtime.container_ids.length > 0) {
                    this.setState({
                        terminalData: appInst[0]
                    })
                }
            }
        }


        handleAppInstDropdown = async (pCurrentAppInst) => {
            clearInterval(this.intervalForAppInst)
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
            console.log('Instance_Dropdown=ClusterInst==>', ClusterInst);
            console.log('Instance_Dropdown=3==>', this.state.appInstanceList);


            console.log('Instance_Dropdown==AppName==>', filteredAppList);

            let filteredAppList = filterUsageByClassification(this.state.appInstanceList, Cloudlet, 'Cloudlet');


            filteredAppList = filterUsageByClassification(filteredAppList, ClusterInst, 'ClusterInst');

            console.log('Instance_Dropdown==ClusterInst==>', filteredAppList);

            filteredAppList = filterUsageByClassification(filteredAppList, AppName, 'AppName');

            console.log('Instance_DropdownAppName', filteredAppList);

            //Terminal
            this.setState({
                terminalData: null
            })
            this.validateTerminal(filteredAppList)

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

            console.log('allAppInstUsageList===>', allAppInstUsageList)
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

            await this.setState({
                currentTabIndex: 0,
            })

            if (this.state.isStream) {
                this.setAppInstInterval(filteredAppList)
            } else {
                clearInterval(this.intervalForAppInst)
            }

        }


        setAppInstInterval(filteredAppList) {
            this.intervalForAppInst = setInterval(async () => {
                this.setState({
                    intervalLoading: true,
                })
                let arrDateTime2 = getOneYearStartEndDatetime();

                console.log('allAppInstUsageList77===>startDate', arrDateTime2[0]);
                console.log('allAppInstUsageList77===>EndDate', arrDateTime2[1]);
                let allAppInstUsageList = await getAppLevelUsageList(filteredAppList, "*", RECENT_DATA_LIMIT_COUNT);
                console.log('allAppInstUsageList77===>', allAppInstUsageList);
                this.setState({
                    intervalLoading: false,
                    filteredAppInstUsageList: allAppInstUsageList,
                })
            }, 1000 * 7.0)
        }

        async handleClusterDropdown(value) {
            clearInterval(this.intervalForAppInst)

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
            console.log('allClusterUsageList===>', allClusterUsageList)
            let filteredClusterUsageList = []
            allUsageList.map(item => {
                if (item.cluster === selectedCluster && item.cloudlet === selectedCloudlet) {
                    filteredClusterUsageList.push(item)
                }
                // console.log('Cluster_Dropdown===>', item);
            })

            console.log('filteredUsageList===>', filteredClusterUsageList);
            this.setState({
                filteredClusterUsageList: filteredClusterUsageList,
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

            //todo: reset bubble chart data
            let bubbleChartData = await makeBubbleChartDataForCluster(this.state.filteredClusterUsageList, this.state.currentHardwareType);
            await this.setState({
                bubbleChartData: bubbleChartData,
            })
        }

        renderBottomGridAreaForCluster(pClusterList) {

            //pClusterList
            pClusterList = sortUsageListByTypeForCluster(pClusterList, HARDWARE_TYPE.CPU)

            return (
                <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing styles={{zIndex: 999999999999}}>
                    <Table.Header className="viewListTableHeader" styles={{zIndex: 99999999999}}>
                        <Table.Row>
                            <Table.HeaderCell>
                                index
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                Cluster
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                CPU(%)
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                MEM
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                DISK
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                NETWORK RECV
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                NETWORK SENT
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                TCP CONN
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                TCP RETRANS
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                UDP REV
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                UDP SENT
                            </Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>
                    <Table.Body className="tbBodyList"
                                ref={(div) => {
                                    this.messageList = div;
                                }}
                    >
                        {/*-----------------------*/}
                        {/*todo:ROW HEADER        */}
                        {/*-----------------------*/}
                        {!this.state.isReady &&
                        <Table.Row className='page_monitoring_popup_table_empty'>
                            <Table.Cell>
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
                            </Table.Cell>
                        </Table.Row>}
                        {!this.state.isRequesting && pClusterList.map((item: TypeClusterUsageList, index) => {

                            console.log('pClusterList==item==>', item);

                            return (
                                <Table.Row className='page_monitoring_popup_table_row'>

                                    <Table.Cell>
                                        {index}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.cluster}<br/>[{item.cloudlet}]
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <div>
                                                {item.sumCpuUsage.toFixed(2) + '%'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'} strokeWidth={10} showInfo={false}
                                                          percent={(item.sumCpuUsage / this.state.maxCpu * 100)}
                                                    //percent={(item.sumCpuUsage / this.state.gridInstanceListCpuMax) * 100}
                                                          strokeColor={'#29a1ff'} status={'normal'}/>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <div>
                                                {numberWithCommas(item.sumMemUsage.toFixed(2)) + ' Byte'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'} strokeWidth={10} showInfo={false}
                                                          percent={(item.sumMemUsage / this.state.maxMem * 100)}
                                                          strokeColor={'#29a1ff'} status={'normal'}/>
                                            </div>

                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumDiskUsage.toFixed(2)) + ' Byte'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumRecvBytes.toFixed(2)) + ' Byte'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumSendBytes.toFixed(2)) + ' Byte'}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {numberWithCommas(item.sumTcpConns.toFixed(2)) + ' Byte'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumTcpRetrans.toFixed(2)) + ' Byte'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumUdpRecv.toFixed(2)) + ' Byte'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumUdpSent.toFixed(2)) + ' Byte'}
                                    </Table.Cell>

                                </Table.Row>

                            )
                        })}
                    </Table.Body>
                </Table>
            )
        }

        renderBubbleChartArea() {
            return (
                <div style={{height: '100%'}}>
                    <div className='page_monitoring_title_area' style={{display: 'flex', flexDirection: 'row'}}>
                        <div className='page_monitoring_title_select'>
                            Performance status of Cluster hardware
                        </div>
                        {/*todo:---------------------------------*/}
                        {/*todo: bubbleChart DropDown            */}
                        {/*todo:---------------------------------*/}
                        <div style={{marginRight: 10, marginTop: 1, backgroundColor: 'transparent', display: 'flex', alignSelf: 'center'}}>
                            <MButton
                                style={{backgroundColor: '#6c6c6c', color: 'white', height: 25}}
                                onClick={async () => {

                                    await this.resetAllDataForDev()

                                }}>reset
                            </MButton>
                        </div>
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
                                    let bubbleChartData = makeBubbleChartDataForCluster(this.state.filteredClusterUsageList, value);
                                    this.setState({
                                        bubbleChartData: bubbleChartData,
                                        currentHardwareType: value,
                                    })

                                } catch (e) {
                                    showToast(e.toString())
                                    this.setState({
                                        bubbleChartLoader: false,
                                    })
                                }


                            }}
                            value={this.state.currentHardwareType}
                        />
                    </div>
                    {/*todo:---------------------------------*/}
                    {/*todo: RENDER BUBBLE_CHART          */}
                    {/*todo:---------------------------------*/}
                    <div className='page_monitoring_container'>
                        {this.state.loading ? renderPlaceHolderCircular() : renderBubbleChartCoreForDev_Cluster(this, this.state.currentHardwareType, this.state.bubbleChartData)}
                    </div>
                </div>
            )
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
                                    {renderGridLoader2(150, 150)}
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
                        <SemanticToastContainer position={"top-left"}/>
                        {this.renderHeader()}
                        <Grid.Row className='site_content_body' style={{marginTop: 22}}>
                            <Grid.Column>
                                <div className="table-no-resized">

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
                                                        {/*<MapboxComponent handleAppInstDropdown={this.handleAppInstDropdown} markerList={this.state.appInstanceListGroupByCloudlet}/>*/}

                                                        <LeafletMapWrapperForDev handleAppInstDropdown={this.handleAppInstDropdown} markerList={this.state.appInstanceListGroupByCloudlet}/>
                                                    </div>
                                                </div>

                                                {/* ___col___2nd*/}
                                                {/* ___col___2nd*/}
                                                {/* ___col___2nd*/}
                                                <div className='page_monitoring_column'>

                                                    {/*fixme:---------------------------------*/}
                                                    {/*fixme: RENDER TAB_AREA                 */}
                                                    {/*fixme:---------------------------------*/}
                                                    {this.state.loading ? renderPlaceHolderCircular()
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
                                                    {this.state.bubbleChartLoader ? renderPlaceHolderCircular() : this.renderBubbleChartArea()}
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
                                                    <div className='page_monitoring_popup_column' style={{zIndex: 999999}}>
                                                        <div className='page_monitoring_popup_header_row' style={{zIndex: 999999}}
                                                             onClick={() => {
                                                                 this.setState({
                                                                     isShowBottomGrid: !this.state.isShowBottomGrid,
                                                                 })

                                                             }}
                                                        >
                                                            <div className='page_monitoring_popup_header_title' style={{zIndex: 999999}}>
                                                                Status of Cluster
                                                            </div>
                                                            <div className='page_monitoring_popup_header_button' style={{zIndex: 999999}}>
                                                                <div>
                                                                    HIDE CLUSTER LIST
                                                                </div>
                                                                <div style={{marginLeft: 10}}>
                                                                    <FA name="chevron-down"/>
                                                                </div>
                                                            </div>
                                                            <div/>
                                                        </div>
                                                        {/*fixme:---------------------------------*/}
                                                        {/*fixme: BOTTOM APP INSTACE LIST         */}
                                                        {/*fixme:---------------------------------*/}
                                                        <div className='page_monitoring_popup_table'>
                                                            {this.renderBottomGridAreaForCluster(this.state.filteredClusterUsageList)}
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
                    <Modal open={this.state.openTerminal} dimmer={'inverted'}>
                        <TerminalViewer data={this.state.terminalData} dialog={true} onClose={() => {
                            this.setState({openTerminal: false})
                        }}/>
                    </Modal>
                </Grid.Row>


            );
        }

    }
))))
;


