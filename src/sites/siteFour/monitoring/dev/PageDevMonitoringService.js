import React from 'react';
import '../PageMonitoring.css';
import {
    APP_INST_MATRIX_HW_USAGE_INDEX,
    CHART_COLOR_APPLE,
    CHART_COLOR_BERRIES_GALORE,
    CHART_COLOR_BRIGHT_AND_ENERGETIC,
    CHART_COLOR_EARTHY_AND_NATURAL,
    CHART_COLOR_EXOTIC_ORCHIDS,
    CHART_COLOR_JAZZ_NIGHT,
    CHART_COLOR_LIST,
    CHART_COLOR_LIST2,
    CHART_COLOR_LIST3,
    CHART_COLOR_LIST4,
    CHART_COLOR_MONOKAI,
    CHART_COLOR_URBAN_SKYLINE,
    CLASSIFICATION,
    HARDWARE_TYPE,
    RECENT_DATA_LIMIT_COUNT,
    THEME_OPTIONS,
    USAGE_INDEX_FOR_CLUSTER
} from "../../../../shared/Constants";
import PageDevMonitoring from "./PageDevMonitoring";
import {convertByteToMegaByte, convertByteToMegaGigaByte, makeBubbleChartDataForCluster, PageMonitoringStyles, renderUsageByType, showToast} from "../PageMonitoringCommonService";
import type {TypeAppInstanceUsage2} from "../../../../shared/Types";
import {CircularProgress, createMuiTheme} from "@material-ui/core";
import {reactLocalStorage} from "reactjs-localstorage";
import {numberWithCommas} from "../PageMonitoringUtils";

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


    {i: '1', x: 0, y: 0, w: 1, h: 1, "add": false},//CPU
    {i: '2', x: 1, y: 0, w: 2, h: 2, "add": false, "static": false},//MAP
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//MEM
    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//bubble
    {i: '5', x: 3, y: 1, w: 1, h: 1, "add": false},//appinst event log
    {i: '6', x: 0, y: 2, w: 4, h: 1, "add": false},//performance Grid
];


