import React from 'react';
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import {formatData} from "../../../../services/formatter/formatComputeInstance";
import '../PageMonitoring.css';
import {CHART_COLOR_LIST, HARDWARE_TYPE, RECENT_DATA_LIMIT_COUNT, REGION} from "../../../../shared/Constants";
import {Line as ReactChartJs} from 'react-chartjs-2';
import Lottie from "react-lottie";
import BubbleChart from "../../../../components/BubbleChart";
import {TypeAppInstance} from "../../../../shared/Types";
import PageMonitoring from "./PageAdminMonitoring";
import {numberWithCommas, renderBarChartCore, renderLineChartCore, renderUsageByType2, showToast} from "../PageMonitoringCommonService";
import {SHOW_ORG_CLOUDLET} from "../../../../services/endPointTypes";
import {sendSyncRequest} from "../../../../services/serviceMC";


export const cutArrayList = async (length: number = 5, paramArrayList: any) => {
    let newArrayList = [];
    for (let index in paramArrayList) {
        if (index < 5) {
            newArrayList.push(paramArrayList[index])
        }
    }
    return newArrayList;
}

export const covertToComparableDate = (paramDate) => {
    let arrayDate = paramDate.toString().split("-");
    let compareableFullDate = arrayDate[0] + arrayDate[1] + arrayDate[2]
    return compareableFullDate

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


export const makeFormForCloudletLevelMatric = (dataOne, valid = "*", token, fetchingDataNo = 20, pStartTime = '', pEndTime = '') => {

    return (
        {
            "token": token,
            "params": {
                "region": dataOne.Region,
                "cloudlet": {
                    "operator_key": {
                        "name": dataOne.Operator
                    },
                    "name": dataOne.CloudletName,
                },
                "last": fetchingDataNo,
                "selector": "*"
            }
        }
    )
}


export const isEmpty = (value) => {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }
};


/**
 * @param appInstanceListGroupByCloudlet
 * @param pCloudLet
 * @returns {[]}
 */
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
 * @param pTypeKey
 * @param pTypeValue
 * @returns {*}
 */
export const filterUsageByType = (pTypeKey, pTypeValue, usageList,) => {
    let filteredUsageList = usageList.filter((item) => {
        if (item.instance[pTypeKey] === pTypeValue) {
            return item;
        }
    });
    return filteredUsageList
}

/**
 * todo: Fliter app instace list by cloudlet Value
 * @param appInstanceList
 * @param pCloudLet
 * @returns {[]}
 */
export const filterAppInstanceListByCloudLet = (appInstanceList, pCloudLet = '') => {
    try {
        let instanceListFilteredByCloudlet = []
        appInstanceList.map(item => {
            if (item.Cloudlet === pCloudLet) {
                instanceListFilteredByCloudlet.push(item);
            }
        })
        return instanceListFilteredByCloudlet;
    } catch (e) {

    }
}

export const makeSelectBoxListByInstAppName = (arrList, keyName) => {
    let newArrList = [];
    arrList.map(item => {
        newArrList.push({
            value: item.instance.AppName,
            text: item.instance.AppName,
        })
    })
    return newArrList;
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
 * todo: Filter Instance List by clusterInst value
 * @param appInstanceList
 * @param pCluster
 * @returns {[]}
 */
export const filterAppInstanceListByClusterInst = (appInstanceList, pCluster = '') => {
    let instanceListFilteredByClusterInst = []
    appInstanceList.map(item => {
        if (item.ClusterInst === pCluster) {
            instanceListFilteredByClusterInst.push(item);
        }
    })

    return instanceListFilteredByClusterInst;
}

export const filterAppInstanceListByAppInst = (appInstanceList, pAppInstName = '') => {
    let filteredInstanceList = []
    appInstanceList.map(item => {
        if (item.AppName === pAppInstName) {
            filteredInstanceList.push(item);
        }
    })

    return filteredInstanceList;
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
        } finally {
            //cpuUsageOne = 0;
        }
        return cpuUsageOne;
    }

    if (hardwareType === HARDWARE_TYPE.VCPU) {
        return numberWithCommas(usageOne.sumVCpuUsage) + " %"
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

export const renderLottie = () => {
    return (
        <div style={{position: 'absolute', top: '-20%', left: '48%'}}>
            <div style={{marginLeft: -120, display: 'flex', flexDirection: 'row', marginTop: -170}}>
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
    )
}


export const makeBarChartDataForInst = (usageList, hardwareType, _this) => {

    console.log('renderBarGraphusageList===>', usageList);

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
                let barDataOne = [usageList[index].instance.AppName.toString().substring(0, 10) + "...",
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
                        animationData: require('../../../../lotties/loader001'),
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
export const renderBubbleChart = (_this: PageMonitoring, hardwareType: string, pBubbleChartData: any) => {

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

export const renderBubbleChartForCloudlet = (_this: PageMonitoring, hardwareType: string, pBubbleChartData: any) => {


    console.log('pBubbleChartData====>', pBubbleChartData);


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
                            /*  await _this.setState({
                                  currentAppInst: label,
                                  currentGridIndex: index,
                              })
                              await _this.handleSelectBoxChanges(_this.state.currentRegion, _this.state.currentCloudLet, _this.state.currentCluster, label)*/

                        }}
                        legendClickFun={async (label, index) => {
                            await _this.setState({
                                currentAppInst: label,
                                currentGridIndex: index,
                            })
                            await _this.filterByEachTypes(_this.state.currentRegion, _this.state.currentCloudLet, _this.state.currentCluster, label)

                        }}
                        data={pBubbleChartData}
                    />

                </div>

            </div>
        )
    }


}


