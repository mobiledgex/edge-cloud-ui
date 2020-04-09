import {Center2, ClusterCluoudletLable, Legend} from '../PageMonitoringStyledComponent'
import {SemanticToastContainer} from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {Dropdown, Grid, Modal} from 'semantic-ui-react'
import sizeMe from 'react-sizeme';
import {connect} from 'react-redux';
import * as actions from '../../../../actions';
import {Card, CircularProgress, withStyles} from '@material-ui/core'
import {Dropdown as ADropdown, Menu as AMenu,} from 'antd';
import {
    defaultHwMapperListForCluster,
    defaultLayoutForAppInst,
    defaultLayoutForCluster,
    defaultLayoutMapperForAppInst,
    filterByClassification,
    getUserId,
    makeAllLineChartData,
    makeBarChartDataForAppInst,
    makeBarChartDataForCluster,
    makeDropdownListWithValuePipeForAppInst,
    makeGradientColorList2,
    makeid,
    makeLineChartDataForAppInst,
    makeLineChartDataForBigModal,
    makeLineChartDataForCluster,
    makeSelectBoxListWithKeyValuePipe,
    makeSelectBoxListWithValuePipe, revertToDefaultLayout,
} from "./PageDevMonitoringService";
import {
    ADD_ITEM_LIST,
    CHART_COLOR_APPLE,
    CHART_COLOR_LIST,
    CHART_COLOR_LIST2,
    CHART_COLOR_LIST3,
    CHART_COLOR_LIST4,
    CHART_COLOR_MONOKAI,
    CLASSIFICATION,
    GRID_ITEM_TYPE,
    HARDWARE_OPTIONS_FOR_APPINST,
    HARDWARE_OPTIONS_FOR_CLUSTER,
    HARDWARE_TYPE,
    NETWORK_TYPE,
    RECENT_DATA_LIMIT_COUNT,
    THEME_OPTIONS,
    THEME_OPTIONS_LIST
} from "../../../../shared/Constants";
import type {TypeBarChartData, TypeGridInstanceList, TypeLineChartData} from "../../../../shared/Types";
import {TypeAppInstance, TypeUtilization} from "../../../../shared/Types";
import moment from "moment";


import {
    getOneYearStartEndDatetime,
    isEmpty,
    makeBubbleChartDataForCluster,
    PageMonitoringStyles,
    renderLoaderArea,
    renderPlaceHolderCircular,
    showToast
} from "../PageMonitoringCommonService";
import {
    getAllAppInstEventLogs,
    getAllClusterEventLogList,
    getAppInstList,
    getAppLevelUsageList,
    getCloudletList,
    getClusterLevelUsageList,
    getClusterList,
    requestShowAppInstClientWS
} from "../PageMonitoringMetricService";
import * as reducer from "../../../../utils";
import TerminalViewer from "../../../../container/TerminalViewer";
import ModalGraph from "../components/MiniModalGraphContainer";
import {reactLocalStorage} from "reactjs-localstorage";
import LeafletMapWrapperForDev from "../components/MapForDevContainer";
import {Responsive, WidthProvider} from "react-grid-layout";
import _ from "lodash";
import PieChartContainer from "../components/PieChartContainer";
import BigModalGraphContainer from "../components/BigModalGraphContainer";
import BubbleChartContainer from "../components/BubbleChartContainer";
import LineChartContainer from "../components/LineChartContainer";
import ClusterEventLogListHook from "../components/ClusterEventLogListHook";
import PerformanceSummaryTableContainer from "../components/PerformanceSummaryTableContainer";
import AppInstEventLogListHook from "../components/AppInstEventLogListHook";
import MaterialIcon from "material-icons-react";
import '../PageMonitoring.css'
import AddItemPopupContainer from "../components/AddItemPopupContainer";
import type {Layout} from "react-grid-layout/lib/utils";
import GradientBarChartContainer from "../components/GradientBarChartContainer";
import AddItemPopupContainer2 from '../components/AddItemPopupContainer2'
import Switch from "@material-ui/core/Switch";

