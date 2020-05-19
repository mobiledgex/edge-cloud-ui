import {ClusterCluoudletLabel, LegendOuterDiv, PageMonitoringStyles} from '../common/PageMonitoringStyles'
import Ripple from "react-ripples";
import {SemanticToastContainer} from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {withSize} from 'react-sizeme';
import {connect} from 'react-redux';
import {Dialog, Toolbar} from '@material-ui/core'
import {Col, Dropdown as ADropdown, Menu as AMenu, Row, Select, TreeSelect} from 'antd';
import {
    filterByClassification,
    getCloudletClusterNameList,
    getOnlyCloudletName,
    getUserId,
    handleThemeChanges,
    makeBarChartDataForAppInst,
    makeBarChartDataForCluster,
    makeClusterTreeDropdown,
    makeDropdownForAppInst,
    makeDropdownForCloudlet,
    makeid,
    makeLineChartData,
    makeLineChartDataForBigModal,
    reduceLegendClusterCloudletName,
    reduceString,
    revertToDefaultLayout,
} from "../service/PageMonitoringService";
import {
    ADD_ITEM_LIST,
    APP_INST_MATRIX_HW_USAGE_INDEX,
    CHART_COLOR_LIST,
    CLASSIFICATION,
    GRID_ITEM_TYPE,
    HARDWARE_OPTIONS_FOR_APPINST,
    HARDWARE_OPTIONS_FOR_CLUSTER,
    HARDWARE_TYPE,
    NETWORK_TYPE,
    RECENT_DATA_LIMIT_COUNT,
    THEME_OPTIONS_LIST,
    USER_TYPE
} from "../../../../shared/Constants";
import type {TypeBarChartData, TypeCloudlet, TypeCloudletUsage, TypeCluster, TypeClusterUsageList, TypeGridInstanceList, TypeLineChartData, TypeUtilization} from "../../../../shared/Types";
import {TypeAppInstance} from "../../../../shared/Types";
import moment from "moment";
import {getOneYearStartEndDatetime, isEmpty, makeBubbleChartDataForCluster, renderPlaceHolderLoader, renderWifiLoader, showToast} from "../service/PageMonitoringCommonService";
import {fetchAppInstList, fetchCloudletList, fetchClusterList, getAppLevelUsageList, getClientStatusList, getClusterLevelUsageList, requestShowAppInstClientWS} from "../service/PageMonitoringMetricService";
import * as reducer from "../../../../utils";
import TerminalViewer from "../../../../container/TerminalViewer";
import MiniModalGraphContainer from "../components/MiniModalGraphContainer";
import {reactLocalStorage} from "reactjs-localstorage";
import MapForDevContainer from "../components/MapForDev";
import {Responsive, WidthProvider} from "react-grid-layout";
import _ from "lodash";
import BigModalGraphContainer from "../components/BigModalGraphContainer";
import BubbleChartContainer from "../components/BubbleChartContainer";
import LineChartContainer from "../components/LineChartContainer";
import ClusterEventLogListHook from "../components/ClusterEventLogListHook";
import MaterialIcon from "material-icons-react";
import '../common/PageMonitoringStyles.css'
import AddItemPopupContainer from "../components/AddItemPopupContainer";
import type {Layout, LayoutItem} from "react-grid-layout/lib/utils";
import {THEME_TYPE} from "../../../../themeStyle";
import BarChartContainer from "../components/BarChartContainer";
import PerformanceSummaryForCluster from "../components/PerformanceSummaryForCluster";
import PerformanceSummaryForAppInst from "../components/PerformanceSummaryForAppInst";
import {UnfoldLess, UnfoldMore} from '@material-ui/icons';
import AppInstEventLogListContainer from "../components/AppInstEventLogListContainer";
import {fields} from '../../../../services/model/format'
import type {PageMonitoringProps} from "../common/PageMonitoringProps";
import {ColorLinearProgress, CustomSwitch, PageDevMonitoringMapDispatchToProps, PageDevMonitoringMapStateToProps} from "../common/PageMonitoringProps";
import {
    APPINST_HW_MAPPER_KEY,
    APPINST_LAYOUT_KEY,
    CLOUDLET_HW_MAPPER_KEY,
    CLOUDLET_LAYOUT_KEY,
    CLUSTER_HW_MAPPER_KEY,
    CLUSTER_LAYOUT_KEY,
    CLUSTER_OPER_HW_MAPPER_KEY,
    CLUSTER_OPER_LAYOUT_KEY,
    defaultHwMapperListForCluster,
    defaultLayoutForAppInst,
    defaultLayoutForCloudlet,
    defaultLayoutForCluster,
    defaultLayoutForClusterForOper,
    defaultLayoutMapperForAppInst,
    defaultLayoutMapperForCloudlet,
    defaultLayoutMapperForClusterForOper,
    defaultLayoutXYPosForAppInst,
    defaultLayoutXYPosForCloudlet,
    defaultLayoutXYPosForCluster,
    defaultLayoutXYPosForClusterForOper
} from "../common/PageMonitoringLayoutProps";
import MapForOper from "../components/MapForOper";
import DonutChartHooks from "../components/DonutChartHooks";
import ClientSummaryHooks from "../components/ClientSummaryHooks";
import MethodUsageCount from "../components/MethodUsageCount";
import {filteredClientStatusListByAppName} from "../service/PageAdmMonitoringService";

const {Option} = Select;
const ASubMenu = AMenu.SubMenu;
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const FontAwesomeIcon = require('react-fontawesome')
type PageDevMonitoringState = {
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
    clusterUsageList: any,
    filteredCpuUsageList: any,
    filteredMemUsageList: any,
    filteredDiskUsageList: any,
    filteredNetworkUsageList: any,
    counter: number,
    appInstList: Array<TypeAppInstance>,
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
    maxCpu: number,
    maxMem: number,
    intervalLoading: boolean,
    isRequesting: false,
    clusterDropdownList: Array,
    currentClassification: string,
    cloudletList: Array,
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
    gridDraggable: boolean,
    diskGridItemOneStyleTranslate: string,
    layoutMapperForCluster: [],
    layoutMapperForAppInst: [],
    hwListForCluster: [],
    isDraggable: boolean,
    isUpdateEnableForMap: boolean,
    isStream: boolean,
    gridLayoutMapperToHwList: [],
    hwListForAppInst: [],
    isShowBigGraph: boolean,
    popupGraphHWType: string,
    chartDataForRendering: any,
    popupGraphType: string,
    isPopupMap: boolean,
    chartColorList: Array,
    themeTitle: string,
    addItemList: any,
    themeOptions: any,
    isNoData: boolean,
    isBubbleChartMaked: boolean,
    allClusterEventLogList: any,
    filteredClusterEventLogList: any,
    isResizeComplete: boolean,
    allAppInstEventLogs: any,
    filteredAppInstEventLogs: any,
    isFixGrid: boolean,
    webSocketLoading: boolean,
    selectedClientLocationListOnAppInst: any,
    isMapUpdate: boolean,
    currentWidgetWidth: number,
    isOpenEditView: boolean,
    isFullScreenMap: boolean,
    isStackedLineChart: boolean,
    isGradientColor: boolean,
    clusterList: any,
    isShowFilter: boolean,
    currentNavigation: string,
    allAppInstDropdown: any,
    isShowAppInstPopup: boolean,
    isShowPopOverMenu: boolean,
    isOpenEditView2: boolean,
    showAppInstClient: boolean,
    filteredClusterList: any,
    chartDataForBigModal: any,
    //usageListForPerformanceSum: any,
    windowDimensions: number,
    currentWidth: number,
    emptyPosXYInGrid: any,
    emptyPosXYInGrid2: any,
    toastMessage: string,
    isToastOpen: boolean,
    mapLoading: boolean,
    legendHeight: number,
    isLegendExpanded: boolean,
    chunkedSize: number,
    selectedAppInstIndex: number,
    isOpenGlobe: boolean,
    legendColSize: number,
    currentAppVersion: number,
    isEnableZoomIn: boolean,
    dropDownCludsterListOnCloudlet: any,
    searchClusterValue: string,
    filteredCloudletList: any,
    allCloudletUsageList: any,
    filteredCloudletUsageList: any,
    toggleOperMapZoom: boolean,
    cloudletDropdownList: any,
    appInstList: any,
    filteredAppInstList: any,
    allClientStatusList: any,
    filteredClientStatusList: any,
    layoutMapperForClusterForOper: any,
    layoutForCloudlet: any,
    layoutForClusterForOper: any,
    layoutForCluster: any,
    layoutForAppInst: any,
}

