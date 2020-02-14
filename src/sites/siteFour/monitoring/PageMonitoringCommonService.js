import React from 'react';
import './PageMonitoring.css';
import {toast} from "react-semantic-toasts";
import {HARDWARE_TYPE, lineGraphOptions, USAGE_TYPE,} from "../../../shared/Constants";
import Lottie from "react-lottie";
import {makeGradientColor} from "./dev/PageDevMonitoringService";
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeCompleteDateTime} from "./admin/PageAdminMonitoringService";
import moment from "moment";
import {Line as ReactChartJsLine} from "react-chartjs-2";
import {GridLoader} from "react-spinners";

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
        minHeight: '40px',
        zIndex: 9999999,
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
    },
    center: {
        display: 'flex',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        //backgroundColor:'red'
    },
    center2: {
        display: 'flex',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: 350,
        //backgroundColor:'red'
    }

}

{/*<Lottie
            options={{
                loop: true,
                autoplay: true,
                animationData: require('../../../lotties/10910-loade_dots.json'),
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid slice'
                }
            }}
            height={height}
            width={width}
            isStopped={false}
            isPaused={false}
            speed={3.0}
        />*/
}
export const renderGridLoader2 = (width, height) => {
    return (
        <GridLoader
            sizeUnit={"px"}
            size={20}
            color={'#70b2bc'}
            loading={true}
        />

    )
}

export const renderGridLoader = () => {
    return (
        <GridLoader
            sizeUnit={"px"}
            size={20}
            color={'#70b2bc'}
            loading={true}
        />
    )
}


export const renderPlaceHolderCircular = (type: string = '') => {
    return (
        <div className='page_monitoring_blank_box' style={{height: type === 'network' ? window.innerHeight / 3 - 10 : '100%'}}>
            {/*<Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: require('../../../lotties/14112-heartrate_777'),
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                speed={2.5}
                height={150}
                width={150}
                isStopped={false}
                isPaused={false}
            />*/}
            <CircularProgress style={{color: '#70b2bc', zIndex: 1, fontSize: 100}}
            />
        </div>
    )
}


export const renderPlaceHolderLottiePinJump = (type: string = '') => {
    return (
        <div className='page_monitoring_blank_box' style={{height: type === 'network' ? window.innerHeight / 3 - 10 : '100%', zIndex: 999999999999}}>
            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: require('../../../lotties/pinjump'),
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                speed={2.1}
                height={150}
                width={150}
                isStopped={false}
                isPaused={false}
            />
        </div>
    )
}

export const renderPlaceHolderLottiePinJump2 = (type: string = '') => {
    return (
        <div className='page_monitoring_blank_box' style={{zIndex: 999999999999, position: 'absolute', top: '1%', left: '1%'}}>
            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: require('../../../lotties/6698-location-pin22222'),
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                speed={2.9}
                height={350}
                width={350}
                isStopped={false}
                isPaused={false}
            />
        </div>
    )
}
/*
export const renderPlaceHolderLottie = (type: string = '') => {
    return (
        <div className='page_monitoring_blank_box' style={{height: type === 'network' ? window.innerHeight / 3 - 10 : '100%'}}>
            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: require('../../../lotties/11052-green-loader-ring_555'),
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                height={150}
                width={150}
                isStopped={false}
                isPaused={false}
            />
        </div>
    )
}*/

export const renderPlaceHolder3 = (type: string = '') => {
    // let boxWidth = window.innerWidth / 3 - 50;
    return (
        <div className='page_monitoring_blank_box' style={{height: type === 'network' ? window.innerHeight / 3 - 10 : '100%'}}>
            <CircularProgress style={{color: '#77BD25', zIndex: 9999999, fontSize: 20}}/>

        </div>
    )
}

export const convertByteToMegaByte = (value, hardwareType) => {
    if (value > 1000000) {
        return numberWithCommas(value / 1000000) + ' MByte'
    } else {
        return numberWithCommas(value)
    }
}


export const convertByteToMegaByte2 = (value, hardwareType) => {
    if (value > 1000000) {
        return value / 1000000
    } else {
        return value;
    }
}


