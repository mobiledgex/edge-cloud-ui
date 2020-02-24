import React from 'react';
import '../PageMonitoring.css';
import {
    APP_INST_MATRIX_HW_USAGE_INDEX,
    CHART_COLOR_LIST,
    CLASSIFICATION,
    HARDWARE_TYPE,
    RECENT_DATA_LIMIT_COUNT,
    REGION,
    USAGE_INDEX_FOR_CLUSTER
} from "../../../../shared/Constants";
import BubbleChart from "../../../../components/BubbleChart";
import PageDevMonitoring from "./PageDevMonitoring";
import {
    convertByteToMegaByte,
    makeFormForClusterLevelMatric,
    numberWithCommas,
    PageMonitoringStyles,
    renderUsageByType,
    showToast
} from "../PageMonitoringCommonService";
import {SHOW_CLUSTER_INST} from "../../../../services/endPointTypes";
import {sendSyncRequest} from "../../../../services/serviceMC";
import {renderUsageLabelByType} from "../admin/PageAdminMonitoringService";
import {Line as ReactChartJsLine} from "react-chartjs-2";
import {Table} from "semantic-ui-react";
import Lottie from "react-lottie";
import type {TypeAppInstanceUsage2, TypeClusterUsageList} from "../../../../shared/Types";
import {Progress} from "antd";
import {getClusterLevelMatric} from "../PageMonitoringMetricService";
import {TabPanel, Tabs} from "react-tabs";
import _ from "lodash";
import {reactLocalStorage} from "reactjs-localstorage";
import {WidthProvider, Responsive} from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);


export const defaultLayoutForAppInst = [
    {i: 'a', x: 0, y: 0, w: 1, h: 3},
    {i: 'b', x: 1, y: 0, w: 1, h: 3},
    {i: 'c', x: 2, y: 0, w: 1, h: 3},

    {i: 'd', x: 0, y: 1, w: 1, h: 3,},
    {i: 'e', x: 1, y: 1, w: 1, h: 3,},
    {i: 'f', x: 2, y: 1, w: 1, h: 3,},

    {i: 'g', x: 0, y: 2, w: 1, h: 3,},
    {i: 'h', x: 1, y: 2, w: 1, h: 3,},
    {i: 'i', x: 2, y: 2, w: 1, h: 3,},

];

export const defaultLayoutForCluster = [
    {i: '1', x: 0, y: 0, w: 1, h: 1, "add": false,},
    {i: '2', x: 1, y: 0, w: 1, h: 1, "add": false,},
    {i: '3', x: 2, y: 0, w: 1, h: 1, "add": false,},


    {i: '4', x: 0, y: 1, w: 1, h: 1, "add": false,},
    {i: '5', x: 1, y: 1, w: 1, h: 1, "add": false,},
    /*{i: '6', x: 2, y: 1, w: 1, h: 1, "add": false,},

    {i: '7', x: 0, y: 2, w: 1, h: 1, "add": false,},
    {i: '8', x: 1, y: 2, w: 1, h: 1, "add": false,},
    {i: '9', x: 2, y: 2, w: 1, h: 1, "add": false,},*/

    /*{i: '10', x: 0, y: 3, w: 1, h: 1, "add": fals
    {i: '11', x: 1, y: 3, w: 1, h: 1, "add": false},
    {i: '12', x: 2, y: 3, w: 1, h: 1, "add": false},

    {i: '13', x: 0, y: 4, w: 1, h: 1, "add": false},
    {i: '14', x: 1, y: 4, w: 1, h: 1, "add": false},
    {i: '15', x: 2, y: 4, w: 1, h: 1, "add": false},

    {i: '16', x: 0, y: 5, w: 1, h: 1, "add": false},
    {i: '17', x: 1, y: 5, w: 1, h: 1, "add": false},
    {i: '18', x: 2, y: 5, w: 1, h: 1, "add": false},*/
];

export const HARDWARE_TYPE_FOR_GRID = {
    FLAVOR: 'FLAVOR',
    CPU: 'CPU',
    VCPU: 'vCPU',
    NET_SEND: 'NET_SEND',
    NET_RECV: 'NET_RECV',
    FLOATING_IPS: 'FLOATING_IPS',
    IPV4: 'IPV4',

    ////////////
    UDP: 'UDP',
    TCP: 'TCP',
    NETWORK: 'NETWORK',
    //UDP
    UDPSENT: 'UDPSENT',
    UDPRECV: 'UDPRECV',
    UDPRECVERR: 'UDPRECVERR',

    //TCP
    TCPCONNS: 'TCPCONNS',
    TCPRETRANS: 'TCPRETRANS',

    //NETWORK
    SENDBYTES: 'SEND_BYTES',
    RECVBYTES: 'RECV_BYTES',

    MEM: 'MEM',
    MEM2: 'MEM',
    RECV_BYTES: 'RECV_BYTES',
    SEND_BYTES: 'SEND_BYTES',
    DISK: 'DISK',
    CONNECTIONS: 'CONNECTIONS',
    ACTIVE_CONNECTION: 'ACTIVE_CONNECTION',//12
    HANDLED_CONNECTION: 'HANDLED_CONNECTION',//13
    ACCEPTS_CONNECTION: 'ACCEPTS_CONNECTION',//14 (index)

}


export const defaultLayoutForCluster_HW = {
    '1': HARDWARE_TYPE_FOR_GRID.CPU,
    '2': HARDWARE_TYPE_FOR_GRID.MEM,
    '3': HARDWARE_TYPE_FOR_GRID.DISK,
    '4': HARDWARE_TYPE_FOR_GRID.RECVBYTES,
    '5': HARDWARE_TYPE_FOR_GRID.SENDBYTES,

}


export const getUserId = () => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    return store.email;
}


