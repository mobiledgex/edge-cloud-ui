import React from 'react';
import './PageMonitoring.css';
import {toast} from "react-semantic-toasts";
import {HARDWARE_TYPE, HARDWARE_TYPE_FOR_CLOUDLET,} from "../../../shared/Constants";
import Lottie from "react-lottie";
import {removeDuplication} from "./dev/PageMonitoringServiceForDeveloper";
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";

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

export const cutArrayList = (length: number = 5, paramArrayList: any) => {
    let newArrayList = [];
    for (let index in paramArrayList) {
        if (index < 5) {
            newArrayList.push(paramArrayList[index])
        }
    }
    return newArrayList;
}

/**
 * @todo: 로딩이 완료 되기전에 placeholder를 보여준다..
 * @returns {*}
 */
export const renderPlaceHolder = (type: string = '') => {
    // let boxWidth = window.innerWidth / 3 - 50;
    return (
        <div className='page_monitoring_blank_box' style={{height: type === 'network' ? window.innerHeight / 3 - 10 : '100%'}}>
            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: require('../../../lotties/loader001'),
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                height={120}
                width={120}
                isStopped={false}
                isPaused={false}
            />
        </div>
    )
}


export const renderBarChartCore = (chartDataList, hardwareType) =>{
    return (
        <Chart
            width="100%"
            //height={hardwareType === HARDWARE_TYPE.RECV_BYTE || hardwareType === HARDWARE_TYPE.SEND_BYTE ? chartHeight - 10 : '100%'}
            height={'100%'}
            chartType="BarChart"
            loader={<div><CircularProgress style={{color: 'red', zIndex: 999999}}/></div>}
            data={chartDataList}
            options={{
                annotations: {
                    style: 'line',
                    textStyle: {
                        //fontName: 'Righteous',
                        fontSize: 12,
                        //bold: true,
                        //italic: true,
                        // The color of the text.
                        color: '#fff',
                        // The color of the text outline.
                        //auraColor: 'black',
                        // The transparency of the text.
                        opacity: 1.0
                    },
                    boxStyle: {
                        // Color of the box outline.
                        stroke: '#ffffff',
                        // Thickness of the box outline.
                        strokeWidth: 1,
                        // x-radius of the corner curvature.
                        rx: 10,
                        // y-radius of the corner curvature.
                        ry: 10,
                    }
                },

                is3D: true,
                title: '',
                titleTextStyle: {
                    color: '#fff',
                    fontSize: 12,
                    /*fontName: <string>, // i.e. 'Times New Roman'
                    fontSize: <number>, // 12, 18 whatever you want (don't specify px)
                     bold: <boolean>,    // true or false
                      // true of false*/
                },
                //titlePosition: 'out',
                chartArea: {
                    // left: 20, right: 150, top: 50, bottom: 25,
                    width: "60%", height: "80%",
                },
                legend: {position: 'none'},//우측 Data[0]번째 텍스트를 hide..
                //xAxis
                hAxis: {
                    textPosition: 'none',//HIDE xAxis
                    title: '',
                    titleTextStyle: {
                        //fontName: "Times",
                        fontSize: 12,
                        fontStyle: "italic",
                        color: 'white'
                    },
                    minValue: 0,
                    textStyle: {
                        color: "white"
                    },
                    gridlines: {
                        color: "grey"
                    },
                    format: hardwareType === HARDWARE_TYPE.CPU ? '#\'%\'' : '0.##\' byte\'',
                    baselineColor: "grey",
                    //out', 'in', 'none'.
                },
                //Y축
                vAxis: {
                    title: '',
                    titleTextStyle: {
                        fontSize: 20,
                        fontStyle: "normal",
                        color: 'white'
                    },
                    textStyle: {
                        color: "white",
                        fontSize: 12,
                    },

                },
                //colors: ['#FB7A21'],
                fontColor: 'white',
                backgroundColor: {
                    fill: '#1e2124'
                },
                /*  animation: {
                      duration: 300,
                      easing: 'out',
                      startup: true
                  }*/
                //colors: ['green']
            }}

            // For tests
            rootProps={{'data-testid': '1'}}
        />
    );
}