export const renderLineChartCore = (paramLevelTypeNameList, usageSetList, newDateTimeList, hardwareType) => {

    const lineChartData = (canvas) => {
        let gradientList = makeGradientColor(canvas, height);
        let finishedSeriesDataSets = [];
        for (let i in usageSetList) {
            //@todo: top5 만을 추린다
            if (i < 5) {
                let datasetsOne = {
                    label: paramLevelTypeNameList[i],
                    backgroundColor: gradientList[i],//todo: 리전드box area fill True/false
                    fill: false,//todo: 라인차트 area fill True/false
                    //backgroundColor: '',
                    borderColor: gradientList[i],
                    borderWidth: 3.7, //lineBorder
                    lineTension: 0.5,
                    pointColor: "#fff",
                    pointStrokeColor: 'white',
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: 'white',
                    data: usageSetList[i],
                    radius: 0,
                    pointRadius: 1,

                }

                finishedSeriesDataSets.push(datasetsOne)
            }

        }
        return {
            labels: newDateTimeList,
            datasets: finishedSeriesDataSets,
        }
    }


    let height = 500 + 100;

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
                options={lineGraphOptions}
            />
        </div>
    );
}


export const renderUsageByType2 = (usageOne, hardwareType) => {

    if (hardwareType === HARDWARE_TYPE.VCPU) {
        return usageOne.sumVCpuUsage;
    }
    if (hardwareType === HARDWARE_TYPE.FLOATING_IPS) {
        return usageOne.sumFloatingIpsUsage;
    }
    if (hardwareType === HARDWARE_TYPE.IPV4) {
        return usageOne.sumIpv4Usage;
    }

    if (hardwareType === HARDWARE_TYPE.CPU) {
        return usageOne.sumCpuUsage
    }
    if (hardwareType === HARDWARE_TYPE.MEM) {
        return usageOne.sumMemUsage
    }
    if (hardwareType === HARDWARE_TYPE.DISK) {
        return usageOne.sumDiskUsage
    }
    if (hardwareType === HARDWARE_TYPE.RECVBYTES) {
        return usageOne.sumRecvBytes
    }

    if (hardwareType === HARDWARE_TYPE.SENDBYTES) {
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

export const sortUsageListByType = (usageList, hardwareType) => {
    if (hardwareType === HARDWARE_TYPE.VCPU) {
        usageList.sort((a, b) => b.sumVCpuUsage - a.sumVCpuUsage);
    } else if (hardwareType === HARDWARE_TYPE.MEM) {
        usageList.sort((a, b) => b.sumMemUsage - a.sumMemUsage);
    } else if (hardwareType === HARDWARE_TYPE.DISK) {
        usageList.sort((a, b) => b.sumDiskUsage - a.sumDiskUsage);
    } else if (hardwareType === HARDWARE_TYPE.FLOATING_IPS) {
        usageList.sort((a, b) => b.sumFloatingIpsUsage - a.sumFloatingIpsUsage);
    } else if (hardwareType === HARDWARE_TYPE.IPV4) {
        usageList.sort((a, b) => b.sumIpv4Usage - a.sumIpv4Usage);
    } else if (hardwareType === HARDWARE_TYPE.SENDBYTES) {
        usageList.sort((a, b) => b.sumRecvBytes - a.sumRecvBytes);
        usageList.sort((a, b) => b.sumSendBytes - a.sumSendBytes);
    }
    return usageList;
}


export const renderUsageByType = (usageOne, hardwareType, role = '',) => {

    if (hardwareType === HARDWARE_TYPE.CPU) {
        return usageOne.sumCpuUsage
    }
    if (hardwareType === HARDWARE_TYPE.MEM) {
        return usageOne.sumMemUsage
    }
    if (hardwareType === HARDWARE_TYPE.DISK) {
        return usageOne.sumDiskUsage
    }
    if (hardwareType === HARDWARE_TYPE.TCPCONNS) {
        return usageOne.sumTcpConns;
    }
    if (hardwareType === HARDWARE_TYPE.TCPRETRANS) {
        return usageOne.sumTcpRetrans;
    }
    ////////////////////////////
    if (hardwareType === HARDWARE_TYPE.UDPRECV) {
        return usageOne.sumUdpRecv;
    }
    if (hardwareType === HARDWARE_TYPE.UDPSENT) {
        return usageOne.sumUdpSent;
    }

    if (hardwareType === HARDWARE_TYPE.NET_SEND) {
        return usageOne.avgNetSend;
    }

    if (hardwareType === HARDWARE_TYPE.NET_RECV) {
        return usageOne.avgNetRecv;
    }


    if (hardwareType === HARDWARE_TYPE.RECV_BYTES) {
        return usageOne.sumRecvBytes
    }

    if (hardwareType === HARDWARE_TYPE.SEND_BYTES) {
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

export const renderBarChartCore = (chartDataList, hardwareType) => {
    return (
        <Chart
            width={"100%"}
            //height={hardwareType === HARDWARE_TYPE.RECV_BYTE || hardwareType === HARDWARE_TYPE.SEND_BYTE ? chartHeight - 10 : '100%'}
            height={'100%'}
            chartType="BarChart"
            loader={<div><CircularProgress style={{color: '#1cecff', zIndex: 999999}}/></div>}
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
                    stacked: true,
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


export const makeFormForClusterLevelMatric = (dataOne, valid = "*", token, fetchingDataNo = 20, pStartTime = '', pEndTime = '') => {
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


export const getOneYearStartEndDatetime = () => {

    let arrDateTime = []
    let startTime = makeCompleteDateTime(moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'));
    let endTime = makeCompleteDateTime(moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm'));

    arrDateTime.push(startTime)
    arrDateTime.push(endTime)

    return arrDateTime;
}

export const getOneYearStartEndDatetime2 = () => {

    let arrDateTime = []
    let startTime = makeCompleteDateTime(moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm:ss'));
    let endTime = makeCompleteDateTime(moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm:ss'));

    arrDateTime.push(startTime)
    arrDateTime.push(endTime)

    return arrDateTime;
}


export const showToast = (title: string, time = 2) => {
    toast({
        type: 'success',
        //icon: 'smile',
        title: title,
        //animation: 'swing left',
        time: time * 1000,
        color: 'black',
    });
}
export const showToast2 = (title: string, time = 2) => {
    toast({
        type: 'success',
        icon: 'star',
        title: title,
        //animation: 'swing left',
        time: time * 1000,
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

export const hardwareTypeToUsageKey = (hwType: string) => {
    if (hwType === HARDWARE_TYPE.CPU.toUpperCase()) {
        return USAGE_TYPE.SUM_CPU_USAGE
    }

    if (hwType === HARDWARE_TYPE.MEM.toUpperCase()) {
        return USAGE_TYPE.SUM_MEM_USAGE
    }

    if (hwType === HARDWARE_TYPE.DISK.toUpperCase()) {
        return USAGE_TYPE.SUM_DISK_USAGE
    }

    if (hwType === HARDWARE_TYPE.TCPCONNS.toUpperCase()) {
        return USAGE_TYPE.SUM_TCP_CONNS
    }

    if (hwType === HARDWARE_TYPE.TCPRETRANS.toUpperCase()) {
        return USAGE_TYPE.SUM_TCP_RETRANS
    }

    if (hwType === HARDWARE_TYPE.UDPRECV.toUpperCase()) {
        return USAGE_TYPE.SUM_UDP_RECV
    }

    if (hwType === HARDWARE_TYPE.UDPSENT.toUpperCase()) {
        return USAGE_TYPE.SUM_UDP_SENT
    }

    if (hwType === HARDWARE_TYPE.RECVBYTES.toUpperCase()) {
        return USAGE_TYPE.SUM_RECV_BYTES
    }

    if (hwType === HARDWARE_TYPE.SENDBYTES.toUpperCase()) {
        return USAGE_TYPE.SUM_SEND_BYTES
    }


}

export const makeBubbleChartDataForCluster = (usageList: any, pHardwareType) => {

    console.log('makeBubbleChartDataForCluster===>', usageList)

    let bubbleChartData = []
    usageList.map((item, index) => {
        let usageValue: number = item[hardwareTypeToUsageKey(pHardwareType)]
        usageValue = usageValue.toFixed(2)

        let cluster_cloudlet_fullLabel = item.cluster.toString() + ' [' + item.cloudlet.toString().trim() + "]";

        bubbleChartData.push({
            index: index,
            label: cluster_cloudlet_fullLabel.toString().substring(0, 17) + "...",
            value: usageValue,
            favor: usageValue,
            fullLabel: item.cluster.toString() + ' [' + item.cloudlet.toString().trim().substring(0, 15)+ "]",
            cluster_cloudlet: item.cluster.toString() + ' | ' + item.cloudlet.toString(),
        })
    })

    return bubbleChartData;
}

