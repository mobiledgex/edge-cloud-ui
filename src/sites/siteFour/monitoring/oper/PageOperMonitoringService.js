import {CHART_COLOR_LIST, HARDWARE_TYPE, RECENT_DATA_LIMIT_COUNT, USAGE_INDEX} from "../../../../shared/Constants";
import React from "react";
import {makeFormForCloudletLevelMatric, renderUsageLabelByType} from "../admin/PageAdminMonitoringService";
import {renderBarChartCore, renderLineChartCore, renderUsageByType2, sortUsageListByType, StylesForMonitoring} from "../PageMonitoringCommonService";
import PageOperMonitoring from "./PageOperMonitoring";
import axios from "axios";

export const renderBarGraphForCloudlet = (usageList, hardwareType, _this) => {
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
                    usageList[index].cloudlet.toString().substring(0, 10) + "...",
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


export const renderLineChartForCloudlet = (_this: PageOperMonitoring, pUsageList: Array, hardwareType: string) => {

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

        console.log('instanceNameList===>', instanceNameList);
        return renderLineChartCore(instanceNameList, usageSetList, newDateTimeList, hardwareType)
    }
}

export const getClouletLevelUsageList = async (cloudletList, pHardwareType, recentDataLimitCount, pStartTime = '', pEndTime = '') => {
    let instanceBodyList = []
    let store = JSON.parse(localStorage.PROJECT_INIT);
    let token = store ? store.userToken : 'null';

    console.log('cloudletList===>', cloudletList);

    for (let index = 0; index < cloudletList.length; index++) {
        let instanceInfoOneForm = makeFormForCloudletLevelMatric(cloudletList[index], pHardwareType, token, recentDataLimitCount, pStartTime, pEndTime)
        instanceBodyList.push(instanceInfoOneForm);
    }

    let promiseList = []
    for (let index = 0; index < instanceBodyList.length; index++) {
        promiseList.push(getCloudletLevelMatric(instanceBodyList[index], token))
    }
    console.log('instanceBodyList===>', instanceBodyList)

    let cloudletLevelMatricUsageList = await Promise.all(promiseList);

    console.log('cloudletLevelMatricUsageList===>', cloudletLevelMatricUsageList);

    let usageList = []
    cloudletLevelMatricUsageList.map(item => {

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

        })

    })

    console.log('getClouletLevelUsageList====>', usageList);

    return usageList;

}


export const getCloudletLevelMatric = async (serviceBody: any, pToken: string) => {
    console.log('token2===>', pToken);
    let result = await axios({
        url: '/api/v1/auth/metrics/cloudlet',
        method: 'post',
        data: serviceBody['params'],
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + pToken
        },
        timeout: 15 * 1000
    }).then(async response => {
        return response.data;
    }).catch(e => {
        //showToast(e.toString())
    })
    return result;
}

