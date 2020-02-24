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
import {Checkbox, DatePicker, Select} from 'antd';
import {
    convertHwTypePhrases,
    defaultLayoutForAppInst,
    defaultLayoutForCluster,
    defaultHwMapperList,
    filterUsageByClassification,
    getUserId,
    handleHardwareTabChanges,
    make__LineChartDataForAppInst,
    makeBarChartDataForAppInst,
    makeBarChartDataForCluster,
    makeLineChartDataForCluster,
    makeSelectBoxListWithKeyValuePipe,
    makeSelectBoxListWithThreeValuePipe,
    renderBubbleChartCoreForDev_Cluster,
    renderGridLayoutForAppInst,
    renderLineChartCoreForDev_AppInst,
    renderLineChartCoreForDev_Cluster, HARDWARE_TYPE_FOR_GRID,
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
import ModalGraphForCluster from "./ModalGraphForCluster";
import {reactLocalStorage} from "reactjs-localstorage";
import LeafletMapWrapperForDev from "./LeafletMapWrapperForDev";
import {Responsive, WidthProvider} from "react-grid-layout";
import _ from "lodash";

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
    gridLayoutMapperToHwList: [],
    hwList: [],

}


export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageDevMonitoring extends Component<Props, State> {


        intervalForAppInst = null;


        constructor(props) {
            super(props);
            let savedlayoutKeyForCluster = getUserId() + "_layout"
            let savedlayoutKeyForClusterMapper = getUserId() + "_layout_mapper"

            let savedlayoutKeyForAppInst = getUserId() + "_layout2"



            this.state = {
                layoutForCluster: isEmpty(reactLocalStorage.get(savedlayoutKeyForCluster)) ? defaultLayoutForCluster : reactLocalStorage.getObject(savedlayoutKeyForCluster),
                gridLayoutMapperToHwList: isEmpty(reactLocalStorage.get(savedlayoutKeyForClusterMapper)) ? defaultLayoutForCluster : reactLocalStorage.getObject(savedlayoutKeyForClusterMapper),
                layoutForAppInst: isEmpty(reactLocalStorage.get(savedlayoutKeyForAppInst)) ? defaultLayoutForAppInst : reactLocalStorage.getObject(savedlayoutKeyForAppInst),
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
                hwList: [HARDWARE_TYPE.CPU, HARDWARE_TYPE.MEM, HARDWARE_TYPE.DISK, HARDWARE_TYPE.RECVBYTES, HARDWARE_TYPE.SENDBYTES, HARDWARE_TYPE.TCPRETRANS, HARDWARE_TYPE.TCPCONNS, HARDWARE_TYPE.UDPSENT, HARDWARE_TYPE.UDPRECV],
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

            //fixme: fakeData
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

            /* let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
             let savedlayoutKeyForCluster = store.email + "_layout"

             alert(JSON.stringify(reactLocalStorage.get(savedlayoutKeyForCluster)))
             await this.setState({
                 layoutForCluster: reactLocalStorage.get(savedlayoutKeyForCluster),
             })*/

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
                lineChartDataSet = make__LineChartDataForAppInst(this.state.filteredAppInstUsageList, hwType, this)
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
                return this.renderGraphAreaFoLineChart(hwType, lineChartDataSet)
            }
        }


        makeChartDataAndRenderTabBody_BarChart(hwType,) {
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
                                {convertHwTypePhrases(pHardwareType) + " [" + pHardwareType + "]"} Usage
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


        renderGraphAreaFoLineChart(pHardwareType, lineChartDataSet) {
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
                                Top 5 {pHardwareType} usage
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

        async resetGridPosition() {
            try {
                reactLocalStorage.remove(getUserId() + "_layout")
                reactLocalStorage.remove(getUserId() + "_layout2")
                await this.setState({
                    layoutForCluster: [],
                    layoutForAppInst: [],
                });
                await this.setState({
                    layoutForCluster: defaultLayoutForCluster,
                    layoutForAppInst: defaultLayoutForAppInst,
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
                        <div className="page_monitoring_dropdown_label" style={{marginLeft: 10,}}>
                            Add Line Chart Item
                        </div>
                        <div style={{marginBottom: 0,}}>
                            <Select
                                placeholder="Select Item"
                                //defaultValue=''
                                style={{width: 190, marginBottom: 10, marginLeft: 5}}
                                onChange={async (value) => {
                                    //alert(value)
                                    await this.addGridItem(value)
                                    showToast('added ' + value + " item!!")
                                }}
                            >
                                {this.state.hwList.map(item => {
                                    return (
                                        <Option value={item}>{item}</Option>
                                    )
                                })}
                            </Select>

                        </div>
                        <div className="page_monitoring_dropdown_label" style={{marginLeft: 25,}}>
                            Add Bar Chart Item
                        </div>
                        <div style={{marginBottom: 0,}}>
                            <Select
                                placeholder="Select Item"
                                //defaultValue=''
                                style={{width: 190, marginBottom: 10, marginLeft: 5}}
                                onChange={async (value) => {
                                    //alert(value)
                                    await this.addGridItem(value, 'bar')
                                    showToast('added ' + value + " item!!")
                                }}
                            >
                                {this.state.hwList.map(item => {
                                    return (
                                        <Option value={item}>{item}</Option>
                                    )
                                })}
                            </Select>

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
                <>
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
                </>
            )
        }


        makeid(length) {
            let result = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        async addGridItem(hwType, graphType = 'line') {
            console.log("items===>", this.state.layoutForCluster)
            let currentItems = this.state.layoutForCluster;
            let maxY = -1;
            if (!isEmpty(currentItems)) {
                maxY = _.maxBy(currentItems, 'y').y
            }

            let uniqueId = this.makeid(5)
            let _gridLayoutMapperToHwList = this.state.gridLayoutMapperToHwList

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
                gridLayoutMapperToHwList: _gridLayoutMapperToHwList.concat(itemOne),
            });

            console.log("gridLayoutMapperToHwList===>", this.state.gridLayoutMapperToHwList)

            reactLocalStorage.setObject(getUserId() + "_layout", this.state.layoutForCluster)
            reactLocalStorage.setObject(getUserId() + "_layout_mapper", this.state.gridLayoutMapperToHwList)
        }

        removeGridItem(i) {
            console.log("removing", i);

            let removedLayout = _.reject(this.state.layoutForCluster, {i: i});
            reactLocalStorage.setObject(getUserId() + "_layout", removedLayout)
            //reactLocalStorage.setObject(getUserId() + "_layout_mapper", removedLayout)

            this.setState({
                layoutForCluster: removedLayout,
            });
        }

        handleLayoutChangeForCluster(layout) {
            this.setState({
                layoutForCluster: layout,
            }, () => {
                console.log("layoutForCluster===>", this.state.layoutForCluster);
            })

            reactLocalStorage.setObject(getUserId() + "_layout", layout)
            //reactLocalStorage.setObject(getUserId() + "_layout_mapper", layout)
        }


        renderGridLayoutForCluster() {
            return (
                <ResponsiveReactGridLayout
                    className={'layout'}
                    cols={{lg: 3, md: 3, sm: 3, xs: 3, xxs: 3}}
                    layout={this.state.layoutForCluster}
                    rowHeight={470}
                    onLayoutChange={(layout) => {

                        this.handleLayoutChangeForCluster(layout)

                    }}
                    style={{backgroundColor: 'black'}}
                >
                    {this.state.layoutForCluster.map((item, loopIndex) => {

                        const index = item.i;
                        console.log("gridLayoutMapperToHwList===>", this.state.gridLayoutMapperToHwList);
                        //console.log("defaultHwMapperList===>", defaultHwMapperList[index]);

                        let hwType = 'CPU'
                        let graphType = 'line';
                        if (!isEmpty(this.state.gridLayoutMapperToHwList.find(x => x.id === index))) {
                            hwType = this.state.gridLayoutMapperToHwList.find(x => x.id === index).hwType
                            graphType = this.state.gridLayoutMapperToHwList.find(x => x.id === index).graphType
                        }
                        console.log("hwType===>", hwType);
                        return (
                            <div key={index} data-grid={item} style={{margin: 5, backgroundColor: 'black'}}>
                                <div className='page_monitoring_column_kyungjoon1' style={{height: 450}}>
                                    {graphType === 'line' ? this.makeChartDataAndRenderTabBody_LineChart(hwType) : this.makeChartDataAndRenderTabBody_BarChart(hwType)}
                                </div>
                                <div className="remove"
                                     onClick={() => {
                                         this.removeGridItem(index)
                                     }}
                                     style={{
                                         fontSize: 25,
                                         width: 50,
                                         display: 'flex',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         //backgroundColor: 'red',
                                         position: "absolute",
                                         right: "2px",
                                         top: 0,
                                         fontWeight: 'bold',
                                         cursor: "pointer"
                                     }}
                                >
                                    x
                                </div>
                            </div>
                        );
                    })}


                </ResponsiveReactGridLayout>

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
                                                     style={{}}>
                                                    {this.state.currentClassification === CLASSIFICATION.CLUSTER ?
                                                        this.renderGridLayoutForCluster(this)
                                                        :
                                                        renderGridLayoutForAppInst(this)
                                                    }
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


