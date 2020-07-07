import React from 'react';
import '../common/PageMonitoringStyles.css';
import {
    CHART_COLOR_APPLE,
    CHART_COLOR_BERRIES_GALORE,
    CHART_COLOR_BLUE_MOUNTAIN_PEAKS_AND_CLOUDS,
    CHART_COLOR_BRIGHT_AND_ENERGETIC,
    CHART_COLOR_BRIGHT_AND_FRUITY,
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
    DARK_CLOUTLET_ICON_COLOR,
    DARK_LINE_COLOR,
    HARDWARE_TYPE,
    MONITORING_CATE_SELECT_TYPE,
    RECENT_DATA_LIMIT_COUNT,
    THEME_OPTIONS,
    USER_TYPE_SHORT,
    WHITE_CLOUTLET_ICON_COLOR,
    WHITE_LINE_COLOR
} from "../../../../shared/Constants";
import {reactLocalStorage} from "reactjs-localstorage";
import PageMonitoringView from "../view/PageMonitoringView";
import {convertByteToMegaGigaByte, convertToMegaGigaForNumber, makeClusterBubbleChartData, renderUsageByType} from "./PageMonitoringCommonService";
import {Center, PageMonitoringStyles} from "../common/PageMonitoringStyles";
import {findUsageIndexByKey, numberWithCommas} from "../common/PageMonitoringUtils";
import uniqBy from "lodash/uniqBy";
import type {TypeAppInst, TypeClientStatus, TypeCloudlet, TypeCluster, TypeLineChartData} from "../../../../shared/Types";
import {Select, Tag} from "antd";
import _, {sortBy} from 'lodash';
import {mapTileList} from "../common/MapProperties";

const {Option} = Select;

export function getOnlyCloudletName(cloudletOne) {
    return cloudletOne.toString().split(" | ")[0].trim();
}

export function getOnlyCloudletIndex(cloudletOne) {
    return cloudletOne.toString().split(" | ")[2].trim();
}

export function changeClassficationTxt(currentClassification) {
    if (currentClassification === CLASSIFICATION.CLOUDLET) {
        return currentClassification;
    } else {
        return CLASSIFICATION.CLUSTER
    }
}

export function renderTitle(props) {
    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: 45
        }}>
            <div className='page_monitoring_title draggable'
                 style={{
                     flex: 1,
                     marginTop: 10,
                     color: 'white'
                 }}
            >
                {convertToClassification(props.currentClassification)} Event Log

            </div>

        </div>
    )
}

export function makeTableRowStyle(index, itemHeight) {
    return (
        {
            flex: .5,
            color: '#C0C6C8',
            backgroundColor: index % 2 === 0 ? '#1D2025' : '#22252C',
            height: itemHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
        }

    )

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
                    if (item[filterKey].toString().trim() === selectOne) {
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
                if (item[filterKey].trim() === selectOne) {
                    filteredInstanceList.push(item);
                }
            });
            return filteredInstanceList;
        }
    } catch (e) {

    }

};

export const renderUsageLabelByType = (usageOne, hardwareType, userType = '') => {
    if (hardwareType === HARDWARE_TYPE.CPU) {
        let cpuUsageOne = (usageOne.sumCpuUsage * 1).toFixed(2) + " %";
        return cpuUsageOne;
    } else if (hardwareType === HARDWARE_TYPE.MEM) {
        return numberWithCommas((usageOne.sumMemUsage).toFixed(2)) + " %"
    } else if (hardwareType === HARDWARE_TYPE.DISK) {
        return numberWithCommas((usageOne.sumDiskUsage).toFixed(2)) + " %"
    } else if (hardwareType === HARDWARE_TYPE.TCPCONNS) {
        return Math.ceil(usageOne.sumTcpConns);
    } else if (hardwareType === HARDWARE_TYPE.TCPRETRANS) {
        return Math.ceil(usageOne.sumTcpRetrans);
    } else if (hardwareType === HARDWARE_TYPE.UDPSENT) {
        return convertByteToMegaGigaByte(parseInt(usageOne.sumUdpSent))
    } else if (hardwareType === HARDWARE_TYPE.UDPRECV) {
        return convertByteToMegaGigaByte(usageOne.sumUdpRecv)
    } else if (hardwareType === HARDWARE_TYPE.SENDBYTES) {
        return convertByteToMegaGigaByte(usageOne.sumSendBytes)
    } else if (hardwareType === HARDWARE_TYPE.RECVBYTES) {
        return convertByteToMegaGigaByte(usageOne.sumRecvBytes)
    }
    ////Cloudlet
    else if (hardwareType === HARDWARE_TYPE.VCPU_USED) {
        return usageOne.usedVCpuCount
    } else if (hardwareType === HARDWARE_TYPE.MEM_USED) {
        return usageOne.usedMemUsage + "MB"
    } else if (hardwareType === HARDWARE_TYPE.DISK_USED) {
        return usageOne.usedDiskUsage + "GB"
    } else if (hardwareType === HARDWARE_TYPE.FLOATING_IP_USED) {
        return usageOne.usedFloatingIpsUsage
    } else if (hardwareType === HARDWARE_TYPE.IPV4_USED) {
        return usageOne.usedIpv4Usage
    }
};


