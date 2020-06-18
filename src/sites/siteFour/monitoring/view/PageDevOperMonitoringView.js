import {Center, ClusterCluoudletLabel, LegendOuterDiv, PageMonitoringStyles} from '../common/PageMonitoringStyles'
import {SemanticToastContainer} from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {withSize} from 'react-sizeme';
import {connect} from 'react-redux';
import {Dialog, Toolbar} from '@material-ui/core'
import {Button, Col, DatePicker, Dropdown as ADropdown, Menu as AMenu, Row, Select, TreeSelect} from 'antd';
import {
    filterByClassification,
    getCloudletClusterNameList,
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
    gridItemOneHeight,
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
    TypeCloudletEventLog,
    TypeCloudletUsage,
    TypeCluster,
    TypeClusterEventLog,
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
    getAllCloudletEventLogs,
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
import MapForDev from "../components/MapForDev";
import {Responsive, WidthProvider} from "react-grid-layout";
import maxBy from 'lodash/maxBy';
import reject from 'lodash/reject';
import BigModalGraphContainer from "../components/BigModalGraphContainer";
import BubbleChartContainer from "../components/BubbleChartContainer";
import LineChartContainer from "../components/LineChartContainer";
import ClusterEventLogList from "../components/ClusterEventLogList";
import MaterialIcon from "material-icons-react";
import '../common/PageMonitoringStyles.css'
import type {Layout, LayoutItem} from "react-grid-layout/lib/utils";
import {THEME_TYPE} from "../../../../themeStyle";
import BarChartContainer from "../components/BarChartContainer";
import PerformanceSummaryForCluster from "../components/PerformanceSummaryForCluster";
import PerformanceSummaryForAppInst from "../components/PerformanceSummaryForAppInst";
import AppInstEventLogList from "../components/AppInstEventLogList";
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
    CLUSTER_HW_MAPPER_KEY,
    CLUSTER_LAYOUT_KEY,
    defaultHwMapperListForCluster,
    defaultLayoutForAppInst,
    defaultLayoutForCloudlet,
    defaultLayoutForCluster,
    defaultLayoutMapperForAppInst,
    defaultLayoutMapperForCloudlet,
    defaultLayoutXYPosForAppInst,
    defaultLayoutXYPosForCloudlet,
    defaultLayoutXYPosForCluster,
    GRID_ITEM_TYPE
} from "./PageMonitoringLayoutProps";
import MapForOper from "../components/MapForOper";
import DonutChart from "../components/DonutChart";
import ClientStatusTable from "../components/ClientStatusTable";
import MethodUsageCount from "../components/MethodUsageCount";
import {filteredClientStatusListByAppName, makeCompleteDateTime} from "../service/PageAdmMonitoringService";
import MultiHwLineChartContainer from "../components/MultiHwLineChartContainer";
import AddItemPopupContainer from "../components/AddItemPopupContainer";
import CloudletEventLogList from "../components/CloudletEventLogList";
import axios from "axios";
import {UnfoldLess, UnfoldMore} from "@material-ui/icons";

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
    windowDimensions: number,
    currentWidth: number,
    emptyPosXYInGrid: any,
    emptyPosXYInGrid2: any,
    toastMessage: string,
    isToastOpen: boolean,
    mapLoading: boolean,
    isLegendExpanded: boolean,
    chunkedSize: number,
    selectedAppInstIndex: number,
    isOpenGlobe: boolean,
    legendColSize: number,
    currentAppVersion: number,
    isEnableZoomIn: boolean,
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
    loadingForClientStatus: boolean,
    allCloudletEventLogList: any,
    filteredCloudletEventLogList: any,
    currentClusterList: any,
    currentAppInstNameVersion: string,
    prevPromise: any,
    legendItemCount: number,
    legendHeight: number,
    isFirstLoad: boolean,
    legendRowCount: number,
    open: boolean,
    clusterTreeDropdownList: any,
}

export const CancelToken = axios.CancelToken;
export const source = CancelToken.source();


