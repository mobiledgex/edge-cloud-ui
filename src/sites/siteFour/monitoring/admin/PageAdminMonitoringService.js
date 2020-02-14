import React from 'react';
import '../PageMonitoring.css';
import {APP_INST_MATRIX_HW_USAGE_INDEX, CHART_COLOR_LIST, HARDWARE_TYPE, RECENT_DATA_LIMIT_COUNT, REGION} from "../../../../shared/Constants";
import Lottie from "react-lottie";
import BubbleChart from "../../../../components/BubbleChart";
import {TypeAppInstance} from "../../../../shared/Types";
import PageAdminMonitoring from "./PageAdminMonitoring";
import {convertByteToMegaByte, numberWithCommas, renderBarChartCore, renderLineChartCore, renderUsageByType2, StylesForMonitoring} from "../PageMonitoringCommonService";
import {TabPanel, Tabs} from "react-tabs";

export const cutArrayList = async (length: number = 5, paramArrayList: any) => {
    let newArrayList = [];
    for (let index in paramArrayList) {
        if (index < 5) {
            newArrayList.push(paramArrayList[index])
        }
    }
    return newArrayList;
}

export const makeFormForAppInstance = (dataOne, valid = "*", token, fetchingDataNo = 20, pStartTime = '', pEndTime = '') => {

    if (pStartTime !== '' && pEndTime !== '') {
        return (
            {
                "token": token,
                "params": {
                    "region": dataOne.Region,
                    "appinst": {
                        "app_key": {
                            "developer_key": {"name": dataOne.OrganizationName},
                            "name": dataOne.AppName.toLowerCase().replace(/\s+/g, ''),
                            "version": dataOne.Version
                        },
                        "cluster_inst_key": {
                            "cluster_key": {"name": dataOne.ClusterInst},
                            "cloudlet_key": {
                                "name": dataOne.Cloudlet,
                                "operator_key": {"name": dataOne.Operator}
                            }
                        }
                    },
                    "selector": valid,
                    "last": fetchingDataNo,
                    "starttime": pStartTime,
                    "endtime": pEndTime,
                }
            }
        )
    } else {
        return (
            {
                "token": token,
                "params": {
                    "region": dataOne.Region,
                    "appinst": {
                        "app_key": {
                            "developer_key": {"name": dataOne.OrganizationName},
                            "name": dataOne.AppName.toLowerCase().replace(/\s+/g, ''),
                            "version": dataOne.Version
                        },
                        "cluster_inst_key": {
                            "cluster_key": {"name": dataOne.ClusterInst},
                            "cloudlet_key": {
                                "name": dataOne.Cloudlet,
                                "operator_key": {"name": dataOne.Operator}
                            }
                        }
                    },
                    "selector": valid,
                    //"last": 25
                    "last": fetchingDataNo,
                }
            }
        )
    }
}


export const filterInstanceCountOnCloutLetOne = (appInstanceListGroupByCloudlet, pCloudLet) => {
    try {
        let filterInstanceCountOnCloutLetOne = [];
        for (let [key, value] of Object.entries(appInstanceListGroupByCloudlet)) {
            if (key === pCloudLet) {
                filterInstanceCountOnCloutLetOne.push(value)
                break;
            }
        }
        return filterInstanceCountOnCloutLetOne;
    } catch (e) {
        //throw new Error(e.toString())
    }

}

/**
 *
 * @param usageList
 * @param pFilterKey
 * @param pTypeValue
 * @returns {*}
 */
export const filterListBykey = (pFilterKey, pTypeValue, usageList,) => {
    let filteredUsageList = usageList.filter((item) => {
        if (item.instance[pFilterKey] === pTypeValue) {
            return item;
        }
    });
    return filteredUsageList
}

export const filterListBykeyForCloudlet = (pFilterKey, selectedCloudletOne, usageList,) => {
    let filteredUsageList = usageList.filter((item) => {
        if (item[pFilterKey] === selectedCloudletOne) {
            return item;
        }
    });
    return filteredUsageList
}


/**
 *
 * @param appInstanceList
 * @param pCloudLet
 * @param classification
 * @returns {[]}
 */
export const filterAppInstanceListByClassification = (appInstanceList, pCloudLet = '', classification) => {
    try {
        let instanceListFilteredByCloudlet = []
        appInstanceList.map(item => {
            if (item[classification] === pCloudLet) {
                instanceListFilteredByCloudlet.push(item);
            }
        })
        return instanceListFilteredByCloudlet;
    } catch (e) {
    }
}