export const renderGridLayoutForAppInst = (_this: PageDevMonitoring) => {
    return (
        <>
            <ResponsiveReactGridLayout
                isDraggable={_this.state.gridDraggable}
                autoSize={true}
                className="layout"
                layout={_this.state.layoutForAppInst}
                cols={{lg: 3, md: 3, sm: 3, xs: 3, xxs: 3}}
                isDroppable={true}
                rowHeight={160}
                width={window.innerWidth * 0.86}
                onLayoutChange={(layout) => {
                    _this.setState({
                        layoutForAppInst: layout
                    }, () => {
                        console.log("layoutForAppInst===>", _this.state.layoutForAppInst);
                    })
                    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
                    let layoutUniqueId = store.email + "_layout2"
                    reactLocalStorage.setObject(layoutUniqueId, layout)
                }}
                style={{overflowY: 'auto',}}
            >
                <div className='page_monitoring_column_kyungjoon1' style={{}}
                     key="a">
                    {_this.renderBubbleChartArea()}
                </div>
                {/* todo:map(b)*/}
                {_this.renderMapArea()}
                <div className='page_monitoring_column_kyungjoon1' key="c">
                    {_this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.CPU)}

                </div>


                {/*todo:2nd row*/}
                {/*todo:2nd row*/}
                {/*todo:2nd row*/}
                <div className='page_monitoring_column_kyungjoon1' key="d">
                    {_this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.MEM)}
                </div>


                <div className='page_monitoring_column_kyungjoon1' key="e">
                    {_this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.DISK)}
                </div>

                <div className='page_monitoring_column_kyungjoon1' key="f">
                    <Tabs selectedIndex={_this.state.networkTabIndex}
                          className='page_monitoring_tab'>
                        <TabPanel>
                            {_this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.RECVBYTES)}
                        </TabPanel>
                        <TabPanel>
                            {_this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.SENDBYTES)}
                        </TabPanel>
                    </Tabs>
                </div>

                {/*todo:3nd row*/}
                {/*todo:3nd row*/}
                {/*todo:3nd row*/}
                <div className='page_monitoring_column_kyungjoon1' key="g">
                    <Tabs selectedIndex={_this.state.connectionsTabIndex}
                          className='page_monitoring_tab'>
                        <TabPanel>
                            {_this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.ACTIVE_CONNECTION)}
                        </TabPanel>
                        <TabPanel>
                            {_this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.HANDLED_CONNECTION)}
                        </TabPanel>
                        <TabPanel>
                            {_this.makeChartDataAndRenderTabBody_LineChart(HARDWARE_TYPE.ACCEPTS_CONNECTION)}
                        </TabPanel>
                    </Tabs>
                </div>
            </ResponsiveReactGridLayout>
        </>

    )
}


export const getClusterLevelUsageList = async (clusterList, pHardwareType, recentDataLimitCount, pStartTime = '', pEndTime = '') => {
    try {
        let instanceBodyList = []
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';

        for (let index = 0; index < clusterList.length; index++) {
            let instanceInfoOneForm = makeFormForClusterLevelMatric(clusterList[index], pHardwareType, token, recentDataLimitCount, pStartTime, pEndTime)
            instanceBodyList.push(instanceInfoOneForm);
        }

        let promiseList = []
        for (let index = 0; index < instanceBodyList.length; index++) {
            promiseList.push(getClusterLevelMatric(instanceBodyList[index], token))
        }
        let clusterLevelUsageList = await Promise.all(promiseList);
        let newClusterLevelUsageList = []
        clusterLevelUsageList.map((item, index) => {

            let sumSendBytes = 0;
            let sumRecvBytes = 0;
            let sumUdpSent = 0;
            let sumUdpRecv = 0;
            let sumUdpRecvErr = 0;
            let sumTcpConns = 0;
            let sumTcpRetrans = 0;
            let sumMemUsage = 0;
            let sumDiskUsage = 0;
            let sumCpuUsage = 0;
            let columns = []
            let cluster = ''
            let dev = '';
            let cloudlet = '';
            let operator = '';

            if (item.data["0"].Series !== null) {

                columns = item.data["0"].Series["0"].columns
                let udpSeriesList = item.data["0"].Series["0"].values
                let tcpSeriesList = item.data["0"].Series["1"].values
                let networkSeriesList = item.data["0"].Series["2"].values
                let memSeriesList = item.data["0"].Series["3"].values
                let diskSeriesList = item.data["0"].Series["4"].values
                let cpuSeriesList = item.data["0"].Series["5"].values
                udpSeriesList.map(item => {
                    sumUdpSent += item[12];
                    sumUdpRecv += item[13];
                    sumUdpRecvErr += item[14];
                })

                tcpSeriesList.map(item => {
                    sumTcpConns += item[10]
                    sumTcpRetrans += item[11]
                })

                networkSeriesList.map(item => {
                    sumSendBytes += item[8]
                    sumRecvBytes += item[9]
                })

                memSeriesList.map(item => {
                    sumMemUsage += item[6]
                })

                diskSeriesList.map(item => {
                    sumDiskUsage += item[7]
                })

                cpuSeriesList.map(item => {
                    sumCpuUsage += item[5]
                })

                newClusterLevelUsageList.push({
                    cluster: clusterList[index].ClusterName,
                    cloudletLocation: clusterList[index].CloudletLocation,
                    dev: clusterList[index].Region,
                    cloudlet: clusterList[index].Cloudlet,
                    operator: clusterList[index].Operator,
                    sumUdpSent: sumUdpSent / RECENT_DATA_LIMIT_COUNT,
                    sumUdpRecv: sumUdpRecv / RECENT_DATA_LIMIT_COUNT,
                    sumUdpRecvErr: sumUdpRecvErr / RECENT_DATA_LIMIT_COUNT,
                    sumTcpConns: sumTcpConns / RECENT_DATA_LIMIT_COUNT,
                    sumTcpRetrans: sumTcpRetrans / RECENT_DATA_LIMIT_COUNT,
                    sumSendBytes: sumSendBytes / RECENT_DATA_LIMIT_COUNT,
                    sumRecvBytes: sumRecvBytes / RECENT_DATA_LIMIT_COUNT,
                    sumMemUsage: sumMemUsage / RECENT_DATA_LIMIT_COUNT,
                    sumDiskUsage: sumDiskUsage / RECENT_DATA_LIMIT_COUNT,
                    sumCpuUsage: sumCpuUsage / RECENT_DATA_LIMIT_COUNT,
                    columns: columns,
                    udpSeriesList,
                    tcpSeriesList,
                    networkSeriesList: networkSeriesList,
                    memSeriesList,
                    diskSeriesList,
                    cpuSeriesList,

                })

            } else {//Seires is null
                newClusterLevelUsageList.push({
                    cluster: clusterList[index].ClusterName,
                    cloudletLocation: clusterList[index].CloudletLocation,
                    dev: clusterList[index].Region,
                    cloudlet: clusterList[index].Cloudlet,
                    operator: clusterList[index].Operator,
                    sumUdpSent: 0,
                    sumUdpRecv: 0,
                    sumUdpRecvErr: 0,
                    sumTcpConns: 0,
                    sumTcpRetrans: 0,
                    sumSendBytes: 0,
                    sumRecvBytes: 0,
                    sumMemUsage: 0,
                    sumDiskUsage: 0,
                    sumCpuUsage: 0,
                    columns: 0,
                    udpSeriesList: [],
                    tcpSeriesList: [],
                    networkSeriesList: [],
                    memSeriesList: [],
                    diskSeriesList: [],
                    cpuSeriesList: [],


                })
            }

        })

        console.log('newClusterLevelUsageList===>', newClusterLevelUsageList)

        return newClusterLevelUsageList;
    } catch (e) {
        return [];
    }
}

