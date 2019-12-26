import 'react-hot-loader'
import React from 'react';
import {Button, Header, Image, Modal} from 'semantic-ui-react'
import FlexBox from "flexbox-react";
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {hot} from "react-hot-loader/root";
import {Dropdown, Grid,} from "semantic-ui-react";
import {DatePicker, notification} from 'antd';
import * as reducer from "../utils";
import {formatDate, getTodayDate} from "../utils";
import {
    fetchAppInstanceList,
    filterAppInstanceListByCloudLet,
    filterAppInstanceListByClusterInst,
    filterAppInstanceListByRegion,
    filterAppInstOnCloudlet,
    filterCpuOrMemUsageByCloudLet,
    filterCpuOrMemUsageByCluster,
    filterCpuOrMemUsageListByRegion,
    filterInstanceCountOnCloutLetOne,
    makeCloudletListSelectBox,
    makeClusterListSelectBox, makeCpuOrMemUsageListPerInstance, renderBarGraphForCpuMem,
    renderBubbleChart,
    renderInstanceOnCloudletGrid, renderLineChart,
    renderPieChart2AndAppStatus,
    renderPlaceHolder,
    renderPlaceHolder2
} from "../services/PageMonitoringService";
import {HARDWARE_TYPE, RECENT_DATA_LIMIT_COUNT, REGIONS_OPTIONS} from "../shared/Constants";
import Lottie from "react-lottie";
import type {TypeAppInstance} from "../shared/Types";
import MaterialIcon from "material-icons-react";
import CircularProgress from "../chartGauge/circularProgress";
import {cutArrayList} from "../services/SharedService";
//import './PageMonitoring.css';
const FA = require('react-fontawesome')
const {Column, Row} = Grid;

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
    cloudLetSelectBoxPlaceholder: string,
    clusterSelectBoxPlaceholder: string,
    currentCloudLet: string,
    isReady: boolean,
    isModalOpened: false,
    appInstaceListForSelectBoxForCpu: Array,
    appInstaceListForSelectBoxForMem: Array,


}


