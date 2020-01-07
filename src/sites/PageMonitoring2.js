import 'react-hot-loader'
import {SemanticToastContainer, toast} from 'react-semantic-toasts';
import OutsideClickHandler from 'react-outside-click-handler';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {Button, Dropdown, Grid, Modal, Tab} from 'semantic-ui-react'
import FlexBox from "flexbox-react";
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {hot} from "react-hot-loader/root";
import {DatePicker,} from 'antd';
import * as reducer from "../utils";
import {
    fetchAppInstanceList,
    filterAppInstanceListByCloudLet,
    filterAppInstanceListByClusterInst,
    filterAppInstanceListByRegion,
    filterAppInstOnCloudlet,
    filterCpuOrMemUsageByAppInst,
    filterCpuOrMemUsageByCloudLet,
    filterCpuOrMemUsageByCluster,
    filterCpuOrMemUsageListByRegion,
    filterInstanceCountOnCloutLetOne,
    getMetricsUtilizationAtAppLevel,
    makeCloudletListSelectBox,
    makeClusterListSelectBox,
    renderBarGraph,
    renderBubbleChart,
    renderInstanceOnCloudletGrid,
    renderLineChart,
    renderPlaceHolder,
    renderPlaceHolder2
} from "../services/PageMonitoringService";
import {HARDWARE_TYPE, REGIONS_OPTIONS} from "../shared/Constants";
import Lottie from "react-lottie";
import type {TypeAppInstance, TypeUtilization} from "../shared/Types";
import {cutArrayList} from "../services/SharedService";
import CircularProgress from "@material-ui/core/CircularProgress";
import './PageMonitoring.css';
import '../css/pages/monitoring.css';
import moment from "moment";
import ToggleDisplay from 'react-toggle-display';
import {ComposableMap, Geographies, Geography, Graticule, ZoomableGroup} from "react-simple-maps";
const FA = require('react-fontawesome')
const {MonthPicker, RangePicker, WeekPicker} = DatePicker;
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
    startDate: string,
    endDate: string,
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
    appInstaceListForSelectBoxForCpu: Array,
    appInstaceListForSelectBoxForMem: Array,
    startDate: string,
    endDate: string,
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
}