export const getClusterList = async () => {
    try {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        let requestData = {showSpinner: false, token: token, method: SHOW_CLUSTER_INST, data: {region: REGION.EU}};
        let requestData2 = {showSpinner: false, token: token, method: SHOW_CLUSTER_INST, data: {region: REGION.US}};
        let promiseList = []
        promiseList.push(sendSyncRequest(this, requestData))
        promiseList.push(sendSyncRequest(this, requestData2))
        let showClusterList = await Promise.all(promiseList);

        console.log('showClusterList====>', showClusterList);

        let mergedClusterList = [];
        showClusterList.map(item => {
            //@todo : null check
            if (item && item.response && item.response.data && item.response.data.length !== 0) {
                let clusterList = item.response.data;
                clusterList.map(item => {
                    mergedClusterList.push(item);
                })
            }
        })

        //todo: 현재 속한 조직의 것만을 가져오도록 필터링
        let orgClusterList = []
        mergedClusterList.map(item => {
            if (item.OrganizationName === localStorage.selectOrg) {
                orgClusterList.push(item)
            }
        })

        console.log('orgClusterList====>', orgClusterList);

        return orgClusterList;
    } catch (e) {
        showToast(e.toString())
    }
}


export const filterUsageByClassification = (originalList, selectOne, filterKey,) => {

    //todo:리전인 경우.....
    if (filterKey === CLASSIFICATION.REGION) {
        if (selectOne !== 'ALL') {
            let filteredList = []
            originalList.map(item => {
                if (item[filterKey] === selectOne) {
                    filteredList.push(item);
                }
            })
            return filteredList;
        } else {
            return originalList;
        }
    } else {
        let filteredInstanceList = []
        originalList.map(item => {
            if (item[filterKey] === selectOne) {
                filteredInstanceList.push(item);
            }
        })
        return filteredInstanceList;
    }

}


export const renderUsageLabelByTypeForCluster = (usageOne, hardwareType, userType = '') => {
    if (hardwareType === HARDWARE_TYPE.CPU) {
        let cpuUsageOne = (usageOne.sumCpuUsage * 1).toFixed(2) + " %";
        return cpuUsageOne;
    }

    if (hardwareType === HARDWARE_TYPE.MEM) {
        return numberWithCommas((usageOne.sumMemUsage).toFixed(2)) + " %"
    }

    if (hardwareType === HARDWARE_TYPE.DISK) {
        return numberWithCommas((usageOne.sumDiskUsage).toFixed(2)) + " %"
    }

    if (hardwareType === HARDWARE_TYPE.TCPCONNS) {
        return numberWithCommas((usageOne.sumTcpConns).toFixed(2)) + " "
    }

    if (hardwareType === HARDWARE_TYPE.UDPSENT) {
        return numberWithCommas((usageOne.sumUdpSent).toFixed(2)) + " "
    }

    if (hardwareType === HARDWARE_TYPE.UDPRECV) {
        return numberWithCommas((usageOne.sumUdpRecv).toFixed(2)) + " "
    }

    //@fixme
    if (hardwareType === HARDWARE_TYPE.SENDBYTES) {
        return numberWithCommas((usageOne.sumSendBytes / 1000000).toFixed(0)) + " MByte"
    }

    if (hardwareType === HARDWARE_TYPE.RECVBYTES) {
        return numberWithCommas((usageOne.sumRecvBytes / 1000000).toFixed(0)) + " MByte"
    }
}


export const sortUsageListByTypeForCluster = (usageList, hardwareType) => {
    if (hardwareType === HARDWARE_TYPE.CPU) {
        usageList.sort((a, b) => b.sumCpuUsage - a.sumCpuUsage);
    } else if (hardwareType === HARDWARE_TYPE.MEM) {
        usageList.sort((a, b) => b.sumMemUsage - a.sumMemUsage);
    } else if (hardwareType === HARDWARE_TYPE.DISK) {
        usageList.sort((a, b) => b.sumDiskUsage - a.sumDiskUsage);
    } else if (hardwareType === HARDWARE_TYPE.TCPCONNS) {
        usageList.sort((a, b) => b.sumTcpConns - a.sumTcpConns);
    } else if (hardwareType === HARDWARE_TYPE.TCPRETRANS) {
        usageList.sort((a, b) => b.sumTcpRetrans - a.sumTcpRetrans);
    } else if (hardwareType === HARDWARE_TYPE.UDPSENT) {
        usageList.sort((a, b) => b.sumUdpSent - a.sumUdpSent);
    } else if (hardwareType === HARDWARE_TYPE.UDPRECV) {
        usageList.sort((a, b) => b.sumUdpRecv - a.sumUdpRecv);
    } else if (hardwareType === HARDWARE_TYPE.SENDBYTES) {
        usageList.sort((a, b) => b.sumSendBytes - a.sumSendBytes);
    } else if (hardwareType === HARDWARE_TYPE.RECVBYTES) {
        usageList.sort((a, b) => b.sumRecvBytes - a.sumRecvBytes);
    }

    return usageList;
}

export const sortByKey = (arrList, key) => {


    arrList.sort((a, b) => b[key] - a[key]);


    return arrList;
}


export const makeBarChartDataForCluster = (usageList, hardwareType, _this) => {

    console.log(`renderBarGraphForCluster===>${hardwareType}`, usageList);
    usageList = sortUsageListByTypeForCluster(usageList, hardwareType)

    if (usageList.length === 0) {
        return "";
    } else {
        let chartDataList = [];
        chartDataList.push(["Element", hardwareType + " USAGE", {role: "style"}, {role: 'annotation'}])
        for (let index = 0; index < usageList.length; index++) {
            if (index < 5) {
                let barDataOne = [
                    usageList[index].cluster.toString() + "\n[" + usageList[index].cloudlet + "]",//clusterName
                    renderUsageByType(usageList[index], hardwareType),
                    CHART_COLOR_LIST[index],
                    renderUsageLabelByTypeForCluster(usageList[index], hardwareType)
                ]
                chartDataList.push(barDataOne);
            }
        }

        let chartDataSet = {
            chartDataList,
            hardwareType,
        }
        return chartDataSet
    }
}

