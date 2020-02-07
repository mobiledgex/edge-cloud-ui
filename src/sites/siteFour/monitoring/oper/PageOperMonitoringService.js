import {CHART_COLOR_LIST, HARDWARE_TYPE, HARDWARE_TYPE_FOR_CLOUDLET, RECENT_DATA_LIMIT_COUNT, USAGE_INDEX} from "../../../../shared/Constants";
import React from "react";
import {renderUsageLabelByType} from "../admin/PageAdminMonitoringService";
import {
    getCloudletLevelMatric,
    makeFormForCloudletLevelMatric, numberWithCommas,
    renderBarChartCore,
    renderLineChartCore,
    renderUsageByType2,
    sortUsageListByType,
    StylesForMonitoring
} from "../PageMonitoringCommonService";
import PageOperMonitoring from "./PageOperMonitoring";
import {Table} from "semantic-ui-react";
import Lottie from "react-lottie";
import type {TypeCloudletUsageList} from "../../../../shared/Types";
import {Progress} from "antd";

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


export const renderBottomGridAreaForCloudlet = (_this: PageOperMonitoring) => {
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
            <Table.Body className="tbBodyList">


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
                {_this.state.isReady && _this.state.allUsageList.map((item: TypeCloudletUsageList, index) => {
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

