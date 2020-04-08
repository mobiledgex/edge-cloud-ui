import 'react-hot-loader';

import React from 'react';
import '../PageMonitoring.css';
import {
    APP_INST_MATRIX_HW_USAGE_INDEX,
    CHART_COLOR_LIST,
    CLASSIFICATION,
    HARDWARE_TYPE,
    RECENT_DATA_LIMIT_COUNT,
    USAGE_INDEX_FOR_CLUSTER
} from "../../../../shared/Constants";
import BubbleChart from "../../../../components/BubbleChart";
import PageDevMonitoring from "./PageDevMonitoring";
import {convertByteToMegaByte, numberWithCommas, PageMonitoringStyles, renderUsageByType, showToast} from "../PageMonitoringCommonService";
import {Line as ReactChartJsLine} from "react-chartjs-2";
import type {TypeAppInstanceUsage2} from "../../../../shared/Types";
import {CircularProgress, createMuiTheme} from "@material-ui/core";
import {reactLocalStorage} from "reactjs-localstorage";

export const materialUiDarkTheme = createMuiTheme({
    palette: {
        type: "dark",
        primary: {
            main: '#77BD25',
        },
    },
    overrides: {
        MuiMenuItem: {
            selected: {
                // Works (without the need for !important)
                background: 'linear-gradient(45deg, red 30%, orange 90%)',
            },
            root: {
                '&$selected': {
                    backgroundColor: '#77BD25',
                },
            },

        },
        MuiSelect: {
            selected: {
                // Works (must use !important):
                backgroundColor: 'black !important',
                // Works (must use !important):
                // background: 'red !important',
            },
            root: {
                '&$selected': {
                    backgroundColor: '#77BD25',
                },
            },

        },
        /*MuiButton: {
            root: {
                //fontSize: '1rem',
                backgroundColor: '#77BD25 !important',
                color: 'black',
            },
        },*/
    },
});


export const GRID_ITEM_TYPE = {
    LINE: 'LINE',
    BAR: 'BAR',
    COLUMN: 'COLUMN',
    BUBBLE: 'BUBBLE',
    MAP: 'MAP',
    TABLE: 'TABLE',
    PIE: 'PIE',
    CLUSTER_LIST: 'CLUSTER_LIST',
    CLUSTER_EVENTLOG_LIST: 'CLUSTER_EVENTLOG_LIST',
    APP_INST_EVENT_LOG: 'APP_INST_EVENT_LOG',
    PERFORMANCE_SUM: 'PERFORMANCE_SUM'
}
export const HARDWARE_TYPE_FOR_GRID = {
    MAP: 'MAP',
    PIE: 'PIE',
    BUBBLE: 'BUBBLE',
    CLOUDLET_LIST: 'CLOUDLET_LIST',
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

};

export const CHART_TYPE = {
    LINE: 'LINE',
    BAR: 'BAR',
    COLUMN: 'COLUMN',
}


export const defaultLayoutForCluster = [

    {i: '1', x: 1, y: 0, w: 2, h: 2, "add": false},//MAP

    {i: '2', x: 0, y: 0, w: 1, h: 1, "add": false},//CPU
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//MEM

    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//bubble
    {i: '5', x: 3, y: 1, w: 1, h: 1, "add": false},//appinst event log
    {i: '6', x: 0, y: 2, w: 4, h: 1, "add": false},//performance Grid


];


export const defaultHwMapperListForCluster = [
    {
        id: '1',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: HARDWARE_TYPE_FOR_GRID.MAP,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.CPU,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '3',
        hwType: HARDWARE_TYPE_FOR_GRID.MEM,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '4',
        hwType: HARDWARE_TYPE_FOR_GRID.BUBBLE,
        graphType: HARDWARE_TYPE_FOR_GRID.BUBBLE,
    },
    {
        id: '5',
        hwType: GRID_ITEM_TYPE.APP_INST_EVENT_LOG,
        graphType: GRID_ITEM_TYPE.APP_INST_EVENT_LOG,
    },
    {
        id: '6',
        hwType: GRID_ITEM_TYPE.PERFORMANCE_SUM,
        graphType: GRID_ITEM_TYPE.PERFORMANCE_SUM,
    },

    /* {
         id: '7',
         hwType: HARDWARE_TYPE_FOR_GRID.MEM,
         graphType: CHART_TYPE.COLUMN,
     },
     {
         id: '8',
         hwType: HARDWARE_TYPE_FOR_GRID.DISK,
         graphType: CHART_TYPE.COLUMN,
     },*/
    /*  {
          id: '9',
          hwType: HARDWARE_TYPE_FOR_GRID.BUBBLE,
          graphType: HARDWARE_TYPE_FOR_GRID.BUBBLE,
      },*/

];


/*
desc:#####################################
desc:defaultLayoutForAppInst
desc:#######################################
 */
export const defaultLayoutForAppInst = [
    {i: '1', x: 1, y: 0, w: 2, h: 2, "add": false},//MAP
    {i: '2', x: 0, y: 0, w: 1, h: 1, "add": false},//CPU
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//MEM
    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//DISK
    {i: '5', x: 3, y: 1, w: 1, h: 1, "add": false},
    {i: '6', x: 0, y: 2, w: 4, h: 1, "add": false},//performance Grid
];