export const renderBottomGridAreaForCluster = (_this: PageDevMonitoring, pClusterList) => {

    //pClusterList
    pClusterList = sortUsageListByTypeForCluster(pClusterList, HARDWARE_TYPE.CPU)

    return (
        <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing
               styles={{zIndex: 999999999999}}>
            <Table.Header className="viewListTableHeader" styles={{zIndex: 99999999999}}>
                <Table.Row>
                    <Table.HeaderCell>
                        Cluster
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
                        NETWORK RECV
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        NETWORK SENT
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        TCP CONN
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        TCP RETRANS
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        UDP REV
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        UDP SENT
                    </Table.HeaderCell>

                </Table.Row>
            </Table.Header>
            <Table.Body className="tbBodyList"
                        ref={(div) => {
                            _this.messageList = div;
                        }}
            >
                {/*-----------------------*/}
                {/*todo:ROW HEADER        */}
                {/*-----------------------*/}
                {!_this.state.isReady &&
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
                {!_this.state.isRequesting && pClusterList.map((item: TypeClusterUsageList, index) => {

                    return (
                        <Table.Row className='page_monitoring_popup_table_row'

                                   onClick={() => {
                                       try {
                                           let cluster_cloudlet = item.cluster.toString() + ' | ' + item.cloudlet.toString()
                                           let lineChartDataSet = makeLineChartDataForCluster(_this.state.filteredClusterUsageList, _this.state.currentHardwareType, _this)
                                           cluster_cloudlet = cluster_cloudlet.toString().split(" | ")[0] + "|" + cluster_cloudlet.toString().split(" | ")[1]
                                           handleLegendAndBubbleClickedEvent(_this, cluster_cloudlet, lineChartDataSet)

                                       } catch (e) {

                                       }
                                   }}
                        >
                            <Table.Cell>
                                {item.cluster}<br/>[{item.cloudlet}]
                            </Table.Cell>
                            <Table.Cell>
                                <div>
                                    <div>
                                        {item.sumCpuUsage.toFixed(2) + '%'}
                                    </div>
                                    <div>
                                        <Progress style={{width: '100%'}} strokeLinecap={'square'} strokeWidth={10}
                                                  showInfo={false}
                                                  percent={(item.sumCpuUsage / _this.state.maxCpu * 100)}
                                            //percent={(item.sumCpuUsage / _this.state.gridInstanceListCpuMax) * 100}
                                                  strokeColor={'#29a1ff'} status={'normal'}/>
                                    </div>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <div>
                                    <div>
                                        {numberWithCommas(item.sumMemUsage.toFixed(2)) + ' %'}
                                    </div>
                                    <div>
                                        <Progress style={{width: '100%'}} strokeLinecap={'square'} strokeWidth={10}
                                                  showInfo={false}
                                                  percent={(item.sumMemUsage / _this.state.maxMem * 100)}
                                                  strokeColor={'#29a1ff'} status={'normal'}/>
                                    </div>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                {numberWithCommas(item.sumDiskUsage.toFixed(2)) + ' %'}
                            </Table.Cell>
                            <Table.Cell>
                                {numberWithCommas(item.sumRecvBytes.toFixed(2)) + ' '}
                            </Table.Cell>
                            <Table.Cell>
                                {numberWithCommas(item.sumSendBytes.toFixed(2)) + ' '}
                            </Table.Cell>

                            <Table.Cell>
                                {numberWithCommas(item.sumTcpConns.toFixed(2)) + ' '}
                            </Table.Cell>
                            <Table.Cell>
                                {numberWithCommas(item.sumTcpRetrans.toFixed(2)) + ' '}
                            </Table.Cell>
                            <Table.Cell>
                                {numberWithCommas(item.sumUdpRecv.toFixed(2)) + ' '}
                            </Table.Cell>
                            <Table.Cell>
                                {numberWithCommas(item.sumUdpSent.toFixed(2)) + ' '}
                            </Table.Cell>

                        </Table.Row>

                    )
                })}
            </Table.Body>
        </Table>
    )
}

/**
 *
 * @param allHWUsageList
 * @param hardwareType
 * @param _this
 * @returns {string|{chartDataList: [], hardwareType: *}}
 */
export const makeBarChartDataForAppInst = (allHWUsageList, hardwareType, _this: PageDevMonitoring) => {

    try {
        console.log('allHWUsageList===>', allHWUsageList);
        let typedUsageList = [];
        if (hardwareType === HARDWARE_TYPE.CPU) {
            typedUsageList = allHWUsageList[0]
        } else if (hardwareType === HARDWARE_TYPE.MEM) {
            typedUsageList = allHWUsageList[1]
        } else if (hardwareType === HARDWARE_TYPE.RECVBYTES || hardwareType === HARDWARE_TYPE.SENDBYTES) {
            typedUsageList = allHWUsageList[2]
        } else if (hardwareType === HARDWARE_TYPE.DISK) {
            typedUsageList = allHWUsageList[3]
        } else if (hardwareType === HARDWARE_TYPE.ACCEPTS_CONNECTION) {
            typedUsageList = allHWUsageList[4]
        } else if (hardwareType === HARDWARE_TYPE.ACTIVE_CONNECTION) {
            typedUsageList = allHWUsageList[4]
        } else if (hardwareType === HARDWARE_TYPE.HANDLED_CONNECTION) {
            typedUsageList = allHWUsageList[4]
        }
        console.log('typedUsageList===>', typedUsageList);

        if (typedUsageList.length === 0) {
            return "";
        } else {
            let chartDataList = [];
            chartDataList.push(["Element", hardwareType.toUpperCase() + " USAGE", {role: "style"}, {role: 'annotation'}])
            for (let index = 0; index < typedUsageList.length; index++) {
                if (index < 5) {
                    let barDataOne = [
                        typedUsageList[index].instance.AppName.toString().substring(0, 10) + "..." + "\n[" + typedUsageList[index].instance.Cloudlet + "]",
                        renderUsageByType(typedUsageList[index], hardwareType),
                        CHART_COLOR_LIST[index],
                        renderUsageLabelByType(typedUsageList[index], hardwareType)
                    ]
                    chartDataList.push(barDataOne);
                }
            }

            let chartDataSet = {
                chartDataList,
                hardwareType,
            }
            return chartDataSet
        }
    } catch (e) {
        //showToast(e.toString())
    }


}


export const handleHardwareTabChanges = async (_this: PageDevMonitoring, selectedValueOne) => {
    if (_this.state.currentClassification === CLASSIFICATION.CLUSTER) {
        if (selectedValueOne === HARDWARE_TYPE.CPU) {
            await _this.setState({
                currentTabIndex: 0
            })
        } else if (selectedValueOne === HARDWARE_TYPE.MEM) {
            await _this.setState({
                currentTabIndex: 1
            })
        } else if (selectedValueOne === HARDWARE_TYPE.DISK) {
            await _this.setState({
                currentTabIndex: 2
            })
        } else if (selectedValueOne === HARDWARE_TYPE.TCPRETRANS || selectedValueOne === HARDWARE_TYPE.TCPCONNS) {
            await _this.setState({
                currentTabIndex: 3
            })
        } else if (selectedValueOne === HARDWARE_TYPE.UDPSENT || selectedValueOne === HARDWARE_TYPE.UDPRECV) {
            await _this.setState({
                currentTabIndex: 4
            })
        }
    }
}


export const renderBubbleChartCoreForDev_Cluster = (_this: PageDevMonitoring, hardwareType: string, pBubbleChartData: any) => {

    console.log('pBubbleChartData===>', pBubbleChartData);


    if (pBubbleChartData.length === 0 && _this.loading === false) {
        return (
            <div style={PageMonitoringStyles.noData}>
                NO DATA
            </div>
        )
    } else {
        let appInstanceList = _this.state.appInstanceList;


        let boxWidth = (window.innerWidth - 300) / 3 - 20

        function renderZoomLevel(appInstanceListLength) {
            if (appInstanceListLength <= 4) {
                return 0.5;
            } else {
                return 0.70;
            }
        }


        function renderOffsetY(appInstanceListLength) {
            if (appInstanceListLength === 0) {
                return 0.05;
            } else if (appInstanceListLength === 1) {
                return 0.05;
            } else if (appInstanceListLength <= 4) {
                return 0.05;
            } else {
                return 0.00;
            }
        }


        return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div style={{
                    //backgroundColor: 'blue',
                    backgroundColor: '#1e2124',
                    // marginLeft: 0, marginRight: 0, marginBottom: 10,
                }}>
                    <BubbleChart
                        className='bubbleChart'
                        graph={{
                            zoom: renderZoomLevel(appInstanceList.length),
                            //zoom: 0.70,
                            offsetX: 0.15,
                            offsetY: renderOffsetY(appInstanceList.length)
                        }}
                        width={boxWidth}
                        height={'100%'}
                        padding={0} // optional value, number that set the padding between bubbles
                        showLegend={true} // optional value, pass false to disable the legend.
                        legendPercentage={20} // number that represent the % of with that legend going to use.
                        legendFont={{
                            //family: 'Candal',
                            size: 9,
                            color: 'black',
                            weight: 'bold',
                        }}
                        valueFont={{
                            //family: 'Righteous',
                            size: 12,
                            color: 'black',
                            //weight: 'bold',
                            fontStyle: 'italic',
                        }}
                        labelFont={{
                            //family: 'Righteous',
                            size: 14,
                            color: 'black',
                            weight: 'bold',
                        }}
                        bubbleClickFun={async (cluster_cloudlet, index) => {
                            try {
                                let lineChartDataSet = makeLineChartDataForCluster(_this.state.filteredClusterUsageList, _this.state.currentHardwareType, _this)
                                cluster_cloudlet = cluster_cloudlet.toString().split(" | ")[0] + "|" + cluster_cloudlet.toString().split(" | ")[1]
                                handleLegendAndBubbleClickedEvent(_this, cluster_cloudlet, lineChartDataSet)
                            } catch (e) {

                            }


                        }}
                        legendClickFun={async (cluster_cloudlet, index) => {
                            try {
                                let lineChartDataSet = makeLineChartDataForCluster(_this.state.filteredClusterUsageList, _this.state.currentHardwareType, _this)
                                cluster_cloudlet = cluster_cloudlet.toString().split(" | ")[0] + "|" + cluster_cloudlet.toString().split(" | ")[1]
                                handleLegendAndBubbleClickedEvent(_this, cluster_cloudlet, lineChartDataSet)
                            } catch (e) {

                            }
                        }}
                        data={pBubbleChartData}
                    />

                </div>

            </div>
        )
    }


}

