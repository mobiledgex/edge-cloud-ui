import 'react-hot-loader'
import {SemanticToastContainer, toast} from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {Button, Dropdown, Grid, Modal, Tab} from 'semantic-ui-react'
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../../../actions';
import {Button as MButton, CircularProgress} from '@material-ui/core'
import {hot} from "react-hot-loader/root";
import {DatePicker,} from 'antd';
import {
    convertHwTypePhrases,
    filterUsageByClassification,
    getClusterLevelUsageList,
    getClusterList,
    handleHardwareTabChanges,
    makeBarChartDataForAppInst,
    makeBarChartDataForCluster,
    makeLineChartDataForAppInst_2222222,
    makeLineChartDataForCluster,
    makeSelectBoxListWithKeyValuePipe,
    makeSelectBoxListWithThreeValuePipe,
    renderBottomGridAreaForCluster,
    renderBubbleChartCoreForDev_Cluster, renderLineChartCoreForDev_AppInst,
    renderLineChartCoreForDev_Cluster,
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
import type {TypeBarChartData, TypeGridInstanceList, TypeLineChartData} from "../../../../shared/Types";
import {TypeAppInstance, TypeUtilization} from "../../../../shared/Types";
import moment from "moment";
import '../PageMonitoring.css'

import {
    getOneYearStartEndDatetime,
    makeBubbleChartDataForCluster,
    renderBarChartCore,
    renderGridLoader2, renderLoaderArea,
    renderPlaceHolderCircular,
    showToast,
    PageMonitoringStyles, noDataArea, isEmpty
} from "../PageMonitoringCommonService";
import {getAppInstList, getAppLevelUsageList, getCloudletList} from "../PageMonitoringMetricService";
import * as reducer from "../../../../utils";
import {TabPanel, Tabs} from "react-tabs";
import TerminalViewer from "../../../../container/TerminalViewer";
import ModalGraphForCluster from "./ModalGraphForCluster";
import GridLayout from "react-grid-layout";
import {reactLocalStorage} from "reactjs-localstorage";
import LeafletMapWrapperForDev from "./LeafletMapWrapperForDev";

const FA = require('react-fontawesome')
const {RangePicker} = DatePicker;
const {Column, Row} = Grid;
const {Pane} = Tab

const defaultLayout = [
    {i: 'a', x: 0, y: 0, w: 1, h: 3},
    {i: 'b', x: 1, y: 0, w: 1, h: 3},
    {i: 'c', x: 2, y: 0, w: 1, h: 3},

    {i: 'd', x: 0, y: 1, w: 1, h: 3,},
    {i: 'e', x: 1, y: 1, w: 1, h: 3,},
    {i: 'f', x: 2, y: 1, w: 1, h: 3,},

    {i: 'g', x: 0, y: 2, w: 1, h: 3,},
    {i: 'h', x: 1, y: 2, w: 1, h: 3,},
    {i: 'i', x: 2, y: 2, w: 1, h: 3,},

    {i: 'j', x: 0, y: 3, w: 1, h: 3,},
    {i: 'k', x: 1, y: 3, w: 1, h: 3,},
    {i: 'l', x: 2, y: 3, w: 1, h: 3,},

    {i: 'm', x: 0, y: 4, w: 1, h: 3,},
    {i: 'n', x: 1, y: 4, w: 1, h: 3,},
    {i: 'o', x: 2, y: 4, w: 1, h: 3,},

    {i: 'p', x: 0, y: 5, w: 2, h: 3,},

    {i: 'q', x: 0, y: 6, w: 0, h: 0,},
];

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
    modalIsOpen: boolean,
    currentGraphCluster: string,
    currentAppInstLineChartData: Array,
    currentGraphAppInst: string,
    mapPopUploading: boolean,
    selectedClusterUsageOne: Array,
    selectedClusterUsageOneIndex: number,
    layout: any,
    gridDraggable: boolean,
    diskGridItemOneStyleTranslate: string,

}


