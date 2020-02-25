import 'react-hot-loader';
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
import {Checkbox, DatePicker, Select,} from 'antd';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import RoomIcon from '@material-ui/icons/Room';

import {
    convertHwTypePhrases,
    defaultHwMapperListForCluster,
    defaultLayoutForAppInst,
    defaultLayoutForCluster, defaultLayoutMapperForAppInst,
    filterUsageByClassification,
    getUserId,
    handleHardwareTabChanges,
    HARDWARE_TYPE_FOR_GRID,
    makeLineChartDataForAppInst,
    makeBarChartDataForAppInst,
    makeBarChartDataForCluster,
    makeid,
    makeLineChartDataForCluster,
    makeSelectBoxListWithKeyValuePipe,
    makeSelectBoxListWithThreeValuePipe,
    renderBottomGridTableList,
    renderBubbleChartCoreForDev_Cluster,
    renderLineChartCoreForDev_AppInst,
    renderLineChartCoreForDev_Cluster,
} from "./PageDevMonitoringService";
import {
    CHART_COLOR_LIST,
    CLASSIFICATION,
    CONNECTIONS_OPTIONS, GRID_ITEM_TYPE, HARDWARE_OPTIONS_FOR_APPINST,
    HARDWARE_OPTIONS_FOR_CLUSTER,
    HARDWARE_TYPE, lineGraphOptions,
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
    isEmpty,
    makeBubbleChartDataForCluster,
    noDataArea,
    PageMonitoringStyles,
    renderBarChartCore,
    renderLoaderArea,
    renderPlaceHolderCircular,
    showToast
} from "../PageMonitoringCommonService";
import {getAppLevelUsageList} from "../PageMonitoringMetricService";
import * as reducer from "../../../../utils";
import TerminalViewer from "../../../../container/TerminalViewer";
import ModalGraph from "./ModalGraph";
import {reactLocalStorage} from "reactjs-localstorage";
import LeafletMapWrapperForDev from "./LeafletMapWrapperForDev";
import {Responsive, WidthProvider} from "react-grid-layout";
import _ from "lodash";
import {TabPanel, Tabs} from "react-tabs";
import PieChartWrapper from "./PieChartWrapper";
import BigModalGraphForCluster from "./BigModalGraphForCluster";

const {Option} = Select;

const CheckboxGroup = Checkbox.Group;
const FA = require('react-fontawesome')
const {RangePicker} = DatePicker;
const {Column, Row} = Grid;
const {Pane} = Tab
const ResponsiveReactGridLayout = WidthProvider(Responsive);


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
    lineChartDataForRendering: any,

}