export const defaultLayoutMapperForAppInst = [
    {
        id: '1',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: HARDWARE_TYPE_FOR_GRID.MAP,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.CPU,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '3',
        hwType: HARDWARE_TYPE_FOR_GRID.MEM,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '4',
        hwType: HARDWARE_TYPE_FOR_GRID.DISK,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '5',
        hwType: GRID_ITEM_TYPE.APP_INST_EVENT_LOG,
        graphType: GRID_ITEM_TYPE.APP_INST_EVENT_LOG,
    },
    {
        id: '6',
        hwType: GRID_ITEM_TYPE.PERFORMANCE_SUM,
        graphType: GRID_ITEM_TYPE.PERFORMANCE_SUM,
    },
    /*{
        id: '6',
        hwType: HARDWARE_TYPE_FOR_GRID.SENDBYTES,
        graphType: CHART_TYPE.LINE,
    },*/

    /* {
         id: '8',
         hwType: HARDWARE_TYPE_FOR_GRID.ACTIVE_CONNECTION,
         graphType: CHART_TYPE.LINE,
     },

     {
         id: '9',
         hwType: HARDWARE_TYPE_FOR_GRID.HANDLED_CONNECTION,
         graphType: CHART_TYPE.LINE,
     },*/
];


/*
export const defaultHwMapperListForCluster = {
    '1': HARDWARE_TYPE_FOR_GRID.CPU,
    '2': HARDWARE_TYPE_FOR_GRID.MEM,
    '3': HARDWARE_TYPE_FOR_GRID.DISK,
    '4': HARDWARE_TYPE_FOR_GRID.RECVBYTES,
    '5': HARDWARE_TYPE_FOR_GRID.SENDBYTES,
}*/

export const revertToDefaultLayout = async (_this: PageDevMonitoring) => {
    try {
        reactLocalStorage.remove(getUserId() + "_layout")
        reactLocalStorage.remove(getUserId() + "_layout2")
        reactLocalStorage.remove(getUserId() + "_layout_mapper")
        reactLocalStorage.remove(getUserId() + "_layout2_mapper")
        await _this.setState({
            layoutForCluster: [],
            layoutMapperForCluster: [],
            layoutForAppInst: [],
        });

        await _this.setState({
            layoutForCluster: defaultLayoutForCluster,
            layoutMapperForCluster: defaultHwMapperListForCluster,
            layoutForAppInst: defaultLayoutForAppInst,
            layoutMapperForAppInst: defaultLayoutMapperForAppInst,
        })


    } catch (e) {
        showToast(e.toString())
    }

}


export const makeid = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const console_log = (msg, color = 'green') => {
    color = color || "black";
    let bgc = "White";
    switch (color) {
        case "success":
            color = "Green";
            bgc = "LimeGreen";
            break;
        case "info":
            color = "DodgerBlue";
            bgc = "Turquoise";
            break;
        case "error":
            color = "Red";
            bgc = "Black";
            break;
        case "start":
            color = "OliveDrab";
            bgc = "PaleGreen";
            break;
        case "warning":
            color = "Tomato";
            bgc = "Black";
            break;
        case "end":
            color = "Orchid";
            bgc = "MediumVioletRed";
            break;
        default:
            color = color;
    }

    if (typeof msg == "object") {
        console.log(msg);
    } else if (typeof color == "object") {
        console.log("%c" + msg, "color: PowderBlue;font-weight:bold; background-color: RoyalBlue;");
        console.log(color);
    } else {
        console.log("%c" + msg, "color:" + color + ";font-weight:bold;font-size:14pt; background-color:black;");
    }
};


export const getUserId = () => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;
    return store.email;
};


export const filterByClassification = (originalList, selectOne, filterKey,) => {
    try {
        //todo:리전인 경우.....
        if (filterKey === CLASSIFICATION.REGION) {
            if (selectOne !== 'ALL') {
                let filteredList = [];
                originalList.map(item => {
                    if (item[filterKey] === selectOne) {
                        filteredList.push(item);
                    }
                });
                return filteredList;
            } else {
                return originalList;
            }
        } else {
            let filteredInstanceList = [];
            originalList.map(item => {
                if (item[filterKey] === selectOne) {
                    filteredInstanceList.push(item);
                }
            });
            return filteredInstanceList;
        }
    } catch (e) {

    }

};

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

    if (hardwareType === HARDWARE_TYPE.TCPRETRANS) {
        return numberWithCommas((usageOne.sumTcpConns).toFixed(2)) + " "
    }

    if (hardwareType === HARDWARE_TYPE.UDPSENT) {
        return numberWithCommas((usageOne.sumUdpSent).toFixed(2)) + " datagrams"
    }

    if (hardwareType === HARDWARE_TYPE.UDPRECV) {
        return numberWithCommas((usageOne.sumUdpRecv).toFixed(2)) + " datagrams"
    }

    if (hardwareType === HARDWARE_TYPE.SENDBYTES) {
        return numberWithCommas((usageOne.sumSendBytes / 1000000).toFixed(0)) + " MByte"
    }

    if (hardwareType === HARDWARE_TYPE.RECVBYTES) {
        return numberWithCommas((usageOne.sumRecvBytes / 1000000).toFixed(0)) + " MByte"
    }
};


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
};

export const sortByKey = (arrList, key) => {


    arrList.sort((a, b) => b[key] - a[key]);


    return arrList;
};