export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageMonitoring2 extends Component<Props, State> {
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
            //@todo: selectbox 초기값
            currentRegion: 'ALL',
            currentCloudLet: '',
            currentCluster: '',
            currentAppInst: '',
            isModalOpened: false,
            appInstaceListForSelectBoxForCpu: [],
            appInstaceListForSelectBoxForMem: [],
            startDate: '',
            endDate: '',
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
        };

        intervalHandle = null;

        constructor(props) {
            super(props);

        }

        tick() {
            let _counter = this.state.counter;
            _counter = _counter + 1;
            this.setState({
                counter: _counter
            })
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


        /*asdkflsdkflkasdlfksaldkf
        sadflkslflaskd
        saldkflsakflksadlfkasldflaskfd*/


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

        componentDidMount = async () => {
            this.loadInitData();
        }

        async loadInitData() {
            this.intervalHandle = setInterval(this.tick.bind(this), 1000);
            this.setState({
                loading: true,
                loading0: true,
                isReady: false,
            })
            //todo: REALDATA
            //let appInstanceList: Array<TypeAppInstance> = await fetchAppInstanceList();

            //todo: FAKEJSON FOR TEST
            let appInstanceList: Array<TypeAppInstance> = require('../TEMP_KYUNGJOOON_FOR_TEST/Json/appInstanceList')
            appInstanceList.map(async (item: TypeAppInstance, index) => {
                if (index === 0) {
                    await this.setState({
                        appInstanceOne: {
                            "Region": "",
                            "OrganizationName": "",
                            "AppName": "",
                            "Version": "",
                            "Operator": "",
                            "Cloudlet": "",
                            "ClusterInst": "",
                            "CloudletLocation": {
                                "latitude": 0,
                                "longitude": 0,
                            },
                            "URI": "",
                            "Liveness": "",
                            "Mapped_port": "",
                            "Flavor": "",
                            "State": 0,
                            "Error": "",
                            "Runtime": "",
                            "Created": "",
                            "Progress": "",
                            "Edit": "",
                            "Status": "",
                            "Revision": 0,
                        },
                    });
                }
            })


            let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, 'Cloudlet');
            await this.setState({
                appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
                appInstanceList: appInstanceList,
                allAppInstanceList: appInstanceList,
            })
            await this.setState({
                isAppInstaceDataReady: true,
            })

            //todo: ####################################################################################
            //todo: 앱인스턴스 리스트를 가지고 MEM,CPU CHART DATA를 가지고 온다. (최근 100개 날짜의 데이터만을 끌어온다)
            //todo: Bring Mem and CPU chart Data with App Instance List. From remote
            //todo: ####################################################################################
            /* let usageList = await Promise.all([
                 makeHardwareUsageListPerInstance(appInstanceList, HARDWARE_TYPE.CPU, RECENT_DATA_LIMIT_COUNT),
                 makeHardwareUsageListPerInstance(appInstanceList, HARDWARE_TYPE.MEM, RECENT_DATA_LIMIT_COUNT),
                 makeHardwareUsageListPerInstance(appInstanceList, HARDWARE_TYPE.NETWORK, RECENT_DATA_LIMIT_COUNT),
                 makeHardwareUsageListPerInstance(appInstanceList, HARDWARE_TYPE.DISK, RECENT_DATA_LIMIT_COUNT),
             ])*/

            //todo: ################################################################
            //todo: (last 100 datas) - Fake JSON FOR TEST
            //let cpuUsageListPerOneInstance = require('../jsons/cpuUsage_100Count')
            //let memUsageListPerOneInstance = require('../jsons/memUsage_100Count')
            //todo: ################################################################
            let usageList = require('../TEMP_KYUNGJOOON_FOR_TEST/Json/allUsageList_50')


            //todo: MAKE SELECTBOX.
            let clusterInstanceGroupList = reducer.groupBy(appInstanceList, 'ClusterInst')
            let cloudletList = this.makeSelectBoxList(appInstanceListGroupByCloudlet, "Cloudlet")
            let clusterList = this.makeSelectBoxList(clusterInstanceGroupList, "ClusterInst")


            await this.setState({
                allCpuUsageList: usageList[0],
                allMemUsageList: usageList[1],
                allDiskUsageList: usageList[2],//diskUsage
                allNetworkUsageList: usageList[3],//networkUsage
                cloudletList: cloudletList,
                clusterList: clusterList,
                filteredCpuUsageList: usageList[0],
                filteredMemUsageList: usageList[1],
                filteredDiskUsageList: usageList[2],
                filteredNetworkUsageList: usageList[3],
            });


            //todo: MAKE TOP5 CPU/MEM USAGE SELECTBOX
            let appInstaceListForSelectBoxForCpu = this.makeSelectBoxList2(cutArrayList(5, this.state.filteredCpuUsageList), "AppName")
            let appInstaceListForSelectBoxForMem = this.makeSelectBoxList2(cutArrayList(5, this.state.filteredMemUsageList), "AppName")
            await this.setState({
                appInstaceListForSelectBoxForCpu: appInstaceListForSelectBoxForCpu,
                appInstaceListForSelectBoxForMem: appInstaceListForSelectBoxForMem,
            });


            await this.setState({
                loading: false,
                loading0: false,
                isReady: true,
            });
            clearInterval(this.intervalHandle)
            this.props.toggleLoading(false);
            /*notification.success({
                duration: 1.5,
                message: 'Data loading complete!'
            })*/

            toast({
                type: 'success',
                //icon: 'smile',
                title: 'Data Loading Complete!',
                //description: 'This is a Semantic UI toast wich waits 5 seconds before closing',
                animation: 'bounce',
                time: 3 * 1000,
                color: 'black',
            });

        }

        /**
         * @todo: 셀렉트박스 Region, CloudLet, Cluster을 변경할때 처리되는 프로세스..
         * @todo: Process to be processed when changing select box Region, CloudLet, Cluster
         */
        async handleSelectBoxChanges(pRegion: string = '', pCloudLet: string = '', pCluster: string = '', pAppInstance: string = '') {

            //alert(this.state.startDate + "--" + this.state.endDate)

            this.props.toggleLoading(true)
            await this.setState({
                loading0: true,
                appInstanceListSortByCloudlet: [],
                currentRegion: pRegion,
                cloudletList: [],
            })

            //todo : fetch data from remote
            //let appInstanceList = await fetchAppInstanceList();

            //todo : fetch data from LOCAL
            let appInstanceList = this.state.allAppInstanceList;

            //todo: ##########################################
            //todo: FLITER By pRegion
            //todo: ##########################################
            appInstanceList = filterAppInstanceListByRegion(pRegion, appInstanceList);
            let cloudletSelectBoxList = makeCloudletListSelectBox(appInstanceList)
            let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, 'Cloudlet');
            let filteredCpuUsageList = filterCpuOrMemUsageListByRegion(pRegion, this.state.allCpuUsageList);
            let filteredMemUsageList = filterCpuOrMemUsageListByRegion(pRegion, this.state.allMemUsageList);


            //todo: ##########################################
            //todo: FLITER  By pCloudLet
            //todo: ##########################################
            let clusterSelectBoxList = [];
            if (pCloudLet !== '') {
                appInstanceListGroupByCloudlet = filterInstanceCountOnCloutLetOne(appInstanceListGroupByCloudlet, pCloudLet)
                appInstanceList = filterAppInstanceListByCloudLet(appInstanceList, pCloudLet);
                clusterSelectBoxList = makeClusterListSelectBox(appInstanceList, pCloudLet)
                filteredCpuUsageList = filterCpuOrMemUsageByCloudLet(filteredCpuUsageList, pCloudLet);
                filteredMemUsageList = filterCpuOrMemUsageByCloudLet(filteredMemUsageList, pCloudLet);

            }

            //todo: ##########################################
            //todo: FLITER By pCluster
            //todo: ##########################################
            if (pCluster !== '') {
                //todo:LeftTop의 Cloudlet위에 올라가는 인스턴스 리스트를 필터링 처리하는 로직.
                appInstanceListGroupByCloudlet[0] = filterAppInstOnCloudlet(appInstanceListGroupByCloudlet[0], pCluster)
                //todo:app instalce list를 필터링
                appInstanceList = filterAppInstanceListByClusterInst(appInstanceList, pCluster);
                filteredCpuUsageList = filterCpuOrMemUsageByCluster(filteredCpuUsageList, pCluster);
                filteredMemUsageList = filterCpuOrMemUsageByCluster(filteredMemUsageList, pCluster);
            }

            //todo: ##########################################
            //todo: FLITER By pAppInstance
            //todo: ##########################################
            if (pAppInstance !== '') {
                //todo:app instalce list를 필터링
                //appInstanceList = filterAppInstanceListByAppInst(appInstanceList, pAppInstance);
                filteredCpuUsageList = filterCpuOrMemUsageByAppInst(filteredCpuUsageList, pAppInstance);
                filteredMemUsageList = filterCpuOrMemUsageByAppInst(filteredMemUsageList, pAppInstance);
            }


            //todo: ##########################################
            //todo: FLITER By startDate, endDate
            //todo: ##########################################
            if (this.state.startDate !== '' && this.state.endDate !== '') {
                //alert(this.state.startDate)
            }


            this.setState({
                filteredCpuUsageList: filteredCpuUsageList,
                filteredMemUsageList: filteredMemUsageList,
                appInstanceList: appInstanceList,
                appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
                loading0: false,
                cloudletList: cloudletSelectBoxList,
                clusterList: clusterSelectBoxList,
                currentCloudLet: pCloudLet,
                currentCluster: pCluster,
            }, async () => {

                //todo: MAKE TOP5 CPU/MEM USAGE SELECTBOX
                if (pAppInstance === '') {
                    let appInstaceListForSelectBoxForCpu = this.makeSelectBoxList2(cutArrayList(5, this.state.filteredCpuUsageList), "AppName")
                    let appInstaceListForSelectBoxForMem = this.makeSelectBoxList2(cutArrayList(5, this.state.filteredMemUsageList), "AppName")
                    await this.setState({
                        appInstaceListForSelectBoxForCpu: appInstaceListForSelectBoxForCpu,
                        appInstaceListForSelectBoxForMem: appInstaceListForSelectBoxForMem,
                    });
                }
                setTimeout(() => {
                    this.setState({
                        cloudLetSelectBoxPlaceholder: 'Select CloudLet',
                        clusterSelectBoxPlaceholder: 'Select Cluster',
                    })
                }, 700)
                this.props.toggleLoading(false)
            })

        }


        componentWillUnmount() {
            clearInterval(this.intervalHandle)
        }

        dropdownCloudlet = null;

        async refreshAllData() {
            toast({
                type: 'success',
                //icon: 'smile',
                title: 'Reset All',
                //description: 'This is a Semantic UI toast wich waits 5 seconds before closing',
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


        renderHeader = () => {
            return (
                <FlexBox className='' style={{alignItem: 'flex-end'}}>
                    <Grid.Column className=''
                                 style={{lineHeight: '36px', fontSize: 30}}>Monitoring</Grid.Column>
                    <div style={{marginLeft: '10px'}}>
                        <button className="ui circular icon button"><i aria-hidden="true"
                                                                       className="info icon"></i></button>
                    </div>

                    {/*{this.state.loading777 &&
                    <CircularProgress
                        style={{color: '#77BD25', justifyContent: "center", alignItems: 'center'}}/>
                    }*/}
                    <div className='page_monitoring_select_row'
                         style={{alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', alignSelf: 'center', marginRight: 300,}}>
                        <div className='page_monitoring_select_area' style={{marginLeft: 0,}}>
                            <div style={{
                                display: 'flex',
                                width: 270,
                                //backgroundColor: 'red',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 5,

                            }}>


                                {/* <FA name="list" style={{fontSize: 30,}} onClick={() => {
                                    this.setState({
                                        isModalOpened: !this.state.isModalOpened
                                    })
                                }}/>*/}
                                <div
                                    style={{
                                        display: 'flex',
                                        width: 270,
                                        //backgroundColor: 'red',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: 5,
                                        color: 'white',
                                        fontSize: 15,
                                        marginLeft: -10,
                                        marginRight: 0,

                                    }}

                                >

                                    <div style={{backgroundColor: 'transparent', width: 50, marginBottom: -3}} onClick={async () => {

                                        this.refreshAllData();

                                    }}>
                                        <FA name="refresh" style={{fontSize: 30}}/>
                                    </div>

                                    <div style={{marginLeft: 10,}}
                                         onClick={async () => {
                                             await this.setState({
                                                 currentGridIndex: -1,
                                                 currentTabIndex: 0,
                                             })
                                             await this.handleSelectBoxChanges('ALL', '', '', '')
                                         }}
                                    >
                                        <div>RESET_ALL</div>
                                    </div>
                                </div>
                            </div>
                            {/*todo:REGION Dropdown*/}
                            {/*todo:REGION Dropdown*/}
                            {/*todo:REGION Dropdown*/}
                            <div style={Styles.selectHeader}>
                                Region
                            </div>
                            <Dropdown
                                clearable={this.state.regionSelectBoxClearable}
                                placeholder='REGION'
                                selection
                                options={REGIONS_OPTIONS}
                                defaultValue={REGIONS_OPTIONS[0].value}
                                onChange={async (e, {value}) => {
                                    await this.handleSelectBoxChanges(value)
                                    setTimeout(() => {
                                        this.setState({
                                            cloudLetSelectBoxPlaceholder: 'Select CloudLet'
                                        })
                                    }, 1000)
                                }}
                                value={this.state.currentRegion}
                                style={{width: 250}}
                            />

                            {/*todo:CloudLet selectbox*/}
                            {/*todo:CloudLet selectbox*/}
                            {/*todo:CloudLet selectbox*/}
                            <div style={Styles.selectHeader}>
                                CloudLet
                            </div>
                            <Dropdown
                                value={this.state.currentCloudLet}
                                clearable={this.state.cloudLetSelectBoxClearable}
                                loading={this.props.isLoading}
                                placeholder={this.state.cloudLetSelectBoxPlaceholder}
                                selection={true}
                                options={this.state.cloudletList}
                                style={{width: 250}}
                                onChange={async (e, {value}) => {


                                    await this.handleSelectBoxChanges(this.state.currentRegion, value)
                                    setTimeout(() => {
                                        this.setState({
                                            clusterSelectBoxPlaceholder: 'Select Cluster'
                                        })
                                    }, 1000)
                                }}
                            />


                            {/*todo:Cluster selectbox*/}
                            {/*todo:Cluster selectbox*/}
                            {/*todo:Cluster selectbox*/}
                            <div style={Styles.selectHeader}>
                                Cluster
                            </div>
                            <Dropdown
                                value={this.state.currentCluster}
                                clearable={this.state.clusterSelectBoxClearable}
                                loading={this.props.isLoading}
                                placeholder={this.state.clusterSelectBoxPlaceholder}
                                selection
                                options={this.state.clusterList}
                                style={{width: 250}}
                                onChange={async (e, {value}) => {
                                    await this.handleSelectBoxChanges(this.state.currentRegion, this.state.currentCloudLet, value)

                                    setTimeout(() => {
                                        this.setState({
                                            appInstSelectBoxPlaceholder: "Select App Instance"
                                        })
                                    }, 1000)
                                }}
                            />

                            {/*todo:TimeRange*/}
                            {/*todo:TimeRange*/}
                            <div style={Styles.selectHeader}>
                                TimeRange
                            </div>
                            <div style={{marginTop: -8}}>
                                <RangePicker
                                    showTime={{format: 'HH:mm'}}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder={['Start Time', 'End Time']}
                                    onChange={async (date, dateString) => {
                                        let startDate = dateString[0]
                                        let endDate = dateString[1]
                                        await this.setState({
                                            startDate: startDate,
                                            endDate: endDate,
                                        })
                                        //await this.handleSelectBoxChanges(this.state.currentRegion, this.state.currentCloudLet, this.state.currentCluster)
                                    }}
                                    ranges={{
                                        Today: [moment(), moment()],
                                        'Last 7 Days': [moment().subtract(7, 'd'), moment().subtract(1, 'd')],
                                        'Last 30 Days': [moment().subtract(30, 'd'), moment().subtract(1, 'd')],
                                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                                        'Last Month': [moment().date(-30), moment().date(-1)],
                                        /* 'Last Month2': [moment().date(-30), moment().date(-1)],
                                         'Last Month3': [moment().date(-30), moment().date(-1)],
                                         'Last Month4': [moment().date(-30), moment().date(-1)],
                                         'Last Month5': [moment().date(-30), moment().date(-1)],
                                         'Last Month6': [moment().date(-30), moment().date(-1)],
                                         'Last Month7': [moment().date(-30), moment().date(-1)],
                                         'Last Month8': [moment().date(-30), moment().date(-1)],
                                         'Last Month9': [moment().date(-30), moment().date(-1)],*/
                                    }}
                                    style={{width: 300}}
                                />
                            </div>

                        </div>
                    </div>
                </FlexBox>
            )
        }


        async setAppInstanceOne(paramAppName: string) {
            this.setState({
                loading777: true,
                isShowUtilizationArea: false,
            })

            // this.props.toggleLoading(true);
            paramAppName = paramAppName.replace("...", "");

            let appInstanceOne: TypeAppInstance = '';
            let currentIndex = 0;
            this.state.appInstanceList.map((item: TypeAppInstance, index) => {
                if (item.AppName.includes(paramAppName)) {
                    appInstanceOne = item;
                    console.log('item_AppName===>', item.AppName);
                    currentIndex = index;
                }


            })
            this.setState({
                appInstanceOne: appInstanceOne,
                currentAppInstaceListIndex: currentIndex,
            }, () => {
                //alert(this.state.currentAppInstaceListIndex)
            });

            /*console.log('appInstanceOne====>', appInstanceOne);
            let operator = appInstanceOne.Operator;
            console.log('operator====>', operator);*/

            let appInstanceUtilizationOne = ''
            try {
                appInstanceUtilizationOne = await getMetricsUtilizationAtAppLevel(appInstanceOne);
                console.log('__rslt__rslt__rslt====>', appInstanceUtilizationOne.data[0].Series[0].columns);
                console.log('__rslt__rslt__rslt====>', appInstanceUtilizationOne.data[0].Series[0].values[0]);
                let appInstanceCurrentUtilization = appInstanceUtilizationOne.data[0].Series[0].values[0]

                await this.setState({
                    loading777: false,
                    currentUtilization: appInstanceCurrentUtilization,
                })
            } catch (e) {
                await this.setState({
                    loading777: false,
                    currentUtilization: {
                        "time": "",
                        "cloudlet": "",
                        "diskMax": 0,
                        "diskUsed": 0,
                        "memMax": 0,
                        "memUsed": 0,
                        "operator": "",
                        "vCpuMax": 0,
                        "vCpuUsed": 0,
                    },
                })
            } finally {
                await this.setState({
                    loading777: false,
                    isShowUtilizationArea: true,
                })
            }


        }

        scrollToBottom() {
            const scrollHeight = this.messageList.scrollHeight;
            const height = this.messageList.clientHeight;
            const maxScrollTop = scrollHeight - height;
            this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        }

        scrollToUp() {
            this.messageList.scrollTo(0, 0);
        }

        renderAppInstanceGrid() {
            return (
                <div>
                    <Grid columns={8} padded={true} style={{height: 50}}>
                        <Row>
                            <Column color={'grey'}>
                                index
                            </Column>
                            <Column color={'grey'}>
                                NAME
                            </Column>
                            <Column color={'grey'}>
                                CPU(%)
                            </Column>
                            <Column color={'grey'}>
                                RSS MEM
                            </Column>
                            <Column color={'grey'}>
                                RecvBytes
                            </Column>
                            <Column color={'grey'}>
                                SendBytes
                            </Column>
                            <Column color={'grey'}>
                                Status
                            </Column>
                            <Column color={'grey'}>
                                Start
                            </Column>
                        </Row>
                    </Grid>
                    <div style={{
                        marginTop: 10,
                        //overflowY: 'scroll',
                        //height: 525,
                    }}
                         ref={(div) => {
                             this.messageList = div;
                         }}
                    >
                        <Grid columns={8} padded={true}

                              style={{
                                  marginTop: 10,
                                  overflowY: 'auto',//@todo: 스크롤 처리 부분...
                                  height: this.state.appInstanceList.length * 35 + 110,
                              }}
                        >
                            {/*todo:ROW HEADER*/}
                            {/*todo:ROW HEADER*/}
                            {/*todo:ROW HEADER*/}
                            {!this.state.isReady && <Row columns={1}>
                                <Column style={{justifyContent: "center", alignItems: 'center', alignSelf: 'center'}}>
                                    <CircularProgress
                                        style={{color: '#77BD25', justifyContent: "center", alignItems: 'center'}}/>
                                </Column>
                            </Row>}
                            {this.state.isReady && this.state.appInstanceList.map((item: TypeAppInstance, index) => {
                                /*   sumCpuUsage: sumCpuUsage,
                                   sumMemUsage: sumMemUsage,
                                   sumDiskUsage: sumDiskUsage,
                                   sumRecvBytes: sumRecvBytes,
                                   sumSendBytes: sumSendBytes,*/

                                return (
                                    <Row

                                        style={{
                                            color: index === this.state.currentGridIndex ? 'white' : 'white',
                                            backgroundColor: index === this.state.currentGridIndex && '#4fd1ff',
                                            height: 50
                                        }}
                                        onClick={async () => {
                                            //alert(item.AppName)
                                            await this.setState({
                                                currentAppInst: item.AppName,
                                                currentGridIndex: index,
                                            })
                                            await this.handleSelectBoxChanges(this.state.currentRegion, this.state.currentCloudLet, this.state.currentCluster, item.AppName)
                                        }}
                                    >
                                        <Column

                                        >
                                            {index}
                                        </Column>
                                        <Column

                                        >
                                            {item.AppName}
                                        </Column>
                                        <Column>
                                            {this.state.allCpuUsageList[index].sumCpuUsage.toFixed(2) + "%"}
                                        </Column>
                                        <Column>
                                            {this.state.allMemUsageList[index].sumMemUsage.toFixed(0) + ' Byte'}
                                        </Column>
                                        <Column>
                                            {this.state.allNetworkUsageList[index].sumRecvBytes}
                                        </Column>
                                        <Column>
                                            {this.state.allNetworkUsageList[index].sumSendBytes}
                                        </Column>
                                        <Column>
                                            Status_NULL
                                        </Column>
                                        <Column>
                                            Start_NULL
                                        </Column>
                                    </Row>

                                )
                            })}
                        </Grid>
                    </div>
                </div>

            )
        }

        /**###############################
         * * MONITORINGTABS
         * * MONITORINGTABS
         * * MONITORINGTABS
         ##################################*/
        MONITORING_TABS = [

            {
                menuItem: 'CPU', render: () => {
                    return (
                        <Pane style={{}}>
                            {this.renderCpuArea()}
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'MEM', render: () => {
                    return (
                        <Pane>
                            {this.renderMemArea()}
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'DISK', render: () => {
                    return (
                        <Pane>
                            {this.renderDiskArea()}
                        </Pane>
                    )
                }
            },


        ]

        renderCpuArea() {
            return (
                <div style={{display: 'flex', flexDirection: 'row', height: 380,}}>

                    {/*1_column*/}
                    {/*1_column*/}
                    {/*1_column*/}
                    <div className='' style={{marginLeft: 5, marginRight: 5}}>
                        <div className='page_monitoring_container'>
                            {renderBarGraph(this.state.filteredCpuUsageList, HARDWARE_TYPE.CPU)}
                        </div>
                    </div>
                    {/*1_column*/}
                    {/*1_column*/}
                    {/*1_column*/}
                    <div className='' style={{marginLeft: 5, marginRight: 5}}>
                        {/*  <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Transition Of CPU Usage
                            </div>
                        </div>*/}
                        <div className='page_monitoring_container'>
                            {renderLineChart(this.state.filteredCpuUsageList, HARDWARE_TYPE.CPU)}
                        </div>
                    </div>
                </div>
            )
        }

        renderMemArea() {
            return (
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    {/*1111111111*/}
                    {/*1111111111*/}
                    {/*1111111111*/}
                    <div className='' style={{marginLeft: 5, marginRight: 5}}>
                        <div className='page_monitoring_container'>
                            {renderBarGraph(this.state.filteredMemUsageList, HARDWARE_TYPE.MEM)}
                        </div>
                    </div>
                    {/*1111111111*/}
                    {/*1111111111*/}
                    {/*1111111111*/}
                    <div className='' style={{marginLeft: 5, marginRight: 5}}>
                        <div className='page_monitoring_container'>
                            {renderLineChart(this.state.filteredMemUsageList, HARDWARE_TYPE.MEM)}
                        </div>
                    </div>

                </div>
            )
        }

        renderDiskArea() {
            return (
                <div style={{display: 'flex', flexDirection: 'row', height: 380,}}>

                    {/*1_column*/}
                    {/*1_column*/}
                    {/*1_column*/}
                    <div className='' style={{marginLeft: 5, marginRight: 5}}>
                        <div className='page_monitoring_container'>
                            {renderBarGraph(this.state.filteredDiskUsageList, HARDWARE_TYPE.DISK)}
                        </div>
                    </div>
                    {/*1_column*/}
                    {/*1_column*/}
                    {/*1_column*/}
                    <div className='' style={{marginLeft: 5, marginRight: 5}}>
                        {/*  <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Transition Of CPU Usage
                            </div>
                        </div>*/}
                        <div className='page_monitoring_container'>
                            {renderLineChart(this.state.filteredDiskUsageList, HARDWARE_TYPE.DISK)}
                        </div>
                    </div>
                </div>
            )
        }


        render() {

            const geoUrl =
                "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

            //todo:####################################################################
            //todo: Components showing when the loading of graph data is not completed.
            //todo:####################################################################
            if (!this.state.isAppInstaceDataReady) {
                return (
                    <Grid.Row className='view_contents'>
                        <Grid.Column className='contents_body'>
                            {this.renderHeader()}
                            <div style={{position: 'absolute', top: '25%', left: '42%'}}>
                                {/*<CircularProgress style={{color: 'red'}}/>*/}
                                <div style={{marginLeft: -120, display: 'flex', flexDirection: 'row'}}>
                                    <Lottie
                                        options={{
                                            loop: true,
                                            autoplay: true,
                                            animationData: require('../lotties/79-animated-graph'),
                                            rendererSettings: {
                                                preserveAspectRatio: 'xMidYMid slice'
                                            }
                                        }}
                                        height={120}
                                        width={120}
                                        isStopped={false}
                                        isPaused={false}
                                    />
                                </div>
                                <div style={{marginLeft: -120, fontSize: 17, color: 'white', marginTop: 20}}>Loading
                                    data now. It takes more
                                    than 25 seconds.
                                </div>
                                <div style={{marginLeft: 55, fontSize: 50, color: 'white', marginTop: 10, height: 150}}>
                                    {this.state.counter}
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }


            return (

                <Grid.Row className='view_contents'>
                    {/*todo:#############################*/}
                    {/*todo: POPUP APP INSTACE LIST DIV  */}
                    {/*todo:#############################*/}

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
                        <Modal.Header>App Instance List</Modal.Header>
                        <Modal.Content>
                            {this.renderAppInstanceGrid()}
                        </Modal.Content>
                    </Modal>
                    <SemanticToastContainer/>
                    <Grid.Column className='contents_body'>
                        {/*todo:Content Header part      */}
                        {this.renderHeader()}

                        <Grid.Row className='site_content_body' style={{marginTop: 0,}}>
                            <Grid.Column>
                                <div className="table-no-resized"
                                     style={{height: '100%', display: 'flex', overflow: 'hidden'}}>

                                    <div className="page_monitoring">
                                        {/*todo:####################*/}
                                        {/*todo:SelectBox part start */}
                                        {/*todo:####################*/}
                                        <div className='page_monitoring_dashboard'>
                                            {/*_____row____1*/}
                                            {/*_____row____1*/}
                                            {/*_____row____1*/}
                                            <div className='page_monitoring_row' style={{opacity: !this.state.isShowBottomGrid ? 1.0 : 0.5}}>
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                <div className='page_monitoring_column_kj002'>
                                                    <div className=''>
                                                        <div className='page_monitoring_title'>
                                                            Status of Launched App Instances on Cloudlet
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container' style={{width: 800}}>
                                                        {!this.state.isAppInstaceDataReady ? renderPlaceHolder() : renderInstanceOnCloudletGrid(this.state.appInstanceListGroupByCloudlet, this)}
                                                    </div>
                                                </div>
                                                <div className='page_monitoring_column_kj003' style={{marginLeft: 0}}>

                                                    {/*todo: RENDER TAB*/}
                                                    {/*todo: RENDER TAB*/}
                                                    {/*todo: RENDER TAB*/}
                                                    <Tab
                                                        //style={{marginTop:-5}}
                                                        panes={this.MONITORING_TABS}
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

                                            <div className='page_monitoring_row'>

                                                {/* ___col___3*/}
                                                {/* ___col___3*/}
                                                {/* ___col___3*/}
                                                <div className='page_monitoring_column_kj002'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Engine Performance State Of App instance
                                                        </div>
                                                    </div>
                                                    {/*todo:###########################***/}
                                                    {/*todo:RENDER BubbleChart          */}
                                                    {/*todo:###########################***/}
                                                    <FlexBox>
                                                        <div>
                                                            {!this.state.isAppInstaceDataReady ? renderPlaceHolder2() : renderBubbleChart(this)}
                                                        </div>
                                                    </FlexBox>

                                                </div>
                                                {/* todo:NETWORK LIST 그리드 부분____4nd_col*/}
                                                {/* todo:NETWORK LIST 그리드 부분____4nd_col*/}
                                                {/* todo:NETWORK LIST 그리드 부분____4nd_col*/}
                                                <div className='page_monitoring_column_kj003'>
                                                    <div style={{flexDirection: 'row', display: 'flex'}}>
                                                        <div style={{fontSize: 20, display: 'flex', alignItems: 'center', marginLeft: 10,}}>
                                                            NETWORK TOP 5 LIST
                                                        </div>

                                                        <div style={{marginLeft: 25,}}>
                                                            <Dropdown
                                                                clearable={this.state.regionSelectBoxClearable}
                                                                placeholder='SELECT OPTIONS'
                                                                selection
                                                                options={[
                                                                    {value: 'RCV_BTYE', text: 'RCV_BTYE'},
                                                                    {value: 'SND_BYTE', text: 'SND_BYTE'},
                                                                    {value: 'TCP', text: 'TCP'},
                                                                    {value: 'UDP', text: 'UDP'},

                                                                ]}
                                                                defaultValue={'RVCV_BTYE'}
                                                                onChange={async (e, {value}) => {
                                                                    /* await this.handleSelectBoxChanges(value)
                                                                     setTimeout(() => {
                                                                         this.setState({
                                                                             cloudLetSelectBoxPlaceholder: 'Select CloudLet'
                                                                         })
                                                                     }, 1000)*/
                                                                }}
                                                                value={'RVCV_BTYE'}
                                                                style={{width: 250}}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_column_for_grid'>
                                                        <div>
                                                            sdlkflsdkflksdf
                                                        </div>
                                                        <div>
                                                            sdlkflsdkflksdf
                                                        </div>
                                                        <div>
                                                            sdlkflsdkflksdf
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>

                                            {/*todo: 하단 그리드 area____toggle Up Button*/}
                                            {/*todo: 하단 그리드 area____toggle Up Button*/}
                                            {/*todo: 하단 그리드 area____toggle Up Button*/}
                                            <p
                                                onClick={() => {
                                                    this.setState({
                                                        isShowBottomGrid: !this.state.isShowBottomGrid,
                                                    })
                                                }}

                                                style={{
                                                    display: 'flex',
                                                    width: '98.0%', backgroundColor: '#2f2f2f', alignItems: 'center',
                                                    justifyContent: 'center',
                                                    alignSelf: 'center',
                                                    height: 30,
                                                    borderRadius: 10,
                                                }}
                                            >
                                                <div style={{color: 'white', backgroundColor: 'transparent'}}>SHOW APP INSTANCE LIST
                                                </div>
                                                <div style={{marginLeft: 15}}>
                                                    <FA name="chevron-up" style={{fontSize: 15, color: 'white'}}/>
                                                </div>
                                            </p>

                                            {/*todo: BOTTOM_GRID_AREA____SHOW_UP__AREA*/}
                                            {/*todo: BOTTOM_GRID_AREA____SHOW_UP__AREA*/}
                                            {/*todo: BOTTOM_GRID_AREA____SHOW_UP__AREA*/}
                                            <ToggleDisplay if={this.state.isShowBottomGrid} tag="section" className='bottomGridArea'>
                                                <OutsideClickHandler
                                                    onOutsideClick={() => {
                                                         this.setState({
                                                             isShowBottomGrid: !this.state.isShowBottomGrid,
                                                         })
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            backgroundColor: '#2f2f2f', opacity: 3.0, borderTopRightRadius: 20, borderTopLeftRadius: 20,
                                                            position: 'absolute', zIndex: 999999, bottom: 50, height: 700, width: '96%', left: 48
                                                        }}
                                                    >
                                                        <p
                                                            style={{display: 'flex', width: '100%', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', marginTop: 20}}
                                                            onClick={() => {

                                                                this.setState({
                                                                    isShowBottomGrid: !this.state.isShowBottomGrid,
                                                                })

                                                            }}


                                                        >
                                                            <div style={{color: 'white'}}>
                                                                HIDE APP INSTANCE LIST
                                                            </div>
                                                            <div style={{marginLeft: 15}}>
                                                                <FA name="chevron-down" style={{fontSize: 15, color: 'white'}}/>
                                                            </div>
                                                        </p>
                                                        {/*todo:renderAppInstanceGrid*/}
                                                        {/*todo:renderAppInstanceGrid*/}
                                                        {/*todo:renderAppInstanceGrid*/}
                                                        <div style={{fontSize: 22, display: 'flex', alignItems: 'center', marginLeft: 10, color: 'white', fontWeight: 'bold'}}>
                                                            App Instance List
                                                        </div>
                                                        <div style={{height: 7}}/>
                                                        <div className='page_monitoring_column_for_grid2'>
                                                            {this.renderAppInstanceGrid()}
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

const Styles = {
    selectHeader: {
        color: 'white',
        backgroundColor: 'transparent',
        height: 39,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        display: 'flex',
        marginTop: -8,
        width: 100
    },

    div001: {
        fontSize: 25,
        color: 'white',
    }
}