/**
 * @todo: Remove duplicates from an array.
 * @param names
 * @returns {string[]}
 */
function removeDups(names) {
    let unique = {};
    names.forEach(function (i) {
        if (!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
}

/**
 * @todo 클러스트 리스트 셀렉트 박스 형태의 리스트를 만들어준다..
 * @param appInstanceList
 * @param pCloudLet
 * @returns {[]}
 */
export const makeClusterListSelectBox = (appInstanceList, pCloudLet) => {

    let instanceListFilteredByCloudLet = []
    appInstanceList.map(item => {
        if (item.Cloudlet === pCloudLet) {
            instanceListFilteredByCloudLet.push(item);
        }
    })

    let filteredClusterList = []
    instanceListFilteredByCloudLet.map(item => {
        filteredClusterList.push(item.ClusterInst)
    })


    let uniqueClusterList = removeDups(filteredClusterList);
    let clusterSelectBoxData = []
    uniqueClusterList.map(item => {
        let selectOne = {
            value: item,
            text: item,
        }
        clusterSelectBoxData.push(selectOne);
    })

    return clusterSelectBoxData;
}

/**
 * @todo : Process clusterlet list into select box
 * @param appInstanceList
 * @returns {[]}
 */
export const makeCloudletListSelectBox = (appInstanceList) => {
    let cloudletList = []
    appInstanceList.map(item => {
        cloudletList.push(item.Cloudlet)
    })
    //@todo Deduplication
    let uniquedCloudletList = cloudletList.filter(function (item, pos) {
        return cloudletList.indexOf(item) == pos;
    })

    let cloudletListForSelectbox = []
    uniquedCloudletList.map(item => {
        let selectOne = {
            value: item,
            text: item,
        }
        cloudletListForSelectbox.push(selectOne);
    })

    return cloudletListForSelectbox;
}


/**
 *
 * @param usageOne
 * @param hardwareType
 * @returns {string}
 */
export const renderUsageLabelByType = (usageOne, hardwareType) => {
    if (hardwareType === HARDWARE_TYPE.CPU) {
        let cpuUsageOne = '';
        try {
            cpuUsageOne = (usageOne.sumCpuUsage * 1).toFixed(2) + " %";
        } catch (e) {
            cpuUsageOne = 0;
        }
        return cpuUsageOne;
    }

    if (hardwareType === HARDWARE_TYPE.VCPU) {
        return numberWithCommas(usageOne.sumVCpuUsage) + ""
    }

    if (hardwareType === HARDWARE_TYPE.MEM) {
        return numberWithCommas((usageOne.sumMemUsage / 1000000).toFixed(2)) + " %"
    }

    if (hardwareType === HARDWARE_TYPE.DISK) {
        return numberWithCommas(usageOne.sumDiskUsage) + " Byte"
    }

    if (hardwareType === HARDWARE_TYPE.RECV_BYTES) {
        return numberWithCommas(usageOne.sumRecvBytes) + " Byte";
    }

    if (hardwareType === HARDWARE_TYPE.SEND_BYTES) {
        return numberWithCommas(usageOne.sumSendBytes) + " Byte";
    }

    if (hardwareType === HARDWARE_TYPE.ACTIVE_CONNECTION) {
        return usageOne.sumActiveConnection
    }

    if (hardwareType === HARDWARE_TYPE.HANDLED_CONNECTION) {
        return usageOne.sumHandledConnection
    }

    if (hardwareType === HARDWARE_TYPE.ACCEPTS_CONNECTION) {
        return usageOne.sumAcceptsConnection
    }


}

export const makeBarChartDataForInst = (usageList, hardwareType, _this) => {

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
                let barDataOne = [usageList[index].instance.AppName.toString().substring(0, 10),
                    renderUsageByType2(usageList[index], hardwareType),
                    CHART_COLOR_LIST[index],
                    renderUsageLabelByType(usageList[index], hardwareType)]
                chartDataList.push(barDataOne);
            }
        }

        return renderBarChartCore(chartDataList, hardwareType)
    }


}


/**
 * bottom Grid InstanceList maker..
 * @returns {[]}
 */