export const makeBarChartDataForCluster = (usageList, hardwareType, _this: PageDevMonitoring) => {

    console.log(`renderBarGraphForCluster===>${hardwareType}`, usageList);
    usageList = sortUsageListByTypeForCluster(usageList, hardwareType);

    if (usageList.length === 0) {
        return "";
    } else {
        let chartDataList = [];
        chartDataList.push(["Element", hardwareType + " USAGE", {role: "style"}, {role: 'annotation'}]);
        for (let index = 0; index < usageList.length; index++) {
            if (index < 5) {
                let barDataOne = [
                    usageList[index].cluster.toString() + "\n[" + usageList[index].cloudlet + "]",//clusterName
                    renderUsageByType(usageList[index], hardwareType, _this),
                    _this.state.chartColorList[index],
                    renderUsageLabelByTypeForCluster(usageList[index], hardwareType)
                ];
                chartDataList.push(barDataOne);
            }
        }

        let chartDataSet = {
            chartDataList,
            hardwareType,
        };
        return chartDataSet
    }
};


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
            chartDataList.push(["Element", hardwareType.toUpperCase() + " USAGE", {role: "style"}, {role: 'annotation'}]);
            for (let index = 0; index < typedUsageList.length; index++) {
                if (index < 5) {
                    let barDataOne = [
                        typedUsageList[index].instance.AppName.toString().substring(0, 10) + "..." + "\n[" + typedUsageList[index].instance.Cloudlet + "]",
                        renderUsageByType(typedUsageList[index], hardwareType, _this),
                        CHART_COLOR_LIST[index],
                        renderUsageLabelByTypeForCluster(typedUsageList[index], hardwareType, _this)
                    ];
                    chartDataList.push(barDataOne);
                }
            }

            let chartDataSet = {
                chartDataList,
                hardwareType,
            };
            return chartDataSet
        }
    } catch (e) {
        //showToast(e.toString())
    }


};


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
};


/**
 *
 * @param _this
 * @param hardwareType
 * @param pBubbleChartData
 * @returns {*}
 */
export const renderBubbleChartCoreForDev_Cluster = (_this: PageDevMonitoring, hardwareType: string, pBubbleChartData: any, themeTitle: string,) => {

    console.log('pBubbleChartData===>', pBubbleChartData);

    if (pBubbleChartData.length === 0 && _this.loading === false) {
        return (
            <div style={PageMonitoringStyles.noData}>
                NO DATA
            </div>
        )
    } else {
        let appInstanceList = _this.state.appInstanceList;


        let boxWidth = (window.innerWidth - 300) / 3 - 20;

        function renderZoomLevel(appInstanceListLength) {
            if (appInstanceListLength <= 4) {
                return 0.5;
            } else {
                return 0.6;
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
            <>
                <div style={{
                    //backgroundColor: 'blue',
                    backgroundColor: '#1e2124',
                    height: 450,
                    // marginLeft: 0, marginRight: 0, marginBottom: 10,
                }}>
                    <BubbleChart
                        className='bubbleChart'
                        style={{height: 300,}}
                        graph={{
                            zoom: renderZoomLevel(appInstanceList.length),
                            //zoom: 0.70,
                            offsetX: 0.15,
                            offsetY: renderOffsetY(appInstanceList.length)
                        }}
                        themeTitle={themeTitle}
                        width={boxWidth}
                        height={350}
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
                                let lineChartDataSet = makeLineChartDataForCluster(_this.state.filteredClusterUsageList, _this.state.currentHardwareType, _this);
                                cluster_cloudlet = cluster_cloudlet.toString().split(" | ")[0] + "|" + cluster_cloudlet.toString().split(" | ")[1];
                                handleLegendAndBubbleClickedEvent(_this, cluster_cloudlet, lineChartDataSet)
                            } catch (e) {

                            }


                        }}
                        legendClickFun={async (cluster_cloudlet, index) => {
                            try {
                                let lineChartDataSet = makeLineChartDataForCluster(_this.state.filteredClusterUsageList, _this.state.currentHardwareType, _this);
                                cluster_cloudlet = cluster_cloudlet.toString().split(" | ")[0] + "|" + cluster_cloudlet.toString().split(" | ")[1];
                                handleLegendAndBubbleClickedEvent(_this, cluster_cloudlet, lineChartDataSet)
                            } catch (e) {

                            }
                        }}
                        data={pBubbleChartData}
                    />

                </div>

            </>
        )
    }


};
/*

export const makeLineChartDataForAppInstAll = (hardwareUsageList: Array, hardwareType: string = 'all', _this: PageDevMonitoring) => {
    console.log("hardwareType===>", hardwareType);

    //alert(hardwareType)

    if (hardwareUsageList.length === 0) {
        return (
            <div style={PageMonitoringStyles.noData}>
                NO DATA
            </div>
        )
    } else {


        let instanceAppName = '';
        let instanceNameList = [];
        let usageSetList = [];
        let dateTimeList = [];

        hardwareUsageList.map((item: TypeAppInstanceUsage2, index) => {

            let seriesValues = [];
            let seriesValues2 = [];
            let seriesValues3 = [];
            let seriesValues4 = [];
            let seriesValues5 = [];
            seriesValues = item.cpuSeriesValue;
            seriesValues2 = item.memSeriesValue;
            seriesValues3 = item.diskSeriesValue;
            seriesValues4 = item.networkSeriesValue;
            seriesValues5 = item.connectionsSeriesValue;

            console.log(`seriesValues===${hardwareType}>`, seriesValues);

            instanceAppName = item.instance.AppName;
            let usageList = [];

            for (let j in seriesValues) {

                let usageOne = 0;
                let usageOne2 = 0;
                let usageOne3 = 0;
                let usageOne4 = 0;
                let usageOne5 = 0;
                let usageOne6 = 0;
                let usageOne7 = 0;
                let usageOne8 = 0;
                usageOne = seriesValues[j][APP_INST_MATRIX_HW_USAGE_INDEX.CPU];
                usageOne2 = seriesValues2[j][APP_INST_MATRIX_HW_USAGE_INDEX.MEM]; //mem usage
                usageOne3 = seriesValues3[j][APP_INST_MATRIX_HW_USAGE_INDEX.DISK];
                usageOne4 = seriesValues4[j][APP_INST_MATRIX_HW_USAGE_INDEX.SENDBYTES];
                usageOne5 = seriesValues4[j][APP_INST_MATRIX_HW_USAGE_INDEX.RECVBYTES];
                /!*usageOne6 = seriesValues5[j][APP_INST_MATRIX_HW_USAGE_INDEX.ACTIVE.toString()];
                usageOne7 = seriesValues5[j][APP_INST_MATRIX_HW_USAGE_INDEX.HANDLED.toString()];
                usageOne8 = seriesValues5[j][APP_INST_MATRIX_HW_USAGE_INDEX.ACCEPTS.toString()];*!/

                usageList.push(usageOne);
                usageList.push(usageOne2);
                usageList.push(usageOne3);
                usageList.push(usageOne4);
                usageList.push(usageOne5);
                dateTimeList.push(seriesValues[j]["0"].toString().split("T")[1]);
            }

            instanceNameList.push(instanceAppName);
            usageSetList.push(usageList);

        });


        console_log(hardwareType);
        console.log(`usageSetList===${hardwareType}>`, usageSetList);


        //@todo: CUT LIST INTO RECENT_DATA_LIMIT_COUNT
        let newDateTimeList = [];
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

};
*/


