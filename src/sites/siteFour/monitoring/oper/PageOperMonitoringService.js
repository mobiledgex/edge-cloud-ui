import {CHART_COLOR_LIST, HARDWARE_TYPE, HARDWARE_TYPE_FOR_CLOUDLET, RECENT_DATA_LIMIT_COUNT, USAGE_INDEX} from "../../../../shared/Constants";
import React from "react";
import {renderUsageLabelByType} from "../admin/PageAdminMonitoringService";
import {
    getCloudletLevelMatric,
    makeFormForCloudletLevelMatric, numberWithCommas,
    renderBarChartCore,
    renderLineChartCore, renderPlaceHolderLottie,
    renderUsageByType2, showToast,
    sortUsageListByType,
    StylesForMonitoring
} from "../PageMonitoringCommonService";
import PageOperMonitoring from "./PageOperMonitoring";
import {Table} from "semantic-ui-react";
import Lottie from "react-lottie";
import type {TypeCloudletUsageList} from "../../../../shared/Types";
import {Progress} from "antd";
import axios from "axios";

export const makeBarChartDataForCloudlet = (usageList, hardwareType, _this) => {
    console.log('renderBarGraph2===>', usageList);
    usageList = sortUsageListByType(usageList, hardwareType)

    if (usageList.length === 0) {
        return (
            <div style={StylesForMonitoring.noData}>
                NO DATA
            </div>
        )
    } else {
        let chartDataList = [];
        chartDataList.push(["Element", hardwareType.toUpperCase() + " USAGE", {role: "style"}, {role: 'annotation'}])
        for (let index = 0; index < usageList.length; index++) {
            if (index < 5) {
                let barDataOne = [
                    usageList[index].cloudlet.toString(),
                    renderUsageByType2(usageList[index], hardwareType),
                    CHART_COLOR_LIST[index],
                    renderUsageLabelByType(usageList[index], hardwareType)
                ]
                chartDataList.push(barDataOne);
            }
        }
        console.log(`renderBarGraphForCloudlet====>${hardwareType}`, chartDataList)

        return renderBarChartCore(chartDataList, hardwareType)
    }
}


export const handleBubbleChartDropDownForCloudlet = async (hwType, _this: PageOperMonitoring) => {
    await _this.setState({
        currentHardwareType: hwType,
    });

    let allUsageList = _this.state.filteredCloudletUsageList;
    let bubbleChartData = [];


    console.log('allUsageList===>', allUsageList);


    if (hwType === 'vCPU') {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: (item.sumVCpuUsage * 1).toFixed(0),
                favor: (item.sumVCpuUsage * 1).toFixed(0),
                fullLabel: item.cloudlet,
            })
        })
    } else if (hwType === HARDWARE_TYPE_FOR_CLOUDLET.MEM) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.sumMemUsage,
                favor: item.sumMemUsage,
                fullLabel: item.cloudlet,
            })
        })
    } else if (hwType === HARDWARE_TYPE_FOR_CLOUDLET.DISK) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.sumDiskUsage,
                favor: item.sumDiskUsage,
                fullLabel: item.cloudlet,
            })
        })
    } else if (hwType === HARDWARE_TYPE_FOR_CLOUDLET.RECV_BYTES) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.sumRecvBytes,
                favor: item.sumRecvBytes,
                fullLabel: item.cloudlet,
            })
        })
    } else if (hwType === HARDWARE_TYPE_FOR_CLOUDLET.SEND_BYTES) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.sumSendBytes,
                favor: item.sumSendBytes,
                fullLabel: item.cloudlet,
            })
        })
    } else if (hwType === HARDWARE_TYPE_FOR_CLOUDLET.FLOATING_IPS) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.sumFloatingIpsUsage,
                favor: item.sumFloatingIpsUsage,
                fullLabel: item.cloudlet,
            })
        })
    } else if (hwType === HARDWARE_TYPE_FOR_CLOUDLET.IPV4) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.sumIpv4Usage,
                favor: item.sumIpv4Usage,
                fullLabel: item.cloudlet,
            })
        })
    }

    console.log('1111bubbleChartData====>', bubbleChartData);

    _this.setState({
        bubbleChartData: bubbleChartData,
    });
}


