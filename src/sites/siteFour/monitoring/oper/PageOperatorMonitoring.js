import 'react-hot-loader'
import {SemanticToastContainer, toast} from 'react-semantic-toasts';
import OutsideClickHandler from 'react-outside-click-handler';
import 'react-semantic-toasts/styles/react-semantic-alert.css';
import React, {Component} from 'react';
import {Button, Dropdown, Grid, Modal, Tab, Table} from 'semantic-ui-react'
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../../../../actions';
import {hot} from "react-hot-loader/root";
import {DatePicker, Progress,} from 'antd';
import {getCloudletList, getClouletLevelUsageList, renderBubbleChartForCloudlet, StylesForMonitoring} from "../admin/PageAdminMonitoringService";
import {HARDWARE_OPTIONS_FOR_CLOUDLET, HARDWARE_TYPE, HARDWARE_TYPE_FOR_CLOUDLET, NETWORK_OPTIONS2, NETWORK_TYPE, RECENT_DATA_LIMIT_COUNT, REGIONS_OPTIONS} from "../../../../shared/Constants";
import Lottie from "react-lottie";
import type {TypeCloudletUsageList, TypeGridInstanceList} from "../../../../shared/Types";
import {TypeAppInstance, TypeUtilization} from "../../../../shared/Types";
import moment from "moment";
import ToggleDisplay from 'react-toggle-display';
import {TabPanel, Tabs} from "react-tabs";
import '../PageMonitoring.css'
import {numberWithCommas, renderPlaceHolder, showToast} from "../PageMonitoringCommonService";
import MiniMap from "./MiniMap";
import {CircularProgress} from "@material-ui/core";
import {renderBarGraphForCloutdlet, renderLineChartForCloudlet} from "./PageOperatorMonitoringService";

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
    allUsageList: Array,
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
    userType: string,
    placeHolderStateTime: string,
    placeHolderEndTime: string,
    allConnectionsUsageList: Array,
    filteredConnectionsUsageList: Array,
    connectionsTabIndex: number,
    cloudletList: Array,
    maxCpu: number,
    maxMem: number,
    intervalLoading: boolean,
    isRequesting: false,

}