export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageDevMonitoring extends Component<Props, State> {


        intervalForAppInst = null;


        constructor(props) {
            super(props);
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            let savedlayoutKey = store.email + "_layout"

            this.state = {
                layout: isEmpty(reactLocalStorage.get(savedlayoutKey)) ? defaultLayout : reactLocalStorage.getObject(savedlayoutKey),
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
                modalIsOpen: false,
                currentGraphCluster: '',
                currentAppInstLineChartData: [],
                currentGraphAppInst: '',
                mapPopUploading: false,
                selectedClusterUsageOne: [],
                selectedClusterUsageOneIndex: 0,
                gridDraggable: true,
                isNoData: false,
                diskGridItemOneStyleTranslate: {
                    transform: 'translate(10px, 1540px)',
                },
            };
        }

        componentDidMount = async () => {

            this.setState({
                loading: true,
                bubbleChartLoader: true,
                selectOrg: localStorage.selectOrg === undefined ? '' : localStorage.selectOrg.toString(),
            })
            await this.loadInitDataForCluster();

            this.setState({
                loading: false,
                bubbleChartLoader: false,
            })
        }

        componentWillUnmount(): void {
            clearInterval(this.intervalForAppInst)
        }

        showModalClusterLineChart(lineChartDataOne, index) {
            this.setState({
                selectedClusterUsageOne: lineChartDataOne,
                modalIsOpen: true,
                selectedClusterUsageOneIndex: index,
            })
        }

        async loadInitDataForCluster(isInterval: boolean = false) {

            clearInterval(this.intervalForAppInst)
            this.setState({dropdownRequestLoading: true})
            let clusterList = await getClusterList();
            let cloudletList = await getCloudletList()

            let appInstanceList: Array<TypeAppInstance> = await getAppInstList();
            if (appInstanceList.length === 0) {
                this.setState({
                    isNoData: true,
                })
            }


            //fixme: fakeData
            //fixme: fakeData
            /*let clusterList = require('../temp/TEMP_KYUNGJOOON_FOR_TEST/Jsons/clusterList')
            let cloudletList = require('../temp/TEMP_KYUNGJOOON_FOR_TEST/Jsons/cloudletList')
            let appInstanceList = require('../temp/TEMP_KYUNGJOOON_FOR_TEST/Jsons/appInstanceList')*/
            console.log('appInstanceList====>', appInstanceList);

            console.log('clusterList===>', clusterList);

            let clusterDropdownList = makeSelectBoxListWithKeyValuePipe(clusterList, 'ClusterName', 'Cloudlet')

            let appInstanceListGroupByCloudlet = []
            try {
                appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, CLASSIFICATION.CLOUDLET);
            } catch (e) {
                showToast(e.toString())
            }


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
            //allClusterUsageList = require('../temp/TEMP_KYUNGJOOON_FOR_TEST/Jsons/allClusterUsageList')
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

            /*   if (this.udpRef !== null) {
                   this.udpRef.style.height = '500px';
               }*/

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

        makeChartDataAndRenderTabBody_LineChart(hwType,) {
            let lineChartDataSet: TypeLineChartData = [];
            if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                lineChartDataSet = makeLineChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
            } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                console.log('filteredAppInstUsageList===>', this.state.filteredAppInstUsageList)
                lineChartDataSet = makeLineChartDataForAppInst_2222222(this.state.filteredAppInstUsageList, hwType, this)
                console.log('filteredAppInstUsageList===222222>', lineChartDataSet)
            }

            console.log(`lineChartDataSet===${hwType}>`, lineChartDataSet);
            if (hwType === HARDWARE_TYPE.RECVBYTES
                || hwType === HARDWARE_TYPE.SENDBYTES
                || hwType === HARDWARE_TYPE.ACTIVE_CONNECTION
                || hwType === HARDWARE_TYPE.ACCEPTS_CONNECTION
                || hwType === HARDWARE_TYPE.HANDLED_CONNECTION
                || hwType === HARDWARE_TYPE.TCPCONNS
                || hwType === HARDWARE_TYPE.TCPRETRANS
                || hwType === HARDWARE_TYPE.UDPRECV
                || hwType === HARDWARE_TYPE.UDPSENT

            ) {
                return this.renderGraphAreaMultiFor_LineChart(hwType, lineChartDataSet)
            } else {

                console.log("hwType===>", hwType);
                return this.renderGraphAreaFor_LineChart(hwType, lineChartDataSet)
            }
        }


        makeChartDataAndRenderTabBody_____BarChart(hwType,) {
            let barChartDataSet: TypeBarChartData = [];
            if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                barChartDataSet = makeBarChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
            } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                barChartDataSet = makeBarChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
            }

            if (barChartDataSet === undefined) {
                barChartDataSet = []
            }
            console.log(`lineChartDataSet===${hwType}>`, []);
            if (hwType === HARDWARE_TYPE.RECVBYTES
                || hwType === HARDWARE_TYPE.SENDBYTES
                || hwType === HARDWARE_TYPE.ACTIVE_CONNECTION
                || hwType === HARDWARE_TYPE.ACCEPTS_CONNECTION
                || hwType === HARDWARE_TYPE.HANDLED_CONNECTION
                || hwType === HARDWARE_TYPE.TCPCONNS
                || hwType === HARDWARE_TYPE.TCPRETRANS
                || hwType === HARDWARE_TYPE.UDPRECV
                || hwType === HARDWARE_TYPE.UDPSENT

            ) {

                return this.renderGraphAreaMultiForBarChart(hwType, barChartDataSet)

            } else {

                return this.renderGraphAreaFor__BarChart(hwType, barChartDataSet)

            }
        }


        convertToClassification(pClassfication) {
            if (pClassfication === CLASSIFICATION.APPINST) {
                return "App Instance"
            } else {
                return pClassfication
            }
        }

        renderGraphAreaMultiFor_LineChart(pHardwareType, lineChartDataSet) {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*@todo:LInechart*/}
                    {/*@todo:LInechart*/}
                    {/*@todo:LInechart*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title_select'>
                                {convertHwTypePhrases(pHardwareType)} Usage
                                of {this.convertToClassification(this.state.currentClassification)}
                            </div>
                            {!this.state.loading && this.renderDropDownForMultiTab(pHardwareType)}
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : renderLineChartCoreForDev_Cluster(this, lineChartDataSet)}
                        </div>
                    </div>
                </div>
            )
        }

        renderGraphAreaMultiForBarChart(pHardwareType, barChartDataSet) {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*@todo:BarChart*/}
                    {/*@todo:BarChart*/}
                    {/*@todo:BarChart*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title_select'>
                                Top 5 {convertHwTypePhrases(pHardwareType)} usage
                                of {this.convertToClassification(this.state.currentClassification)}
                            </div>
                            {!this.state.loading && this.renderDropDownForMultiTab(pHardwareType)}
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() :
                                barChartDataSet.length === 0 ?
                                    noDataArea()
                                    :
                                    renderBarChartCore(barChartDataSet.chartDataList, barChartDataSet.hardwareType)}
                        </div>
                    </div>

                </div>
            )
        }


        renderGraphAreaFor_LineChart(pHardwareType, lineChartDataSet) {
            return (
                <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
                    {/*@todo:LInechart*/}
                    {/*@todo:LInechart*/}
                    {/*@todo:LInechart*/}
                    <div className='page_monitoring_dual_container' style={{flex: 1}}>
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
                            {this.state.loading ? renderPlaceHolderCircular() : this.state.currentClassification === CLASSIFICATION.CLUSTER ? renderLineChartCoreForDev_Cluster(this, lineChartDataSet) :
                                renderLineChartCoreForDev_AppInst(this, lineChartDataSet)
                            }
                        </div>
                    </div>
                </div>
            )
        }

        renderGraphAreaFor__BarChart(pHardwareType, barChartDataSet) {
            return (
                <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
                    {/*@todo:BarChart*/}
                    {/*@todo:BarChart*/}
                    {/*@todo:BarChart*/}
                    <div className='page_monitoring_dual_container' style={{flex: 1}}>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Top 5 {convertHwTypePhrases(pHardwareType)} usage
                                of {this.convertToClassification(this.state.currentClassification)}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() :

                                barChartDataSet.length === 0 || barChartDataSet.chartDataList.length === 1 ?
                                    noDataArea()
                                    :
                                    renderBarChartCore(barChartDataSet.chartDataList, barChartDataSet.hardwareType, this)

                            }
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
            } else if (cate === HARDWARE_TYPE.ACCEPTS_CONNECTION || cate === HARDWARE_TYPE.HANDLED_CONNECTION || cate === HARDWARE_TYPE.ACTIVE_CONNECTION) {
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

        renderDropdownForNetwork(hwType) {
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
                                networkTabIndex: 0,
                            })
                        } else if (value === HARDWARE_TYPE.SENDBYTES) {
                            this.setState({
                                networkTabIndex: 1,
                            })
                        }
                    }}
                    value={hwType}
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

        async resetGridPos() {
            try {
                reactLocalStorage.remove('layout003')
                await this.setState({
                    layout: []
                });
                await this.setState({
                    layout: defaultLayout,
                })
            } catch (e) {

                showToast(e.toString())
            }


        }

        renderHeader = () => {

            return (

                <Grid.Row className='content_title'>
                    <div className='content_title_wrap'>
                        <div className='content_title_label'>Monitoring For Dev</div>
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
                        >Reset
                        </Button>
                        <Button
                            onClick={async () => {
                                this.resetGridPos();
                            }}
                        >Reset Grid Position
                        </Button>

                        <Button
                            onClick={async () => {
                                let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
                                let savedlayoutKey = store.email + "_layout"
                                reactLocalStorage.remove(savedlayoutKey)

                            }}
                        >remove
                        </Button>


                        {this.state.currentClassification === CLASSIFICATION.APPINST &&
                        <div>
                            <MButton
                                style={{
                                    backgroundColor: this.state.isStream ? 'green' : '#6c6c6c',
                                    color: 'white',
                                    height: 37
                                }}
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
                                <CircularProgress style={{
                                    color: this.state.currentClassification === CLASSIFICATION.APPINST ? 'grey' : 'green',
                                    zIndex: 9999999,
                                    fontSize: 10
                                }}
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
                        {/*<AButton type={'primary'}>sdkjfskdjfksjdf</AButton>*/}
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
                                style={PageMonitoringStyles.dropDown}
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

        handleAppInstDropdown = async (pCurrentAppInst) => {
            clearInterval(this.intervalForAppInst)
            await this.setState({
                currentAppInst: pCurrentAppInst,
                loading: true,
            })

            let AppName = pCurrentAppInst.split('|')[0].trim()
            let Cloudlet = pCurrentAppInst.split('|')[1].trim()
            let ClusterInst = pCurrentAppInst.split('|')[2].trim()
            let filteredAppList = filterUsageByClassification(this.state.appInstanceList, Cloudlet, 'Cloudlet');
            filteredAppList = filterUsageByClassification(filteredAppList, ClusterInst, 'ClusterInst');
            filteredAppList = filterUsageByClassification(filteredAppList, AppName, 'AppName');

            //todo:Terminal
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
                //clusterSelectBoxPlaceholder: 'Select Cluster'
            }, () => {
                //alert(this.state.currentClassification)

                console.log('filteredAppInstUsageList===>', this.state.filteredAppInstUsageList)
            })

            await this.setState({
                currentTabIndex: 0,
            })
            /*if (this.clusterListGridItemRef!==null){
                this.clusterListGridItemRef.style.transform = 'translate(10px, 1540px)';
            }*/


            if (this.state.isStream) {
                this.setAppInstInterval(filteredAppList)
            } else {
                clearInterval(this.intervalForAppInst)
            }

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
                        {/* <div style={{marginRight: 10, marginTop: 1, backgroundColor: 'transparent', display: 'flex', alignSelf: 'center'}}>
                            <MButton
                                style={{backgroundColor: '#6c6c6c', color: 'white', height: 25}}
                                onClick={async () => {

                                    await this.resetAllDataForDev()
                                    this.setState({
                                        currentHardwareType: HARDWARE_TYPE.CPU
                                    })

                                }}>reset
                            </MButton>
                        </div>*/}
                        <Dropdown
                            disabled={this.state.bubbleChartLoader}
                            clearable={this.state.regionSelectBoxClearable}
                            placeholder='SELECT HARDWARE'
                            selection
                            loading={this.state.bubbleChartLoader}
                            options={HARDWARE_OPTIONS_FOR_CLUSTER}
                            defaultValue={HARDWARE_OPTIONS_FOR_CLUSTER[0].value}
                            onChange={async (e, {value}) => {

                                await handleHardwareTabChanges(this, value)

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
                        {this.state.bubbleChartLoader ? renderPlaceHolderCircular() : renderBubbleChartCoreForDev_Cluster(this, this.state.currentHardwareType, this.state.bubbleChartData)}
                    </div>
                </div>
            )
        }

        renderMapArea() {
            return (
                <div className='page_monitoring_column_kyungjoon1' style={{width: '100%', height: '100%'}}
                     key="b">

                    <div className='page_monitoring_title_area' style={{display: 'flex'}}>

                        <div style={{
                            display: 'flex',
                            width: '100%',
                            height: 30
                        }}>
                            <div className='page_monitoring_title' style={{
                                backgroundColor: 'transparent',
                                flex: .9
                            }}>
                                Launch status of
                                the {this.state.currentClassification}
                            </div>
                            <div style={{flex: .1, marginRight: -30}}>
                                <MButton style={{
                                    height: 30,
                                    backgroundColor: !this.state.gridDraggable ? 'green' : 'grey',
                                    color: 'white'
                                }}
                                         onClick={() => {
                                             this.setState({
                                                 gridDraggable: !this.state.gridDraggable,
                                                 appInstanceListGroupByCloudlet: [],
                                             }, () => {
                                                 this.setState({
                                                     appInstanceListGroupByCloudlet: reducer.groupBy(this.state.appInstanceList, CLASSIFICATION.CLOUDLET),
                                                 });

                                             })
                                         }}>
                                    drag
                                </MButton>
                            </div>

                        </div>

                        <div className='page_monitoring_title' style={{
                            backgroundColor: 'transparent',
                            flex: .65
                        }}>
                            {this.state.mapPopUploading &&
                            <div style={{zIndex: 99999999999}}>
                                <CircularProgress style={{
                                    color: '#1cecff',
                                    marginRight: 0,
                                    marginBottom: -2,
                                    fontWeight: 'bold',
                                }}
                                                  size={14}/>
                            </div>
                            }
                        </div>
                    </div>
                    {/*@todo: LeafletMapWrapperForDev*/}
                    <div className='page_monitoring_container'>
                        <LeafletMapWrapperForDev
                            mapPopUploading={this.state.mapPopUploading}
                            parent={this}
                            handleAppInstDropdown={this.handleAppInstDropdown}
                            markerList={this.state.appInstanceListGroupByCloudlet}/>
                    </div>
                </div>
            )
        }

        handleLayoutChange = (layout) => {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            let layoutUniqueId = store.email + "_layout"
            reactLocalStorage.setObject(layoutUniqueId, layout)

        }


        render() {
            // todo: Components showing when the loading of graph data is not completed.
            if (!this.state.isReady) {
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
                                <div style={{
                                    marginLeft: -450,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    fontSize: 30,
                                    opacity: 1,
                                    color: 'white'
                                }}>
                                    There is no app instance you can access.. 😅😅😅
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }


            return (
                <div style={{width: '100%', height: '100%', overflowY: 'auto'}}>
                    <ModalGraphForCluster selectedClusterUsageOne={this.state.selectedClusterUsageOne}
                                          selectedClusterUsageOneIndex={this.state.selectedClusterUsageOneIndex}
                                          parent={this}
                                          modalIsOpen={this.state.modalIsOpen}
                                          cluster={''} contents={''}/>

                    <Grid.Row className='view_contents'>
                        <Grid.Column className='contents_body'>
                            {/*todo:---------------------------------*/}
                            {/*todo:Content Header                   */}
                            {/*todo:---------------------------------*/}
                            <SemanticToastContainer position={"top-right"}/>
                            {this.renderHeader()}
                            <Grid.Row className='site_content_body' style={{marginTop: 22, overflowY: 'auto'}}>
                                <div style={{overflowY: 'auto'}}>
                                    <Grid.Column>
                                        <div className="table-no-resized">

                                            <div className="page_monitoring"
                                                 style={{backgroundColor: 'transparent', height: 3250}}>
                                                {/*todo:---------------------------------*/}
                                                {/*todo:SELECTBOX_ROW        */}
                                                {/*todo:---------------------------------*/}
                                                {this.renderSelectBoxRow()}

                                                <div className='page_monitoring_dashboard_kyungjoon'
                                                     style={{overflowY: 'auto'}}>
                                                    <GridLayout
                                                        isDraggable={this.state.gridDraggable}
                                                        autoSize={true}
                                                        className="layout"
                                                        layout={this.state.layout}
                                                        cols={3}
                                                        isDroppable={true}
                                                        rowHeight={160}
                                                        width={window.innerWidth * 0.86}
                                                        onLayoutChange={this.handleLayoutChange}
                                                        style={{overflowY: 'auto',}}
                                                    >

                                                        <div className='page_monitoring_column_kyungjoon1' style={{}}
                                                             key="a">
                                                            {this.renderBubbleChartArea()}
                                                        </div>
                                                        {/* todo:map*/}
                                                        {/* todo:map*/}
                                                        {/* todo:map*/}
                                                        {/* todo:map*/}
                                                        {/* todo:map*/}
                                                        {this.renderMapArea()}
                                                        <div className='page_monitoring_column_kyungjoon1' key="c">
                                                            {this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.CPU)}

                                                        </div>
                                                        <div className='page_monitoring_column_kyungjoon1' key="d">
                                                            {this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.MEM)}
                                                        </div>


                                                        <div className='page_monitoring_column_kyungjoon1' key="e">
                                                            {this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.DISK)}
                                                        </div>

                                                        <div className='page_monitoring_column_kyungjoon1' key="f">
                                                            <Tabs selectedIndex={this.state.networkTabIndex}
                                                                  className='page_monitoring_tab'>
                                                                <TabPanel>
                                                                    {this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.RECVBYTES)}
                                                                </TabPanel>
                                                                <TabPanel>
                                                                    {this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.SENDBYTES)}
                                                                </TabPanel>
                                                            </Tabs>
                                                        </div>

                                                        {this.state.currentClassification === CLASSIFICATION.CLUSTER ?
                                                            <div className='page_monitoring_column_kyungjoon1' key="g">
                                                                <Tabs selectedIndex={this.state.tcpTabIndex}
                                                                      className='page_monitoring_tab'>
                                                                    <TabPanel>
                                                                        {this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.TCPCONNS)}
                                                                    </TabPanel>
                                                                    <TabPanel>
                                                                        {this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.TCPRETRANS)}
                                                                    </TabPanel>
                                                                </Tabs>
                                                            </div>
                                                            :
                                                            <div className='page_monitoring_column_kyungjoon1' key="g">
                                                                <Tabs selectedIndex={this.state.connectionsTabIndex}
                                                                      className='page_monitoring_tab'>
                                                                    <TabPanel>
                                                                        {this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.ACTIVE_CONNECTION)}
                                                                    </TabPanel>
                                                                    <TabPanel>
                                                                        {this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.HANDLED_CONNECTION)}
                                                                    </TabPanel>
                                                                    <TabPanel>
                                                                        {this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.ACCEPTS_CONNECTION)}
                                                                    </TabPanel>
                                                                </Tabs>
                                                            </div>
                                                        }
                                                        <div className='page_monitoring_column_kyungjoon1' key="h"
                                                             ref={c => {
                                                                 this.udpRef = c;
                                                             }}>
                                                            {this.state.currentClassification === CLASSIFICATION.CLUSTER &&
                                                            <Tabs selectedIndex={this.state.udpTabIndex}
                                                                  className='page_monitoring_tab'>
                                                                <TabPanel>
                                                                    {this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.UDPSENT)}
                                                                </TabPanel>
                                                                <TabPanel>
                                                                    {this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.UDPRECV)}
                                                                </TabPanel>
                                                            </Tabs>
                                                            }

                                                        </div>
                                                        <div
                                                            className='page_monitoring_column_kyungjoon1'
                                                            key={'i'}>
                                                            {this.makeChartDataAndRenderTabBody_____BarChart(HARDWARE_TYPE.CPU)}
                                                        </div>
                                                        <div className='page_monitoring_column_kyungjoon1'
                                                             key={'j'}>
                                                            {this.makeChartDataAndRenderTabBody_____BarChart(HARDWARE_TYPE.MEM)}
                                                        </div>
                                                        <div
                                                            style={this.state.diskGridItemOneStyleTranslate}
                                                            className='page_monitoring_column_kyungjoon1'
                                                            key={'k'}
                                                            ref={c => this.diskGridElementOne = c}
                                                        >
                                                            {this.makeChartDataAndRenderTabBody_____BarChart(HARDWARE_TYPE.DISK)}
                                                        </div>
                                                        <div className='page_monitoring_column_kyungjoon1'
                                                             key={'l'}>
                                                            <Tabs selectedIndex={this.state.networkTabIndex}
                                                                  className='page_monitoring_tab'>
                                                                <TabPanel>
                                                                    {this.makeChartDataAndRenderTabBody_____BarChart(HARDWARE_TYPE.RECVBYTES)}
                                                                </TabPanel>
                                                                <TabPanel>
                                                                    {this.makeChartDataAndRenderTabBody_____BarChart(HARDWARE_TYPE.SENDBYTES)}
                                                                </TabPanel>
                                                            </Tabs>
                                                        </div>
                                                        <div className='page_monitoring_column_kyungjoon1' key="m">
                                                            <Tabs selectedIndex={this.state.tcpTabIndex}
                                                                  className='page_monitoring_tab'>
                                                                <TabPanel>
                                                                    {this.makeChartDataAndRenderTabBody_____BarChart(HARDWARE_TYPE.TCPCONNS)}
                                                                </TabPanel>
                                                                <TabPanel>
                                                                    {this.makeChartDataAndRenderTabBody_____BarChart(HARDWARE_TYPE.TCPRETRANS)}
                                                                </TabPanel>
                                                            </Tabs>
                                                        </div>
                                                        <div className='page_monitoring_column_kyungjoon1' key="n">
                                                            <Tabs selectedIndex={this.state.udpTabIndex}
                                                                  className='page_monitoring_tab'>
                                                                <TabPanel>
                                                                    {this.makeChartDataAndRenderTabBody_____BarChart(HARDWARE_TYPE.UDPRECV)}
                                                                </TabPanel>
                                                                <TabPanel>
                                                                    {this.makeChartDataAndRenderTabBody_____BarChart(HARDWARE_TYPE.UDPSENT)}
                                                                </TabPanel>
                                                            </Tabs>
                                                        </div>


                                                        <div

                                                            className='page_monitoring_column_kyungjoon1'
                                                            key={'p'}
                                                        >
                                                            <div className='page_monitoring_table_column'
                                                                 style={{
                                                                     marginLeft: -120,
                                                                     width: window.innerWidth * 0.65
                                                                 }}>
                                                                <div className='page_monitoring_title_area'>
                                                                    <div className='page_monitoring_title'
                                                                         style={PageMonitoringStyles.center}>
                                                                        CLUSTER LIST
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='page_monitoring_popup_table'
                                                                 style={{marginLeft: -10,}}>
                                                                {renderBottomGridAreaForCluster(this, this.state.filteredClusterUsageList)}
                                                            </div>
                                                        </div>


                                                    </GridLayout>
                                                </div>
                                            </div>
                                        </div>
                                    </Grid.Column>
                                </div>

                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                    <Modal style={{width: '100%', height: '100%'}} open={this.state.openTerminal}>
                        <TerminalViewer data={this.state.terminalData} onClose={() => {
                            this.setState({openTerminal: false})
                        }}/>
                    </Modal>
                </div>

            )//return End


        }

    }
))))
;