/**
 *
 * @param _this
 * @param hardwareUsageList
 * @param hardwareType
 * @returns {*}
 */
export const make__LineChartDataForAppInst = (hardwareUsageList: Array, hardwareType: string, _this: PageDevMonitoring) => {

    if (hardwareUsageList.length === 0) {
        return (
            <div style={PageMonitoringStyles.noData}>
                NO DATA
            </div>
        )
    } else {


        let instanceAppName = ''
        let instanceNameList = [];
        let usageSetList = []
        let dateTimeList = []
        hardwareUsageList.map((item: TypeAppInstanceUsage2, index) => {

            let seriesValues = []
            if (hardwareType === HARDWARE_TYPE.CPU) {
                seriesValues = item.cpuSeriesValue
            } else if (hardwareType === HARDWARE_TYPE.MEM) {
                seriesValues = item.memSeriesValue
            } else if (hardwareType === HARDWARE_TYPE.DISK) {
                seriesValues = item.diskSeriesValue
            } else if (hardwareType === HARDWARE_TYPE.RECVBYTES || hardwareType === HARDWARE_TYPE.SENDBYTES) {
                seriesValues = item.networkSeriesValue
            } else if (hardwareType === HARDWARE_TYPE.HANDLED_CONNECTION || hardwareType === HARDWARE_TYPE.ACCEPTS_CONNECTION || hardwareType === HARDWARE_TYPE.ACTIVE_CONNECTION) {
                seriesValues = item.connectionsSeriesValue
            }

            console.log(`seriesValues===${hardwareType}>`, seriesValues);

            instanceAppName = item.instance.AppName
            let usageList = [];

            for (let j in seriesValues) {
                let usageOne = 0;
                if (hardwareType === HARDWARE_TYPE.CPU) {
                    usageOne = seriesValues[j][APP_INST_MATRIX_HW_USAGE_INDEX.CPU];
                } else if (hardwareType === HARDWARE_TYPE.MEM) {
                    usageOne = seriesValues[j][APP_INST_MATRIX_HW_USAGE_INDEX.MEM]; //mem usage
                } else if (hardwareType === HARDWARE_TYPE.DISK) {
                    usageOne = seriesValues[j][APP_INST_MATRIX_HW_USAGE_INDEX.DISK];
                } else if (hardwareType === HARDWARE_TYPE.SENDBYTES) {
                    usageOne = seriesValues[j][APP_INST_MATRIX_HW_USAGE_INDEX.SENDBYTES];
                } else if (hardwareType === HARDWARE_TYPE.RECVBYTES) {
                    usageOne = seriesValues[j][APP_INST_MATRIX_HW_USAGE_INDEX.RECVBYTES];
                } else if (hardwareType === HARDWARE_TYPE.ACTIVE_CONNECTION) {
                    usageOne = seriesValues[j][APP_INST_MATRIX_HW_USAGE_INDEX.ACTIVE.toString()];
                } else if (hardwareType === HARDWARE_TYPE.HANDLED_CONNECTION) {
                    usageOne = seriesValues[j][APP_INST_MATRIX_HW_USAGE_INDEX.HANDLED.toString()];
                } else if (hardwareType === HARDWARE_TYPE.ACCEPTS_CONNECTION) {
                    usageOne = seriesValues[j][APP_INST_MATRIX_HW_USAGE_INDEX.ACCEPTS.toString()];
                }

                usageList.push(usageOne);
                let dateOne = seriesValues[j]["0"];
                dateOne = dateOne.toString().split("T")

                dateTimeList.push(dateOne[1]);
            }

            instanceNameList.push(instanceAppName)
            usageSetList.push(usageList);

        })


        //@todo: CUT LIST INTO RECENT_DATA_LIMIT_COUNT
        let newDateTimeList = []
        for (let i in dateTimeList) {
            if (i < RECENT_DATA_LIMIT_COUNT) {
                let splitDateTimeArrayList = dateTimeList[i].toString().split(".");
                let timeOne = splitDateTimeArrayList[0].replace("T", "T");
                newDateTimeList.push(timeOne.toString())//.substring(3, timeOne.length))
            }

        }
        return {
            levelTypeNameList: instanceNameList,
            usageSetList,
            newDateTimeList,
            hardwareType
        }
    }

}

