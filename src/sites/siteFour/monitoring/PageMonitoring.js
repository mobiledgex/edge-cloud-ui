import 'react-hot-loader'
import {SemanticToastContainer, toast} from 'react-semantic-toasts';
import OutsideClickHandler from 'react-outside-click-handler';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {Button, Dropdown, Grid, Modal, Tab, Table} from 'semantic-ui-react'
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import {hot} from "react-hot-loader/root";
import {DatePicker, Progress,} from 'antd';
import * as reducer from "../../../utils";
import {
    cutArrayList, filterAppInstanceListByAppInst,
    filterAppInstanceListByCloudLet,
    filterAppInstanceListByClusterInst,
    filterAppInstanceListByRegion,
    filterAppInstOnCloudlet,
    filterInstanceCountOnCloutLetOne,
    filterUsageByType,
    filterUsageListByRegion,
    getUsageList,
    instanceFlavorToPerformanceValue,
    makeCloudletListSelectBox,
    makeClusterListSelectBox,
    makeCompleteDateTime, makeGridInstanceList,
    makeNetworkBarData,
    makeNetworkLineChartData, numberWithCommas,
    renderBarGraph,
    renderBubbleChart,
    renderLineChart,
    renderPlaceHolder,
    renderPlaceHolder2,
    renderSixGridInstanceOnCloudletGrid,
    requestShowAppInstanceList, Styles
} from "./PageMonitoringService";
import {
    APPINSTANCE_INIT_VALUE,
    CLASSIFICATION,
    HARDWARE_OPTIONS,
    HARDWARE_TYPE,
    MONITORING_CATE_SELECT_TYPE,
    NETWORK_OPTIONS,
    NETWORK_TYPE,
    RECENT_DATA_LIMIT_COUNT,
    REGIONS_OPTIONS
} from "../../../shared/Constants";
import Lottie from "react-lottie";
import type {TypeGridInstanceList} from "../../../shared/Types";
import {TypeAppInstance, TypeUtilization} from "../../../shared/Types";
import moment from "moment";
import ToggleDisplay from 'react-toggle-display';
import {TabPanel, Tabs} from "react-tabs";
import './PageMonitoring.css'
import {showToast} from "./PageMonitoringChartService";

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
    cloudletList: any,
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
    allCpuUsageList: Array,
    allMemUsageList: Array,
    allDiskUsageList: Array,
    allNetworkUsageList: Array,
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


}