export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageDevMonitoring extends Component<Props, State> {


        intervalForAppInst = null;


        constructor(props) {
            super(props);
            let clusterLayoutKey = getUserId() + "_layout"
            let ClusterHwMapperKey = getUserId() + "_layout_mapper"
            let appInstLayoutKey = getUserId() + "_layout2"
            let layoutMapperAppInstKey = getUserId() + "_layout2_mapper"


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
                isDraggable: true,
                isUpdateEnableForMap: false,
                isShowBigGraph: false,
                popupGraphHWType: '',
                lineChartDataForRendering: [],
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
            /*let clusterList = await getClusterList();
            let cloudletList = await getCloudletList()
            let appInstanceList: Array<TypeAppInstance> = await getAppInstList();
            if (appInstanceList.length === 0) {
                this.setState({
                    isNoData: true,
                })
            }*/

            //fixme: fakeData22222222222
            //fixme: fakeData22222222222
            //fixme: fakeData22222222222
            //fixme: fakeData22222222222
            //fixme: fakeData22222222222
            //fixme: fakeData22222222222
            //fixme: fakeData22222222222
            //fixme: fakeData
            let clusterList = require('../temp/TEMP_KYUNGJOOON_FOR_TEST/Jsons/clusterList')
            let cloudletList = require('../temp/TEMP_KYUNGJOOON_FOR_TEST/Jsons/cloudletList')
            let appInstanceList = require('../temp/TEMP_KYUNGJOOON_FOR_TEST/Jsons/appInstanceList')
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
            /*try {
                allClusterUsageList = await getClusterLevelUsageList(clusterList, "*", RECENT_DATA_LIMIT_COUNT);
            } catch (e) {

            }*/
            //fixme: fakeData
            //fixme: fakeData
            allClusterUsageList = require('../temp/TEMP_KYUNGJOOON_FOR_TEST/Jsons/allClusterUsageList')
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

        makeLineChartData(hwType,) {
            let lineChartDataSet: TypeLineChartData = [];
            if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                lineChartDataSet = makeLineChartDataForCluster(this.state.filteredClusterUsageList, hwType, this)
            } else if (this.state.currentClassification === CLASSIFICATION.APPINST) {
                console.log('filteredAppInstUsageList===>', this.state.filteredAppInstUsageList)
                lineChartDataSet = makeLineChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
                console.log('filteredAppInstUsageList===222222>', lineChartDataSet)
            }
            return this.renderLineChartArea(hwType, lineChartDataSet)
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
            return this.renderBarChartArea(hwType, barChartDataSet, graphType)
        }


        convertToClassification(pClassification) {
            if (pClassification === CLASSIFICATION.APPINST) {
                return "App Instance"
            } else {
                return pClassification
            }
        }


        renderLineChartArea(pHardwareType, chartDataSet, graphType = '') {
            return (
                <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
                    {/*@todo:LInechart*/}
                    {/*@todo:LInechart*/}
                    {/*@todo:LInechart*/}
                    <div className='page_monitoring_dual_container' style={{flex: 1}}>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                {pHardwareType} Usage of {this.state.loading ?
                                <CircularProgress size={9} style={{
                                    fontSize: 9,
                                    color: '#77BD25',
                                    marginLeft: 5,
                                    marginBottom: 1,
                                }}/> : this.convertToClassification(this.state.currentClassification)}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : this.state.currentClassification === CLASSIFICATION.CLUSTER ? renderLineChartCoreForDev_Cluster(this, chartDataSet) :
                                renderLineChartCoreForDev_AppInst(this, chartDataSet)
                            }
                        </div>
                    </div>
                </div>
            )
        }

        renderBarChartArea(pHardwareType, chartDataSet, graphType) {

            return (
                <div className='page_monitoring_dual_column' style={{display: 'flex'}}>
                    <div className='page_monitoring_dual_container' style={{flex: 1}}>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Top 5 {pHardwareType} usage
                                of {this.convertToClassification(this.state.currentClassification)}
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() :

                                chartDataSet.length === 0 || chartDataSet.chartDataList.length === 1 ?
                                    noDataArea()
                                    :
                                    renderBarChartCore(chartDataSet.chartDataList, chartDataSet.hardwareType, this, graphType)

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

        async resetGridPosition() {
            try {
                reactLocalStorage.remove(getUserId() + "_layout")
                reactLocalStorage.remove(getUserId() + "_layout2")
                reactLocalStorage.remove(getUserId() + "_layout_mapper")
                await this.setState({
                    layoutForCluster: [],
                    layoutMapperForCluster: [],
                    layoutForAppInst: [],
                });

                await this.setState({
                    layoutForCluster: defaultLayoutForCluster,
                    layoutMapperForCluster: defaultHwMapperListForCluster,
                    layoutForAppInst: defaultLayoutForAppInst,


                })
            } catch (e) {

                showToast(e.toString())
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
                        <div className='page_monitoring_title_select' style={{flex: .7}}>
                            Performance status of Cluster hardware
                        </div>
                        <div className='page_monitoring_title_select' style={{flex: .2, marginLeft: -10}}>
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
                    </div>
                    {/*todo:---------------------------------*/}
                    {/*todo: RENDER BUBBLE          */}
                    {/*todo:---------------------------------*/}
                    <div className='page_monitoring_container'>
                        {this.state.bubbleChartLoader ? renderPlaceHolderCircular() : renderBubbleChartCoreForDev_Cluster(this, this.state.currentHardwareType, this.state.bubbleChartData)}
                    </div>
                </div>
            )
        }

        renderMapArea() {
            return (
                <>
                    <div className='page_monitoring_title_area' style={{display: 'flex'}}>

                        <div style={{
                            display: 'flex',
                            width: '100%',
                            height: 30
                        }}>
                            <div className='page_monitoring_title' style={{
                                backgroundColor: 'transparent',
                                flex: .38
                            }}>
                                Launch status of
                                the {this.state.currentClassification}
                            </div>
                            <div style={{flex: .4, marginRight: 70}}>
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

                                    {/*@todo:RoomIcon*/}
                                    {/*@todo:RoomIcon*/}
                                    {/*@todo:RoomIcon*/}
                                    <RoomIcon color={'white'}/>
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
                            isDraggable={this.state.isDraggable}
                            handleAppInstDropdown={this.handleAppInstDropdown}
                            markerList={this.state.appInstanceListGroupByCloudlet}/>
                    </div>
                </>
            )
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
                        w: 1,
                        h: 1,
                    }),
                    layoutMapperForCluster: mapperList.concat(itemOne),
                });

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


        makeGridItemOneByType(hwType, graphType) {

            if (graphType.toUpperCase() === GRID_ITEM_TYPE.LINE) {
                return (
                    this.makeLineChartData(hwType)
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
                    this.renderBubbleChartArea()
                )
            } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.MAP) {
                return (
                    this.renderMapArea()
                )
            } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.CLOUDLET_LIST) {
                return (
                    renderBottomGridTableList(this, this.state.filteredClusterUsageList)
                )
            } else if (graphType.toUpperCase() === GRID_ITEM_TYPE.PIE) {
                return (
                    <PieChartWrapper/>
                )
            }

        }

        showBigModal = (hwType) => {
            /*todo:lineChartDataForRendering*/
            let lineChartDataSet = makeLineChartDataForCluster(this.state.filteredClusterUsageList, hwType)
            let levelTypeNameList = lineChartDataSet.levelTypeNameList
            let usageSetList = lineChartDataSet.usageSetList
            let newDateTimeList = lineChartDataSet.newDateTimeList

            const lineChartDataForRendering = (canvas) => {
                let finalSeriesDataSets = [];
                for (let index in usageSetList) {
                    //@todo: top5 만을 추린다
                    if (index < 5) {
                        let datasetOne = {
                            label: levelTypeNameList[index],
                            radius: 0,
                            borderWidth: 3.5,//todo:라인 두께
                            fill: false,
                            lineTension: 0.5,
                            /*backgroundColor:  gradientList[index],
                            borderColor: gradientList[index],*/
                            backgroundColor: CHART_COLOR_LIST[index],
                            borderColor: CHART_COLOR_LIST[index],
                            data: usageSetList[index],
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,

                        }

                        finalSeriesDataSets.push(datasetOne)
                    }

                }
                return {
                    labels: newDateTimeList,
                    datasets: finalSeriesDataSets,
                }
            }
            this.setState({
                isShowBigGraph: !this.state.isShowBigGraph,
                lineChartDataForRendering: lineChartDataForRendering,
                popupGraphHWType: hwType,

            });
        }

        __makeGridItemOne(uniqueIndex, hwType, graphType, item,) {


            return (
                <div key={uniqueIndex} data-grid={item} style={{margin: 5, backgroundColor: 'black'}}
                     onClick={() => {
                         //alert('sdlkfdslkf')
                     }}
                     onDoubleClick={() => {
                         this.setState({
                             isDraggable: !this.state.isDraggable
                         })
                     }}
                >
                    <div className='page_monitoring_column_kyungjoon1' style={{height: 450}}>
                        {/*@todo:makeGridItemOneByType      */}
                        {/*@todo:makeGridItemOneByType      */}
                        {this.makeGridItemOneByType(hwType, graphType)}
                    </div>

                    <div className="remove"
                         onClick={() => {
                             this.removeGridItem(uniqueIndex)
                         }}
                         style={{
                             fontSize: 25,
                             width: 37,
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             //backgroundColor: 'red',
                             position: "absolute",
                             right: "38px",
                             top: 0,
                             fontWeight: 'bold',
                             cursor: "pointer",
                             color: 'white'
                         }}
                    >
                        x
                    </div>

                    {/*todo:maxize button*/}
                    {/*todo:maxize button*/}
                    {/*todo:maxize button*/}
                    <div className="maxize"
                         onClick={this.showBigModal.bind(this, hwType)}
                         style={{
                             fontSize: 29,
                             width: 37,
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             //backgroundColor: 'red',
                             position: "absolute",
                             right: "0px",
                             top: 7,
                             fontWeight: 'bold',
                             cursor: "pointer"
                         }}
                    >
                        <FullscreenIcon color="primary" style={{color: 'white', fontSize: 25}}/>
                    </div>
                </div>
            )
        }


        ___renderGridLayoutForCluster() {

            return (
                <ResponsiveReactGridLayout
                    isResizable={false}
                    isDraggable={this.state.isDraggable}
                    useCSSTransforms={true}
                    className={'layout'}
                    cols={{lg: 3, md: 3, sm: 3, xs: 3, xxs: 3}}
                    layout={this.state.layoutForCluster}
                    rowHeight={470}
                    onLayoutChange={(layout) => {
                        this.setState({
                            layoutForCluster: layout,
                        }, () => {
                            console.log("layoutForCluster===>", this.state.layoutForCluster);
                        })

                        reactLocalStorage.setObject(getUserId() + "_layout", layout)

                    }}
                    style={{backgroundColor: 'black'}}
                >
                    {this.state.layoutForCluster.map((item, loopIndex) => {

                        const uniqueIndex = item.i;
                        let hwType = HARDWARE_TYPE.CPU
                        let graphType = GRID_ITEM_TYPE.LINE;
                        if (!isEmpty(this.state.layoutMapperForCluster.find(x => x.id === uniqueIndex))) {
                            hwType = this.state.layoutMapperForCluster.find(x => x.id === uniqueIndex).hwType
                            graphType = this.state.layoutMapperForCluster.find(x => x.id === uniqueIndex).graphType
                        }
                        console.log("hwType===>", hwType);
                        return this.__makeGridItemOne(uniqueIndex, hwType, graphType, item)
                    })}


                </ResponsiveReactGridLayout>

            )
        }


        renderGridLayoutForAppInst = () => {
            return (
                <>
                    <ResponsiveReactGridLayout
                        isDraggable={this.state.isDraggable}
                        className={'layout'}
                        cols={{lg: 3, md: 3, sm: 3, xs: 3, xxs: 3}}
                        layout={this.state.layoutForAppInst}
                        rowHeight={470}
                        onLayoutChange={async (layout) => {
                            await this.setState({
                                layoutForAppInst: layout
                            });
                            let layoutUniqueId = getUserId() + "_layout2"
                            reactLocalStorage.setObject(layoutUniqueId, this.state.layoutForAppInst)
                        }}
                        style={{overflowY: 'auto',}}
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

                            return this.__makeGridItemOne(uniqueIndex, hwType, graphType, item)

                        })}
                    </ResponsiveReactGridLayout>
                </>

            )
        }

        renderAddItemSelectOptions() {

            if (this.state.currentClassification === CLASSIFICATION.CLUSTER) {
                return this.state.hwListForCluster.map(item => {
                    return (
                        <Option value={item.value}>{item.text}</Option>
                    )
                });
            } else {
                return this.state.hwListForAppInst.map(item => {
                    return (
                        <Option value={item.value}>{item.text}</Option>
                    )
                });
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
                        <MButton
                            style={{
                                backgroundColor: !this.state.isDraggable ? 'green' : 'rgba(117,122,133,1)',
                                color: 'white',
                                height: 36
                            }}
                            onClick={async () => {
                                await this.setState({
                                    isDraggable: !this.state.isDraggable,
                                    appInstanceListGroupByCloudlet: [],
                                })
                                this.setState({
                                    appInstanceListGroupByCloudlet: reducer.groupBy(this.state.appInstanceList, CLASSIFICATION.CLOUDLET),
                                });
                            }}
                        >Fix Grid
                        </MButton>
                        <Button
                            onClick={async () => {
                                this.resetGridPosition();
                            }}
                        >Reset Grid Position
                        </Button>
                        {/*
                        <Button
                            onClick={async () => {
                                let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
                                let savedlayoutKey = store.email + "_layout"
                                reactLocalStorage.remove(savedlayoutKey)
                            }}
                        >remove
                        </Button>*/}


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
                        {/*todo:---------------------------*/}
                        {/*todo: App Instance_Dropdown #2     */}
                        {/*todo:---------------------------*/}
                        <div className="page_monitoring_dropdown_box"
                             style={{display: 'flex', marginTop: 15, marginLeft: -10}}>
                            <>
                                <div className="page_monitoring_dropdown_label" style={{marginLeft: 10,}}>
                                    Add Item
                                </div>
                                <div style={{marginBottom: 0,}}>
                                    <Select
                                        placeholder="Select Item"
                                        //defaultValue=''
                                        style={{width: 190, marginBottom: 10, marginLeft: 5}}
                                        onChange={async (value) => {
                                            //alert(value)
                                            await this.addGridItem(value, value)
                                            showToast('added ' + value + " item!!")
                                        }}
                                    >
                                        {[HARDWARE_TYPE_FOR_GRID.BUBBLE, HARDWARE_TYPE_FOR_GRID.MAP, HARDWARE_TYPE_FOR_GRID.CLOUDLET_LIST].map(item => {
                                            return (
                                                <Option value={item}>{item}</Option>
                                            )
                                        })}
                                    </Select>

                                </div>
                                <div className="page_monitoring_dropdown_label" style={{marginLeft: 25,}}>
                                    Add Line Chart
                                </div>
                                <div style={{marginBottom: 0,}}>
                                    <Select
                                        placeholder="Select Item"
                                        //defaultValue=''
                                        style={{width: 190, marginBottom: 10, marginLeft: 5}}
                                        onChange={async (value) => {
                                            //alert(value)
                                            await this.addGridItem(value, GRID_ITEM_TYPE.LINE)
                                            showToast('added ' + value + " item!!")
                                        }}
                                    >
                                        {this.renderAddItemSelectOptions()}
                                    </Select>

                                </div>

                                {this.state.currentClassification === CLASSIFICATION.CLUSTER &&
                                <>
                                    <div className="page_monitoring_dropdown_label" style={{marginLeft: 25,}}>
                                        Add Bar Chart
                                    </div>
                                    <div style={{marginBottom: 0,}}>
                                        <Select
                                            placeholder="Select Item"
                                            //defaultValue=''
                                            style={{width: 190, marginBottom: 10, marginLeft: 5}}
                                            onChange={async (value) => {
                                                //alert(value)
                                                await this.addGridItem(value, GRID_ITEM_TYPE.BAR)
                                                showToast('added ' + value + " item!!")
                                            }}
                                        >
                                            {this.renderAddItemSelectOptions()}
                                        </Select>

                                    </div>
                                </>
                                }
                                <>
                                    <div className="page_monitoring_dropdown_label" style={{marginLeft: 25,}}>
                                        Add Column Chart
                                    </div>
                                    <div style={{marginBottom: 0,}}>
                                        <Select
                                            placeholder="Select Item"
                                            //defaultValue=''
                                            style={{width: 190, marginBottom: 10, marginLeft: 5}}
                                            onChange={async (value) => {
                                                //alert(value)
                                                await this.addGridItem(value, GRID_ITEM_TYPE.COLUMN)
                                                showToast('added ' + value + " item!!")
                                            }}
                                        >
                                            {this.renderAddItemSelectOptions()}
                                        </Select>

                                    </div>
                                </>

                                {/*todo:Add Pie Chart*/}
                                {/*todo:Add Pie Chart*/}
                                {/*todo:Add Pie Chart*/}
                                <>
                                    <div className="page_monitoring_dropdown_label" style={{marginLeft: 25,}}>
                                        Add Pie Chart
                                    </div>
                                    <div style={{marginBottom: 0,}}>
                                        <Select
                                            placeholder="Select Item"
                                            //defaultValue=''
                                            style={{width: 190, marginBottom: 10, marginLeft: 5}}
                                            onChange={async (value) => {
                                                //alert(value)
                                                await this.addGridItem(value, GRID_ITEM_TYPE.PIE)
                                                showToast('added ' + value + " item!!")
                                            }}
                                        >
                                            {this.renderAddItemSelectOptions()}
                                        </Select>

                                    </div>
                                </>
                            </>
                        </div>
                    </div>

                </div>

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
                    <ModalGraph selectedClusterUsageOne={this.state.selectedClusterUsageOne}
                                selectedClusterUsageOneIndex={this.state.selectedClusterUsageOneIndex}
                                parent={this}
                                modalIsOpen={this.state.modalIsOpen}
                                cluster={''} contents={''}/>

                    <BigModalGraphForCluster
                        lineChartDataForRendering={this.state.lineChartDataForRendering}
                        isShowBigGraph={this.state.isShowBigGraph}
                        parent={this}
                        popupGraphHWType={this.state.popupGraphHWType}
                    />

                    <Grid.Row className='view_contents'>
                        <Grid.Column className='contents_body'>
                            {/*todo:---------------------------------*/}
                            {/*todo:Content Header                   */}
                            {/*todo:---------------------------------*/}
                            <SemanticToastContainer position={"top-right"}/>
                            {this.renderHeader()}
                            <div style={{marginTop: 30, marginLeft: 30}}>
                                {this.renderSelectBoxRow()}
                            </div>
                            <Grid.Row className='site_content_body' style={{marginTop: -10, overflowY: 'auto'}}>
                                <div style={{overflowY: 'auto'}}>
                                    <div className="page_monitoring"
                                         style={{backgroundColor: 'transparent', height: 3250}}>
                                        <div className='page_monitoring_dashboard_kyungjoon' style={{}}>
                                            {this.state.currentClassification === CLASSIFICATION.CLUSTER
                                                ? this.___renderGridLayoutForCluster()
                                                : this.renderGridLayoutForAppInst()
                                            }
                                        </div>
                                    </div>
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