export const makeLineChartDataForAppInst = (hardwareUsageList: Array, hardwareType: string = 'all', _this: PageDevMonitoring) => {
    console.log("hardwareType===>", hardwareType);

    if (hardwareUsageList.length === 0) {
        return (
            <div style={PageMonitoringStyles.noData}>
                NO DATA
            </div>
        )
    } else {


        let instanceAppName = '';
        let instanceNameList = [];
        let usageSetList = [];
        let dateTimeList = [];

        if (hardwareType === 'all') {

        } else {
            hardwareUsageList.map((item: TypeAppInstanceUsage2, index) => {

                let seriesValues = [];
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

                instanceAppName = item.instance.AppName;
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
                    dateOne = dateOne.toString().split("T");

                    dateTimeList.push(dateOne[1]);
                }

                instanceNameList.push(instanceAppName);
                usageSetList.push(usageList);

            })
        }


        //@todo: CUT LIST INTO RECENT_DATA_LIMIT_COUNT
        let newDateTimeList = [];
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

};

export const makeAllLineChartData = (_this) => {
    let completedLineCharDataSetList = [];
    let lineChartDataSet = makeLineChartDataForAppInst(_this.state.filteredAppInstUsageList, HARDWARE_TYPE.CPU, _this);
    let lineChartDataSet2 = makeLineChartDataForAppInst(_this.state.filteredAppInstUsageList, HARDWARE_TYPE.MEM, _this);
    let lineChartDataSet3 = makeLineChartDataForAppInst(_this.state.filteredAppInstUsageList, HARDWARE_TYPE.DISK, _this);
    let lineChartDataSet4 = makeLineChartDataForAppInst(_this.state.filteredAppInstUsageList, HARDWARE_TYPE.RECVBYTES, _this);
    let lineChartDataSet5 = makeLineChartDataForAppInst(_this.state.filteredAppInstUsageList, HARDWARE_TYPE.SENDBYTES, _this);
    /*let lineChartDataSet6 = makeLineChartDataForAppInst(this.state.filteredAppInstUsageList, HARDWARE_TYPE.ACTIVE_CONNECTION, this)
    let lineChartDataSet7 = makeLineChartDataForAppInst(this.state.filteredAppInstUsageList, HARDWARE_TYPE.ACCEPTS_CONNECTION, this)
    let lineChartDataSet8 = makeLineChartDataForAppInst(this.state.filteredAppInstUsageList, HARDWARE_TYPE.HANDLED_CONNECTION, this)*/

    completedLineCharDataSetList.push(lineChartDataSet);
    completedLineCharDataSetList.push(lineChartDataSet2);
    completedLineCharDataSetList.push(lineChartDataSet3);
    completedLineCharDataSetList.push(lineChartDataSet4);
    completedLineCharDataSetList.push(lineChartDataSet5);
    /*completedLineCharDataSetList.push(lineChartDataSet6)
    completedLineCharDataSetList.push(lineChartDataSet7)
    completedLineCharDataSetList.push(lineChartDataSet8)*/

    let newLevelTypeNameList = [];
    let newDateTimeList = [];
    let newUsageSetList = [];
    let newHWTypeList = [];
    completedLineCharDataSetList.map(item => {
        let newLevelTypeNameOne = item.levelTypeNameList["0"] + "[" + item.hardwareType + "]";
        let usageSetListOne = item.usageSetList;
        newLevelTypeNameList.push(newLevelTypeNameOne);
        newUsageSetList.push(usageSetListOne[0]);
        newDateTimeList = item.newDateTimeList;
        newHWTypeList.push(item.hardwareType);

    });

    lineChartDataSet = {
        hardwareType: 'ALL',
        levelTypeNameList: newLevelTypeNameList,
        usageSetList: newUsageSetList,
        newDateTimeList: newDateTimeList,
    };

    return lineChartDataSet;
};


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

};

export const renderSmallProgress = () => {
    return (
        <div style={{display: 'flex', width: '100%', justifyContent: 'center', height: 20}}>
            <CircularProgress style={{fontWeight: 'bold', color: '#1cecff'}}
                              color={'#1cecff'}
                              size={15}/>
        </div>
    )
}


export const makeLineChartDataForCluster = (pUsageList: Array, hardwareType: string, _this) => {
    pUsageList = sortUsageListByTypeForCluster(pUsageList, hardwareType);

    if (pUsageList.length === 0) {
        return "";
    } else {
        let classificationName = '';
        let levelTypeNameList = [];
        let usageSetList = [];
        let dateTimeList = [];
        let series = [];
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
                dateOne = dateOne.toString().split("T");
                dateTimeList.push(dateOne[1]);
            }

            levelTypeNameList.push(classificationName);
            usageSetList.push(usageList);
        }

        console.log('usageSetList====>', usageSetList);


        //@todo: CUS LIST INTO RECENT_DATA_LIMIT_COUNT
        let newDateTimeList = [];
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
        };

        console.log("lineChartDataSet===>", lineChartDataSet);

        return lineChartDataSet
    }

};