export const numberWithCommas = (x) => {
    let value = ''
    try {
        value = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (e) {
        console.log('error===>', e);
    } finally {
        return value;
    }
}

export const covertToComparableDate = (paramDate) => {
    let arrayDate = paramDate.toString().split("-");
    let compareableFullDate = arrayDate[0] + arrayDate[1] + arrayDate[2]
    return compareableFullDate

}


export const makeFormForClusterLevelMatric = (dataOne, valid = "*", token, fetchingDataNo = 20, pStartTime = '', pEndTime = '') => {


    console.log('dataOne====>', dataOne);

    return (
        {
            "token": token,
            "params": {
                "region": dataOne.Region,
                "clusterinst": {
                    "cluster_key": {
                        "name": dataOne.ClusterName
                    },
                    "cloudlet_key": {
                        "operator_key": {
                            "name": dataOne.Operator
                        },
                        "name": dataOne.Cloudlet
                    },
                    "developer": dataOne.OrganizationName,
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
    let filterInstanceCountOnCloutLetOne = [];
    for (let [key, value] of Object.entries(appInstanceListGroupByCloudlet)) {
        if (key === pCloudLet) {
            filterInstanceCountOnCloutLetOne.push(value)
            break;
        }
    }
    return filterInstanceCountOnCloutLetOne;
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
    let instanceListFilteredByCloudlet = []
    appInstanceList.map(item => {
        if (item.Cloudlet === pCloudLet) {
            instanceListFilteredByCloudlet.push(item);
        }
    })
    return instanceListFilteredByCloudlet;
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

export const showToast = (title: string) => {
    toast({
        type: 'success',
        //icon: 'smile',
        title: title,
        //animation: 'swing left',
        time: 3 * 1000,
        color: 'black',
    });
}


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


export const renderUsageLabelByTypeForAppInst = (usageOne, hardwareType, userType = '') => {
    if (hardwareType === HARDWARE_TYPE.CPU) {

        if (userType === 'dev') {
            return usageOne.avgCpuUsed
        } else {
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
    }

    if (hardwareType === HARDWARE_TYPE.VCPU) {
        return numberWithCommas(usageOne.avgVCpuUsed) + " %"
    }

    if (hardwareType === HARDWARE_TYPE.MEM_USED) {
        return numberWithCommas(usageOne.avgMemUsed) + " Byte"
    }

    if (hardwareType === HARDWARE_TYPE.DISK_USED) {
        return numberWithCommas(usageOne.avgDiskUsed) + " Byte"
    }

    if (hardwareType === HARDWARE_TYPE.FLOATING_IPS_USED) {
        return usageOne.avgFloatingIpsUsed;
    }

    if (hardwareType === HARDWARE_TYPE.IPV4_USED) {
        return usageOne.avgIpv4Used;
    }

    if (hardwareType === HARDWARE_TYPE.NET_SEND) {
        return usageOne.avgNetSend;
    }

    if (hardwareType === HARDWARE_TYPE.NET_RECV) {
        return usageOne.avgNetRecv;
    }


    if (hardwareType === HARDWARE_TYPE.MEM) {
        return numberWithCommas(usageOne.sumMemUsage) + " Byte"
    }

    if (hardwareType === HARDWARE_TYPE.DISK) {
        return numberWithCommas(usageOne.sumDiskUsage) + " Byte"
    }

    if (hardwareType === HARDWARE_TYPE.RECV_BYTE) {
        return numberWithCommas(usageOne.sumRecvBytes) + " Byte";
    }

    if (hardwareType === HARDWARE_TYPE.SEND_BYTE) {
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


export const renderUsageByTypeForAppInst = (usageOne, hardwareType, role = '',) => {

    if (hardwareType === HARDWARE_TYPE.CPU) {
        return usageOne.sumCpuUsage
    }
    if (hardwareType === HARDWARE_TYPE.MEM) {
        return usageOne.sumMemUsage
    }
    if (hardwareType === HARDWARE_TYPE.DISK) {
        return usageOne.sumDiskUsage
    }
    if (hardwareType === HARDWARE_TYPE.RECV_BYTE) {
        return usageOne.sumRecvBytes
    }

    if (hardwareType === HARDWARE_TYPE.SEND_BYTE) {
        return usageOne.sumSendBytes
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

export const makeBubbleChartDataForCluster = (usageList: any) => {
    let bubbleChartData = []
    usageList.map((item, index) => {
        bubbleChartData.push({
            index: index,
            label: item.cloudlet.toString().substring(0, 10) + "...",
            value: item.avgCpuUsed.toFixed(2),
            favor: item.avgCpuUsed.toFixed(2),
            fullLabel: item.cloudlet.toString(),
        })
    })

    return bubbleChartData;
}

export const makeUniqCloudletList = (instanceList) => {
    let list = []

    console.log('instanceList===>', instanceList);
    instanceList.map(item => {
        console.log('item===>', item.Cloudlet);
        list.push({
            name: item.Cloudlet,
            long: item.CloudletLocation.longitude,
            lat: item.CloudletLocation.latitude,
        })
    })

    return removeDuplication(list, 'name')
}

export const handleBubbleChartDropDownForCluster = async (hwType, _this: PageMonitoringForDeveloper) => {
    await _this.setState({
        currentHardwareType: hwType,
    });

    let allUsageList = _this.state.allUsageList;
    let bubbleChartData = [];

    console.log('allUsageList===>', allUsageList);


    if (hwType === HARDWARE_TYPE.CPU.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: (item.avgCpuUsed * 1).toFixed(0),
                favor: (item.avgCpuUsed * 1).toFixed(0),
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.MEM.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.avgMemUsed.toFixed(0),
                favor: item.avgMemUsed.toFixed(0),
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.DISK.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.avgDiskUsed.toFixed(0),
                favor: item.avgDiskUsed.toFixed(0),
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.RECVBYTES.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.avgNetRecv,
                favor: item.avgNetRecv,
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.SENDBYTES.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.avgNetSend,
                favor: item.avgNetSend,
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.TCPCONNS.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.avgTcpConns.toFixed(0),
                favor: item.avgTcpConns.toFixed(0),
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.UDPSENT.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.avgUdpSent,
                favor: item.avgUdpSent,
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.SENDBYTES.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.avgSendBytes,
                favor: item.avgSendBytes,
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.RECVBYTES.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cloudlet.toString().substring(0, 10) + "...",
                value: item.avgRecvBytes,
                favor: item.avgRecvBytes,
                fullLabel: item.cluster,
            })
        })
    }


    await _this.setState({
        bubbleChartData: bubbleChartData,
    });
}





