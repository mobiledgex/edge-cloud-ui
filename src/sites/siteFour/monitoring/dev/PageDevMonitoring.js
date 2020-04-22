import {Center2, ClusterCluoudletLable, Legend} from '../PageMonitoringStyledComponent'
import {SemanticToastContainer} from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {Dropdown, Modal} from 'semantic-ui-react'
import {withSize} from 'react-sizeme';
import {connect} from 'react-redux';
import {CircularProgress, Toolbar} from '@material-ui/core'
import {Dropdown as ADropdown, Menu as AMenu,} from 'antd';
import {
    defaultHwMapperListForCluster,
    defaultLayoutForAppInst,
    defaultLayoutForCluster,
    defaultLayoutMapperForAppInst,
    filterByClassification,
    getUserId,
    handleThemeChanges,
    makeBarChartDataForAppInst,
    makeBarChartDataForCluster,
    makeDropdownListWithValuePipeForAppInst,
    makeid,
    makeLineChartDataForAppInst,
    makeLineChartDataForBigModal,
    makeLineChartDataForCluster,
    makeSelectBoxListWithKeyValuePipeForCluster,
    makeSelectBoxListWithValuePipe,
    reduceString,
    revertToDefaultLayout,
} from "./PageDevMonitoringService";
import {ADD_ITEM_LIST, CHART_COLOR_LIST, CLASSIFICATION, GRID_ITEM_TYPE, HARDWARE_OPTIONS_FOR_APPINST, HARDWARE_OPTIONS_FOR_CLUSTER, HARDWARE_TYPE, NETWORK_TYPE, RECENT_DATA_LIMIT_COUNT, THEME_OPTIONS_LIST} from "../../../../shared/Constants";
import type {TypeBarChartData, TypeLineChartData} from "../../../../shared/Types";
import {TypeAppInstance} from "../../../../shared/Types";
import moment from "moment";
import {getOneYearStartEndDatetime, isEmpty, makeBubbleChartDataForCluster, PageMonitoringStyles, renderPlaceHolderLoader, renderWifiLoader, showToast} from "../PageMonitoringCommonService";
import {getAllAppInstEventLogs, getAllClusterEventLogList, getAppInstList, getAppLevelUsageList, getCloudletList, getClusterLevelUsageList, getClusterList, requestShowAppInstClientWS} from "../PageMonitoringMetricService";
import * as reducer from "../../../../utils";
import TerminalViewer from "../../../../container/TerminalViewer";
import MiniModalGraphContainer from "../components/MiniModalGraphContainer";
import {reactLocalStorage} from "reactjs-localstorage";
import MapForDevContainer from "../components/MapForDevContainer";
import {Responsive, WidthProvider} from "react-grid-layout";
import _ from "lodash";
import PieChartContainer from "../components/PieChartContainer";
import BigModalGraphContainer from "../components/BigModalGraphContainer";
import BubbleChartContainer from "../components/BubbleChartContainer";
import LineChartContainer from "../components/LineChartContainer";
import ClusterEventLogListHook from "../components/ClusterEventLogListHook";
import MaterialIcon from "material-icons-react";
import '../PageMonitoring.css'
import AddItemPopupContainer from "../components/AddItemPopupContainer";
import type {Layout, LayoutItem} from "react-grid-layout/lib/utils";
import AddItemPopupContainer2 from '../components/AddItemPopupContainer2'
import {THEME_TYPE} from "../../../../themeStyle";
import BarChartContainer from "../components/BarChartContainer";
import PerformanceSummaryForClusterHook from "../components/PerformanceSummaryForClusterHook";
import PerformanceSummaryForAppInstHook from "../components/PerformanceSummaryForAppInstHook";
import type {PageDevMonitoringState} from "./PageDevMonitoringState";
import {ColorLinearProgress, CustomSwitch, defaultLayoutXYPosForAppInst, defaultLayoutXYPosForCluster} from "./PageDevMonitoringState";
import type {PageDevMonitoringProps} from "./PageDevMonitoringProps";
import {PageDevMonitoringMapDispatchToProps, PageDevMonitoringMapStateToProps} from "./PageDevMonitoringProps";
import {UnfoldLess, UnfoldMore} from '@material-ui/icons';
import AppInstEventLogListHook_VirtualScroll from "../components/AppInstEventLogListHook_VirtualScroll";
import Tooltip from "antd/es/tooltip";