export default withSize()(connect(PageDevMonitoringMapStateToProps, PageDevMonitoringMapDispatchToProps)((
        class PageDevMonitoring extends Component<PageMonitoringProps, PageDevMonitoringState> {
            intervalForAppInst = null;
            intervalForCluster = null;
            webSocketInst: WebSocket = null;
            gridItemHeight = 255;

            componentWillMount(): void {
                this.setState({
                    userType: localStorage.getItem('selectRole').toString().toLowerCase(),
                })
            }

            constructor(props) {
                super(props);

                let clusterLayoutKey = getUserId() + CLUSTER_LAYOUT_KEY
                let clusterHwMapperKey = getUserId() + CLUSTER_HW_MAPPER_KEY
                let appInstLayoutKey = getUserId() + APPINST_LAYOUT_KEY
                let appInstHwMapperKey = getUserId() + APPINST_HW_MAPPER_KEY

                let cloudletLayoutKey = getUserId() + CLOUDLET_LAYOUT_KEY
                let cloudletHwMapperKey = getUserId() + CLOUDLET_HW_MAPPER_KEY

                let clusterForOperLayoutKey = getUserId() + CLUSTER_OPER_LAYOUT_KEY
                let clusterForOperHwMapperKey = getUserId() + CLUSTER_OPER_HW_MAPPER_KEY

                let themeKey = getUserId() + "_mon_theme";
                let themeTitle = getUserId() + "_mon_theme_title";

                //@fixme: DELETE THEME COLOR
                /*reactLocalStorage.remove(clusterForOperLayoutKey)
                reactLocalStorage.remove(clusterForOperHwMapperKey)*/
                this.state = {

                    //todo:oper layout
                    layoutForCloudlet: isEmpty(reactLocalStorage.get(cloudletLayoutKey)) ? defaultLayoutForCloudlet : reactLocalStorage.getObject(cloudletLayoutKey),
                    layoutMapperForCloudlet: isEmpty(reactLocalStorage.get(cloudletHwMapperKey)) ? defaultLayoutMapperForCloudlet : reactLocalStorage.getObject(cloudletHwMapperKey),
                    layoutForClusterForOper: isEmpty(reactLocalStorage.get(clusterForOperLayoutKey)) ? defaultLayoutForClusterForOper : reactLocalStorage.getObject(clusterForOperLayoutKey),
                    layoutMapperForClusterForOper: isEmpty(reactLocalStorage.get(clusterForOperHwMapperKey)) ? defaultLayoutMapperForClusterForOper : reactLocalStorage.getObject(clusterForOperHwMapperKey),

                    //todo:dev layout
                    layoutForCluster: isEmpty(reactLocalStorage.get(clusterLayoutKey)) ? defaultLayoutForCluster : reactLocalStorage.getObject(clusterLayoutKey),
                    layoutMapperForCluster: isEmpty(reactLocalStorage.get(clusterHwMapperKey)) ? defaultHwMapperListForCluster : reactLocalStorage.getObject(clusterHwMapperKey),
                    layoutForAppInst: isEmpty(reactLocalStorage.get(appInstLayoutKey)) ? defaultLayoutForAppInst : reactLocalStorage.getObject(appInstLayoutKey),
                    layoutMapperForAppInst: isEmpty(reactLocalStorage.get(appInstHwMapperKey)) ? defaultLayoutMapperForAppInst : reactLocalStorage.getObject(appInstHwMapperKey),


                    date: '',
                    time: '',
                    dateTime: '',
                    datesRange: '',
                    appInstanceListGroupByCloudlet: [],
                    loading: false,
                    loading0: false,

                    clusterInstanceGroupList: [],
                    clusterList: [],
                    filteredCpuUsageList: [],
                    filteredMemUsageList: [],
                    filteredDiskUsageList: [],
                    filteredNetworkUsageList: [],
                    counter: 0,
                    appInstList: [],
                    allAppInstanceList: [],
                    appInstanceOne: {},
                    cloudLetSelectBoxPlaceholder: 'Select CloudLet',
                    clusterSelectBoxPlaceholder: 'Select Cluster',
                    appInstSelectBoxPlaceholder: 'Select App Inst',
                    currentRegion: 'ALL',
                    currentCloudLet: undefined,
                    currentCluster: undefined,
                    currentAppInst: undefined,
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
                    dropDownCludsterListOnCloudlet: undefined,
                    allUsageList: [],
                    maxCpu: 0,
                    maxMem: 0,
                    intervalLoading: false,
                    isRequesting: false,
                    clusterDropdownList: [],
                    currentClassification: localStorage.getItem('selectRole').toString().toLowerCase().includes("dev") ? CLASSIFICATION.CLUSTER : CLASSIFICATION.CLOUDLET,
                    selectOrg: '',
                    filteredAppInstList: [],
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
                    showAppInstClient: true,
                    filteredClusterList: [],
                    currentWidth: '100%',
                    emptyPosXYInGrid: {},
                    emptyPosXYInGrid2: {},
                    toastMessage: '',
                    isToastOpen: false,
                    mapLoading: false,
                    chunkedSize: 12,
                    selectedAppInstIndex: -1,
                    openTerminal: false,
                    isOpenGlobe: false,
                    isLegendExpanded: false,
                    legendColSize: 3,
                    currentAppVersion: undefined,
                    isEnableZoomIn: false,
                    searchClusterValue: '',
                    /////////////////////////
                    cloudletList: [],
                    filteredCloudletList: [],
                    allCloudletUsageList: [],
                    filteredCloudletUsageList: [],
                    cloudletDropdownList: [],
                    toggleOperMapZoom: false,
                    allClientStatusList: [],
                    filteredClientStatusList: []
                };
            }

            async componentWillReceiveProps(nextProps: PageMonitoringProps, nextContext: any): void {
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
                    dropdownRequestLoading: true

                })
                await this.loadInitData();
                this.setState({
                    loading: false,
                    bubbleChartLoader: false,
                })
            };


            async loadInitData(isInterval: boolean = false) {
                let promiseList = []
                let promiseList2 = []
                try {
                    clearInterval(this.intervalForAppInst)
                    //@desc:#############################################
                    //@desc: (clusterList, appnInstList, cloudletList)
                    //@desc:#############################################

                    //todo:realdata
                    promiseList.push(fetchCloudletList())
                    promiseList.push(fetchClusterList())
                    promiseList.push(fetchAppInstList())
                    let newPromiseList = await Promise.all(promiseList);
                    let cloudletList = newPromiseList[0];
                    let clusterList = newPromiseList[1];
                    let appInstList = newPromiseList[2];

                    //todo:fakedata
                    /*   let cloudletList = require('../temp/cloudletList')
                       let clusterList = require('../temp/clusterList')
                       let appInstList = require('../temp/appInstList')*/


                    if (this.state.userType.includes(USER_TYPE.OPERATOR)) {
                        let clientStatusList = await getClientStatusList(appInstList);
                        await this.setState({
                            allClientStatusList: clientStatusList,
                            filteredClientStatusList: clientStatusList,
                        })
                    }

                    let orgAppInstList = appInstList.filter((item: TypeAppInstance, index) => item.OrganizationName === localStorage.getItem('selectOrg'))
                    let nameList = getCloudletClusterNameList(orgAppInstList)
                    let clusterDropdownList = makeClusterTreeDropdown(_.uniqBy(nameList.cloudletNameList), _.uniqWith(nameList.clusterNameList, _.isEqual))
                    //@desc:#########################################################################
                    //@desc: map Marker
                    //@desc:#########################################################################
                    let markerListForMap = []
                    markerListForMap = reducer.groupBy(orgAppInstList, CLASSIFICATION.CLOUDLET);
                    await this.setState({
                        cloudletList: cloudletList,
                        filteredCloudletList: cloudletList,
                        appInstanceListGroupByCloudlet: !isInterval && markerListForMap,
                    });

                    //@desc:#########################################################################
                    //@desc: getAllClusterEventLogList, getAllAppInstEventLogs ,allClusterUsageList
                    //@desc:#########################################################################

                    //todo: realdata
                    /*promiseList2.push(getAllClusterEventLogList(clusterList))
                    promiseList2.push(getAllAppInstEventLogs());
                    promiseList2.push(getClusterLevelUsageList(clusterList, "*", RECENT_DATA_LIMIT_COUNT))
                    promiseList2.push(getCloudletUsageList(cloudletList, "*", RECENT_DATA_LIMIT_COUNT))
                    let newPromiseList2 = await Promise.all(promiseList2);
                    let allClusterEventLogList = newPromiseList2[0];
                    let allAppInstEventLogList = newPromiseList2[1];
                    let allClusterUsageList = newPromiseList2[2];
                    let allCloudletUsageList = newPromiseList2[3];*/

                    //fixme: fakedata
                    //fixme: fakedata
                    let allClusterEventLogList = []
                    let allAppInstEventLogList = []
                    let allClusterUsageList = require('../temp/clusterUSageList')
                    let allCloudletUsageList = require('../temp/cloudletUsageList')


                    let bubbleChartData = await makeBubbleChartDataForCluster(allClusterUsageList, HARDWARE_TYPE.CPU, this.state.chartColorList);
                    let maxCpu = Math.max.apply(Math, allClusterUsageList.map(function (o) {
                        return o.sumCpuUsage;
                    }));
                    let maxMem = Math.max.apply(Math, allClusterUsageList.map(function (o) {
                        return o.sumMemUsage;
                    }));

                    let cloudletDropdownList = makeDropdownForCloudlet(cloudletList)


                    await this.setState({
                        legendHeight: (Math.ceil(clusterList.length / 8)) * 30,
                        isNoData: appInstList.length === 0,
                        bubbleChartData: bubbleChartData,
                        allClusterEventLogList: allClusterEventLogList,
                        filteredClusterEventLogList: allClusterEventLogList,
                        allAppInstEventLogs: allAppInstEventLogList,
                        filteredAppInstEventLogs: allAppInstEventLogList,
                        isReady: true,
                        clusterDropdownList: clusterDropdownList,//@fixme
                        dropDownCludsterListOnCloudlet: clusterDropdownList,//@fixme
                        clusterList: clusterList,
                        filteredClusterList: clusterList,
                        isAppInstaceDataReady: true,
                        appInstList: appInstList,
                        filteredAppInstList: appInstList,
                        dropdownRequestLoading: false,
                        clusterListLoading: false,
                        allClusterUsageList: allClusterUsageList,
                        filteredClusterUsageList: allClusterUsageList,
                        maxCpu: maxCpu,
                        maxMem: maxMem,
                        isRequesting: false,
                        ///@desc: ----------cloudletList--------------
                        allCloudletUsageList: allCloudletUsageList,
                        filteredCloudletUsageList: allCloudletUsageList,
                        cloudletDropdownList: cloudletDropdownList,

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
                let markerListForMap = reducer.groupBy(this.state.appInstList.filter((item: TypeAppInstance, index) => item.OrganizationName === localStorage.getItem('selectOrg')), CLASSIFICATION.CLOUDLET);
                await this.setState({
                    currentGridIndex: -1,
                    currentTabIndex: 0,
                    intervalLoading: false,
                    currentClassification: CLASSIFICATION.CLUSTER,
                    filteredClusterUsageList: this.state.allClusterUsageList,
                    filteredAppInstList: this.state.appInstList,
                    filteredClusterEventLogList: this.state.allClusterEventLogList,
                    filteredAppInstEventLogs: this.state.allAppInstEventLogs,
                    appInstanceListGroupByCloudlet: markerListForMap,
                })
                //desc: reset bubble chart data
                let bubbleChartData = await makeBubbleChartDataForCluster(this.state.allClusterUsageList, HARDWARE_TYPE.CPU, this.state.chartColorList);
                await this.setState({
                    bubbleChartData: bubbleChartData,
                    dropdownRequestLoading: false,
                    currentCluster: undefined,
                    currentAppInst: undefined,
                    appInstDropdown: [],
                    isShowAppInstPopup: !this.state.isShowAppInstPopup,
                    isEnableZoomIn: !this.state.isEnableZoomIn,
                })
            }

            async reloadDataFromRemote() {
                clearInterval(this.intervalForAppInst)
                await this.setState({
                    currentClassification: this.state.userType.toString().includes("dev") ? CLASSIFICATION.CLUSTER : CLASSIFICATION.CLOUDLET,
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
                await this.loadInitData();
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
                        let tempAppInst = {}
                        tempAppInst[fields.region] = appInst[0].Region
                        tempAppInst[fields.runtimeInfo] = appInst[0].Runtime
                        tempAppInst[fields.organizationName] = appInst[0].OrganizationName
                        tempAppInst[fields.appName] = appInst[0].AppName
                        tempAppInst[fields.version] = appInst[0].Version
                        tempAppInst[fields.clusterName] = appInst[0].ClusterInst
                        tempAppInst[fields.operatorName] = appInst[0].Operator
                        tempAppInst[fields.cloudletName] = appInst[0].Cloudlet
                        this.setState({
                            terminalData: tempAppInst
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
                let lineChartDataSet = makeLineChartData(usageList, this.state.currentHardwareType, this)
                let chartDataForBigModal = makeLineChartDataForBigModal(lineChartDataSet, this)
                this.setState({
                    chartDataForBigModal: chartDataForBigModal,
                })
            }

            makeGridItemWidth(graphType) {
                if (graphType === GRID_ITEM_TYPE.PERFORMANCE_SUM) {
                    return 4;
                } else if (graphType === GRID_ITEM_TYPE.MAP) {
                    return 2;
                } else {
                    return 1;
                }
            }

            makeGridIItemHeight(graphType) {
                if (graphType === GRID_ITEM_TYPE.MAP) {
                    return 2;
                } else {
                    return 1;
                }
            }


            async addGridItem(hwType, graphType = 'line') {

                /*Cloudlet*/
                /*Cloudlet*/
                /*Cloudlet*/
                if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {

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
                    //@desc: ######################################
                    //@desc:  calculate empty space in gridLayout
                    //@desc: ######################################
                    await this.setState({
                        layoutForCloudlet: this.state.layoutForCluster.concat({
                            i: uniqueId,
                            x: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.x : 0,
                            y: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.y : maxY + 1,
                            w: this.makeGridItemWidth(graphType),
                            h: this.makeGridIItemHeight(graphType),
                        }),
                        layoutMapperForCluster: mapperList.concat(itemOne),
                    })

                    reactLocalStorage.setObject(getUserId() + CLUSTER_LAYOUT_KEY, this.state.layoutForCluster)
                    reactLocalStorage.setObject(getUserId() + CLUSTER_HW_MAPPER_KEY, this.state.layoutMapperForCluster)

                }
                //@desc: ##########################
                //@desc: CLUSTER
                //@desc: ##########################
                else if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {

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
                    //@desc: ######################################
                    //@desc:  calculate empty space in gridLayout
                    //@desc: ######################################
                    await this.setState({
                        layoutForCluster: this.state.layoutForCluster.concat({
                            i: uniqueId,
                            x: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.x : 0,
                            y: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.y : maxY + 1,
                            w: this.makeGridItemWidth(graphType),
                            h: this.makeGridIItemHeight(graphType),
                        }),
                        layoutMapperForCluster: mapperList.concat(itemOne),
                    })

                    reactLocalStorage.setObject(getUserId() + CLUSTER_LAYOUT_KEY, this.state.layoutForCluster)
                    reactLocalStorage.setObject(getUserId() + CLUSTER_HW_MAPPER_KEY, this.state.layoutMapperForCluster)

                } else {
                    //@desc: ##########################
                    //@desc: APPINST
                    //@desc: ##########################
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
                    reactLocalStorage.setObject(getUserId() + APPINST_LAYOUT_KEY, this.state.layoutForAppInst)
                    reactLocalStorage.setObject(getUserId() + APPINST_HW_MAPPER_KEY, this.state.layoutMapperForAppInst)
                }
            }

            removeGridItem(i) {
                if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                    let removedLayout = _.reject(this.state.layoutForCluster, {i: i});
                    reactLocalStorage.setObject(getUserId() + CLUSTER_LAYOUT_KEY, removedLayout)
                    this.setState({
                        layoutForCluster: removedLayout,
                    });

                } else if (this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER) {
                    let removedLayout = _.reject(this.state.layoutForClusterForOper, {i: i});
                    reactLocalStorage.setObject(getUserId() + CLUSTER_OPER_LAYOUT_KEY, removedLayout)
                    this.setState({
                        layoutForClusterForOper: removedLayout,
                    });
                } else if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                    let removedLayout = _.reject(this.state.layoutForCloudlet, {i: i});
                    reactLocalStorage.setObject(getUserId() + CLOUDLET_LAYOUT_KEY, removedLayout)
                    this.setState({
                        layoutForCloudlet: removedLayout,
                    });
                } else {//@desc: AppInst Level
                    let removedLayout = _.reject(this.state.layoutForAppInst, {i: i});
                    reactLocalStorage.setObject(getUserId() + APPINST_LAYOUT_KEY, removedLayout)
                    this.setState({
                        layoutForAppInst: removedLayout,
                    });
                }
            }


            removeGridAllItem() {
                if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                    reactLocalStorage.setObject(getUserId() + CLOUDLET_LAYOUT_KEY, [])
                    this.setState({
                        layoutForCloudlet: [],
                    });
                } else if (this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER) {
                    reactLocalStorage.setObject(getUserId() + CLUSTER_OPER_LAYOUT_KEY, [])
                    this.setState({
                        layoutForClusterForOper: [],
                    });
                } else if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                    reactLocalStorage.setObject(getUserId() + CLUSTER_LAYOUT_KEY, [])
                    this.setState({
                        layoutForCluster: [],
                    });
                } else {//@desc: AppInst Level
                    reactLocalStorage.setObject(getUserId() + APPINST_LAYOUT_KEY, [])
                    this.setState({
                        layoutForAppInst: [],
                    });
                }
            }


            showBigModal = (hwType, graphType) => {
                let chartDataSets = []
                if (graphType.toUpperCase() == GRID_ITEM_TYPE.LINE) {

                    let lineChartDataSet = []
                    if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                        lineChartDataSet = makeLineChartData(this.state.filteredClusterUsageList, hwType, this)
                    } else if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                        lineChartDataSet = makeLineChartData(this.state.filteredCloudletUsageList, hwType, this)
                    } else {
                        lineChartDataSet = makeLineChartData(this.state.filteredAppInstUsageList, hwType, this)
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
                                appInstanceListGroupByCloudlet: reducer.groupBy(this.state.appInstList, CLASSIFICATION.CLOUDLET),
                            });
                        }}
                    >
                        <div
                            className='draggable'
                            style={PageMonitoringStyles.gridItemHeader}>
                            {/*desc:############################*/}
                            {/*desc:    maximize button         */}
                            {/*desc:############################*/}
                            {graphType.toUpperCase() !== GRID_ITEM_TYPE.PERFORMANCE_SUM
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.BUBBLE
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.APP_INST_EVENT_LOG
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.CLUSTER_EVENTLOG_LIST
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.METHOD_USAGE_COUNT
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.DONUTS
                            && <div className="maxize page_monitoring_widget_icon"
                                    onClick={this.showBigModal.bind(this, hwType, graphType)}
                            >
                                <MaterialIcon size={'tiny'} icon='aspect_ratio' color={'white'}/>
                            </div>
                            }

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
                            {this._______________makeGridItemOneBody(hwType, graphType.toUpperCase())}
                        </div>
                    </div>
                )
            }

            _______________makeGridItemOneBody(hwType, graphType) {
                if (graphType.toUpperCase() === GRID_ITEM_TYPE.LINE) {
                    let chartDataSets: TypeLineChartData = [];
                    if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                        chartDataSets = makeLineChartData(this.state.filteredCloudletUsageList, hwType, this)
                    } else if (this.state.currentClassification === CLASSIFICATION.CLUSTER || this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER) {
                        chartDataSets = makeLineChartData(this.state.filteredClusterUsageList, hwType, this)
                    } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                        chartDataSets = makeLineChartData(this.state.filteredAppInstUsageList, hwType, this)
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

                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.BAR || graphType.toUpperCase() === GRID_ITEM_TYPE.COLUMN) {

                    let barChartDataSet: TypeBarChartData = [];
                    if (this.state.currentClassification === CLASSIFICATION.CLUSTER || this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER) {
                        barChartDataSet = makeBarChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
                    } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                        barChartDataSet = makeBarChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
                    }
                    if (barChartDataSet === undefined) {
                        barChartDataSet = []
                    }
                    return (<BarChartContainer isResizeComplete={this.state.isResizeComplete} parent={this}
                                               loading={this.state.loading} chartDataSet={barChartDataSet}
                                               pHardwareType={hwType} graphType={graphType}/>)

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

                    if (this.state.userType.includes(USER_TYPE.DEVELOPER)) {
                        return (
                            <MapForDevContainer
                                markerList={this.state.appInstanceListGroupByCloudlet}
                                currentWidgetWidth={this.state.currentWidgetWidth}
                                isMapUpdate={this.state.isMapUpdate}
                                selectedClientLocationListOnAppInst={this.state.selectedClientLocationListOnAppInst}
                                mapPopUploading={this.state.mapPopUploading}
                                parent={this}
                                isDraggable={this.state.isDraggable}
                                handleAppInstDropdown={this.handleOnChangeAppInstDropdown}
                                isFullScreenMap={false}
                                isShowAppInstPopup={this.state.isShowAppInstPopup}
                                selectedAppInstIndex={this.state.selectedAppInstIndex}
                                isEnableZoomIn={!this.state.isEnableZoomIn}
                            />
                        )
                    } else {
                        return (
                            <MapForOper
                                parent={this}
                                cloudletList={this.state.filteredCloudletList}
                                appInstList={this.state.filteredAppInstList}
                                toggleOperMapZoom={!this.state.toggleOperMapZoom}
                                filteredClusterList={this.state.filteredClusterList}
                            />
                        )
                    }

                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.PERFORMANCE_SUM) {
                    return (
                        this.state.loading ? renderPlaceHolderLoader() :
                            this.state.currentClassification === CLASSIFICATION.CLOUDLET ?
                                <ClientSummaryHooks
                                    parent={this}
                                    clientStatusList={this.state.filteredClientStatusList}
                                    chartColorList={this.state.chartColorList}
                                />
                                :
                                this.state.currentClassification === CLASSIFICATION.CLUSTER ?
                                    <PerformanceSummaryForCluster
                                        parent={this}
                                        filteredUsageList={this.state.filteredClusterUsageList}
                                        chartColorList={this.state.chartColorList}
                                    />
                                    :
                                    <PerformanceSummaryForAppInst
                                        parent={this}
                                        filteredUsageList={this.state.filteredAppInstUsageList}
                                        chartColorList={this.state.chartColorList}
                                    />

                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.CLUSTER_EVENTLOG_LIST) {
                    return (
                        <ClusterEventLogListHook eventLogList={this.state.filteredClusterEventLogList} parent={this}/>
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.APP_INST_EVENT_LOG) {
                    return this.state.loading ? renderPlaceHolderLoader() :
                        <AppInstEventLogListContainer
                            currentAppInst={this.state.currentAppInst}
                            parent={this}
                            handleAppInstDropdown={this.handleOnChangeAppInstDropdown}
                            eventLogList={this.state.filteredAppInstEventLogs}
                        />
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.DONUTS) {
                    return this.state.loading ? renderPlaceHolderLoader() :
                        <DonutChartHooks
                            currentClassification={this.state.currentClassification}
                            filteredUsageList={this.state.currentClassification === CLASSIFICATION.CLOUDLET ? this.state.filteredCloudletUsageList : this.state.filteredClusterUsageList}
                        />
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.METHOD_USAGE_COUNT) {
                    return this.state.loading ? renderPlaceHolderLoader() :
                        <MethodUsageCount
                            clientStatusList={this.state.filteredClientStatusList}
                        />
                }
            }

            calculateEmptyPosInGrid(layout, defaultLayoutXYPos) {
                let emptyLayoutPosXYList = []
                defaultLayoutXYPos.map((item) => {
                    let isItemExistInGridXYPos = false;
                    for (let j = 0; j < layout.length; j++) {
                        if (layout[j].x === item.x && layout[j].y === item.y) {
                            isItemExistInGridXYPos = true;
                            break;
                        }
                    }
                    if (isItemExistInGridXYPos === false) {
                        emptyLayoutPosXYList.push(item)
                    }
                })
                this.setState({
                    emptyPosXYInGrid: emptyLayoutPosXYList[0],//first cell in gridList
                })
            }

            _____renderGridLayoutForClusterDevOper() {

                if (this.state.userType.includes(USER_TYPE.DEVELOPER)) {
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
                            className='layout page_monitoring_layout_dev_oper'
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
                                    reactLocalStorage.setObject(getUserId() + CLUSTER_LAYOUT_KEY, layout)
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
                } else {//todo; operator

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
                            className='layout page_monitoring_layout_dev_oper'
                            cols={{lg: 4, md: 4, sm: 4, xs: 4, xxs: 4}}
                            layout={this.state.layoutForClusterForOper}
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
                                    await this.calculateEmptyPosInGrid(layout, defaultLayoutXYPosForClusterForOper);
                                    reactLocalStorage.setObject(getUserId() + CLUSTER_OPER_LAYOUT_KEY, layout)
                                });

                            }}
                            {...this.props}
                        >
                            {this.state.layoutForClusterForOper.map((item, loopIndex) => {
                                const uniqueIndex = item.i;
                                let hwType = HARDWARE_TYPE.CPU
                                let graphType = GRID_ITEM_TYPE.LINE;
                                if (!isEmpty(this.state.layoutMapperForClusterForOper.find(x => x.id === uniqueIndex))) {
                                    hwType = this.state.layoutMapperForClusterForOper.find(x => x.id === uniqueIndex).hwType
                                    graphType = this.state.layoutMapperForClusterForOper.find(x => x.id === uniqueIndex).graphType
                                    graphType = graphType.toUpperCase()
                                }

                                console.log(`item==${hwType}=>`, item);

                                return this.makeGridItemOne(uniqueIndex, hwType, graphType, item)
                            })}

                        </ResponsiveReactGridLayout>
                    )

                }


            }


            renderGridLayoutForCloudletForOper() {
                return (
                    <ResponsiveReactGridLayout
                        isResizable={true}
                        draggableHandle=".draggable"
                        verticalCompact={true}
                        compactType={'vertical'}
                        preventCollision={true}
                        isDraggable={true}
                        autoSize={true}
                        className='layout page_monitoring_layout_dev_oper'
                        cols={{lg: 4, md: 4, sm: 4, xs: 4, xxs: 4}}
                        layout={this.state.layoutForCloudlet}
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
                                await this.calculateEmptyPosInGrid(layout, defaultLayoutXYPosForCloudlet);
                                reactLocalStorage.setObject(getUserId() + CLOUDLET_LAYOUT_KEY, layout)
                            });

                        }}
                        {...this.props}
                    >
                        {this.state.layoutForCloudlet.map((item, loopIndex) => {

                            const uniqueIndex = item.i;
                            let hwType = HARDWARE_TYPE.CPU
                            let graphType = GRID_ITEM_TYPE.LINE;
                            if (!isEmpty(this.state.layoutMapperForCloudlet.find(x => x.id === uniqueIndex))) {
                                hwType = this.state.layoutMapperForCloudlet.find(x => x.id === uniqueIndex).hwType
                                graphType = this.state.layoutMapperForCloudlet.find(x => x.id === uniqueIndex).graphType
                                graphType = graphType.toUpperCase()
                            }
                            return this.makeGridItemOne(uniqueIndex, hwType, graphType, item)
                        })}

                    </ResponsiveReactGridLayout>

                )
            }


            renderGridLayoutForAppInstForDev = () => {
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
                                let layoutUniqueId = getUserId() + APPINST_LAYOUT_KEY;
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
                                {
                                    this.state.currentClassification === CLASSIFICATION.CLUSTER ?
                                        await this.handleOnChangeClusterDropdown(undefined)
                                        :
                                        await this.handleOnChangeCloudletDropdown(undefined)
                                }
                            }}
                        >
                            <MaterialIcon icon={'history'} color={'white'}/>
                            <div style={PageMonitoringStyles.listItemTitle}>
                                Fetch Locally Stored Data
                            </div>
                        </AMenu.Item>
                        {/*{this.state.currentClassification !== CLASSIFICATION.CLOUDLET &&
                        }*/}
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
                        {/*desc: ######################*/}
                        {/*desc:  Delete All Grid Item*/}
                        {/*desc: ######################*/}
                        <AMenu.Item style={{display: 'flex'}}
                                    key="1"
                                    onClick={async () => {
                                        await this.removeGridAllItem();
                                        showToast('All items deleted.')
                                    }}
                        >
                            <MaterialIcon icon={'delete'} color={'white'}/>
                            <div style={PageMonitoringStyles.listItemTitle}>
                                Delete All Grid Items
                            </div>
                        </AMenu.Item>
                    </AMenu>
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

            _______________________________________________________________________() {
            }


            handleOnChangeCloudletDropdown = async (pCloudletOne) => {
                if (pCloudletOne !== undefined) {
                    await this.setState({currentCloudLet: getOnlyCloudletName(pCloudletOne)})
                    let currentCloudletOne = this.state.currentCloudLet
                    let filteredClusterList = this.state.clusterList.filter((clusterOne: TypeCluster, index) => {
                        return clusterOne.Cloudlet === currentCloudletOne
                    })
                    let filteredClusterUsageList = this.state.allClusterUsageList.filter((clusterUsageOne: TypeClusterUsageList, index) => {
                        return clusterUsageOne.cloudlet === currentCloudletOne
                    })
                    let filteredCloudletUsageList = this.state.allCloudletUsageList.filter((item: TypeCloudletUsage, index) => {
                        return item.cloudlet === currentCloudletOne
                    })

                    let filteredCloudletList = this.state.cloudletList.filter((item: TypeCloudlet, index) => {
                        return item.CloudletName === currentCloudletOne
                    })


                    let filteredAppInstList = this.state.appInstList.filter((item: TypeAppInstance, index) => {
                        return item.Cloudlet === currentCloudletOne
                    })


                    let filteredClientStatusList = filteredClientStatusListByAppName(filteredAppInstList, this.state.allClientStatusList)

                    this.setState({
                        currentCloudLet: pCloudletOne,
                        filteredCloudletUsageList: filteredCloudletUsageList,
                        filteredCloudletList: filteredCloudletList,
                        filteredClusterList: filteredClusterList,
                        filteredClusterUsageList: filteredClusterUsageList,
                        filteredAppInstList: filteredAppInstList,
                        filteredClientStatusList: filteredClientStatusList,
                        currentClassification: CLASSIFICATION.CLOUDLET,
                        currentCluster: undefined,
                    });
                } else {//todo: When allCloudlet
                    this.setState({
                        currentCloudLet: undefined,
                        filteredCloudletUsageList: this.state.allCloudletUsageList,
                        filteredCloudletList: this.state.cloudletList,
                        toggleOperMapZoom: !this.state.toggleOperMapZoom,
                        filteredClientStatusList: this.state.allClientStatusList,
                        currentClassification: CLASSIFICATION.CLOUDLET,
                        currentCluster: undefined,
                    })
                }
            }


            async handleOnChangeClusterDropdown(pClusterOne) {
                try {
                    //desc: When selected all Cluster options
                    if (pClusterOne === '' || pClusterOne === undefined) {
                        await this.setState({
                            filteredClusterList: this.state.clusterList,
                        })
                        await this.resetLocalData();
                    } else {

                        await this.setState({
                            selectedClientLocationListOnAppInst: [],
                            dropdownRequestLoading: true,
                            selectedAppInstIndex: -1,
                        })

                        let selectData = pClusterOne.split("|")
                        let selectedCluster = selectData[0].trim();
                        let selectedCloudlet = selectData[1].trim();

                        //desc: filter  ClusterUsageList
                        let allClusterUsageList = this.state.allClusterUsageList;
                        let filteredClusterUsageList = []
                        allClusterUsageList.map(item => {
                            if (item.cluster === selectedCluster && item.cloudlet === selectedCloudlet) {
                                filteredClusterUsageList.push(item)
                            }
                        })
                        //desc: filter clusterEventLog
                        let allClusterEventLogList = this.state.allClusterEventLogList
                        let filteredClusterEventLogList = []
                        allClusterEventLogList.map(item => {
                            if (item[1] === selectedCluster && item[3] === selectedCloudlet) {
                                filteredClusterEventLogList.push(item)
                            }
                        })

                        let appInstList = this.state.appInstList;
                        let filteredAppInstList = []
                        appInstList.map((item: TypeAppInstance, index) => {
                            if (item.ClusterInst === selectedCluster && item.Cloudlet === selectedCloudlet) {
                                filteredAppInstList.push(item)
                            }
                        })

                        let appInstDropdown = makeDropdownForAppInst(filteredAppInstList)
                        let bubbleChartData = makeBubbleChartDataForCluster(filteredClusterUsageList, this.state.currentHardwareType, this.state.chartColorList);
                        await this.setState({
                            bubbleChartData: bubbleChartData,
                            currentCluster: pClusterOne,
                            currentClassification: this.state.userType.includes(USER_TYPE.DEVELOPER) ? CLASSIFICATION.CLUSTER : CLASSIFICATION.CLUSTER_FOR_OPER,
                            dropdownRequestLoading: false,
                            filteredClusterUsageList: filteredClusterUsageList,
                            filteredClusterEventLogList: filteredClusterEventLogList,
                            appInstDropdown: appInstDropdown,
                            allAppInstDropdown: appInstDropdown,
                            appInstSelectBoxPlaceholder: 'Select App Inst',
                            filteredAppInstList: filteredAppInstList,
                            appInstanceListGroupByCloudlet: reducer.groupBy(filteredAppInstList, CLASSIFICATION.CLOUDLET),
                            currentAppInst: undefined,
                        });

                    }

                    //desc: ############################
                    //desc: setStream
                    //desc: ############################
                    if (this.state.isStream) {
                        this.setClusterInterval()
                    } else {
                        clearInterval(this.intervalForAppInst)
                        clearInterval(this.intervalForCluster)
                    }
                } catch (e) {

                }

            }

            handleOnChangeAppInstDropdown = async (pCurrentAppInst) => {
                try {
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
                    let Version = pCurrentAppInst.split('|')[3].trim()
                    let filteredAppList = filterByClassification(this.state.appInstList, Cloudlet, 'Cloudlet');
                    filteredAppList = filterByClassification(filteredAppList, ClusterInst, 'ClusterInst');
                    filteredAppList = filterByClassification(filteredAppList, AppName, 'AppName');
                    filteredAppList = filterByClassification(filteredAppList, Version, 'Version');
                    //desc:########################################
                    //desc:Terminal, currentAppVersion
                    //desc:########################################
                    this.setState({
                        currentAppVersion: Version,
                        terminalData: null
                    })
                    this.validateTerminal(filteredAppList)

                    let appInstDropdown = makeDropdownForAppInst(filteredAppList)
                    await this.setState({
                        appInstDropdown,
                    });


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
                    pCurrentAppInst = pCurrentAppInst.split("|")[0].trim() + " | " + pCurrentAppInst.split('|')[1].trim() + " | " + pCurrentAppInst.split('|')[2].trim() + ' | ' + Version

                    //desc: ############################
                    //desc: filtered AppInstEventLogList
                    //desc: ############################
                    let _allAppInstEventLog = this.state.allAppInstEventLogs;
                    let filteredAppInstEventLogList = _allAppInstEventLog.filter(item => {
                        if (item[APP_INST_MATRIX_HW_USAGE_INDEX.APP].trim() === AppName && item[APP_INST_MATRIX_HW_USAGE_INDEX.CLUSTER].trim() === ClusterInst) {
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

                    //desc: ############################
                    //desc: setStream
                    //desc: ############################
                    if (this.state.isStream) {
                        this.setAppInstInterval(filteredAppList)
                    } else {
                        clearInterval(this.intervalForAppInst)
                    }
                } catch (e) {
                    throw new Error(e)
                }


            }

            _________________________________________________________________________________________________() {
            }


            renderCloudletDropdown() {
                return (
                    <div className="page_monitoring_dropdown_box" style={{alignSelf: 'center', justifyContent: 'center'}}>
                        <div className="page_monitoring_dropdown_label">
                            Cloudlet
                        </div>
                        <Select
                            showSearch={true}
                            dropdownStyle={{}}
                            listHeight={512}
                            style={{width: 250, maxHeight: '512px !important'}}
                            disabled={isEmpty(this.state.cloudletDropdownList)}
                            value={this.state.currentCloudLet}
                            placeholder={'Select Cloudlet'}
                            onSelect={async (value) => {
                                this.handleOnChangeCloudletDropdown(value)
                            }}
                        >
                            {!isEmpty(this.state.cloudletDropdownList) && this.state.cloudletDropdownList.map((item: TypeCloudlet, index) => {
                                if (index === 0) {
                                    return <Option key={index} value={item.value} style={{}}>
                                        <div style={{color: 'orange', fontWeight: 'bold'}}>{item.text}</div>
                                    </Option>
                                } else {
                                    return (
                                        <Option key={index} value={item.value}>{item.text}</Option>
                                    )
                                }
                            })}
                        </Select>
                    </div>
                )
            }


            renderClusterDropdown() {

                if (this.state.userType.includes(USER_TYPE.DEVELOPER)) {
                    return (
                        <div className="page_monitoring_dropdown_box" style={{alignSelf: 'center', justifyContent: 'center'}}>
                            <div
                                className="page_monitoring_dropdown_label"
                                style={{
                                    marginLeft: this.state.isShowFilter ? 0 : 10
                                }}
                            >
                                Cluster
                            </div>
                            <TreeSelect
                                disabled={this.state.loading}
                                size={'middle'}
                                showSearch={true}
                                switcherIcon={<FontAwesomeIcon
                                    name="arrow-up" style={{fontSize: 15, color: 'green', cursor: 'pointer', marginTop: 2}}
                                />}
                                style={{width: '300px'}}
                                onSearch={(value) => {
                                    this.setState({
                                        searchClusterValue: value,
                                    });
                                }}

                                searchValue={this.state.searchClusterValue}
                                searchPlaceholder={'Enter the cluster name.'}
                                placeholder={'Select Cluster'}
                                dropdownStyle={{maxHeight: 800, overflow: 'auto', width: 450,}}
                                treeData={this.state.dropDownCludsterListOnCloudlet}
                                treeDefaultExpandAll={true}
                                value={this.state.currentCluster}

                                onChange={async (value, label, extra) => {
                                    clearInterval(this.intervalForCluster)
                                    clearInterval(this.intervalForAppInst)
                                    //@desc: When whole cluster ...
                                    if (value === '') {
                                        await this.setState({
                                            filteredClusterList: this.state.clusterList,
                                        })
                                    } else {
                                        await this.filterClusterList(value)
                                    }
                                    await this.handleOnChangeClusterDropdown(value.trim())
                                }}
                            />
                        </div>
                    )
                } else {//@todo: When Operator
                    return (
                        <div className="page_monitoring_dropdown_box" style={{alignSelf: 'center', justifyContent: 'center'}}>
                            <div className="page_monitoring_dropdown_label">
                                Cluster
                            </div>
                            <Select
                                showSearch={true}
                                dropdownStyle={{}}
                                notFoundContent={<div style={{color: 'orange', marginLeft: 5, fontWeight: 'bold', fontStyle: 'italic'}}>No Cluster</div>}
                                listHeight={512}
                                style={{width: 250, maxHeight: '512px !important'}}
                                disabled={this.state.currentCloudLet === undefined || this.state.filteredClusterList.length === 0}
                                value={this.state.currentCluster}
                                placeholder={'Select Cluster'}
                                onChange={async (value) => {

                                    this.handleOnChangeClusterDropdown(value)
                                }}
                            >
                                {this.state.filteredClusterList.map((item: TypeCluster, index) => {
                                    return (
                                        <Option key={index} value={item.ClusterName + " | " + item.Cloudlet}>{item.ClusterName}</Option>
                                    )
                                })}
                            </Select>
                        </div>
                    )
                }


            }


            renderAppInstDropdown() {
                return (
                    <div className="page_monitoring_dropdown_box" style={{alignSelf: 'center', justifyContent: 'center'}}>
                        <div className="page_monitoring_dropdown_label" style={{width: 50,}}>
                            App Inst
                        </div>
                        <Select
                            ref={c => this.appInstSelect = c}
                            dropdownStyle={{}}
                            style={{width: 250}}
                            disabled={this.state.currentCluster === '' || this.state.loading || this.state.appInstDropdown.length === 0 || this.state.currentCluster === undefined}
                            value={this.state.currentAppInst}
                            placeholder={this.state.appInstSelectBoxPlaceholder}
                            onChange={async (value) => {
                                await this.handleOnChangeAppInstDropdown(value.trim())
                                this.appInstSelect.blur();
                            }}
                        >
                            {this.state.allAppInstDropdown.map(item => {
                                return (
                                    <Option value={item.value}>{item.text}</Option>
                                )
                            })}
                        </Select>
                    </div>
                )
            }

            ________________________________________________________________________() {
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

            renderDot(index, isAll = false) {
                return (
                    <div style={{backgroundColor: 'transparent', marginTop: 0,}}>
                        <div
                            style={{
                                backgroundColor: isAll ? 'white' : this.state.chartColorList[index],
                                width: 15,
                                height: 15,
                                borderRadius: 50,
                            }}
                        >
                        </div>
                    </div>
                )
            }

            renderClusterLegend() {
                let filteredClusterUsageListLength = this.state.filteredClusterUsageList.length;

                return (
                    <Row gutter={16} style={{
                        flex: .97,
                        marginLeft: 10,
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        display: filteredClusterUsageListLength === 1 ? 'flex' : null,
                    }}>
                        {this.state.filteredClusterUsageList.map((item, index) => {
                            return (
                                <Col
                                    key={index}
                                    className="gutterRow"
                                    onClick={async () => {
                                        let clusterOne = item.cluster + " | " + item.cloudlet;
                                        await this.handleOnChangeClusterDropdown(clusterOne)

                                    }}
                                    span={this.state.legendColSize}
                                    title={!this.state.isLegendExpanded ? item.cluster + '[' + item.cloudlet + ']' : null}
                                    style={{marginTop: 5, marginBottom: 5}}
                                >
                                    {this.renderDot(index)}
                                    {filteredClusterUsageListLength === 1 ?
                                        <React.Fragment>
                                            <div className='clusterCloudletBoxOne'>
                                                {item.cluster + "[" + item.cloudlet + "]"}
                                            </div>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <div className="clusterCloudletBox">
                                                {reduceLegendClusterCloudletName(item, this)}
                                            </div>
                                        </React.Fragment>
                                    }
                                </Col>
                            )
                        })}
                    </Row>
                )
            }

            makeAllDotLabel() {
                return (
                    <Col
                        className="gutterRow"
                        onClick={async () => {
                        }}
                        span={3}
                        style={{marginTop: 3, marginBottom: 3}}
                    >
                        <div style={{backgroundColor: 'transparent', marginTop: 0,}}>
                            <div
                                style={{
                                    backgroundColor: 'white',
                                    width: 15,
                                    height: 15,
                                    borderRadius: 50,
                                }}
                            >
                            </div>
                        </div>
                        <div
                            style={{marginTop: 0, marginLeft: 3,}}
                            onClick={async () => {
                                await this.handleOnChangeCloudletDropdown(undefined)
                            }}
                        >
                            all
                        </div>
                        <div style={{marginRight: 5,}}>
                        </div>
                    </Col>
                )
            }

            renderCloudletLegend() {
                return (
                    <Row gutter={16}
                         style={{
                             flex: .97,
                             marginLeft: 10,
                             backgroundColor: 'transparent',
                             justifyContent: 'center',
                             alignSelf: 'center',
                             height: 50,
                         }}
                    >
                        {this.state.filteredCloudletList.map((item: TypeCloudlet, index) => {

                            return (
                                <Col
                                    key={index}
                                    className="gutterRow"
                                    onClick={async () => {
                                    }}
                                    span={3}
                                    style={{marginTop: 3, marginBottom: 3}}
                                >
                                    <Ripple
                                        style={{marginLeft: 0,}}
                                        color='#1cecff' during={100}
                                        onClick={async () => {
                                            await this.handleOnChangeCloudletDropdown(item.CloudletName)
                                        }}
                                    >
                                        {this.renderDot(index)}
                                        <div
                                            style={{marginTop: 0, marginLeft: 3,}}
                                        >
                                            {reduceString(item.CloudletName, 21)}
                                        </div>
                                        <div style={{marginRight: 5,}}>
                                        </div>
                                    </Ripple>
                                </Col>
                            )
                        })}
                    </Row>
                )
            }

            renderAppLegend() {
                return (
                    <Row gutter={16}
                         style={{
                             flex: .97,
                             marginLeft: 10,
                             backgroundColor: 'transparent',
                             justifyContent: 'center',
                             alignSelf: 'center',
                             height: 25,
                         }}
                    >
                        <Col
                            className="gutterRow"
                            onClick={async () => {
                            }}
                            span={24}
                            style={{marginTop: 3, marginBottom: 3}}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginLeft: 0,
                                flex: 1,
                            }}>
                                {this.renderDot(0)}
                                <ClusterCluoudletLabel
                                    style={{marginLeft: 5, marginRight: 15, marginBottom: -1}}>
                                    {this.state.currentAppInst.split("|")[0]}[{this.state.currentAppVersion}]
                                </ClusterCluoudletLabel>
                            </div>
                        </Col>
                    </Row>

                )
            }

            makeLegend() {
                let legendHeight = 30
                if (this.state.loading) {
                    return (
                        <LegendOuterDiv style={{height: legendHeight}}>
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
                        </LegendOuterDiv>
                    )
                } else {
                    let legendItemCount = this.state.currentClassification === CLASSIFICATION.CLUSTER ? this.state.filteredClusterUsageList.length : this.state.filteredCloudletList

                    return (
                        <LegendOuterDiv
                            style={{
                                height: this.state.currentClassification === CLASSIFICATION.CLUSTER && legendItemCount > 1 ?
                                    this.state.legendHeight : this.state.currentClassification === CLASSIFICATION.APPINST ? 30 :
                                        this.state.currentClassification === CLASSIFICATION.CLOUDLET ? 60 : this.state.legendHeight
                            }}>
                            {this.state.currentClassification === CLASSIFICATION.CLUSTER ?//@desc: When Cluster Level Legend
                                this.renderClusterLegend()
                                ://@desc: When Cloudlet Level Legend
                                this.state.currentClassification === CLASSIFICATION.CLOUDLET ?
                                    this.renderCloudletLegend()
                                    //@desc: When AppLevel Legend
                                    : this.state.currentClassification === CLASSIFICATION.APPINST &&
                                    this.renderAppLegend()

                            }
                            {/*################################*/}
                            {/* fold/unfoled icons on right    */}
                            {/*################################*/}
                            {this.state.currentClassification === CLASSIFICATION.CLUSTER &&
                            <div
                                style={PageMonitoringStyles.expandIconDiv}
                                onClick={() => {
                                    if (this.state.isLegendExpanded === false) {
                                        this.setState({
                                            isLegendExpanded: true,
                                            legendHeight: (Math.ceil(legendItemCount / 4)) * 25,
                                            legendColSize: 6,
                                        })
                                    } else {//when expanded
                                        this.setState({
                                            isLegendExpanded: false,
                                            legendHeight: (Math.ceil(legendItemCount / 8)) * 25,
                                            legendColSize: 3,
                                        })
                                    }
                                }}
                            >
                                {!this.state.isLegendExpanded ?
                                    <UnfoldMore style={{fontSize: 18}}/>
                                    :
                                    <UnfoldLess style={{fontSize: 18}}/>
                                }
                            </div>
                            }
                        </LegendOuterDiv>
                    )
                }
            }

            renderAllDropDown__Header = () => {
                return (
                    <>
                        <Toolbar className='monitoring_title' style={{marginTop: -5}}>
                            <label className='content_title_label' style={{marginBottom: 1}}
                                   onClick={() => {
                                       this.state.userType.includes(USER_TYPE.OPERATOR) ? this.handleOnChangeCloudletDropdown(undefined) : this.handleOnChangeClusterDropdown('')
                                   }}
                            >
                                Monitoring
                                <div style={{color: 'yellow', fontSize: 14}}>
                                    [{this.state.currentClassification}]

                                </div>
                                <div style={{color: 'green', fontSize: 14}}>
                                    &nbsp;&nbsp;&nbsp;&nbsp;{localStorage.selectRole.toString()}
                                </div>
                            </label>
                            <div className='page_monitoring_select_area'
                                 style={{
                                     width: 'fit-content',
                                     flex: .7,
                                 }}>
                                {this.state.userType.includes(USER_TYPE.OPERATOR) ?
                                    <React.Fragment>
                                        <div style={{marginLeft: 25}}>
                                            {this.renderCloudletDropdown()}
                                        </div>
                                        <div style={{marginLeft: 25}}>
                                            {this.renderClusterDropdown()}
                                        </div>
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        <div style={{marginLeft: 25}}>
                                            {this.renderClusterDropdown()}
                                        </div>
                                        <div style={{marginLeft: 25}}>
                                            {this.renderAppInstDropdown()}
                                        </div>
                                    </React.Fragment>
                                }
                                {this.state.intervalLoading &&
                                <div>
                                    <div style={{marginLeft: 25, marginRight: 1,}}>
                                        {renderWifiLoader()}
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
                                                    await this.handleOnChangeClusterDropdown(this.state.currentCluster)

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
                                                    await this.handleOnChangeAppInstDropdown(this.state.currentAppInst, true)
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


            render() {
                if (this.state.isNoData) {
                    return (
                        <div style={{width: '100%', height: '100%',}}>
                            {this.renderAllDropDown__Header()}
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
                                height: '106%',
                            }}>
                                {/*desc:---------------------------------*/}
                                {/*desc:Content Header                   */}
                                {/*desc:---------------------------------*/}
                                <SemanticToastContainer position={"bottom-center"} color={'red'}/>
                                {this.renderAllDropDown__Header()}
                                {/*desc:---------------------------------*/}
                                {/*desc:Legend                           */}
                                {/*desc:---------------------------------*/}
                                {this.makeLegend()}
                                <div className="page_monitoring"
                                     style={{
                                         overflowY: 'auto',
                                         height: 'calc(100% - 135px)',
                                         marginTop: 0,
                                         marginRight: 50,
                                         backgroundColor: this.props.themeType === 'light' ? 'white' : null
                                     }}>
                                    {/*desc: no item message for cluster*/}
                                    {!this.state.loading && this.state.currentClassification === CLASSIFICATION.CLUSTER && this.state.layoutForCluster.length === 0 &&
                                    <div style={{
                                        marginLeft: 15,
                                        marginTop: 10,
                                        fontSize: 25,
                                        color: 'orange'
                                    }}>No Item</div>
                                    }
                                    {/*desc: no item message for appInst*/}
                                    {!this.state.loading && this.state.currentClassification === CLASSIFICATION.APPINST && this.state.layoutForAppInst.length === 0 &&
                                    <div style={{
                                        marginLeft: 15,
                                        marginTop: 10,
                                        fontSize: 25,
                                        color: 'rgba(255,255,255,.6)'
                                    }}>No Item</div>
                                    }
                                    {this.state.currentClassification === CLASSIFICATION.CLOUDLET ? this.renderGridLayoutForCloudletForOper()
                                        : this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER ? this._____renderGridLayoutForClusterDevOper()
                                            : this.state.currentClassification === CLASSIFICATION.CLUSTER ? this._____renderGridLayoutForClusterDevOper()
                                                : this.state.currentClassification === CLASSIFICATION.APPINST && this.renderGridLayoutForAppInstForDev()
                                    }
                                </div>
                            </div>
                            {/*desc:---------------------------------*/}
                            {/*desc:terminal button                   */}
                            {/*desc:---------------------------------*/}
                            {this.state.currentClassification === CLASSIFICATION.APPINST && this.state.terminalData ?
                                <div className='page_monitoring_terminal_button' style={{marginBottom: 10}}
                                     onClick={() => this.setState({openTerminal: true})}
                                >
                                </div>
                                : null
                            }
                        </div>
                        <Dialog disableBackdropClick={true} disableEscapeKeyDown={true} fullScreen
                                open={this.state.openTerminal} onClose={() => {
                            this.setState({openTerminal: false})
                        }}>
                            <TerminalViewer data={this.state.terminalData} onClose={() => {
                                this.setState({openTerminal: false})
                            }}/>
                        </Dialog>
                    </div>
                )//return End
            }
        }
    ))
)