export const renderBottomGridAreaForCloudlet = (_this: PageOperMonitoring) => {
    return (
        <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing>
            <Table.Header className="viewListTableHeader">
                <Table.Row>
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
            <Table.Body className="tbBodyList" style={{zIndex:99999999999999}} >
                {/*-----------------------*/}
                {/*todo:ROW HEADER        */}
                {/*-----------------------*/}
                {_this.state.loading &&
                <Table.Row className='page_monitoring_popup_table_empty'>
                    <Table.Cell>
                        {renderPlaceHolderLottie()}
                    </Table.Cell>
                </Table.Row>}
                {!_this.state.loading && _this.state.filteredCloudletUsageList.map((item, index) => {
                    return (
                        <Table.Row className='page_monitoring_popup_table_row' style={{zIndex:99999999999999}}>

                            <Table.Cell>
                                {item.cloudlet}
                            </Table.Cell>

                            {/*return numberWithCommas(usageOne.sumVCpuUsage) + ""
                            return numberWithCommas((usageOne.sumMemUsage / 1000000).toFixed(2)) + " MByte"
                            return numberWithCommas(usageOne.sumDiskUsage) + " Byte"
                            return numberWithCommas(usageOne.sumRecvBytes) + " Byte";
                            return numberWithCommas(usageOne.sumSendBytes) + " Byte";
                            return usageOne.sumActiveConnection
                            return usageOne.sumHandledConnection
                            return usageOne.sumAcceptsConnection*/}

                            <Table.Cell>
                                <div>
                                    <div>
                                        {item.sumVCpuUsage.toFixed(0) }
                                    </div>
                                    <div>
                                        <Progress style={{width: '100%'}} strokeLinecap={'square'} strokeWidth={10} showInfo={false}
                                                  percent={(item.sumVCpuUsage / _this.state.maxCpu * 100)}
                                            //percent={(item.sumCpuUsage / this.state.gridInstanceListCpuMax) * 100}
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
                                                  percent={(item.sumMemUsage / _this.state.maxMem * 100)}
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
                                {item.sumFloatingIpsUsage}
                            </Table.Cell>
                            <Table.Cell>
                                {item.sumIpv4Usage}
                            </Table.Cell>
                        </Table.Row>

                    )
                })}
            </Table.Body>
        </Table>
    )
}


export const makeLineChartForCloudlet = (_this: PageOperMonitoring, pUsageList: Array, hardwareType: string) => {

    console.log('usageList22222====>', pUsageList);

    if (pUsageList.length === 0) {
        return (
            <div style={StylesForMonitoring.noData}>
                NO DATA
            </div>
        )
    } else {
        let cloudletName = ''
        let instanceNameList = [];
        let usageSetList = []
        let dateTimeList = []
        for (let i in pUsageList) {
            let series = pUsageList[i].series

            cloudletName = pUsageList[i].cloudlet
            let usageList = [];

            for (let j in series) {

                let usageOne = 0;
                if (hardwareType === HARDWARE_TYPE.VCPU) {
                    usageOne = series[j][USAGE_INDEX.VCPUUSED];
                } else if (hardwareType === HARDWARE_TYPE.MEM_USED) {
                    usageOne = series[j][USAGE_INDEX.MEMUSED];
                } else if (hardwareType === HARDWARE_TYPE.DISK_USED) {
                    usageOne = series[j][USAGE_INDEX.DISKUSED];
                } else if (hardwareType === HARDWARE_TYPE.FLOATING_IPS_USED) {
                    usageOne = series[j][USAGE_INDEX.FLOATINGIPSUSED];
                } else if (hardwareType === HARDWARE_TYPE.IPV4_USED) {
                    usageOne = series[j][USAGE_INDEX.IPV4USED];
                }

                usageList.push(usageOne);


                let dateOne = series[j]["0"];
                dateOne = dateOne.toString().split("T")
                dateTimeList.push(dateOne[1]);
            }

            instanceNameList.push(cloudletName)
            usageSetList.push(usageList);
        }
        //@todo: CUT LIST INTO RECENT_DATA_LIMIT_COUNT
        let newDateTimeList = []
        for (let i in dateTimeList) {
            if (i < RECENT_DATA_LIMIT_COUNT) {
                let splitDateTimeArrayList = dateTimeList[i].toString().split(".");
                let timeOne = splitDateTimeArrayList[0].replace("T", "T");
                newDateTimeList.push(timeOne.toString())//.substring(3, timeOne.length))
            }

        }

        console.log('instanceNameList===>', instanceNameList);
        return renderLineChartCore(instanceNameList, usageSetList, newDateTimeList, hardwareType)
    }
}


