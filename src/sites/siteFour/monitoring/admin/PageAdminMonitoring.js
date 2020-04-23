import 'react-hot-loader'
import {SemanticToastContainer, toast} from 'react-semantic-toasts';
import OutsideClickHandler from 'react-outside-click-handler';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {Button, Dropdown, Grid, Tab} from 'semantic-ui-react'
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../../../actions';
import {hot} from "react-hot-loader/root";
import {DatePicker,} from 'antd';
import * as reducer from "../../../../utils";
import {
    cutArrayList,
    filterAppInstanceListByClassification,
    filterAppInstanceListByRegion,
    filterAppInstOnCloudlet,
    filterInstanceCountOnCloutLetOne,
    filterListBykey,
    filterUsageListByRegion,
    handleBubbleChartDropDown,
    instanceFlavorToPerformanceValue,
    makeBarChartDataForInst,
    makeCloudletListSelectBox,
    makeClusterListSelectBox,
    makeCompleteDateTime,
    makeGridInstanceList,
    makeLineChartDataForAppInst,
    makeNetworkBarData,
    makeNetworkLineChartData,
    makeSelectBoxListByClassification,
    makeSelectBoxListByClassification_byKey,
    renderBottomGridArea,
    renderBubbleChart,
    renderPlaceHolder2,
    renderSixGridForAppInstOnCloudlet,
} from "./PageAdminMonitoringService";
import {
    APPINSTANCE_INIT_VALUE,
    CLASSIFICATION,
    CONNECTIONS_OPTIONS,
    HARDWARE_OPTIONS,
    HARDWARE_TYPE,
    NETWORK_OPTIONS,
    NETWORK_TYPE,
    RECENT_DATA_LIMIT_COUNT,
    REGIONS_OPTIONS, USER_TYPE
} from "../../../../shared/Constants";
import type {TypeAppInstance, TypeGridInstanceList} from "../../../../shared/Types";
import {TypeUtilization} from "../../../../shared/Types";
import moment from "moment";
import ToggleDisplay from 'react-toggle-display';
import {TabPanel, Tabs} from "react-tabs";
import {renderGridLoader2, renderLoaderArea, renderPlaceHolderCircular, showToast, showToast2, PageMonitoringStyles} from "../PageMonitoringCommonService";
import '../PageMonitoring.css'
import {getAppInstList, getAppLevelUsageList, getCloudletListAll} from "../PageMonitoringMetricService";

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
// const isMobile = () => {
//     return navigator.userAgent.indexOf('iPad') > -1;
// };

let isIOS = /iPad|iPhone|iPod/.test(navigator.platform)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

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
    connectionsTabIndex: number,
    dropDownCloudletList: Array,
    cloudletList: Array,
    newCloudletList: Array,
    currentSixGridIndex: number,
    isAppInstaceOnCloudletDataReady: boolean,
    allAppInstUsageList: Array,
    filteredAppInstUsageList: Array,
    showGridLoader: boolean,

}