export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageMonitoring extends Component<Props, State> {
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
            allCpuUsageList: [],
            allMemUsageList: [],
            allDiskUsageList: [],
            allNetworkUsageList: [],
            cloudLetSelectBoxPlaceholder: 'Select CloudLet',
            clusterSelectBoxPlaceholder: 'Select Cluster',
            appInstSelectBoxPlaceholder: 'Select Instance',
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
            currentHardwareType: HARDWARE_TYPE.FLAVOR,
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
            usageListByDate: []
        };


        constructor(props) {
            super(props);

        }

        componentDidMount = async () => {
            await this.loadInitData();
        }

        async loadInitData() {
            let userRole = localStorage.getItem('selectRole')
            console.log('userRole====>', userRole);

            this.setState({
                loading: true,
                loading0: true,
                isReady: false,
            })
            //todo: REALDATA
            let appInstanceList: Array<TypeAppInstance> = await requestShowAppInstanceList();

            //todo: FAKE JSON FOR DEV
            //let appInstanceList: Array<TypeAppInstance> = require('../../../temp/appInstacelist2')

            appInstanceList.map(async (item: TypeAppInstance, index) => {
                if (index === 0) {
                    await this.setState({
                        appInstanceOne: APPINSTANCE_INIT_VALUE,
                    });
                }
            })

            let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, CLASSIFICATION.CLOUDLET);
            await this.setState({
                appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
                appInstanceList: appInstanceList,
                allAppInstanceList: appInstanceList,
            })
            await this.setState({
                isAppInstaceDataReady: true,
            })

            //todo: -------------------------------------------------------------------------------
            //todo: make FirstbubbleChartData
            //todo: -------------------------------------------------------------------------------
            let bubbleChartData = await this.makeBubbleChartData(appInstanceList);
            await this.setState({
                bubbleChartData: bubbleChartData,
            })


            //todo: ###################################################################################################################################
            //todo: Bring Hardware chart Data with App Instance List. From remote  (REALDATA) , Previous 1year data(default)
            //todo: ###################################################################################################################################
            let startTime = makeCompleteDateTime(moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'));
            let endTime = makeCompleteDateTime(moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm'));
            await this.setState({
                startTime,
                endTime
            });
            let usageList = await getUsageList(appInstanceList, "*", RECENT_DATA_LIMIT_COUNT, startTime, endTime);
            //todo: #####################################################
            //todo: (last xx datas FOR MATRIC) - FAKE JSON FOR DEV
            //todo:#####################################################
            //let usageList = require('../../../temp/usageAllJsonList2')

            console.log('usageList===>', usageList)

            //todo: MAKE SELECTBOX.
            let clusterInstanceGroupList = reducer.groupBy(appInstanceList, CLASSIFICATION.CLUSTER_INST)
            let cloudletList = this.makeSelectBoxList(appInstanceListGroupByCloudlet, CLASSIFICATION.CLOUDLET)
            let clusterList = this.makeSelectBoxList(clusterInstanceGroupList, CLASSIFICATION.CLUSTER_INST)

            await this.setState({
                allCpuUsageList: usageList[0],
                allMemUsageList: usageList[1],
                allNetworkUsageList: usageList[2],//networkUsage
                allDiskUsageList: usageList[3],//disk is last array
                cloudletList: cloudletList,
                clusterList: clusterList,
                filteredCpuUsageList: usageList[0],
                filteredMemUsageList: usageList[1],
                filteredNetworkUsageList: usageList[2],
                filteredDiskUsageList: usageList[3],
            }, () => {
                console.log('filteredNetworkUsageList===>', this.state.filteredNetworkUsageList);
            });

            //todo: -------------------------------------------------------------
            //todo: MAKE TOP5 INSTANCE LIST
            //todo: -------------------------------------------------------------
            let appInstanceListTop5 = this.makeSelectBoxList2(cutArrayList(5, this.state.filteredCpuUsageList), CLASSIFICATION.APP_NAME)

            //todo: -------------------------------------------
            //todo: GridInstanceList
            //todo: -------------------------------------------
            let gridInstanceList = makeGridInstanceList(usageList);

            //todo: -------------------------------------------
            //todo: GridInstanceList MEM,CPU MAX VALUE
            //todo: -------------------------------------------
            let gridInstanceListMemMax = Math.max.apply(Math, gridInstanceList.map(function (o) {
                return o.sumMemUsage;
            }));

            let gridInstanceListCpuMax = Math.max.apply(Math, gridInstanceList.map(function (o) {
                return o.sumCpuUsage;
            }));

            await this.setState({
                appInstanceListTop5: appInstanceListTop5,
                allGridInstanceList: gridInstanceList,
                filteredGridInstanceList: gridInstanceList,
                gridInstanceListMemMax: gridInstanceListMemMax,
                gridInstanceListCpuMax: gridInstanceListCpuMax,
            }, () => {
                console.log('filteredGridInstanceList===>', this.state.filteredGridInstanceList);
            });

            this.props.toggleLoading(false);
            await this.setState({
                loading: false,
                loading0: false,
                isReady: true,
                isReadyNetWorkCharts: true,
            });

            toast({
                type: 'success',
                //icon: 'smile',
                title: 'Data Loading Complete',
                animation: 'bounce',
                time: 3 * 1000,
                color: 'black',
            });

        }


        /**
         * @todo: 셀렉트박스 Region, CloudLet, Cluster을 변경할때 처리되는 프로세스..
         * @todo: Process to be processed when changing select box Region, CloudLet, Cluster
         */
        async filterByEachTypes(pRegion: string = '', pCloudLet: string = '', pCluster: string = '', pAppInstance: string = '', isDateFiltering: boolean = false,) {
            let appInstanceList = []
            let allCpuUsageList = []
            let allMemUsageList = []
            let allDiskUsageList = []
            let allNetworkUsageList = []
            let allGridInstanceList = []

            console.log('2222===>', this.state.startTime);
            console.log('2222===>', this.state.endTime);

            //@todo: 날짜에 의한 필터링인경우
            if (isDateFiltering) {
                appInstanceList = this.state.appInstanceList;
                allCpuUsageList = this.state.usageListByDate[0]
                allMemUsageList = this.state.usageListByDate[1]
                allNetworkUsageList = this.state.usageListByDate[2]
                allDiskUsageList = this.state.usageListByDate[3]
                allGridInstanceList = makeGridInstanceList(this.state.usageListByDate);
            } else {
                appInstanceList = this.state.allAppInstanceList;
                allCpuUsageList = this.state.allCpuUsageList
                allMemUsageList = this.state.allMemUsageList
                allDiskUsageList = this.state.allDiskUsageList
                allNetworkUsageList = this.state.allNetworkUsageList
                allGridInstanceList = this.state.allGridInstanceList;
            }

            this.props.toggleLoading(true)
            await this.setState({
                loading0: true,
                appInstanceListSortByCloudlet: [],
                currentRegion: pRegion,
                cloudletList: [],
            })

            //todo: -------------------------------------------
            //todo: FLITER By pRegion
            //todo: -------------------------------------------
            appInstanceList = filterAppInstanceListByRegion(pRegion, appInstanceList);
            let cloudletSelectBoxList = makeCloudletListSelectBox(appInstanceList)
            let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, CLASSIFICATION.CLOUDLET);

            let filteredCpuUsageList = filterUsageListByRegion(pRegion, allCpuUsageList);
            let filteredMemUsageList = filterUsageListByRegion(pRegion, allMemUsageList);
            let filteredDiskUsageList = filterUsageListByRegion(pRegion, allDiskUsageList);
            let filteredNetworkUsageList = filterUsageListByRegion(pRegion, allNetworkUsageList);
            let filteredGridInstanceList = filterUsageListByRegion(pRegion, allGridInstanceList);

            //todo: -------------------------------------------
            //todo: FLITER  By pCloudLet
            //todo: -------------------------------------------
            let clusterSelectBoxList = [];
            if (pCloudLet !== '') {
                appInstanceListGroupByCloudlet = filterInstanceCountOnCloutLetOne(appInstanceListGroupByCloudlet, pCloudLet)
                appInstanceList = filterAppInstanceListByCloudLet(appInstanceList, pCloudLet);
                clusterSelectBoxList = makeClusterListSelectBox(appInstanceList, pCloudLet)
                filteredCpuUsageList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.CLOUDLET, pCloudLet, filteredCpuUsageList);
                filteredMemUsageList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.CLOUDLET, pCloudLet, filteredMemUsageList);
                filteredDiskUsageList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.CLOUDLET, pCloudLet, filteredDiskUsageList);
                filteredNetworkUsageList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.CLOUDLET, pCloudLet, filteredNetworkUsageList);
                filteredGridInstanceList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.CLOUDLET, pCloudLet, filteredGridInstanceList);
            }

            //todo: -------------------------------------------
            //todo: Filter By pCluster
            //todo: -------------------------------------------
            if (pCluster !== '') {
                //todo:LeftTop의 Cloudlet위에 올라가는 인스턴스 리스트를 필터링 처리하는 로직.
                appInstanceListGroupByCloudlet[0] = filterAppInstOnCloudlet(appInstanceListGroupByCloudlet[0], pCluster)
                //todo:app instalce list를 필터링
                appInstanceList = filterAppInstanceListByClusterInst(appInstanceList, pCluster);
                filteredCpuUsageList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.CLUSTERINST, pCluster, filteredCpuUsageList);
                filteredMemUsageList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.CLUSTERINST, pCluster, filteredMemUsageList);
                filteredDiskUsageList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.CLUSTERINST, pCluster, filteredDiskUsageList);
                filteredNetworkUsageList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.CLUSTERINST, pCluster, filteredNetworkUsageList);
                filteredGridInstanceList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.CLUSTERINST, pCluster, filteredGridInstanceList);

            }

            //todo: -------------------------------------------
            //todo: FLITER By pAppInstance
            //todo: -------------------------------------------
            if (pAppInstance !== '') {
                appInstanceList = filterAppInstanceListByAppInst(appInstanceList, pAppInstance);
                filteredCpuUsageList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.APPNAME, pAppInstance, filteredCpuUsageList);
                filteredMemUsageList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.APPNAME, pAppInstance, filteredMemUsageList);
                filteredDiskUsageList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.APPNAME, pAppInstance, filteredDiskUsageList);
                filteredNetworkUsageList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.APPNAME, pAppInstance, filteredNetworkUsageList);
                filteredGridInstanceList = filterUsageByType(MONITORING_CATE_SELECT_TYPE.APPNAME, pAppInstance, filteredGridInstanceList);

            }

            //todo: -------------------------------------------
            //todo: GridInstanceList MEM,CPU MAX VALUE
            //todo: -------------------------------------------
            let gridInstanceListMemMax = Math.max.apply(Math, allGridInstanceList.map(function (o) {
                return o.sumMemUsage;
            }));
            let gridInstanceListCpuMax = Math.max.apply(Math, allGridInstanceList.map(function (o) {
                return o.sumCpuUsage;
            }));

            await this.setState({
                filteredCpuUsageList: filteredCpuUsageList,
                filteredMemUsageList: filteredMemUsageList,
                filteredDiskUsageList: filteredDiskUsageList,
                filteredNetworkUsageList: filteredNetworkUsageList,
                filteredGridInstanceList: filteredGridInstanceList,
                gridInstanceListMemMax: gridInstanceListMemMax,
                gridInstanceListCpuMax: gridInstanceListCpuMax,
                appInstanceList: appInstanceList,
                appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
                loading0: false,
                cloudletList: cloudletSelectBoxList,
                clusterList: clusterSelectBoxList,
                currentCloudLet: pCloudLet,
                currentCluster: pCluster,
            });


            //todo: MAKE TOP5 CPU/MEM USAGE SELECTBOX
            if (pAppInstance === '') {
                //todo: MAKE TOP5 INSTANCE LIST
                let appInstanceListTop5 = this.makeSelectBoxList2(cutArrayList(5, this.state.filteredCpuUsageList), CLASSIFICATION.APP_NAME)
                await this.setState({
                    appInstanceListTop5: appInstanceListTop5,
                });
            }
            setTimeout(() => {
                this.setState({
                    cloudLetSelectBoxPlaceholder: 'Select CloudLet',
                    clusterSelectBoxPlaceholder: 'Select Cluster',
                })
            }, 500)

            //todo: -------------------------------------------
            //todo: make BUBBLE CHART DATA
            //todo: -------------------------------------------
            let bubbleChartData = await this.makeBubbleChartData(appInstanceList);
            await this.setState({
                bubbleChartData: bubbleChartData,
            })

            //todo: -------------------------------------------
            //todo: NETWORK chart data filtering
            //todo: -------------------------------------------
            let networkChartData = makeNetworkLineChartData(this.state.filteredNetworkUsageList, this.state.currentNetworkType)
            let networkBarChartData = makeNetworkBarData(this.state.filteredNetworkUsageList, this.state.currentNetworkType)
            await this.setState({
                networkChartData: networkChartData,
                networkBarChartData: networkBarChartData,
            })


            this.props.toggleLoading(false)
        }


        async filterUsageListByDate() {
            //todo: -------------------------------------------
            //todo: Filter By startDate, endDate
            //todo: -------------------------------------------
            if (this.state.startTime !== '' && this.state.endTime !== '') {
                let startTime = makeCompleteDateTime(this.state.startTime);
                let endTime = makeCompleteDateTime(this.state.endTime);

                this.setState({loading: true})
                let usageList = await getUsageList(this.state.appInstanceList, "*", RECENT_DATA_LIMIT_COUNT, startTime, endTime);
                this.setState({
                    usageListByDate: usageList,
                    loading: false
                })

                // pRegion?: string = '',     pCloudLet?: string = '',     pCluster?: string = '',     pAppInstance?: string = '',     isDateFiltering?: boolean = false): Promise<void>
                this.filterByEachTypes(this.state.currentRegion, this.state.currentCloudLet, this.state.currentCluster, this.state.currentAppInst, true)

            }
        }

        async makeBubbleChartData(appInstanceList: any) {
            let bubbleChartData = []
            appInstanceList.map((item, index) => {
                bubbleChartData.push({
                    //label: item.Flavor+ "-"+ item.AppName.substring(0,5),
                    index: index,
                    label: item.AppName.toString().substring(0, 10) + "...",
                    value: instanceFlavorToPerformanceValue(item.Flavor),
                    favor: item.Flavor,
                    fullLabel: item.AppName.toString(),
                })
            })

            return bubbleChartData;
        }

        makeSelectBoxList(arrList, keyName) {
            let newArrList = [];
            for (let i in arrList) {
                newArrList.push({
                    value: arrList[i][0][keyName],
                    text: arrList[i][0][keyName],//.toString()//.substring(0,25)+ "...",
                })
            }
            return newArrList;
        }

        makeSelectBoxList2(arrList, keyName) {
            let newArrList = [];
            for (let i in arrList) {
                newArrList.push({
                    value: arrList[i].instance.AppName,
                    text: arrList[i].instance.AppName,
                })
            }
            return newArrList;
        }

        async refreshAllData() {
            toast({
                type: 'success',
                //icon: 'smile',
                title: 'REFRESH ALL DATA',
                animation: 'bounce',
                time: 3 * 1000,
                color: 'black',
            });

            await this.setState({
                cloudLetSelectBoxClearable: true,
            })

            await this.loadInitData();
            await this.setState({
                currentRegion: 'ALL',
                currentCloudLet: '',
                currentCluster: '',
                currentAppInst: '',
            })
        }


        renderBottomGridArea() {
            return (
                <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing>
                    <Table.Header className="viewListTableHeader">
                        <Table.Row>
                            <Table.HeaderCell>
                                index
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                NAME
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
                                RECV BYTES
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                SEND BYTES
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                FLAVOR
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
                                        animationData: require('../../../lotties/loader001'),
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
                        {this.state.isReady && this.state.filteredGridInstanceList.map((item: TypeGridInstanceList, index) => {

                            return (
                                <Table.Row className='page_monitoring_popup_table_row'
                                           onClick={async () => {
                                               //alert(item.AppName)
                                               /*await this.setState({
                                                   currentAppInst: item.instance.AppName,
                                                   currentGridIndex: index,
                                               })
                                               await this.handleSelectBoxChanges(this.state.currentRegion, this.state.currentCloudLet, this.state.currentCluster, item.instance.AppName)*/
                                           }}
                                >
                                    <Table.Cell>
                                        {index}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.instance.AppName}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <div>
                                                {item.sumCpuUsage.toFixed(2) + '%'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'} strokeWidth={10} showInfo={false}
                                                          percent={(item.sumCpuUsage / this.state.gridInstanceListCpuMax) * 100}
                                                          strokeColor={'#29a1ff'} status={'normal'}/>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <div>
                                                {numberWithCommas(item.sumMemUsage) + ' Byte'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'} strokeWidth={10} showInfo={false}
                                                          percent={(item.sumMemUsage / this.state.gridInstanceListMemMax) * 100}
                                                          strokeColor={'#29a1ff'} status={'normal'}/>
                                            </div>

                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumDiskUsage) + ' Byte'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumRecvBytes) + ' Byte'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumSendBytes) + ' Byte'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.instance.Flavor}
                                    </Table.Cell>
                                </Table.Row>

                            )
                        })}
                    </Table.Body>
                </Table>
            )
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
                                TOP5 of CPU Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderBarGraph(this.state.filteredCpuUsageList, HARDWARE_TYPE.CPU)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Transition Of CPU Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderLineChart(this, this.state.filteredCpuUsageList, HARDWARE_TYPE.CPU)}
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
                                TOP5 of MEM Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderBarGraph(this.state.filteredMemUsageList, HARDWARE_TYPE.MEM)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Transition Of MEM Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderLineChart(this, this.state.filteredMemUsageList, HARDWARE_TYPE.MEM)}
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
                                TOP5 of DISK Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderBarGraph(this.state.filteredDiskUsageList, HARDWARE_TYPE.DISK)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Transition Of DISK Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderLineChart(this, this.state.filteredDiskUsageList, HARDWARE_TYPE.DISK)}
                        </div>
                    </div>
                </div>
            )
        }

        renderNetworkArea(networkType: string) {
            return (
                <div className='page_monitoring_dual_column'>
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of NETWORK Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder('network') : renderBarGraph(this.state.filteredNetworkUsageList, networkType, this)}
                        </div>
                    </div>
                    {/*1_column*/}
                    {/*1_column*/}
                    {/*1_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title_select'>
                                Transition Of NETWORK Usage
                            </div>
                            {!this.state.loading &&
                            <Dropdown
                                placeholder='SELECT HARDWARE'
                                selection
                                loading={this.state.loading}
                                options={NETWORK_OPTIONS}
                                defaultValue={NETWORK_OPTIONS[0].value}
                                onChange={async (e, {value}) => {
                                    if (value === NETWORK_TYPE.RECV_BYTES) {
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
                            {this.state.loading ? renderPlaceHolder('network') : renderLineChart(this, this.state.filteredNetworkUsageList, networkType)}
                        </div>
                    </div>
                </div>
            )
        }


        renderHeader = () => {
            return (

                <div>
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
                                    if (!this.state.loading){
                                        this.refreshAllData();
                                    }else{
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
                                    await this.setState({
                                        currentGridIndex: -1,
                                        currentTabIndex: 0,
                                    })
                                    await this.filterByEachTypes('ALL', '', '', '')
                                }}
                            >RESET</Button>
                        </div>
                    </Grid.Row>
                </div>
            )
        }

        renderSelectBoxRow() {
            return (
                <div className='page_monitoring_select_row'>
                    <div className='page_monitoring_select_area'>

                        {/*todo:---------------------------*/}
                        {/*todo:REGION Dropdown           */}
                        {/*todo:---------------------------*/}
                        <div className="page_monitoring_dropdown_box">
                            <div className="page_monitoring_dropdown_label">
                                Region
                            </div>
                            <Dropdown
                                disabled={this.state.loading}
                                clearable={this.state.regionSelectBoxClearable}
                                placeholder='REGION'
                                selection
                                loading={this.state.loading}
                                options={REGIONS_OPTIONS}
                                defaultValue={REGIONS_OPTIONS[0].value}
                                onChange={async (e, {value}) => {
                                    await this.filterByEachTypes(value)
                                    setTimeout(() => {
                                        this.setState({
                                            cloudLetSelectBoxPlaceholder: 'Select CloudLet'
                                        })
                                    }, 1000)
                                }}
                                value={this.state.currentRegion}
                                // style={Styles.dropDown}
                            />

                        </div>

                        {/*todo:---------------------------*/}
                        {/*todo:CloudLet Dropdown       */}
                        {/*todo:---------------------------*/}

                        <div className="page_monitoring_dropdown_box">
                            <div className="page_monitoring_dropdown_label">
                                CloudLet
                            </div>
                            <Dropdown
                                disabled={this.state.loading}
                                value={this.state.currentCloudLet}
                                clearable={this.state.cloudLetSelectBoxClearable}
                                loading={this.state.loading}
                                placeholder={this.state.cloudLetSelectBoxPlaceholder}
                                selection={true}
                                options={this.state.cloudletList}
                                // style={Styles.dropDown}
                                onChange={async (e, {value}) => {
                                    await this.filterByEachTypes(this.state.currentRegion, value)
                                    setTimeout(() => {
                                        this.setState({
                                            clusterSelectBoxPlaceholder: 'Select Cluster'
                                        })
                                    }, 1000)
                                }}
                            />
                        </div>


                        {/*todo:---------------------------*/}
                        {/*todo:Cluster Dropdown         */}
                        {/*todo:---------------------------*/}
                        <div className="page_monitoring_dropdown_box">
                            <div className="page_monitoring_dropdown_label">
                                Cluster
                            </div>
                            <Dropdown
                                disabled={this.state.currentCloudLet === '' || this.state.loading}
                                value={this.state.currentCluster}
                                clearable={this.state.clusterSelectBoxClearable}
                                loading={this.state.loading}
                                placeholder={this.state.clusterSelectBoxPlaceholder}
                                selection
                                options={this.state.clusterList}
                                // style={Styles.dropDown}
                                onChange={async (e, {value}) => {
                                    await this.filterByEachTypes(this.state.currentRegion, this.state.currentCloudLet, value)

                                    setTimeout(() => {
                                        this.setState({
                                            appInstSelectBoxPlaceholder: "Select App Instance",
                                            currentAppInst: '',
                                        })
                                    }, 500)
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
                                disabled={this.state.currentCluster === '' || this.state.loading}
                                clearable={this.state.appInstSelectBoxClearable}
                                loading={this.state.loading}
                                value={this.state.currentAppInst}
                                placeholder='Select App Instance'
                                selection
                                options={this.state.appInstanceListTop5}
                                // style={Styles.dropDown}
                                onChange={async (e, {value}) => {

                                    await this.setState({
                                        currentAppInst: value,
                                    })
                                    await this.filterByEachTypes(this.state.currentRegion, this.state.currentCloudLet, this.state.currentCluster, value)
                                }}
                            />
                        </div>

                        {/*todo:---------------------------*/}
                        {/*todo: Time Range Dropdown       */}
                        {/*todo:---------------------------*/}
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
                                    this.filterUsageListByDate()
                                }}
                                ranges={{
                                    Today: [moment(), moment()],
                                    'Last 7 Days': [moment().subtract(7, 'd'), moment().subtract(1, 'd')],
                                    'Last 30 Days': [moment().subtract(30, 'd'), moment().subtract(1, 'd')],
                                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                                    'Last Month': [moment().date(-30), moment().date(-1)],
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

        async handleBubbleChartDropDown(value) {
            await this.setState({
                currentHardwareType: value,
            });

            let appInstanceList = this.state.appInstanceList;
            let allCpuUsageList = this.state.filteredCpuUsageList;
            let allMemUsageList = this.state.filteredMemUsageList;
            let allDiskUsageList = this.state.filteredDiskUsageList;
            let allNetworkUsageList = this.state.filteredNetworkUsageList;
            let chartData = [];

            if (value === HARDWARE_TYPE.FLAVOR) {
                appInstanceList.map((item, index) => {
                    chartData.push({
                        //label: item.Flavor+ "-"+ item.AppName.substring(0,5),
                        index: index,
                        label: item.AppName.toString().substring(0, 10) + "...",
                        value: instanceFlavorToPerformanceValue(item.Flavor),
                        favor: item.Flavor,
                        fullLabel: item.AppName.toString(),
                    })
                })
            } else if (value === HARDWARE_TYPE.CPU) {
                allCpuUsageList.map((item, index) => {
                    chartData.push({
                        //label: item.Flavor+ "-"+ item.AppName.substring(0,5),
                        index: index,
                        label: item.instance.AppName.toString().substring(0, 10) + "...",
                        value: (item.sumCpuUsage * 100).toFixed(0),
                        favor: (item.sumCpuUsage * 100).toFixed(0),
                        fullLabel: item.instance.AppName.toString(),
                    })
                })
            } else if (value === HARDWARE_TYPE.MEM) {
                allMemUsageList.map((item, index) => {
                    chartData.push({
                        //label: item.Flavor+ "-"+ item.AppName.substring(0,5),
                        index: index,
                        label: item.instance.AppName.toString().substring(0, 10) + "...",
                        value: item.sumMemUsage,
                        favor: item.sumMemUsage,
                        fullLabel: item.instance.AppName.toString(),
                    })
                })
            } else if (value === HARDWARE_TYPE.DISK) {
                allDiskUsageList.map((item, index) => {
                    chartData.push({
                        //label: item.Flavor+ "-"+ item.AppName.substring(0,5),
                        index: index,
                        label: item.instance.AppName.toString().substring(0, 10) + "...",
                        value: item.sumDiskUsage,
                        favor: item.sumDiskUsage,
                        fullLabel: item.instance.AppName.toString(),
                    })
                })
            } else if (value === NETWORK_TYPE.RECV_BYTES) {
                allNetworkUsageList.map((item, index) => {
                    chartData.push({
                        index: index,
                        label: item.instance.AppName.toString().substring(0, 10) + "...",
                        value: item.sumRecvBytes,
                        favor: item.sumRecvBytes,
                        fullLabel: item.instance.AppName.toString(),
                    })
                })
            } else if (value === HARDWARE_TYPE.SEND_BYTE) {
                allNetworkUsageList.map((item, index) => {
                    chartData.push({
                        index: index,
                        label: item.instance.AppName.toString().substring(0, 10) + "...",
                        value: item.sumSendBytes,
                        favor: item.sumSendBytes,
                        fullLabel: item.instance.AppName.toString(),
                    })
                })
            }

            //todo: bubbleChart
            //todo: bubbleChart
            //todo: bubbleChart
            this.setState({
                bubbleChartData: chartData,
            });
        }

        //@todo:-----------------------
        //@todo:-----------------------
        //@todo:    CPU,MEM,DISK TAB
        //@todo:-----------------------
        //@todo:-----------------------
        CPU_MEM_DISK_TABS = [

            {
                menuItem: 'CPU', render: () => {
                    return (
                        <Pane>
                            {this.renderCpuTabArea()}
                        </Pane>
                    )
                }
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
        ]

        render() {
            {/*todo:-------------------------------------------------------------------------------*/
            }
            // todo: Components showing when the loading of graph data is not completed.
            {/*todo:-------------------------------------------------------------------------------*/
            }
            if (!this.state.isAppInstaceDataReady) {
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
                                            animationData: require('../../../lotties/loader001'),
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
                        <Modal.Header>Status of App Instance</Modal.Header>
                        <Modal.Content>
                            {this.renderBottomGridArea()}
                        </Modal.Content>
                    </Modal>
                    <SemanticToastContainer/>
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
                                                            Status of Launched App Instances on Cloudlet
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {!this.state.isAppInstaceDataReady ? renderPlaceHolder() : renderSixGridInstanceOnCloudletGrid(this.state.appInstanceListGroupByCloudlet, this)}
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
                                                        panes={this.CPU_MEM_DISK_TABS}
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
                                                            Engine Performance State Of App instance
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
                                                            options={HARDWARE_OPTIONS}
                                                            defaultValue={HARDWARE_OPTIONS[0].value}
                                                            onChange={async (e, {value}) => {

                                                                this.handleBubbleChartDropDown(value);

                                                            }}
                                                            value={this.state.currentHardwareType}
                                                        />
                                                    </div>
                                                    {/*todo:---------------------------------*/}
                                                    {/*todo: RENDER BUBBLE_CHART          */}
                                                    {/*todo:---------------------------------*/}
                                                    <div className='page_monitoring_container'>
                                                        {!this.state.isAppInstaceDataReady ? renderPlaceHolder2() : renderBubbleChart(this, this.state.currentHardwareType, this.state.bubbleChartData)}
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
                                                            {this.renderNetworkArea(NETWORK_TYPE.RECV_BYTES)}
                                                        </TabPanel>
                                                        <TabPanel>
                                                            {this.renderNetworkArea(NETWORK_TYPE.SEND_BYTES)}
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
                                                            SHOW APP INSTANCE LIST
                                                        </div>
                                                        <div className='page_monitoring_popup_header_button'>
                                                            SHOW APP INSTANCE LIST
                                                            <div style={{display:'inline-block', marginLeft:10}}>
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
                                                        /*  this.setState({
                                                              isShowBottomGrid: !this.state.isShowBottomGrid,
                                                          })*/
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
                                                                Status of App
                                                            </div>
                                                            <div className='page_monitoring_popup_header_button'>
                                                                <div>
                                                                    HIDE APP INSTANCE LIST
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
                                                        <div className='page_monitoring_popup_table'>
                                                            {this.state.filteredGridInstanceList.length === 0 ?
                                                                <div style={Styles.noData}>
                                                                    NO DATA
                                                                </div>
                                                                : this.renderBottomGridArea()}
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

                </Grid.Row>


            );
        }

    }
))));