/**
 *
 * @param canvas
 * @param height
 * @returns {[]}
 */
export const makeGradientColor = (canvas, height) => {
    const ctx = canvas.getContext("2d");

    let gradientList = [];
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

    gradientList.push(gradient);
    gradientList.push(gradient2);
    gradientList.push(gradient3);
    gradientList.push(gradient4);
    gradientList.push(gradient5);

    return gradientList;
};

export const hexToRGB = (hex, alpha) => {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

export const makeGradientColorOne = (canvas, height) => {
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgb(111,253,255)');
    gradient.addColorStop(1.0, 'rgb(62,113,243)');
    return gradient;
};


export const makeGradientColorList = (canvas, height, colorList, isBig = false) => {
    //let colorList= ['red', 'blue', 'green', 'yellow', 'grey']
    console.log("colorList===>", colorList);
    const ctx = canvas.getContext("2d");
    let gradientList = [];
    if (isBig) {
        colorList.map(item => {
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0.1, hexToRGB(item, 0.1));
            gradient.addColorStop(0.2, hexToRGB(item, 0.2));
            gradient.addColorStop(0.3, hexToRGB(item, 0.3));
            gradient.addColorStop(0.4, hexToRGB(item, 0.4));
            gradient.addColorStop(0.5, hexToRGB(item, 0.5));
            gradient.addColorStop(0.6, hexToRGB(item, 0.6));
            gradient.addColorStop(0.7, hexToRGB(item, 0.7));
            gradient.addColorStop(0.8, hexToRGB(item, 0.8));
            gradient.addColorStop(0.9, hexToRGB(item, 0.9));
            gradientList.push(gradient);
        })
    } else {
        colorList.map(item => {
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, hexToRGB(item, 0.2));
            gradient.addColorStop(0.5, hexToRGB(item, 0.5));
            gradient.addColorStop(1, hexToRGB(item, 0.85));
            gradientList.push(gradient);
        })
    }

    return gradientList;
};


export const makeGradientColorList2 = (canvas, height, colorList, isBig = false) => {
    //let colorList= ['red', 'blue', 'green', 'yellow', 'grey']
    console.log("colorList===>", colorList);
    const ctx = canvas.getContext("2d");
    let gradientList = [];

    colorList.map(item => {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, hexToRGB(item, 0.4));
        gradient.addColorStop(0.5, hexToRGB(item, 0.7));
        gradient.addColorStop(1, hexToRGB(item, 0.98));
        gradientList.push(gradient);
    })

    return gradientList;
};


/**
 *
 * @param _this
 * @param clickedItem
 * @param lineChartDataSet
 */
export const handleLegendAndBubbleClickedEvent = (_this: PageDevMonitoring, clickedItem, lineChartDataSet) => {

    let selectedIndex = 0;
    lineChartDataSet.levelTypeNameList.map((item, jIndex) => {
        let newItem = item.toString().replace('\n', "|").replace("[", '').replace("]", '');
        clickedItem = clickedItem.toString().replace('\n', "|").replace("[", '').replace("]", '');
        if (clickedItem === newItem) {
            selectedIndex = jIndex;
        }
    });
    let selectedLineChartDataSetOne = {
        levelTypeNameList: lineChartDataSet.levelTypeNameList[selectedIndex],
        usageSetList: lineChartDataSet.usageSetList[selectedIndex],
        newDateTimeList: lineChartDataSet.newDateTimeList,
        hardwareType: lineChartDataSet.hardwareType,
    };

    _this.showModalClusterLineChart(selectedLineChartDataSetOne, selectedIndex)
};

export const addUnitNameForUsage = (value, hardwareType, _this) => {

    if (_this.state.currentClassification === CLASSIFICATION.CLUSTER) {

        if (hardwareType === HARDWARE_TYPE.CPU || hardwareType === HARDWARE_TYPE.DISK || hardwareType === HARDWARE_TYPE.MEM) {
            return value + " %";
        } else if (hardwareType === HARDWARE_TYPE.DISK || hardwareType === HARDWARE_TYPE.MEM) {
            return value + " %";
        } else if (hardwareType === HARDWARE_TYPE.SENDBYTES || hardwareType === HARDWARE_TYPE.RECVBYTES) {
            return convertByteToMegaByte(value, hardwareType)
        } else if (hardwareType === HARDWARE_TYPE.UDPRECV || hardwareType === HARDWARE_TYPE.UDPSENT) {
            return value + " datagrams";
        } else {
            return value;
        }

    } else if (_this.state.currentClassification === CLASSIFICATION.APPINST) {
        if (hardwareType === HARDWARE_TYPE.CPU) {
            return value.toString().substring(0, 9) + " %";
        } else if (hardwareType === HARDWARE_TYPE.DISK || hardwareType === HARDWARE_TYPE.MEM || hardwareType === HARDWARE_TYPE.RECVBYTES || hardwareType === HARDWARE_TYPE.SENDBYTES) {
            return convertByteToMegaByte(value, hardwareType)
        } else {
            return value;
        }
    }
};