export const makeGridInstanceList = (usageList: Array) => {
    let allCpuUsageList = usageList[0]
    let allMemUsageList = usageList[1]
    let allNetworkUsageList = usageList[2]
    let allDiskUsageList = usageList[3]
    let allConnectionsList = usageList[4]

    let gridInstanceList = []
    allCpuUsageList.map((item, index) => {
        gridInstanceList.push({
            instance: item.instance,
            sumCpuUsage: item.sumCpuUsage,
            sumDiskUsage: allDiskUsageList[index].sumDiskUsage,
            sumMemUsage: allMemUsageList[index].sumMemUsage,
            sumRecvBytes: allNetworkUsageList[index].sumRecvBytes,
            sumSendBytes: allNetworkUsageList[index].sumSendBytes,
            sumActiveConnection: allConnectionsList[index].sumActiveConnection,
            sumHandledConnection: allConnectionsList[index].sumHandledConnection,
            sumAcceptsConnection: allConnectionsList[index].sumAcceptsConnection,
        })
    })
    return gridInstanceList;
}


/**
 * @todo: 로딩이 완료 되기전에 placeholder2를 보여준다..
 * @returns {*}
 */
export const renderPlaceHolder2 = () => {
    let boxWidth = window.innerWidth * 0.3;
    return (
        <div style={{width: 350, height: 250, backgroundColor: 'black'}}>
            <div style={{marginTop: 0}}>
                <Lottie
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: require('../../../../lotties/13255-loader22'),
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice'
                        }
                    }}
                    height={150}
                    width={150}
                    isStopped={false}
                    isPaused={false}
                    style={{marginTop: 0,}}
                />
            </div>
        </div>
    )
}


/**
 * @todo : app instance(COMPUTER engine) SPEC 더 낳은것이(큰것이) performanceValue 높다....
 * @param flavor
 * @returns {number}
 */
export const instanceFlavorToPerformanceValue = (flavor) => {
    let performanceValue = 0;
    if (flavor === 'm4.medium') {
        performanceValue = 1
    } else if (flavor === 'x1.medium') {
        performanceValue = 2
    } else if (flavor === 'x1.large') {
        performanceValue = 3
    } else {
        performanceValue = 0
    }
    return performanceValue;
}


/**
 * @todo: LeftTop의 클라우듯렛웨에 올라가는 인스턴스 리스트를 필터링 처리하는 로직.
 * @param CloudLetOneList
 * @returns {[]}
 */
export const filterAppInstOnCloudlet = (CloudLetOneList, pCluster) => {
    try {
        let filteredAppInstOnCloudlet = []
        CloudLetOneList.map(item => {
            if (item.ClusterInst === pCluster) {
                filteredAppInstOnCloudlet.push(item);
            }
        })
        return filteredAppInstOnCloudlet;
    } catch (e) {

    }

}

/**
 * todo: render a bubble chart with https://github.com/weknowinc/react-bubble-chart-d3
 * @returns {*}
 */
export const renderBubbleChart = (_this: PageAdminMonitoring, hardwareType: string, pBubbleChartData: any) => {

    if (pBubbleChartData.length === 0) {
        return (
            <div style={StylesForMonitoring.noData}>
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
                        bubbleClickFun={async (label, index) => {
                        }}
                        legendClickFun={async (label, index) => {
                        }}
                        data={pBubbleChartData}
                    />

                </div>

            </div>
        )
    }
}

export const renderBubbleChartForCloudlet = (_this: PageAdminMonitoring, hardwareType: string, pBubbleChartData: any) => {
    if (pBubbleChartData.length === 0 && _this.loading === false) {
        return (
            <div style={StylesForMonitoring.noData}>
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
            <div style={{display: 'flex', flexDirection: 'row', zIndex: 1}}>
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
                        bubbleClickFun={async (label, index) => {

                        }}
                        legendClickFun={async (label, index) => {

                        }}
                        data={pBubbleChartData}
                    />

                </div>

            </div>
        )
    }


}