export default withSize()(connect(PageDevMonitoringMapStateToProps, PageDevMonitoringMapDispatchToProps)((
        class PageDevMonitoring extends Component<PageMonitoringProps, PageDevMonitoringState> {
            intervalForAppInst = 0;
            intervalForCluster = 0;
            webSocketInst: WebSocket = null;
            gridItemHeight = 255;
            lastDay = 30;

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
                let themeKey = getUserId() + "_mon_theme";
                let themeTitle = getUserId() + "_mon_theme_title";

                //@fixme: DELETE THEME COLOR
                /*reactLocalStorage.remove(clusterLayout)
                reactLocalStorage.remove(clusterLayoutMapper)*/

                this.state = {
                    //todo:dev layout
                    layoutCluster: isEmpty(reactLocalStorage.get(clusterLayout)) ? defaultLayoutForCluster : reactLocalStorage.getObject(clusterLayout),
                    layoutMapperCluster: isEmpty(reactLocalStorage.get(clusterLayoutMapper)) ? defaultHwMapperListForCluster : reactLocalStorage.getObject(clusterLayoutMapper),
                    layoutAppInst: isEmpty(reactLocalStorage.get(appInstLayout)) ? defaultLayoutForAppInst : reactLocalStorage.getObject(appInstLayout),
                    layoutMapperAppInst: isEmpty(reactLocalStorage.get(appInstLayoutMapper)) ? defaultLayoutMapperForAppInst : reactLocalStorage.getObject(appInstLayoutMapper),
                    //todo:oper layout
                    layoutCloudlet: isEmpty(reactLocalStorage.get(cloudletLayout)) ? defaultLayoutForCloudlet : reactLocalStorage.getObject(cloudletLayout),
                    layoutMapperCloudlet: isEmpty(reactLocalStorage.get(cloudletlayoutMapper)) ? defaultLayoutMapperForCloudlet : reactLocalStorage.getObject(cloudletlayoutMapper),
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
                    currentClusterList: undefined,
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
                    clusterTreeDropdownList: undefined,
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
                    loadingForClientStatus: false,
                    allCloudletEventLogList: [],
                    filteredCloudletEventLogList: [],
                    currentAppInstNameVersion: '',
                    prevPromise: undefined,
                    legendItemCount: 0,
                    legendHeight: 30,
                    isFirstLoad: true,
                    open: false,
                };
            }

            async componentWillReceiveProps(nextProps: PageMonitoringProps, nextContext: any): void {
                if (this.props.size.width !== nextProps.size.width) {
                    window.dispatchEvent(new Event('resize'))
                }
            }


            componentDidMount = async () => {
                try {
                    this.setState({
                        loading: true,
                        bubbleChartLoader: true,
                        selectOrg: localStorage.selectOrg === undefined ? '' : localStorage.selectOrg.toString(),
                        mapLoading: true,
                        dropdownRequestLoading: true,
                        loadingForClientStatus: true,

                    })
                    await this.loadInitData();
                    this.setState({
                        loading: false,
                        bubbleChartLoader: false,
                    })
                } catch (e) {

                }
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
                    let date = [moment().subtract(this.lastDay, 'd').format('YYYY-MM-DD HH:mm'), moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm')]
                    let startTime = makeCompleteDateTime(date[0]);
                    let endTime = makeCompleteDateTime(date[1]);

                    //@desc:#############################################
                    //@desc: (allClusterList, appnInstList, cloudletList)
                    //@desc:#############################################
                    //TODO:###############################################
                    //todo:DEVELOPER
                    //TODO:###############################################

                    let clientStatusList = []
                    if (this.state.userType.includes(USER_TYPE.DEVELOPER)) {
                        promiseList.push(fetchClusterList())
                        promiseList.push(fetchAppInstList())
                        let newPromiseList = await Promise.all(promiseList);
                        clusterList = newPromiseList[0];
                        appInstList = newPromiseList[1];
                        clientStatusList = await getClientStatusList(appInstList, startTime, endTime);
                    } else {
                        //TODO:###############################################
                        //TODO:OPERATOR
                        //TODO:###############################################
                        cloudletList = await fetchCloudletList();
                        let allCloudletEventLogList = []
                        allCloudletEventLogList = await getAllCloudletEventLogs(cloudletList, startTime, endTime)
                        appInstList = await fetchAppInstList()
                        clientStatusList = await getClientStatusList(appInstList, startTime, endTime);
                        await this.setState({
                            loadingForClientStatus: false,
                            allCloudletEventLogList: allCloudletEventLogList,
                            filteredCloudletEventLogList: allCloudletEventLogList,

                        })
                    }

                    await this.setState({
                        allClientStatusList: clientStatusList,
                        filteredClientStatusList: clientStatusList,
                        loadingForClientStatus: false,
                    })

                    let orgAppInstList = appInstList.filter((item: TypeAppInst, index) => item.OrganizationName === localStorage.getItem('selectOrg'))
                    //@desc:#########################################################################
                    //@desc: map Marker
                    //@desc:#########################################################################
                    let markerListForMap = reducer.groupBy(orgAppInstList, CLASSIFICATION.CLOUDLET);
                    await this.setState({
                        cloudletList: cloudletList,
                        filteredCloudletList: cloudletList,
                        appInstanceListGroupByCloudlet: !isInterval && markerListForMap,
                    });


                    let cloudletClusterListMap = {}
                    let clusterTreeDropdownList = []
                    //@desc:#########################################################################
                    //@desc: getAllClusterEventLogList, getAllAppInstEventLogs ,allClusterUsageList
                    //@desc:#########################################################################
                    //todo:#################################
                    //todo: DEVELOPER
                    //todo:###################################
                    if (this.state.userType.includes(USER_TYPE.DEVELOPER)) {
                        promiseList2.push(getAllClusterEventLogList(clusterList))
                        promiseList2.push(getAllAppInstEventLogs());
                        promiseList2.push(getClusterLevelUsageList(clusterList, "*", RECENT_DATA_LIMIT_COUNT))
                        let newPromiseList2 = await Promise.all(promiseList2);
                        allClusterEventLogList = newPromiseList2[0];
                        allAppInstEventLogList = newPromiseList2[1];
                        allClusterUsageList = newPromiseList2[2];


                        cloudletClusterListMap = getCloudletClusterNameList(clusterList)
                        let regionList = localStorage.getItem('regions').split(",")
                        clusterTreeDropdownList = makeClusterTreeDropdown(regionList, cloudletClusterListMap.cloudletNameList, allClusterUsageList, this)


                    } else {//TODO:OPERATOR
                        allCloudletUsageList = await getCloudletUsageList(cloudletList, "*", RECENT_DATA_LIMIT_COUNT, startTime, endTime);
                    }

                    let bubbleChartData = await makeBubbleChartDataForCluster(allClusterUsageList, HARDWARE_TYPE.CPU, this.state.chartColorList, this.state.currentColorIndex);
                    let cloudletDropdownList = makeDropdownForCloudlet(cloudletList)
                    let dataCount = 0;
                    if (this.state.userType.includes(USER_TYPE.DEVELOPER)) {
                        dataCount = clusterList.length
                    } else {
                        dataCount = cloudletList.length
                    }

                    /*TODO: LEGEND ROW COUNTING*/
                    let itemCount = 0;
                    let rowCount = 0;
                    if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                        itemCount = cloudletList.length
                        rowCount = Math.ceil(itemCount / 8);
                    } else if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                        itemCount = clusterList.length;
                        rowCount = Math.ceil(itemCount / 6);
                    } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                        itemCount = appInstList.length;
                        rowCount = Math.ceil(itemCount / 6);
                    }

                    let legendHeight = Math.round(allCloudletUsageList.length / 4) * gridItemOneHeight


                    await this.setState({
                        isExistData: dataCount > 0,
                        bubbleChartData: bubbleChartData,
                        allClusterEventLogList: allClusterEventLogList,
                        filteredClusterEventLogList: allClusterEventLogList,
                        allAppInstEventLogs: allAppInstEventLogList,
                        filteredAppInstEventLogs: allAppInstEventLogList,
                        isReady: true,
                        clusterTreeDropdownList: clusterTreeDropdownList,//@fixme
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
                        allCloudletUsageList: allCloudletUsageList,
                        filteredCloudletUsageList: allCloudletUsageList,
                        cloudletDropdownList: cloudletDropdownList,
                        legendHeight: legendHeight,
                        legendItemCount: itemCount,
                        legendRowCount: rowCount,
                    }, () => {

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
                let markerListForMap = reducer.groupBy(this.state.appInstList.filter((item: TypeAppInst, index) => item.OrganizationName === localStorage.getItem('selectOrg')), CLASSIFICATION.CLOUDLET);
                await this.setState({
                    currentGridIndex: -1,
                    currentTabIndex: 0,
                    intervalLoading: false,
                    currentClassification: CLASSIFICATION.CLUSTER,
                    filteredClusterUsageList: this.state.allClusterUsageList,
                    filteredClusterList: this.state.allClusterList,
                    filteredAppInstList: this.state.appInstList,
                    filteredClusterEventLogList: this.state.allClusterEventLogList,
                    filteredAppInstEventLogs: this.state.allAppInstEventLogs,
                    appInstanceListGroupByCloudlet: markerListForMap,
                })
                //desc: reset bubble chart data
                let bubbleChartData = await makeBubbleChartDataForCluster(this.state.allClusterUsageList, HARDWARE_TYPE.CPU, this.state.chartColorList, this.state.currentColorIndex);
                await this.setState({
                    bubbleChartData: bubbleChartData,
                    dropdownRequestLoading: false,
                    currentClusterList: undefined,
                    currentAppInst: undefined,
                    appInstDropdown: [],
                    isShowAppInstPopup: !this.state.isShowAppInstPopup,
                    isEnableZoomIn: !this.state.isEnableZoomIn,
                    legendItemCount: this.state.allClusterUsageList.length,
                    appInstSelectBoxPlaceholder: 'Select App Inst',
                    currentAppInstNameVersion: undefined,
                    selectedClientLocationListOnAppInst: [],
                    filteredClientStatusList: this.state.allClientStatusList,
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
                    currentClusterList: '',
                    currentAppInst: '',
                })

            }

            convertToClassification(pClassification) {
                if (pClassification === CLASSIFICATION.APPINST) {
                    return CLASSIFICATION.APP_INSTANCE//"App Instance"
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
                    try {

                        this.setState({intervalLoading: true})
                        let filteredClusterUsageList = await getClusterLevelUsageList(this.state.filteredClusterList, "*", RECENT_DATA_LIMIT_COUNT, '', '', this);
                        this.setChartDataForBigModal(filteredClusterUsageList)
                        this.setState({
                            intervalLoading: false,
                            filteredClusterUsageList: filteredClusterUsageList,
                        })
                    } catch (e) {
                        showToast(e.toString())
                    } finally {
                        this.setState({
                            intervalLoading: false,
                        })
                    }

                }, 1000 * 6.0)
            }

            setAppInstInterval(filteredAppList) {
                try {
                    this.intervalForAppInst = setInterval(async () => {
                        this.setState({intervalLoading: true,})
                        let allAppInstUsageList = await getAppLevelUsageList(filteredAppList, "*", RECENT_DATA_LIMIT_COUNT);
                        this.setChartDataForBigModal(allAppInstUsageList)
                        this.setState({
                            intervalLoading: false,
                            filteredAppInstUsageList: allAppInstUsageList,
                        })
                    }, 1000 * 7.0)
                } catch (e) {

                } finally {
                    this.setState({
                        intervalLoading: false,
                    })
                }
            }


            setChartDataForBigModal(usageList) {
                let lineChartDataSet = makeLineChartData(usageList, this.state.currentHardwareType, this)
                let chartDataForBigModal = makeLineChartDataForBigModal(lineChartDataSet, this)
                this.setState({
                    chartDataForBigModal: chartDataForBigModal,
                })
            }

            makeGridItemWidth(graphType) {
                if (graphType === GRID_ITEM_TYPE.PERFORMANCE_SUM || graphType === GRID_ITEM_TYPE.CLIENT_STATUS_TABLE) {
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
                        maxY = maxBy(currentLayout, 'y').y
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
                        maxY = maxBy(currentItems, 'y').y
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
                        maxY = maxBy(currentItems, 'y').y
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
                    let removedLayout = reject(this.state.layoutCluster, {i: i});
                    reactLocalStorage.setObject(getUserId() + CLUSTER_LAYOUT_KEY, removedLayout)
                    this.setState({
                        layoutCluster: removedLayout,
                    });
                } else if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                    let removedLayout = reject(this.state.layoutCloudlet, {i: i});
                    reactLocalStorage.setObject(getUserId() + CLOUDLET_LAYOUT_KEY, removedLayout)
                    this.setState({
                        layoutCloudlet: removedLayout,
                    });
                } else {//@desc: AppInst Level
                    let removedLayout = reject(this.state.layoutAppInst, {i: i});
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


            showBigModal = (pHwType, graphType) => {
                try {
                    let chartDataForBigModal = []
                    if (graphType.toUpperCase() === GRID_ITEM_TYPE.LINE) {

                        let lineChartDataSet = []
                        if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                            lineChartDataSet = makeLineChartData(this.state.filteredClusterUsageList, pHwType, this)
                        } else if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                            lineChartDataSet = makeLineChartData(this.state.filteredCloudletUsageList, pHwType, this)
                        } else {
                            lineChartDataSet = makeLineChartData(this.state.filteredAppInstUsageList, pHwType, this)
                        }
                        chartDataForBigModal = makeLineChartDataForBigModal(lineChartDataSet, this, this.state.currentColorIndex)

                    } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.MULTI_LINE_CHART) {

                        let multiLineChartDataSets = []
                        if (pHwType.length >= 2) {

                            if (this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER) {
                                for (let i in pHwType) {
                                    let lineDataOne = makeLineChartData(this.state.filteredClusterUsageList, pHwType[i], this)
                                    multiLineChartDataSets.push(lineDataOne);
                                }
                            }
                        }
                        let _resuit = makeMultiLineChartDatas(multiLineChartDataSets)
                        chartDataForBigModal = makeLineChartDataForBigModal(_resuit, this)

                    } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.BAR || graphType.toUpperCase() === GRID_ITEM_TYPE.COLUMN) {
                        let chartDataSet = []
                        if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                            chartDataSet = makeBarChartDataForCloudlet(this.state.filteredCloudletUsageList, pHwType, this, this.state.currentColorIndex)
                            chartDataForBigModal = chartDataSet.chartDataList;
                        } else {
                            chartDataSet = makeBarChartDataForCluster(this.state.filteredClusterUsageList, pHwType, this)
                            chartDataForBigModal = chartDataSet.chartDataList;
                        }
                    }
                    this.setState({
                        isShowBigGraph: !this.state.isShowBigGraph,
                        chartDataForBigModal: chartDataForBigModal,
                        popupGraphHWType: pHwType,
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
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.METHOD_USAGE_COUNT
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.DONUTS
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.CLIENT_STATUS_TABLE
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.APP_INST_EVENT_LOG
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.CLOUDLET_EVENT_LOG
                            && graphType.toUpperCase() !== GRID_ITEM_TYPE.CLUSTER_EVENT_LOG
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
                            {this._____makeGridItemOneBody(hwType, graphType.toUpperCase())}
                        </div>
                    </div>
                )
            }


            _____makeGridItemOneBody(pHwType, graphType) {
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
                        <LineChartContainer
                            isResizeComplete={this.state.isResizeComplete}
                            loading={this.state.loading}
                            currentClassification={this.state.currentClassification}
                            parent={this}
                            pHardwareType={pHwType}
                            chartDataSet={chartDataSets}
                            currentColorIndex={this.state.currentColorIndex}
                        />
                    )

                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.BAR || graphType.toUpperCase() === GRID_ITEM_TYPE.COLUMN) {
                    let barChartDataSet: TypeBarChartData = [];
                    if (this.state.currentClassification === CLASSIFICATION.CLOUDLET) {
                        barChartDataSet = makeBarChartDataForCloudlet(this.state.filteredCloudletUsageList, pHwType, this, this.state.currentColorIndex)
                        return (
                            <BarChartContainer
                                isResizeComplete={this.state.isResizeComplete} parent={this}
                                loading={this.state.loading}
                                chartDataSet={barChartDataSet}
                                pHardwareType={pHwType} graphType={graphType}
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
                            <MapForDev
                                markerList={this.state.appInstanceListGroupByCloudlet}
                                currentWidgetWidth={this.state.currentWidgetWidth}
                                isMapUpdate={this.state.isMapUpdate}
                                selectedClientLocationListOnAppInst={this.state.selectedClientLocationListOnAppInst}
                                mapPopUploading={this.state.mapPopUploading}
                                parent={this}
                                isDraggable={this.state.isDraggable}
                                handleOnChangeAppInstDropdown={this.handleOnChangeAppInstDropdown}
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
                                chartColorList={this.state.chartColorList}
                                currentColorIndex={this.state.currentColorIndex}
                            />
                        )
                    }

                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.PERFORMANCE_SUM) {
                    return (
                        this.state.currentClassification === CLASSIFICATION.CLUSTER ?
                            <PerformanceSummaryForCluster
                                parent={this}
                                loading={this.state.loading}
                                filteredUsageList={this.state.filteredClusterUsageList}
                                chartColorList={this.state.chartColorList}
                            />
                            :
                            <PerformanceSummaryForAppInst
                                parent={this}
                                loading={this.state.loading}
                                filteredUsageList={this.state.filteredAppInstUsageList}
                                chartColorList={this.state.chartColorList}
                            />
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.CLIENT_STATUS_TABLE) {
                    return (
                        <ClientStatusTable
                            parent={this}
                            clientStatusList={this.state.filteredClientStatusList}
                            chartColorList={this.state.chartColorList}
                            loadingForClientStatus={this.state.loadingForClientStatus}
                        />
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.CLOUDLET_EVENT_LOG) {
                    return (
                        <CloudletEventLogList
                            currentClassification={this.state.currentClassification}
                            currentCloudlet={this.state.currentCloudLet}
                            parent={this}
                            handleCloudletDropdown={this.handleOnChangeCloudletDropdown}
                            cloudletEventLogList={this.state.filteredCloudletEventLogList}
                        />
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.CLUSTER_EVENT_LOG) {
                    return (
                        <ClusterEventLogList
                            currentCloudlet={this.state.currentClusterList}
                            parent={this}
                            currentClassification={this.state.currentClassification}
                            loading={this.state.loading}
                            handleCloudletDropdown={this.handleOnChangeCloudletDropdown}
                            eventLogList={this.state.filteredClusterEventLogList}
                        />
                    )
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.APP_INST_EVENT_LOG) {
                    return (
                        <AppInstEventLogList
                            currentAppInst={this.state.currentAppInst}
                            parent={this}
                            loading={this.state.loading}
                            handleAppInstDropdown={this.handleOnChangeAppInstDropdown}
                            eventLogList={this.state.filteredAppInstEventLogs}
                        />
                    )

                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.DONUTS) {
                    return this.state.loading ? renderPlaceHolderLoader() :
                        <DonutChart
                            parent={this}
                            chartColorList={this.state.chartColorList}
                            currentClassification={this.state.currentClassification}
                            filteredUsageList={this.state.currentClassification === CLASSIFICATION.CLOUDLET ? this.state.filteredCloudletUsageList : this.state.filteredClusterUsageList}
                        />
                } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.METHOD_USAGE_COUNT) {
                    return (
                        <MethodUsageCount
                            loading={this.state.loading}
                            clientStatusList={this.state.filteredClientStatusList}
                        />
                    )

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


            renderGridLayoutForCluster() {
                try {
                    return (
                        <ResponsiveReactGridLayout
                            ref={c => this.clusterGridlayout = c}
                            isResizable={true}
                            draggableHandle=".draggable"
                            verticalCompact={true}
                            compactType={'vertical'}
                            preventCollision={true}
                            isDraggable={true}
                            autoSize={true}
                            style={{
                                backgroundColor: this.props.themeType === THEME_TYPE.LIGHT ? 'white' : null,
                                overflowY: this.state.isLegendExpanded ? 'auto' : null,

                            }}
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

            async makeDropdownColorChange() {
                let newClusterList = []
                this.state.filteredClusterUsageList.map((item, index) => {
                    item.colorCodeIndex = index;
                    newClusterList.push(item)
                })
                let cloudletClusterNameMap = getCloudletClusterNameList(this.state.filteredClusterList)
                let allRegionList = localStorage.getItem('regions').split(",")
                clusterTreeDropdownList = makeClusterTreeDropdown(allRegionList, cloudletClusterNameMap.cloudletNameList, allClusterUsageList, this)

                await this.setState({
                    clusterTreeDropdownList: clusterTreeDropdownList,
                })
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
                                            //todo:dropdown color changing
                                            this.makeDropdownColorChange()
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

                                            let filteredClusterCloudletlist = []
                                            this.state.filteredClusterUsageList.map((item: TypeClusterUsageOne, index) => {
                                                let clusterCloudletOne = item.cluster + ' | ' + item.cloudlet
                                                filteredClusterCloudletlist.push(clusterCloudletOne)
                                            })

                                            await this.handleOnChangeClusterDropdown(filteredClusterCloudletlist)

                                        } else {
                                            await this.handleOnChangeAppInstDropdown(this.state.currentAppInst)
                                        }
                                        this.setState({
                                            isStream: true,
                                        })
                                    }
                                }}

                            />
                        </div>
                    </div>
                )
            }


            handleOnChangeCloudletDropdown = async (pCloudletFullOne, cloudletIndex) => {
                try {
                    if (pCloudletFullOne !== undefined && pCloudletFullOne.toString() !== '0') {
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

                        let filteredCloudletEventLogList = this.state.allCloudletEventLogList.filter((item: TypeCloudletEventLog, index) => {
                            return item[1] === currentCloudletOne
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
                            currentClusterList: undefined,
                            currentOperLevel: undefined,
                            filteredCloudletEventLogList: filteredCloudletEventLogList,
                            currentColorIndex: cloudletIndex,

                        });
                    } else {//todo: When allCloudlet
                        this.setState({
                            currentCloudLet: undefined,
                            filteredCloudletUsageList: this.state.allCloudletUsageList,
                            filteredCloudletList: this.state.cloudletList,
                            toggleOperMapZoom: !this.state.toggleOperMapZoom,
                            filteredClientStatusList: this.state.allClientStatusList,
                            currentClassification: CLASSIFICATION.CLOUDLET,
                            currentClusterList: undefined,
                            currentOperLevel: undefined,
                            filteredCloudletEventLogList: this.state.allCloudletEventLogList,
                        })
                    }
                } catch (e) {

                    showToast(e.toString())
                }
            }


            async handleOnChangeClusterDropdown(selectClusterCloudletList) {
                try {
                    if (this.state.isStream === false) {
                        clearInterval(this.intervalForAppInst)
                        clearInterval(this.intervalForCluster)
                        await this.setState({isStream: false})
                    }


                    if (!isEmpty(selectClusterCloudletList)) {
                        let allClusterUsageList = this.state.allClusterUsageList
                        let filteredClusterUsageList = this.filterClusterUsageListForTreeSelect(allClusterUsageList, selectClusterCloudletList)

                        let allClusterList = this.state.allClusterList
                        let filteredClusterList = this.filterClusterListForTreeSelect(allClusterList, selectClusterCloudletList)

                        await this.setState({
                            filteredClusterUsageList: filteredClusterUsageList,
                            filteredClusterList: filteredClusterList,
                            selectedClientLocationListOnAppInst: [],
                            dropdownRequestLoading: true,
                            selectedAppInstIndex: -1,
                        })

                        let filteredAppInstList = []
                        this.state.appInstList.map((appInstOne, index) => {
                            selectClusterCloudletList.map((innerItem, innerIndex) => {
                                if (appInstOne.ClusterInst === innerItem.split("|")[0].trim() && appInstOne.Cloudlet === innerItem.split("|")[1].trim()) {
                                    filteredAppInstList.push(appInstOne)
                                }
                            })
                        })


                        let filteredClusterEventLogList = []
                        this.state.allClusterEventLogList.map((clusterEventLogOne: TypeClusterEventLog, index) => {

                            selectClusterCloudletList.map((innerItem, innerIndex) => {
                                if (clusterEventLogOne[1] === innerItem.split("|")[0].trim()) {
                                    filteredClusterEventLogList.push(clusterEventLogOne)
                                }
                            })
                        })

                        let appInstDropdown = makeDropdownForAppInst(filteredAppInstList)
                        let bubbleChartData = makeBubbleChartDataForCluster(filteredClusterUsageList, this.state.currentHardwareType, this.state.chartColorList);
                        let filteredClientStatusList = filteredClientStatusListByAppName(filteredAppInstList, this.state.allClientStatusList)

                        await this.setState({
                            filteredClientStatusList: filteredClientStatusList,
                            bubbleChartData: bubbleChartData,
                            currentClusterList: selectClusterCloudletList,
                            currentClassification: this.state.userType.includes(USER_TYPE.DEVELOPER) ? CLASSIFICATION.CLUSTER : CLASSIFICATION.CLUSTER_FOR_OPER,
                            dropdownRequestLoading: false,
                            filteredClusterUsageList: filteredClusterUsageList,
                            appInstDropdown: appInstDropdown,
                            allAppInstDropdown: appInstDropdown,
                            appInstSelectBoxPlaceholder: 'Select App Inst',
                            filteredAppInstList: filteredAppInstList,
                            appInstanceListGroupByCloudlet: reducer.groupBy(filteredAppInstList, CLASSIFICATION.CLOUDLET),
                            currentAppInst: undefined,
                            currentAppInstNameVersion: undefined,
                            filteredClusterList: filteredClusterList,
                            currentOperLevel: CLASSIFICATION.CLUSTER,
                            filteredClusterEventLogList: filteredClusterEventLogList,
                            currentColorIndex: -1,
                            legendItemCount: filteredClusterUsageList.length,
                        });
                    } else {//todo:when allCluster selected
                        this.resetLocalData();
                    }

                    //desc: ############################
                    //desc: setStream
                    //desc: ############################
                    if (this.state.isStream) {
                        clearInterval(this.intervalForAppInst)
                        clearInterval(this.intervalForCluster)
                        this.setClusterInterval()

                    } else {
                        clearInterval(this.intervalForAppInst)
                        clearInterval(this.intervalForCluster)
                        await this.setState({isStream: false})
                    }
                } catch (e) {

                }
            }

            handleOnChangeAppInstDropdown = async (fullCurrentAppInst) => {
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
                        this.webSocketInst = requestShowAppInstClientWS(fullCurrentAppInst, this);
                    }

                    await this.setState({
                        currentAppInst: fullCurrentAppInst,
                        loading: true,
                    })

                    let AppName = fullCurrentAppInst.split('|')[0].trim()
                    let Cloudlet = fullCurrentAppInst.split('|')[1].trim()
                    let ClusterInst = fullCurrentAppInst.split('|')[2].trim()
                    let Version = fullCurrentAppInst.split('|')[3].trim()
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
                    let appInstUsageList = await getAppLevelUsageList(filteredAppList, "*", RECENT_DATA_LIMIT_COUNT, arrDateTime[0], arrDateTime[1]);
                    fullCurrentAppInst = fullCurrentAppInst.trim();
                    fullCurrentAppInst = fullCurrentAppInst.split("|")[0].trim() + " | " + fullCurrentAppInst.split('|')[1].trim() + " | " + fullCurrentAppInst.split('|')[2].trim() + ' | ' + Version

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
                        currentAppInstNameVersion: AppName + ' [' + Version + ']',
                        currentAppInst: fullCurrentAppInst,
                        currentClusterList: isEmpty(this.state.currentClusterList) ? '' : this.state.currentClusterList,
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


            async filterUsageListByDateForCloudlet() {
                try {
                    if (this.state.startTime !== '' && this.state.endTime !== '') {
                        this.setState({
                            loading: true,
                            loadingForClientStatus: true,
                            filteredClientStatusList: [],
                        })
                        let startTime = makeCompleteDateTime(this.state.startTime);
                        let endTime = makeCompleteDateTime(this.state.endTime);
                        let usageList = await getCloudletUsageList(this.state.filteredCloudletList, "*", RECENT_DATA_LIMIT_COUNT, startTime, endTime);
                        let clientStatusList = await getClientStatusList(await fetchAppInstList(), startTime, endTime);

                        this.setState({
                            filteredCloudletUsageList: usageList,
                            allCloudletUsageList: usageList,
                            filteredClientStatusList: clientStatusList,
                            loading: false,
                            loadingForClientStatus: false,
                        })
                    }
                } catch (e) {
                    throw new Error(e)
                }
            }


            renderDateRangeDropdown() {
                return (
                    <div className="page_monitoring_dropdown_box" style={{alignSelf: 'center', justifyContent: 'center'}}>
                        <div className="page_monitoring_dropdown_label">
                            Date
                        </div>
                        <RangePicker
                            separator={"~"}
                            disabled={this.state.filteredCloudletUsageList.length === 1 || this.state.loading}
                            ref={c => this.dateRangePicker = c}
                            showTime={{format: 'HH:mm'}}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={[moment().subtract(this.lastDay, 'd').format('YYYY-MM-DD HH:mm'), moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm')]}
                            onChange={async (date) => {
                                try {
                                    this.dateRangePicker.blur()
                                    let stateTime = date[0].format('YYYY-MM-DD HH:mm')
                                    let endTime = date[1].format('YYYY-MM-DD HH:mm')
                                    await this.setState({
                                        startTime: stateTime,
                                        endTime: endTime,
                                    })

                                    this.filterUsageListByDateForCloudlet()

                                } catch (e) {

                                }

                            }}
                            ranges={{
                                'Last 24 hours': [moment().subtract(1, 'd'), moment().subtract(0, 'd')],
                                'Last 3 Days': [moment().subtract(3, 'd'), moment().subtract(0, 'd')],
                                'Last 7 Days': [moment().subtract(7, 'd'), moment().subtract(0, 'd')],
                                'Last 15 Days': [moment().subtract(15, 'd'), moment().subtract(0, 'd')],
                                'Last 30 Days': [moment().subtract(30, 'd'), moment().subtract(0, 'd')],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                                'Last Month': [moment().date(-30), moment().date(-1)],
                                'Last 2 Months': [moment().subtract(60, 'd'), moment().subtract(0, 'd')],
                                'Last 3 Months': [moment().subtract(90, 'd'), moment().subtract(0, 'd')],
                                'Last 6 Months': [moment().subtract(180, 'd'), moment().subtract(0, 'd')],
                                'Last 1 Year': [moment().subtract(364, 'd'), moment().subtract(0, 'd')],
                                'Last 2 Year': [moment().subtract(729, 'd'), moment().subtract(0, 'd')],
                                'Last 3 Year': [moment().subtract(1094, 'd'), moment().subtract(0, 'd')],
                            }}
                        />
                    </div>
                )
            }

            renderDotForCloudlet(index) {
                return (
                    <Center>
                        <div
                            style={{
                                backgroundColor: this.state.cloudletDropdownList.length === 1 ? this.state.chartColorList[this.state.currentColorIndex] : this.state.chartColorList[index - 1],
                                width: 10,
                                height: 10,
                                borderRadius: 50,
                            }}
                        >
                        </div>
                    </Center>
                )
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
                            style={{width: 300, maxHeight: '512px !important'}}
                            disabled={this.state.cloudletDropdownList.length === 0 || isEmpty(this.state.cloudletDropdownList) || this.state.loading}
                            value={this.state.currentCloudLet !== undefined ? this.state.currentCloudLet.split("|")[0].trim() : undefined}
                            placeholder={'Select Cloudlet'}
                            onSelect={async (value) => {
                                this.cloudletSelect.blur();
                                let selectIndex = 0;
                                this.state.cloudletList.map((item: TypeCloudlet, index) => {
                                    if (item.CloudletName === value.split("|")[0].trim()) {
                                        selectIndex = index;
                                    }
                                })

                                await this.handleOnChangeCloudletDropdown(value, selectIndex)

                            }}
                        >
                            {this.state.cloudletDropdownList.map((item: any, index) => {
                                try {
                                    if (index === 0) {
                                        return (
                                            <Option key={index} value={undefined} style={{}}>
                                                <div style={{color: 'orange', fontStyle: 'italic'}}>{item.text}</div>
                                            </Option>
                                        )
                                    } else {
                                        let itemValues = item.value + " | " + (index - 1).toString()
                                        return (
                                            <Option key={index} value={itemValues}>
                                                <div style={{display: 'flex'}}>
                                                    {this.renderDotForCloudlet(index)}
                                                    <div style={{marginLeft: 7,}}>{item.text}</div>
                                                </div>
                                            </Option>
                                        )
                                    }
                                } catch (e) {

                                }
                            })}
                        </Select>
                    </div>
                )
            }

            filterClusterUsageListForTreeSelect(allClusterUsageList, selectClusterList) {
                try {
                    let filteredClusterList = []
                    allClusterUsageList.map((clusterUsageOne, index) => {
                        selectClusterList.map((innerItem, innerIndex) => {
                            if (clusterUsageOne.cluster === innerItem.split("|")[0].trim() && clusterUsageOne.cloudlet === innerItem.split("|")[1].trim()) {
                                filteredClusterList.push(clusterUsageOne)
                            }
                        })
                    })
                    return filteredClusterList;
                } catch (e) {
                    showToast(e.toString())
                }
            }

            filterClusterListForTreeSelect(allClusterList, selectClusterList) {
                try {
                    let filteredClusterList = []
                    allClusterList.map((item, index) => {
                        selectClusterList.map((innerItem, innerIndex) => {

                            if (item.ClusterName === innerItem.split("|")[0].trim() && item.Cloudlet === innerItem.split("|")[1].trim()) {
                                filteredClusterList.push(item)
                            }
                        })
                    })

                    return filteredClusterList;
                } catch (e) {
                    showToast(e.toString())
                }
            }


            renderClusterDropdown() {
                let treeSelectWidth = 500;
                let maxTagCount=3;
                if (this.props.size.width >= 1600) {
                    treeSelectWidth = 500;
                    maxTagCount=3
                } else if (this.props.size.width <= 1600 && this.props.size.width > 1300) {
                    treeSelectWidth = 400;
                    maxTagCount=2
                } else if (this.props.size.width <= 1300 && this.props.size.width > 1100) {
                    treeSelectWidth = 300;
                    maxTagCount=1
                } else if (this.props.size.width <= 1100) {
                    treeSelectWidth = 150;
                    maxTagCount=0
                }

                return (
                    <div className="page_monitoring_dropdown_box"
                         style={{alignSelf: 'center', justifyContent: 'center'}}>
                        <div
                            className="page_monitoring_dropdown_label"
                            style={{
                                marginLeft: this.state.isShowFilter ? 0 : 10,
                            }}
                        >
                            Cluster
                        </div>
                        <div style={{width: '100%'}}>
                            <TreeSelect
                                showArrow={true}
                                maxTagCount={maxTagCount}
                                disabled={this.state.loading}
                                size={'middle'}
                                allowClear={true}
                                showSearch={true}
                                treeCheckable={true}
                                showCheckedStrategy={'SHOW_CHILD'}
                                style={{height: '30px !important', width: treeSelectWidth}}
                                dropdownStyle={{
                                    maxHeight: 800, overflow: 'auto', width: '100%'
                                }}
                                onSearch={(value) => {
                                    this.setState({
                                        searchClusterValue: value,
                                    });
                                }}
                                ref={c => this.treeSelect = c}
                                listHeight={520}
                                searchValue={this.state.searchClusterValue}
                                searchPlaceholder={'Enter the cluster name.'}
                                placeholder={'Select Cluster'}

                                treeData={this.state.clusterTreeDropdownList}
                                treeDefaultExpandAll={true}
                                value={this.state.currentClusterList}
                                onChange={async (value, label, extra) => {
                                    if (!isEmpty(value)) {
                                        this.setState({currentClusterList: value});
                                    } else {
                                        this.resetLocalData()
                                    }

                                }}
                            />
                        </div>
                        <div style={{marginLeft: 10,}}>
                            <Button
                                size={'small'}
                                onClick={async () => {
                                    this.applyButton.blur();
                                    if (this.state.currentClusterList !== undefined) {
                                        let selectClusterCloudletList = this.state.currentClusterList
                                        this.handleOnChangeClusterDropdown(selectClusterCloudletList)

                                    } else {
                                        this.resetLocalData()
                                    }


                                }}
                                ref={c => this.applyButton = c}
                            >
                                Apply
                            </Button>
                        </div>
                        <div style={{marginLeft: 10,}}>
                            <Button
                                ref={c => this.resetBtn = c}
                                size={'small'}
                                onClick={() => {
                                    this.resetBtn.blur();
                                    this.resetLocalData();
                                }}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                )


            }


            renderAppInstDropdown() {

                return (
                    <div className="page_monitoring_dropdown_box" style={{alignSelf: 'center', justifyContent: 'center'}}>
                        <div className="page_monitoring_dropdown_label" style={{width: 50}}>
                            App Inst
                        </div>
                        <div>
                            <Select
                                ref={c => this.appInstSelect = c}
                                dropdownStyle={{}}
                                style={{width: '100%'}}
                                disabled={this.state.currentClusterList === '' || this.state.loading || this.state.appInstDropdown.length === 0 || this.state.currentClusterList === undefined}
                                value={this.state.currentAppInstNameVersion}
                                placeholder={this.state.appInstSelectBoxPlaceholder}
                                onChange={async (value) => {
                                    this.appInstSelect.blur();
                                    await this.handleOnChangeAppInstDropdown(value.trim())

                                }}
                            >
                                {this.state.allAppInstDropdown.map(item => {
                                    return (
                                        <Option value={item.value}>{item.text}</Option>
                                    )
                                })}
                            </Select>
                        </div>
                    </div>
                )
            }

            renderDot(index, size = 15) {
                return (
                    <div style={{backgroundColor: 'transparent', marginTop: 0,}}>
                        <div
                            style={{
                                backgroundColor: this.state.chartColorList[index],
                                width: size,
                                height: size,
                                borderRadius: 50,
                            }}
                        >
                        </div>
                    </div>
                )
            }

            makeStringLimit(classification) {
                let stringLimit = 25;
                if (classification === CLASSIFICATION.CLOUDLET) {
                    if (this.props.size.width > 1600) {
                        stringLimit = 25
                    } else if (this.props.size.width < 1500 && this.props.size.width >= 1380) {
                        stringLimit = 17
                    } else if (this.props.size.width < 1380 && this.props.size.width >= 1150) {
                        stringLimit = 14
                    } else if (this.props.size.width < 1150 && this.props.size.width >= 720) {
                        stringLimit = 10
                    } else if (this.props.size.width < 720) {
                        stringLimit = 4
                    }
                    return stringLimit;

                } else if (classification === CLASSIFICATION.CLUSTER) {
                    if (this.props.size.width > 1500) {
                        stringLimit = 49
                    } else if (this.props.size.width < 1500 && this.props.size.width >= 1300) {
                        stringLimit = 42
                    } else if (this.props.size.width < 1300 && this.props.size.width >= 1100) {
                        stringLimit = 34
                    } else if (this.props.size.width < 1100) {
                        stringLimit = 28
                    }
                    return stringLimit;
                }
            }


            renderClusterLegend() {
                let stringLimit = this.makeStringLimit(CLASSIFICATION.CLUSTER)
                let itemCount = this.state.legendItemCount;
                let filteredClusterUsageList = this.state.filteredClusterUsageList

                //@fixme:fake json list
                //let filteredClusterUsageList = cloudletClusterList


                return (
                    <React.Fragment>
                        <Row gutter={16}
                             style={{
                                 width: '94%',
                                 marginLeft: 2,
                                 justifyContent: itemCount === 1 ? 'center' : null,
                                 alignSelf: itemCount === 1 ? 'center' : null,
                                 flex: .97,
                                 display: 'flex',
                             }}
                        >
                            {filteredClusterUsageList.map((item: TypeClusterUsageOne, clusterIndex) => {
                                return (
                                    <Col
                                        key={clusterIndex}
                                        className="gutterRow"
                                        onClick={async () => {
                                            await this.setState({
                                                currentClassification: CLASSIFICATION.CLUSTER
                                            })
                                            let clusterCloudletList = []
                                            if (filteredClusterUsageList.length > 1) {

                                                let clusterOne = item.cluster + " | " + item.cloudlet;
                                                clusterCloudletList.push(clusterOne)

                                                clearInterval(this.intervalForCluster)
                                                await this.handleOnChangeClusterDropdown(clusterCloudletList)

                                            } else {
                                                clearInterval(this.intervalForCluster)
                                                await this.setState({legendItemCount: filteredClusterUsageList.length})
                                                await this.handleOnChangeClusterDropdown(undefined)
                                            }
                                        }}
                                        span={itemCount === 1 ? 24 : this.state.isLegendExpanded ? 6 : 1}
                                        title={!this.state.isLegendExpanded ? item.cluster + '[' + item.cloudlet + ']' : null}
                                        style={{
                                            justifyContent: itemCount === 1 ? 'center' : null,
                                            width: itemCount === 1 ? '100%' : this.props.size.width / 4,
                                        }}
                                    >
                                        {itemCount === 1 ?
                                            <Center style={{marginLeft: 100, display: 'flex', width: '100%'}}>
                                                {this.renderDot(item.colorCodeIndex)}
                                                <div style={{display: 'flex', marginLeft: 3,}}>
                                                    <div>
                                                        {item.cluster}
                                                    </div>
                                                    <div style={{color: 'white',}}>
                                                        &nbsp;[{item.cloudlet}]
                                                    </div>
                                                </div>
                                            </Center>
                                            :
                                            <div style={{
                                                backgroundColor: 'transparent',
                                                display: 'flex',
                                                marginTop: 2.5,
                                                marginBottom: 2.5
                                            }}>
                                                <Center>
                                                    {this.renderDot(item.colorCodeIndex)}
                                                </Center>
                                                <Center className="clusterCloudletBox">
                                                    {reduceLegendClusterCloudletName(item, this, stringLimit, this.state.isLegendExpanded)}
                                                </Center>
                                            </div>

                                        }
                                    </Col>
                                )
                            })}
                        </Row>
                        <div
                            style={PageMonitoringStyles.expandIconDiv}
                            onClick={() => {
                                this.setState({
                                    isLegendExpanded: !this.state.isLegendExpanded,
                                    isFirstLoad: false,
                                }, () => {
                                    this.setState({
                                        legendHeight: Math.ceil(filteredClusterUsageList.length / (this.state.isLegendExpanded ? 4 : 24)) * gridItemOneHeight,
                                        legendRowCount: Math.ceil(this.state.filteredClusterList.length / 4)
                                    }, () => {
                                    })
                                })
                            }}
                        >
                            {!this.state.isLegendExpanded ?
                                <UnfoldMore style={{fontSize: 18}}/>
                                :
                                <UnfoldLess style={{fontSize: 18}}/>
                            }
                        </div>
                    </React.Fragment>
                )
            }

            renderCloudletLegend(pLegendItemCount) {
                let stringLimit = this.makeStringLimit(CLASSIFICATION.CLOUDLET);
                return (
                    <Row gutter={16}
                         style={{
                             flex: .97,
                             marginLeft: 10,
                             backgroundColor: 'transparent',
                             justifyContent: 'center',
                             alignSelf: 'center',
                         }}
                    >
                        {this.state.filteredCloudletList.map((item: TypeCloudlet, cloudletIndex) => {
                            return (
                                <Col
                                    key={cloudletIndex}
                                    className="gutterRow"
                                    onClick={async () => {
                                    }}
                                    title={item.CloudletName}
                                    span={pLegendItemCount === 1 ? 24 : 3}
                                    style={{
                                        marginTop: 3,
                                        marginBottom: 3,
                                        justifyContent: pLegendItemCount === 1 ? 'center' : null,
                                        //backgroundColor: 'blue',
                                    }}
                                    onClick={async () => {
                                        if (this.state.filteredCloudletList.length > 1) {
                                            let fullCloudletItemOne = item.CloudletName + " | " + JSON.stringify(item.CloudletLocation) + " | " + cloudletIndex.toString()
                                            await this.handleOnChangeCloudletDropdown(fullCloudletItemOne, cloudletIndex)
                                        } else {
                                            await this.handleOnChangeCloudletDropdown(undefined)
                                        }
                                    }}
                                >
                                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <div>
                                            {this.renderDot(item.colorCodeIndex)}
                                        </div>
                                        <div style={{marginTop: 0, marginLeft: 5}}>
                                            {reduceString(item.CloudletName, stringLimit, pLegendItemCount)}
                                        </div>
                                    </div>

                                </Col>
                            )
                        })}
                    </Row>
                )
            }


            renderAppLegend(pLegendItemCount) {
                return (
                    <Row gutter={16}
                         style={{
                             flex: .97,
                             marginLeft: 10,
                             backgroundColor: 'transparent',
                             justifyContent: 'center',
                             alignSelf: 'center',
                         }}
                    >
                        <Col
                            className="gutterRow"
                            onClick={async () => {
                            }}
                            span={pLegendItemCount === 1 ? 24 : 4}
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

                    if (this.state.loading) {
                        return (
                            <LegendOuterDiv style={{height: 30}}>
                                <div style={{
                                    display: 'flex',
                                    alignSelf: 'center',
                                    position: 'absolute',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                }}>
                                    <ColorLinearProgress
                                        variant={'query'}
                                        style={{
                                            marginLeft: -20,
                                            width: '9%',
                                            alignContent: 'center',
                                            justifyContent: 'center',
                                        }}
                                    />
                                </div>
                            </LegendOuterDiv>
                        )
                    } else {
                        return (
                            <LegendOuterDiv
                                style={{
                                    marginTop: 4,
                                    width: '98.8%'
                                }}>
                                {this.state.currentClassification === CLASSIFICATION.CLUSTER ? this.renderClusterLegend()
                                    : this.state.currentClassification === CLASSIFICATION.CLOUDLET ? this.renderCloudletLegend(this.state.legendItemCount)
                                        : this.state.currentClassification === CLASSIFICATION.APPINST && this.renderAppLegend(this.state.legendItemCount)
                                }
                            </LegendOuterDiv>
                        )
                    }
                } catch (e) {

                }
            }


            renderTitleArea() {
                return (
                    <label className='content_title_label' style={{marginBottom: 1}}
                           onClick={() => {
                               this.state.userType.includes(USER_TYPE.OPERATOR) ? this.handleOnChangeCloudletDropdown(undefined) : this.handleOnChangeClusterDropdown('')
                           }}
                    >
                        Monitoring
                    </label>
                )
            }

            renderHeader() {
                return (
                    <Toolbar className='monitoring_title' style={{marginTop: -5, width: '100%'}}>
                        <div className='page_monitoring_select_area'
                             style={{
                                 width: 'fit-content',
                                 flex: .7,
                             }}>
                            {this.renderTitleArea()}
                            {this.state.userType.includes(USER_TYPE.OPERATOR) ?
                                <React.Fragment>
                                    <div style={{marginLeft: 25}}>
                                        {this.renderCloudletDropdown()}
                                    </div>
                                    <div style={{marginLeft: 25}}>
                                        {this.renderDateRangeDropdown()}
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
                            {this.state.currentClassification === CLASSIFICATION.CLUSTER || this.state.currentClassification === CLASSIFICATION.APPINST ? this.renderStreamSwitch() : null}
                            {this.makeTopRightMenuActionButton()}
                        </div>
                    </Toolbar>

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

            calcGridHeight() {
                let gridHeight = 0;
                if (!this.state.loading && this.state.isLegendExpanded) {
                    gridHeight = window.innerHeight - (this.state.legendHeight)
                    return gridHeight - 120;
                } else if (!this.state.loading && !this.state.isLegendExpanded) {
                    gridHeight = window.innerHeight - (this.state.legendHeight)
                    return gridHeight - 140;
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
                            currentColorIndex={this.state.currentColorIndex}
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
                                         height: this.calcGridHeight(),
                                         marginTop: 0,
                                         marginRight: 50,
                                         width: '100%',
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