export const makeBarChartDataForCluster = (usageList, hardwareType, _this: PageMonitoringView) => {
    try {
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
                        renderUsageLabelByType(usageList[index], hardwareType) //@desc:annotation
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


export function getCloudletClusterNameListForAppInst(appInst: TypeAppInst) {
    let cloudletNameList = []
    appInst.map((item: TypeAppInst, index) => {
        cloudletNameList.push({
            CloudletName: item.Cloudlet,
            Region: item.Region,
        })
    })

    let uniqCloudletNameList = uniqBy(cloudletNameList, 'CloudletName')

    let clusterNameList = [];
    appInst.map((item: TypeAppInst, index) => {
        clusterNameList.push({
            ClusterInst: item.ClusterInst,
            Cloudlet: item.Cloudlet,
        })
    })

    let uniqClusterNameList = uniqBy(clusterNameList, MONITORING_CATE_SELECT_TYPE.CLUSTERINST)

    let result = {
        cloudletNameList: uniqCloudletNameList,
        clusterNameList: uniqClusterNameList,
    }

    return result
}

/**
 *
 * @param clusterList
 * @returns {{cloudletNameList: [], clusterNameList: []}}
 */
export function getCloudletClusterNameList(clusterList: TypeCluster) {
    let cloudletNameList = []
    clusterList.map(item => {
        cloudletNameList.push({
            CloudletName: item.Cloudlet,
            Region: item.Region,
            oper: item.Operator,
        })
    })

    let uniqCloudletNameList = uniqBy(cloudletNameList, 'CloudletName')

    let clusterNameList = [];
    clusterList.map((item: TypeCluster, index) => {
        clusterNameList.push({
            ClusterInst: item.ClusterName,
            Cloudlet: item.Cloudlet,
        })
    })

    let result = {
        cloudletNameList: uniqCloudletNameList,
        clusterNameList: clusterNameList,
    }

    return result
}

/**
 *
 * @param allHWUsageList
 * @param hardwareType
 * @param _this
 * @returns {string|{chartDataList: [], hardwareType: *}}
 */
export const makeBarChartDataForAppInst = (allHWUsageList, hardwareType, _this: PageMonitoringView) => {
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
                        renderUsageLabelByType(typedUsageList[index], hardwareType, _this)
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


export const handleHardwareTabChanges = async (_this: PageMonitoringView, selectedValueOne) => {
    try {
        if (_this.state.currentClassification === CLASSIFICATION.CLUSTER || _this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_ADMIN) {
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

export function makeMultiLineChartDatas(multiLineChartDataSets) {


    let hardwareType = []
    let levelTypeNameList = []
    let newDateTimeList = []
    let usageSetList = []
    multiLineChartDataSets.map((dataSetsOne: TypeLineChartData, index) => {
        hardwareType = hardwareType.concat(dataSetsOne.hardwareType)
        levelTypeNameList = levelTypeNameList.concat(dataSetsOne.hardwareType)
        newDateTimeList = (dataSetsOne.newDateTimeList)
        usageSetList = usageSetList.concat(dataSetsOne.usageSetList)
    })

    let newChartDataSets = {
        hardwareType,
        levelTypeNameList,
        newDateTimeList,
        usageSetList,
    }
    return newChartDataSets;
}


/**
 *
 * @param hardwareUsageList
 * @param hardwareType
 * @param _this
 * @returns {{levelTypeNameList: [], hardwareType: string, usageSetList: [], newDateTimeList: []}|*}
 */
export const makeLineChartData = (hardwareUsageList: Array, hardwareType: string, _this: PageMonitoringView) => {
    try {

        if (hardwareUsageList.length === 0) {
            return (
                <div style={PageMonitoringStyles.noData}>
                    NO DATA
                </div>
            )
        } else {
            let classificationName = '';
            let cloudletClusterAppInstNameList = [];
            let usageSetList = [];
            let dateTimeList = [];
            let series = [];
            let colorCodeIndexList = [];

            hardwareUsageList.map((item, index) => {
                let usageColumnList = item.columns;
                let hardWareUsageIndex;
                if (hardwareType === HARDWARE_TYPE.CPU) {
                    series = item.cpuSeriesList
                } else if (hardwareType === HARDWARE_TYPE.MEM) {
                    series = item.memSeriesList
                } else if (hardwareType === HARDWARE_TYPE.DISK) {
                    series = item.diskSeriesList
                } else if (hardwareType === HARDWARE_TYPE.TCPCONNS) {
                    series = item.tcpSeriesList
                } else if (hardwareType === HARDWARE_TYPE.TCPRETRANS) {
                    series = item.tcpSeriesList
                } else if (hardwareType === HARDWARE_TYPE.UDPSENT) {
                    series = item.udpSeriesList
                } else if (hardwareType === HARDWARE_TYPE.UDPRECV) {
                    series = item.udpSeriesList
                } else if (hardwareType === HARDWARE_TYPE.SENDBYTES) {
                    series = item.networkSeriesList
                } else if (hardwareType === HARDWARE_TYPE.RECVBYTES) {
                    series = item.networkSeriesList
                } else if (hardwareType === HARDWARE_TYPE.HANDLED_CONNECTION || hardwareType === HARDWARE_TYPE.ACCEPTS_CONNECTION || hardwareType === HARDWARE_TYPE.ACTIVE_CONNECTION) {
                    series = item.connectionsSeriesList
                }
                //////todo:cloudllet/////////
                else if (hardwareType === HARDWARE_TYPE.NETSEND || hardwareType === HARDWARE_TYPE.NETRECV || hardwareType === HARDWARE_TYPE.MEM_USED || hardwareType === HARDWARE_TYPE.DISK_USED || hardwareType === HARDWARE_TYPE.VCPU_USED) {
                    series = item.series
                } else if (hardwareType === HARDWARE_TYPE.FLOATING_IP_USED || hardwareType === HARDWARE_TYPE.IPV4_USED) {
                    series = item.ipSeries
                }

                hardWareUsageIndex = findUsageIndexByKey(usageColumnList, hardwareType)

                if (_this.state.currentClassification.toLowerCase().includes(CLASSIFICATION.CLUSTER.toLowerCase())) {
                    classificationName = item.cluster + "\n[" + item.cloudlet + "]";
                } else if (_this.state.currentClassification.toLowerCase().includes(CLASSIFICATION.CLOUDLET.toLowerCase())) {
                    classificationName = item.cloudlet
                } else if (_this.state.currentClassification.toLowerCase().includes(CLASSIFICATION.APPINST.toLowerCase())) {
                    classificationName = item.instance.AppName
                }

                let usageList = [];
                for (let j in series) {
                    let usageOne = series[j][hardWareUsageIndex];
                    usageList.push(usageOne);
                    let dateOne = series[j]["0"];
                    dateOne = dateOne.toString().split("T");
                    dateTimeList.push(dateOne[1]);
                }
                cloudletClusterAppInstNameList.push(classificationName);
                usageSetList.push(usageList);
                colorCodeIndexList.push(item.colorCodeIndex);
            });

            //@desc: cut List with RECENT_DATA_LIMIT_COUNT
            let newDateTimeList = [];
            for (let i in dateTimeList) {
                if (i < RECENT_DATA_LIMIT_COUNT) {
                    let splitDateTimeArrayList = dateTimeList[i].toString().split(".");
                    let timeOne = splitDateTimeArrayList[0].replace("T", "T");
                    newDateTimeList.push(timeOne.toString())//.substring(3, timeOne.length))
                }
            }

            let _result = {
                levelTypeNameList: cloudletClusterAppInstNameList,
                usageSetList,
                newDateTimeList,
                hardwareType,
                colorCodeIndexList,
            }

            return _result
        }
    } catch (e) {
        //throw new Error(e)
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
    } else if (themeTitle === THEME_OPTIONS.BLUE) {
        await _this.setState({
            chartColorList: CHART_COLOR_LIST2
        })
    } else if (themeTitle === THEME_OPTIONS.GREEN) {
        await _this.setState({
            chartColorList: CHART_COLOR_LIST3
        })
    } else if (themeTitle === THEME_OPTIONS.RED) {
        await _this.setState({
            chartColorList: CHART_COLOR_LIST4
        })
    } else if (themeTitle === THEME_OPTIONS.MONOKAI) {
        await _this.setState({
            chartColorList: CHART_COLOR_MONOKAI
        })
    } else if (themeTitle === THEME_OPTIONS.APPLE) {
        await _this.setState({
            chartColorList: CHART_COLOR_APPLE
        })
    } else if (themeTitle === THEME_OPTIONS.EXOTIC_ORCHIDS) {
        await _this.setState({
            chartColorList: CHART_COLOR_EXOTIC_ORCHIDS
        })
    } else if (themeTitle === THEME_OPTIONS.URBAN_SKYLINE) {
        await _this.setState({
            chartColorList: CHART_COLOR_URBAN_SKYLINE
        })
    } else if (themeTitle === THEME_OPTIONS.BERRIES_GALORE) {
        await _this.setState({
            chartColorList: CHART_COLOR_BERRIES_GALORE
        })
    } else if (themeTitle === THEME_OPTIONS.BRIGHT_AND_ENERGETIC) {
        await _this.setState({
            chartColorList: CHART_COLOR_BRIGHT_AND_ENERGETIC
        })
    } else if (themeTitle === THEME_OPTIONS.EARTHY_AND_NATURAL) {
        await _this.setState({
            chartColorList: CHART_COLOR_EARTHY_AND_NATURAL
        })
    } else if (themeTitle === THEME_OPTIONS.BRIGHT_AND_ENERGETIC) {
        await _this.setState({
            chartColorList: CHART_COLOR_BRIGHT_AND_ENERGETIC
        })
    } else if (themeTitle === THEME_OPTIONS.JAZZ_NIGHT) {
        await _this.setState({
            chartColorList: CHART_COLOR_JAZZ_NIGHT
        })
    } else if (themeTitle === THEME_OPTIONS.JAZZ_NIGHT) {
        await _this.setState({
            chartColorList: CHART_COLOR_JAZZ_NIGHT
        })
    } else if (themeTitle === THEME_OPTIONS.BLUE_MOUNTAIN_PEAKS_AND_CLOUDS) {
        await _this.setState({
            chartColorList: CHART_COLOR_BLUE_MOUNTAIN_PEAKS_AND_CLOUDS
        })
    } else if (themeTitle === THEME_OPTIONS.BRIGHT_AND_FRUITY) {
        await _this.setState({
            chartColorList: CHART_COLOR_BRIGHT_AND_FRUITY
        })
    }


    let selectedChartColorList = _this.state.chartColorList;
    reactLocalStorage.setObject(getUserId() + "_mon_theme", selectedChartColorList)
    reactLocalStorage.set(getUserId() + "_mon_theme_title", themeTitle)
    _this.setState({
        chartColorList: selectedChartColorList,
    }, async () => {
        _this.setState({
            bubbleChartData: await makeClusterBubbleChartData(_this.state.filteredClusterUsageList, _this.state.currentHardwareType, _this.state.chartColorList, _this.state.currentColorIndex),
        })
    })

}

/**
 *
 * @param _this
 * @param clickedItem
 * @param lineChartDataSet
 */
export const handleLegendAndBubbleClickedEvent = (_this: PageMonitoringView, clickedItem, lineChartDataSet) => {
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

export const covertYAxisUnits = (value, hardwareType, _this) => {
        try {
            //TODO: CLOUDLET LEVEL
            if (_this.state.currentClassification === CLASSIFICATION.CLOUDLET || _this.state.currentClassification === CLASSIFICATION.CLOUDLET_FOR_ADMIN) {
                if (hardwareType === HARDWARE_TYPE.VCPU_USED) {
                    return value
                } else if (hardwareType === HARDWARE_TYPE.MEM_USED) {
                    return value + " MB"
                } else if (hardwareType === HARDWARE_TYPE.DISK_USED) {
                    return value + " GB"
                } else if (hardwareType === HARDWARE_TYPE.NET_SEND || hardwareType === HARDWARE_TYPE.NET_RECV) {
                    return convertToMegaGigaForNumber(value);
                } else {
                    return convertToMegaGigaForNumber(value);
                }
            } else if (_this.state.currentClassification === CLASSIFICATION.CLUSTER || _this.state.currentClassification === CLASSIFICATION.CLUSTER_FOR_ADMIN) {
                if (hardwareType === HARDWARE_TYPE.CPU) {
                    return value + " %";
                } else if (hardwareType === HARDWARE_TYPE.DISK || hardwareType === HARDWARE_TYPE.MEM) {
                    return value.toFixed(2) + " %";
                } else if (hardwareType === HARDWARE_TYPE.SENDBYTES || hardwareType === HARDWARE_TYPE.RECVBYTES) {
                    return convertByteToMegaGigaByte(value, hardwareType)
                } else if (hardwareType === HARDWARE_TYPE.UDPRECV || hardwareType === HARDWARE_TYPE.UDPSENT) {
                    return convertToMegaGigaForNumber(value);
                } else if (hardwareType === HARDWARE_TYPE.CPU_MEM_DISK) {
                    return value + " %";
                } else if (hardwareType === `${HARDWARE_TYPE.UDPRECV} / ${HARDWARE_TYPE.UDPSENT}` || hardwareType === `${HARDWARE_TYPE.TCPCONNS} / ${HARDWARE_TYPE.TCPRETRANS}`) {
                    return convertToMegaGigaForNumber(value);
                } else if (hardwareType === `${HARDWARE_TYPE.SENDBYTES} / ${HARDWARE_TYPE.RECVBYTES}`) {
                    return convertByteToMegaGigaByte(value);
                } else {
                    return convertToMegaGigaForNumber(value);
                }

            } else if (_this.state.currentClassification === CLASSIFICATION.APPINST || _this.state.currentClassification === CLASSIFICATION.APP_INST_FOR_ADMIN) {
                if (hardwareType === HARDWARE_TYPE.CPU) {
                    return value.toFixed(1) + " %";
                } else if (hardwareType === HARDWARE_TYPE.DISK || hardwareType === HARDWARE_TYPE.MEM || hardwareType === HARDWARE_TYPE.RECVBYTES || hardwareType === HARDWARE_TYPE.SENDBYTES) {
                    return convertByteToMegaGigaByte(value)
                } else {
                    return value;
                }
            }
        } catch
            (e) {

        }
    }
;


/**
 *
 * @param items
 * @param key
 * @returns {*}
 */
export const listGroupByKey = (items, key) => items.reduce(
    (result, item) => ({
        ...result,
        [item[key]]: [
            ...(result[item[key]] || []),
            item,
        ],
    }),
    {},
);

export function makeUniqOperOrg(cloudletList) {
    let operatorList = []
    cloudletList.map((item: TypeCloudlet, index) => {
        operatorList.push(item.Operator)
    })
    let uniqOperList = _.uniqBy(operatorList)
    let newOperList = []
    uniqOperList.map(item => {
        newOperList.push(item)
    })

    return newOperList;
}

export function makeUniqDevOrg(appInstList) {
    let filterlist = []
    appInstList.map((item: TypeAppInst, index) => {
        filterlist.push(item.OrganizationName)
    })
    let uniqFilteredList = _.uniqBy(filterlist)
    let newFilteredList = []
    uniqFilteredList.map(item => {
        newFilteredList.push(item)
    })

    return newFilteredList;
}


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
                    fontWeight: 'bold',
                },
                /*onClick: (e, clickedItem) => {
                    /!*let selectedClusterOne = clickedItem.text.toString().replace('\n', "|");
                    handleLegendAndBubbleClickedEvent(_this, selectedClusterOne, lineChartDataSet)*!/
                },
                onHover: (e, item) => {
                    //alert(`Item with text ${item.text} and index ${item.index} hovered`)
                },*/
            },
            scales: {
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    // max: 100,//todo max value
                    fontColor: 'white',
                    callback(value, index, label) {
                        return covertYAxisUnits(value, hardwareType, _this,)
                    },
                },
                gridLines: {
                    color: "#fff",
                },
                yAxes: [{
                    id: 'A',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        fontColor: "#CCC", // this here
                        callback(value, index, label) {
                            return covertYAxisUnits(value, hardwareType, _this,)
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
                        maxTicksLimit: isBig ? 50 : 5,//@desc: maxTicksLimit
                        fontSize: 9,
                        fontColor: 'white',
                        //maxRotation: 0.05,
                        autoSkip: isBig ? false : true,
                        maxRotation: isBig ? 45 : 0,//xAxis text rotation
                        minRotation: isBig ? 45 : 0,//xAxis text rotation
                        padding: 10,
                        labelOffset: 0,
                        callback(value, index, label) {
                            if (RECENT_DATA_LIMIT_COUNT >= 50) {
                                if (index % 2 === 0)
                                    return '';
                                else
                                    return value;
                            } else {
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


export const makeLineChartDataForBigModal = (lineChartDataSet, _this: PageMonitoringView, currentColorIndex = -1) => {
    try {
        const lineChartData = (canvas) => {
            let gradientList = makeGradientColorList(canvas, 305, _this.state.chartColorList, true);
            let levelTypeNameList = lineChartDataSet.levelTypeNameList
            let usageSetList = lineChartDataSet.usageSetList
            let newDateTimeList = lineChartDataSet.newDateTimeList
            let colorCodeIndexList = lineChartDataSet.colorCodeIndexList;

            let isStackedLineChart = _this.state.isStackedLineChart;
            if (colorCodeIndexList !== undefined && colorCodeIndexList.length === 1) {
                isStackedLineChart = true;
            }

            let finalSeriesDataSets = [];
            for (let index in usageSetList) {
                let _colorIndex = usageSetList.length > 1 ? index : currentColorIndex;
                let dataSetsOne = {
                    label: levelTypeNameList[index],
                    radius: 0,
                    borderWidth: 3.5,//todo:line border width
                    fill: isStackedLineChart,
                    backgroundColor: _this.state.isGradientColor ? gradientList[_colorIndex] : _this.state.chartColorList[colorCodeIndexList[index]],
                    borderColor: _this.state.isGradientColor ? gradientList[_colorIndex] : _this.state.chartColorList[colorCodeIndexList[index]],
                    lineTension: 0.5,
                    data: usageSetList[index],
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: _this.state.chartColorList[colorCodeIndexList[index]],
                    pointBackgroundColor: _this.state.chartColorList[colorCodeIndexList[index]],
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: _this.state.chartColorList[colorCodeIndexList[index]],
                    pointHoverBorderColor: _this.state.chartColorList[colorCodeIndexList[index]],
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                };

                finalSeriesDataSets.push(dataSetsOne)
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


/**
 *
 * @param str
 * @param lengthLimit
 * @returns {string}
 */
export const reduceString = (str: string, lengthLimit: number, legendItemCount) => {
    if (legendItemCount === 1) {
        return str;
    } else if (str.length > lengthLimit) {
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
 * @param hwType
 * @param isOnlyOneData
 * @param colorCodeIndexList
 * @returns {function(*=): {datasets: *, labels: *}}
 */
export const makeGradientLineChartData = (levelTypeNameList, usageSetList, newDateTimeList, _this: PageMonitoringView, isGradientColor = false, hwType, isOnlyOneData = false, colorCodeIndexList) => {
    try {

        const lineChartData = (canvas) => {
            let gradientList = makeGradientColorList(canvas, 250, _this.state.chartColorList);
            let finalSeriesDataSets = [];
            for (let index in usageSetList) {
                let datasetsOne = {
                    label: levelTypeNameList[index],
                    radius: 0,
                    borderWidth: 3,//todo:라인 두께
                    fill: isGradientColor,// @desc:fill
                    backgroundColor: isGradientColor ? gradientList[colorCodeIndexList[index]] : _this.state.chartColorList[colorCodeIndexList[index]],
                    borderColor: isGradientColor ? gradientList[colorCodeIndexList[index]] : _this.state.chartColorList[colorCodeIndexList[index]],
                    lineTension: 0.5,
                    data: usageSetList[index],
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: _this.state.chartColorList[colorCodeIndexList[index]],
                    pointBackgroundColor: _this.state.chartColorList[colorCodeIndexList[index]],
                    pointHoverBackgroundColor: _this.state.chartColorList[colorCodeIndexList[index]],
                    pointHoverBorderColor: _this.state.chartColorList[colorCodeIndexList[index]],
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    order: index,
                };
                finalSeriesDataSets.push(datasetsOne)
            }


            let chartDataSet = {
                labels: newDateTimeList,
                datasets: finalSeriesDataSets,
            }

            return chartDataSet;
        };

        return lineChartData;
    } catch (e) {

    }
};


export const convertToClassification = (pClassification) => {
    if (pClassification === CLASSIFICATION.CLOUDLET_FOR_ADMIN) {
        return CLASSIFICATION.CLOUDLET
    } else if (pClassification === CLASSIFICATION.CLUSTER_FOR_ADMIN) {
        return CLASSIFICATION.CLUSTER
    } else if (pClassification === CLASSIFICATION.APP_INST_FOR_ADMIN) {
        return CLASSIFICATION.APP_INST
    } else if (pClassification === CLASSIFICATION.APPINST) {
        return CLASSIFICATION.APP_INST
    } else if (pClassification === CLASSIFICATION.CLUSTER_FOR_OPER) {
        return CLASSIFICATION.CLUSTER
    } else {
        return pClassification.toString().replace("_", " ")
    }
};

export const reduceLegendClusterCloudletName = (item, _this: PageMonitoringView, stringLimit, isLegendExpanded = true) => {
    let clusterCloudletName = '';
    if (_this.state.userType.includes(USER_TYPE_SHORT.DEV)) {
        clusterCloudletName = item.cluster + " [" + item.cloudlet + "]"
    } else {
        clusterCloudletName = item.cluster
    }
    return (
        <div style={{display: 'flex'}}>
            <div>
                {reduceString(clusterCloudletName, isLegendExpanded ? stringLimit : 3)}
            </div>

        </div>
    )
}


export function convertHWType(hwType) {
    if (hwType === HARDWARE_TYPE.VCPU_USED) {
        return 'vCPU';
    } else if (hwType === HARDWARE_TYPE.MEM_USED) {
        return 'MEM';
    } else if (hwType === HARDWARE_TYPE.DISK_USED) {
        return 'DISK';
    } else if (hwType === HARDWARE_TYPE.IPV4_USED) {
        return 'IPV4';
    } else if (hwType === HARDWARE_TYPE.FLOATING_IP_USED) {
        return 'FLOATING IP';
    } else if (hwType === HARDWARE_TYPE.NETSEND) {
        return 'NET SEND';
    } else if (hwType === HARDWARE_TYPE.NETRECV) {
        return 'NET RECV';
    } else {
        return hwType;
    }
}


export const makeClusterMultiDropdownForAdmin = (cloudletList, clusterList, _this,) => {

    let treeClusterList = []
    cloudletList.map((cloudletOne, cloudletIndex) => {
        let newCloudletOne = {
            title: (
                <div>
                    {cloudletOne.CloudletName}
                </div>
            ),
            value: cloudletOne.CloudletName,
            children: [],
            region: cloudletOne.Region,
            oper: cloudletOne.oper,
            selectable: true,

        };

        clusterList.map((clusterItemOne: TypeCluster, innerIndex) => {
            if (clusterItemOne.Cloudlet === cloudletOne.CloudletName) {
                newCloudletOne.children.push({
                    title: (
                        <div style={{display: 'flex'}}>
                            <Center style={{width: 15,}}>
                                {_this.renderClusterDot(clusterItemOne.colorCodeIndex, 10)}
                            </Center>
                            <div style={{marginLeft: 5,}}>
                                {reduceString(clusterItemOne.ClusterName, 37)}
                            </div>

                        </div>
                    ),
                    value: clusterItemOne.ClusterName + " | " + cloudletOne.CloudletName,
                    isParent: false,

                })
            }
        })

        treeClusterList.push(newCloudletOne);
    })


    return treeClusterList

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


export const makeFormForAppLevelUsageList = (dataOne, valid = "*", token, fetchingDataNo = 20, pStartTime = '', pEndTime = '') => {

    let appName = dataOne.AppName;
    if (dataOne.AppName.includes('[')) {
        appName = dataOne.AppName.toString().split('[')[0]
    }

    if (pStartTime !== '' && pEndTime !== '') {

        let form = {
            "token": token,
            "params": {
                "region": dataOne.Region,
                "appinst": {
                    "app_key": {
                        "organization": dataOne.OrganizationName,
                        "name": appName,
                        "version": dataOne.Version
                    },
                    "cluster_inst_key": {
                        "cluster_key": {"name": dataOne.ClusterInst},
                        "cloudlet_key": {
                            "name": dataOne.Cloudlet,
                            "organization": dataOne.Operator
                        }
                    }
                },
                "selector": valid,
                "last": fetchingDataNo,
                "starttime": pStartTime,
                "endtime": pEndTime,
            }
        }
        return form;


    } else {

        let form = {
            "token": token,
            "params": {
                "region": dataOne.Region,
                "appinst": {
                    "app_key": {
                        "organization": dataOne.OrganizationName,
                        "name": dataOne.AppName.toLowerCase().replace(/\s+/g, ''),
                        "version": dataOne.Version
                    },
                    "cluster_inst_key": {
                        "cluster_key": {"name": dataOne.ClusterInst},
                        "cloudlet_key": {
                            "name": dataOne.Cloudlet,
                            "organization": dataOne.Operator
                        }
                    }
                },
                "selector": valid,
                //"last": 25
                "last": fetchingDataNo,
            }
        }

        return form;
    }
}


/**
 *
 * @param filteredAppInstList
 * @param allClientStatusList
 */
export function filteredClientStatusListByAppName(filteredAppInstList, allClientStatusList) {

    let appNames = []
    filteredAppInstList.map((item: TypeAppInst, index) => {
        appNames.push(item.AppName)
    })

    return allClientStatusList.filter((item: TypeClientStatus, index) => {
        let count = 0;
        appNames.map(appNameOne => {
            if (appNameOne === item.app) {
                count++;
            }
        })

        return count > 0;
    })
}

export function makeMapThemeDropDown(_this) {
    return (
        <Select
            size={"small"}
            defaultValue="dark1"
            style={{width: 70, zIndex: 9999999999, height: 15, background: 'black !important'}}
            showArrow={false}
            bordered={false}
            ref={c => _this.themeSelect = c}
            listHeight={550}
            onChange={async (value) => {
                try {
                    let index = value
                    let lineColor = DARK_LINE_COLOR
                    let cloudletIconColor = DARK_CLOUTLET_ICON_COLOR
                    if (Number(index) >= 4) {
                        lineColor = WHITE_LINE_COLOR;
                        cloudletIconColor = WHITE_CLOUTLET_ICON_COLOR
                    }
                    _this.props.setMapTyleLayer(mapTileList[index].url);
                    _this.props.setLineColor(lineColor);
                    _this.props.setCloudletIconColor(cloudletIconColor);
                    setTimeout(() => {
                        _this.themeSelect.blur();
                    }, 250)

                } catch (e) {
                    throw new Error(e)
                }
            }}
        >
            {mapTileList.map((item, index) => {
                return (
                    <Option key={index} style={{color: 'white'}} defaultChecked={index === 0}
                            value={item.value}>{item.name}</Option>
                )
            })}
        </Select>
    )
}

export function makeStringLimit(classification, _this: any) {
    let stringLimit = 25;
    if (classification === CLASSIFICATION.APP_INST_FOR_ADMIN) {
        if (_this.props.size.width > 1600) {
            stringLimit = 27
        } else if (_this.props.size.width < 1500 && this.props.size.width >= 1380) {
            stringLimit = 18
        } else if (_this.props.size.width < 1380 && this.props.size.width >= 1150) {
            stringLimit = 14
        } else if (_this.props.size.width < 1150 && this.props.size.width >= 720) {
            stringLimit = 10
        } else if (_this.props.size.width < 720) {
            stringLimit = 4
        }
    } else if (classification === CLASSIFICATION.CLOUDLET) {
        if (_this.props.size.width > 1600) {
            stringLimit = 25
        } else if (_this.props.size.width < 1500 && this.props.size.width >= 1380) {
            stringLimit = 17
        } else if (_this.props.size.width < 1380 && this.props.size.width >= 1150) {
            stringLimit = 14
        } else if (_this.props.size.width < 1150 && this.props.size.width >= 720) {
            stringLimit = 10
        } else if (_this.props.size.width < 720) {
            stringLimit = 4
        }

    } else if (classification === CLASSIFICATION.CLUSTER) {
        if (_this.props.size.width > 1500) {
            stringLimit = 49
        } else if (_this.props.size.width < 1500 && this.props.size.width >= 1300) {
            stringLimit = 42
        } else if (_this.props.size.width < 1300 && this.props.size.width >= 1100) {
            stringLimit = 34
        } else if (_this.props.size.width < 1100) {
            stringLimit = 28
        }
    } else if (classification === CLASSIFICATION.CLUSTER_FOR_ADMIN) {
        if (_this.props.size.width > 1500) {
            stringLimit = 30
        } else if (_this.props.size.width < 1500 && this.props.size.width >= 1300) {
            stringLimit = 22
        } else if (_this.props.size.width < 1300 && this.props.size.width >= 1100) {
            stringLimit = 15
        } else if (_this.props.size.width < 1100) {
            stringLimit = 7
        }
    }

    return stringLimit;
}


export const makeOrgTreeDropdown = (operOrgList, devOrgList) => {

    let newOrgList = []
    operOrgList.map(item => {
        newOrgList.push({
            title: (
                <div style={{display: 'flex'}}>
                    <div>{item}</div>
                </div>
            ),
            value: item,
            isDev: false,
        })
    })

    let newDevOrgList = []
    devOrgList.map(item => {
        newDevOrgList.push({
            title: (
                <div style={{display: 'flex'}}>
                    <div>{item}</div>
                </div>
            ),
            value: item,
            isDev: true,
        })
    })


    const treeData = [
        {
            title: (<div style={{}}>All</div>),
            value: 'Reset',
            selectable: true,
        },
        {
            title: 'Operator',
            value: '1',
            selectable: false,
            children: newOrgList
        },
        {
            title: 'Developer',
            value: '2',
            selectable: false,
            children: newDevOrgList
        },
    ];

    return treeData;

}


export const makeRegionCloudletClusterTreeDropdown = (allRegionList, cloudletList, clusterList, _this, isShowRegion = true) => {

    let treeCloudletList = []
    cloudletList.map((cloudletOne, cloudletIndex) => {
        let newCloudletOne = {
            title: (
                <div>{cloudletOne.CloudletName}&nbsp;&nbsp;
                    <Tag color="grey" style={{color: 'black'}}>Cloudlet</Tag>
                </div>
            ),
            value: cloudletOne.CloudletName,
            children: [],
            region: cloudletOne.Region,
            oper: cloudletOne.oper,
            selectable: true,

        };

        clusterList.map((clusterItemOne: any, innerIndex) => {
            if (clusterItemOne.cloudlet === cloudletOne.CloudletName) {
                newCloudletOne.children.push({
                    title: (
                        <div style={{display: 'flex'}}>
                            <Center style={{width: 15,}}>
                                {_this.renderClusterDot(clusterItemOne.colorCodeIndex, 10)}
                            </Center>
                            <div style={{marginLeft: 5,}}>
                                {reduceString(clusterItemOne.cluster, 40)}
                            </div>

                        </div>
                    ),
                    value: clusterItemOne.cluster + " | " + cloudletOne.CloudletName,
                    isParent: false,

                })
            }
        })

        treeCloudletList.push(newCloudletOne);
    })

    if (isShowRegion) {//TODO: ADD REGION PARENT
        let regionTreeList = []
        allRegionList.map((regionOne, regionIndex) => {
            let regionMapOne = {
                title: (
                    <div style={{fontWeight: 'bold', fontStyle: 'italic'}}>
                        {regionOne}
                    </div>
                ),
                value: regionOne,
                children: []
            };

            treeCloudletList.map((innerItem, innerIndex) => {
                if (regionOne === innerItem.region) {
                    regionMapOne.children.push(innerItem)
                }
            })
            regionTreeList.push(regionMapOne)
        })

        return regionTreeList;
    } else {
        return treeCloudletList
    }

}

export const makeDropdownForCloudletForDevView = (pList) => {
    try {


        let newArrayList = [];
        newArrayList.push({
            key: undefined | undefined | undefined,
            value: undefined | undefined | undefined,
            text: 'Reset Filter',
        })
        pList.map((item: TypeAppInst, index) => {
            let Cloudlet = item.Cloudlet
            let CloudletLocation = JSON.stringify(item.CloudletLocation)
            let cloudletFullOne = Cloudlet + " | " + CloudletLocation + " | " + item.Region
            newArrayList.push({
                region: item.Region,
                key: cloudletFullOne,
                value: cloudletFullOne,
                text: Cloudlet,
            })
        })

        return newArrayList;
    } catch (e) {

    }
};
export const insert = (arr, index, newItem) => [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    newItem,
    // part of the array after the specified index
    ...arr.slice(index)
]

export const makeDropdownForCloudlet = (pList) => {
    try {
        let newArrayList = [];
        pList.map((item: TypeCloudlet, index) => {
            let Cloudlet = item.CloudletName
            let CloudletLocation = JSON.stringify(item.CloudletLocation)
            let cloudletFullOne = Cloudlet + " | " + CloudletLocation + " | " + item.Region
            newArrayList.push({
                region: item.Region,
                key: cloudletFullOne,
                value: cloudletFullOne,
                text: Cloudlet,
            })
        })

        newArrayList = sortBy(newArrayList, [object => object.text.toLowerCase()], ['asc']);
        let nameSortedArrayList = insert(newArrayList, 0, {
            region: undefined,
            key: 'Reset',
            value: undefined,
            text: 'Reset Filter',
        })

        return nameSortedArrayList;
    } catch (e) {

    }
};

/**
 *
 * @param appInstList
 * @returns {[]}
 */
export const makeDropdownForAppInst = (appInstList) => {
    let appInstDropdownList = [];
    try {
        appInstList.map((item: TypeAppInst, index) => {
            let AppName = item.AppName
            let Cloudlet = item.Cloudlet
            let ClusterInst = item.ClusterInst
            let Version = item.Version
            let Region = item.Region
            let HealthCheck = item.HealthCheck
            let Operator = item.Operator
            let CloudletLocation = {
                lat: item.CloudletLocation.latitude,
                long: item.CloudletLocation.longitude,
            };

            let specifiedAppInstOne = AppName + " | " + Cloudlet + " | " + ClusterInst + " | " + Version + " | " + Region + " | " + HealthCheck + " | " + Operator + " | " + JSON.stringify(CloudletLocation);
            appInstDropdownList.push({
                key: specifiedAppInstOne,
                value: specifiedAppInstOne + " | " + JSON.stringify(item),
                text: AppName.trim() + " [" + Version.toString().trim() + "]",
            })
        })
        return appInstDropdownList;
    } catch (e) {

    }
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


export const makeBarChartDataForCloudlet = (usageList, hardwareType, _this, currentColorIndex = -1) => {

    try {
        if (usageList.length === 0) {
            return "";
        } else {
            let chartDataList = [];
            chartDataList.push([
                "Element", hardwareType + " Utilization",
                {
                    type: 'string',
                    role: 'tooltip',
                    'p': {'html': true}
                },

                {role: "style"},
                {role: 'annotation'}
            ]);
            for (let index = 0; index < usageList.length; index++) {

                let tooltipOne = `<div style="background-color:black ;color: white; padding: 15px; font-size: 9pt; font-style: italic; font-family: Roboto; min-width: 200px; border: solid 1px rgba(255, 255, 255, .2) ">
                                    <div>
                                        ${usageList[index].cloudlet.toString()}
                                    </div>
                                    <div style="display: flex">
                                        <div style="color: yellow">
                                            ${hardwareType}
                                        </div>
                                        <div>
                                            : ${renderUsageLabelByType(usageList[index], hardwareType)}
                                        </div>
                                    </div>
                                  </div>`

                let barDataOne = [
                    usageList[index].cloudlet.toString(),
                    renderUsageByType(usageList[index], hardwareType, _this),
                    tooltipOne,
                    usageList.length === 1 ? _this.state.chartColorList[currentColorIndex] : _this.state.chartColorList[index],
                    renderUsageLabelByType(usageList[index], hardwareType) //@desc:annotation
                ];

                chartDataList.push(barDataOne);
            }

            let chartDataSet = {
                chartDataList,
                hardwareType,
            };

            return chartDataSet
        }
    } catch (e) {

    }
}