export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageAdminMonitoring extends Component<Props, State> {
        state = {
            date: '',
            time: '',
            dateTime: '',
            datesRange: '',
            appInstanceListGroupByCloudlet: [],
            loading: false,
            loading0: false,
            clusterInstanceGroupList: [],
            clusterList: [],
            isReady: false,
            counter: 0,
            appInstanceList: [],
            allAppInstanceList: [],
            appInstanceOne: {},
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
            usageListByDate: [],
            userType: '',
            placeHolderStateTime: moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'),
            placeHolderEndTime: moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm'),
            allConnectionsUsageList: [],
            filteredConnectionsUsageList: [],
            connectionsTabIndex: 0,
            dropDownCloudletList: [],
            cloudletList: [],
            newCloudletList: [],
            currentSixGridIndex: 0,
            isAppInstaceOnCloudletDataReady: false,
            allAppInstUsageList: [],
            filteredAppInstUsageList: [],
            showGridLoader: false,
        };

        constructor(props) {
            super(props);

        }

        componentDidMount = async () => {

            let store = JSON.parse(localStorage.PROJECT_INIT);
            let token = store ? store.userToken : 'null';

            try {
                await this.loadInitData();
            } catch (e) {
                showToast(e)
                this.setState({
                    loading: false,
                    allCpuUsageList: [],
                    allMemUsageList: [],
                    allNetworkUsageList: [],
                    allDiskUsageList: [],
                    dropdownCloudletList: [],
                    clusterList: [],
                    filteredCpuUsageList: [],
                    filteredMemUsageList: [],
                    filteredNetworkUsageList: [],
                    filteredDiskUsageList: [],
                    appInstanceListTop5: [],
                    allGridInstanceList: [],
                    filteredGridInstanceList: [],
                    gridInstanceListMemMax: 0,
                    gridInstanceListCpuMax: 0,

                })
            }

        }

        async loadInitData() {
            try {
                let userRole = localStorage.getItem('selectRole')
                this.setState({
                    isAppInstaceOnCloudletDataReady: false,
                    loading: true,
                    loading0: true,
                    isReady: false,
                    userType: userRole,
                })
                let allCloudletList = await getCloudletListAll();
                await this.setState({
                    cloudletList: allCloudletList,
                })


                //@test: FAKE JSON FOR DEV
                //let appInstanceList = require('../temp/TEMP_KYUNGJOOON_FOR_TEST/Jsons/appInstanceList')

                //@fixme: realdata
                let appInstanceList: Array<TypeAppInstance> = await getAppInstList(['EU', 'US'], USER_TYPE.ADMIN);

                appInstanceList.map(async (item: TypeAppInstance, index) => {
                    if (index === 0) {
                        await this.setState({
                            appInstanceOne: APPINSTANCE_INIT_VALUE,
                        });
                    }
                })


                let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, CLASSIFICATION.CLOUDLET);

                await this.setState({
                    //newCloudletList:newCloudletList,
                    appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
                    appInstanceList: appInstanceList,
                    allAppInstanceList: appInstanceList,
                    isAppInstaceDataReady: true,
                })

                //todo: make FirstbubbleChartData
                let bubbleChartData = await this.makeBubbleChartData(appInstanceList);
                await this.setState({
                    bubbleChartData: bubbleChartData,
                })


                let startTime = makeCompleteDateTime(moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'));
                let endTime = makeCompleteDateTime(moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm'));
                await this.setState({
                    startTime,
                    endTime
                });

                let allAppInstUsageList = [];
                //@todo:realdata
                try {
                    allAppInstUsageList = await getAppLevelUsageList(appInstanceList, "*", RECENT_DATA_LIMIT_COUNT, startTime, endTime, USER_TYPE.ADMIN);
                } catch (e) {
                    showToast(e.toString())
                }

                //fixme: fakedata

                //todo: MAKE SELECTBOX.
                let clusterInstanceGroupList = reducer.groupBy(appInstanceList, CLASSIFICATION.CLUSTER_INST)
                let dropDownCloudletList = this.makeSelectBoxList(appInstanceListGroupByCloudlet, CLASSIFICATION.CLOUDLET)
                let clusterList = this.makeSelectBoxList(clusterInstanceGroupList, CLASSIFICATION.CLUSTER_INST)

                await this.setState({
                    allAppInstUsageList: allAppInstUsageList,
                    filteredAppInstUsageList: allAppInstUsageList,
                    dropDownCloudletList: dropDownCloudletList,
                    clusterList: clusterList,
                }, () => {
                });

                //todo: -------------------------------------------------------------
                //todo: MAKE TOP5 INSTANCE LIST
                //todo: -------------------------------------------------------------


                let appInstanceListTop5 = makeSelectBoxListByClassification(cutArrayList(5, this.state.filteredAppInstUsageList), CLASSIFICATION.appName)
                let gridInstanceList = makeGridInstanceList(allAppInstUsageList);
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


            } catch (e) {
                showToast(e.toString())
            } finally {
                await this.setState({
                    loading: false,
                    loading0: false,
                    isReady: true,
                    isReadyNetWorkCharts: true,
                });
            }

        }

        async filterUsageListByDate() {
            try {
                if (this.state.startTime !== '' && this.state.endTime !== '') {
                    let startTime = makeCompleteDateTime(this.state.startTime);
                    let endTime = makeCompleteDateTime(this.state.endTime);

                    this.setState({loading: true})
                    let appInstUsageList_byDate = await getAppLevelUsageList(this.state.appInstanceList, "*", RECENT_DATA_LIMIT_COUNT, startTime, endTime);

                    this.setState({
                        usageListByDate: appInstUsageList_byDate,
                        loading: false
                    })
                    this.filterByClassification(this.state.currentRegion, this.state.currentCloudLet, this.state.currentCluster, this.state.currentAppInst, true)
                }
            } catch (e) {

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

        async refreshAllData() {
            toast({
                type: 'success',
                icon: 'smile',
                title: 'RELOAD DATA!',
                animation: 'bounce',
                time: 2 * 1000,
                color: 'black',
            });
            await this.setState({
                placeHolderStateTime: moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'),
                placeHolderEndTime: moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm'),
            })
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


        async filterByClassification(pRegion: string = '', pCloudLet: string = '', pCluster: string = '', pAppInstance: string = '', isDateFiltering: boolean = false,) {
            try {

                await this.setState({
                    currentSixGridIndex: 0,
                    showGridLoader: true,
                })

                let appInstanceList = []
                let allAppInstUsageList = [];
                let allGridInstanceList = []

                //@todo: 날짜에 의한 필터링인경우
                if (isDateFiltering) {
                    appInstanceList = this.state.appInstanceList;
                    allAppInstUsageList = this.state.usageListByDate
                    allGridInstanceList = makeGridInstanceList(this.state.usageListByDate);
                } else {
                    appInstanceList = this.state.allAppInstanceList;
                    allAppInstUsageList = this.state.allAppInstUsageList
                    allGridInstanceList = this.state.allGridInstanceList;
                }
                await this.setState({
                    loading0: true,
                    appInstanceListSortByCloudlet: [],
                    currentRegion: pRegion,
                    dropDownCloudletList: [],
                })

                //todo: -------------------------------------------
                //todo: FLITER By pRegion
                //todo: -------------------------------------------
                appInstanceList = filterAppInstanceListByRegion(pRegion, appInstanceList);
                let cloudletSelectBoxList = makeCloudletListSelectBox(appInstanceList)
                let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, CLASSIFICATION.CLOUDLET);
                let filteredAppInstUsageList = filterUsageListByRegion(pRegion, allAppInstUsageList);
                let filteredGridInstanceList = filterUsageListByRegion(pRegion, allGridInstanceList);


                //todo: -------------------------------------------
                //todo: FLITER  By pCloudLet
                //todo: -------------------------------------------
                let clusterSelectBoxList = [];
                if (pCloudLet !== '') {
                    appInstanceListGroupByCloudlet = filterInstanceCountOnCloutLetOne(appInstanceListGroupByCloudlet, pCloudLet)
                    appInstanceList = filterAppInstanceListByClassification(appInstanceList, pCloudLet, CLASSIFICATION.CLOUDLET);
                    clusterSelectBoxList = makeClusterListSelectBox(appInstanceList, pCloudLet)
                    filteredAppInstUsageList = filterListBykey(CLASSIFICATION.CLOUDLET, pCloudLet, filteredAppInstUsageList);
                    filteredGridInstanceList = filterListBykey(CLASSIFICATION.CLOUDLET, pCloudLet, filteredGridInstanceList);
                }

                //todo: -------------------------------------------
                //todo: Filter By pCluster
                //todo: -------------------------------------------
                if (pCluster !== '') {
                    appInstanceListGroupByCloudlet[0] = filterAppInstOnCloudlet(appInstanceListGroupByCloudlet[0], pCluster)
                    appInstanceList = filterAppInstanceListByClassification(appInstanceList, pCluster, CLASSIFICATION.CLUSTER_INST);
                    filteredAppInstUsageList = filterListBykey(CLASSIFICATION.CLUSTER_INST, pCluster, filteredAppInstUsageList);
                    filteredGridInstanceList = filterListBykey(CLASSIFICATION.CLUSTER_INST, pCluster, filteredGridInstanceList);
                }

                //todo: -------------------------------------------
                //todo: FLITER By pAppInstance
                //todo: -------------------------------------------
                if (pAppInstance !== '') {
                    appInstanceList = filterAppInstanceListByClassification(appInstanceList, pAppInstance, CLASSIFICATION.APP_NAME);
                    filteredAppInstUsageList = filterListBykey(CLASSIFICATION.APP_NAME, pAppInstance, filteredAppInstUsageList);
                    filteredGridInstanceList = filterListBykey(CLASSIFICATION.APP_NAME, pAppInstance, filteredGridInstanceList);

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
                    filteredAppInstUsageList: filteredAppInstUsageList,
                    filteredGridInstanceList: filteredGridInstanceList,
                    gridInstanceListMemMax: gridInstanceListMemMax,
                    gridInstanceListCpuMax: gridInstanceListCpuMax,
                    appInstanceList: appInstanceList,
                    appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
                    loading0: false,
                    dropDownCloudletList: cloudletSelectBoxList,
                    clusterList: clusterSelectBoxList,
                    currentCloudLet: pCloudLet,
                    currentCluster: pCluster,
                });

                //todo: MAKE TOP5 CPU/MEM USAGE SELECTBOX
                if (pAppInstance === '') {
                    let top5UsageList = await cutArrayList(5, this.state.filteredAppInstUsageList);


                    //todo: MAKE TOP5 INSTANCE LIST
                    let appInstanceListTop5 = makeSelectBoxListByClassification_byKey(top5UsageList, CLASSIFICATION.appName)


                    await this.setState({
                        appInstanceListTop5: appInstanceListTop5,
                    }, () => {
                    });
                }
                await this.setState({
                    cloudLetSelectBoxPlaceholder: 'Select CloudLet',
                    clusterSelectBoxPlaceholder: 'Select Cluster',
                })

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
                let networkChartData = makeNetworkLineChartData(this.state.filteredAppInstUsageList, this.state.currentNetworkType)
                let networkBarChartData = makeNetworkBarData(this.state.filteredAppInstUsageList, this.state.currentNetworkType)
                await this.setState({
                    networkChartData: networkChartData,
                    networkBarChartData: networkBarChartData,
                })

                setTimeout(() => {
                    this.setState({
                        showGridLoader: false,
                    })
                }, 1)
            } catch (e) {
                showToast(e.toString())
            } finally {
                setTimeout(() => {
                    this.setState({
                        showGridLoader: false,
                    })
                }, 1)
            }

        }


        renderChartTabArea(hwType: string) {
            return (
                <div className='page_monitoring_dual_column'>

                    {/*1_column*/}
                    {/*1_column*/}
                    {/*1_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area '>
                            <div className='page_monitoring_title'>
                                TOP5 of CPU Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : makeBarChartDataForInst(this.state.filteredAppInstUsageList, hwType)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                CPU Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular() : makeLineChartDataForAppInst(this, this.state.filteredAppInstUsageList, hwType)}
                        </div>
                    </div>
                </div>
            )
        }

        renderMultiChartArea(hwType: string) {
            return (
                <div className='page_monitoring_dual_column'>
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of Connections
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular('network') : makeBarChartDataForInst(this.state.filteredAppInstUsageList, hwType, this)}
                        </div>
                    </div>
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title_select'>
                                Connections
                            </div>
                            {!this.state.loading &&
                            this.renderDropDownForMultiChartArea(hwType)
                            }
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolderCircular('network') : makeLineChartDataForAppInst(this, this.state.filteredAppInstUsageList, hwType, this)}
                        </div>
                    </div>
                </div>
            )
        }

        renderDropDownForMultiChartArea(chartType) {
            if (chartType === HARDWARE_TYPE.ACTIVE_CONNECTION || chartType === HARDWARE_TYPE.ACCEPTS_CONNECTION || chartType === HARDWARE_TYPE.HANDLED_CONNECTION) {
                return (
                    <Dropdown
                        placeholder='SELECT CONN'
                        selection
                        loading={this.state.loading}
                        options={CONNECTIONS_OPTIONS}
                        //defaultValue={CONNECTIONS_OPTIONS[0].value}
                        onChange={async (e, {value}) => {

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
                        value={chartType}
                        //style={StylesForMonitoring.dropDown}
                    />
                )
            } else {
                return (
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
                        value={chartType}
                        // style={Styles.dropDown}
                    />
                )
            }


        }

        handleReset = async () => {
            await this.setState({
                currentGridIndex: -1,
                currentTabIndex: 0,
            })
            showToast2('Reset data', 1)
            await this.filterByClassification('ALL', '', '', '')
        }

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
                            onClick={this.handleReset}
                        >Reset</Button>
                    </div>
                </Grid.Row>
            )
        }


        renderDropdowns() {
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
                                selectOnBlur={false}
                                clearable={this.state.regionSelectBoxClearable}
                                placeholder='REGION'
                                selection
                                loading={this.state.loading}
                                options={REGIONS_OPTIONS}
                                defaultValue={REGIONS_OPTIONS[0].value}
                                onChange={async (e, {value}) => {
                                    try {
                                        await this.filterByClassification(value)
                                        setTimeout(() => {
                                            this.setState({
                                                cloudLetSelectBoxPlaceholder: 'Select CloudLet'
                                            })
                                        }, 1000)
                                    } catch (e) {

                                    }

                                }}
                                style={{zIndex: 9999}}
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
                                style={{zIndex: 9999, minWidth: 240}}
                                disabled={this.state.loading}
                                selectOnBlur={false}
                                value={this.state.currentCloudLet}
                                clearable={this.state.cloudLetSelectBoxClearable}
                                loading={this.state.loading}
                                placeholder={this.state.cloudLetSelectBoxPlaceholder}
                                selection={true}
                                options={this.state.dropDownCloudletList}
                                // style={Styles.dropDown}
                                onChange={async (e, {value}) => {
                                    try {
                                        await this.filterByClassification(this.state.currentRegion, value)
                                        setTimeout(() => {
                                            this.setState({
                                                clusterSelectBoxPlaceholder: 'Select Cluster'
                                            })
                                        }, 1000)
                                    } catch (e) {
                                    }

                                }}
                            />
                        </div>

                        {/*todo:---------------------------*/}
                        {/*todo:Cluster Dropdown         */}
                        {/*todo:---------------------------*/}
                        <div className="page_monitoring_dropdown_box" style={{zIndex: 9999}}>
                            <div className="page_monitoring_dropdown_label">
                                Cluster
                            </div>
                            <Dropdown
                                style={{zIndex: 9999}}
                                disabled={this.state.loading}
                                selectOnBlur={false}
                                value={this.state.currentCluster}
                                clearable={this.state.clusterSelectBoxClearable}
                                disabled={this.state.currentCloudLet === '' || this.state.loading}
                                placeholder={this.state.clusterSelectBoxPlaceholder}
                                selection
                                options={this.state.clusterList}
                                // style={Styles.dropDown}
                                onChange={async (e, {value}) => {
                                    try {
                                        await this.filterByClassification(this.state.currentRegion, this.state.currentCloudLet, value)

                                        setTimeout(() => {
                                            this.setState({
                                                appInstSelectBoxPlaceholder: "Select App Instance",
                                            })
                                        }, 500)
                                    } catch (e) {


                                    }

                                }}
                            />
                        </div>

                        {/*todo:---------------------------*/}
                        {/*todo: App Instance Dropdown      */}
                        {/*todo:---------------------------*/}
                        <div className="page_monitoring_dropdown_box" style={{zIndex: 9999}}>
                            <div className="page_monitoring_dropdown_label">
                                App Inst
                            </div>
                            <Dropdown
                                selectOnBlur={false}
                                style={{zIndex: 9999, minWidth: 290}}
                                disabled={this.state.currentCluster === '' || this.state.loading}
                                clearable={this.state.appInstSelectBoxClearable}
                                loading={this.state.loading}
                                value={this.state.currentAppInst}
                                placeholder='Select App Instance'
                                selection
                                options={this.state.appInstanceListTop5}
                                // style={Styles.dropDown}
                                onChange={async (e, {value}) => {
                                    try {
                                        await this.setState({
                                            currentAppInst: value,
                                        })

                                        await this.filterByClassification(this.state.currentRegion, this.state.currentCloudLet, this.state.currentCluster, value)
                                    } catch (e) {

                                    }

                                }}
                            />
                        </div>

                        {/*todo:---------------------------*/}
                        {/*todo: Time Range Dropdown       */}
                        {/*todo:---------------------------*/}
                        <div className="page_monitoring_dropdown_box" style={{zIndex: 9999}}>
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

                                    try {
                                        let stateTime = date[0].format('YYYY-MM-DD HH:mm')
                                        let endTime = date[1].format('YYYY-MM-DD HH:mm')
                                        await this.setState({
                                            startTime: stateTime,
                                            endTime: endTime,
                                        })
                                        this.filterUsageListByDate()
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
                                // style={{width: 300}}
                            />
                        </div>
                    </div>
                </div>

            )
        }


        //@todo:-----------------------
        //@todo:    CPU,MEM,DISK TAB
        //@todo:-----------------------
        CPU_MEM_DISK_CONN_TABS = [

            {
                menuItem: 'CPU', render: () => {
                    return (
                        <Pane>
                            {this.renderChartTabArea(HARDWARE_TYPE.CPU)}
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'MEM', render: () => {
                    return (
                        <Pane>
                            {this.renderChartTabArea(HARDWARE_TYPE.MEM)}
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'DISK', render: () => {
                    return (
                        <Pane>
                            {this.renderChartTabArea(HARDWARE_TYPE.DISK)}
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'CONNECTIONS', render: () => {
                    return (
                        <Pane>

                            <Tabs selectedIndex={this.state.connectionsTabIndex}
                                  className='page_monitoring_tab'>
                                <TabPanel>
                                    {this.renderMultiChartArea(HARDWARE_TYPE.ACTIVE_CONNECTION)}
                                </TabPanel>
                                <TabPanel>
                                    {this.renderMultiChartArea(HARDWARE_TYPE.HANDLED_CONNECTION)}
                                </TabPanel>
                                <TabPanel>
                                    {this.renderMultiChartArea(HARDWARE_TYPE.ACCEPTS_CONNECTION)}
                                </TabPanel>
                            </Tabs>


                        </Pane>
                    )
                }
            },
        ]

        getHeight = () => {
            return window.innerHeight - 133
        }

        render() {
            // todo: Components showing when the loading of graph data is not completed.
            if (!this.state.isAppInstaceDataReady) {
                return (
                    renderLoaderArea(this)
                )
            }


            return (

                <Grid.Row className='view_contents'>
                    <SemanticToastContainer position={"top-right"}/>
                    <Grid.Column className='contents_body'>
                        {/*todo:---------------------------------*/}
                        {/*todo:Content Header                   */}
                        {/*todo:---------------------------------*/}
                        {this.renderHeader()}
                        <Grid.Row className='site_content_body'>
                            {this.state.showGridLoader && <div style={{position: 'absolute', top: '37%', left: '48%', zIndex: 999999999999}}>
                                <div style={{marginLeft: -120, display: 'flex', flexDirection: 'row'}}>
                                    {renderGridLoader2(150, 150)}
                                </div>
                            </div>}
                            <Grid.Column>
                                <div className="table-no-resized">

                                    <div className={isIOS ? 'page_monitoring page_isIOS' : 'page_monitoring'} style={{height: this.getHeight()}}>
                                        {/*todo:---------------------------------*/}
                                        {/*todo:SELECTBOX_ROW        */}
                                        {/*todo:---------------------------------*/}
                                        {this.renderDropdowns()}

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

                                                        {!this.state.isAppInstaceDataReady ? renderPlaceHolderCircular() : renderSixGridForAppInstOnCloudlet(this.state.appInstanceListGroupByCloudlet, this)}
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
                                                        panes={this.CPU_MEM_DISK_CONN_TABS}
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

                                                                await handleBubbleChartDropDown(this, value);

                                                            }}
                                                            value={this.state.currentHardwareType}
                                                        />
                                                    </div>
                                                    {/*todo:---------------------------------*/}
                                                    {/*todo: RENDER BUBBLE          */}
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
                                                            {this.renderMultiChartArea(HARDWARE_TYPE.RECVBYTES)}
                                                        </TabPanel>
                                                        <TabPanel>
                                                            {this.renderMultiChartArea(HARDWARE_TYPE.SENDBYTES)}
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
                                                        {/* <div className=''>
                                                            {this.state.filteredGridInstanceList.length && this.state.isReady === 0 ?
                                                                <div style={PageMonitoringStyles.noData}>
                                                                    NO DATA
                                                                </div>
                                                                : renderBottomGridArea(this)}
                                                        </div>*/}
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