export const makeLineChartOptions = (hardwareType, lineChartDataSet, _this, isBig = false) => {

    let options = {
        stacked: true,
        animation: {
            duration: 500
        },
        maintainAspectRatio: false,//@todo
        responsive: true,//@todo
        datasetStrokeWidth: 3,
        pointDotStrokeWidth: 4,
        layout: {
            padding: {
                left: 9,
                right: 5,
                top: 15,
                bottom: 0
            }
        },
        legend: {
            display: false,//@todo:리전드display
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
                        /*console.log("yAxes===>", hardwareType);
                        console.log("yAxes===>", _this.state.currentClassification);*/
                        return addUnitNameForUsage(value, hardwareType, _this,)

                    },
                },
                gridLines: {
                    color: "#505050",
                },
                stacked: true,

            }],
            xAxes: [{
                /*ticks: {
                    fontColor: 'white'
                },*/
                gridLines: {
                    color: "#505050",
                },
                ticks: {
                    fontSize: 11,
                    fontColor: 'white',
                    //maxRotation: 0.05,
                    autoSkip: true,
                    maxRotation: 0,//xAxis text rotation
                    minRotation: 0,//xAxis text rotation
                    /*
                    maxRotation: 45,//xAxis text rotation
                    minRotation: 45,//xAxis text rotation
                    */
                    padding: 10,
                    labelOffset: 0,
                    callback(value, index, label) {
                        if (isBig) {
                            return value
                        } else {
                            if (index % 2 === 0) return '';
                            return value;
                        }
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
            if (i.length > 0) {
                console.log('onClick===>', i);
            }

        }
    };//options
    return options;
};

export const demoLineChartData = (canvas) => {
    let gradientList = makeGradientColorList(canvas, 305, CHART_COLOR_LIST, true);

    let dataSets = [
        {
            label: 'AppInst1',
            lineTension: 0.1,
            fill: true,
            backgroundColor: gradientList[0],
            borderColor: gradientList[0],
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [25, 35, 40, 55, 59, 75, 89]
        },
        {
            label: 'AppInst2',
            lineTension: 0.1,
            fill: true,
            backgroundColor: gradientList[1],
            borderColor: gradientList[1],
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'App Inst3',
            lineTension: 0.1,
            fill: true,
            backgroundColor: gradientList[2],
            borderColor: gradientList[2],
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [3, 5, 8, 8, 5, 15, 20]
        },
        {
            label: 'App Inst4',
            lineTension: 0.1,
            fill: true,
            backgroundColor: gradientList[3],
            borderColor: gradientList[3],
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [31, 51, 28, 38, 55, 75, 20]
        },
        {
            label: 'App Inst4',
            lineTension: 0.1,
            fill: true,
            backgroundColor: gradientList[4],
            borderColor: gradientList[4],
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [21, 41, 68, 138, 5, 7, 2]
        }

    ]

    return {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: dataSets,
    }
};

export const simpleGraphOptions = {
    stacked: true,
    animation: {
        duration: 500
    },
    maintainAspectRatio: false,//@todo
    responsive: true,//@todo
    datasetStrokeWidth: 3,
    pointDotStrokeWidth: 4,
    layout: {
        padding: {
            left: 9,
            right: 5,
            top: 15,
            bottom: 0
        }
    },
    legend: {
        display: false,//@todo:리전드display
        position: 'top',
        labels: {
            boxWidth: 10,
            fontColor: 'white',
            fillStyle: 'red',
        },//@todo: lineChart 리전드 클릭 이벤트.
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
            },
            gridLines: {
                color: "#505050",
            },
            stacked: true,

        }],
        xAxes: [{
            /*ticks: {
                fontColor: 'white'
            },*/
            gridLines: {
                color: "white",
            },
            ticks: {
                fontSize: 11,
                fontColor: 'white',
                //maxRotation: 0.05,
                autoSkip: true,
                maxRotation: 0,//xAxis text rotation
                minRotation: 0,//xAxis text rotation
                /*
                maxRotation: 45,//xAxis text rotation
                minRotation: 45,//xAxis text rotation
                */
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
        if (i.length > 0) {
            console.log('onClick===>', i);
        }

    }
}

export const makeTreeClusterCloudletList = (clusterOriginList) => {

    let ClusterList = []
    clusterOriginList.map(item => {
        console.log("Cloudlet===>", item.Cloudlet);
        console.log("ClusterName===>", item.ClusterName);
        ClusterList.push(item.ClusterName)
    })
    let uniqClusterList = [...new Set(ClusterList)];
    let treeList = []
    uniqClusterList.map(clusterOne => {
        console.log("clusterOne===>", clusterOne);
        let childrenCloudlets = []
        clusterOriginList.map(item => {
            if (item.ClusterName === clusterOne) {
                childrenCloudlets.push({
                    title: item.Cloudlet,
                    value: clusterOne + " | " + item.Cloudlet + " | " + item.Region,
                })
            }
        })

        let itemOne = {
            selectable: false,
            title: clusterOne,
            value: clusterOne,
            children: childrenCloudlets,
        };

        treeList.push(itemOne)

    })
    return treeList;
}


export const makeLineChartDataForBigModal = (lineChartDataSet, _this: PageDevMonitoring) => {
    const lineChartData = (canvas) => {
        let gradientList = makeGradientColorList(canvas, 305, _this.state.chartColorList, true);
        let levelTypeNameList = lineChartDataSet.levelTypeNameList
        let usageSetList = lineChartDataSet.usageSetList
        let newDateTimeList = lineChartDataSet.newDateTimeList

        let finalSeriesDataSets = [];
        for (let index in usageSetList) {
            //@todo: top5 만을 추린다
            if (index < 5) {
                let dataSetsOne = {
                    label: levelTypeNameList[index],
                    radius: 0,
                    borderWidth: 3.5,//todo:라인 두께
                    fill: _this.state.isStackedLineChart,// @desc:fill BackgroundArea
                    backgroundColor: _this.state.isGradientColor ? gradientList[index] : _this.state.chartColorList[index],
                    borderColor: _this.state.isGradientColor ? gradientList[index] : _this.state.chartColorList[index],
                    lineTension: 0.5,
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

                };

                finalSeriesDataSets.push(dataSetsOne)
            }
        }
        return {
            labels: newDateTimeList,
            datasets: finalSeriesDataSets,
        }
    };
    return lineChartData;
}


/**
 *
 * @param levelTypeNameList
 * @param usageSetList
 * @param newDateTimeList
 * @param _this
 * @param isGradientColor
 * @returns {function(*=): {datasets: [], labels: *}}
 */
export const makeTop5LineChartData = (levelTypeNameList, usageSetList, newDateTimeList, _this: PageDevMonitoring, isGradientColor = false) => {


    const lineChartData = (canvas) => {

        let gradientList = makeGradientColorList(canvas, 305, _this.state.chartColorList);
        let finalSeriesDataSets = [];
        for (let index in usageSetList) {
            //@todo: top5 만을 추린다

            if (index < 5) {

                let datasetsOne = {
                    label: levelTypeNameList[index],
                    radius: 0,
                    borderWidth: 3.5,//todo:라인 두께
                    fill: isGradientColor,// @desc:fill@desc:fill@desc:fill@desc:fill
                    backgroundColor: isGradientColor ? gradientList[index] : _this.state.chartColorList[index],
                    borderColor: isGradientColor ? gradientList[index] : _this.state.chartColorList[index],
                    lineTension: 0.5,
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

                };

                finalSeriesDataSets.push(datasetsOne)
            }


        }
        return {
            labels: newDateTimeList,
            datasets: finalSeriesDataSets,
        }
    };

    return lineChartData;
};

export const convertToClassification = (pClassification) => {
    if (pClassification === CLASSIFICATION.APPINST) {
        return "App Inst"
    } else {
        return pClassification.toString().replace("_", " ")
    }
};


export const renderLineChartCoreForDev = (_this: PageDevMonitoring, lineChartDataSet, context) => {
    try {
        let levelTypeNameList = lineChartDataSet.levelTypeNameList;
        let usageSetList = lineChartDataSet.usageSetList;
        let newDateTimeList = lineChartDataSet.newDateTimeList;
        let hardwareType = lineChartDataSet.hardwareType;


        const lineChartDataForRendering = makeTop5LineChartData(levelTypeNameList, usageSetList, newDateTimeList, _this, _this.state.isStackedLineChart);
        return (
            <div style={{
                position: 'relative',
                width: '99%',
                height: '99%'
            }}>
                <ReactChartJsLine
                    data={lineChartDataForRendering}
                    options={makeLineChartOptions(hardwareType, lineChartDataSet, _this)}
                />
            </div>
        );
    } catch (e) {

        showToast(e.toString())
    }
};


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

                    };

                    finalSeriesDataSets.push(datasetsOne)
                }

            }
            return {
                labels: newDateTimeList,
                datasets: finalSeriesDataSets,
            }
        };

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
        };//options


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
};


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
};


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
};