export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageMonitoring2 extends React.Component<Props, State> {
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
            startDate: '',
            endDate: '',
            clusterList: [],
            filteredCpuUsageList: [],
            filteredMemUsageList: [],
            isReady: false,
            counter: 0,
            appInstanceList: [],
            allAppInstanceList: [],
            appInstanceOne: {},
            currentRegion: '',
            allCpuUsageList: [],
            allMemUsageList: [],
            cloudLetSelectBoxPlaceholder: 'Select CloudLet',
            clusterSelectBoxPlaceholder: 'Select Cluster',
            currentCloudLet: '',
            isModalOpened: false,
            appInstaceListForSelectBoxForCpu: [],
            appInstaceListForSelectBoxForMem: []
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
            this.getInitData();
        }


        async getInitData() {
            this.intervalHandle = setInterval(this.tick.bind(this), 1000);
            this.setState({
                loading: true,
                loading0: true,
                startDate: getTodayDate(),
                endDate: getTodayDate(),
                isReady: false,
            })
            //todo: REALDATA
            //let appInstanceList: Array<TypeAppInstance> = await fetchAppInstanceList();

            //todo: FAKEJSON FOR TEST
            let appInstanceList: Array<TypeAppInstance> = require('../TEMP_KYUNGJOOON_FOR_TEST/appInstanceList')
            appInstanceList.map(async (item: TypeAppInstance, index) => {
                if (index === 0) {
                    await this.setState({appInstanceOne: item,});
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
                  makeCpuOrMemUsageListPerInstance(appInstanceList, HARDWARE_TYPE.CPU, RECENT_DATA_LIMIT_COUNT),
                  makeCpuOrMemUsageListPerInstance(appInstanceList, HARDWARE_TYPE.MEM, RECENT_DATA_LIMIT_COUNT),
              ])
              let cpuUsageListPerOneInstance = usageList[0]
              let memUsageListPerOneInstance = usageList[1]
              console.log('_result===>', usageList);
            */

            //todo: ################################################################
            //todo: (last 100 datas) - Fake JSON FOR TEST
            //todo: ################################################################
            let usageList = require('../jsons/allUsageList_50')
            let cpuUsageListPerOneInstance = require('../jsons/cpuUsage_100Count')
            let memUsageListPerOneInstance = require('../jsons/memUsage_100Count')

            let clusterInstanceGroupList = reducer.groupBy(appInstanceList, 'ClusterInst')
            let cloudletList = this.makeSelectBoxList(appInstanceListGroupByCloudlet, "Cloudlet")
            let clusterList = this.makeSelectBoxList(clusterInstanceGroupList, "ClusterInst")


            await this.setState({
                usageListCPU: usageList[0],
                usageListMEM: usageList[1],
                usageListDISK: usageList[2],
                usageListNETWORK: usageList[3],
                allCpuUsageList: cpuUsageListPerOneInstance,
                allMemUsageList: memUsageListPerOneInstance,
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
            notification.success({
                duration: 1.5,
                message: 'Data loading complete!'
            })
        }

        componentWillUnmount() {
            clearInterval(this.intervalHandle)
        }


        renderHeader = () => {
            return (
                <FlexBox className='' style={{}}>
                    <Grid.Column className=''
                                 style={{lineHeight: '36px', fontSize: 30}}>Monitoring</Grid.Column>
                    <div style={{marginLeft: '10px'}}>
                        <button className="ui circular icon button"><i aria-hidden="true"
                                                                       className="info icon"></i></button>
                    </div>
                    <div className='page_monitoring_select_row' style={{}}>
                        <div className='page_monitoring_select_area' style={{marginLeft: 200,}}>
                            <div style={{
                                display: 'flex',
                                width: 129,
                                //backgroundColor: 'red',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 5,

                            }}>
                                <FA name="list" style={{fontSize: 30,}} onClick={() => {
                                    this.setState({
                                        isModalOpened: !this.state.isModalOpened
                                    })
                                }}/>
                                <div style={{
                                    display: 'flex',
                                    width: 129,
                                    //backgroundColor: 'red',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 5,

                                }}>
                                    <FA name="refresh" style={{fontSize: 30,}} onClick={async () => {
                                        //alert('refresh refresh!!!!!')
                                        notification.success({
                                            message: 'refresh'
                                        })
                                        await this.getInitData();
                                    }}/>
                                </div>


                            </div>
                            {/*todo:REGION selectbox*/}
                            {/*todo:REGION selectbox*/}
                            {/*todo:REGION selectbox*/}
                            <Dropdown
                                placeholder='REGION'
                                selection
                                options={REGIONS_OPTIONS}
                                defaultValue={REGIONS_OPTIONS[0].value}
                                onChange={async (e, {value}) => {
                                    await this.handleSelectBoxChanges(value)
                                }}
                                style={{width: 250}}
                            />

                            {/*todo:CloudLet selectbox*/}
                            {/*todo:CloudLet selectbox*/}
                            {/*todo:CloudLet selectbox*/}
                            <Dropdown
                                loading={this.props.isLoading}
                                placeholder={this.state.cloudLetSelectBoxPlaceholder}
                                selection={true}
                                options={this.state.cloudletList}
                                style={{width: 250}}
                                onChange={async (e, {value}) => {


                                    await this.handleSelectBoxChanges(this.state.currentRegion, value)
                                }}
                            />


                            {/*todo:Cluster selectbox*/}
                            {/*todo:Cluster selectbox*/}
                            {/*todo:Cluster selectbox*/}
                            <Dropdown
                                loading={this.props.isLoading}
                                placeholder={this.state.clusterSelectBoxPlaceholder}
                                selection
                                options={this.state.clusterList}
                                style={{width: 250}}
                                onChange={async (e, {value}) => {


                                    await this.handleSelectBoxChanges(this.state.currentRegion, this.state.currentCloudLet, value)
                                }}
                            />

                            {/*todo:DatePicker selectbox*/}
                            {/*todo:DatePicker selectbox*/}
                            {/*todo:DatePicker selectbox*/}
                            <div className='page_monitoring_datepicker_area'>
                                <DatePicker
                                    onChange={(date) => {
                                        let __date = formatDate(date);
                                        this.setState({
                                            date: __date,
                                        })
                                    }}
                                    placeholder="Start Date"
                                    style={{cursor: 'pointer'}}

                                />
                                <div style={{fontSize: 25, marginLeft: 3, marginRight: 3,}}>
                                    -
                                </div>
                                <DatePicker
                                    onChange={(date) => {
                                        let __date = formatDate(date);
                                        this.setState({
                                            date: __date,
                                        })
                                    }}
                                    placeholder="End Date"
                                    style={{cursor: 'pointer'}}

                                />
                            </div>

                        </div>
                    </div>
                </FlexBox>
            )
        }


        setAppInstanceOne(paramAppName: string) {
            //alert()

            // this.props.toggleLoading(true);
            paramAppName = paramAppName.replace("...", "");

            let appInstanceOne: TypeAppInstance = '';
            this.state.appInstanceList.map((item: TypeAppInstance) => {
                if (item.AppName.includes(paramAppName)) {
                    appInstanceOne = item;
                    console.log('item_AppName===>', item.AppName);
                }


            })
            this.setState({
                appInstanceOne: appInstanceOne,
            }, () => {
                /* setTimeout(() => {
                     this.props.toggleLoading(false);
                 }, 250)*/
            })

            //alert(appInstanceOne.AppName)

        }

        renderAppInstanceGrid() {
            return (
                <div style={{marginTop: 10}}>
                    <Grid columns={7} padded={true}>
                        {/*todo:ROW HEADER*/}
                        {/*todo:ROW HEADER*/}
                        {/*todo:ROW HEADER*/}
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
                        {!this.state.isReady && <Row columns={1}>
                            <Column style={{justifyContent: "center", alignItems: 'center', alignSelf: 'center'}}>
                                <CircularProgress style={{color: '#77BD25', justifyContent: "center", alignItems: 'center'}}/>
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
                                        {this.state.usageListCPU[index].sumCpuUsage.toFixed(2) + "%"}
                                    </Column>
                                    <Column>
                                        {this.state.usageListMEM[index].sumMemUsage.toFixed(0) + ' Byte'}
                                    </Column>
                                    <Column>
                                        {this.state.usageListNETWORK[index].sumRecvBytes}
                                    </Column>
                                    <Column>
                                        {this.state.usageListNETWORK[index].sumSendBytes}
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
            )
        }


        /**
         * @todo: 셀렉트박스 Region, CloudLet, Cluster을 변경할때 처리되는 프로세스..
         * @todo: Process to be processed when changing select box Region, CloudLet, Cluster
         */
        async handleSelectBoxChanges(pRegion: string = '', pCloudLet: string = '', pCluster: string = '') {
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
            //todo:  flitering By pRegion
            //todo: ##########################################
            appInstanceList = filterAppInstanceListByRegion(pRegion, appInstanceList);
            let cloudletSelectBoxList = makeCloudletListSelectBox(appInstanceList)
            //todo: 클라우드렛 별로 인스턴스를 GroupBy..
            let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, 'Cloudlet');
            //todo:리전별로 필터링된 CPU/MEM UsageList(전체 리스트로 부터 필터링처리)
            let filteredCpuUsageList = filterCpuOrMemUsageListByRegion(pRegion, this.state.allCpuUsageList);
            let filteredMemUsageList = filterCpuOrMemUsageListByRegion(pRegion, this.state.allMemUsageList);


            //todo: ##########################################
            //todo: flitering  By pCloudLet
            //todo: ##########################################
            let clusterSelectBoxList = [];
            if (pCloudLet !== '') {
                appInstanceListGroupByCloudlet = filterInstanceCountOnCloutLetOne(appInstanceListGroupByCloudlet, pCloudLet)
                appInstanceList = filterAppInstanceListByCloudLet(appInstanceList, pCloudLet);
                filteredCpuUsageList = filterCpuOrMemUsageByCloudLet(filteredCpuUsageList, pCloudLet);
                filteredMemUsageList = filterCpuOrMemUsageByCloudLet(filteredMemUsageList, pCloudLet);
                clusterSelectBoxList = makeClusterListSelectBox(appInstanceList, pCloudLet)


            }

            //todo: ##########################################
            //todo: flitering By pCluster
            //todo: ##########################################
            if (pCluster !== '') {
                //todo:LeftTop의 클라우듯렛웨에 올라가는 인스턴스 리스트를 필터링 처리하는 로직.
                appInstanceListGroupByCloudlet[0] = filterAppInstOnCloudlet(appInstanceListGroupByCloudlet[0], pCluster)
                //todo:app instalce list를 필터링
                appInstanceList = filterAppInstanceListByClusterInst(appInstanceList, pCluster);
                filteredCpuUsageList = filterCpuOrMemUsageByCluster(filteredCpuUsageList, pCluster);
                filteredMemUsageList = filterCpuOrMemUsageByCluster(filteredMemUsageList, pCluster);

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
            }, async () => {

                //TODO: TOP 5 CPU/MEM USAGE SELECTBOX
                //TODO: TOP 5 CPU/MEM USAGE SELECTBOX
                //TODO: TOP 5 CPU/MEM USAGE SELECTBOX
                let appInstaceListForSelectBoxForCpu = this.makeSelectBoxList2(cutArrayList(5, this.state.filteredCpuUsageList), "AppName")
                let appInstaceListForSelectBoxForMem = this.makeSelectBoxList2(cutArrayList(5, this.state.filteredMemUsageList), "AppName")
                await this.setState({
                    appInstaceListForSelectBoxForCpu: appInstaceListForSelectBoxForCpu,
                    appInstaceListForSelectBoxForMem: appInstaceListForSelectBoxForMem,
                });

                setTimeout(() => {
                    this.setState({
                        cloudLetSelectBoxPlaceholder: 'Select CloudLet',
                        clusterSelectBoxPlaceholder: 'Select Cluster',
                    })
                }, 700)
                this.props.toggleLoading(false)
            })

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
                                                        {!this.state.isAppInstaceDataReady ? renderPlaceHolder() : renderInstanceOnCloudletGrid(this.state.appInstanceListGroupByCloudlet)}
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


                                                        <Dropdown
                                                            placeholder='Select App Instance'
                                                            selection
                                                            options={this.state.appInstaceListForSelectBoxForCpu}
                                                            style={{width: 250}}
                                                        />
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


                                            {/*_____row______2*/}
                                            {/*_____row______2*/}
                                            {/*_____row______2*/}
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
                                                            {renderPieChart2AndAppStatus(this.state.appInstanceOne, this)}
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
                                                        <div className='page_monitoring_column_kj_select'>
                                                            <Dropdown
                                                                placeholder='Select App Instance'
                                                                selection
                                                                options={this.state.appInstaceListForSelectBoxForMem}
                                                                style={{width: 250}}
                                                            />
                                                        </div>
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