export const getCloudletEventLog = async (cloudletSelectedOne, pRegion) => {
    let store = JSON.parse(localStorage.PROJECT_INIT);
    let token = store ? store.userToken : 'null';
    let selectOrg = localStorage.getItem('selectOrg')

    let result = await axios({
        url: '/api/v1/auth/events/cloudlet',
        method: 'post',
        data: {
            "region": pRegion,
            "cloudlet": {
                "operator_key": {
                    "name": selectOrg
                },
                "name": cloudletSelectedOne
            },
            "last": 10
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        timeout: 15 * 1000
    }).then(async response => {


        console.log('response===>Series', response.data.data["0"].Series);

        /*
            "time",
            "cloudlet",
            "operator",
            "event",
            "status"
        */
        if (response.data.data["0"].Series !== null) {
            let values = response.data.data["0"].Series["0"].values
            return values;
        } else {
            return [];
        }

    }).catch(e => {
        // showToast(e.toString())
    })
    return result;
}


export const getClouletLevelUsageList = async (cloudletList, pHardwareType, recentDataLimitCount, pStartTime = '', pEndTime = '') => {

    let instanceBodyList = []
    let store = JSON.parse(localStorage.PROJECT_INIT);
    let token = store ? store.userToken : 'null';
    for (let index = 0; index < cloudletList.length; index++) {
        let instanceInfoOneForm = makeFormForCloudletLevelMatric(cloudletList[index], pHardwareType, token, recentDataLimitCount, pStartTime, pEndTime)
        instanceBodyList.push(instanceInfoOneForm);
    }

    let promiseList = []
    for (let index = 0; index < instanceBodyList.length; index++) {
        promiseList.push(getCloudletLevelMatric(instanceBodyList[index], token))
    }

    let cloudletLevelMatricUsageList = await Promise.all(promiseList);

    console.log('cloudletList===>', cloudletList);


    let usageList = []
    cloudletLevelMatricUsageList.map((item, index) => {

        let Region = cloudletList[index].Region
        if (item.data["0"] !== undefined) {
            let series = item.data["0"].Series["0"].values
            let columns = item.data["0"].Series["0"].columns

            let sumVirtualCpuUsed = 0;
            let sumVirtualCpuMax = 0;
            let sumMemUsed = 0;
            let sumMemMax = 0;
            let sumDiskUsed = 0;
            let sumDiskMax = 0;
            let sumNetSend = 0;
            let sumNetRecv = 0;
            let sumFloatingIpsUsed = 0;
            let sumFloatingIpsMax = 0
            let sumIpv4Used = 0;
            let sumIpv4Max = 0;

            let cloudlet = "";
            let operator = "";
            series.map(item => {
                cloudlet = item[1]
                operator = item[2]

                //todo: CPU
                let vCpuUsed = item["5"];
                let vCpuMax = item["6"];
                sumVirtualCpuUsed += vCpuUsed;
                sumVirtualCpuMax += vCpuMax;

                //todo: MEM
                sumMemUsed += item["7"];
                sumMemMax += item["8"];

                //todo: DISK
                sumDiskUsed += item["9"];
                sumDiskMax += item["10"];

                //todo: NETWORK(RECV,SEND)
                sumNetSend += item["3"];
                sumNetRecv += item["4"];

                //todo: FLOATIP
                sumFloatingIpsUsed += item["11"];
                sumFloatingIpsMax += item["12"];

                //todo: IPV4
                sumIpv4Used += item["13"];
                sumIpv4Max += item["14"];


            })

            usageList.push({
                sumVCpuUsage: sumVirtualCpuUsed / RECENT_DATA_LIMIT_COUNT,
                sumMemUsage: sumMemUsed / RECENT_DATA_LIMIT_COUNT,
                sumDiskUsage: sumDiskUsed / RECENT_DATA_LIMIT_COUNT,
                sumRecvBytes: sumNetRecv / RECENT_DATA_LIMIT_COUNT,
                sumSendBytes: sumNetSend / RECENT_DATA_LIMIT_COUNT,
                sumFloatingIpsUsage: sumFloatingIpsUsed / RECENT_DATA_LIMIT_COUNT,
                sumIpv4Usage: sumIpv4Used / RECENT_DATA_LIMIT_COUNT,
                columns: columns,
                series: series,
                cloudlet: cloudlet,
                operator: operator,
                Region: Region,

            })
        }

    })


    return usageList;

}

