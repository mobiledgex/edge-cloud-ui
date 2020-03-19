import React from 'react';
import './PageMonitoring.css';
import {toast} from "react-semantic-toasts";
import {GRID_ITEM_TYPE, HARDWARE_TYPE, THEME_OPTIONS, USAGE_TYPE,} from "../../../shared/Constants";
import Lottie from "react-lottie";
import {makeGradientColor} from "./dev/PageDevMonitoringService";
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeCompleteDateTime} from "./admin/PageAdminMonitoringService";
import moment from "moment";
import {Line as ReactChartJsLine} from "react-chartjs-2";
import {GridLoader} from "react-spinners";
import {Grid} from "semantic-ui-react";
import {barChartOption, columnChartOption} from "./PageMonitoringUtils";

export const PageMonitoringStyles = {
    gridTitle2: {
        flex: .87,
        marginLeft: 0, alignItems: 'flex-start', marginTop: 8, alignSelf: 'center', justifyContent: 'flex-start'
    },
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
        zIndex: 9999,
        //height: '50px',
    },
    dropDown2: {
        //minWidth: 150,
        minWidth: '180px',
        //fontSize: '12px',
        minHeight: '40px',
        zIndex: 1,
        //height: '50px',
    },
    dropDown3: {
        //minWidth: 150,
        minWidth: '350px',
        //fontSize: '12px',
        minHeight: '40px',
        zIndex: 1,
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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%'
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
    },
    center3: {
        display: 'flex',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: 350,
        fontSize: 29,
        fontFamily: 'Karla'
        //backgroundColor:'red'
    },
    noData2: {
        width: '100%', backgroundColor: 'blue', fontSize: 15, display: 'flex'
        , alignItems: 'center', justifyContent: 'center',
    },
    gridTableData: {flex: .15, backgroundColor: '#181A1F', height: 64, marginTop: 0, textAlign: 'center'},
    gridTableData2: {flex: .15, backgroundColor: '#1e2025', height: 64, marginTop: 0, textAlign: 'center'},


    appInstGridTableData: {flex: .083, backgroundColor: '#181A1F', height: 64, marginTop: 0, textAlign: 'center'},
    appInstGridTableData2: {flex: .083, backgroundColor: '#1e2025', height: 64, marginTop: 0, textAlign: 'center'},
}
export const noDataArea = () => (
    <div style={PageMonitoringStyles.center3}>
        There is no data to represent.
    </div>
)

export const isEmpty = (value) => {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }
};


export const renderLoaderArea = (_this) => (
    <Grid.Row className='view_contents'>
        <Grid.Column className='contents_body'>
            {_this.renderHeader()}
            <div style={{position: 'absolute', top: '37%', left: '48%'}}>
                <div style={{marginLeft: -120, display: 'flex', flexDirection: 'row'}}>
                    {renderGridLoader2(150, 150)}
                </div>
            </div>
        </Grid.Column>

    </Grid.Row>
)


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
        <div className='page_monitoring_blank_box'
             style={{height: type === 'network' ? window.innerHeight / 3 - 10 : '100%', zIndex: 999999999999999999999}}>
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

export const renderPlaceHolderCircular2 = (type: string = '') => {
    return (
        <div className='page_monitoring_blank_box'
             style={{height: '100%'}}>
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
        <div className='page_monitoring_blank_box'
             style={{height: type === 'network' ? window.innerHeight / 3 - 10 : '100%', zIndex: 999999999999}}>
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
        <div className='page_monitoring_blank_box'
             style={{zIndex: 999999999999, position: 'absolute', top: '1%', left: '1%'}}>
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

export const renderPlaceHolderLottiePinJump3 = (type: string = '') => {
    return (
        <div className='page_monitoring_blank_box'
             style={{zIndex: 999999999999, position: 'absolute', top: '1%', left: '1%'}}>
            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: require('../../../lotties/10045-loading-gradient-strokes1234'),
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                speed={2.9}
                height={30}
                width={30}
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
        <div className='page_monitoring_blank_box'
             style={{height: type === 'network' ? window.innerHeight / 3 - 10 : '100%'}}>
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
                options={lineGraphOptionsForAppInst(hardwareType)}
            />
        </div>
    );
}


export const lineGraphOptionsForAppInst = (hardwareType) => {

    return (
        {
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
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'white',
                        callback(value, index, label) {
                            if (hardwareType === HARDWARE_TYPE.CPU) {
                                return value.toFixed(2);
                            } else {
                                return convertByteToMegaByte(value, hardwareType)
                            }


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
            }

        }
    )
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


export const renderUsageByType = (usageOne, hardwareType, _this) => {

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

export const arraysEqual = (a, b) => {
    if (a instanceof Array && b instanceof Array) {
        if (a.length != b.length)  // assert same length
            return false;
        for (var i = 0; i < a.length; i++)  // assert each element equal
            if (!arraysEqual(a[i], b[i]))
                return false;
        return true;
    } else {
        return a == b;  // if not both arrays, should be the same
    }
}

export const renderBarChartCore = (chartDataList, hardwareType, _this, graphType, isResizeComplete) => {
    return (
        <div style={{width: '100%'}}>
            <Chart
                key={isResizeComplete}
                //height={hardwareType === HARDWARE_TYPE.RECV_BYTE || hardwareType === HARDWARE_TYPE.SEND_BYTE ? chartHeight - 10 : '100%'}
                height={'100%'}
                chartType={graphType === GRID_ITEM_TYPE.BAR ? 'BarChart' : 'ColumnChart'}
                //chartType={'ColumnChart'}
                loader={<div><CircularProgress style={{color: '#1cecff', zIndex: 999999}}/></div>}
                data={chartDataList}
                options={graphType === GRID_ITEM_TYPE.BAR ? barChartOption(hardwareType) : columnChartOption(hardwareType)}
            />
        </div>
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


    console.log("makeFormForClusterLevelMatric====>", dataOne);

    let dataForm =  {
        "token": token,
        "params": {
            "region": dataOne.Region,
            "clusterinst": {
                "cluster_key": {
                    "name": dataOne.ClusterName
                },
                "cloudlet_key": {
                    "organization": dataOne.Operator,
                    "name": dataOne.Cloudlet
                },
                "organization": dataOne.OrganizationName,
            },
            "last": fetchingDataNo,
            "selector": "*"
        }
    }

    console.log("dataForm====>", dataForm);

    return dataForm;
}

export const makeFormForCloudletLevelMatric = (dataOne, valid = "*", token, fetchingDataNo = 20, pStartTime = '', pEndTime = '') => {

    let formBody= {
        "token": token,
        "params": {
            "region": dataOne.Region,
            "cloudlet": {
                "organization": dataOne.Operator,
                "name": dataOne.CloudletName,
            },
            "last": fetchingDataNo,
            "selector": "*"
        }
    }

    console.log("makeFormForCloudletLevelMatric====>", formBody);

    return formBody;
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
export const showToast3 = (title: string, time = 2) => {
    toast({
        type: 'warning',
        icon: 'star',
        title: title,
        animation: 'swing left',
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


/**
 *
 * @param usageList
 * @param pHardwareType
 * @param themeTitle
 * @returns {[]}
 */
export const makeBubbleChartDataForCluster = (usageList: any, pHardwareType,) => {

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
            fullLabel: item.cluster.toString() + ' [' + item.cloudlet.toString().trim().substring(0, 15) + "]",
            cluster_cloudlet: item.cluster.toString() + ' | ' + item.cloudlet.toString(),
        })
    })

    return bubbleChartData;
}