export const getMetricsUtilizationAtAtClusterLevel = async (appInstanceOne) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

    let responseRslt = await axios({
        url: '/api/v1/auth/metrics/cloudlet',
        method: 'post',
        data: {
            "region": appInstanceOne.Region,
            "cloudlet": {
                "operator_key": {
                    "name": appInstanceOne.Operator
                },
                "name": appInstanceOne.Cloudlet
            },
            "selector": "utilization",
            "last": 1
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.userToken

        },
        timeout: 15 * 1000
    }).then(async response => {
        return response.data;
    }).catch(e => {
        throw new Error(e)
    })

    return responseRslt;

}


/**
 *
 * @param _this
 * @param hardwareUsageList
 * @param hardwareType
 * @returns {*}
 */
export const makeLineChartDataForAppInst = (_this: PageMonitoring, hardwareUsageList: Array, hardwareType: string) => {
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
    gradient2.addColorStop(1, 'rgba(55,150,0,0)');

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
export const renderSixGridInstanceOnCloudletGrid = (appInstanceListSortByCloudlet, _this) => {

    if (isEmptyObject(appInstanceListSortByCloudlet)) {
        //do something
        return (
            <div style={StylesForMonitoring.noData}>
                NO DATA
            </div>
        )

    } else {

        let cloudletCountList = []
        for (let i in appInstanceListSortByCloudlet) {
            cloudletCountList.push({
                name: appInstanceListSortByCloudlet[i][0].Cloudlet,
                length: appInstanceListSortByCloudlet[i].length,
            })
        }

        function toChunkArray(myArray, chunkSize) {
            let results = [];
            while (myArray.length) {
                results.push(myArray.splice(0, chunkSize));
            }
            return results;
        }

        let chunkedArraysOfColSize = toChunkArray(cloudletCountList, 3);
        return (
            <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                {chunkedArraysOfColSize.map((colSizeArray, index) =>
                    <div className='page_monitoring_grid' key={index.toString()}>
                        {colSizeArray.map((item, index) =>

                            <div className='page_monitoring_grid_box_layout'
                                /* onClick={async () => {
                                     //alert(item.name)
                                     await _this.handleSelectBoxChanges(_this.state.currentRegion, item.name)
                                     setTimeout(() => {
                                         _this.setState({
                                             clusterSelectBoxPlaceholder: 'Select Cluster'
                                         })
                                     }, 1000)
                                 }}*/
                            >
                                <div className='page_monitoring_grid_box'>
                                    <div className='page_monitoring_grid_box_name'>
                                        {item.name}
                                        {/*{item.name.toString().substring(0, 19) + "..."}*/}
                                    </div>
                                    <div className='page_monitoring_grid_box_num'>
                                        {item.length}
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/*@todo:------------------------------------------------------------------*/}
                {/*@todo:Logic to fill 2nd row with blank if only first row exists           */}
                {/*@todo:first row만 존재할경우 2nd row를 공백으로 채워주는 로직                     */}
                {/*@todo:------------------------------------------------------------------*/}
                {chunkedArraysOfColSize.length === 1 &&
                <div className='page_monitoring_grid'>
                    {[1, 2, 3].map((item, index) =>
                        <div className='page_monitoring_grid_box_layout'>

                        </div>
                    )}
                </div>

                }

            </div>
        );
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


export const makeSelectBoxList2 = (arrList, keyName) => {
    let newArrList = [];
    for (let i in arrList) {
        newArrList.push({
            value: arrList[i].instance.AppName,
            text: arrList[i].instance.AppName,
        })
    }
    return newArrList;
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


export const StylesForMonitoring = {
    selectBoxRow: {
        alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', alignSelf: 'center', marginRight: 300,
    },
    tabPaneDiv: {
        display: 'flex', flexDirection: 'row', height: 380,
    },
    selectHeader: {
        color: 'white',
        backgroundColor: '#565656',
        height: 35,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: -10,
        width: 100,
        display: 'flex'
    },
    header00001: {
        fontSize: 21,
        marginLeft: 5,
        color: 'white',
    },
    div001: {
        fontSize: 25,
        color: 'white',
    },
    dropDown: {
        //minWidth: 150,
        minWidth: '350px',
        //fontSize: '12px',
        minHeight: '40px'
        //height: '50px',
    },
    cell000: {
        marginLeft: 0,
        backgroundColor: '#a3a3a3',
        flex: .4,
        alignItems: 'center',
        fontSize: 13,
    },
    noData: {
        fontSize: 30,
        display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', width: '100%'
    },
    cell001: {
        marginLeft: 0,
        backgroundColor: 'transparent',
        flex: .6,
        alignItems: 'center',
        fontSize: 13
    },
    cpuDiskCol001: {
        marginTop: 0, height: 33, width: '100%'
    },
    cell003: {
        color: 'white', textAlign: 'center', fontSize: 12, alignSelf: 'center'
        , justifyContent: 'center', alignItems: 'center', width: '100%', height: 35, marginTop: -9,
    },
    cell004: {
        color: 'white', textAlign: 'center', fontSize: 12, alignSelf: 'center', backgroundColor: 'transparent'
        , justifyContent: 'center', alignItems: 'center', width: '100%', height: 35
    }
}

