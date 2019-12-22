import 'react-hot-loader'

import React from 'react';
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
    fetchAppInstanceList, filterAppInstanceListByRegion,
    renderBarGraph_GoogleChart,
    renderBubbleChart,
    renderInstanceOnCloudletGrid,
    renderLineChart_react_chartjs,
    renderPieChart2AndAppStatus,
    renderPlaceHolder, renderPlaceHolder2
} from "../services/PageMonitoringService";
import {HARDWARE_TYPE, REGION} from "../shared/Constants";
import Lottie from "react-lottie";
import type {TypeAppInstance} from "../shared/Types";
//import './PageMonitoring.css';

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
    cpuUsageList: any,
    cpuUsageList2: any,
    memUsageList: any,
    counter: number,
    appInstanceList: Array<TypeAppInstance>,
    appInstanceOne: TypeAppInstance,
    currentRegion: string,

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
            counter: 0,
            appInstanceList: [],
            appInstanceOne: {},
            currentRegion: '',
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

        componentDidMount = async () => {
            this.intervalHandle = setInterval(this.tick.bind(this), 1000);

            this.setState({
                loading: true,
                loading0: true,
                startDate: getTodayDate(),
                endDate: getTodayDate(),
            })

            //todo: REALDATA
            let appInstanceList: Array<TypeAppInstance> = await fetchAppInstanceList();

            //todo: FAKEJSON
            //let appInstanceList: Array<TypeAppInstance> = require('../TEMP_KYUNGJOOON_FOR_TEST/appInstanceList')

            appInstanceList.map(async (item: TypeAppInstance, index) => {
                if (index === 0) {
                    this.setState({
                        appInstanceOne: item,
                    }, () => {

                    })

                    this.props.toggleLoading(false);
                }
                console.log('Region===index>', index);
                console.log('Region===>', item.AppName);
            })


            //todo: ####################################################################################
            //todo: 앱인스턴스 리스트를 가지고 MEM,CPU CHART DATA를 가지고 온다. (최근 100개 날짜의 데이터만을 끌어온다)
            //todo: Bring Mem and CPU chart Data with App Instance List.
            //todo: ####################################################################################
            /*
              let cpuOrMemUsageList = await Promise.all([makeCpuOrMemUsageListPerInstance(appInstanceList, HARDWARE_TYPE.CPU, 100), makeCpuOrMemUsageListPerInstance(appInstanceList, HARDWARE_TYPE.MEM, 100)])
              let cpuUsageListPerOneInstance = cpuOrMemUsageList[0]
              let memUsageListPerOneInstance = cpuOrMemUsageList[1]
              console.log('_result===>', cpuOrMemUsageList);
            */


            //todo: ################################################################
            //todo: (last 100 datas) - Fake JSON FOR TEST
            //todo: ################################################################
            let cpuUsageListPerOneInstance = require('../jsons/cpuUsage_100Count')
            let memUsageListPerOneInstance = require('../jsons/memUsage_100Count')

            let appInstanceListGroupByCloudlet = reducer.groupBy(appInstanceList, 'Cloudlet');
            let clusterInstanceGroupList = reducer.groupBy(appInstanceList, 'ClusterInst')
            let cloudletList = this.makeSelectBoxList(appInstanceListGroupByCloudlet, "Cloudlet")
            let clusterList = this.makeSelectBoxList(clusterInstanceGroupList, "ClusterInst")
            await this.setState({
                appInstanceList: appInstanceList,
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
                    }, () => {
                        clearInterval(this.intervalHandle)
                    })
                }, 350)
            })

        }

        componentWillUnmount() {
            clearInterval(this.intervalHandle)
        }


        async handleRegionChanges(pRegion) {

            this.props.toggleLoading(true)
            await this.setState({
                loading0: true,
                appInstanceListSortByCloudlet: [],
                currentRegion: pRegion,
            })


            let appInstanceList = await fetchAppInstanceList()

            console.log('appInstanceList2222222===>', appInstanceList);

            let filteredAppInstanceList = filterAppInstanceListByRegion(pRegion, appInstanceList);

            console.log('filteredAppInstanceList===>', filteredAppInstanceList);

            let appInstanceListGroupByCloudlet = reducer.groupBy(filteredAppInstanceList, 'Cloudlet');

            await this.setState({
                appInstanceList: filteredAppInstanceList,
                appInstanceListGroupByCloudlet: appInstanceListGroupByCloudlet,
                loading0: false,
            })
            this.props.toggleLoading(false)
        }

        renderHeader = () => {
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


        setAppInstanceOne(paramAppName: string) {
            //alert()

            this.props.toggleLoading(true);
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
                setTimeout(() => {
                    this.props.toggleLoading(false);
                }, 250)
            })

            //alert(appInstanceOne.AppName)

        }

        render() {
            //todo:####################################################################
            //todo: Components showing when the loading of graph data is not completed.
            //todo:####################################################################
            if (!this.state.isReady) {
                return (
                    <Grid.Row className='view_contents'>
                        <Grid.Column className='contents_body'>
                            {/*todo:####################*/}
                            {/*todo:Content Header part      */}
                            {/*todo:####################*/}
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
                                    than 15 seconds.
                                </div>
                                <div style={{marginLeft: 55, fontSize: 50, color: 'white', marginTop: 10, height: 150}}>
                                    {this.state.counter}
                                </div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }

            let options1 = [
                {value: 'ALL', text: 'ALL'},
                {value: 'EU', text: 'EU'},
                {value: 'US', text: 'US'},

            ]


            return (

                <Grid.Row className='view_contents'>
                    <Grid.Column className='contents_body'>
                        {/*todo:####################*/}
                        {/*todo:Content Header part      */}
                        {/*todo:####################*/}
                        {this.renderHeader()}

                        {/*todo:####################*/}
                        {/*todo:Content Body part   */}
                        {/*todo:####################*/}
                        <Grid.Row className='site_content_body'>
                            <Grid.Column>
                                <div className="table-no-resized"
                                     style={{height: '100%', display: 'flex', overflow: 'hidden'}}>

                                    <div className="page_monitoring">
                                        {/*todo:####################*/}
                                        {/*todo:SelectBox part  */}
                                        {/*todo:####################*/}
                                        <div className='page_monitoring_select_row'>
                                            <div className='page_monitoring_select_area'>
                                                <label className='page_monitoring_select_reset'
                                                       onClick={() => {
                                                           notification.success({
                                                               duration: 0.5,
                                                               message: 'reset all',
                                                           });
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
                                                            Status Of Launched App Instance
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading0 ? renderPlaceHolder() : renderInstanceOnCloudletGrid(this.state.appInstanceListGroupByCloudlet)}
                                                    </div>
                                                </div>
                                                {/* ___col___2*/}
                                                {/* ___col___2*/}
                                                {/* ___col___2*/}
                                                <div className='page_monitoring_column_kj'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Top 5 of CPU Usage
                                                        </div>
                                                        <div className='page_monitoring_column_kj_select'>
                                                            <Dropdown
                                                                placeholder='Cluster'
                                                                selection
                                                                options={this.state.clusterList}
                                                                style={{width: 250}}


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
                                                <div className='page_monitoring_column_kj'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Transition Of CPU Usage
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderLineChart_react_chartjs(this.state.cpuUsageList, HARDWARE_TYPE.CPU)}
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
                                                            Perfomance Of Apps

                                                           {/* {this.props.isLoading ?
                                                                <FlexBox style={{height: 25}}>
                                                                    <Lottie
                                                                        options={{
                                                                            loop: true,
                                                                            autoplay: true,
                                                                            animationData: require('../lotties/loader003'),
                                                                            rendererSettings: {
                                                                                preserveAspectRatio: 'xMidYMid slice'
                                                                            }
                                                                        }}
                                                                        height={55}
                                                                        width={55}
                                                                        isStopped={false}
                                                                        isPaused={false}
                                                                        style={{marginLeft: 30, marginBottom: 110,}}
                                                                    />
                                                                </FlexBox>
                                                                :
                                                                <div style={{marginLeft: 50, color: '#77BD25'}}>
                                                                    {this.state.appInstanceOne.AppName.substring(0, 14) + "..."}
                                                                </div>
                                                            }*/}

                                                        </div>
                                                    </div>
                                                    {/*todo:###########################***/}
                                                    {/*todo:render BubbleChart          */}
                                                    {/*todo:###########################***/}
                                                    <FlexBox>
                                                        <div>
                                                            {this.props.isLoading ? renderPlaceHolder2() : renderBubbleChart(this)}
                                                        </div>
                                                        <div style={{marginRight: 10,}}>
                                                            {/*todo:#########################################****/}
                                                            {/*todo: RENDER Donut Chart  N  App Status          */}
                                                            {/*todo:#########################################****/}
                                                            {renderPieChart2AndAppStatus(this.state.appInstanceOne, this)}
                                                        </div>
                                                    </FlexBox>

                                                </div>
                                                {/* ___col___5*/}
                                                {/* ___col___5*/}
                                                {/* ___col___5*/}
                                                <div className='page_monitoring_column_kj'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            State of MEM Usage
                                                        </div>
                                                        <div className='page_monitoring_column_kj_select'>
                                                            <Dropdown
                                                                placeholder='Cluster'
                                                                selection
                                                                options={this.state.clusterList}
                                                                style={{width: 250}}
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
                                                <div className='page_monitoring_column_kj'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Transition Of Mem Usage
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