export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageOperatorMonitoring extends Component<Props, State> {
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
            currentHardwareType: HARDWARE_TYPE.VCPU,
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
            dropdownCloudletList: [],
            allUsageList: [],
            maxCpu: 0,
            maxMem: 0,
            intervalLoading: false,
            isRequesting: false,
        };

        interval = null;


        constructor(props) {
            super(props);

        }

        componentDidMount = async () => {
            this.setState({
                loading: true,
            })
            await this.loadInitDataForCloudlet();
            this.setState({
                loading: false,
                isReady: true,
            })

            this.interval = setInterval(async () => {
                this.setState({
                    intervalLoading: true,
                })
                await this.loadInitDataForCloudlet();
                this.setState({
                    intervalLoading: false,
                })

            }, 1000 * 15)
        }

        componentWillUnmount(): void {
            clearInterval(this.interval)
        }


        async loadInitDataForCloudlet() {
            this.setState({
                isRequesting: true,
            })

            let cloudletList = []
            cloudletList = await getCloudletList();

            console.log('cloudletList===>', cloudletList)

            let cloudletListForDropdown = [];
            cloudletList.map(item => {
                /*{text: 'FLAVOR', value: 'flavor'},*/
                cloudletListForDropdown.push({
                    text: item.CloudletName,
                    value: item.CloudletName,
                })
            })


            await this.setState({
                isAppInstaceDataReady: true,
                dropdownCloudletList: cloudletListForDropdown,
            }, () => {
                console.log('dropdownCloudletList===>', this.state.dropdownCloudletList);
            })
            //let cloudletLevelUsageList: Array<TypeAppInstance> = require('./cloutletLevelMatric')
            let allUsageList = await getClouletLevelUsageList(cloudletList, "*", RECENT_DATA_LIMIT_COUNT);

            let bubbleChartData = await this.makeBubbleChartDataForCloudlet(allUsageList);
            await this.setState({
                bubbleChartData: bubbleChartData,
            })

            let maxCpu = Math.max.apply(Math, allUsageList.map(function (o) {
                return o.avgVCpuUsed;
            }));

            let maxMem = Math.max.apply(Math, allUsageList.map(function (o) {
                return o.avgMemUsed;
            }));

            await this.setState({
                allClusterUsageList: allUsageList,
                cloudletList: cloudletList,
                maxCpu: maxCpu,
                maxMem: maxMem,
                isRequesting: false,
            });

        }

        async makeBubbleChartDataForCloudlet(usageList: any) {
            let bubbleChartData = []
            usageList.map((item, index) => {
                bubbleChartData.push({
                    index: index,
                    label: item.cloudlet.toString().substring(0, 10) + "...",
                    value: item.avgVCpuMax,
                    favor: item.avgVCpuMax,
                    fullLabel: item.cloudlet.toString(),
                })
            })

            return bubbleChartData;
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
                placeHolderStateTime: moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'),
                placeHolderEndTime: moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm'),
            })
            await this.setState({
                cloudLetSelectBoxClearable: true,
            })
            this.setState({
                loading: true,
            })
            await this.loadInitDataForCloudlet();
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


        renderBottomGridAreaForCloudlet() {
            return (
                <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing>
                    <Table.Header className="viewListTableHeader">
                        <Table.Row>
                            <Table.HeaderCell>
                                index
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                CLOUDLET
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                vCPU(%)
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
                                FLOATING IPS
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                IPV4
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
                                        animationData: require('../../../../lotties/loader001'),
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
                        {this.state.isReady && this.state.allUsageList.map((item: TypeCloudletUsageList, index) => {

                            return (
                                <Table.Row className='page_monitoring_popup_table_row'>

                                    <Table.Cell>
                                        {index}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.cloudlet}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <div>
                                                {item.avgVCpuUsed.toFixed(2) + '%'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'} strokeWidth={10} showInfo={false}
                                                          percent={(item.avgVCpuUsed / this.state.maxCpu * 100)}
                                                    //percent={(item.sumCpuUsage / this.state.gridInstanceListCpuMax) * 100}
                                                          strokeColor={'#29a1ff'} status={'normal'}/>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <div>
                                                {numberWithCommas(item.avgMemUsed) + ' Byte'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'} strokeWidth={10} showInfo={false}
                                                          percent={(item.avgMemUsed / this.state.maxMem * 100)}
                                                          strokeColor={'#29a1ff'} status={'normal'}/>
                                            </div>

                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.avgDiskUsed) + ' Byte'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.avgNetRecv) + ' Byte'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.avgNetSend) + ' Byte'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.avgFloatingIpsUsed}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item.avgIpv4Used}
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
                            {this.state.loading ? renderPlaceHolder() : renderBarGraphForCloutdlet(this.state.allUsageList, HARDWARE_TYPE.VCPU)}
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
                            {this.state.loading ? renderPlaceHolder() : renderLineChartForCloudlet(this, this.state.allUsageList, HARDWARE_TYPE.VCPU)}
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
                            {this.state.loading ? renderPlaceHolder() : renderBarGraphForCloutdlet(this.state.allUsageList, HARDWARE_TYPE.MEM_USED)}
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
                            {this.state.loading ? renderPlaceHolder() : renderLineChartForCloudlet(this, this.state.allUsageList, HARDWARE_TYPE.MEM_USED)}
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
                            {this.state.loading ? renderPlaceHolder() : renderBarGraphForCloutdlet(this.state.allUsageList, HARDWARE_TYPE.DISK_USED)}
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
                            {this.state.loading ? renderPlaceHolder() : renderLineChartForCloudlet(this, this.state.allUsageList, HARDWARE_TYPE.DISK_USED)}
                        </div>
                    </div>
                </div>
            )
        }

        renderFloatingIpsTabArea() {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*1_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 Counts of FLOATING IPS
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderBarGraphForCloutdlet(this.state.allUsageList, HARDWARE_TYPE.FLOATING_IPS_USED)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Transition Of FLOATING IPS
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderLineChartForCloudlet(this, this.state.allUsageList, HARDWARE_TYPE.FLOATING_IPS_USED)}
                        </div>
                    </div>
                </div>
            )
        }

        renderIPV4TabArea() {
            return (
                <div className='page_monitoring_dual_column'>
                    {/*1_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 Counts of IP V4
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderBarGraphForCloutdlet(this.state.allUsageList, HARDWARE_TYPE.IPV4_USED)}
                        </div>
                    </div>
                    {/*2nd_column*/}
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                Transition Of IP V4
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder() : renderLineChartForCloudlet(this, this.state.allUsageList, HARDWARE_TYPE.IPV4_USED)}
                        </div>
                    </div>
                </div>
            )
        }


        renderNetSendRevcArea(networkType: string) {
            return (
                <div className='page_monitoring_dual_column'>
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title'>
                                TOP5 of NETWORK Usage
                            </div>
                        </div>
                        <div className='page_monitoring_container'>
                            {this.state.loading ? renderPlaceHolder('network') : renderBarGraphForCloutdlet(this.state.allUsageList, networkType, this)}
                        </div>
                    </div>
                    <div className='page_monitoring_dual_container'>
                        <div className='page_monitoring_title_area'>
                            <div className='page_monitoring_title_select'>
                                Transition Of NETWORK Usage
                            </div>
                            {!this.state.loading &&
                            <Dropdown
                                placeholder='SELECT NET TYPE'
                                selection
                                loading={this.state.loading}
                                options={NETWORK_OPTIONS2}
                                defaultValue={NETWORK_OPTIONS2[0].value}
                                onChange={async (e, {value}) => {
                                    if (value === NETWORK_TYPE.NET_SEND) {
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
                            {this.state.loading ? renderPlaceHolder('network') : renderLineChartForCloudlet(this, this.state.allUsageList, networkType)}
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
                        </div>
                        <div style={{marginLeft: '10px'}}>
                            <Button
                                onClick={async () => {
                                    await this.setState({
                                        currentGridIndex: -1,
                                        currentTabIndex: 0,
                                    })
                                    //await this.filterByEachTypes('ALL', '', '', '')
                                }}
                            >RESET</Button>
                        </div>
                        <div style={{marginLeft: 50}}>
                            {this.state.userType}
                        </div>
                        <div style={{color: 'yellow'}}>
                            opertator view
                        </div>
                        {this.state.intervalLoading &&
                        <div style={{marginLeft: 50}}>
                            <CircularProgress size={9} style={{fontSize: 9}}/>
                        </div>
                        }
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

                                    this.setState({
                                        currentRegion: value,
                                    })

                                    /* await this.filterByEachTypes(value)
                                     setTimeout(() => {
                                         this.setState({
                                             cloudLetSelectBoxPlaceholder: 'Select CloudLet'
                                         })
                                     }, 1000)*/
                                }}
                                value={this.state.currentRegion}
                                // style={Styles.dropDown}
                            />

                        </div>

                        {/*todo:##########################*/}
                        {/*todo:CloudLet Dropdown         */}
                        {/*todo:##########################*/}
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
                                options={this.state.dropdownCloudletList}
                                // style={Styles.dropDown}
                                onChange={async (e, {value}) => {
                                    this.setState({
                                        currentCloudLet: value,
                                    })
                                    /*   await this.filterByEachTypes(this.state.currentRegion, value)
                                       setTimeout(() => {
                                           this.setState({
                                               clusterSelectBoxPlaceholder: 'Select Cluster'
                                           })
                                       }, 1000)*/
                                }}
                            />
                        </div>


                        {/*todo:##########################*/}
                        {/*todo: Time Range Dropdown       */}
                        {/*todo:##########################*/}
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
                                    //this.filterUsageListByDate()
                                }}
                                ranges={{
                                    Today: [moment(), moment()],
                                    'Last 7 Days': [moment().subtract(7, 'd'), moment().subtract(1, 'd')],
                                    'Last 30 Days': [moment().subtract(30, 'd'), moment().subtract(1, 'd')],
                                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                                    'Last Month': [moment().date(-30), moment().date(-1)],
                                    'Last 90 Days': [moment().subtract(89, 'd'), moment().subtract(0, 'd')],
                                    'Last 182 Days': [moment().subtract(181, 'd'), moment().subtract(0, 'd')],
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

        async handleBubbleChartDropDownForCloudlet(hwType) {
            await this.setState({
                currentHardwareType: hwType,
            });

            let allUsageList = this.state.allUsageList;
            let bubbleChartData = [];

            console.log('sldkflskdflksdlfklsdkfk====>', allUsageList);

            if (hwType === 'vCPU') {
                allUsageList.map((item, index) => {
                    bubbleChartData.push({
                        index: index,
                        label: item.cloudlet.toString().substring(0, 10) + "...",
                        value: (item.avgVCpuUsed * 1).toFixed(0),
                        favor: (item.avgVCpuUsed * 1).toFixed(0),
                        fullLabel: item.cloudlet,
                    })
                })
            } else if (hwType === HARDWARE_TYPE_FOR_CLOUDLET.MEM) {
                allUsageList.map((item, index) => {
                    bubbleChartData.push({
                        index: index,
                        label: item.cloudlet.toString().substring(0, 10) + "...",
                        value: item.avgMemUsed,
                        favor: item.avgMemUsed,
                        fullLabel: item.cloudlet,
                    })
                })
            } else if (hwType === HARDWARE_TYPE_FOR_CLOUDLET.DISK) {
                allUsageList.map((item, index) => {
                    bubbleChartData.push({
                        index: index,
                        label: item.cloudlet.toString().substring(0, 10) + "...",
                        value: item.avgDiskUsed,
                        favor: item.avgDiskUsed,
                        fullLabel: item.cloudlet,
                    })
                })
            } else if (hwType === HARDWARE_TYPE_FOR_CLOUDLET.RECV_BYTES) {
                allUsageList.map((item, index) => {
                    bubbleChartData.push({
                        index: index,
                        label: item.cloudlet.toString().substring(0, 10) + "...",
                        value: item.avgNetRecv,
                        favor: item.avgNetRecv,
                        fullLabel: item.cloudlet,
                    })
                })
            } else if (hwType === HARDWARE_TYPE_FOR_CLOUDLET.SEND_BYTES) {
                allUsageList.map((item, index) => {
                    bubbleChartData.push({
                        index: index,
                        label: item.cloudlet.toString().substring(0, 10) + "...",
                        value: item.avgNetSend,
                        favor: item.avgNetSend,
                        fullLabel: item.cloudlet,
                    })
                })
            } else if (hwType === HARDWARE_TYPE_FOR_CLOUDLET.FLOATING_IPS) {
                allUsageList.map((item, index) => {
                    bubbleChartData.push({
                        index: index,
                        label: item.cloudlet.toString().substring(0, 10) + "...",
                        value: item.avgFloatingIpsUsed,
                        favor: item.avgFloatingIpsUsed,
                        fullLabel: item.cloudlet,
                    })
                })
            } else if (hwType === HARDWARE_TYPE_FOR_CLOUDLET.IPV4) {
                allUsageList.map((item, index) => {
                    bubbleChartData.push({
                        index: index,
                        label: item.cloudlet.toString().substring(0, 10) + "...",
                        value: item.avgIpv4Used,
                        favor: item.avgIpv4Used,
                        fullLabel: item.cloudlet,
                    })
                })
            }

            console.log('1111bubbleChartData====>', bubbleChartData);

            this.setState({
                bubbleChartData: bubbleChartData,
            });
        }

        //@todo:-----------------------
        //@todo:    CPU,MEM,DISK TAB
        //@todo:-----------------------
        CPU_MEM_DISK_CONN_TABS = [

            {
                menuItem: 'vCPU', render: () => {
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
            {
                menuItem: 'FLOATING IPS', render: () => {
                    return (
                        <Pane>
                            {this.renderFloatingIpsTabArea()}
                        </Pane>
                    )
                }
            },
            {
                menuItem: 'IPV4', render: () => {
                    return (
                        <Pane>
                            {this.renderIPV4TabArea()}
                        </Pane>
                    )
                }
            },

        ]

        render() {
            // todo: Components showing when the loading of graph data is not completed.
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
                                            animationData: require('../../../../lotties/loader001'),
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
                            {this.renderBottomGridAreaForCloudlet()}
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
                                                            Status of Launched Cloudlet
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {!this.state.isAppInstaceDataReady ? renderPlaceHolder() : <MiniMap loading={this.state.loading} cloudletList={this.state.cloudletList}/>}
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
                                                            Performance State Of Cloudlet
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
                                                            options={HARDWARE_OPTIONS_FOR_CLOUDLET}
                                                            defaultValue={HARDWARE_OPTIONS_FOR_CLOUDLET[0].value}
                                                            onChange={async (e, {value}) => {

                                                                this.handleBubbleChartDropDownForCloudlet(value);

                                                            }}
                                                            value={this.state.currentHardwareType}
                                                        />
                                                    </div>
                                                    {/*todo:---------------------------------*/}
                                                    {/*todo: RENDER BUBBLE_CHART          */}
                                                    {/*todo:---------------------------------*/}
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderBubbleChartForCloudlet(this, this.state.currentHardwareType, this.state.bubbleChartData)}
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
                                                            {this.renderNetSendRevcArea(NETWORK_TYPE.NET_SEND)}
                                                        </TabPanel>
                                                        <TabPanel>
                                                            {this.renderNetSendRevcArea(NETWORK_TYPE.NET_RECV)}
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
                                                            SHOW CLOUDLET LIST
                                                        </div>
                                                        <div className='page_monitoring_popup_header_button'>
                                                            SHOW CLOUDLET LIST
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
                                                                    HIDE CLOUDLET LIST
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
                                                            {this.state.cloudletList.length && this.state.isReady === 0 ?
                                                                <div style={StylesForMonitoring.noData}>
                                                                    NO DATA
                                                                </div>
                                                                : this.renderBottomGridAreaForCloudlet()}
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