export const convertHwTypePhrases = (pHardwareType) => {

    if (pHardwareType === HARDWARE_TYPE.RECVBYTES || pHardwareType === HARDWARE_TYPE.SENDBYTES) {
        return "Network"
    } else if (pHardwareType === HARDWARE_TYPE.TCPCONNS || pHardwareType === HARDWARE_TYPE.TCPRETRANS) {
        return "Tcp"
    } else if (pHardwareType === HARDWARE_TYPE.UDPRECV || pHardwareType === HARDWARE_TYPE.UDPSENT) {
        return "Udp"
    } else if (pHardwareType === HARDWARE_TYPE.HANDLED_CONNECTION || pHardwareType === HARDWARE_TYPE.ACCEPTS_CONNECTION || pHardwareType === HARDWARE_TYPE.ACTIVE_CONNECTION) {
        return "Connections"
    } else if (pHardwareType === HARDWARE_TYPE.CPU) {
        return "Cpu"
    } else if (pHardwareType === HARDWARE_TYPE.MEM) {
        return "Mem"
    } else if (pHardwareType === HARDWARE_TYPE.DISK) {
        return "Disk"
    }

}


export const makeLineChartDataForCluster = (pUsageList: Array, hardwareType: string, _this) => {
    pUsageList = sortUsageListByTypeForCluster(pUsageList, hardwareType)

    if (pUsageList.length === 0) {
        return "";
    } else {
        let classificationName = ''
        let levelTypeNameList = [];
        let usageSetList = []
        let dateTimeList = []
        let series = []
        for (let i in pUsageList) {

            if (hardwareType === HARDWARE_TYPE.CPU) {
                series = pUsageList[i].cpuSeriesList
            } else if (hardwareType === HARDWARE_TYPE.MEM) {
                series = pUsageList[i].memSeriesList
            } else if (hardwareType === HARDWARE_TYPE.DISK) {
                series = pUsageList[i].diskSeriesList
            } else if (hardwareType === HARDWARE_TYPE.TCPCONNS) {
                series = pUsageList[i].tcpSeriesList
            } else if (hardwareType === HARDWARE_TYPE.TCPRETRANS) {
                series = pUsageList[i].tcpSeriesList
            } else if (hardwareType === HARDWARE_TYPE.UDPSENT) {
                series = pUsageList[i].udpSeriesList
            } else if (hardwareType === HARDWARE_TYPE.UDPRECV) {
                series = pUsageList[i].udpSeriesList
            } else if (hardwareType === HARDWARE_TYPE.SENDBYTES) {
                series = pUsageList[i].networkSeriesList
            } else if (hardwareType === HARDWARE_TYPE.RECVBYTES) {
                series = pUsageList[i].networkSeriesList
            }

            console.log('series333333333===>', series);

            classificationName = pUsageList[i].cluster + "\n[" + pUsageList[i].cloudlet + "]";
            let usageList = [];

            for (let j in series) {

                let usageOne = 0;
                if (hardwareType === HARDWARE_TYPE.CPU) {
                    usageOne = series[j][USAGE_INDEX_FOR_CLUSTER.CPU];
                } else if (hardwareType === HARDWARE_TYPE.MEM) {
                    usageOne = series[j][USAGE_INDEX_FOR_CLUSTER.MEM];
                } else if (hardwareType === HARDWARE_TYPE.DISK) {
                    usageOne = series[j][USAGE_INDEX_FOR_CLUSTER.DISK];
                } else if (hardwareType === HARDWARE_TYPE.TCPCONNS) {
                    usageOne = series[j][USAGE_INDEX_FOR_CLUSTER.TCPCONNS];
                } else if (hardwareType === HARDWARE_TYPE.TCPRETRANS) {
                    usageOne = series[j][USAGE_INDEX_FOR_CLUSTER.TCPRETRANS];
                } else if (hardwareType === HARDWARE_TYPE.UDPSENT) {
                    usageOne = series[j][USAGE_INDEX_FOR_CLUSTER.UDPSENT];
                } else if (hardwareType === HARDWARE_TYPE.UDPRECV) {
                    usageOne = series[j][USAGE_INDEX_FOR_CLUSTER.UDPRECV];
                } else if (hardwareType === HARDWARE_TYPE.SENDBYTES) {
                    usageOne = series[j][USAGE_INDEX_FOR_CLUSTER.SENDBYTES];
                } else if (hardwareType === HARDWARE_TYPE.RECVBYTES) {
                    usageOne = series[j][USAGE_INDEX_FOR_CLUSTER.RECVBYTES];
                }
                usageList.push(usageOne);
                let dateOne = series[j]["0"];
                dateOne = dateOne.toString().split("T")
                dateTimeList.push(dateOne[1]);
            }

            levelTypeNameList.push(classificationName)
            usageSetList.push(usageList);
        }

        console.log('usageSetList====>', usageSetList);


        //@todo: CUST LIST INTO RECENT_DATA_LIMIT_COUNT
        let newDateTimeList = []
        for (let i in dateTimeList) {
            if (i < RECENT_DATA_LIMIT_COUNT) {
                let splitDateTimeArrayList = dateTimeList[i].toString().split(".");
                let timeOne = splitDateTimeArrayList[0].replace("T", "T");
                newDateTimeList.push(timeOne.toString())//.substring(3, timeOne.length))
            }

        }

        let lineChartDataSet = {
            levelTypeNameList,
            usageSetList,
            newDateTimeList,
            hardwareType,
        }

        return lineChartDataSet
    }

}