const ASubMenu = AMenu.SubMenu;
const CustomSwitch = withStyles({
    switchBase: {
        color: '#D32F2F',
        '&$checked': {
            color: '#388E3C',
        },
        '&$checked + $track': {
            backgroundColor: '#388E3C',
        },
    },
    checked: {},
    track: {},
})(Switch);
const ResponsiveReactGridLayout = WidthProvider(Responsive);
const mapStateToProps = (state) => {
    return {
        isLoading: state.LoadingReducer.isLoading,
        isShowHeader: state.HeaderReducer.isShowHeader,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        toggleLoading: (data) => {
            dispatch(actions.toggleLoading(data))
        },
        toggleHeader: (data) => {
            dispatch(actions.toggleHeader(data))
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
    toggleHeader: Function,
}


type State = {
    layoutForCluster: any,
    layoutForAppInst: any,
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
}

export default connect(mapStateToProps, mapDispatchToProps)(sizeMe({monitorHeight: true})(
    class PageDevMonitoring extends Component<Props, State> {
        intervalForAppInst = null;

        webSocketInst: WebSocket = null;
        gridLayoutHeight = window.innerHeight * 0.875;
        gridItemHeight = 265;

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
            reactLocalStorage.remove(themeKey)
            */
            //@TODO: DELETE SAVED LAYOUTS
            /*reactLocalStorage.remove(clusterLayoutKey)
            reactLocalStorage.remove(ClusterHwMapperKey)
            reactLocalStorage.remove(appInstLayoutKey)
            reactLocalStorage.remove(layoutMapperAppInstKey)*/

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
                hwListForCluster: HARDWARE_OPTIONS_FOR_CLUSTER,
                hwListForAppInst: HARDWARE_OPTIONS_FOR_APPINST,
                isDraggable: false,
                isUpdateEnableForMap: false,
                isShowBigGraph: false,
                popupGraphHWType: '',
                chartDataForRendering: [],
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
                isStackedLineChart: true,
                isShowFilter: false,
                currentNavigation: '',
                allAppInstDropdown: [],
                isShowAppInstPopup: false,
                isShowPopOverMenu: false,
                isOpenEditView2: false,
            };
        }

        componentDidMount = async () => {
            //fixme:####################
            //fixme:isShowHeader
            //fixme:####################
            this.props.toggleHeader(true);
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
            this.props.toggleHeader(true)
            clearInterval(this.intervalForAppInst)
            if (!isEmpty(this.webSocketInst)) {
                this.webSocketInst.close();
            }
        }

        async loadInitDataForCluster__FOR__DEV(isInterval: boolean = false) {
            try {
                clearInterval(this.intervalForAppInst)
                this.setState({dropdownRequestLoading: true})

                //FIXME : ############################
                //@FIXME: fakeData22222222222
                //FIXME : ############################
                let clusterList = require('../aaa____TESTCODE____/Jsons/clusterList')
                let cloudletList = require('../aaa____TESTCODE____/Jsons/cloudletList')
                let appInstanceList = require('../aaa____TESTCODE____/Jsons/appInstanceList')
                let clusterDropdownList = makeSelectBoxListWithKeyValuePipe(clusterList, 'ClusterName', 'Cloudlet')
                console.log("clusterDropdownList===>", clusterDropdownList);


                //FIXME : ############################
                //FIXME : FAKEDATA ClusterEventLog
                //FIXME : ############################
                await this.setState({
                    allClusterEventLogList: [],
                    filteredClusterEventLogList: []
                })


                //FIXME : ############################
                //@fixme: fakeData __allAppInstEvLogListValues
                //FIXME : ############################
                let __allAppInstEvLogListValues = require('../aaa____TESTCODE____/Jsons/allAppInstEventLogList')
                await this.setState({
                    allAppInstEventLogs: __allAppInstEvLogListValues,
                    filteredAppInstEventLogs: __allAppInstEvLogListValues,
                })


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
                //fixme: fakeData22222222222
                //fixme: fakeData22222222222
                let allClusterUsageList = []
                allClusterUsageList = require('../aaa____TESTCODE____/Jsons/allClusterUsageList')
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
            } catch (e) {

            }
        }

        showModalClusterLineChart(lineChartDataOne, index) {
            this.setState({
                selectedClusterUsageOne: lineChartDataOne,
                modalIsOpen: true,
                selectedClusterUsageOneIndex: index,
            })
        }

        async loadInitDataForCluster(isInterval: boolean = false) {
            try {
                clearInterval(this.intervalForAppInst)
                this.setState({dropdownRequestLoading: true})
                //@todo:#####################################################################
                //@todo: real_data (cloudletList ,clusterList, appnInstList)
                //@todo:#####################################################################
                let cloudletList = await getCloudletList()
                let clusterList = await getClusterList();
                let appInstList: Array<TypeAppInstance> = await getAppInstList();
                if (appInstList.length === 0) {
                    this.setState({
                        isNoData: true,
                    })
                }

                let clusterDropdownList = makeSelectBoxListWithKeyValuePipe(clusterList, 'ClusterName', 'Cloudlet')
                //@todo:#############################################
                //@todo: getAllClusterEventLogList : real data
                //@todo:#############################################
                let allClusterEventLogList = await getAllClusterEventLogList(clusterList);
                console.log("allClusterEventLogList===>", allClusterEventLogList);
                await this.setState({
                    allClusterEventLogList: allClusterEventLogList,
                    filteredClusterEventLogList: allClusterEventLogList
                })


                //@todo:#############################################
                //@todo: getAppInst Event Logs : real data
                //@todo:#############################################
                let allAppInstEventLogs = await getAllAppInstEventLogs();
                await this.setState({
                    allAppInstEventLogs: allAppInstEventLogs,
                    filteredAppInstEventLogs: allAppInstEventLogs,
                })


                let appInstanceListGroupByCloudlet = []
                try {
                    appInstanceListGroupByCloudlet = reducer.groupBy(appInstList, CLASSIFICATION.CLOUDLET);
                } catch (e) {
                    showToast(e.toString())
                }

                await this.setState({
                    isReady: true,
                    clusterDropdownList: clusterDropdownList,
                    dropDownCloudletList: cloudletList,
                    clusterList: clusterList,
                    isAppInstaceDataReady: true,
                    appInstanceList: appInstList,
                    filteredAppInstanceList: appInstList,
                    dropdownRequestLoading: false,

                });

                if (!isInterval) {
                    this.setState({
                        appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
                    })
                }
                let allClusterUsageList = []

                //@todo:#############################################
                //todo: real data (allClusterUsageList)
                //@todo:#############################################
                try {
                    allClusterUsageList = await getClusterLevelUsageList(clusterList, "*", RECENT_DATA_LIMIT_COUNT);
                } catch (e) {

                }

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
                    clusterListLoading: false,
                    allCloudletUsageList: allClusterUsageList,
                    allClusterUsageList: allClusterUsageList,
                    filteredClusterUsageList: allClusterUsageList,
                    maxCpu: maxCpu,
                    maxMem: maxMem,
                    isRequesting: false,
                    currentCluster: '',
                }, () => {
                    console.log("filteredClusterUsageList===>", this.state.filteredClusterUsageList);
                })
            } catch (e) {

            }

        }

        async handleResetClicked() {
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
                filteredClusterEventLogList: this.state.allClusterEventLogList,
                filteredAppInstEventLogs: this.state.allAppInstEventLogs,
                appInstanceListGroupByCloudlet: reducer.groupBy(this.state.appInstanceList, CLASSIFICATION.CLOUDLET),
            });
            //todo: reset bubble chart data
            let bubbleChartData = await makeBubbleChartDataForCluster(this.state.allClusterUsageList, HARDWARE_TYPE.CPU);
            await this.setState({
                bubbleChartData: bubbleChartData,
                dropdownRequestLoading: false,
                currentCluster: '',
                currentAppInst: '',
                appInstDropdown: [],
                isShowAppInstPopup: !this.state.isShowAppInstPopup,
                //currentTabIndex: 1,
            })
        }

        async refreshAllData() {
            clearInterval(this.intervalForAppInst)
            showToast('FETCH NEW DATA!')
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

        makeLineChartData(hwType) {
            let lineChartDataSet: TypeLineChartData = [];
            if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                lineChartDataSet = makeLineChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
            } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                if (hwType === HARDWARE_TYPE.ALL) {
                    lineChartDataSet = makeAllLineChartData(this);
                } else {
                    lineChartDataSet = makeLineChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
                    console.log("lineChartDataSet===>", lineChartDataSet);
                }
            }

            return (
                <LineChartContainer
                    isResizeComplete={this.state.isResizeComplete}
                    loading={this.state.loading}
                    currentClassification={this.state.currentClassification}
                    parent={this}
                    pHardwareType={hwType}
                    chartDataSet={lineChartDataSet}
                />
            )

        }

        makeGradientBarCharData(chartData) {
            let canvasDatas = (canvas) => {
                let CHARTCOLORLIST = this.state.chartColorList;
                let gradientList = makeGradientColorList2(canvas, 305, CHARTCOLORLIST, true);
                console.log("chartDataList===>", chartData.chartDataList);
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

        }


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


            /*  return (
                  <BarChartContainer isResizeComplete={this.state.isResizeComplete} parent={this}
                                     loading={this.state.loading} chartDataSet={barChartDataSet}
                                     pHardwareType={hwType} graphType={graphType}/>
              )*/


            if (!isEmpty(barChartDataSet)) {
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
            }


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


        setAppInstInterval(filteredAppList) {
            this.intervalForAppInst = setInterval(async () => {
                this.setState({
                    intervalLoading: true,
                })

                let allAppInstUsageList = await getAppLevelUsageList(filteredAppList, "*", RECENT_DATA_LIMIT_COUNT);
                this.setState({
                    intervalLoading: false,
                    filteredAppInstUsageList: allAppInstUsageList,
                })
            }, 1000 * 7.0)
        }

        async handleClusterDropdown(selectedClusterOne) {

            clearInterval(this.intervalForAppInst)
            await this.setState({
                selectedClientLocationListOnAppInst: [],
            })

            let selectData = selectedClusterOne.split("|")
            let selectedCluster = selectData[0].trim();
            let selectedCloudlet = selectData[1].trim();

            await this.setState({
                currentCluster: selectedClusterOne,
                currentClassification: CLASSIFICATION.CLUSTER,
                dropdownRequestLoading: true,
            })


            let allClusterUsageList = this.state.allClusterUsageList;
            let allUsageList = allClusterUsageList;
            let filteredClusterUsageList = []
            allUsageList.map(item => {
                if (item.cluster === selectedCluster && item.cloudlet === selectedCloudlet) {
                    filteredClusterUsageList.push(item)
                }
            })

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

            await this.setState({
                dropdownRequestLoading: false,
                filteredClusterUsageList: filteredClusterUsageList,
                filteredClusterEventLogList: filteredClusterEventLogList,
                appInstDropdown: appInstDropdown,
                allAppInstDropdown: appInstDropdown,
                currentAppInst: '',
                appInstSelectBoxPlaceholder: 'Select App Inst',
                filteredAppInstanceList: filteredAppInstList,
                appInstanceListGroupByCloudlet: reducer.groupBy(filteredAppInstList, CLASSIFICATION.CLOUDLET),
            }, () => {
                console.log("appInstDropdown===>", this.state.allAppInstDropdown);
            })

            //todo: reset bubble chart data
            let bubbleChartData = await makeBubbleChartDataForCluster(this.state.filteredClusterUsageList, this.state.currentHardwareType);
            await this.setState({
                bubbleChartData: bubbleChartData,
            })
        }


        handleAppInstDropdown = async (pCurrentAppInst, isStreamBtnClick = false) => {
            clearInterval(this.intervalForAppInst)
            //@desc: ################################
            //@desc: requestShowAppInstClientWS
            //@desc: ################################
            if (!isStreamBtnClick) {
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

            console.log("filteredAppList===>", filteredAppList);

            //todo:Terminal
            //todo:Terminal
            //todo:Terminal
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

            let allAppInstUsageList = [];
            await this.setState({dropdownRequestLoading: true})
            try {
                allAppInstUsageList = await getAppLevelUsageList(filteredAppList, "*", RECENT_DATA_LIMIT_COUNT, arrDateTime[0], arrDateTime[1]);
            } catch (e) {
                showToast(e.toString())
            } finally {
                this.setState({dropdownRequestLoading: false})
            }

            //let currentCluster = pCurrentAppInst.split("|")[2].trim() + " | " + pCurrentAppInst.split('|')[1].trim()
            pCurrentAppInst = pCurrentAppInst.trim();
            pCurrentAppInst = pCurrentAppInst.split("|")[0].trim() + " | " + pCurrentAppInst.split('|')[1].trim() + " | " + pCurrentAppInst.split('|')[2].trim()

            console.log("pCurrentAppInst===>", pCurrentAppInst);

            await this.setState({
                currentClassification: CLASSIFICATION.APPINST,
                allAppInstUsageList: allAppInstUsageList,
                filteredAppInstUsageList: allAppInstUsageList,
                loading: false,
                currentAppInst: pCurrentAppInst,
                //currentCluster: currentCluster,
                currentCluster: isEmpty(this.state.currentCluster) ? '' : this.state.currentCluster,
                clusterSelectBoxPlaceholder: 'Select Cluster',
                //appInstSelectBoxPlaceholder: pCurrentAppInst,
            }, () => {
                //alert(this.state.currentClassification)

                console.log('filteredAppInstUsageList===>', this.state.filteredAppInstUsageList)
            })

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

                await this.setState({
                    layoutForCluster: this.state.layoutForCluster.concat({
                        i: uniqueId,
                        x: 0,
                        y: maxY + 1,
                        w: this.makeGridSizeByType(graphType),
                        h: this.makeGridSizeHeightByType(graphType),
                    }),
                    layoutMapperForCluster: mapperList.concat(itemOne),
                })

                console.log("layoutMapperForCluster===>", this.state.layoutMapperForCluster)
                reactLocalStorage.setObject(getUserId() + "_layout", this.state.layoutForCluster)
                reactLocalStorage.setObject(getUserId() + "_layout_mapper", this.state.layoutMapperForCluster)


            } else {//@TODO: APPINST LEVEL

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
                        x: 0,
                        y: maxY + 1,
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
                //reactLocalStorage.setObject(getUserId() + "_layout_mapper", removedLayout)

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

        ___makeGridItemBodyByType(hwType, graphType) {

            if (graphType.toUpperCase() === GRID_ITEM_TYPE.LINE) {
                return (
                    this.makeLineChartData(hwType,)
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
                    <LeafletMapWrapperForDev
                        currentWidgetWidth={this.state.currentWidgetWidth}
                        isMapUpdate={this.state.isMapUpdate}
                        selectedClientLocationListOnAppInst={this.state.selectedClientLocationListOnAppInst}
                        mapPopUploading={this.state.mapPopUploading}
                        parent={this}
                        isDraggable={this.state.isDraggable}
                        handleAppInstDropdown={this.handleAppInstDropdown}
                        markerList={this.state.appInstanceListGroupByCloudlet}
                        isFullScreenMap={false}
                        isShowAppInstPopup={this.state.isShowAppInstPopup}
                    />
                )
            } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.PERFORMANCE_SUM) {
                return (
                    this.state.loading ? renderPlaceHolderCircular() :
                        <PerformanceSummaryTableContainer parent={this}
                                                          clusterUsageList={this.state.filteredClusterUsageList}/>
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
                return this.state.loading ? renderPlaceHolderCircular() :
                    <AppInstEventLogListHook
                        currentAppInst={this.state.currentAppInst}
                        parent={this}
                        handleAppInstDropdown={this.handleAppInstDropdown}
                        eventLogList={this.state.filteredAppInstEventLogs}
                    />
            }
        }

        showBigModal = (hwType, graphType) => {

            let chartDataForRendering = []
            if (graphType.toUpperCase() == GRID_ITEM_TYPE.LINE) {

                if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                    let lineChartDataSet = makeLineChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
                    chartDataForRendering = makeLineChartDataForBigModal(lineChartDataSet, this)
                } else {
                    let lineChartDataSet = makeLineChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
                    chartDataForRendering = makeLineChartDataForBigModal(lineChartDataSet, this)
                }

            } else if (graphType.toUpperCase() == GRID_ITEM_TYPE.BAR || graphType.toUpperCase() == GRID_ITEM_TYPE.COLUMN) {

                let barChartDataSet = makeBarChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
                chartDataForRendering = barChartDataSet.chartDataList;
            }

            this.setState({
                isShowBigGraph: !this.state.isShowBigGraph,
                chartDataForRendering: chartDataForRendering,
                popupGraphHWType: hwType,
                popupGraphType: graphType,
                isPopupMap: !this.state.isPopupMap,
                isMapUpdate: true,
            });
        }


        makeGridItemOne(uniqueIndex, hwType, graphType, item) {
            return (
                <div
                    key={uniqueIndex} data-grid={item} style={{margin: 0, backgroundColor: '#292c33'}}
                    onDoubleClick={async () => {
                        await this.setState({
                            isFixGrid: true,
                            isDraggable: !this.state.isDraggable,
                            appInstanceListGroupByCloudlet: [],
                        })
                        this.setState({
                            appInstanceListGroupByCloudlet: reducer.groupBy(this.state.appInstanceList, CLASSIFICATION.CLOUDLET),
                        });
                        setTimeout(() => {
                            this.setState({
                                isFixGrid: false,
                            })
                        }, 500)
                    }}
                >

                    <div
                        class='draggable'
                        style={{
                            position: 'absolute', right: 25, top: 10,
                            display: 'inline-block',
                            width: '100px',
                            lineHeight: '1.2',
                            fontSize: '18px',
                            marginLeft: '15px',
                            cursor: 'pointer',
                            textAlign: 'right',
                            marginRight: '-15px',
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
                        {this.___makeGridItemBodyByType(hwType, graphType.toUpperCase())}
                    </div>
                </div>
            )
        }


        renderGridLayoutForCluster() {
            return (
                <ResponsiveReactGridLayout
                    isResizable={true}
                    draggableHandle=".draggable"
                    verticalCompact={false}
                    isDraggable={true}
                    //useCSSTransforms={true}
                    className={'layout page_monitoring_layout_dev'}
                    cols={{lg: 4, md: 4, sm: 4, xs: 4, xxs: 4}}
                    layout={this.state.layoutForCluster}
                    rowHeight={this.gridItemHeight}
                    onResizeStop={(layout: Layout, oldItem: LayoutItem, newItem: LayoutItem, placeholder: LayoutItem, e: MouseEvent, element: HTMLElement) => {
                        console.log("newItem====>", newItem.w);
                        let width = newItem.w;
                        this.setState({
                            isResizeComplete: !this.state.isResizeComplete,
                            currentWidgetWidth: width,
                        })
                    }}

                    onLayoutChange={(layout) => {
                        this.setState({
                            layoutForCluster: layout,
                        }, () => {
                            console.log("layoutForCluster===>", this.state.layoutForCluster);
                        })
                        reactLocalStorage.setObject(getUserId() + "_layout", layout)
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
                        console.log("hwType===>", hwType);
                        return this.makeGridItemOne(uniqueIndex, hwType, graphType, item)
                    })}

                </ResponsiveReactGridLayout>

            )
        }


        renderGridLayoutForAppInst = () => {
            return (
                <ResponsiveReactGridLayout
                    isDraggable={true}
                    useCSSTransforms={true}
                    isResizable={true}
                    className={'layout page_monitoring_layout_dev'}
                    cols={{lg: 3, md: 3, sm: 3, xs: 3, xxs: 3}}
                    layout={this.state.layoutForAppInst}
                    rowHeight={this.gridItemHeight}
                    onLayoutChange={async (layout) => {
                        await this.setState({
                            layoutForAppInst: layout
                        });
                        let layoutUniqueId = getUserId() + "_layout2"
                        reactLocalStorage.setObject(layoutUniqueId, this.state.layoutForAppInst)
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
                        console.log("hwType===>", hwType);

                        return this.makeGridItemOne(uniqueIndex, hwType, graphType, item)

                    })}
                </ResponsiveReactGridLayout>

            )
        }

        handleThemeChanges = async (themeTitle) => {
            if (themeTitle === THEME_OPTIONS.DEFAULT) {
                await this.setState({
                    chartColorList: CHART_COLOR_LIST
                })
            }
            if (themeTitle === THEME_OPTIONS.BLUE) {
                await this.setState({
                    chartColorList: CHART_COLOR_LIST2
                })
            }
            if (themeTitle === THEME_OPTIONS.GREEN) {
                await this.setState({
                    chartColorList: CHART_COLOR_LIST3
                })
            }
            if (themeTitle === THEME_OPTIONS.RED) {
                await this.setState({
                    chartColorList: CHART_COLOR_LIST4
                })
            }

            if (themeTitle === THEME_OPTIONS.MONOKAI) {
                await this.setState({
                    chartColorList: CHART_COLOR_MONOKAI
                })
            }

            if (themeTitle === THEME_OPTIONS.APPLE) {
                await this.setState({
                    chartColorList: CHART_COLOR_APPLE
                })
            }

            let selectedChartColorList = this.state.chartColorList;
            reactLocalStorage.setObject(getUserId() + "_mon_theme", selectedChartColorList)
            reactLocalStorage.set(getUserId() + "_mon_theme_title", themeTitle)
            await this.setState({
                chartColorList: selectedChartColorList,
            })
        }

        renderBreadCrumb() {

            console.log("currentCluster===>", this.state.currentCluster);
            if (this.state.currentCluster !== '' && this.state.currentAppInst === '') {
                return this.state.currentCluster.replace('|', '>');
            } else if (this.state.currentCluster === '' && this.state.currentAppInst !== '') {
                let appInst = this.state.currentAppInst.toString().split("|")[0]
                let cluster = this.state.currentAppInst.toString().split("|")[1]
                let cloudlet = this.state.currentAppInst.toString().split("|")[2]
                return cluster + " > " + cloudlet + " > " + appInst;
            } else if (this.state.currentAppInst !== '') {
                return this.state.currentCluster.replace('|', '>') + " > " + this.state.currentAppInst.toString().split("|")[0];
            } else {
                return null;
            }
        }


        __makeMenuListItems = () => {
            return (
                <AMenu>
                    {/*desc:#########################################*/}
                    {/*desc:Fetch Locally Stored Data                */}
                    {/*desc:#########################################*/}
                    <AMenu.Item
                        style={{display: 'flex'}}
                        key="1"
                        onClick={async () => {
                            await this.handleResetClicked();
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
                    <AMenu.Item style={{display: 'flex'}}
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
                    </AMenu.Item>
                    {/*desc:#########################################*/}
                    {/*desc:Reload                                  */}
                    {/*desc:#########################################*/}
                    <AMenu.Item style={{display: 'flex'}}
                                key="1"
                                onClick={async () => {
                                    if (!this.state.loading) {
                                        this.refreshAllData();
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
                    {/*desc: Fix Grid              */}
                    {/*desc: ######################*/}
                    {/*<AMenu.Item style={{display: 'flex'}}
                                key="1"
                                onClick={async () => {
                                    await this.setState({
                                        isDraggable: !this.state.isDraggable,
                                        appInstanceListGroupByCloudlet: [],
                                    })
                                    this.setState({
                                        appInstanceListGroupByCloudlet: reducer.groupBy(this.state.appInstanceList, CLASSIFICATION.CLOUDLET),
                                    });
                                }}
                    >
                        <MaterialIcon icon={'zoom_out_map'} color={'white'}/>
                        <div style={PageMonitoringStyles.listItemTitle}>
                            Fix Grid
                        </div>
                        <div style={{marginLeft: 5}}>
                            <CustomSwitch
                                size="small"
                                checked={!this.state.isDraggable}
                                color="primary"

                            />
                        </div>
                    </AMenu.Item>*/}

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
                        <AMenu.Item
                            key="1"
                            onClick={async () => {
                                await this.setState({
                                    themeTitle: THEME_OPTIONS.DEFAULT
                                })
                                await this.handleThemeChanges(this.state.themeTitle)
                            }}
                        >
                            DEFAULT
                        </AMenu.Item>
                        <AMenu.Item
                            key="2"
                            onClick={async () => {
                                await this.setState({
                                    themeTitle: THEME_OPTIONS.GREEN
                                })
                                await this.handleThemeChanges(this.state.themeTitle)
                            }}
                        >
                            GREEN
                        </AMenu.Item>
                        <AMenu.Item
                            key="3"
                            onClick={async () => {
                                await this.setState({
                                    themeTitle: THEME_OPTIONS.BLUE
                                })
                                await this.handleThemeChanges(this.state.themeTitle)
                            }}
                        >
                            BLUE
                        </AMenu.Item>
                        <AMenu.Item
                            key="4"
                            onClick={async () => {
                                await this.setState({
                                    themeTitle: THEME_OPTIONS.RED
                                })
                                await this.handleThemeChanges(this.state.themeTitle)
                            }}
                        >
                            RED
                        </AMenu.Item>
                        <AMenu.Item
                            key="5"
                            onClick={async () => {
                                await this.setState({
                                    themeTitle: THEME_OPTIONS.MONOKAI
                                })
                                await this.handleThemeChanges(this.state.themeTitle)
                            }}
                        >
                            MONOKAI
                        </AMenu.Item>
                        <AMenu.Item
                            key="5"
                            onClick={async (value) => {
                                await this.setState({
                                    themeTitle: THEME_OPTIONS.APPLE
                                })
                                await this.handleThemeChanges(this.state.themeTitle)
                            }}
                        >
                            APPLE
                        </AMenu.Item>
                    </ASubMenu>
                    {/*desc: ######################*/}
                    {/*desc: Stream             */}
                    {/*desc: ######################*/}
                    {this.state.currentClassification === CLASSIFICATION.APPINST &&
                    <AMenu.Item style={{display: 'flex'}}
                                key="1"
                                onClick={async () => {
                                    await this.setState({
                                        isStream: !this.state.isStream,
                                    });

                                    if (!this.state.isStream) {
                                        clearInterval(this.intervalForAppInst)
                                    } else {
                                        await this.handleAppInstDropdown(this.state.currentAppInst, true)
                                    }
                                }}
                    >
                        <MaterialIcon icon={'schedule'} color={'white'}/>
                        <div style={PageMonitoringStyles.listItemTitle}>
                            Stream
                        </div>
                    </AMenu.Item>
                    }
                    {/*desc: ######################*/}
                    {/*desc: Show Header            */}
                    {/*desc: ######################*/}
                    {/*<AMenu.Item style={{display: 'flex'}}
                                key="1"
                                onClick={() => {
                                    if (this.props.isShowHeader) {
                                        this.props.toggleHeader(false)
                                    } else {
                                        this.props.toggleHeader(true)
                                    }
                                }}
                    >
                        <MaterialIcon icon={'crop_7_5'} color={'white'}/>
                        <div style={PageMonitoringStyles.listItemTitle}>
                            Show Header
                        </div>
                    </AMenu.Item>*/}
                </AMenu>
            )
        }

        renderHeader = () => {
            return (
                <>
                    <div className='content_title_wrap' style={{display: 'flex', marginTop: 10}}>
                        <div className='content_title_label'
                             style={{flex: .08, marginBottom: 0, marginLeft: 3,}}>Monitoring
                        </div>
                        <div className='page_monitoring_select_area' style={{
                            flex: .70,
                            //backgroundColor: 'red',
                            justifyContent: 'flex-start',
                            display: 'flex',
                        }}>
                            <div style={{flex: .6}}>
                                {this.makeClusterDropdown()}
                            </div>
                            <div style={{flex: .4}}>
                                {this.makeAppInstDropdown()}
                            </div>

                        </div>
                        {/*
                            desc :####################################
                            desc :BreadCrumb Area
                            desc :####################################
                            */}
                        <div
                            style={{
                                marginLeft: 12,
                                fontSize: 12,
                                flex: .52,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                color: 'rgba(255, 255, 255, .8)',
                                height: 29,
                                alignSelf: 'center',
                                border: this.state.currentCluster !== '' || this.state.currentAppInst !== '' ? '1px dotted #4c4c4c' : null,
                                //backgroundColor: 'blue',
                            }}
                        >
                            <div style={{marginTop: 7, marginLeft: 9}}>
                                {this.renderBreadCrumb()}
                            </div>
                        </div>

                        {/*
                            desc :####################################
                            desc :loading Area
                            desc :####################################
                            */}
                        <div style={{flex: .025}}>
                            {this.state.intervalLoading &&
                            <div>
                                <div style={{marginLeft: 15}}>
                                    <CircularProgress
                                        style={{
                                            color: this.state.currentClassification === CLASSIFICATION.APPINST ? 'grey' : 'green',
                                            zIndex: 9999999,
                                            fontSize: 10
                                        }}
                                        size={20}
                                    />
                                </div>
                            </div>
                            }
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
                            display: 'flex', justifyContent: 'flex-end', width: '100%', flex: .05,
                            //backgroundColor: 'yellow'
                        }}>
                            <div style={{
                                alignItems: 'center',
                                display: 'flex',
                                cursor: 'pointer',
                                //backgroundColor: 'red',
                                height: 30, width: 50,
                                alignSelf: 'center',
                                justifyContent: 'center',
                            }}>
                                <ADropdown
                                    overlay={this.__makeMenuListItems}
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
                                            color='rgb(118, 255, 3)'
                                            //color={'#559901'}
                                            icon="list"
                                        />
                                    </div>
                                </ADropdown>
                            </div>
                        </div>
                    </div>
                </>

            )
        }


        makeClusterDropdown() {
            return (
                <div className="page_monitoring_dropdown_box" style={{alignSelf: 'center', justifyContent: 'center'}}>
                    <div
                        className="page_monitoring_dropdown_label"
                        style={{
                            backgroundColor: 'transparent',
                            height: 20,
                            marginTop: 6,
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
                            await this.handleClusterDropdown(value.trim())
                        }}
                    />
                </div>
            )
        }

        makeAppInstDropdown() {
            return (
                <div className="page_monitoring_dropdown_box" style={{alignSelf: 'center', justifyContent: 'center'}}>
                    <div className="page_monitoring_dropdown_label"
                         style={{backgroundColor: 'transparent', height: 20, marginTop: 6, marginLeft: 3}}>
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


        renderLegend() {

            let fullClusterList = '';
            let region = '';
            if (this.state.currentCluster) {
                let cluster = this.state.currentCluster.split(" | ")[0]
                let cloudlet = this.state.currentCluster.split(" | ")[1]
                region = this.state.currentCluster.split(" | ")[2]
                fullClusterList = cloudlet + " > " + cluster;
            }

            return (
                <Legend>
                    <div style={{display: 'flex', width: '100%'}}>
                        {/*  {!this.state.isShowFilter &&
                        <div>
                            {this.makeClusterDropdown()}
                        </div>
                        }*/}
                        {this.state.loading && <div style={{display: 'flex', alignSelf: 'center'}}>
                            <CircularProgress style={{fontWeight: 'bold', color: '#1cecff'}}
                                              color={'#1cecff'}
                                              size={15}/>
                        </div>}
                        {this.state.currentClassification === 'Cluster' ?
                            <div style={{
                                display: 'flex',
                                flex: 1,
                                justifyContent: 'center',
                                marginLeft: 0,
                                backgroundColor: 'transparent'
                            }}>
                                {this.state.filteredClusterUsageList.map((item, index) => {
                                    return (
                                        <Center2>
                                            <div style={{
                                                backgroundColor: this.state.chartColorList[index],
                                                width: 15,
                                                height: 15,
                                                borderRadius: 50,
                                                marginTop: 3
                                            }}>
                                            </div>
                                            <ClusterCluoudletLable
                                                style={{
                                                    marginLeft: 4,
                                                    marginRight: 15,
                                                    marginBottom: 0
                                                }}>{item.cluster}
                                                {` [`}{item.cloudlet}]

                                            </ClusterCluoudletLable>
                                        </Center2>
                                    )
                                })}
                            </div>
                            :
                            <div style={{
                                display: 'flex',
                                flex: 1,
                                justifyContent: 'center',
                                marginLeft: 0,
                                backgroundColor: 'transparent',
                                height: 20,
                                marginTop: 3,
                            }}>
                                <div style={{backgroundColor: 'transparent'}}>
                                    <div style={{
                                        backgroundColor: this.state.chartColorList[0],
                                        width: 15,
                                        height: 15,
                                        borderRadius: 50,
                                        marginTop: 3
                                    }}>
                                    </div>
                                </div>
                                <ClusterCluoudletLable
                                    style={{marginLeft: 5, marginRight: 15, marginBottom: 0}}>
                                    {this.state.currentAppInst.split("|")[0]} {/*{`| `}*/}
                                    {/*{this.state.currentAppInst.split("|")[2]} {`| `} //cluster
                                    {this.state.currentAppInst.split("|")[1]} cloudlet*/}
                                </ClusterCluoudletLable>
                            </div>
                        }

                    </div>
                </Legend>
            )
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
                            <div style={{marginTop: 25, marginLeft: 25,}}>
                                <div style={{fontSize: 25,}}>
                                    There is no app instance you can access..
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }

            return (

                <div style={{width: '100%', height: '100%',}}>

                    <AddItemPopupContainer parent={this} isOpenEditView={this.state.isOpenEditView}/>
                    <AddItemPopupContainer2 parent={this} isOpenEditView2={this.state.isOpenEditView2}/>

                    <ModalGraph selectedClusterUsageOne={this.state.selectedClusterUsageOne}
                                selectedClusterUsageOneIndex={this.state.selectedClusterUsageOneIndex}
                                parent={this}
                                modalIsOpen={this.state.modalIsOpen}
                                cluster={''} contents={''}/>

                    <BigModalGraphContainer
                        chartDataForRendering={this.state.chartDataForRendering}
                        isShowBigGraph={this.state.isShowBigGraph}
                        parent={this}
                        popupGraphHWType={this.state.popupGraphHWType}
                        graphType={this.state.popupGraphType}
                        isPopupMap={this.state.isPopupMap}
                        appInstanceListGroupByCloudlet={this.state.appInstanceListGroupByCloudlet}
                        selectedClientLocationListOnAppInst={this.state.selectedClientLocationListOnAppInst}
                        loading={this.state.loading}
                    />
                    <Grid.Row className=''>
                        <Card style={{
                            width: '100%',
                            backgroundColor: '#292c33',
                            paddingTop: 10,
                            marginBottom: -10,
                            color: 'white',
                        }}>
                            <div>
                                {/*desc:---------------------------------*/}
                                {/*desc:Content Header                   */}
                                {/*desc:---------------------------------*/}
                                <SemanticToastContainer position={"top-right"} color={'white'}/>
                                {this.renderHeader()}
                                {/*desc:---------------------------------*/}
                                {/*desc:Legend                           */}
                                {/*desc:---------------------------------*/}
                                {this.renderLegend()}
                                <div className="page_monitoring"
                                     style={{overflowY: 'auto', height: this.gridLayoutHeight}}>
                                    <div className='' style={{marginBottom: 50}}>
                                        {this.state.currentClassification === CLASSIFICATION.CLUSTER
                                            ? this.renderGridLayoutForCluster()
                                            : this.renderGridLayoutForAppInst()
                                        }
                                    </div>
                                </div>
                            </div>
                            {/*todo:---------------------------------*/}
                            {/*todo:terminal button                   */}
                            {/*todo:---------------------------------*/}
                            {this.state.currentClassification === CLASSIFICATION.APPINST && this.state.terminalData ?
                                <div className='page_monitoring_terminal_button' style={{marginBottom: 25}}
                                     onClick={() => this.setState({openTerminal: true})}
                                >
                                </div>
                                : null
                            }
                        </Card>


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
))
