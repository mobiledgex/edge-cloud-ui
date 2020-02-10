import React from 'react';
import axios from "axios";
import {formatData} from "../../../../services/formatter/formatComputeInstance";
import '../PageMonitoring.css';
import {CHART_COLOR_LIST, HARDWARE_TYPE, RECENT_DATA_LIMIT_COUNT, REGION} from "../../../../shared/Constants";
import Lottie from "react-lottie";
import BubbleChart from "../../../../components/BubbleChart";
import {TypeAppInstance} from "../../../../shared/Types";
import PageAdminMonitoring from "./PageAdminMonitoring";
import {numberWithCommas, renderBarChartCore, renderLineChartCore, renderUsageByType2, showToast, StylesForMonitoring} from "../PageMonitoringCommonService";
import {SHOW_CLOUDLET, SHOW_ORG_CLOUDLET} from "../../../../services/endPointTypes";
import {sendSyncRequest} from "../../../../services/serviceMC";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {Icon} from "semantic-ui-react";

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
        return numberWithCommas((usageOne.sumMemUsage / 1000000).toFixed(2)) + " MByte"
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


export const makeLineChartDataForAppInst = (_this: PageAdminMonitoring, hardwareUsageList: Array, hardwareType: string) => {
    if (hardwareUsageList.length === 0) {
        return (
            <div style={StylesForMonitoring.noData}>
                NO DATA
            </div>
        )
    } else {
        let instanceAppName = ''
        let instanceNameList = [];
        let usageSetList = []
        let dateTimeList = []
        for (let i in hardwareUsageList) {
            let seriesValues = hardwareUsageList[i].values

            instanceAppName = hardwareUsageList[i].instance.AppName
            let usageList = [];

            for (let j in seriesValues) {

                let usageOne = 0;
                if (hardwareType === HARDWARE_TYPE.CPU) {
                    usageOne = seriesValues[j]["6"];
                } else if (hardwareType === HARDWARE_TYPE.RECV_BYTES) {
                    usageOne = seriesValues[j]["13"];//receivceBytes
                } else if (hardwareType === HARDWARE_TYPE.SEND_BYTES) {
                    usageOne = seriesValues[j]["12"]; //sendBytes
                } else if (hardwareType === HARDWARE_TYPE.MEM) {
                    usageOne = seriesValues[j]["10"]; //mem usage
                } else if (hardwareType === HARDWARE_TYPE.DISK) {
                    usageOne = seriesValues[j]["8"];
                } else if (hardwareType === HARDWARE_TYPE.ACTIVE_CONNECTION) {
                    usageOne = seriesValues[j]["12"];
                } else if (hardwareType === HARDWARE_TYPE.HANDLED_CONNECTION) {
                    usageOne = seriesValues[j]["13"];
                } else if (hardwareType === HARDWARE_TYPE.ACCEPTS_CONNECTION) {
                    usageOne = seriesValues[j]["14"];
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

function makeAppInstOnCloudletList() {
    /* let cloutletKeyList = Object.keys(appInstanceListGroupByCloudlet)

     let newCloudletList = []
     cloutletKeyList.map((key, index) => {

         console.log('index===>', index);

         let count = appInstanceListGroupByCloudlet[key].length
         let cloudletList = appInstanceListGroupByCloudlet[key];

         console.log('count===>', count);

         newCloudletList.push({
             count: count,
             instanceOne: allCloudletList[index],
             cloudletList:cloudletList,
         })
     })

     console.log('newCloudletList===>', newCloudletList);*/
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
                <div className='page_monitoring_pager_row'>
                    {chunkedCloudletListOfColSize.map((item, index) => {
                        return (
                            <div
                                style={{display: 'flex', margin:'0 5px'}}
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
                        <div className='page_monitoring_grid_box' >
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

export const getCloudletList = async () => {
    try {
        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        //data: { region: region, org: _self.props.selectOrg || localStorage.selectOrg }

        let requestData = {token: token, method: SHOW_ORG_CLOUDLET, data: {region: REGION.EU, org: localStorage.selectOrg}};
        let requestData2 = {token: token, method: SHOW_ORG_CLOUDLET, data: {region: REGION.US, org: localStorage.selectOrg}};
        let promiseList = []

        promiseList.push(sendSyncRequest(this, requestData))
        promiseList.push(sendSyncRequest(this, requestData2))
        let orgCloudletList = await Promise.all(promiseList);
        console.log('results===EU>', orgCloudletList[0].response.data);
        console.log('results===US>', orgCloudletList[1].response.data);

        let cloudletEU = orgCloudletList[0].response.data;
        let cloudletUS = orgCloudletList[1].response.data;

        let mergedCloudletList = [];
        orgCloudletList.map(item => {
            //@todo : null check
            if (item.response.data["0"].Region !== '') {
                let cloudletList = item.response.data;
                cloudletList.map(item => {
                    mergedCloudletList.push(item);
                })
            }
        })

        let mergedOrgCloudletList = []
        mergedCloudletList.map(item => {
            if (item.Operator === localStorage.selectOrg) {
                mergedOrgCloudletList.push(item)
            }
        })

        console.log('mergedOrgCloudletList===>', mergedOrgCloudletList);

        return mergedOrgCloudletList;
    } catch (e) {

    }
}

export const getCloudletListAll = async () => {
    try {

        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        //data: { region: region, org: _self.props.selectOrg || localStorage.selectOrg }

        let requestData = {token: token, method: SHOW_CLOUDLET, data: {region: REGION.EU}};
        let requestData2 = {token: token, method: SHOW_CLOUDLET, data: {region: REGION.US}};
        let promiseList = []

        promiseList.push(sendSyncRequest(this, requestData))
        promiseList.push(sendSyncRequest(this, requestData2))
        let orgCloudletList = await Promise.all(promiseList);
        console.log('results===EU>', orgCloudletList[0].response.data);
        console.log('results===US>', orgCloudletList[1].response.data);

        let cloudletEU = orgCloudletList[0].response.data;
        let cloudletUS = orgCloudletList[1].response.data;

        let mergedCloudletList = [];
        orgCloudletList.map(item => {
            //@todo : null check
            if (item.response.data["0"].Region !== '') {
                let cloudletList = item.response.data;
                cloudletList.map(item => {
                    mergedCloudletList.push(item);
                })
            }
        })


        return mergedCloudletList;
    } catch (e) {

    }
}


/**
 * @todo : fetch App Instance List BY region
 * @param pArrayRegion
 * @returns {Promise<[]>}
 */
export const getAppInstList = async (pArrayRegion = ['EU', 'US']) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    let mergedAppInstanceList = [];

    for (let index = 0; index < pArrayRegion.length; index++) {
        let serviceBody = {
            "token": store.userToken,
            "params": {
                "region": pArrayRegion[index],
                "appinst": {
                    "key": {
                        "app_key": {
                            "developer_key": {"name": localStorage.selectOrg},
                        }
                    }
                }
            }
        }

        let responseResult = await axios({
            url: '/api/v1/auth/ctrl/ShowAppInst',
            method: 'post',
            data: serviceBody['params'],
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + store.userToken
            },
            timeout: 15 * 1000
        }).then(async response => {
            let parseData = JSON.parse(JSON.stringify(response));
            if (parseData.data === '') {
                return null;
            } else {
                let finalizedJSON = formatData(parseData, serviceBody)
                return finalizedJSON;
            }

        }).catch(e => {
            showToast(e.toString())
        }).finally(() => {

        })

        if (responseResult !== null) {
            let mergedList = mergedAppInstanceList.concat(responseResult);
            mergedAppInstanceList = mergedList;
        }

    }
    return mergedAppInstanceList;
}

/**
 *
 * @param serviceBodyForAppInstanceOneInfo
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAppLevelMetrics = async (serviceBodyForAppInstanceOneInfo: any) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    let result = await axios({
        url: '/api/v1/auth/metrics/app',
        method: 'post',
        data: serviceBodyForAppInstanceOneInfo['params'],
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.userToken
        },
        timeout: 30 * 1000
    }).then(async response => {
        return response.data;
    }).catch(e => {
        //throw new Error(e)
        //showToast(e.toString())
    })
    return result;
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


export const getAppLevelUsageList = async (appInstanceList, pHardwareType, recentDataLimitCount, pStartTime = '', pEndTime = '') => {

    let instanceBodyList = []
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;
    for (let index = 0; index < appInstanceList.length; index++) {
        //todo: Create a data FORM format for requests
        let instanceInfoOneForm = makeFormForAppInstance(appInstanceList[index], pHardwareType, store.userToken, recentDataLimitCount, pStartTime, pEndTime)
        instanceBodyList.push(instanceInfoOneForm);
    }

    let promiseList = []
    for (let index = 0; index < instanceBodyList.length; index++) {
        promiseList.push(getAppLevelMetrics(instanceBodyList[index]))
    }
    //todo: Bring health check list(cpu,mem,network,disk..) to the number of apps instance, by parallel request

    let appInstanceHealthCheckList = []
    try {
        appInstanceHealthCheckList = await Promise.all(promiseList);
    } catch (e) {
        throw new Error(e)
    }

    let usageListForAllInstance = []
    appInstanceList.map((item, index) => {
        usageListForAllInstance.push({
            instanceData: appInstanceList[index],
            appInstanceHealth: appInstanceHealthCheckList[index],
        });
    })


    let cpuUsageList = []
    let memUsageList = [];
    let diskUsageList = [];
    let networkUsageList = [];
    let connectionsUsageList = [];
    let matrixedUsageList = []
    usageListForAllInstance.map((item, index) => {
        let appName = item.instanceData.AppName;
        let sumMemUsage = 0;
        let sumDiskUsage = 0;
        let sumRecvBytes = 0;
        let sumSendBytes = 0;
        let sumCpuUsage = 0;

        let sumActiveConnection = 0;
        let sumHandledConnection = 0
        let sumAcceptsConnection = 0

        if (item.appInstanceHealth !== undefined) {

            let series = item.appInstanceHealth.data["0"].Series;
            if (series !== null) {
                //@todo###########################
                //@todo makeCpuSeriesList
                //@todo###########################
                if (series["3"] !== undefined) {
                    let cpuSeries = series["3"]
                    cpuSeries.values.map(item => {
                        let cpuUsage = item[6];//cpuUsage..index
                        sumCpuUsage += cpuUsage;
                    })

                    cpuUsageList.push({
                        instance: item.instanceData,
                        columns: cpuSeries.columns,
                        sumCpuUsage: sumCpuUsage / RECENT_DATA_LIMIT_COUNT,
                        values: cpuSeries.values,
                        appName: appName,

                    })
                }


                //@todo###########################
                //@todo MemSeriesList
                //@todo###########################
                if (series["1"] !== undefined) {
                    let memSeries = series["1"]
                    memSeries.values.map(item => {
                        let usageOne = item[7];//memUsage..index
                        sumMemUsage += usageOne;
                    })

                    memUsageList.push({
                        instance: item.instanceData,
                        columns: memSeries.columns,
                        sumMemUsage: Math.ceil(sumMemUsage / RECENT_DATA_LIMIT_COUNT),
                        values: memSeries.values,
                        appName: appName,
                    })
                }


                //@todo###########################
                //@todo DiskSeriesList
                //@todo###########################
                if (series["2"] !== undefined) {
                    let diskSeries = series["2"]
                    diskSeries.values.map(item => {
                        let usageOne = item[8];//diskUsage..index
                        sumDiskUsage += usageOne;
                    })

                    diskUsageList.push({
                        instance: item.instanceData,
                        columns: diskSeries.columns,
                        sumDiskUsage: Math.ceil(sumDiskUsage / RECENT_DATA_LIMIT_COUNT),
                        values: diskSeries.values,
                        appName: appName,
                    })

                }
                //@todo###############################
                //@todo NetworkUSageList
                //@todo##############################
                if (series["0"] !== undefined) {
                    let networkSeries = series["0"]
                    networkSeries.values.map(item => {
                        let sendBytesOne = item[9];//sendBytesOne
                        sumSendBytes += sendBytesOne;
                        let recvBytesOne = item[10];//recvBytesOne
                        sumRecvBytes += recvBytesOne;

                    })

                    networkUsageList.push({
                        instance: item.instanceData,
                        columns: networkSeries.columns,
                        sumRecvBytes: Math.ceil(sumRecvBytes / RECENT_DATA_LIMIT_COUNT),
                        sumSendBytes: Math.ceil(sumSendBytes / RECENT_DATA_LIMIT_COUNT),
                        values: networkSeries.values,
                        appName: appName,
                    })
                }


                //@todo###############################
                //@todo connectionsUsageList [4]
                //@todo##############################
                if (series["4"] !== undefined) {
                    let connectionsSeries = series["4"]
                    connectionsSeries.values.map(item => {
                        let connection1One = item[12];//1
                        sumActiveConnection += connection1One;
                        let connection2One = item[13];//2
                        sumHandledConnection += connection2One;
                        let connection3One = item[14];//3
                        sumAcceptsConnection += connection3One;
                    })

                    connectionsUsageList.push({
                        instance: item.instanceData,
                        columns: connectionsSeries.columns,
                        sumActiveConnection: Math.ceil(sumActiveConnection / RECENT_DATA_LIMIT_COUNT),
                        sumHandledConnection: Math.ceil(sumHandledConnection / RECENT_DATA_LIMIT_COUNT),
                        sumAcceptsConnection: Math.ceil(sumAcceptsConnection / RECENT_DATA_LIMIT_COUNT),
                        values: connectionsSeries.values,
                        appName: appName,
                    })
                } else {
                    connectionsUsageList.push({
                        instance: item.instanceData,
                        columns: "",
                        sumActiveConnection: 0,
                        sumHandledConnection: 0,
                        sumAcceptsConnection: 0,
                        values: [],
                        appName: appName,
                    })
                }

            } else {//@todo: If series data is null
                cpuUsageList.push({
                    instance: item.instanceData,
                    columns: "",
                    sumCpuUsage: 0,
                    values: [],
                    appName: appName,

                })

                memUsageList.push({
                    instance: item.instanceData,
                    columns: "",
                    sumMemUsage: 0,
                    values: [],
                    appName: appName,

                })

                diskUsageList.push({
                    instance: item.instanceData,
                    columns: "",
                    sumDiskUsage: 0,
                    values: [],
                    appName: appName,
                })

                networkUsageList.push({
                    instance: item.instanceData,
                    columns: "",
                    sumRecvBytes: 0,
                    sumSendBytes: 0,
                    values: [],
                    appName: appName,
                })

                connectionsUsageList.push({
                    instance: item.instanceData,
                    columns: "",
                    sumActiveConnection: 0,
                    sumHandledConnection: 0,
                    sumAcceptsConnection: 0,
                    values: [],
                    appName: appName,
                })
            }
        }

    })

    //@todo :##################################
    //@todo : Sort usage in reverse order.
    //@todo :##################################
    cpuUsageList.sort((a, b) => b.sumCpuUsage - a.sumCpuUsage);
    memUsageList.sort((a, b) => b.sumMemUsage - a.sumMemUsage);
    networkUsageList.sort((a, b) => b.sumRecvBytes - a.sumRecvBytes)
    diskUsageList.sort((a, b) => b.sumDiskUsage - a.sumDiskUsage);
    connectionsUsageList.sort((a, b) => b.sumHandledConnection - a.sumHandledConnection);
    matrixedUsageList.push(cpuUsageList)
    matrixedUsageList.push(memUsageList)
    matrixedUsageList.push(networkUsageList)
    matrixedUsageList.push(diskUsageList)
    matrixedUsageList.push(connectionsUsageList)
    return matrixedUsageList;
}

