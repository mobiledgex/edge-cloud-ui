import {CHART_COLOR_LIST, HARDWARE_TYPE, RECENT_DATA_LIMIT_COUNT, USAGE_INDEX} from "../../../../shared/Constants";
import React from "react";
import {renderUsageLabelByType} from "../admin/PageAdminMonitoringService";
import {renderBarChartCore, renderLineChartCore, renderPlaceHolderCircular, renderUsageByType2, sortUsageListByType, PageMonitoringStyles} from "../PageMonitoringCommonService";
import PageOperMonitoring from "./PageOperMonitoring";
import {Table} from "semantic-ui-react";
import {Progress} from "antd";
import {numberWithCommas} from "../PageMonitoringUtils";

export const makeBarChartDataForCloudlet = (usageList, hardwareType, _this) => {
    usageList = sortUsageListByType(usageList, hardwareType)

    if (usageList.length === 0) {
        return (
            <div style={PageMonitoringStyles.noData}>
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

        return renderBarChartCore(chartDataList, hardwareType)
    }
}

export const handleBubbleChartDropDownForCloudlet = async (hwType, _this: PageOperMonitoring) => {

    let hwTypeKey = '';
    if (hwType === 'vCPU') {
        hwTypeKey = 'sumVCpuUsage'
    } else if (hwType === HARDWARE_TYPE.MEM) {
        hwTypeKey = 'sumMemUsage'
    } else if (hwType === HARDWARE_TYPE.DISK) {
        hwTypeKey = 'sumDiskUsage'
    } else if (hwType === HARDWARE_TYPE.RECVBYTES) {
        hwTypeKey = 'sumRecvBytes'
    } else if (hwType === HARDWARE_TYPE.SENDBYTES) {
        hwTypeKey = 'sumSendBytes'
    } else if (hwType === HARDWARE_TYPE.FLOATING_IPS) {
        hwTypeKey = 'sumFloatingIpsUsage'
    } else if (hwType === HARDWARE_TYPE.IPV4) {
        hwTypeKey = 'sumIpv4Usage'
    }

    let bubbleChartData = [];
    let allUsageList = _this.state.filteredCloudletUsageList;
    allUsageList.map((item, index) => {
        bubbleChartData.push({
            index: index,
            label: item.cloudlet.toString().substring(0, 10) + "...",
            value: item[hwTypeKey],
            favor: item[hwTypeKey],
            fullLabel: item.cloudlet,
        })
    })


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
            <Table.Body className="tbBodyList" style={{zIndex: 99999999999999}}>
                {/*-----------------------*/}
                {/*todo:ROW HEADER        */}
                {/*-----------------------*/}
                {_this.state.loading &&
                <Table.Row className='page_monitoring_popup_table_empty'>
                    <Table.Cell>
                        {renderPlaceHolderCircular()}
                    </Table.Cell>
                </Table.Row>}
                {!_this.state.loading && _this.state.filteredCloudletUsageList.map((item, index) => {
                    return (
                        <Table.Row className='page_monitoring_popup_table_row' style={{zIndex: 99999999999999}}>

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
                                        {item.sumVCpuUsage.toFixed(0)}
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

    if (pUsageList.length === 0) {
        return (
            <div style={PageMonitoringStyles.noData}>
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
        return renderLineChartCore(instanceNameList, usageSetList, newDateTimeList, hardwareType)
    }
}



