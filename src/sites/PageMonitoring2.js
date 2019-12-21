import 'react-hot-loader'
import React, {Component} from 'react';
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import FlexBox from "flexbox-react";
import {hot} from "react-hot-loader/root";
import Plot from 'react-plotly.js';
import {Dropdown, Grid,} from "semantic-ui-react";
import {DatePicker} from 'antd';
import * as reducer from "../utils";
import {formatDate, getTodayDate} from "../utils";
import './PageMonitoring.css';
import {
    fetchAppInstanceList,
    makeCpuOrMemUsageListPerInstance,
    renderBarGraph_GoogleChart, renderInstanceOnCloudletGrid, renderLineChart_react_chartjs, renderLineChart_recharts,
    renderLineGraph_Plot,
    renderPieChart2_Google,
    renderPlaceHolder
} from "../services/PageMonitoringService";
import {HARDWARE_TYPE} from "../shared/Constants";
import Lottie from "react-lottie";
import animationData from '../lotties/loader003'
import {cutArrayList} from "../services/SharedService";

const {Column, Row} = Grid;


const mapStateToProps = (state) => {
    let viewMode = null;
    let detailData = null;

    if (state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    return {
        computeRefresh: (state.computeRefresh) ? state.computeRefresh : null,
        changeRegion: state.changeRegion.region ? state.changeRegion.region : null,
        viewMode: viewMode, detailData: detailData,
        isLoading: state.LoadingReducer.isLoading,
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => {
            dispatch(actions.changeSite(data))
        },
        handleInjectData: (data) => {
            dispatch(actions.injectData(data))
        },
        handleInjectDeveloper: (data) => {
            dispatch(actions.registDeveloper(data))
        },
        handleComputeRefresh: (data) => {
            dispatch(actions.computeRefresh(data))
        },
        handleLoadingSpinner: (data) => {
            dispatch(actions.loadingSpinner(data))
        },
        handleAlertInfo: (mode, msg) => {
            dispatch(actions.alertInfo(mode, msg))
        },
        handleDetail: (data) => {
            dispatch(actions.changeDetail(data))
        },
        handleAuditCheckCount: (data) => {
            dispatch(actions.setCheckedAudit(data))
        },
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
    cpuUsageList: any,
    cpuUsageList2: any,
    memUsageList: any,

}

let boxWidth = window.innerWidth / 10 * 2.77;

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
            cpuUsageList: [],
            cpuUsageList2: [100, 50, 30, 20, 10],
            isReady: false,
            memUsageList: [],
        };

        constructor(props) {
            super(props);
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


        componentDidMount = async () => {
            this.setState({
                loading: true,
                loading0: true,
                startDate: getTodayDate(),
                endDate: getTodayDate(),
            })

            let appInstanceList = await fetchAppInstanceList();

            console.log('appInstanceList====>', appInstanceList);

            //todo:앱인스턴스 리스트로 Mem,CPU chartData를 가지고 온다.
            //todo:Bring Mem and CPU chart Data with  App Instance List.
            //@todo: 최근 100개 날짜의 데이터만을 끌어온다
            /*let cpuOrMemUsageList = await Promise.all([makeCpuOrMemUsageListPerInstance(appInstanceList, HARDWARE_TYPE.CPU, 100), makeCpuOrMemUsageListPerInstance(appInstanceList, HARDWARE_TYPE.MEM, 100)])
            let cpuUsageList = cpuOrMemUsageList[0]
            let memUsageList = cpuOrMemUsageList[1]
            console.log('_result===>', cpuOrMemUsageList);*/

            //todo: local json for Test(last 100 datas)
            let cpuUsageListPerOneInstance = require('../TEMP_KYUNGJOOON/cpuUsage_100Count')
            let memUsageListPerOneInstance = require('../TEMP_KYUNGJOOON/memUsage_100Count')

            console.log('memUsageList===>', memUsageListPerOneInstance);

            let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, 'Cloudlet');
            let clusterInstanceGroupList = reducer.groupBy(appInstanceList, 'ClusterInst')
            let cloudletList = this.makeSelectBoxList(appInstanceListGroupByCloudlet, "Cloudlet")
            let clusterList = this.makeSelectBoxList(clusterInstanceGroupList, "ClusterInst")
            await this.setState({
                appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
                cloudletList: cloudletList,
                clusterList: clusterList,
                cpuUsageList: cpuUsageListPerOneInstance,
                memUsageList: memUsageListPerOneInstance,
            });
            console.log('clusterList====>', clusterList);

            this.setState({}, () => {
                setTimeout(() => {
                    this.setState({
                        loading: false,
                        loading0: false,
                        isReady: true,
                    })
                }, 350)
            })

        }

        componentWillUnmount() {

        }

        componentWillReceiveProps(nextProps, nextContext) {

        }


        async handleRegionChanges(value) {
            let arrayRegions = [];
            if (value === 'ALL') {
                arrayRegions.push('EU')
                arrayRegions.push('US')
            } else {
                arrayRegions.push(value);
            }

            this.setState({
                loading0: true,
                appInstanceListSortByCloudlet: [],
            })
            let appInstanceList = await fetchAppInstanceList(arrayRegions);
            let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, 'Cloudlet');

            //console.log('appInstanceListGroupByCloudlet====>' , appInstanceListGroupByCloudlet)

            console.log('appInstanceListGroupByCloudlet====>', appInstanceListGroupByCloudlet);

            await this.setState({
                appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
                loading0: false,
            })
        }

        renderHeader() {

            return (
                <Grid.Row className='content_title'
                          style={{width: 'fit-content', display: 'inline-block'}}>
                    <Grid.Column className='title_align'
                                 style={{lineHeight: '36px'}}>Monitoring</Grid.Column>
                    <div style={{marginLeft: '10px'}}>
                        <button className="ui circular icon button"><i aria-hidden="true"
                                                                       className="info icon"></i></button>
                    </div>

                </Grid.Row>


            )
        }

        async handleRegionChanges(value) {
            let arrayRegions = [];
            if (value === 'ALL') {
                arrayRegions.push('EU')
                arrayRegions.push('US')
            } else {
                arrayRegions.push(value);
            }

            this.setState({
                loading0: true,
                appInstanceListSortByCloudlet: [],
            })
            let appInstanceList = await fetchAppInstanceList(arrayRegions);
            let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, 'Cloudlet');

            //console.log('appInstanceListGroupByCloudlet====>' , appInstanceListGroupByCloudlet)

            console.log('appInstanceListGroupByCloudlet====>', appInstanceListGroupByCloudlet);

            await this.setState({
                appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
                loading0: false,
            })
        }

        renderSelectBox() {

            let options1 = [
                {value: 'ALL', text: 'ALL'},
                {value: 'EU', text: 'EU'},
                {value: 'US', text: 'US'},

            ]

            let dropDownWidth = 250;

            return (

                <div className='page_monitoring_select_row'>
                    <div className='page_monitoring_select_area'>
                        <label className='page_monitoring_select_reset'
                               onClick={() => {
                                   alert('Reset All')
                               }}>Reset All</label>
                        <Dropdown
                            placeholder='REGION'
                            selection
                            options={options1}
                            defaultValue={options1[0].value}
                            onChange={async (e, {value}) => {
                                await this.handleRegionChanges(value)
                            }}
                            style={{width: 250}}
                        />
                        <Dropdown
                            placeholder='CloudLet'
                            selection
                            options={this.state.cloudletList}
                            style={{width: 250}}
                        />
                        <Dropdown
                            placeholder='Cluster'
                            selection
                            options={this.state.clusterList}
                            style={{width: 250}}
                        />
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

            )
        }



        render() {

            if (!this.state.isReady) {

                return (

                    <Grid.Row className='view_contents'>
                        <Grid.Column className='contents_body'>
                            {/*#######################*/}
                            {/*컨텐츠 해더 부분        ..*/}
                            {/*#######################*/}
                            {this.renderHeader()}
                            <div style={{position: 'absolute', top: '25%', left: '42%'}}>
                                {/*<CircularProgress style={{color: 'red'}}/>*/}
                                <div style={{marginLeft: -120}}>
                                    <Lottie
                                        options={{
                                            loop: true,
                                            autoplay: true,
                                            animationData: animationData,
                                            rendererSettings: {
                                                preserveAspectRatio: 'xMidYMid slice'
                                            }
                                        }}
                                        height={350}
                                        width={350}
                                        isStopped={false}
                                        isPaused={false}
                                    />
                                </div>
                                <div style={{marginLeft: -120, fontSize: 17, color: 'white', marginTop: -80}}>Loading
                                    data now. It takes more
                                    than 15 seconds.
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>

                )
            }


            return (

                <Grid.Row className='view_contents'>
                    <Grid.Column className='contents_body'>
                        {/*#######################*/}
                        {/*todo : Content Header part*/}
                        {/*#######################*/}
                        {this.renderHeader()}


                        {/*##########################*/}
                        {/*todo :  Content body part */}
                        {/*##########################*/}
                        <Grid.Row className='site_content_body'>
                            <Grid.Column>
                                <div className="table-no-resized"
                                     style={{height: '100%', display: 'flex', overflow: 'hidden'}}>

                                    <div className="page_monitoring">
                                        {this.renderSelectBox()}
                                        <div className='page_monitoring_dashboard'>
                                            {/*_____row____1111*/}
                                            <div className='page_monitoring_row'>
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Status Of Launch
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading0 ? renderPlaceHolder() : renderInstanceOnCloudletGrid(this.state.appInstanceListGroupByCloudlet)}
                                                    </div>
                                                </div>
                                                {/* ___col___2*/}
                                                {/* ___col___2*/}
                                                {/* ___col___2*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Top 5 of CPU Usage
                                                        </div>
                                                        <div className='page_monitoring_column_select'>
                                                            <Dropdown
                                                                placeholder='Cluster'
                                                                selection
                                                                options={
                                                                    [
                                                                        {
                                                                            key: '24',
                                                                            value: '24',
                                                                            flag: '24',
                                                                            text: 'Last 24 hours'
                                                                        },
                                                                        {
                                                                            key: '18',
                                                                            value: '18',
                                                                            flag: '18',
                                                                            text: 'Last 18 hours'
                                                                        },
                                                                        {
                                                                            key: '12',
                                                                            value: '12',
                                                                            flag: '12',
                                                                            text: 'Last 12 hours'
                                                                        },
                                                                        {
                                                                            key: '6',
                                                                            value: '6',
                                                                            flag: '6',
                                                                            text: 'Last 6 hours'
                                                                        },
                                                                        {
                                                                            key: '1',
                                                                            value: '1',
                                                                            flag: '1',
                                                                            text: 'Last hour'
                                                                        },
                                                                    ]
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderBarGraph_GoogleChart(this.state.cpuUsageList, HARDWARE_TYPE.CPU)}
                                                    </div>
                                                </div>
                                                {/* ___col___3*/}
                                                {/* ___col___3*/}
                                                {/* ___col___3*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Transition Of CPU
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderLineChart_react_chartjs(this.state.cpuUsageList, HARDWARE_TYPE.CPU)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/*row_____22222222*/}
                                            {/*row_____22222222*/}
                                            {/*row_____22222222*/}
                                            <div className='page_monitoring_row'>

                                                {/* ___col___4*/}
                                                {/* ___col___4*/}
                                                {/* ___col___4*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Perfomance Of Apps
                                                        </div>
                                                    </div>

                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderPieChart2_Google()}
                                                    </div>

                                                </div>
                                                {/* ___col___5*/}
                                                {/* ___col___5*/}
                                                {/* ___col___5*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            State of MEM Usage
                                                        </div>
                                                        <div className='page_monitoring_column_select'>
                                                            <Dropdown
                                                                placeholder='Cluster'
                                                                selection
                                                                options={
                                                                    [
                                                                        {
                                                                            key: '24',
                                                                            value: '24',
                                                                            flag: '24',
                                                                            text: 'Last 24 hours'
                                                                        },
                                                                        {
                                                                            key: '18',
                                                                            value: '18',
                                                                            flag: '18',
                                                                            text: 'Last 18 hours'
                                                                        },
                                                                        {
                                                                            key: '12',
                                                                            value: '12',
                                                                            flag: '12',
                                                                            text: 'Last 12 hours'
                                                                        },
                                                                        {
                                                                            key: '6',
                                                                            value: '6',
                                                                            flag: '6',
                                                                            text: 'Last 6 hours'
                                                                        },
                                                                        {
                                                                            key: '1',
                                                                            value: '1',
                                                                            flag: '1',
                                                                            text: 'Last hour'
                                                                        },

                                                                    ]

                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderBarGraph_GoogleChart(this.state.memUsageList, HARDWARE_TYPE.MEM)}
                                                    </div>

                                                </div>
                                                {/* ___col___6*/}
                                                {/* ___col___6*/}
                                                {/* ___col___6*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Transition Of Mem
                                                        </div>
                                                    </div>

                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderLineChart_react_chartjs(this.state.memUsageList, HARDWARE_TYPE.MEM)}
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