/**
 *
 * @param canvas
 * @param height
 * @returns {[]}
 */
export const makeGradientColor = (canvas, height) => {
    const ctx = canvas.getContext("2d");

    let gradientList = []
    const gradient = ctx.createLinearGradient(0, 0, 0, height);

    //'rgb(222,0,0)', 'rgb(255,150,0)', 'rgb(255,246,0)', 'rgb(91,203,0)', 'rgb(0,150,255)'
    gradient.addColorStop(0, 'rgb(222,0,0)');
    gradient.addColorStop(1, 'rgba(222,0,0, 0)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, height);
    gradient2.addColorStop(0, 'rgb(255,150,0)');
    gradient2.addColorStop(1, 'rgba(255,150,0,0)');

    const gradient3 = ctx.createLinearGradient(0, 0, 0, height);
    gradient3.addColorStop(0, 'rgb(255,246,0)');
    gradient3.addColorStop(1, 'rgba(255,246,0,0)');

    const gradient4 = ctx.createLinearGradient(0, 0, 0, height);
    gradient4.addColorStop(0, 'rgb(91,203,0)');
    gradient4.addColorStop(1, 'rgba(91,203,0,0)');

    const gradient5 = ctx.createLinearGradient(0, 0, 0, height);
    gradient5.addColorStop(0, 'rgb(0,150,255)');
    gradient5.addColorStop(1, 'rgba(0,150,255,0)');

    gradientList.push(gradient)
    gradientList.push(gradient2)
    gradientList.push(gradient3)
    gradientList.push(gradient4)
    gradientList.push(gradient5)

    return gradientList;
}


export const makeGradientColorOne = (canvas, height) => {
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgb(111,253,255)');
    gradient.addColorStop(1.0, 'rgb(62,113,243)');
    return gradient;
}


export const getColorOne = () => {
    return 'rgb(111,253,255)';
}


/**
 *
 * @param _this
 * @param clickedItem
 * @param lineChartDataSet
 */
export const handleLegendAndBubbleClickedEvent = (_this: PageDevMonitoring, clickedItem, lineChartDataSet) => {

    let selectedIndex = 0;
    lineChartDataSet.levelTypeNameList.map((item, jIndex) => {
        let newItem = item.toString().replace('\n', "|").replace("[", '').replace("]", '')
        clickedItem = clickedItem.toString().replace('\n', "|").replace("[", '').replace("]", '')
        if (clickedItem === newItem) {
            selectedIndex = jIndex;
        }
    })
    let selectedLineChartDataSetOne = {
        levelTypeNameList: lineChartDataSet.levelTypeNameList[selectedIndex],
        usageSetList: lineChartDataSet.usageSetList[selectedIndex],
        newDateTimeList: lineChartDataSet.newDateTimeList,
        hardwareType: lineChartDataSet.hardwareType,
    }

    _this.showModalClusterLineChart(selectedLineChartDataSetOne, selectedIndex)
}


/**
 * @todo: renderLineChartCoreForDev_Cluster
 * @param _this
 * @param lineChartDataSet
 * @returns {*|string|undefined}
 */
export const renderLineChartCoreForDev_Cluster = (_this: PageDevMonitoring, lineChartDataSet) => {
    try {
        let levelTypeNameList = lineChartDataSet.levelTypeNameList;
        let usageSetList = lineChartDataSet.usageSetList;
        let newDateTimeList = lineChartDataSet.newDateTimeList;
        let hardwareType = lineChartDataSet.hardwareType;

        console.log('lineChartDataSet==77777=>', lineChartDataSet);


        const lineChartData = (canvas) => {

            let gradientList = makeGradientColor(canvas, height);
            let finalSeriesDataSets = [];
            for (let index in usageSetList) {
                //@todo: top5 만을 추린다
                if (index < 5) {
                    let datasetsOne = {
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

                    finalSeriesDataSets.push(datasetsOne)
                }

            }
            return {
                labels: newDateTimeList,
                datasets: finalSeriesDataSets,
            }
        }

        let height = 500 + 100;
        let options = {
            animation: {
                duration: 500
            },
            maintainAspectRatio: false,//@todo
            responsive: true,//@todo
            datasetStrokeWidth: 3,
            pointDotStrokeWidth: 4,
            layout: {
                padding: {
                    left: 0,
                    right: 10,
                    top: 0,
                    bottom: 0
                }
            },
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 10,
                    fontColor: 'white'
                },//@todo: lineChart 리전드 클릭 이벤트.
                onClick: (e, clickedItem) => {

                    let selectedClusterOne = clickedItem.text.toString().replace('\n', "|");

                    handleLegendAndBubbleClickedEvent(_this, selectedClusterOne, lineChartDataSet)

                },
                onHover: (e, item) => {
                    //alert(`Item with text ${item.text} and index ${item.index} hovered`)
                },
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        //max: 100,//todo max value
                        fontColor: 'white',
                        callback(value, index, label) {
                            return convertByteToMegaByte(value, hardwareType)

                        },
                    },
                    gridLines: {
                        color: "#505050",
                    },
                    //stacked: true

                }],
                xAxes: [{
                    /*ticks: {
                        fontColor: 'white'
                    },*/
                    gridLines: {
                        color: "#505050",
                    },
                    ticks: {
                        fontSize: 14,
                        fontColor: 'white',
                        //maxRotation: 0.05,
                        //autoSkip: true,
                        maxRotation: 45,
                        minRotation: 45,
                        padding: 10,
                        labelOffset: 0,
                        callback(value, index, label) {
                            return value;

                        },
                    },
                    beginAtZero: false,
                    /* gridLines: {
                         drawTicks: true,
                     },*/
                }],
                backgroundColor: {
                    fill: "#1e2124"
                },
            },//scales
            onClick: function (c, i) {
                /*let e = i[0];
                console.log(e._index)
                var x_value = this.data.labels[e._index];
                var y_value = this.data.datasets[0].data[e._index];
                console.log(x_value);
                console.log(y_value);*/
                if (i.length > 0) {
                    console.log('onClick===>', i);
                }

            }
        }//options


        //todo :#######################
        //todo : chart rendering part
        //todo :#######################
        return (
            <div style={{
                position: 'relative',
                width: '99%',
                height: '96%'
            }}>
                <ReactChartJsLine
                    //width={'100%'}
                    //height={hardwareType === "recv_bytes" || hardwareType === "send_bytes" ? chartHeight + 20 : chartHeight}
                    //height={'100%'}
                    data={lineChartData}
                    options={options}
                    /* getDatasetAtEvent={dataset => {
                         alert(dataset)
                     }}*/

                />
            </div>
        );
    } catch (e) {
        // showToast(e.toString())
    }
}


