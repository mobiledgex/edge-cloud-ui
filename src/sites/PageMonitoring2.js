import 'react-hot-loader'
import {SemanticToastContainer, toast} from 'react-semantic-toasts';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {Button, Dropdown, Grid, Modal} from 'semantic-ui-react'
import FlexBox from "flexbox-react";
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {hot} from "react-hot-loader/root";
import {DatePicker, TimePicker,} from 'antd';
import * as reducer from "../utils";
import {
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
    makeClusterListSelectBox, renderBarGraph002,
    renderBarGraphForCpuMem,
    renderBubbleChart,
    renderInstanceOnCloudletGrid,
    renderLineChart,
    renderPieChart2AndAppStatus,
    renderPlaceHolder,
    renderPlaceHolder2
} from "../services/PageMonitoringService";
import {HARDWARE_TYPE, REGIONS_OPTIONS} from "../shared/Constants";
import Lottie from "react-lottie";
import type {TypeAppInstance, TypeUtilization} from "../shared/Types";
import {cutArrayList} from "../services/SharedService";
import CircularProgress from "@material-ui/core/CircularProgress";
import './PageMonitoring.css';
import moment from "moment";

const FA = require('react-fontawesome')
const {Column, Row} = Grid;
const {MonthPicker, RangePicker, WeekPicker} = DatePicker;
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
    isShowUtilizationArea: boolean
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
            let appInstanceList: Array<TypeAppInstance> = require('../TEMP_KYUNGJOOON_FOR_TEST/appInstanceList')
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
            /*
            let usageList = await Promise.all([
                 makeHardwareUsageListPerInstance(appInstanceList, HARDWARE_TYPE.CPU, RECENT_DATA_LIMIT_COUNT),
                 makeHardwareUsageListPerInstance(appInstanceList, HARDWARE_TYPE.MEM, RECENT_DATA_LIMIT_COUNT),
                 makeHardwareUsageListPerInstance(appInstanceList, HARDWARE_TYPE.NETWORK, RECENT_DATA_LIMIT_COUNT),
                 makeHardwareUsageListPerInstance(appInstanceList, HARDWARE_TYPE.DISK, RECENT_DATA_LIMIT_COUNT),
             ])
             let cpuUsageListPerOneInstance = usageList[0]
             let memUsageListPerOneInstance = usageList[1]
             console.log('_result===>', usageList);*/

            //todo: ################################################################
            //todo: (last 100 datas) - Fake JSON FOR TEST
            //todo: ################################################################
            let usageList = require('../jsons/allUsageList_50')
            let cpuUsageListPerOneInstance = require('../jsons/cpuUsage_100Count')
            let memUsageListPerOneInstance = require('../jsons/memUsage_100Count')


            //todo: MAKE SELECTBOX.
            let clusterInstanceGroupList = reducer.groupBy(appInstanceList, 'ClusterInst')
            let cloudletList = this.makeSelectBoxList(appInstanceListGroupByCloudlet, "Cloudlet")
            let clusterList = this.makeSelectBoxList(clusterInstanceGroupList, "ClusterInst")


            await this.setState({
                allCpuUsageList: usageList[0],
                allMemUsageList: usageList[1],
                allDiskUsageList: usageList[2],
                allNetworkUsageList: usageList[3],
                cloudletList: cloudletList,
                clusterList: clusterList,
                filteredCpuUsageList: cpuUsageListPerOneInstance,
                filteredMemUsageList: memUsageListPerOneInstance,
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

        async resetAllData() {
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
                                width: 145,
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
                                        width: 150,
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

                                    <Button style={{backgroundColor: 'white'}} onClick={async () => {

                                        this.resetAllData();

                                    }}>
                                        Reset All

                                    </Button>
                                </div>


                            </div>
                            {/*todo:REGION Dropdown*/}
                            {/*todo:REGION Dropdown*/}
                            {/*todo:REGION Dropdown*/}
                            <div style={{color: 'white', backgroundColor:'#393939', height:39, alignItems:'center', alignSelf:'center', justifyContent:'center', display:'flex', marginTop:-8, width:100}}>
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
                            <div style={{color: 'white', backgroundColor:'#393939', height:39, alignItems:'center', alignSelf:'center', justifyContent:'center', display:'flex', marginTop:-8, width:100}}>
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
                            <div style={{color: 'white', backgroundColor:'#393939', height:39, alignItems:'center', alignSelf:'center', justifyContent:'center', display:'flex', marginTop:-8, width:100}}>
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


                            {/*todo:RangePicker*/}
                            {/*todo:RangePicker*/}
                            {/*todo:RangePicker*/}
                            <div style={{color: 'white', backgroundColor:'#393939', height:39, alignItems:'center', alignSelf:'center', justifyContent:'center', display:'flex', marginTop:-8, width:100}}>
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

        renderAppInstanceGrid() {
            return (
                <div>
                    <Grid columns={7} padded={true} style={{height: 50}}>
                        <Row>
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
                    <div className='grid00001'>
                        <Grid columns={7} padded={true}>
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
                                    <Row onClick={() => {
                                        //this.props.history.push('PageMonitoringDetail')
                                    }}>
                                        <Column>
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


        render() {
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
                        {/*todo:####################*/}
                        {/*todo:Content Header part      */}
                        {/*todo:####################*/}
                        {this.renderHeader()}

                        <Grid.Row className='site_content_body' style={{marginTop: 0}}>
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
                                            <div className='page_monitoring_row'>
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                <div className='page_monitoring_column_kj'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Status of Launched App Instances on Cloudlet
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {!this.state.isAppInstaceDataReady ? renderPlaceHolder() : renderInstanceOnCloudletGrid(this.state.appInstanceListGroupByCloudlet, this)}
                                                    </div>
                                                </div>
                                                {/* cpu___col___2*/}
                                                {/* cpu___col___2*/}
                                                {/* cpu___col___2*/}
                                                <div className='page_monitoring_column_kj'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Top 5 of CPU Usage
                                                        </div>
                                                        {/*todo:APPINSTANCE selectbox*/}
                                                        {/*todo:APPINSTANCE selectbox*/}
                                                        {/*todo:APPINSTANCE selectbox*/}
                                                        <div>
                                                            <Dropdown
                                                                clearable={this.state.appInstSelectBoxClearable}
                                                                value={this.state.currentAppInst}
                                                                placeholder='Select App Instance'
                                                                selection
                                                                options={this.state.appInstaceListForSelectBoxForCpu}
                                                                style={{width: 250}}
                                                                onChange={async (e, {value}) => {

                                                                    await this.setState({
                                                                        currentAppInst: value,
                                                                    })
                                                                    await this.handleSelectBoxChanges(this.state.currentRegion, this.state.currentCloudLet, this.state.currentCluster, value)
                                                                }}

                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {!this.state.isReady ? renderPlaceHolder() : renderBarGraphForCpuMem(this.state.filteredCpuUsageList, HARDWARE_TYPE.CPU)}
                                                    </div>
                                                </div>
                                                {/* cpu___col___3*/}
                                                {/* cpu___col___3*/}
                                                {/* cpu___col___3*/}
                                                <div className='page_monitoring_column_kj'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Transition Of CPU Usage
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {!this.state.isReady ? renderPlaceHolder() : renderLineChart(this.state.filteredCpuUsageList, HARDWARE_TYPE.CPU)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='page_monitoring_row'>

                                                {/* ___col___4*/}
                                                {/* ___col___4*/}
                                                {/* ___col___4*/}
                                                <div className='page_monitoring_column_kj'>
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
                                                        <div style={{marginRight: 10,}}>
                                                            {/*todo:#########################################****/}
                                                            {/*todo: RENDER Donut Chart N App Status          */}
                                                            {/*todo:#########################################****/}
                                                            {/* {!this.state.isShowUtilizationArea ?
                                                                <FlexBox
                                                                    style={{
                                                                        backgroundColor: 'black',
                                                                        width: 180,
                                                                        height: 320,
                                                                        alignItem: 'center',
                                                                        alignSelf: "center",
                                                                        justifyContent: "center"
                                                                    }}>
                                                                    {this.state.loading777 ?
                                                                        <Lottie
                                                                            options={{
                                                                                loop: true,
                                                                                autoplay: true,
                                                                                animationData: require('../lotties/loading-animation001'),
                                                                                rendererSettings: {
                                                                                    preserveAspectRatio: 'xMidYMid slice'
                                                                                }
                                                                            }}
                                                                            height={120}
                                                                            width={130}
                                                                            isStopped={false}
                                                                            isPaused={false}
                                                                            style={{marginTop: 80}}
                                                                        />
                                                                        : <div></div>}
                                                                </FlexBox>

                                                                : renderPieChart2AndAppStatus(this.state.appInstanceOne, this)}*/}
                                                        </div>
                                                    </FlexBox>

                                                </div>
                                                {/* mem___col___5*/}
                                                {/* mem___col___5*/}
                                                {/* mem___col___5 */}
                                                <div className='page_monitoring_column_kj'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Top 5 of MEM Usage
                                                        </div>
                                                        {/* <div className='page_monitoring_column_kj_select'>
                                                            <Dropdown
                                                                placeholder='Select App Instance'
                                                                selection
                                                                options={this.state.appInstaceListForSelectBoxForMem}
                                                                style={{width: 250}}
                                                                onChange={async (e, {value}) => {
                                                                    await this.handleSelectBoxChanges(this.state.currentRegion, this.state.currentCloudLet, this.state.currentCluster, value)
                                                                }}
                                                            />
                                                        </div>*/}
                                                    </div>

                                                    <div className='page_monitoring_container'>
                                                        {!this.state.isReady ? renderPlaceHolder() : renderBarGraphForCpuMem(this.state.filteredMemUsageList, HARDWARE_TYPE.MEM)}
                                                    </div>

                                                </div>
                                                {/* mem___col___6*/}
                                                {/* mem___col___6*/}
                                                {/* mem___col___6*/}
                                                <div className='page_monitoring_column_kj'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Transition Of Mem Usage
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {!this.state.isReady ? renderPlaceHolder() : renderLineChart(this.state.filteredMemUsageList, HARDWARE_TYPE.MEM)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='page_monitoring_row'>
                                                <div className='page_monitoring_column_for_grid'>
                                                    {this.renderAppInstanceGrid()}
                                                </div>
                                            </div>
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