export const defaultHwMapperListForCluster = [
    {
        id: '1',
        hwType: HARDWARE_TYPE_FOR_GRID.CPU,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: HARDWARE_TYPE_FOR_GRID.MAP,
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

    {i: '1', x: 0, y: 0, w: 1, h: 1, "add": false},//CPU
    {i: '2', x: 1, y: 0, w: 2, h: 2, "add": false, "static": false},//MAP
    {i: '3', x: 0, y: 1, w: 1, h: 1, "add": false},//MEM
    {i: '4', x: 3, y: 0, w: 1, h: 1, "add": false},//DISK
    {i: '5', x: 3, y: 1, w: 1, h: 1, "add": false},
    {i: '6', x: 0, y: 2, w: 4, h: 1, "add": false},//performance Grid
];


export const defaultLayoutMapperForAppInst = [
    {
        id: '1',
        hwType: HARDWARE_TYPE_FOR_GRID.CPU,
        graphType: CHART_TYPE.LINE,
    },
    {
        id: '2',
        hwType: HARDWARE_TYPE_FOR_GRID.MAP,
        graphType: HARDWARE_TYPE_FOR_GRID.MAP,
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
];


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

        return Math.ceil(usageOne.sumTcpConns);
    }

    if (hardwareType === HARDWARE_TYPE.TCPRETRANS) {
        return Math.ceil(usageOne.sumTcpRetrans);
    }

    if (hardwareType === HARDWARE_TYPE.UDPSENT) {
        return convertByteToMegaGigaByte(parseInt(usageOne.sumUdpSent))
    }

    if (hardwareType === HARDWARE_TYPE.UDPRECV) {
        return convertByteToMegaGigaByte(usageOne.sumUdpRecv)
    }

    if (hardwareType === HARDWARE_TYPE.SENDBYTES) {
        return convertByteToMegaGigaByte(usageOne.sumSendBytes)
    }

    if (hardwareType === HARDWARE_TYPE.RECVBYTES) {
        return convertByteToMegaGigaByte(usageOne.sumRecvBytes)
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
    try {
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
    } catch (e) {

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
    try {
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
    } catch (e) {

    }
};

export const makeLineChartDataForAppInst = (hardwareUsageList: Array, hardwareType: string = 'all', _this: PageDevMonitoring) => {
    try {
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

            let _result = {
                levelTypeNameList: instanceNameList,
                usageSetList,
                newDateTimeList,
                hardwareType
            }

            return _result;
        }
    } catch (e) {

    }

};

export const convertHwTypePhrases = (pHardwareType) => {
    try {
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
    } catch (e) {

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
    try {
        if (pUsageList.length === 0) {
            return "";
        } else {
            let classificationName = '';
            let levelTypeNameList = [];
            let usageSetList = [];
            let dateTimeList = [];
            let series = [];
            for (let i in pUsageList) {
                let usageIndex = 0;
                if (hardwareType === HARDWARE_TYPE.CPU) {
                    series = pUsageList[i].cpuSeriesList
                    usageIndex = USAGE_INDEX_FOR_CLUSTER.CPU
                } else if (hardwareType === HARDWARE_TYPE.MEM) {
                    series = pUsageList[i].memSeriesList
                    usageIndex = USAGE_INDEX_FOR_CLUSTER.MEM
                } else if (hardwareType === HARDWARE_TYPE.DISK) {
                    series = pUsageList[i].diskSeriesList
                    usageIndex = USAGE_INDEX_FOR_CLUSTER.DISK
                } else if (hardwareType === HARDWARE_TYPE.TCPCONNS) {
                    series = pUsageList[i].tcpSeriesList
                    usageIndex = USAGE_INDEX_FOR_CLUSTER.TCPCONNS
                } else if (hardwareType === HARDWARE_TYPE.TCPRETRANS) {
                    series = pUsageList[i].tcpSeriesList
                    usageIndex = USAGE_INDEX_FOR_CLUSTER.TCPRETRANS
                } else if (hardwareType === HARDWARE_TYPE.UDPSENT) {
                    series = pUsageList[i].udpSeriesList
                    usageIndex = USAGE_INDEX_FOR_CLUSTER.UDPSENT
                } else if (hardwareType === HARDWARE_TYPE.UDPRECV) {
                    series = pUsageList[i].udpSeriesList
                    usageIndex = USAGE_INDEX_FOR_CLUSTER.UDPRECV
                } else if (hardwareType === HARDWARE_TYPE.SENDBYTES) {
                    series = pUsageList[i].networkSeriesList
                    usageIndex = USAGE_INDEX_FOR_CLUSTER.SENDBYTES
                } else if (hardwareType === HARDWARE_TYPE.RECVBYTES) {
                    series = pUsageList[i].networkSeriesList
                    usageIndex = USAGE_INDEX_FOR_CLUSTER.RECVBYTES
                }

                classificationName = pUsageList[i].cluster + "\n[" + pUsageList[i].cloudlet + "]";
                let usageList = [];

                for (let j in series) {
                    let usageOne = series[j][usageIndex];
                    usageList.push(usageOne);
                    let dateOne = series[j]["0"];
                    dateOne = dateOne.toString().split("T");
                    dateTimeList.push(dateOne[1]);
                }

                levelTypeNameList.push(classificationName);
                usageSetList.push(usageList);
            }


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


            return lineChartDataSet
        }
    } catch (e) {

    }

};

/**
 *
 * @param canvas
 * @param height
 * @returns {[]}
 */
export const makeGradientColor = (canvas, height) => {
    try {
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
    } catch (e) {
        throw new Error(e)
    }
};

export const hexToRGB = (hex, alpha) => {
    let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
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
    const ctx = canvas.getContext("2d");
    let gradientList = [];

    colorList.map(item => {
        /*const gradient = ctx.createLinearGradient(0,  0,  50,  0);*/
        //const gradient = ctx.createLinearGradient(0, 0, 350, height);
        const gradient = ctx.createLinearGradient(20, 0, 220, 0);
        gradient.addColorStop(0, hexToRGB(item, 0.1));
        gradient.addColorStop(0.5, hexToRGB(item, 0.5));
        gradient.addColorStop(1, hexToRGB(item, 0.7));
        gradientList.push(gradient);
    })

    return gradientList;
};


export const makeGradientColorList2 = (canvas, height, colorList, isBig = false) => {
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
 * @param themeTitle
 * @param _this
 * @returns {Promise<void>}
 */
export const handleThemeChanges = async (themeTitle, _this) => {
    if (themeTitle === THEME_OPTIONS.DEFAULT) {
        await _this.setState({
            chartColorList: CHART_COLOR_LIST
        })
    }
    if (themeTitle === THEME_OPTIONS.BLUE) {
        await _this.setState({
            chartColorList: CHART_COLOR_LIST2
        })
    }
    if (themeTitle === THEME_OPTIONS.GREEN) {
        await _this.setState({
            chartColorList: CHART_COLOR_LIST3
        })
    }
    if (themeTitle === THEME_OPTIONS.RED) {
        await _this.setState({
            chartColorList: CHART_COLOR_LIST4
        })
    }

    if (themeTitle === THEME_OPTIONS.MONOKAI) {
        await _this.setState({
            chartColorList: CHART_COLOR_MONOKAI
        })
    }

    if (themeTitle === THEME_OPTIONS.APPLE) {
        await _this.setState({
            chartColorList: CHART_COLOR_APPLE
        })
    }

    if (themeTitle === THEME_OPTIONS.EXOTIC_ORCHIDS) {
        await _this.setState({
            chartColorList: CHART_COLOR_EXOTIC_ORCHIDS
        })
    }

    if (themeTitle === THEME_OPTIONS.URBAN_SKYLINE) {
        await _this.setState({
            chartColorList: CHART_COLOR_URBAN_SKYLINE
        })
    }

    if (themeTitle === THEME_OPTIONS.BERRIES_GALORE) {
        await _this.setState({
            chartColorList: CHART_COLOR_BERRIES_GALORE
        })
    }
    if (themeTitle === THEME_OPTIONS.BRIGHT_AND_ENERGETIC) {
        await _this.setState({
            chartColorList: CHART_COLOR_BRIGHT_AND_ENERGETIC
        })
    }

    if (themeTitle === THEME_OPTIONS.EARTHY_AND_NATURAL) {
        await _this.setState({
            chartColorList: CHART_COLOR_EARTHY_AND_NATURAL
        })
    }

    if (themeTitle === THEME_OPTIONS.BRIGHT_AND_ENERGETIC) {
        await _this.setState({
            chartColorList: CHART_COLOR_BRIGHT_AND_ENERGETIC
        })
    }

    if (themeTitle === THEME_OPTIONS.JAZZ_NIGHT) {
        await _this.setState({
            chartColorList: CHART_COLOR_JAZZ_NIGHT
        })
    }


    let selectedChartColorList = _this.state.chartColorList;
    reactLocalStorage.setObject(getUserId() + "_mon_theme", selectedChartColorList)
    reactLocalStorage.set(getUserId() + "_mon_theme_title", themeTitle)
    _this.setState({
        chartColorList: selectedChartColorList,
    }, async () => {
        _this.setState({
            bubbleChartData: await makeBubbleChartDataForCluster(_this.state.filteredClusterUsageList, _this.state.currentHardwareType, _this.state.chartColorList),
        })
    })

}


/**
 *
 * @param _this
 * @param clickedItem
 * @param lineChartDataSet
 */
export const handleLegendAndBubbleClickedEvent = (_this: PageDevMonitoring, clickedItem, lineChartDataSet) => {
    try {

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
    } catch (e) {

    }
};

export const addUnitNameForUsage = (value, hardwareType, _this) => {
    try {

        if (_this.state.currentClassification === CLASSIFICATION.CLUSTER) {

            if (hardwareType === HARDWARE_TYPE.CPU || hardwareType === HARDWARE_TYPE.DISK || hardwareType === HARDWARE_TYPE.MEM) {
                return value + " %";
            } else if (hardwareType === HARDWARE_TYPE.DISK || hardwareType === HARDWARE_TYPE.MEM) {
                return value + " %";
            } else if (hardwareType === HARDWARE_TYPE.SENDBYTES || hardwareType === HARDWARE_TYPE.RECVBYTES) {
                return convertByteToMegaByte(value, hardwareType)
            } else if (hardwareType === HARDWARE_TYPE.UDPRECV || hardwareType === HARDWARE_TYPE.UDPSENT) {
                return value + " DG";
            } else {
                return value;
            }

        } else if (_this.state.currentClassification === CLASSIFICATION.APPINST) {
            if (hardwareType === HARDWARE_TYPE.CPU) {
                return value.toString().substring(0, 9) + " %";
            } else if (hardwareType === HARDWARE_TYPE.DISK || hardwareType === HARDWARE_TYPE.MEM || hardwareType === HARDWARE_TYPE.RECVBYTES || hardwareType === HARDWARE_TYPE.SENDBYTES) {
                return convertByteToMegaGigaByte(value, hardwareType)
            } else {
                return value;
            }
        }
    } catch (e) {

    }
};


export const makeLineChartOptions = (hardwareType, lineChartDataSet, _this, isBig = false) => {
    try {
        let options = {
            stacked: true,
            animation: {
                duration: 500
            },
            maintainAspectRatio: false,
            responsive: true,
            datasetStrokeWidth: 1,
            pointDotStrokeWidth: 2,
            layout: {
                padding: {
                    left: 9,
                    right: 5,
                    top: 15,
                    bottom: 0
                }
            },
            legend: {
                display: isBig ? true : false,
                position: 'top',
                labels: {
                    boxWidth: 10,
                    fontColor: 'white',
                    fontSize: 12,
                    fontFamily: 'ubuntu',
                    fontWeight: 'bold',
                },
                onClick: (e, clickedItem) => {
                    /*let selectedClusterOne = clickedItem.text.toString().replace('\n', "|");
                    handleLegendAndBubbleClickedEvent(_this, selectedClusterOne, lineChartDataSet)*/
                },
                onHover: (e, item) => {
                    //alert(`Item with text ${item.text} and index ${item.index} hovered`)
                },
            },
            scales: {
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 100,//todo max value
                    fontColor: 'white',
                    callback(value, index, label) {
                        return addUnitNameForUsage(value, hardwareType, _this,)
                    },
                },
                gridLines: {
                    color: "#fff",
                },
                //desc: options for 멀티라인차트
                yAxes: [{
                    id: 'A',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        fontColor: "#CCC", // this here
                        callback(value, index, label) {
                            return addUnitNameForUsage(value, hardwareType, _this,)

                        },
                    },
                }, {
                    id: 'B',
                    type: 'linear',
                    display: false,
                    scaleShowLabels: false,
                    ticks: {
                        max: 1,
                        min: 0
                    }

                }],
                xAxes: [{
                    /*ticks: {
                        fontColor: 'white'
                    },*/
                    gridLines: {
                        color: "#505050",
                    },
                    ticks: {
                        maxTicksLimit: isBig ? 20 : 7,//@desc: maxTicksLimit
                        fontSize: 11,
                        fontColor: 'white',
                        //maxRotation: 0.05,
                        autoSkip: isBig ? false : true,
                        maxRotation: 0,//xAxis text rotation
                        minRotation: 0,//xAxis text rotation
                        /*maxRotation: 45,//xAxis text rotation
                        minRotation: 45,//xAxis text rotation*/
                        padding: 10,
                        labelOffset: 0,
                        callback(value, index, label) {
                            /*  if (isBig) {
                                  return value
                              } else {
                                  if (index % 2 === 0) return '';
                                  return value;
                              }*/
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


                }

            }
        };//options
        return options;
    } catch (e) {

    }
};

export const demoLineChartData = (canvas) => {
    try {
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
    } catch (e) {

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
        /*yAxes: [{
            ticks: {
                //beginAtZero: true,
                //min: 0,
                //max: 100,//todo max value
                stepSize: 1,
                fontColor: 'white',
            },
            gridLines: {
                color: "#505050",
            },
            stacked: true,

        }],*/
        //@desc: Option for multi-line on y-axis.
        yAxes: [{
            id: 'A',
            type: 'linear',
            position: 'left',
        }, {
            id: 'B',
            type: 'linear',
            position: 'right',
            ticks: {
                max: 1,
                min: 0
            }
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
        }

    }
}


export const makeLineChartDataForBigModal = (lineChartDataSet, _this: PageDevMonitoring) => {
    try {
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
    } catch (e) {

    }
}

export const reduceString = (str: string, lengthLimit: number) => {
    if (str.length > lengthLimit) {
        return str.substring(0, lengthLimit) + "..";
    } else {
        return str;
    }
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
export const makeGradientLineChartData = (levelTypeNameList, usageSetList, newDateTimeList, _this: PageDevMonitoring, isGradientColor = false, hwType) => {
    try {
        const lineChartData = (canvas) => {
            let gradientList = makeGradientColorList(canvas, 250, _this.state.chartColorList);
            let finalSeriesDataSets = [];
            for (let index in usageSetList) {
                //@todo: extract top5
                /*if (index < 5) {
                }*/

                let datasetsOne = {
                    label: levelTypeNameList[index],
                    radius: 0,
                    borderWidth: 3,//todo:라인 두께
                    fill: isGradientColor,// @desc:fill@desc:fill@desc:fill@desc:fill
                    backgroundColor: isGradientColor ? gradientList[index] : _this.state.chartColorList[index],
                    borderColor: isGradientColor ? gradientList[index] : _this.state.chartColorList[index],
                    lineTension: 0.5,
                    data: usageSetList[index],
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: _this.state.chartColorList[index],
                    pointBackgroundColor: _this.state.chartColorList[index],
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: _this.state.chartColorList[index],
                    pointHoverBorderColor: _this.state.chartColorList[index],
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    order: index,

                };

                finalSeriesDataSets.push(datasetsOne)

            }

            let _result = {
                labels: newDateTimeList,
                datasets: finalSeriesDataSets,
            }
            return _result;
        };

        return lineChartData;
    } catch (e) {

    }
};

export const convertToClassification = (pClassification) => {
    if (pClassification === CLASSIFICATION.APPINST) {
        return "App Inst"
    } else {
        return pClassification.toString().replace("_", " ")
    }
};


//let chunkedSize = 12;
//let chunkArrayClusterUsageList = this.toChunkArray2(this.state.filteredClusterUsageList, this.state.chunkedSize);  //realdata
//let chunkArrayClusterUsageList = this.toChunkArray2(tempClusterList, chunkedSize);
//_.chunk(['a', 'b', 'c', 'd'], 2);
export const tempClusterList = [
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet2',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet3',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet4',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet5',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet6',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet7',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet8',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet9',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet10',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet11',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet12',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet13',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet14',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudle115',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet16',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet17',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet18',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet19',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet20',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet21',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet22',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet23',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet24',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet25',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet26',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet27',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet28',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet29',
    'autoclustermobiledgexsdkdemo [mexplat-stage-hamburg-cloudlet30',
]


export const makeSelectBoxListWithKeyValuePipeForCluster = (arrList, keyName, valueName) => {
    try {
        let newArrList = [];
        newArrList.push({
            key: '',
            value: '',
            text: 'Reset Filter',
        })
        for (let i in arrList) {
            newArrList.push({
                key: arrList[i][keyName].trim() + " | " + arrList[i][valueName].trim(),
                value: arrList[i][keyName].trim() + " | " + arrList[i][valueName].trim(),
                text: arrList[i][keyName].trim() + " | " + arrList[i][valueName].trim(),
            })
        }
        return newArrList;
    } catch (e) {

    }
};


export const makeSelectBoxListWithKey = (arrList, keyName) => {
    try {
        let newArrList = [];
        for (let i in arrList) {
            newArrList.push({
                key: arrList[i][keyName].trim(),
                value: arrList[i][keyName].trim(),
                text: arrList[i][keyName].trim(),
            })
        }
        return newArrList;
    } catch (e) {
    }
};

export const makeSelectBoxListWithValuePipe = (appInstList, keyName: string, valueName: string, thirdValue: string, fourthValue: string = '') => {
    try {
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
    } catch (e) {

    }
};

export const makeDropdownListWithValuePipeForAppInst = (appInstList, keyName: string, valueName: string, thirdValue: string, fourthValue: string = '') => {
    try {
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
    } catch (e) {

    }
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