export const renderLineChartCoreForDev_AppInst = (_this: PageDevMonitoring, lineChartDataSet) => {

    console.log("renderLineChartCoreForDev_AppInst===>", lineChartDataSet);

    try {
        let levelTypeNameList = lineChartDataSet.levelTypeNameList;
        let usageSetList = lineChartDataSet.usageSetList;
        let newDateTimeList = lineChartDataSet.newDateTimeList;
        let hardwareType = lineChartDataSet.hardwareType;

        console.log('lineChartDataSet==77777=>', lineChartDataSet);


        const lineChartData = (canvas) => {

            let gradientList = makeGradientColor(canvas, height);
            let finalSeriesDataSets = [];
            for (let index in usageSetList) {
                //@todo: top5 만을 추린다
                if (index < 5) {
                    let datasetsOne = {
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

                    finalSeriesDataSets.push(datasetsOne)
                }

            }
            return {
                labels: newDateTimeList,
                datasets: finalSeriesDataSets,
            }
        }

        let height = 500 + 100;
        let options = {
            animation: {
                duration: 500
            },
            maintainAspectRatio: false,//@todo
            responsive: true,//@todo
            datasetStrokeWidth: 3,
            pointDotStrokeWidth: 4,
            layout: {
                padding: {
                    left: 0,
                    right: 10,
                    top: 0,
                    bottom: 0
                }
            },
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 10,
                    fontColor: 'white'
                },//@todo: lineChart 리전드 클릭 이벤트.
                onClick: (e, clickedItem) => {

                    let selectedClusterOne = clickedItem.text.toString().replace('\n', "|");

                    handleLegendAndBubbleClickedEvent(_this, selectedClusterOne, lineChartDataSet)

                },
                onHover: (e, item) => {
                    //alert(`Item with text ${item.text} and index ${item.index} hovered`)
                },
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        //max: 100,//todo max value
                        fontColor: 'white',
                        callback(value, index, label) {
                            return convertByteToMegaByte(value, hardwareType)

                        },
                    },
                    gridLines: {
                        color: "#505050",
                    },
                    //stacked: true

                }],
                xAxes: [{
                    /*ticks: {
                        fontColor: 'white'
                    },*/
                    gridLines: {
                        color: "#505050",
                    },
                    ticks: {
                        fontSize: 14,
                        fontColor: 'white',
                        //maxRotation: 0.05,
                        //autoSkip: true,
                        maxRotation: 45,
                        minRotation: 45,
                        padding: 10,
                        labelOffset: 0,
                        callback(value, index, label) {
                            return value;

                        },
                    },
                    beginAtZero: false,
                    /* gridLines: {
                         drawTicks: true,
                     },*/
                }],
                backgroundColor: {
                    fill: "#1e2124"
                },
            },//scales
            onClick: function (c, i) {
                /*let e = i[0];
                console.log(e._index)
                var x_value = this.data.labels[e._index];
                var y_value = this.data.datasets[0].data[e._index];
                console.log(x_value);
                console.log(y_value);*/
                if (i.length > 0) {
                    console.log('onClick===>', i);
                }

            }
        }//options


        //todo :#######################
        //todo : chart rendering part
        //todo :#######################
        return (
            <div style={{
                position: 'relative',
                width: '99%',
                height: '96%'
            }}>
                <ReactChartJsLine
                    //width={'100%'}
                    //height={hardwareType === "recv_bytes" || hardwareType === "send_bytes" ? chartHeight + 20 : chartHeight}
                    //height={'100%'}
                    data={lineChartData}
                    options={options}
                    /* getDatasetAtEvent={dataset => {
                         alert(dataset)
                     }}*/

                />
            </div>
        );
    } catch (e) {
        // showToast(e.toString())
    }
}


export const makeSelectBoxListWithKeyValuePipe = (arrList, keyName, valueName) => {
    let newArrList = [];
    for (let i in arrList) {
        newArrList.push({
            key: arrList[i][keyName].trim() + " | " + arrList[i][valueName].trim(),
            value: arrList[i][keyName].trim() + " | " + arrList[i][valueName].trim(),
            text: arrList[i][keyName].trim() + " | " + arrList[i][valueName].trim(),
        })
    }
    return newArrList;
}


export const makeSelectBoxListWithKey = (arrList, keyName) => {
    let newArrList = [];
    for (let i in arrList) {
        newArrList.push({
            key: arrList[i][keyName].trim(),
            value: arrList[i][keyName].trim(),
            text: arrList[i][keyName].trim(),
        })
    }
    return newArrList;
}

export const makeSelectBoxListWithThreeValuePipe = (arrList, keyName: string, valueName: string, thirdValue: string) => {
    let newArrList = [];
    for (let i in arrList) {
        newArrList.push({
            key: arrList[i][keyName].trim() + " | " + arrList[i][valueName].trim() + " | " + arrList[i][thirdValue].trim(),
            value: arrList[i][keyName].trim() + " | " + arrList[i][valueName].trim() + " | " + arrList[i][thirdValue].trim(),
            text: arrList[i][keyName].trim() + " | " + arrList[i][valueName].trim() + " | " + arrList[i][thirdValue].trim(),
        })
    }
    return newArrList;
}


export const removeDuplication = (originalArray, prop) => {
    let newArray = [];
    let lookupObject = {};

    for (let i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (let i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}



