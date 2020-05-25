import {Center, ClusterCluoudletLabel, LegendOuterDiv, PageMonitoringStyles} from '../common/PageMonitoringStyles'
import {SemanticToastContainer} from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {withSize} from 'react-sizeme';
import {connect} from 'react-redux';
import {Dialog, Toolbar} from '@material-ui/core'
import {Col, DatePicker, Dropdown as ADropdown, Menu as AMenu, Row, Select, TreeSelect} from 'antd';

import {
    filterByClassification,
    getCloudletClusterNameList,
    getOnlyCloudletIndex,
    getOnlyCloudletName,
    getUserId,
    handleThemeChanges,
    makeBarChartDataForAppInst,
    makeBarChartDataForCloudlet,
    makeBarChartDataForCluster,
    makeClusterTreeDropdown,
    makeDropdownForAppInst,
    makeDropdownForCloudlet,
    makeid,
    makeLineChartData,
    makeLineChartDataForBigModal,
    makeMultiLineChartDatas,
    reduceLegendClusterCloudletName,
    reduceString,
} from "../service/PageDevOperMonitoringService";
import {
    ADD_ITEM_LIST,
    APP_INST_MATRIX_HW_USAGE_INDEX,
    CHART_COLOR_LIST,
    CLASSIFICATION,
    HARDWARE_OPTIONS_FOR_APPINST,
    HARDWARE_OPTIONS_FOR_CLOUDLET,
    HARDWARE_OPTIONS_FOR_CLUSTER,
    HARDWARE_TYPE,
    NETWORK_TYPE,
    RECENT_DATA_LIMIT_COUNT,
    THEME_OPTIONS_LIST,
    USER_TYPE
} from "../../../../shared/Constants";
import type {
    TypeBarChartData,
    TypeCloudlet,
    TypeCloudletUsage,
    TypeCluster,
    TypeClusterUsageOne,
    TypeGridInstanceList,
    TypeLineChartData,
    TypeUtilization
} from "../../../../shared/Types";
import {TypeAppInst} from "../../../../shared/Types";
import moment from "moment";
import {
    getOneYearStartEndDatetime,
    isEmpty,
    makeBubbleChartDataForCluster,
    renderPlaceHolderLoader,
    renderWifiLoader,
    showToast
} from "../service/PageMonitoringCommonService";
import {
    fetchAppInstList,
    fetchCloudletList,
    fetchClusterList,
    getAllAppInstEventLogs,
    getAllClusterEventLogList,
    getAppLevelUsageList,
    getClientStatusList,
    getCloudletUsageList,
    getClusterLevelUsageList,
    requestShowAppInstClientWS
} from "../service/PageMonitoringMetricService";
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
import type {Layout, LayoutItem} from "react-grid-layout/lib/utils";
import {THEME_TYPE} from "../../../../themeStyle";
import BarChartContainer from "../components/BarChartContainer";
import PerformanceSummaryForCluster from "../components/PerformanceSummaryForCluster";
import PerformanceSummaryForAppInst from "../components/PerformanceSummaryForAppInst";
import {UnfoldLess, UnfoldMore} from '@material-ui/icons';
import AppInstEventLogListHooks from "../components/AppInstEventLogListHooks";
import {fields} from '../../../../services/model/format'
import type {PageMonitoringProps} from "../common/PageMonitoringProps";
import {
    ColorLinearProgress,
    CustomSwitch,
    PageDevMonitoringMapDispatchToProps,
    PageDevMonitoringMapStateToProps
} from "../common/PageMonitoringProps";
import {
    APPINST_HW_MAPPER_KEY,
    APPINST_LAYOUT_KEY,
    CLOUDLET_HW_MAPPER_KEY,
    CLOUDLET_LAYOUT_KEY,
    CLUSTER_FOR_OPER_HW_MAPPER_KEY,
    CLUSTER_FOR_OPER_LAYOUT_KEY,
    CLUSTER_HW_MAPPER_KEY,
    CLUSTER_LAYOUT_KEY,
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
    defaultLayoutXYPosForClusterForOper,
    GRID_ITEM_TYPE
} from "./PageMonitoringLayoutProps";
import MapForOper from "../components/MapForOper";
import DonutChartHooks from "../components/DonutChartHooks";
import ClientStatusTableHooks from "../components/ClientStatusTableHooks";
import MethodUsageCount from "../components/MethodUsageCount";
import {filteredClientStatusListByAppName} from "../service/PageAdmMonitoringService";
import MultiHwLineChartContainer from "../components/MultiHwLineChartContainer";
import AddItemPopupContainer from "../components/AddItemPopupContainer";
import BarAndLineChartContainer from "../components/BarAndLineChartContainer";