export const makeSelectBoxListWithValuePipe = (appInstList, keyName: string, valueName: string, thirdValue: string, fourthValue: string = '') => {
    let newArrList = [];
    if (fourthValue !== '') {
        for (let i in appInstList) {
            newArrList.push({
                key: appInstList[i][keyName].trim() + " | " + appInstList[i][valueName].trim() + " | " + appInstList[i][thirdValue].trim() + " | " + appInstList[i][fourthValue].trim(),
                value: appInstList[i][keyName].trim() + " | " + appInstList[i][valueName].trim() + " | " + appInstList[i][thirdValue].trim() + " | " + appInstList[i][fourthValue].trim(),
                text: appInstList[i][keyName].trim() + " | " + appInstList[i][valueName].trim() + " | " + appInstList[i][thirdValue].trim() + " | " + appInstList[i][fourthValue].trim(),
            })
        }
    } else {
        for (let i in appInstList) {
            newArrList.push({
                key: appInstList[i][keyName].trim() + " | " + appInstList[i][valueName].trim() + " | " + appInstList[i][thirdValue].trim(),
                value: appInstList[i][keyName].trim() + " | " + appInstList[i][valueName].trim() + " | " + appInstList[i][thirdValue].trim(),
                text: appInstList[i][keyName].trim() + " | " + appInstList[i][valueName].trim() + " | " + appInstList[i][thirdValue].trim(),
            })
        }
    }

    return newArrList;
};

export const makeDropdownListWithValuePipeForAppInst = (appInstList, keyName: string, valueName: string, thirdValue: string, fourthValue: string = '') => {
    let newArrList = [];
    if (fourthValue !== '') {
        for (let i in appInstList) {
            newArrList.push({
                key: appInstList[i][keyName].trim() + " | " + appInstList[i][valueName].trim() + " | " + appInstList[i][thirdValue].trim() + " | " + appInstList[i][fourthValue].trim(),
                value: appInstList[i][keyName].trim() + " | " + appInstList[i][valueName].trim() + " | " + appInstList[i][thirdValue].trim() + " | " + appInstList[i][fourthValue].trim(),
                text: appInstList[i][keyName].trim(),
            })
        }
    } else {
        for (let i in appInstList) {
            newArrList.push({
                key: appInstList[i][keyName].trim() + " | " + appInstList[i][valueName].trim() + " | " + appInstList[i][thirdValue].trim(),
                value: appInstList[i][keyName].trim() + " | " + appInstList[i][valueName].trim() + " | " + appInstList[i][thirdValue].trim(),
                text: appInstList[i][keyName].trim(),
            })
        }
    }

    return newArrList;
};


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
};