export const makeLineChartDataForAppInst = (_this: PageAdminMonitoring, hardwareUsageList: Array, hardwareType: string) => {
    try {
        if (hardwareUsageList.length === 0) {
            return (
                <div style={StylesForMonitoring.noData}>
                    NO DATA
                </div>
            )
        } else {

            console.log('hardwareUsageList===>', hardwareUsageList);
            console.log('hardwareUsageList===hardwareType>', hardwareType);


            let instanceAppName = ''
            let instanceNameList = [];
            let usageSetList = []
            let dateTimeList = []
            for (let i in hardwareUsageList) {
                let seriesValues = hardwareUsageList[i].values

                instanceAppName = hardwareUsageList[i].instance.AppName
                let usageList = [];

                for (let j in seriesValues) {
                    /*
                      @todo: 하드웨어 매트릭 인덱스에 대한 상수처
                      0: "time"
                      1: "app"
                      2: "cluster"
                      3: "dev"
                      4: "cloudlet"
                      5: "operator"
                      6: "cpu"
                      7: "mem"
                      8: "disk"
                      9: "sendBytes"
                      10: "recvBytes"
                      11: "port"
                      12: "active"
                      13: "handled"
                      14: "accepts"
                      15: "bytesSent"
                      16: "bytesRecvd"*/
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

    } catch (e) {

    }

}





export const makeNetworkBarData = (networkUsageList, hwType) => {
    let chartDataList = [];
    chartDataList.push(["Element", hwType + " USAGE", {role: "style"}, {role: 'annotation'}])

    for (let index = 0; index < networkUsageList.length; index++) {
        if (index < 5) {
            let barDataOne = [
                networkUsageList[index].instance.AppName.toString().substring(0, 10) + "...",
                hwType === HARDWARE_TYPE.RECV_BYTES ? networkUsageList[index].sumRecvBytes : networkUsageList[index].sumSendBytes,
                CHART_COLOR_LIST[index],
                hwType === HARDWARE_TYPE.RECV_BYTES ? networkUsageList[index].sumRecvBytes : networkUsageList[index].sumSendBytes,
            ]
            chartDataList.push(barDataOne);
        }
    }


    return chartDataList;

}

export const makeNetworkLineChartData = (filteredNetworkUsageList, pHardwareType = HARDWARE_TYPE.RECV_BYTES) => {
    let instanceAppName = ''
    let instanceNameList = [];
    let usageSetList = []
    let dateTimeList = []

    for (let i in filteredNetworkUsageList) {
        let seriesValues = filteredNetworkUsageList[i].values
        instanceAppName = filteredNetworkUsageList[i].instance.AppName
        let usageList = [];

        for (let j in seriesValues) {

            let usageOne = 0;
            if (pHardwareType === HARDWARE_TYPE.RECV_BYTES) {
                //console.log('pHardwareType===>', pHardwareType);
                usageOne = seriesValues[j]["12"];//receivceBytes -> index12

            } else {
                usageOne = seriesValues[j]["13"]; //sendBytes -> index13
                //console.log('usageOne===>', usageOne);
            }
            usageList.push(usageOne);
            let dateOne = seriesValues[j]["0"];
            dateOne = dateOne.toString().split("T")

            dateTimeList.push(dateOne[1]);
        }

        instanceNameList.push(instanceAppName)
        usageSetList.push(usageList);
    }


    //@todo: CUST LIST INTO RECENT_DATA_LIMIT_COUNT
    let newDateTimeList = []
    for (let i in dateTimeList) {
        if (i < RECENT_DATA_LIMIT_COUNT) {
            let splitDateTimeArrayList = dateTimeList[i].toString().split(".");
            let timeOne = splitDateTimeArrayList[0].replace("T", "T");
            newDateTimeList.push(timeOne.toString())//.substring(3, timeOne.length))
        }

    }
    let finalSeriesDataSets = [];
    for (let i in usageSetList) {
        //@todo: top5 만을 추린다
        if (i < 5) {
            let datasetsOne = {
                label: instanceNameList[i],
                borderColor: CHART_COLOR_LIST[i],
                borderWidth: 2,
                pointColor: "#fff",
                pointStrokeColor: 'white',
                pointHighlightFill: "#fff",
                pointHighlightStroke: 'white',
                data: usageSetList[i],
                radius: 0,
                pointRadius: 1,
            }

            finalSeriesDataSets.push(datasetsOne)
        }

    }

    let lineChartData = {
        labels: newDateTimeList,
        datasets: finalSeriesDataSets,
    }

    return lineChartData;

}

function isEmptyObject(obj) {
    //Loop through and check if a property
    //exists
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            //Property exists, object is not empty,
            //so return FALSE.
            return false;
        }
    }
    //No properties were found, so return TRUE
    return true;
}


/**
 * @desc: Render the number of instances on the cloudlet at the top left of the monitoring page ...
 * @param appInstanceListSortByCloudlet
 * @returns {*}
 */
export const renderSixGridForAppInstOnCloudlet = (appInstanceListSortByCloudlet, _this: PageAdminMonitoring) => {

    let cloudletListLength = Object.keys(appInstanceListSortByCloudlet).length
    if (isEmptyObject(appInstanceListSortByCloudlet)) {
        //do something
        return (
            <div style={StylesForMonitoring.noData}>
                NO DATA
            </div>
        )

    } else {

        let cloudletList = []
        for (let i in appInstanceListSortByCloudlet) {
            cloudletList.push({
                name: appInstanceListSortByCloudlet[i][0].Cloudlet,
                length: appInstanceListSortByCloudlet[i].length,
            })
        }

        let chunkedCloudletListOfColSize = toChunkArray(cloudletList, 6);


        return (
            <Tabs selectedIndex={_this.state.currentSixGridIndex} className='page_monitoring_tab'>

                {/*todo:###############################..*/}
                {/*todo:그리드를 페이지(tab)당 6개씩 그리는 부분..*/}
                {/*todo:###############################..*/}
                {chunkedCloudletListOfColSize.map((listItem, index) => {
                    return (
                        <TabPanel className='page_monitoring_tab_with_pager'>
                            {renderGrid(listItem)}
                        </TabPanel>
                    )
                })}


                {/*todo:#####################..*/}
                {/*todo:하단의 dot paging ..*/}
                {/*todo:#####################..*/}
                {cloudletListLength > 6 &&
                <div className='page_monitoring_pager_row'>
                    {chunkedCloudletListOfColSize.map((item, index) => {
                        return (
                            <div
                                style={{display: 'flex', margin: '0 5px'}}
                                onClick={() => {
                                    _this.setState({
                                        currentSixGridIndex: index,
                                    })
                                }}
                            >
                                {/*todo:#####################..*/}
                                {/*todo:선택된 index는 그린Color */}
                                {/*todo:#####################..*/}
                                <div className='page_monitoring_pager_btn' style={{backgroundColor: _this.state.currentSixGridIndex === index ? 'rgba(136,221,0,.9)' : 'rgba(255,255,255,.5)'}}/>
                            </div>
                        )
                    })}
                </div>
                }

            </Tabs>
        )

    }


    function toChunkArray(myArray, chunkSize) {
        let results = [];
        while (myArray.length) {
            results.push(myArray.splice(0, chunkSize));
        }
        return results;
    }


    function renderGrid(pListItem) {
        return (
            <div className='page_monitoring_grid_wrap'>
                {pListItem.map((item, index) =>
                    <div className='page_monitoring_grid_box_layout'>
                        <div className='page_monitoring_grid_box'>
                            <div className='page_monitoring_grid_box_name'>
                                {item.name}
                            </div>
                            <div className='page_monitoring_grid_box_num'>
                                {item.length}
                            </div>

                        </div>
                    </div>
                )}
            </div>
        )
    }

}


/**
 * @todo: 앱의 인스턴스 리스트를 리전에 맞게 필터링처리..
 * @param pRegion
 * @param appInstanceList
 * @returns {TypeAppInstance[]|Array<TypeAppInstance>}
 */
export const filterAppInstanceListByRegion = (pRegion, appInstanceList) => {
    if (pRegion === REGION.ALL) {
        return appInstanceList;
    } else {
        let filteredAppInstanceList = appInstanceList.filter((item) => {
            if (item.Region === pRegion) {
                return item;
            }
        });
        return filteredAppInstanceList;
    }
}

/**
 * @todo: Cpu/Mem 사용량을 리전별로 필터링
 * @param pRegion
 * @param usageList
 * @returns {*}
 */
export const filterUsageListByRegion = (pRegion, usageList) => {
    if (pRegion === REGION.ALL) {
        return usageList;
    } else {
        let filteredUsageListByRegion = usageList.filter((item) => {
            if (item.instance.Region === pRegion) {
                return item;
            }
        });
        return filteredUsageListByRegion;
    }
}


/**
 * 시간을 request요청에 맞게끔 변경 처리
 * @param date
 * @returns {string}
 */
export const makeCompleteDateTime = (date: string) => {
    let arrayDate = date.split(" ");
    let completeDateTimeString = arrayDate[0] + "T" + arrayDate[1] + ":00Z";
    return completeDateTimeString;
}