const {RangePicker} = DatePicker;
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
    appInstList: Array<TypeAppInst>,
    allAppInstanceList: Array<TypeAppInst>,
    appInstanceOne: TypeAppInst,
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
    layoutMapperCluster: [],
    layoutMapperAppInst: [],
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
    isExistData: boolean,
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
    allClusterList: any,
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
    layoutMapperClusterForOper: any,
    layoutCloudlet: any,
    layoutClusterForOper: any,
    layoutCluster: any,
    layoutAppInst: any,
    layoutMapperCloudlet: any,
    currentOperLevel: string,
    currentIndex: number,
    hwListForCloudlet: any,
    currentColorIndex: number,
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

                let clusterLayout = getUserId() + CLUSTER_LAYOUT_KEY
                let clusterLayoutMapper = getUserId() + CLUSTER_HW_MAPPER_KEY
                let appInstLayout = getUserId() + APPINST_LAYOUT_KEY
                let appInstLayoutMapper = getUserId() + APPINST_HW_MAPPER_KEY

                let cloudletLayout = getUserId() + CLOUDLET_LAYOUT_KEY
                let cloudletlayoutMapper = getUserId() + CLOUDLET_HW_MAPPER_KEY

                let clusterOperLayout = getUserId() + CLUSTER_FOR_OPER_LAYOUT_KEY
                let clusterOperLayoutMapper = getUserId() + CLUSTER_FOR_OPER_HW_MAPPER_KEY

                let themeKey = getUserId() + "_mon_theme";
                let themeTitle = getUserId() + "_mon_theme_title";

                //@fixme: DELETE THEME COLOR
                reactLocalStorage.remove(clusterLayout)
                reactLocalStorage.remove(clusterLayoutMapper)


                this.state = {
                    //todo:dev layout
                    //todo:dev layout
                    layoutCluster: isEmpty(reactLocalStorage.get(clusterLayout)) ? defaultLayoutForCluster : reactLocalStorage.getObject(clusterLayout),
                    layoutMapperCluster: isEmpty(reactLocalStorage.get(clusterLayoutMapper)) ? defaultHwMapperListForCluster : reactLocalStorage.getObject(clusterLayoutMapper),
                    layoutAppInst: isEmpty(reactLocalStorage.get(appInstLayout)) ? defaultLayoutForAppInst : reactLocalStorage.getObject(appInstLayout),
                    layoutMapperAppInst: isEmpty(reactLocalStorage.get(appInstLayoutMapper)) ? defaultLayoutMapperForAppInst : reactLocalStorage.getObject(appInstLayoutMapper),


                    //todo:oper layout
                    //todo:oper layout
                    layoutCloudlet: isEmpty(reactLocalStorage.get(cloudletLayout)) ? defaultLayoutForCloudlet : reactLocalStorage.getObject(cloudletLayout),
                    layoutMapperCloudlet: isEmpty(reactLocalStorage.get(cloudletlayoutMapper)) ? defaultLayoutMapperForCloudlet : reactLocalStorage.getObject(cloudletlayoutMapper),
                    layoutClusterForOper: isEmpty(reactLocalStorage.get(clusterOperLayout)) ? defaultLayoutForClusterForOper : reactLocalStorage.getObject(clusterOperLayout),
                    layoutMapperClusterForOper: isEmpty(reactLocalStorage.get(clusterOperLayoutMapper)) ? defaultLayoutMapperForClusterForOper : reactLocalStorage.getObject(clusterOperLayoutMapper),


                    date: '',
                    time: '',
                    dateTime: '',
                    datesRange: '',
                    appInstanceListGroupByCloudlet: [],
                    loading: false,
                    loading0: false,

                    clusterInstanceGroupList: [],
                    allClusterList: [],
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
                    isExistData: true,
                    diskGridItemOneStyleTranslate: {
                        transform: 'translate(10px, 1540px)',
                    },
                    hwListForCloudlet: HARDWARE_OPTIONS_FOR_CLOUDLET,
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
                    isLegendExpanded: true,
                    legendColSize: 4,
                    currentAppVersion: undefined,
                    isEnableZoomIn: false,
                    searchClusterValue: '',
                    cloudletList: [],
                    filteredCloudletList: [],
                    allCloudletUsageList: [],
                    filteredCloudletUsageList: [],
                    cloudletDropdownList: [],
                    toggleOperMapZoom: false,
                    allClientStatusList: [],
                    filteredClientStatusList: [],
                    currentOperLevel: CLASSIFICATION.CLOUDLET,
                    currentIndex: 0,
                    currentColorIndex: 0,
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
                let clusterList = []
                let appInstList = []
                let cloudletList = []
                let allClusterEventLogList = [];
                let allAppInstEventLogList = [];
                let allClusterUsageList = [];
                let allCloudletUsageList = [];

                try {
                    clearInterval(this.intervalForAppInst)
                    clearInterval(this.intervalForCluster)
                    //@desc:#############################################
                    //@desc: (allClusterList, appnInstList, cloudletList)
                    //@desc:#############################################
                    //todo:realdata
                    if (this.state.userType.includes(USER_TYPE.DEVELOPER)) {
                        promiseList.push(fetchClusterList())
                        promiseList.push(fetchAppInstList())
                        let newPromiseList = await Promise.all(promiseList);
                        clusterList = newPromiseList[0];
                        appInstList = newPromiseList[1];
                    } else {//TODO:OPERATOR
                        cloudletList = await fetchCloudletList();
                        console.log(`cloudletList====>`, cloudletList);
                    }

                    //fixme:fakedata
                    /*let cloudletList = require('../temp/cloudletList'), let allClusterList = require('../temp/allClusterList'), let appInstList = require('../temp/appInstList')*/


                    if (this.state.userType.includes(USER_TYPE.OPERATOR)) {
                        let clientStatusList = await getClientStatusList(appInstList);
                        await this.setState({
                            allClientStatusList: clientStatusList,
                            filteredClientStatusList: clientStatusList,
                            loading: true,
                        })
                    }

                    let orgAppInstList = appInstList.filter((item: TypeAppInst, index) => item.OrganizationName === localStorage.getItem('selectOrg'))
                    let cloudletClusterNameList = getCloudletClusterNameList(orgAppInstList)
                    let clusterDropdownList = makeClusterTreeDropdown(_.uniqBy(cloudletClusterNameList.cloudletNameList), clusterList)
                    //@desc:#########################################################################
                    //@desc: map Marker
                    //@desc:#########################################################################
                    let markerListForMap = reducer.groupBy(orgAppInstList, CLASSIFICATION.CLOUDLET);
                    await this.setState({
                        cloudletList: cloudletList,
                        filteredCloudletList: cloudletList,
                        appInstanceListGroupByCloudlet: !isInterval && markerListForMap,
                    });

                    //@desc:#########################################################################
                    //@desc: getAllClusterEventLogList, getAllAppInstEventLogs ,allClusterUsageList
                    //@desc:#########################################################################
                    //todo: realdata
                    if (this.state.userType.includes(USER_TYPE.DEVELOPER)) {
                        promiseList2.push(getAllClusterEventLogList(clusterList))
                        promiseList2.push(getAllAppInstEventLogs());
                        promiseList2.push(getClusterLevelUsageList(clusterList, "*", RECENT_DATA_LIMIT_COUNT))
                        let newPromiseList2 = await Promise.all(promiseList2);
                        allClusterEventLogList = newPromiseList2[0];
                        allAppInstEventLogList = newPromiseList2[1];
                        allClusterUsageList = newPromiseList2[2];
                    } else {//TODO:OPERATOR
                        allCloudletUsageList = await getCloudletUsageList(cloudletList, "*", RECENT_DATA_LIMIT_COUNT);

                        console.log(`allCloudletUsageList====>`, allCloudletUsageList);
                    }

                    //fixme: fakedata
                    /*let allClusterEventLogList = [], let allAppInstEventLogList = [], let allClusterUsageList = require('../temp/clusterUSageList'), let allCloudletUsageList = require('../temp/cloudletUsageList')*/

                    let bubbleChartData = await makeBubbleChartDataForCluster(allClusterUsageList, HARDWARE_TYPE.CPU, this.state.chartColorList);
                    let cloudletDropdownList = makeDropdownForCloudlet(cloudletList)
                    let dataCount = 0;
                    if (this.state.userType.includes(USER_TYPE.DEVELOPER)) {
                        dataCount = appInstList.length
                    } else {
                        dataCount = cloudletList.length
                    }

                    console.log(`clusterList===>`, clusterList);


                    await this.setState({
                        legendHeight: (Math.ceil(clusterList.length / 8)) * 30,
                        isExistData: dataCount > 0,
                        bubbleChartData: bubbleChartData,
                        allClusterEventLogList: allClusterEventLogList,
                        filteredClusterEventLogList: allClusterEventLogList,
                        allAppInstEventLogs: allAppInstEventLogList,
                        filteredAppInstEventLogs: allAppInstEventLogList,
                        isReady: true,
                        clusterDropdownList: clusterDropdownList,//@fixme
                        dropDownCludsterListOnCloudlet: clusterDropdownList,//@fixme
                        allClusterList: clusterList,
                        filteredClusterList: clusterList,
                        isAppInstaceDataReady: true,
                        appInstList: appInstList,
                        filteredAppInstList: appInstList,
                        dropdownRequestLoading: false,
                        clusterListLoading: false,
                        allClusterUsageList: allClusterUsageList,
                        filteredClusterUsageList: allClusterUsageList,
                        maxCpu: Math.max.apply(Math, allClusterUsageList.map((o) => o.sumCpuUsage)),
                        maxMem: Math.max.apply(Math, allClusterUsageList.map((o) => o.sumMemUsage)),
                        isRequesting: false,
                        ///@desc: ----------cloudletList--------------
                        allCloudletUsageList: allCloudletUsageList,
                        filteredCloudletUsageList: allCloudletUsageList,
                        cloudletDropdownList: cloudletDropdownList,

                    });
                } catch (e) {
                    showToast(e.toString())

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
                let markerListForMap = reducer.groupBy(this.state.appInstList.filter((item: TypeAppInst, index) => item.OrganizationName === localStorage.getItem('selectOrg')), CLASSIFICATION.CLOUDLET);
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
                    try {
                        let filteredClusterUsageList = await getClusterLevelUsageList(this.state.filteredClusterList, "*", RECENT_DATA_LIMIT_COUNT);

                        this.setChartDataForBigModal(filteredClusterUsageList)
                        this.setState({
                            intervalLoading: false,
                            filteredClusterUsageList: filteredClusterUsageList,
                        })
                    } catch (e) {
                        showToast(e.toString())
                    }

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


            async addGridItem(paramHwType, graphType) {
                let uniqueId = undefined
                let currentLayoutMapper = []
                let itemOne = {};
                let currentLayout
                /*todo:Cloudlet*/
                if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                    currentLayout = this.state.layoutCloudlet;
                    let maxY = -1;
                    if (!isEmpty(currentLayout)) {
                        maxY = _.maxBy(currentLayout, 'y').y
                    }
                    uniqueId = makeid(5)
                    currentLayoutMapper = this.state.layoutMapperCloudlet

                    itemOne = {
                        id: uniqueId,
                        hwType: paramHwType,
                        graphType: graphType,
                    }
                    //@desc: ######################################
                    //@desc:  calculate empty space in gridLayout
                    //@desc: ######################################
                    await this.setState({
                        layoutCloudlet: this.state.layoutCloudlet.concat({
                            i: uniqueId,
                            x: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.x : 0,
                            y: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.y : maxY + 1,
                            w: this.makeGridItemWidth(graphType),
                            h: this.makeGridIItemHeight(graphType),
                        }),
                        layoutMapperCloudlet: currentLayoutMapper.concat(itemOne),
                    })

                    reactLocalStorage.setObject(getUserId() + CLOUDLET_LAYOUT_KEY, this.state.layoutCloudlet)
                    reactLocalStorage.setObject(getUserId() + CLOUDLET_HW_MAPPER_KEY, this.state.layoutMapperCloudlet)
                }
                    /*todo:CLUSTER*/
                    /*todo:CLUSTER*/
                /*todo:CLUSTER*/
                else if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                    let currentItems = this.state.layoutCluster;
                    let maxY = -1;
                    if (!isEmpty(currentItems)) {
                        maxY = _.maxBy(currentItems, 'y').y
                    }
                    let uniqueId = makeid(5)
                    let mapperList = this.state.layoutMapperCluster

                    let itemOne = {
                        id: uniqueId,
                        hwType: paramHwType,
                        graphType: graphType,
                    }
                    //@desc: ######################################
                    //@desc:  calculate empty space in gridLayout
                    //@desc: ######################################
                    await this.setState({
                        layoutCluster: this.state.layoutCluster.concat({
                            i: uniqueId,
                            x: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.x : 0,
                            y: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.y : maxY + 1,
                            w: this.makeGridItemWidth(graphType),
                            h: this.makeGridIItemHeight(graphType),
                        }),
                        layoutMapperCluster: mapperList.concat(itemOne),
                    })

                    reactLocalStorage.setObject(getUserId() + CLUSTER_LAYOUT_KEY, this.state.layoutCluster)
                    reactLocalStorage.setObject(getUserId() + CLUSTER_HW_MAPPER_KEY, this.state.layoutMapperCluster)

                } else {
                    //@desc: ##########################
                    //@desc: APPINST
                    //@desc: ##########################
                    let currentItems = this.state.layoutAppInst;
                    let maxY = -1;
                    if (!isEmpty(currentItems)) {
                        maxY = _.maxBy(currentItems, 'y').y
                    }
                    let uniqueId = makeid(5)
                    let mapperList = this.state.layoutMapperAppInst

                    let itemOne = {
                        id: uniqueId,
                        hwType: paramHwType,
                        graphType: graphType,
                    }

                    await this.setState({
                        layoutAppInst: this.state.layoutAppInst.concat({
                            i: uniqueId,
                            x: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.x : 0,
                            y: !isEmpty(this.state.emptyPosXYInGrid) ? this.state.emptyPosXYInGrid.y : maxY + 1,
                            w: 1,
                            h: 1,
                        }),
                        layoutMapperAppInst: mapperList.concat(itemOne),
                    });
                    reactLocalStorage.setObject(getUserId() + APPINST_LAYOUT_KEY, this.state.layoutAppInst)
                    reactLocalStorage.setObject(getUserId() + APPINST_HW_MAPPER_KEY, this.state.layoutMapperAppInst)
                }
            }

            removeGridItem(i) {
                if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                    let removedLayout = _.reject(this.state.layoutCluster, {i: i});
                    reactLocalStorage.setObject(getUserId() + CLUSTER_LAYOUT_KEY, removedLayout)
                    this.setState({
                        layoutCluster: removedLayout,
                    });

                } else if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                    let removedLayout = _.reject(this.state.layoutCloudlet, {i: i});
                    reactLocalStorage.setObject(getUserId() + CLOUDLET_LAYOUT_KEY, removedLayout)
                    this.setState({
                        layoutCloudlet: removedLayout,
                    });
                } else {//@desc: AppInst Level
                    let removedLayout = _.reject(this.state.layoutAppInst, {i: i});
                    reactLocalStorage.setObject(getUserId() + APPINST_LAYOUT_KEY, removedLayout)
                    this.setState({
                        layoutAppInst: removedLayout,
                    });
                }
            }


            removeGridAllItem() {
                if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                    reactLocalStorage.setObject(getUserId() + CLOUDLET_LAYOUT_KEY, [])
                    this.setState({
                        layoutCloudlet: [],
                    });
                } else if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                    reactLocalStorage.setObject(getUserId() + CLUSTER_LAYOUT_KEY, [])
                    this.setState({
                        layoutCluster: [],
                    });
                } else {//@desc: AppInst Level
                    reactLocalStorage.setObject(getUserId() + APPINST_LAYOUT_KEY, [])
                    this.setState({
                        layoutAppInst: [],
                    });
                }
            }


            showBigModal = (paramHwType, graphType) => {
                try {
                    let chartDataForBigModal = []
                    if (graphType.toUpperCase() == GRID_ITEM_TYPE.LINE) {

                        let lineChartDataSet = []
                        if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                            lineChartDataSet = makeLineChartData(this.state.filteredClusterUsageList, paramHwType, this)
                        } else if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                            lineChartDataSet = makeLineChartData(this.state.filteredCloudletUsageList, paramHwType, this)
                        } else {
                            lineChartDataSet = makeLineChartData(this.state.filteredAppInstUsageList, paramHwType, this)
                        }
                        chartDataForBigModal = makeLineChartDataForBigModal(lineChartDataSet, this)

                    } else if (graphType.toUpperCase() == GRID_ITEM_TYPE.MULTI_LINE_CHART) {

                        let multiLineChartDataSets = []
                        if (paramHwType.length >= 2) {

                            if (this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER) {
                                for (let i in paramHwType) {
                                    let lineDataOne = makeLineChartData(this.state.filteredClusterUsageList, paramHwType[i], this)
                                    multiLineChartDataSets.push(lineDataOne);
                                }
                            }
                        }
                        let _resuit = makeMultiLineChartDatas(multiLineChartDataSets)
                        chartDataForBigModal = makeLineChartDataForBigModal(_resuit, this)

                    } else if (graphType.toUpperCase() == GRID_ITEM_TYPE.BAR || graphType.toUpperCase() == GRID_ITEM_TYPE.COLUMN) {
                        let barChartDataSet = makeBarChartDataForCluster(this.state.filteredClusterUsageList, paramHwType, this)
                        chartDataForBigModal = barChartDataSet.chartDataList;
                    }

                    this.setState({
                        isShowBigGraph: !this.state.isShowBigGraph,
                        chartDataForBigModal: chartDataForBigModal,
                        popupGraphHWType: paramHwType,
                        popupGraphType: graphType,
                        isPopupMap: !this.state.isPopupMap,
                        isMapUpdate: true,
                    });
                } catch (e) {

                    showToast(e.toString())
                }
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


            _______________makeGridItemOneBody(pHwType, graphType) {
                if (graphType.toUpperCase() === GRID_ITEM_TYPE.MULTI_LINE_CHART && pHwType.length >= 2) {
                    let multiLineChartDataSets = []
                    if (this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER) {
                        for (let i in pHwType) {
                            let lineDataOne = makeLineChartData(this.state.filteredClusterUsageList, pHwType[i], this)
                            multiLineChartDataSets.push(lineDataOne);
                        }
                    }

                    return (
                        this.state.loading ? renderPlaceHolderLoader() :
                            <MultiHwLineChartContainer
                                isResizeComplete={this.state.isResizeComplete}
                                loading={this.state.loading}
                                currentClassification={this.state.currentClassification}
                                parent={this}
                                pHardwareType={pHwType.toString()}
                                chartDataSet={multiLineChartDataSets}
                            />
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.LINE) {
                    let chartDataSets: TypeLineChartData = [];
                    if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                        chartDataSets = makeLineChartData(this.state.filteredCloudletUsageList, pHwType, this)
                    } else if (this.state.currentClassification === CLASSIFICATION.CLUSTER || this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER) {
                        chartDataSets = makeLineChartData(this.state.filteredClusterUsageList, pHwType, this)
                    } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                        chartDataSets = makeLineChartData(this.state.filteredAppInstUsageList, pHwType, this)
                    }

                    return (
                        this.state.loading ? renderPlaceHolderLoader() :
                            <LineChartContainer
                                isResizeComplete={this.state.isResizeComplete}
                                loading={this.state.loading}
                                currentClassification={this.state.currentClassification}
                                parent={this}
                                pHardwareType={pHwType}
                                chartDataSet={chartDataSets}
                            />
                    )

                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.BAR || graphType.toUpperCase() === GRID_ITEM_TYPE.COLUMN) {
                    let barChartDataSet: TypeBarChartData = [];
                    if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                        barChartDataSet = makeBarChartDataForCloudlet(this.state.filteredCloudletUsageList, pHwType, this)
                        let lineChartDataOne = makeLineChartData(this.state.filteredCloudletUsageList, pHwType, this)
                        return (
                            <BarAndLineChartContainer
                                isResizeComplete={this.state.isResizeComplete}
                                parent={this}
                                loading={this.state.loading}
                                chartDataSet={barChartDataSet}
                                pHardwareType={pHwType}
                                graphType={graphType}
                                lineChartDataSets={lineChartDataOne}
                                filteredCloudletListLength={this.state.filteredCloudletList.length}
                            />
                        )
                    } else if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                        barChartDataSet = makeBarChartDataForCluster(this.state.filteredClusterUsageList, pHwType, this)
                        return (
                            <BarChartContainer
                                isResizeComplete={this.state.isResizeComplete} parent={this}
                                loading={this.state.loading}
                                chartDataSet={barChartDataSet}
                                pHardwareType={pHwType} graphType={graphType}
                            />
                        )
                    } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                        barChartDataSet = makeBarChartDataForAppInst(this.state.filteredAppInstUsageList, pHwType, this)


                        return (
                            <BarChartContainer
                                isResizeComplete={this.state.isResizeComplete} parent={this}
                                loading={this.state.loading}
                                chartDataSet={barChartDataSet}
                                pHardwareType={pHwType} graphType={graphType}
                            />
                        )
                    }


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
                                isEnableZoom={true}
                                currentClassification={this.state.currentClassification}
                                parent={this}
                                cloudletLength={this.state.filteredCloudletList.length}
                                cloudletList={this.state.filteredCloudletList}
                                appInstList={this.state.filteredAppInstList}
                                toggleOperMapZoom={!this.state.toggleOperMapZoom}
                                filteredClusterList={this.state.filteredClusterList}
                                filteredAppInstList={this.state.filteredAppInstList}
                                currentOperLevel={this.state.currentOperLevel}
                                filteredUsageList={this.state.filteredCloudletUsageList}
                            />
                        )
                    }

                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.PERFORMANCE_SUM) {
                    return (
                        this.state.loading ? renderPlaceHolderLoader() :
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
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.CLIENT_STATUS_TABLE) {
                    return (
                        <ClientStatusTableHooks
                            parent={this}
                            clientStatusList={this.state.filteredClientStatusList}
                            chartColorList={this.state.chartColorList}
                        />
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.CLUSTER_EVENTLOG_LIST) {
                    return (
                        <ClusterEventLogListHook eventLogList={this.state.filteredClusterEventLogList} parent={this}/>
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.APP_INST_EVENT_LOG) {
                    return this.state.loading ? renderPlaceHolderLoader() :
                        <AppInstEventLogListHooks
                            currentAppInst={this.state.currentAppInst}
                            parent={this}
                            handleAppInstDropdown={this.handleOnChangeAppInstDropdown}
                            eventLogList={this.state.filteredAppInstEventLogs}
                        />
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.CLUSTER_EVENTLOG_LIST) {
                    return this.state.loading ? renderPlaceHolderLoader() :
                        <ClusterEventLogListHook
                            parent={this}
                            eventLogList={this.state.filteredClusterEventLogList}
                        />
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.DONUTS) {
                    return this.state.loading ? renderPlaceHolderLoader() :
                        <DonutChartHooks
                            parent={this}
                            chartColorList={this.state.chartColorList}
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

            ___________________________________________________________________________________________________________________________________________________________________________________() {
            }

            renderGridLayoutForCluster() {
                try {
                    if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
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
                                layout={this.state.layoutCluster}
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
                                        layoutCluster: layout,
                                    }, async () => {
                                        await this.calculateEmptyPosInGrid(layout, defaultLayoutXYPosForCluster);
                                        reactLocalStorage.setObject(getUserId() + CLUSTER_LAYOUT_KEY, layout)
                                    });

                                }}
                                {...this.props}
                            >
                                {this.state.layoutCluster.map((item, loopIndex) => {

                                    const uniqueIndex = item.i;
                                    let hwType = HARDWARE_TYPE.CPU
                                    let graphType = GRID_ITEM_TYPE.LINE;
                                    if (!isEmpty(this.state.layoutMapperCluster.find(x => x.id === uniqueIndex))) {
                                        hwType = this.state.layoutMapperCluster.find(x => x.id === uniqueIndex).hwType
                                        graphType = this.state.layoutMapperCluster.find(x => x.id === uniqueIndex).graphType
                                        graphType = graphType.toUpperCase()
                                    }
                                    return this.makeGridItemOne(uniqueIndex, hwType, graphType, item)
                                })}

                            </ResponsiveReactGridLayout>

                        )
                    } else {
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
                                layout={this.state.layoutClusterForOper}
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
                                        layoutClusterForOper: layout,
                                    }, async () => {
                                        await this.calculateEmptyPosInGrid(layout, defaultLayoutXYPosForClusterForOper);
                                        reactLocalStorage.setObject(getUserId() + CLUSTER_FOR_OPER_LAYOUT_KEY, layout)
                                    });

                                }}
                                {...this.props}
                            >
                                {this.state.layoutClusterForOper.map((item, loopIndex) => {
                                    const uniqueIndex = item.i;
                                    let hwType = HARDWARE_TYPE.CPU
                                    let graphType = GRID_ITEM_TYPE.LINE;
                                    let hwTypeLength = 0;
                                    if (!isEmpty(this.state.layoutMapperClusterForOper.find(x => x.id === uniqueIndex))) {
                                        hwType = this.state.layoutMapperClusterForOper.find(x => x.id === uniqueIndex).hwType
                                        graphType = this.state.layoutMapperClusterForOper.find(x => x.id === uniqueIndex).graphType
                                        graphType = graphType.toUpperCase()
                                    }

                                    console.log(`item==${hwType}=>`, item);

                                    console.log(`layoutForClusterForOper===>`, this.state.layoutClusterForOper);

                                    return this.makeGridItemOne(uniqueIndex, hwType, graphType, item)
                                })}

                            </ResponsiveReactGridLayout>
                        )

                    }
                } catch (e) {
                    showToast(e.toString())
                }
            }


            renderGridLayoutForCloudlet() {
                try {
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
                            layout={this.state.layoutCloudlet}
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
                                    layoutCloudlet: layout,
                                }, async () => {
                                    await this.calculateEmptyPosInGrid(layout, defaultLayoutXYPosForCloudlet);
                                    reactLocalStorage.setObject(getUserId() + CLOUDLET_LAYOUT_KEY, layout)
                                });

                            }}
                            {...this.props}
                        >
                            {this.state.layoutCloudlet.map((item, loopIndex) => {
                                const uniqueIndex = item.i;
                                let hwType = HARDWARE_TYPE.CPU
                                let graphType = GRID_ITEM_TYPE.LINE;
                                if (!isEmpty(this.state.layoutMapperCloudlet.find(x => x.id === uniqueIndex))) {
                                    hwType = this.state.layoutMapperCloudlet.find(x => x.id === uniqueIndex).hwType
                                    graphType = this.state.layoutMapperCloudlet.find(x => x.id === uniqueIndex).graphType
                                    graphType = graphType.toUpperCase()
                                }
                                return this.makeGridItemOne(uniqueIndex, hwType, graphType, item)
                            })}

                        </ResponsiveReactGridLayout>

                    )
                } catch (e) {
                    //showToast(e.toString())
                }


            }


            renderGridLayoutForAppInst = () => {
                try {
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
                            layout={this.state.layoutAppInst}
                            rowHeight={this.gridItemHeight}
                            onLayoutChange={async (layout) => {
                                await this.setState({
                                    layoutAppInst: layout
                                }, async () => {
                                    await this.calculateEmptyPosInGrid(layout, defaultLayoutXYPosForAppInst);
                                    let layoutUniqueId = getUserId() + APPINST_LAYOUT_KEY;
                                    reactLocalStorage.setObject(layoutUniqueId, this.state.layoutAppInst)
                                });

                            }}
                        >
                            {this.state.layoutAppInst.map((item, loopIndex) => {

                                const uniqueIndex = item.i;
                                let hwType = HARDWARE_TYPE.CPU
                                let graphType = GRID_ITEM_TYPE.LINE;

                                if (!isEmpty(this.state.layoutMapperAppInst.find(x => x.id === uniqueIndex))) {
                                    hwType = this.state.layoutMapperAppInst.find(x => x.id === uniqueIndex).hwType
                                    graphType = this.state.layoutMapperAppInst.find(x => x.id === uniqueIndex).graphType
                                }
                                return this.makeGridItemOne(uniqueIndex, hwType, graphType, item)

                            })}
                        </ResponsiveReactGridLayout>
                    )
                } catch (e) {
                    showToast(e.toString())
                }
            }

            _______________________________________________________________________________________________________________________________________________________________________________________() {
            }

            revertToDefaultLayout = async () => {
                try {
                    if (this.state.userType.includes(USER_TYPE.DEVELOPER)) {
                        reactLocalStorage.remove(getUserId() + CLUSTER_LAYOUT_KEY)
                        reactLocalStorage.remove(getUserId() + CLUSTER_HW_MAPPER_KEY)
                        reactLocalStorage.remove(getUserId() + APPINST_LAYOUT_KEY)
                        reactLocalStorage.remove(getUserId() + APPINST_HW_MAPPER_KEY)
                        await this.setState({
                            layoutCluster: [],
                            layoutMapperCluster: [],
                            layoutAppInst: [],
                            layoutMapperAppInst: [],
                        });

                        await this.setState({
                            layoutCluster: defaultLayoutForCluster,
                            layoutMapperCluster: defaultHwMapperListForCluster,
                            layoutAppInst: defaultLayoutForAppInst,
                            layoutMapperAppInst: defaultLayoutMapperForAppInst,
                        });
                    } else {
                        reactLocalStorage.remove(getUserId() + CLOUDLET_LAYOUT_KEY)
                        reactLocalStorage.remove(getUserId() + CLOUDLET_HW_MAPPER_KEY)
                        await this.setState({
                            layoutCloudlet: [],
                            layoutMapperCloudlet: [],
                            layoutClusterForOper: [],
                            layoutMapperClusterForOper: [],
                        })

                        await this.setState({
                            layoutCloudlet: defaultLayoutForCloudlet,
                            layoutMapperCloudlet: defaultLayoutMapperForCloudlet,
                        })
                    }


                } catch (e) {
                    showToast(e.toString())
                }
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
                                        this.revertToDefaultLayout(this);
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


            handleOnChangeCloudletDropdown = async (pCloudletFullOne) => {
                try {
                    if (pCloudletFullOne !== undefined) {
                        await this.setState({currentCloudLet: getOnlyCloudletName(pCloudletFullOne)})
                        let currentCloudletOne = this.state.currentCloudLet
                        let filteredClusterList = this.state.allClusterList.filter((clusterOne: TypeCluster, index) => {
                            return clusterOne.Cloudlet === currentCloudletOne
                        })
                        let filteredClusterUsageList = this.state.allClusterUsageList.filter((clusterUsageOne: TypeClusterUsageOne, index) => {
                            return clusterUsageOne.cloudlet === currentCloudletOne
                        })
                        let filteredCloudletUsageList = this.state.allCloudletUsageList.filter((item: TypeCloudletUsage, index) => {
                            return item.cloudlet === currentCloudletOne
                        })

                        let filteredCloudletList = this.state.cloudletList.filter((item: TypeCloudlet, index) => {
                            return item.CloudletName === currentCloudletOne
                        })


                        let filteredAppInstList = this.state.appInstList.filter((item: TypeAppInst, index) => {
                            return item.Cloudlet === currentCloudletOne
                        })


                        let filteredClientStatusList = filteredClientStatusListByAppName(filteredAppInstList, this.state.allClientStatusList)

                        this.setState({
                            currentCloudLet: pCloudletFullOne,
                            filteredCloudletUsageList: filteredCloudletUsageList,
                            filteredCloudletList: filteredCloudletList,
                            filteredClusterList: filteredClusterList,
                            filteredClusterUsageList: filteredClusterUsageList,
                            filteredAppInstList: filteredAppInstList,
                            filteredClientStatusList: filteredClientStatusList,
                            currentClassification: CLASSIFICATION.CLOUDLET,
                            currentCluster: undefined,
                            currentOperLevel: undefined,
                            currentColorIndex: getOnlyCloudletIndex(pCloudletFullOne),
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
                            currentOperLevel: undefined,
                        })
                    }
                } catch (e) {

                    showToast(e.toString())
                }
            }

            renderStreamSwitch() {
                return (
                    <div style={PageMonitoringStyles.streamSwitchDiv}>
                        <div style={PageMonitoringStyles.listItemTitle}>
                            {/*{this.state.currentClassification}*/} Stream
                        </div>
                        <div style={PageMonitoringStyles.listItemTitle}>
                            <CustomSwitch
                                size="small"
                                checked={this.state.isStream}
                                color="primary"
                                onChange={async () => {
                                    await this.setState({isStream: !this.state.isStream});
                                    if (this.state.isStream === false) {
                                        clearInterval(this.intervalForAppInst)
                                        clearInterval(this.intervalForCluster)
                                        this.setState({isStream: false})
                                    } else {
                                        if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                                            await this.handleOnChangeClusterDropdown(this.state.currentCluster)
                                        } else {
                                            await this.handleOnChangeAppInstDropdown(this.state.currentAppInst)
                                        }
                                        this.setState({isStream: true})
                                    }
                                }}

                            />
                        </div>
                    </div>
                )
            }

            async handleOnChangeClusterDropdown(pClusterCloudletOne) {
                if (this.state.isStream === false) {
                    clearInterval(this.intervalForAppInst)
                    clearInterval(this.intervalForCluster)
                    await this.setState({isStream: false})
                }

                try {
                    //todo: When all Cluster
                    if (pClusterCloudletOne === '' || pClusterCloudletOne === undefined) {
                        await this.setState({
                            filteredClusterList: this.state.allClusterList,
                        })
                        await this.resetLocalData();
                    } else {
                        await this.setState({
                            selectedClientLocationListOnAppInst: [],
                            dropdownRequestLoading: true,
                            selectedAppInstIndex: -1,
                        })

                        let selectData = pClusterCloudletOne.split("|")
                        let selectedCluster = selectData[0].trim();
                        let selectedCloudlet = selectData[1].trim();

                        //desc: filter  ClusterUsageList
                        let allClusterUsageList = this.state.allClusterUsageList;
                        let filteredClusterUsageList = []
                        allClusterUsageList.map((item: TypeClusterUsageOne, index) => {
                            if (item.cluster === selectedCluster && item.cloudlet === selectedCloudlet) {
                                filteredClusterUsageList.push(item)
                            }
                        })

                        console.log(`Cluster====>`, selectedCluster);
                        console.log(`Cluster====>`, selectedCloudlet);
                        console.log(`Cluster====>`, filteredClusterUsageList);

                        let filteredAppInstList = []
                        this.state.appInstList.map((item: TypeAppInst, index) => {
                            if (item.ClusterInst === selectedCluster && item.Cloudlet === selectedCloudlet) {
                                filteredAppInstList.push(item)
                            }
                        })

                        let filteredClusterList = []
                        this.state.allClusterList.map((item: TypeCluster, index) => {
                            if (item.ClusterName === selectedCluster) {
                                filteredClusterList.push(item)
                            }
                        })


                        let appInstDropdown = makeDropdownForAppInst(filteredAppInstList)
                        let bubbleChartData = makeBubbleChartDataForCluster(filteredClusterUsageList, this.state.currentHardwareType, this.state.chartColorList);
                        await this.setState({
                            bubbleChartData: bubbleChartData,
                            currentCluster: pClusterCloudletOne,
                            currentClassification: this.state.userType.includes(USER_TYPE.DEVELOPER) ? CLASSIFICATION.CLUSTER : CLASSIFICATION.CLUSTER_FOR_OPER,
                            dropdownRequestLoading: false,
                            filteredClusterUsageList: filteredClusterUsageList,
                            // filteredClusterEventLogList: filteredClusterEventLogList,
                            filteredClusterEventLogList: [],
                            appInstDropdown: appInstDropdown,
                            allAppInstDropdown: appInstDropdown,
                            appInstSelectBoxPlaceholder: 'Select App Inst',
                            filteredAppInstList: filteredAppInstList,
                            appInstanceListGroupByCloudlet: reducer.groupBy(filteredAppInstList, CLASSIFICATION.CLOUDLET),
                            currentAppInst: undefined,
                            filteredClusterList: filteredClusterList,
                            currentOperLevel: CLASSIFICATION.CLUSTER,
                            //currentColorIndex: getOnlyCloudletIndex(pClusterCloudletOne),

                        }, () => {
                            console.log(`sdlkflskdfkl==3333==>`, this.state.filteredClusterUsageList);
                        });

                    }

                    //desc: ############################
                    //desc: setStream
                    //desc: ############################
                    if (this.state.isStream) {
                        this.setClusterInterval()
                        console.log(`sdlkflskdfkl====>`, this.intervalForCluster);

                    } else {
                        clearInterval(this.intervalForAppInst)
                        clearInterval(this.intervalForCluster)
                        await this.setState({isStream: false})
                        console.log(`intervalForCluster====>`, this.intervalForCluster);
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
                            ref={c => this.cloudletSelect = c}
                            showSearch={true}
                            dropdownStyle={{}}
                            listHeight={512}
                            style={{width: 250, maxHeight: '512px !important'}}
                            disabled={this.state.cloudletDropdownList.length === 0 || isEmpty(this.state.cloudletDropdownList)}
                            value={this.state.currentCloudLet !== undefined ? this.state.currentCloudLet.split("|")[0].trim() : undefined}
                            placeholder={'Select Cloudlet'}
                            onSelect={async (value) => {
                                this.handleOnChangeCloudletDropdown(value)
                                this.cloudletSelect.blur();
                            }}
                        >
                            {this.state.cloudletDropdownList.map((item: TypeCloudlet, index) => {
                                try {
                                    if (index === 0) {
                                        return <Option key={index} value={item.value} style={{}}>
                                            <div style={{color: 'orange', fontWeight: 'bold'}}>{item.text}</div>
                                        </Option>
                                    } else {
                                        let itemValues = item.value + " | " + (index - 1).toString()
                                        return (
                                            <Option key={index} value={itemValues}>{item.text}</Option>
                                        )
                                    }
                                } catch (e) {

                                }
                            })}
                        </Select>
                    </div>
                )
            }


            renderRangeDropdown() {
                return (
                    <div className="page_monitoring_dropdown_box" style={{alignSelf: 'center', justifyContent: 'center'}}>
                        <div className="page_monitoring_dropdown_label">
                            Range
                        </div>
                        <RangePicker
                            disabled={this.state.loading}
                            //disabled={true}
                            ref={c => this.rangePicker = c}
                            showTime={{format: 'HH:mm'}}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={[moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'), moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm')]}
                            onOk={async (date) => {
                                try {
                                    let stateTime = date[0].format('YYYY-MM-DD HH:mm')
                                    let endTime = date[1].format('YYYY-MM-DD HH:mm')
                                    await this.setState({
                                        startTime: stateTime,
                                        endTime: endTime,
                                    })
                                    // this.filterUsageListByDate()
                                    this.rangePicker.blur()
                                } catch (e) {

                                }

                            }}
                            ranges={{
                                Today: [moment(), moment()],
                                'Last 7 Days': [moment().subtract(7, 'd'), moment().subtract(1, 'd')],
                                'Last 30 Days': [moment().subtract(30, 'd'), moment().subtract(1, 'd')],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                                'Last Month': [moment().date(-30), moment().date(-1)],
                                'Last 6 Months': [moment().subtract(181, 'd'), moment().subtract(0, 'd')],
                                'Last 1 Year': [moment().subtract(364, 'd'), moment().subtract(0, 'd')],
                                'Last 2 Year': [moment().subtract(729, 'd'), moment().subtract(0, 'd')],
                                'Last 3 Year': [moment().subtract(1094, 'd'), moment().subtract(0, 'd')],
                            }}
                        />
                    </div>
                )
            }


            renderClusterDropdown() {

                if (this.state.userType.includes(USER_TYPE.DEVELOPER)) {
                    return (
                        <div className="page_monitoring_dropdown_box"
                             style={{alignSelf: 'center', justifyContent: 'center'}}>
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
                                            filteredClusterList: this.state.allClusterList,
                                        })
                                    } else {
                                        await this.filterClusterList(value)
                                    }
                                    await this.handleOnChangeClusterDropdown(value.trim())
                                }}
                            />
                        </div>
                    )
                } else {
                    //@todo: ####################################3
                    //@todo: When Operator
                    //@todo: ####################################3
                    return (
                        <div className="page_monitoring_dropdown_box"
                             style={{alignSelf: 'center', justifyContent: 'center'}}>
                            <div className="page_monitoring_dropdown_label">
                                Cluster
                            </div>
                            <Select
                                ref={c => this.clusterSelectForOper = c}
                                showSearch={true}
                                dropdownStyle={{}}
                                notFoundContent={<div
                                    style={{color: 'orange', marginLeft: 5, fontWeight: 'bold', fontStyle: 'italic'}}>No
                                    Cluster</div>}
                                listHeight={512}
                                style={{width: 250, maxHeight: '512px !important'}}
                                disabled={this.state.currentCloudLet === undefined && this.state.filteredClusterList.length === 0}
                                value={this.state.currentCluster}
                                placeholder={'Select Cluster'}
                                onChange={async (value) => {

                                    this.handleOnChangeClusterDropdown(value)
                                    this.clusterSelectForOper.blur();
                                }}
                            >
                                {this.state.filteredClusterList.map((item: TypeCluster, index) => {
                                    return (
                                        <Option key={index}
                                                value={item.ClusterName + " | " + item.Cloudlet}>{item.ClusterName}</Option>
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
                let allClusterList = this.state.allClusterList
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

            renderDot(index, itemCount = false) {
                return (
                    <div style={{backgroundColor: 'transparent', marginTop: 0,}}>
                        <div
                            style={{
                                backgroundColor: itemCount === 1 ? this.state.chartColorList[this.state.currentColorIndex] : this.state.chartColorList[index],
                                width: 15,
                                height: 15,
                                borderRadius: 50,
                            }}
                        >
                        </div>
                    </div>
                )
            }

            renderCloudletLegend(pLegendItemCount) {
                return (
                    <Row gutter={16}
                         style={{
                             flex: .97,
                             marginLeft: 10,
                             backgroundColor: 'transparent',
                             justifyContent: 'center',
                             alignSelf: 'center',
                             height: this.state.filteredCloudletList.length > 1 ? 50 : 25,
                         }}
                    >
                        {this.state.filteredCloudletList.map((item: TypeCloudlet, index) => {
                            return (
                                <Col
                                    key={index}
                                    className="gutterRow"
                                    onClick={async () => {
                                    }}
                                    span={pLegendItemCount === 1 ? 24 : 3}
                                    style={{
                                        marginTop: 3,
                                        marginBottom: 3,
                                        justifyContent: pLegendItemCount === 1 ? 'center' : null,
                                        //backgroundColor: 'blue',
                                    }}
                                    onClick={async () => {
                                        if (this.state.filteredCloudletList.length > 1) {
                                            let fullCloudletItemOne = item.CloudletName + " | " + JSON.stringify(item.CloudletLocation) + " | " + index.toString()
                                            await this.handleOnChangeCloudletDropdown(fullCloudletItemOne)
                                        } else {
                                            await this.handleOnChangeCloudletDropdown(undefined)
                                        }
                                    }}

                                >

                                    {this.renderDot(index, pLegendItemCount)}
                                    <div
                                        style={{marginTop: 0, marginLeft: 3}}
                                    >
                                        {reduceString(item.CloudletName, 21, pLegendItemCount)}
                                    </div>
                                    <div style={{marginRight: 5,}}>
                                    </div>

                                </Col>
                            )
                        })}
                    </Row>
                )
            }


            renderClusterLegend() {
                let filteredClusterUsageListLength = this.state.filteredClusterUsageList.length;

                return (
                    <Row gutter={16}
                         style={{
                             flex: .97,
                             marginLeft: 10,
                             justifyContent: 'center',
                             alignSelf: 'center',
                             display: filteredClusterUsageListLength === 1 ? 'flex' : null,
                         }}
                    >
                        {this.state.filteredClusterUsageList.map((item: TypeClusterUsageOne, index) => {
                            return (
                                <Col
                                    key={index}
                                    className="gutterRow"
                                    onClick={async () => {
                                        await this.setState({
                                            currentClassification: CLASSIFICATION.CLUSTER
                                        })
                                        if (this.state.filteredClusterUsageList.length > 1) {
                                            let clusterOne = item.cluster + " | " + item.cloudlet;
                                            await this.handleOnChangeClusterDropdown(clusterOne)
                                        } else {
                                            await this.handleOnChangeClusterDropdown(undefined)
                                        }

                                    }}
                                    span={this.state.legendColSize}
                                    title={!this.state.isLegendExpanded ? item.cluster + '[' + item.cloudlet + ']' : null}
                                    style={{
                                        marginTop: 5, marginBottom: 5,
                                        justifyContent: filteredClusterUsageListLength === 1 ? 'center' : null,
                                        width: filteredClusterUsageListLength === 1 ? '100%' : null,

                                    }}
                                >
                                    {filteredClusterUsageListLength === 1 ?
                                        <Center style={{marginLeft: 100}}>
                                            {this.renderDot(index)}
                                            <div style={{display: 'flex', marginLeft: 3,}}>
                                                <div>
                                                    {item.cluster}
                                                </div>
                                                <div style={{color: 'yellow',}}>
                                                    &nbsp;[{item.cloudlet}]
                                                </div>
                                            </div>
                                        </Center>
                                        :
                                        <Center>
                                            <div>
                                                {this.renderDot(index)}
                                            </div>
                                            <div className="clusterCloudletBox">
                                                {reduceLegendClusterCloudletName(item, this)}
                                            </div>
                                        </Center>
                                    }
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
                try {
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
                        let legendItemCount = 0;

                        if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                            legendItemCount = this.state.filteredCloudletList.length
                        } else if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                            legendItemCount = this.state.filteredClusterUsageList.length;
                        } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                            legendItemCount = this.state.filteredAppInstList.length;
                        }

                        let RowHeight = Math.ceil(legendItemCount / 6);

                        return (
                            <LegendOuterDiv
                                style={{
                                    height: legendItemCount === 1 ? 30 : (30 * RowHeight),
                                    marginTop: 4,
                                }}>
                                {this.state.currentClassification === CLASSIFICATION.CLUSTER || this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER ?//@desc: CLUSTER  Level Legend
                                    this.renderClusterLegend()
                                    ://@desc: When Cloudlet Level Legend
                                    this.state.currentClassification === CLASSIFICATION.CLOUDLET ?
                                        this.renderCloudletLegend(legendItemCount)
                                        //@desc: When AppLevel Legend
                                        : this.state.currentClassification === CLASSIFICATION.APPINST &&
                                        this.renderAppLegend()

                                }
                                {/*@todo:################################*/}
                                {/*@todo: fold/unfoled icons on right    */}
                                {/*@todo:################################*/}
                                {this.state.currentClassification === CLASSIFICATION.CLUSTER || this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER &&
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
                } catch (e) {

                }
            }


            renderMonitoringTitleArea() {
                return (
                    <label className='content_title_label' style={{marginBottom: 1}}
                           onClick={() => {
                               this.state.userType.includes(USER_TYPE.OPERATOR) ? this.handleOnChangeCloudletDropdown(undefined) : this.handleOnChangeClusterDropdown('')
                           }}
                    >
                        Monitoring
                        <div style={{color: 'pink', fontSize: 14}}>
                            &nbsp;&nbsp;[{this.state.currentClassification}]

                        </div>
                        <div style={{color: 'green', fontSize: 14}}>
                            &nbsp;&nbsp;&nbsp;&nbsp;{localStorage.selectRole.toString()}
                        </div>
                        <div style={{color: 'skyblue', fontSize: 14}}>
                            &nbsp;&nbsp;&nbsp;&nbsp;{localStorage.selectOrg.toString()}
                        </div>
                    </label>
                )
            }

            renderHeader() {
                return (
                    <>
                        <Toolbar className='monitoring_title' style={{marginTop: -5}}>
                            <div className='page_monitoring_select_area'
                                 style={{
                                     width: 'fit-content',
                                     flex: .7,
                                 }}>
                                {this.renderMonitoringTitleArea()}
                                {this.state.userType.includes(USER_TYPE.OPERATOR) ?
                                    <React.Fragment>
                                        <div style={{marginLeft: 25}}>
                                            {this.renderCloudletDropdown()}
                                        </div>
                                        <div style={{marginLeft: 25}}>
                                            {this.renderRangeDropdown()}
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
                            <div style={{
                                display: 'flex', flex: .3, justifyContent: 'flex-end',
                            }}>
                                {this.renderStreamSwitch()}
                                {this.makeTopRightMenuActionButton()}
                            </div>
                        </Toolbar>
                    </>

                )
            }

            renderGridLayoutByClassification() {
                if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                    return this.renderGridLayoutForCloudlet();
                } else if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                    return this.renderGridLayoutForCluster();
                } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                    return this.renderGridLayoutForAppInst();
                }
            }

            renderNoItemMsg() {
                if (!this.state.loading && this.state.currentClassification === CLASSIFICATION.CLOUDLET && this.state.layoutCloudlet.length === 0 ||
                    !this.state.loading && this.state.currentClassification === CLASSIFICATION.CLUSTER && this.state.layoutCluster.length === 0 ||
                    !this.state.loading && this.state.currentClassification === CLASSIFICATION.APPINST && this.state.layoutAppInst.length === 0
                ) {
                    return (
                        <div style={{
                            marginLeft: 15,
                            marginTop: 10,
                            fontSize: 25,
                            color: 'orange'
                        }}>No Item</div>
                    )
                }
            }

            render() {
                if (!this.state.isExistData) {
                    return (
                        <div style={{width: '100%', height: '100%',}}>
                            {this.renderHeader()}
                            <div style={{marginTop: 25, marginLeft: 25, background: 'none'}}>
                                <div style={{fontSize: 25, color: 'orange'}}>
                                    There is no app, cluster and cloudlet you can access..
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
                        <AddItemPopupContainer parent={this} isOpenEditView={this.state.isOpenEditView}
                                               currentClassification={this.state.currentClassification}/>
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
                                <SemanticToastContainer position={"bottom-center"} color={'red'}/>
                                {this.renderHeader()}
                                {this.makeLegend()}
                                <div className="page_monitoring"
                                     style={{
                                         overflowY: 'auto',
                                         height: 'calc(100% - 135px)',
                                         marginTop: 0,
                                         marginRight: 50,
                                         backgroundColor: this.props.themeType === 'light' ? 'white' : null
                                     }}>
                                    {this.renderNoItemMsg()}
                                    {this.renderGridLayoutByClassification()}
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