const ASubMenu = AMenu.SubMenu;
const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default withSize()(connect(PageDevMonitoringMapStateToProps, PageDevMonitoringMapDispatchToProps)((
        class PageDevMonitoring extends Component<PageDevMonitoringProps, PageDevMonitoringState> {
            intervalForAppInst = null;
            intervalForCluster = null;
            webSocketInst: WebSocket = null;
            gridItemHeight = 246;

            constructor(props) {
                super(props);
                let clusterLayoutKey = getUserId() + "_layout"
                let ClusterHwMapperKey = getUserId() + "_layout_mapper"
                let appInstLayoutKey = getUserId() + "_layout2"
                let layoutMapperAppInstKey = getUserId() + "_layout2_mapper"
                let themeKey = getUserId() + "_mon_theme";
                let themeTitle = getUserId() + "_mon_theme_title";
                //@TODO: DELETE THEME COLOR
                /*reactLocalStorage.remove(themeTitle)
                reactLocalStorage.remove(themeKey)*/
                this.state = {
                    layoutForCluster: isEmpty(reactLocalStorage.get(clusterLayoutKey)) ? defaultLayoutForCluster : reactLocalStorage.getObject(clusterLayoutKey),
                    layoutMapperForCluster: isEmpty(reactLocalStorage.get(ClusterHwMapperKey)) ? defaultHwMapperListForCluster : reactLocalStorage.getObject(ClusterHwMapperKey),
                    layoutForAppInst: isEmpty(reactLocalStorage.get(appInstLayoutKey)) ? defaultLayoutForAppInst : reactLocalStorage.getObject(appInstLayoutKey),
                    layoutMapperForAppInst: isEmpty(reactLocalStorage.get(layoutMapperAppInstKey)) ? defaultLayoutMapperForAppInst : reactLocalStorage.getObject(layoutMapperAppInstKey),
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
                    hwListForCluster: HARDWARE_OPTIONS_FOR_CLUSTER,
                    hwListForAppInst: HARDWARE_OPTIONS_FOR_APPINST,
                    isDraggable: false,
                    isUpdateEnableForMap: false,
                    isShowBigGraph: false,
                    popupGraphHWType: '',
                    chartDataForBigModal: [],
                    popupGraphType: '',
                    isPopupMap: false,
                    //reactLocalStorage.setObject(getUserId() + "_mon_theme")
                    chartColorList: isEmpty(reactLocalStorage.get(themeKey)) ? CHART_COLOR_LIST : reactLocalStorage.getObject(themeKey),
                    themeTitle: isEmpty(reactLocalStorage.get(themeTitle)) ? 'DEFAULT' : reactLocalStorage.get(themeTitle),
                    addItemList: ADD_ITEM_LIST,
                    themeOptions: THEME_OPTIONS_LIST,
                    isBubbleChartMaked: false,
                    allClusterEventLogList: [],
                    filteredClusterEventLogList: [],
                    isResizeComplete: false,
                    allAppInstEventLogs: [],
                    filteredAppInstEventLogs: [],
                    isFixGrid: true,
                    webSocketLoading: false,
                    selectedClientLocationListOnAppInst: [],
                    isMapUpdate: true,
                    currentWidgetWidth: 1,
                    isOpenEditView: false,
                    isFullScreenMap: false,
                    isStackedLineChart: false,
                    isShowFilter: false,
                    currentNavigation: '',
                    allAppInstDropdown: [],
                    isShowAppInstPopup: false,
                    isShowPopOverMenu: false,
                    isOpenEditView2: false,
                    showAppInstClient: true,//@desc: isShowAppInstClient
                    filteredClusterList: [],
                    currentWidth: '100%',
                    emptyPosXYInGrid: {},
                    emptyPosXYInGrid2: {},
                    toastMessage: '',
                    isToastOpen: false,
                    mapLoading: false,
                    isLegendExpanded: false,
                    chunkedSize: 12,
                    selectedAppInstIndex: -1,
                };
            }

            async componentWillReceiveProps(nextProps: PageDevMonitoringProps, nextContext: any): void {
                if (this.props.size.width !== nextProps.size.width) {
                    window.dispatchEvent(new Event('resize'))
                }
            }

            componentDidMount = async () => {
                this.setState({
                    loading: true,
                    bubbleChartLoader: true,
                    selectOrg: localStorage.selectOrg === undefined ? '' : localStorage.selectOrg.toString(),
                    mapLoading: true,

                })
                await this.loadInitDataForDevMon();
                this.setState({
                    loading: false,
                    bubbleChartLoader: false,
                })

            }


            async loadInitDataForCluster__FOR__DEV00000000000000777777(isInterval: boolean = false) {
                try {
                    clearInterval(this.intervalForAppInst)
                    this.setState({dropdownRequestLoading: true})
                    let clusterList = require('../aaa____TESTCODE____/Jsons/clusterList')
                    let cloudletList = require('../aaa____TESTCODE____/Jsons/cloudletList')
                    let appInstanceList = require('../aaa____TESTCODE____/Jsons/appInstanceList')
                    let clusterDropdownList = makeSelectBoxListWithKeyValuePipeForCluster(clusterList, 'ClusterName', 'Cloudlet')
                    let __allAppInstEvLogListValues = require('../aaa____TESTCODE____/Jsons/allAppInstEventLogList')
                    let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, CLASSIFICATION.CLOUDLET);
                    let allClusterUsageList = require('../aaa____TESTCODE____/Jsons/allClusterUsageList')
                    let bubbleChartData = await makeBubbleChartDataForCluster(allClusterUsageList, HARDWARE_TYPE.CPU, this.state.chartColorList);

                    let maxCpu = Math.max.apply(Math, allClusterUsageList.map(function (o) {
                        return o.sumCpuUsage;
                    }));
                    let maxMem = Math.max.apply(Math, allClusterUsageList.map(function (o) {
                        return o.sumMemUsage;
                    }));

                    await this.setState({
                        appInstanceListGroupByCloudlet: !isInterval && appInstanceListGroupByCloudlet,
                        allClusterEventLogList: [],
                        filteredClusterEventLogList: [],
                        allAppInstEventLogs: __allAppInstEvLogListValues,
                        filteredAppInstEventLogs: __allAppInstEvLogListValues,
                        isReady: true,
                        clusterDropdownList: clusterDropdownList,
                        dropDownCloudletList: cloudletList,
                        clusterList: clusterList,
                        isAppInstaceDataReady: true,
                        appInstanceList: appInstanceList,
                        filteredAppInstanceList: appInstanceList,
                        dropdownRequestLoading: false,
                        bubbleChartData: bubbleChartData,
                        clusterListLoading: false,
                        allCloudletUsageList: allClusterUsageList,
                        allClusterUsageList: allClusterUsageList,
                        filteredClusterUsageList: allClusterUsageList,
                        maxCpu: maxCpu,
                        maxMem: maxMem,
                        isRequesting: false,
                        currentCluster: '',
                    })
                } catch (e) {

                }
            }

            async loadInitDataForDevMon(isInterval: boolean = false) {
                let promiseList = []
                let promiseList2 = []
                try {
                    clearInterval(this.intervalForAppInst)
                    await this.setState({dropdownRequestLoading: true})
                    //@todo:#############################################
                    //@todo: (cloudletList ,clusterList, appnInstList)
                    //@todo:#############################################
                    promiseList.push(getCloudletList())
                    promiseList.push(getClusterList())
                    promiseList.push(getAppInstList())
                    let newPromiseList = await Promise.all(promiseList);
                    let cloudletList = newPromiseList[0]
                    let clusterList = newPromiseList[1];
                    let appInstList = newPromiseList[2];
                    let clusterDropdownList = makeSelectBoxListWithKeyValuePipeForCluster(clusterList, 'ClusterName', 'Cloudlet')

                    //@todo:#########################################################################
                    //@todo: map Marker
                    //@todo:#########################################################################
                    let appInstanceListGroupByCloudlet = reducer.groupBy(appInstList, CLASSIFICATION.CLOUDLET);
                    await this.setState({
                        appInstanceListGroupByCloudlet: !isInterval && appInstanceListGroupByCloudlet,
                        mapLoading: false,
                    })

                    //@todo:#########################################################################
                    //@todo: getAllClusterEventLogList, getAllAppInstEventLogs ,allClusterUsageList
                    //@todo:#########################################################################
                    promiseList2.push(getAllClusterEventLogList(clusterList))
                    promiseList2.push(getAllAppInstEventLogs());
                    promiseList2.push(getClusterLevelUsageList(clusterList, "*", RECENT_DATA_LIMIT_COUNT))
                    let newPromiseList2 = await Promise.all(promiseList2);
                    let allClusterEventLogList = newPromiseList2[0];
                    let allAppInstEventLogList = newPromiseList2[1];
                    let allClusterUsageList = newPromiseList2[2];

                    let bubbleChartData = await makeBubbleChartDataForCluster(allClusterUsageList, HARDWARE_TYPE.CPU, this.state.chartColorList);
                    let maxCpu = Math.max.apply(Math, allClusterUsageList.map(function (o) {
                        return o.sumCpuUsage;
                    }));
                    let maxMem = Math.max.apply(Math, allClusterUsageList.map(function (o) {
                        return o.sumMemUsage;
                    }));

                    await this.setState({
                        isNoData: appInstList.length === 0,
                        bubbleChartData: bubbleChartData,
                        allClusterEventLogList: allClusterEventLogList,
                        filteredClusterEventLogList: allClusterEventLogList,
                        allAppInstEventLogs: allAppInstEventLogList,
                        filteredAppInstEventLogs: allAppInstEventLogList,
                        isReady: true,
                        clusterDropdownList: clusterDropdownList,
                        dropDownCloudletList: cloudletList,
                        clusterList: clusterList,
                        filteredClusterList: clusterList,
                        isAppInstaceDataReady: true,
                        appInstanceList: appInstList,
                        filteredAppInstanceList: appInstList,
                        dropdownRequestLoading: false,
                        clusterListLoading: false,
                        allCloudletUsageList: allClusterUsageList,
                        allClusterUsageList: allClusterUsageList,
                        filteredClusterUsageList: allClusterUsageList,
                        maxCpu: maxCpu,
                        maxMem: maxMem,
                        isRequesting: false,
                        currentCluster: '',
                    });
                } catch (e) {
                    //showToast(e.toString())
                }

            }

            componentWillUnmount(): void {
                this.props.toggleHeader(true)
                clearInterval(this.intervalForAppInst)
                clearInterval(this.intervalForCluster)
                if (!isEmpty(this.webSocketInst)) {
                    this.webSocketInst.close();
                }
            }


            showModalClusterLineChart(lineChartDataOne, index) {
                this.setState({
                    selectedClusterUsageOne: lineChartDataOne,
                    modalIsOpen: true,
                    selectedClusterUsageOneIndex: index,
                })
            }


            async resetLocalData() {
                clearInterval(this.intervalForCluster)
                clearInterval(this.intervalForAppInst)

                await this.setState({
                    currentGridIndex: -1,
                    currentTabIndex: 0,
                    intervalLoading: false,
                    currentClassification: CLASSIFICATION.CLUSTER,
                    filteredClusterUsageList: this.state.allClusterUsageList,
                    filteredAppInstanceList: this.state.appInstanceList,
                    filteredClusterEventLogList: this.state.allClusterEventLogList,
                    filteredAppInstEventLogs: this.state.allAppInstEventLogs,
                    appInstanceListGroupByCloudlet: reducer.groupBy(this.state.appInstanceList, CLASSIFICATION.CLOUDLET),
                })
                //todo: reset bubble chart data
                let bubbleChartData = await makeBubbleChartDataForCluster(this.state.allClusterUsageList, HARDWARE_TYPE.CPU, this.state.chartColorList);
                await this.setState({
                    bubbleChartData: bubbleChartData,
                    dropdownRequestLoading: false,
                    currentCluster: '',
                    currentAppInst: '',
                    appInstDropdown: [],
                    isShowAppInstPopup: !this.state.isShowAppInstPopup,
                })
            }

            async reloadDataFromRemote() {
                clearInterval(this.intervalForAppInst)
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
                await this.loadInitDataForDevMon();
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

            /* makeGradientBarCharData(chartData) {
                 let canvasDatas = (canvas) => {
                     let CHARTCOLORLIST = this.state.chartColorList;
                     let gradientList = makeGradientColorList2(canvas, 305, CHARTCOLORLIST, true);
                     let chartDatas = chartData.chartDataList
                     let labelList = [];
                     let graphDatasets = [];
                     chartDatas.map((item, index) => {
                         if (index > 0) {
                             labelList.push(item[0]);
                         }
                     })

                     chartDatas.map((item, index) => {
                         if (index > 0) {
                             let itemOne = item[3].replace('\"', '')
                             itemOne = itemOne.replace('%', '')
                             itemOne = parseFloat(itemOne)
                             graphDatasets.push(itemOne);
                         }
                     })

                     let dataSets = [
                         {
                             backgroundColor: gradientList,
                             borderColor: gradientList,
                             borderWidth: 1,
                             hoverBackgroundColor: gradientList,
                             hoverBorderColor: 'rgb(0,0,0)',
                             data: graphDatasets,
                         }
                     ]

                     let completeData = {
                         labels: labelList,
                         datasets: dataSets
                     }

                     return completeData;

                 };
                 return canvasDatas;
             }*/

            makeBarChartData(hwType, graphType) {

                let barChartDataSet: TypeBarChartData = [];
                if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                    barChartDataSet = makeBarChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
                } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                    barChartDataSet = makeBarChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
                }
                if (barChartDataSet === undefined) {
                    barChartDataSet = []
                }

                console.log(`barChartDataSet___${graphType}===>`, barChartDataSet);

                return (<BarChartContainer isResizeComplete={this.state.isResizeComplete} parent={this}
                                           loading={this.state.loading} chartDataSet={barChartDataSet}
                                           pHardwareType={hwType} graphType={graphType}/>)

                /* if (!isEmpty(barChartDataSet)) {
                     let chartDatas = this.makeGradientBarCharData(barChartDataSet)
                     console.log("makeGradientBarCharData===>", barChartDataSet.chartDataList.length);
                     return (
                         <GradientBarChartContainer
                             isResizeComplete={this.state.isResizeComplete}
                             parent={this}
                             loading={this.state.loading}
                             chartDataSet={chartDatas}
                             pHardwareType={hwType}
                             graphType={graphType}
                             dataLength={barChartDataSet.chartDataList.length}
                         />
                     )
                 }*/


            }


            convertToClassification(pClassification) {
                if (pClassification === CLASSIFICATION.APPINST) {
                    return "App Instance"
                } else {
                    return pClassification
                }
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


            setClusterInterval() {
                this.intervalForCluster = setInterval(async () => {
                    this.setState({intervalLoading: true})

                    let filteredClusterUsageList = await getClusterLevelUsageList(this.state.filteredClusterList, "*", RECENT_DATA_LIMIT_COUNT);
                    this.setChartDataForBigModal(filteredClusterUsageList)
                    this.setState({
                        intervalLoading: false,
                        filteredClusterUsageList: filteredClusterUsageList,
                    })
                }, 1000 * 6.0)
            }

            setAppInstInterval(filteredAppList) {
                this.intervalForAppInst = setInterval(async () => {
                    this.setState({intervalLoading: true,})
                    let allAppInstUsageList = await getAppLevelUsageList(filteredAppList, "*", RECENT_DATA_LIMIT_COUNT);

                    this.setChartDataForBigModal(allAppInstUsageList)

                    this.setState({
                        intervalLoading: false,
                        filteredAppInstUsageList: allAppInstUsageList,
                    })
                }, 1000 * 7.0)
            }


            setChartDataForBigModal(usageList) {
                let lineChartDataSet = []
                if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                    lineChartDataSet = makeLineChartDataForCluster(usageList, this.state.currentHardwareType, this)
                } else {
                    lineChartDataSet = makeLineChartDataForAppInst(usageList, this.state.currentHardwareType, this)
                }

                let chartDataForBigModal = makeLineChartDataForBigModal(lineChartDataSet, this)

                this.setState({
                    chartDataForBigModal: chartDataForBigModal,
                })
            }


            async handleClusterDropdown_Reset(selectedClusterOne) {
                try {
                    let filteredClusterUsageList = []
                    //todo: When selected all Cluster options
                    if (selectedClusterOne === '') {
                        await this.setState({
                            filteredClusterList: this.state.clusterList,
                        })
                        await this.resetLocalData();
                        /*  notification.success({
                              placement: 'bottomLeft',
                              duration: 1,
                              message: 'Fetch locally stored data.',
                          });*/
                    } else {
                        await this.setState({
                            selectedClientLocationListOnAppInst: [],
                            dropdownRequestLoading: true,
                            selectedAppInstIndex: -1,
                        })

                        let selectData = selectedClusterOne.split("|")
                        let selectedCluster = selectData[0].trim();
                        let selectedCloudlet = selectData[1].trim();
                        //desc : filter  ClusterUsageList
                        let allClusterUsageList = this.state.allClusterUsageList;
                        let allUsageList = allClusterUsageList;
                        allUsageList.map(item => {
                            if (item.cluster === selectedCluster && item.cloudlet === selectedCloudlet) {
                                filteredClusterUsageList.push(item)
                            }
                        })


                        //desc: filter clusterEventlog
                        let allClusterEventLogList = this.state.allClusterEventLogList
                        let filteredClusterEventLogList = []
                        allClusterEventLogList.map(item => {
                            if (item[1] === selectedCluster && item[3] === selectedCloudlet) {
                                filteredClusterEventLogList.push(item)
                            }
                        })

                        let appInstanceList = this.state.appInstanceList;
                        let filteredAppInstList = []
                        appInstanceList.map((item: TypeAppInstance, index) => {
                            if (item.ClusterInst === selectedCluster && item.Cloudlet === selectedCloudlet) {
                                filteredAppInstList.push(item)
                            }
                        })

                        let appInstDropdown = makeDropdownListWithValuePipeForAppInst(filteredAppInstList, CLASSIFICATION.APPNAME, CLASSIFICATION.CLOUDLET, CLASSIFICATION.CLUSTER_INST)
                        let bubbleChartData = await makeBubbleChartDataForCluster(this.state.filteredClusterUsageList, this.state.currentHardwareType, this.state.chartColorList);
                        await this.setState({
                            currentCluster: selectedClusterOne,
                            currentClassification: CLASSIFICATION.CLUSTER,
                            dropdownRequestLoading: false,
                            filteredClusterUsageList: filteredClusterUsageList,
                            filteredClusterEventLogList: filteredClusterEventLogList,
                            appInstDropdown: appInstDropdown,
                            allAppInstDropdown: appInstDropdown,
                            currentAppInst: '',
                            appInstSelectBoxPlaceholder: 'Select App Inst',
                            filteredAppInstanceList: filteredAppInstList,
                            appInstanceListGroupByCloudlet: reducer.groupBy(filteredAppInstList, CLASSIFICATION.CLOUDLET),
                            bubbleChartData: bubbleChartData,
                        });

                    }

                    //todo: ############################
                    //todo: setStream
                    //todo: ############################
                    if (this.state.isStream) {
                        this.setClusterInterval()
                    } else {
                        clearInterval(this.intervalForAppInst)
                        clearInterval(this.intervalForCluster)
                    }
                } catch (e) {

                }

            }


            handleAppInstDropdown = async (pCurrentAppInst) => {
                clearInterval(this.intervalForAppInst)
                clearInterval(this.intervalForCluster)
                //@desc: ################################
                //@desc: requestShowAppInstClientWS
                //@desc: ################################
                if (this.state.showAppInstClient) {
                    await this.setState({
                        selectedClientLocationListOnAppInst: [],
                    })
                    this.webSocketInst = requestShowAppInstClientWS(pCurrentAppInst, this);
                }


                await this.setState({
                    currentAppInst: pCurrentAppInst,
                    loading: true,
                })

                let AppName = pCurrentAppInst.split('|')[0].trim()
                let Cloudlet = pCurrentAppInst.split('|')[1].trim()
                let ClusterInst = pCurrentAppInst.split('|')[2].trim()
                let filteredAppList = filterByClassification(this.state.appInstanceList, Cloudlet, 'Cloudlet');
                filteredAppList = filterByClassification(filteredAppList, ClusterInst, 'ClusterInst');
                filteredAppList = filterByClassification(filteredAppList, AppName, 'AppName');
                //todo:########################################
                //todo:Terminal
                //todo:########################################
                this.setState({
                    terminalData: null
                })
                this.validateTerminal(filteredAppList)

                let appInstDropdown = makeSelectBoxListWithValuePipe(filteredAppList, CLASSIFICATION.APPNAME, CLASSIFICATION.CLOUDLET, CLASSIFICATION.CLUSTER_INST)
                await this.setState({
                    appInstDropdown,
                }, () => {
                })


                let arrDateTime = getOneYearStartEndDatetime();
                let appInstUsageList = [];
                await this.setState({dropdownRequestLoading: true})
                try {
                    appInstUsageList = await getAppLevelUsageList(filteredAppList, "*", RECENT_DATA_LIMIT_COUNT, arrDateTime[0], arrDateTime[1]);
                } catch (e) {
                    showToast(e.toString())
                } finally {
                    this.setState({dropdownRequestLoading: false})
                }

                pCurrentAppInst = pCurrentAppInst.trim();
                pCurrentAppInst = pCurrentAppInst.split("|")[0].trim() + " | " + pCurrentAppInst.split('|')[1].trim() + " | " + pCurrentAppInst.split('|')[2].trim()

                //todo: ############################
                //todo: filtered AppInstEventLogList
                //todo: ############################
                let _allAppInstEventLog = this.state.allAppInstEventLogs;
                let filteredAppInstEventLogList = _allAppInstEventLog.filter(item => {
                    if (item[1].trim() === AppName && item[4].trim() === ClusterInst) {
                        return true;
                    }
                })

                await this.setState({
                    filteredAppInstEventLogs: filteredAppInstEventLogList,
                    currentTabIndex: 0,
                    currentClassification: CLASSIFICATION.APPINST,
                    allAppInstUsageList: appInstUsageList,
                    filteredAppInstUsageList: appInstUsageList,
                    loading: false,
                    currentAppInst: pCurrentAppInst,
                    currentCluster: isEmpty(this.state.currentCluster) ? '' : this.state.currentCluster,
                    clusterSelectBoxPlaceholder: 'Select Cluster',
                });

                //todo: ############################
                //todo: setStream
                //todo: ############################
                if (this.state.isStream) {
                    this.setAppInstInterval(filteredAppList)
                } else {
                    clearInterval(this.intervalForAppInst)
                }

            }

            makeGridSizeByType(graphType) {
                if (graphType === GRID_ITEM_TYPE.PERFORMANCE_SUM) {
                    return 4;
                } else if (graphType === GRID_ITEM_TYPE.MAP) {
                    return 1;
                } else {
                    return 1;
                }
            }

            makeGridSizeHeightByType(graphType) {
                if (graphType === GRID_ITEM_TYPE.MAP) {
                    return 1;
                } else {
                    return 1;
                }
            }


            async addGridItem(hwType, graphType = 'line') {
                //@TODO: ##########################
                //@TODO: CLUSTER
                //@TODO: ##########################
                if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {

                    let currentItems = this.state.layoutForCluster;
                    let maxY = -1;
                    if (!isEmpty(currentItems)) {
                        maxY = _.maxBy(currentItems, 'y').y
                    }
                    let uniqueId = makeid(5)
                    let mapperList = this.state.layoutMapperForCluster

                    let itemOne = {
                        id: uniqueId,
                        hwType: hwType,
                        graphType: graphType,
                    }

                    //##########################
                    // calculate empty space
                    //##########################
                    await this.setState({
                        layoutForCluster: this.state.layoutForCluster.concat({
                            i: uniqueId,
                            x: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.x : 0,
                            y: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.y : maxY + 1,
                            w: this.makeGridSizeByType(graphType),
                            h: this.makeGridSizeHeightByType(graphType),
                        }),
                        layoutMapperForCluster: mapperList.concat(itemOne),
                    })

                    reactLocalStorage.setObject(getUserId() + "_layout", this.state.layoutForCluster)
                    reactLocalStorage.setObject(getUserId() + "_layout_mapper", this.state.layoutMapperForCluster)


                } else {
                    //@TODO: ##########################
                    //@TODO: APPINST
                    //@TODO: ##########################
                    let currentItems = this.state.layoutForAppInst;
                    let maxY = -1;
                    if (!isEmpty(currentItems)) {
                        maxY = _.maxBy(currentItems, 'y').y
                    }
                    let uniqueId = makeid(5)
                    let mapperList = this.state.layoutMapperForAppInst

                    let itemOne = {
                        id: uniqueId,
                        hwType: hwType,
                        graphType: graphType,
                    }

                    await this.setState({
                        layoutForAppInst: this.state.layoutForAppInst.concat({
                            i: uniqueId,
                            x: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.x : 0,
                            y: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.y : maxY + 1,
                            w: 1,
                            h: 1,
                        }),
                        layoutMapperForAppInst: mapperList.concat(itemOne),
                    });
                    reactLocalStorage.setObject(getUserId() + "_layout2", this.state.layoutForAppInst)
                    reactLocalStorage.setObject(getUserId() + "_layout2_mapper", this.state.layoutMapperForAppInst)
                }
            }

            removeGridItem(i) {
                if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                    let removedLayout = _.reject(this.state.layoutForCluster, {i: i});
                    reactLocalStorage.setObject(getUserId() + "_layout", removedLayout)
                    this.setState({
                        layoutForCluster: removedLayout,
                    });
                } else {//@todo: AppInst Level
                    let removedLayout = _.reject(this.state.layoutForAppInst, {i: i});
                    reactLocalStorage.setObject(getUserId() + "_layout2", removedLayout)
                    this.setState({
                        layoutForAppInst: removedLayout,
                    });
                }
            }


            showBigModal = (hwType, graphType) => {

                let chartDataSets = []
                if (graphType.toUpperCase() == GRID_ITEM_TYPE.LINE) {

                    let lineChartDataSet = []
                    if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                        lineChartDataSet = makeLineChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
                    } else {
                        lineChartDataSet = makeLineChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
                    }

                    chartDataSets = makeLineChartDataForBigModal(lineChartDataSet, this)

                } else if (graphType.toUpperCase() == GRID_ITEM_TYPE.BAR || graphType.toUpperCase() == GRID_ITEM_TYPE.COLUMN) {

                    let barChartDataSet = makeBarChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
                    chartDataSets = barChartDataSet.chartDataList;
                }

                this.setState({
                    isShowBigGraph: !this.state.isShowBigGraph,
                    chartDataForBigModal: chartDataSets,
                    popupGraphHWType: hwType,
                    popupGraphType: graphType,
                    isPopupMap: !this.state.isPopupMap,
                    isMapUpdate: true,
                });
            }


            makeGridItemOne(uniqueIndex, hwType, graphType, item) {
                return (
                    <div
                        key={uniqueIndex}
                        data-grid={item}
                        style={{
                            margin: 0,
                            //backgroundColor: '#292c33',
                            backgroundColor: this.props.themeType === 'light' ? 'white' : '#292c33'
                        }}
                        onDoubleClick={async () => {
                            await this.setState({
                                isFixGrid: true,
                                isDraggable: !this.state.isDraggable,
                                appInstanceListGroupByCloudlet: [],
                            })
                            this.setState({
                                appInstanceListGroupByCloudlet: reducer.groupBy(this.state.appInstanceList, CLASSIFICATION.CLOUDLET),
                            });
                        }}
                    >

                        <div
                            class='draggable'
                            style={{
                                position: 'absolute',
                                right: 25, top: 10,
                                display: 'inline-block',
                                width: '100px',
                                lineHeight: '1.2',
                                fontSize: '18px',
                                marginLeft: '15px',
                                cursor: 'pointer',
                                textAlign: 'right',
                                marginRight: '-15px',
                                //backgroundColor: 'red',
                            }}>

                            {/*desc:############################*/}
                            {/*desc:    maximize button         */}
                            {/*desc:############################*/}
                            {graphType.toUpperCase() !== GRID_ITEM_TYPE.PERFORMANCE_SUM
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.BUBBLE
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.APP_INST_EVENT_LOG
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.CLUSTER_EVENTLOG_LIST
                            &&
                            <div className="maxize page_monitoring_widget_icon"
                                 onClick={this.showBigModal.bind(this, hwType, graphType)}
                            >
                                <MaterialIcon size={'tiny'} icon='aspect_ratio' color={'white'}/>
                            </div>
                            }

                            {/*desc:############################*/}
                            {/*desc:    edit btn                */}
                            {/*desc:############################*/}
                            <div className="edit page_monitoring_widget_icon"
                            >
                                <MaterialIcon size={'tiny'} icon='create' color={'white'}/>
                            </div>
                            {/*desc:############################*/}
                            {/*desc:    delete btn                */}
                            {/*desc:############################*/}
                            <div className="remove page_monitoring_widget_icon"
                                 onClick={() => {
                                     this.removeGridItem(uniqueIndex)
                                 }}
                            >
                                <MaterialIcon size={'tiny'} icon='delete' color={'white'}/>
                            </div>
                        </div>


                        {/*desc:############################*/}
                        {/*@desc:__makeGridItem BodyByType  */}
                        {/*desc:############################*/}
                        <div className='page_monitoring_column_resizable'>
                            {this.__makeGridItemOneBody(hwType, graphType.toUpperCase())}
                        </div>
                    </div>
                )
            }

            __makeGridItemOneBody(hwType, graphType) {
                if (graphType.toUpperCase() === GRID_ITEM_TYPE.LINE) {
                    let chartDataSets: TypeLineChartData = [];
                    if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                        chartDataSets = makeLineChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
                    } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                        chartDataSets = makeLineChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
                    }

                    return (
                        this.state.loading ? renderPlaceHolderLoader() :
                            <LineChartContainer
                                isResizeComplete={this.state.isResizeComplete}
                                loading={this.state.loading}
                                currentClassification={this.state.currentClassification}
                                parent={this}
                                pHardwareType={hwType}
                                chartDataSet={chartDataSets}
                            />
                    )

                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.BAR) {
                    return (
                        this.makeBarChartData(hwType, graphType)
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.COLUMN) {
                    return (
                        this.makeBarChartData(hwType, graphType)
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.BUBBLE) {
                    return (
                        <BubbleChartContainer
                            loading={this.state.loading}
                            parent={this}
                            currentHardwareType={this.state.currentHardwareType}
                            bubbleChartData={this.state.bubbleChartData}
                            themeTitle={this.state.themeTitle}/>
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.MAP) {
                    return (
                        <MapForDevContainer
                            markerList={this.state.appInstanceListGroupByCloudlet}
                            currentWidgetWidth={this.state.currentWidgetWidth}
                            isMapUpdate={this.state.isMapUpdate}
                            selectedClientLocationListOnAppInst={this.state.selectedClientLocationListOnAppInst}
                            mapPopUploading={this.state.mapPopUploading}
                            parent={this}
                            isDraggable={this.state.isDraggable}
                            handleAppInstDropdown={this.handleAppInstDropdown}
                            isFullScreenMap={false}
                            isShowAppInstPopup={this.state.isShowAppInstPopup}
                            selectedAppInstIndex={this.state.selectedAppInstIndex}
                        />
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.PERFORMANCE_SUM) {
                    return (
                        this.state.loading ? renderPlaceHolderLoader() :
                            this.state.currentClassification === CLASSIFICATION.CLUSTER ?
                                <PerformanceSummaryForClusterHook
                                    parent={this}
                                    filteredUsageList={this.state.filteredClusterUsageList}
                                    chartColorList={this.state.chartColorList}
                                />
                                :
                                <PerformanceSummaryForAppInstHook
                                    parent={this}
                                    filteredUsageList={this.state.filteredAppInstUsageList}
                                    chartColorList={this.state.chartColorList}
                                />
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.PIE) {
                    return (
                        <PieChartContainer/>
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.CLUSTER_EVENTLOG_LIST) {
                    return (
                        <ClusterEventLogListHook eventLogList={this.state.filteredClusterEventLogList} parent={this}/>
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.APP_INST_EVENT_LOG) {
                    return this.state.loading ? renderPlaceHolderLoader() :
                        <AppInstEventLogListHook_VirtualScroll
                            currentAppInst={this.state.currentAppInst}
                            parent={this}
                            handleAppInstDropdown={this.handleAppInstDropdown}
                            eventLogList={this.state.filteredAppInstEventLogs}
                        />
                }
            }

            calculateEmptyPosInGrid(layout, pDefaultLayoutXYPos) {
                let emptyPosXYInGrid = {};
                pDefaultLayoutXYPos.map((item) => {
                    let isExist = false;
                    for (let j = 0; j < layout.length; j++) {
                        if (layout[j].x === item.x && layout[j].y === item.y) {
                            isExist = true;
                            break;
                        }
                    }
                    if (isExist === false) {
                        emptyPosXYInGrid = item;
                    }
                })
                this.setState({
                    emptyPosXYInGrid: emptyPosXYInGrid,
                })
            }

            renderGridLayoutForCluster() {
                return (
                    <ResponsiveReactGridLayout
                        isResizable={true}
                        draggableHandle=".draggable"
                        verticalCompact={true}
                        compactType={'vertical'}
                        preventCollision={true}
                        isDraggable={true}
                        autoSize={true}
                        style={{backgroundColor: this.props.themeType === THEME_TYPE.LIGHT ? 'white' : null}}
                        className='layout page_monitoring_layout_dev'
                        cols={{lg: 4, md: 4, sm: 4, xs: 4, xxs: 4}}
                        layout={this.state.layoutForCluster}
                        rowHeight={this.gridItemHeight}
                        onResizeStop={(layout: Layout, oldItem: LayoutItem, newItem: LayoutItem, placeholder: LayoutItem, e: MouseEvent, element: HTMLElement) => {
                            let width = newItem.w;
                            this.setState({
                                isResizeComplete: !this.state.isResizeComplete,
                                currentWidgetWidth: width,
                            })
                        }}
                        onLayoutChange={async (layout) => {
                            this.setState({
                                layoutForCluster: layout,
                            }, async () => {
                                await this.calculateEmptyPosInGrid(layout, defaultLayoutXYPosForCluster);
                                reactLocalStorage.setObject(getUserId() + "_layout", layout)
                            });

                        }}
                        {...this.props}
                    >
                        {this.state.layoutForCluster.map((item, loopIndex) => {

                            const uniqueIndex = item.i;
                            let hwType = HARDWARE_TYPE.CPU
                            let graphType = GRID_ITEM_TYPE.LINE;
                            if (!isEmpty(this.state.layoutMapperForCluster.find(x => x.id === uniqueIndex))) {
                                hwType = this.state.layoutMapperForCluster.find(x => x.id === uniqueIndex).hwType
                                graphType = this.state.layoutMapperForCluster.find(x => x.id === uniqueIndex).graphType
                                graphType = graphType.toUpperCase()
                            }
                            return this.makeGridItemOne(uniqueIndex, hwType, graphType, item)
                        })}

                    </ResponsiveReactGridLayout>

                )
            }


            renderGridLayoutForAppInst = () => {
                return (
                    <ResponsiveReactGridLayout
                        verticalCompact={true}
                        compactType={'vertical'}
                        preventCollision={true}
                        isResizable={true}
                        draggableHandle=".draggable"
                        isDraggable={true}
                        useCSSTransforms={true}
                        className={'layout page_monitoring_layout_dev'}
                        cols={{lg: 3, md: 3, sm: 3, xs: 3, xxs: 3}}
                        layout={this.state.layoutForAppInst}
                        rowHeight={this.gridItemHeight}
                        onLayoutChange={async (layout) => {
                            await this.setState({
                                layoutForAppInst: layout
                            }, async () => {
                                await this.calculateEmptyPosInGrid(layout, defaultLayoutXYPosForAppInst);
                                let layoutUniqueId = getUserId() + "_layout2"
                                reactLocalStorage.setObject(layoutUniqueId, this.state.layoutForAppInst)
                            });

                        }}
                    >
                        {this.state.layoutForAppInst.map((item, loopIndex) => {

                            const uniqueIndex = item.i;
                            let hwType = HARDWARE_TYPE.CPU
                            let graphType = GRID_ITEM_TYPE.LINE;

                            if (!isEmpty(this.state.layoutMapperForAppInst.find(x => x.id === uniqueIndex))) {
                                hwType = this.state.layoutMapperForAppInst.find(x => x.id === uniqueIndex).hwType
                                graphType = this.state.layoutMapperForAppInst.find(x => x.id === uniqueIndex).graphType
                            }
                            return this.makeGridItemOne(uniqueIndex, hwType, graphType, item)

                        })}
                    </ResponsiveReactGridLayout>
                )
            }


            makeActionMenuListItems = () => {
                return (
                    <AMenu>
                        {/*desc:#########################################*/}
                        {/*desc:Fetch Locally Stored Data                */}
                        {/*desc:#########################################*/}
                        <AMenu.Item
                            style={{display: 'flex'}}
                            key="1"
                            onClick={async () => {
                                await this.handleClusterDropdown_Reset('')
                            }}
                        >
                            <MaterialIcon icon={'history'} color={'white'}/>
                            <div style={PageMonitoringStyles.listItemTitle}>
                                Fetch Locally Stored Data
                            </div>
                        </AMenu.Item>
                        <AMenu.Item style={{display: 'flex'}}
                                    key="1"
                                    onClick={() => {
                                        this.setState({
                                            isOpenEditView: true,
                                        })
                                    }}
                        >
                            <MaterialIcon icon={'add'} color={'white'}/>
                            <div style={PageMonitoringStyles.listItemTitle}>
                                Add Item
                            </div>
                        </AMenu.Item>
                        {/*<AMenu.Item style={{display: 'flex'}}
                        key="1"
                        onClick={() => {
                        this.setState({
                        isOpenEditView2: true,
                        })
                        }}
                        >
                        <MaterialIcon icon={'add'} color={'white'}/>
                        <div style={PageMonitoringStyles.listItemTitle}>
                        Add Item for test
                        </div>
                        </AMenu.Item>*/}
                        {/*desc:#########################################*/}
                        {/*desc:Reload                                  */}
                        {/*desc:#########################################*/}
                        <AMenu.Item style={{display: 'flex'}}
                                    key="1"
                                    onClick={async () => {
                                        if (!this.state.loading) {
                                            this.reloadDataFromRemote();
                                        } else {
                                            showToast('Currently loading, you can\'t request again.')
                                        }
                                    }}
                        >
                            <MaterialIcon icon={'refresh'} color={'white'}/>
                            <div style={PageMonitoringStyles.listItemTitle}>
                                Reload
                            </div>
                        </AMenu.Item>

                        {/*desc: ######################*/}
                        {/*desc: Revert to default Layout*/}
                        {/*desc: ######################*/}
                        <AMenu.Item style={{display: 'flex'}}
                                    key="1"
                                    onClick={async () => {
                                        await revertToDefaultLayout(this);
                                    }}
                        >
                            <MaterialIcon icon={'grid_on'} color={'white'}/>
                            <div style={PageMonitoringStyles.listItemTitle}>
                                Revert To The Default Layout
                            </div>
                        </AMenu.Item>
                        {/*desc: ######################*/}
                        {/*desc:Stacked Line Chart     */}
                        {/*desc: ######################*/}
                        <AMenu.Item style={{display: 'flex'}}
                                    key="1"
                                    onClick={() => {
                                        this.setState({
                                            isStackedLineChart: !this.state.isStackedLineChart,
                                        }, () => {
                                            //alert(this.state.isStackedLineChart)
                                        })
                                    }}
                        >
                            <MaterialIcon icon={'show_chart'} color={'white'}/>
                            <div style={PageMonitoringStyles.listItemTitle}>
                                Stacked Line Chart
                            </div>
                            <div style={PageMonitoringStyles.listItemTitle}>
                                <CustomSwitch
                                    size="small"
                                    checked={this.state.isStackedLineChart}
                                    color="primary"

                                />
                            </div>
                        </AMenu.Item>
                        {/*desc:#########################################*/}
                        {/*desc:____Menu Changing Graph Theme Color_____ */}
                        {/*desc:#########################################*/}
                        <ASubMenu
                            key="sub3"
                            title={
                                <div style={{display: 'flex'}}>
                                    <MaterialIcon icon={'invert_colors'} color={'white'}/>
                                    <div style={PageMonitoringStyles.listItemTitle}>Change The Graph Theme</div>
                                </div>
                            }
                        >
                            {THEME_OPTIONS_LIST.map(item => {
                                return (
                                    <AMenu.Item
                                        key="1"
                                        onClick={async () => {
                                            await this.setState({
                                                themeTitle: item.value
                                            })
                                            await handleThemeChanges(item.value, this)
                                        }}
                                    >
                                        {item.text}
                                    </AMenu.Item>
                                )
                            })}
                        </ASubMenu>
                        {/*desc: ######################*/}
                        {/*desc: ShowAppInstClient             */}
                        {/*desc: ######################*/}
                        <AMenu.Item style={{display: 'flex'}}
                                    key="1"
                                    onClick={() => {

                                        this.setState({
                                            showAppInstClient: !this.state.showAppInstClient,
                                        })

                                    }}
                        >
                            <MaterialIcon icon={'stay_current_portrait'} color={'white'}/>
                            <div style={PageMonitoringStyles.listItemTitle}>
                                Show Client Attached to App Instance
                            </div>
                            <div style={PageMonitoringStyles.listItemTitle}>
                                <CustomSwitch
                                    size="small"
                                    checked={this.state.showAppInstClient}
                                    color="primary"
                                />
                            </div>
                        </AMenu.Item>
                    </AMenu>
                )
            }

            renderHeader = () => {
                return (
                    <>
                        <Toolbar className='monitoring_title' style={{marginTop: -5}}>
                            <label className='content_title_label' style={{marginBottom: 1}}>Monitoring</label>
                            <div className='page_monitoring_select_area'
                                 style={{
                                     width: 'fit-content',
                                     flex: .7,
                                     //backgroundColor: 'red',
                                 }}>
                                <div>
                                    {this.makeClusterDropdown()}
                                </div>
                                <div>
                                    {this.makeAppInstDropdown()}
                                </div>
                                {this.state.intervalLoading &&
                                <div>
                                    <div style={{marginLeft: 10, marginRight: 1,}}>
                                        {renderWifiLoader()}
                                    </div>
                                </div>
                                }
                            </div>
                            {/*
                        desc :####################################
                        desc :loading Area
                        desc :####################################
                        */}
                            <div>

                                {this.state.webSocketLoading &&
                                <div>
                                    <div style={{marginLeft: 15}}>
                                        <CircularProgress
                                            style={{
                                                color: 'green',
                                                zIndex: 9999999,
                                            }}
                                            size={45}
                                        />
                                    </div>
                                </div>
                                }
                                {this.props.isLoading &&
                                <div>
                                    <div style={{marginLeft: 15}}>
                                        <CircularProgress
                                            style={{
                                                color: 'green',
                                                zIndex: 9999999,
                                                fontSize: 10
                                            }}
                                            size={20}
                                        />
                                    </div>
                                </div>
                                }
                            </div>
                            {/*
                        desc :####################################
                        desc : options list (right conner)
                        desc :####################################
                        */}
                            <div style={{
                                display: 'flex',
                                flex: .3,
                                justifyContent: 'flex-end',
                                //backgroundColor: 'yellow'
                            }}>
                                {/*
                                todo :####################################
                                todo : Clusterstream toggle button
                                todo :####################################
                                */}
                                {this.state.currentClassification === CLASSIFICATION.CLUSTER &&
                                <div style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    cursor: 'pointer',
                                    //backgroundColor: 'red',
                                    height: 30,
                                    width: 150,
                                    marginRight: 20,
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <div style={PageMonitoringStyles.listItemTitle}>
                                        {/*Cluster*/} Stream
                                    </div>
                                    <div style={PageMonitoringStyles.listItemTitle}>
                                        <CustomSwitch
                                            size="small"
                                            checked={this.state.isStream}
                                            color="primary"
                                            onChange={async () => {
                                                await this.setState({
                                                    isStream: !this.state.isStream,
                                                });
                                                if (!this.state.isStream) {
                                                    clearInterval(this.intervalForAppInst)
                                                    clearInterval(this.intervalForCluster)
                                                } else {
                                                    await this.handleClusterDropdown_Reset(this.state.currentCluster)
                                                }
                                            }}

                                        />
                                    </div>
                                </div>
                                }

                                {/*
                                desc :####################################
                                desc : appInst stream toggle button
                                desc :####################################
                                */}
                                {this.state.currentClassification === CLASSIFICATION.APPINST &&
                                <div style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    cursor: 'pointer',
                                    //backgroundColor: 'red',
                                    height: 30,
                                    width: 170,
                                    marginRight: 20,
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <div style={PageMonitoringStyles.listItemTitle}>
                                        {/*App Inst*/} Stream
                                    </div>
                                    <div style={PageMonitoringStyles.listItemTitle}>
                                        <CustomSwitch
                                            size="small"
                                            checked={this.state.isStream}
                                            color="primary"
                                            onChange={async () => {
                                                await this.setState({
                                                    isStream: !this.state.isStream,
                                                });

                                                if (!this.state.isStream) {
                                                    clearInterval(this.intervalForAppInst)
                                                } else {
                                                    await this.handleAppInstDropdown(this.state.currentAppInst, true)
                                                }
                                            }}

                                        />
                                    </div>
                                </div>
                                }
                                {this.makeTopRightMenuActionButton()}
                            </div>
                        </Toolbar>
                    </>

                )
            }

            makeTopRightMenuActionButton() {
                return (
                    <div style={{
                        alignItems: 'center',
                        display: 'flex',
                        cursor: 'pointer',
                        //backgroundColor: 'red',
                        height: 30, width: 30,
                        alignSelf: 'center',
                        justifyContent: 'center',
                    }}>

                        <ADropdown
                            overlay={this.makeActionMenuListItems}
                            trigger={['click']}
                        >
                            <div
                                className="ant-dropdown-link"
                                style={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    cursor: 'pointer',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    width: 150,
                                    //backgroundColor: 'red'
                                }}
                                onClick={e => e.preventDefault()}
                            >
                                <MaterialIcon
                                    size={25}
                                    color={this.props.themeType === 'dark' ? 'rgb(118, 255, 3)' : 'blue'}
                                    //color={'#559901'}
                                    icon="list"
                                />
                            </div>
                        </ADropdown>
                    </div>
                )
            }

            async filterClusterList(value) {

                let selectedCluster = value.split('|')[0].trim()
                let selectedCloudlet = value.split('|')[1].trim()
                let allClusterList = this.state.clusterList
                let selectedClusterList = []
                allClusterList.filter(item => {
                    if (item.ClusterName === selectedCluster && item.Cloudlet === selectedCloudlet) {
                        selectedClusterList.push(item);
                    }
                })

                await this.setState({
                    filteredClusterList: selectedClusterList,
                })
            }


            makeClusterDropdown() {
                return (
                    <div className="page_monitoring_dropdown_box" style={{alignSelf: 'center', justifyContent: 'center'}}>
                        <div
                            className="page_monitoring_dropdown_label"
                            style={{
                                marginLeft: this.state.isShowFilter ? 0 : 10
                            }}
                        >
                            Cluster | Cloudlet
                        </div>
                        <Dropdown
                            selectOnBlur={false}
                            value={this.state.currentCluster}
                            clearable={this.state.clusterSelectBoxClearable}
                            disabled={this.state.loading}
                            placeholder={this.state.clusterSelectBoxPlaceholder}
                            selection
                            loading={this.state.loading}
                            options={this.state.clusterDropdownList}
                            style={PageMonitoringStyles.dropDownForClusterCloudlet}
                            onChange={async (e, {value}) => {
                                clearInterval(this.intervalForCluster)
                                clearInterval(this.intervalForAppInst)
                                //@desc: If you are choosing the whole cluster ...
                                if (value === '') {
                                    await this.setState({
                                        filteredClusterList: this.state.clusterList,
                                    })
                                } else {
                                    await this.filterClusterList(value)
                                }
                                await this.handleClusterDropdown_Reset(value.trim())
                            }}
                        />
                    </div>
                )
            }

            makeAppInstDropdown() {
                return (
                    <div className="page_monitoring_dropdown_box" style={{alignSelf: 'center', justifyContent: 'center'}}>
                        <div className="page_monitoring_dropdown_label">
                            App Inst
                        </div>
                        <Dropdown
                            selectOnBlur={false}
                            disabled={this.state.currentCluster === '' || this.state.loading || this.state.appInstDropdown.length === 0}
                            clearable={this.state.appInstSelectBoxClearable}
                            loading={this.state.loading}
                            value={this.state.currentAppInst}
                            placeholder={this.state.appInstSelectBoxPlaceholder}
                            selection
                            // style={PageMonitoringStyles.dropDown}
                            options={this.state.allAppInstDropdown}
                            onChange={async (e, {value}) => {
                                await this.handleAppInstDropdown(value.trim())
                            }}
                            style={PageMonitoringStyles.dropDownForAppInst}
                        />
                    </div>
                )
            }

            reduceLegendClusterName(item) {
                if (this.state.chunkedSize === 12) {
                    return reduceString(item.cluster, 5) + "[" + reduceString(item.cloudlet, 5) + "]"
                } else {//when legend expanded
                    return reduceString(item.cluster, 23) + "[" + reduceString(item.cloudlet, 23) + "]"
                }
            }


            makeLegend() {
                const chunkedSize = this.state.chunkedSize;

                //@todo: ##############################
                //@todo: chunked array,
                //@todo: ##############################
                let chunkArrayClusterUsageList = _.chunk(this.state.filteredClusterUsageList, chunkedSize);

                let fullClusterList = '';
                let region = '';
                if (this.state.currentCluster) {
                    let cluster = this.state.currentCluster.split(" | ")[0]
                    let cloudlet = this.state.currentCluster.split(" | ")[1]
                    region = this.state.currentCluster.split(" | ")[2]
                    fullClusterList = cloudlet + " > " + cluster;
                }

                let legendHeight = 26

                if (this.state.loading) {
                    return (
                        <Legend style={{height: legendHeight}}>
                            <div style={{
                                display: 'flex',
                                alignSelf: 'center',
                                position: 'absolute',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: 30,
                                //backgroundColor: 'red'
                            }}>
                                <ColorLinearProgress
                                    variant={'query'}
                                    style={{
                                        marginLeft: -10,
                                        width: '7%',
                                        alignContent: 'center',
                                        justifyContent: 'center',
                                    }}
                                />
                            </div>
                        </Legend>
                    )
                } else {
                    return (
                        <Legend style={{height: this.state.isLegendExpanded && this.state.currentClassification === CLASSIFICATION.CLUSTER ? chunkArrayClusterUsageList.length * legendHeight : legendHeight}}>

                            {!this.state.loading && this.state.currentClassification === CLASSIFICATION.CLUSTER ?

                                <div style={{flex: .97, marginTop: -3,}}>
                                    {chunkArrayClusterUsageList.map((itemList, outerIndex) => {
                                        return (
                                            //todo: ################################
                                            //todo: oneROW
                                            //todo: ################################
                                            <div style={{display: 'flex', marginTop: 0, marginLeft: 5, backgroundColor: 'transparent', height: 22,}}>
                                                {itemList.map((item, index) => {
                                                    return (

                                                        //todo: ################################
                                                        //todo: cluster cell one
                                                        //todo: ################################
                                                        <Center2 style={{width: chunkedSize === 12 ? 135 : 390, backgroundColor: 'transparent'}}>
                                                            {/*desc: ##############*/}
                                                            {/*desc: circle area   */}
                                                            {/*desc: ##############*/}
                                                            <div
                                                                style={{
                                                                    backgroundColor: this.state.chartColorList[index + (outerIndex * chunkedSize)],
                                                                    width: 15,
                                                                    height: 15,
                                                                    borderRadius: 50,
                                                                    marginTop: 3,
                                                                }}
                                                                title={item.cluster + " [" + item.cloudlet + "]"}
                                                            >

                                                            </div>

                                                            {!this.state.isLegendExpanded ?
                                                                <Tooltip placement="top" title={item.cluster + " [" + item.cloudlet + "]"}>
                                                                    <ClusterCluoudletLable
                                                                        style={{
                                                                            marginLeft: 4,
                                                                            marginRight: 10,
                                                                            marginBottom: 0,
                                                                            cursor: 'pointer',
                                                                            marginTop: 2,
                                                                        }}
                                                                    >
                                                                        {this.reduceLegendClusterName(item)}
                                                                    </ClusterCluoudletLable>
                                                                </Tooltip>
                                                                :
                                                                <ClusterCluoudletLable
                                                                    style={{
                                                                        marginLeft: 4,
                                                                        marginRight: 10,
                                                                        marginBottom: 0,
                                                                        cursor: 'pointer',
                                                                        marginTop: 2,


                                                                    }}
                                                                    title={item.cluster + " [" + item.cloudlet + "]"}
                                                                >
                                                                    {this.reduceLegendClusterName(item)}
                                                                </ClusterCluoudletLable>
                                                            }
                                                        </Center2>

                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div> :
                                !this.state.loading && this.state.currentClassification === CLASSIFICATION.APPINST &&
                                <div style={{
                                    display: 'flex',
                                    flex: .975,
                                    justifyContent: 'center',
                                    marginLeft: 0,
                                    backgroundColor: 'transparent',
                                    marginTop: 3,
                                    width: '98.2%',
                                }}>
                                    <div style={{backgroundColor: 'transparent'}}>
                                        <div style={{
                                            backgroundColor: this.state.chartColorList[0],
                                            width: 15,
                                            height: 15,
                                            borderRadius: 50,
                                            marginTop: -2,
                                        }}>
                                        </div>
                                    </div>
                                    <ClusterCluoudletLable
                                        style={{marginLeft: 5, marginRight: 15, marginBottom: 2}}>
                                        {this.state.currentAppInst.split("|")[0]}
                                    </ClusterCluoudletLable>
                                </div>

                            }

                            {/*todo: ################################*/}
                            {/*todo:unfold_more_less_icon            */}
                            {/*todo: ################################*/}
                            {!this.state.loading && this.state.currentClassification === CLASSIFICATION.CLUSTER &&
                            <div
                                style={{
                                    display: 'flex',
                                    flex: .025,
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginLeft: 0,
                                    marginRight: -15,
                                    cursor: 'pointer',
                                    //backgroundColor: 'blue',
                                }}
                                onClick={() => {
                                    if (this.state.chunkedSize === 12) {
                                        this.setState({
                                            isLegendExpanded: true,
                                            chunkedSize: 4,
                                        })
                                    } else {
                                        this.setState({
                                            isLegendExpanded: false,
                                            chunkedSize: 12,
                                        })
                                    }
                                }}
                            >
                                {this.state.isLegendExpanded ?
                                    <div style={{display: 'flex', alignSelf: 'flex-start'}}>
                                        <UnfoldLess style={{fontSize: 18,}}/>
                                    </div>
                                    :
                                    <UnfoldMore style={{fontSize: 18, color: chunkArrayClusterUsageList.length > 1 ? 'rgb(118, 255, 3)' : 'white'}}/>
                                }
                            </div>
                            }

                        </Legend>
                    )
                }
            }


            render() {
                if (this.state.isNoData) {
                    return (
                        <div style={{width: '100%', height: '100%',}}>
                            {this.renderHeader()}
                            <div style={{marginTop: 25, marginLeft: 25, background: 'none'}}>
                                <div style={{fontSize: 25, color: 'rgba(255,255,255,.6)'}}>
                                    There is no app instance you can access..
                                </div>
                            </div>
                        </div>
                    )
                }

                return (
                    <div style={{
                        width: this.state.currentWidth,
                        height: '100%',
                    }}>

                        <AddItemPopupContainer parent={this} isOpenEditView={this.state.isOpenEditView}/>
                        <AddItemPopupContainer2 parent={this} isOpenEditView2={this.state.isOpenEditView2}/>
                        <MiniModalGraphContainer selectedClusterUsageOne={this.state.selectedClusterUsageOne}
                                                 selectedClusterUsageOneIndex={this.state.selectedClusterUsageOneIndex}
                                                 parent={this}
                                                 modalIsOpen={this.state.modalIsOpen}
                                                 cluster={''} contents={''}/>

                        <BigModalGraphContainer
                            intervalLoading={this.state.intervalLoading}
                            chartDataForBigModal={this.state.chartDataForBigModal}
                            isShowBigGraph={this.state.isShowBigGraph}
                            parent={this}
                            popupGraphHWType={this.state.popupGraphHWType}
                            graphType={this.state.popupGraphType}
                            isPopupMap={this.state.isPopupMap}
                            appInstanceListGroupByCloudlet={this.state.appInstanceListGroupByCloudlet}
                            selectedClientLocationListOnAppInst={this.state.selectedClientLocationListOnAppInst}
                            loading={this.state.loading}
                        />

                        <div style={{
                            width: '100%',
                            height: '100%',
                        }}>
                            <div style={{
                                width: '100%',
                                height: '100%',
                            }}>
                                {/*desc:---------------------------------*/}
                                {/*desc:Content Header                   */}
                                {/*desc:---------------------------------*/}
                                <SemanticToastContainer position={"bottom-center"} color={'red'}/>
                                {this.renderHeader()}
                                {/*desc:---------------------------------*/}
                                {/*desc:Legend                           */}
                                {/*desc:---------------------------------*/}
                                {this.makeLegend()}
                                <div className="page_monitoring"
                                     style={{
                                         overflowY: 'auto',
                                         height: 'calc(100% - 99px)',
                                         marginTop: 0,
                                         marginRight: 50,
                                         backgroundColor: this.props.themeType === 'light' ? 'white' : null
                                     }}>
                                    {this.state.currentClassification === CLASSIFICATION.CLUSTER
                                        ? this.renderGridLayoutForCluster()
                                        : this.renderGridLayoutForAppInst()
                                    }
                                </div>
                            </div>
                            {/*todo:---------------------------------*/}
                            {/*todo:terminal button                   */}
                            {/*todo:---------------------------------*/}
                            {this.state.currentClassification === CLASSIFICATION.APPINST && this.state.terminalData ?
                                <div className='page_monitoring_terminal_button' style={{marginBottom: 10}}
                                     onClick={() => this.setState({openTerminal: true})}
                                >
                                </div>
                                : null
                            }
                        </div>
                        <Modal style={{width: '100%', height: '100%'}} open={this.state.openTerminal}>
                            <TerminalViewer data={this.state.terminalData} onClose={() => {
                                this.setState({openTerminal: false})
                            }}/>
                        </Modal>
                    </div>

                )//return End
            }
        }
    ))
)