export const GradientBarChartOptions1 = {
    animation: {
        duration: 500
    },
    legend: {
        display: false
    },
    maintainAspectRatio: false,//@todo
    responsive: true,//@todo
    datasetStrokeWidth: 3,
    pointDotStrokeWidth: 4,
    layout: {
        padding: {
            left: 0,
            right: 10,
            top: 25,
            bottom: 10
        }
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                fontColor: 'white',
                callback(value, index, label) {
                    return value;
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
                fontSize: 11,
                fontColor: 'white',
                //maxRotation: 0.05,
                //autoSkip: true,
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
                padding: 10,
                labelOffset: 0,
                callback(label, index, labels) {
                    return [label.toString().split("[")[0].substring(0, 11) + "...", "[" + label.toString().split("[")[1].substring(0, 11).replace(']', '') + "...]"]
                }
            },
            beginAtZero: false,
            /* gridLines: {
                 drawTicks: true,
             },*/
        }],
        backgroundColor: {
            fill: "#1e2124"
        },
    },
    plugins: {
        labels: {
            // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
            render: function (args) {
                // args will be something like:
                // { label: 'Label', value: 123, percentage: 50, index: 0, dataset: {...} }
                return args.value + '%';
                // return object if it is image
                // return { src: 'image.png', width: 16, height: 16 };
            },

            // precision for percentage, default is 0
            precision: 0,

            // identifies whether or not labels of value 0 are displayed, default is false
            showZero: true,

            // font size, default is defaultFontSize
            fontSize: 22,

            // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
            fontColor: '#fff',

            // font style, default is defaultFontStyle
            fontStyle: 'normal',

            // font family, default is defaultFontFamily
            fontFamily: "Acme",

            // draw text shadows under labels, default is false
            textShadow: true,

            // text shadow intensity, default is 6
            shadowBlur: 30,

            // text shadow X offset, default is 3
            shadowOffsetX: 5,

            // text shadow Y offset, default is 3
            shadowOffsetY: 5,

            // text shadow color, default is 'rgba(0,0,0,0.3)'
            shadowColor: 'rgba(255,255,255,0.75)',

            // draw label in arc, default is false
            // bar chart ignores this
            arc: true,

            // position to draw label, available value is 'default', 'border' and 'outside'
            // bar chart ignores this
            // default is 'default'
            position: 'default',

            // draw label even it's overlap, default is true
            // bar chart ignores this
            overlap: true,

            // show the real calculated percentages from the values and don't apply the additional logic to fit the percentages to 100 in total, default is false
            showActualPercentages: true,

            // set images when `render` is 'image'
            images: [
                {
                    src: 'image.png',
                    width: 16,
                    height: 16
                }
            ],

            // add padding when position is `outside`
            // default is 2
            outsidePadding: 4,

            // add margin of text when position is `outside` or `border`
            // default is 2
            textMargin: 4
        }
    }

}

export const barChartOptions2 = {
    animation: {
        duration: 500
    },
    legend: {
        display: false
    },
    maintainAspectRatio: false,//@todo
    responsive: true,//@todo
    datasetStrokeWidth: 3,
    pointDotStrokeWidth: 4,
    layout: {
        padding: {
            left: 0,
            right: 10,
            top: 25,
            bottom: 10
        }
    },
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true,
                fontColor: 'white',
                callback(label, index, labels) {
                    return [label.toString().split("[")[0], "[" + label.toString().split("[")[1]]
                }
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
                autoSkip: false,
                maxRotation: 0,
                minRotation: 0,
                padding: 10,
                labelOffset: 0,
                callback(label, index, labels) {
                    return [label.toString().split("[")[0], "[" + label.toString().split("[")[1]]
                }
            },
            beginAtZero: false,
            /* gridLines: {
                 drawTicks: true,
             },*/
        }],
        backgroundColor: {
            fill: "#1e2124"
        },
    },
    plugins: {
        labels: {
            // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
            render: function (args) {
                // args will be something like:
                // { label: 'Label', value: 123, percentage: 50, index: 0, dataset: {...} }
                return args.value + '%';
                // return object if it is image
                // return { src: 'image.png', width: 16, height: 16 };
            },

            // precision for percentage, default is 0
            precision: 0,

            // identifies whether or not labels of value 0 are displayed, default is false
            showZero: true,

            // font size, default is defaultFontSize
            fontSize: 24,

            // font color, can be color array for each data or function for dynamic color, default is defaultFontColor
            fontColor: '#fff',

            // font style, default is defaultFontStyle
            fontStyle: 'normal',

            // font family, default is defaultFontFamily
            fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

            // draw text shadows under labels, default is false
            textShadow: true,

            // text shadow intensity, default is 6
            shadowBlur: 30,

            // text shadow X offset, default is 3
            shadowOffsetX: 5,

            // text shadow Y offset, default is 3
            shadowOffsetY: 5,

            // text shadow color, default is 'rgba(0,0,0,0.3)'
            shadowColor: 'rgba(255,255,255,0.75)',

            // draw label in arc, default is false
            // bar chart ignores this
            arc: true,

            // position to draw label, available value is 'default', 'border' and 'outside'
            // bar chart ignores this
            // default is 'default'
            position: 'border',

            // draw label even it's overlap, default is true
            // bar chart ignores this
            overlap: true,

            // show the real calculated percentages from the values and don't apply the additional logic to fit the percentages to 100 in total, default is false
            showActualPercentages: true,

            // set images when `render` is 'image'
            images: [
                {
                    src: 'image.png',
                    width: 16,
                    height: 16
                }
            ],

            // add padding when position is `outside`
            // default is 2
            outsidePadding: 2,

            // add margin of text when position is `outside` or `border`
            // default is 2
            textMargin: 4
        }
    }

}



