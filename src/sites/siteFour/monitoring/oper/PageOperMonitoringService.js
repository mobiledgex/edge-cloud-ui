import {CHART_COLOR_LIST, HARDWARE_TYPE, RECENT_DATA_LIMIT_COUNT, USAGE_INDEX} from "../../../../shared/Constants";
import React from "react";
import {renderUsageLabelByType, StylesForMonitoring} from "../admin/PageAdminMonitoringService";
import {renderBarChartCore, renderLineChartCore, renderUsageByType2, sortUsageListByType} from "../PageMonitoringCommonService";
import PageOperMonitoring from "./PageOperMonitoring";

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
