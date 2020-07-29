import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import '../common/PageMonitoringStyles.css';
import Lottie from "react-lottie";
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Line as ReactChartJsLine} from "react-chartjs-2";
import {GridLoader, PulseLoader} from "react-spinners";
import notification from "antd/es/notification";
import {makeCompleteDateTime, makeGradientColor} from "./PageMonitoringService";
import {HARDWARE_TYPE, USAGE_TYPE} from "../../../../shared/Constants";
import {PageMonitoringStyles} from "../common/PageMonitoringStyles";
import {barChartOption, columnChartOption, numberWithCommas} from "../common/PageMonitoringUtils";
import {GRID_ITEM_TYPE} from "../view/PageMonitoringLayoutProps";
import * as dateUtil from "../../../../utils/date_util";
import type {TypeAppInstLowerCase} from "../../../../shared/Types";

const FontAwesomeIcon = require('react-fontawesome')

export const noDataArea = () => (
    <div style={PageMonitoringStyles.center3}>
        There is no data to represent.
    </div>
)

export const isEmpty = (value) => {
    if (value === "undefined" || value === "" || value === null || value === undefined || (typeof value === "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }
};

export const groupByKey_ = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        );
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
    }, {}); // empty object is the initial value for result object
};


export const renderLoaderArea = (_this) => (
    <div style={{width: '100%', height: '100%',}}>
        <div style={{width: '100%', height: '100%'}}>
            {_this.renderHeader()}
        </div>
        <div style={{position: 'absolute', top: '40%', left: '40%', zIndex: 999999999999999}}>
            <GridLoader
                sizeUnit={"px"}
                size={22}
                color={'#70b2bc'}
                loading={true}
            />
        </div>
    </div>
)


export const renderGridLoader2 = (width, height) => {
    return (
        <GridLoader
            sizeUnit={"px"}
            size={18}
            color={'#70b2bc'}
            loading={true}
        />

    )
}

export const renderCircleLoaderForMap = (width, height) => {
    return (
        <div style={{marginLeft: 20, marginBottom: 0, height: 20,}}>
            <PulseLoader
                sizeUnit={"px"}
                size={20}
                color={'#70b2bc'}
                loading={true}
                style={{zIndex: 1, marginLeft: -30}}
            />
        </div>
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

export const renderEmptyMessageBox = (message: string) => {
    return (
        <div className='page_monitoring_blank_box'
             style={{height: '100%'}}>
            <div style={{
                alignSelf: "center",
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 12, 15, 0.2)',
                borderRadius: 8,
                padding: 8,
                paddingLeft: 15,
                paddingRight: 15,
            }}>
                <div style={{fontSize: 17, color: '#57aa27'}}>{message}</div>
            </div>
        </div>
    )
}


/**
 *
 * @param marginBottom
 * @returns {*}
 */
export const renderSmallProgressLoader = (marginBottom: 0) => {
    return (
        <CircularProgress size={12} thickness={3} style={{marginBottom: marginBottom, color: '#1cecff'}}/>
    )
}

export const renderBarLoader = (isBold = true) => {
    return (
        <div className='page_monitoring_blank_box'
             style={{
                 zIndex: 999,
                 position: 'absolute',
                 width: isBold ? '99.1%' : '100%',
                 //backgroundColor: 'red'
             }}>
            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: isBold ? require('../../../../lotties/blue_bar2') : require('../../../../lotties/blue_bar2_thin'),
                }}
                speed={0.5}
                height={10}
                width={isBold ? '99.1%' : '100%'}
                isStopped={false}
                isPaused={false}
                style={{
                    position: 'absolute',
                    top: -8,
                }}
            />
        </div>
    )
}

export const renderXLoader = () => {
    return (
        <div className='page_monitoring_blank_box'
             style={{
                 zIndex: 999,
                 width: '100%',
                 position: 'absolute',
                 height: '100%',
                 backgroundColor: 'black'
             }}>
            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: require('../../../../lotties/x-marks'),
                }}
                speed={2}
                height={50}
                width={50}
                isStopped={false}
                isPaused={false}
                style={{
                    position: 'absolute',
                    top: '45%',
                }}
            />
        </div>
    )
}


export const renderPlaceHolderHorizontalLoader = (type = 'lottieCircle') => {

    try {
        if (type === 'sk') {
            return (
                <div style={{marginTop: 0,}}>
                    <SkeletonTheme color="#22252C" highlightColor="#444">
                        <Skeleton count={4} height={38}/>
                    </SkeletonTheme>
                </div>
            )
        } else if (type === 'lottieCircle') {
            return (
                <div className='page_monitoring_blank_box'
                     style={{
                         zIndex: 999,
                         position: 'absolute',
                         width: '100%',
                         //backgroundColor: 'red'
                     }}>
                    <Lottie
                        options={{
                            loop: true,
                            autoplay: true,
                            animationData: require('../../../../lotties/horizontal-loading-bold'),
                        }}
                        speed={1}
                        height={20}
                        width={'100%'}
                        isStopped={false}
                        isPaused={false}
                        style={{
                            position: 'absolute',
                            top: -9,
                        }}
                    />
                </div>
            )
        } else {
            return (
                <div className='page_monitoring_blank_box'
                     style={{height: type === 'network' ? window.innerHeight / 3 - 10 : '100%',}}>
                    <CircularProgress style={{color: '#70b2bc', zIndex: 1, fontSize: 100}}
                    />
                </div>
            )
        }
    } catch (e) {
    }

}

export const renderCircularProgress = (type: string = '') => {
    return (
        <div className='page_monitoring_blank_box'
             style={{height: type === 'network' ? window.innerHeight / 3 - 10 : '90%',}}>
            <CircularProgress style={{color: '#70b2bc', zIndex: 1, fontSize: 100}}
            />
        </div>
    )
}


export const renderWifiLoader = (width = 25, height = 25, margin = 3) => {
    return (
        <div
            style={{marginBottom: margin,}}>
            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: require('../../../../lotties/wifi-signal'),
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                speed={2.5}
                width={width}
                height={height}
                isStopped={false}
                isPaused={false}
            />
        </div>
    )
}

export const removeDuplicates = (paramArrayList, key) => {
    let newArray = [];
    let uniqueObject = {};
    for (let i in paramArrayList) {

        let objTitle = paramArrayList[i][key];
        uniqueObject[objTitle] = paramArrayList[i];
    }
    for (let i in uniqueObject) {
        newArray.push(uniqueObject[i]);
    }
    return newArray;
}


export const renderPlaceHolderHorizontalBar = (isBar = true, paramWidth, isBold = false) => {
    if (isBar) {
        return (
            <div className='page_monitoring_blank_box'
                 style={{
                     zIndex: 999,
                     position: 'absolute',
                     //top: '1%',
                     width: paramWidth,
                     //backgroundColor: 'red'
                 }}>
                <Lottie
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: isBold ? require('../../../../lotties/horizontal-loading-bold') : require('../../../../lotties/horizontal-loading'),
                    }}
                    speed={1}
                    height={30}
                    isStopped={false}
                    isPaused={false}
                    style={{
                        position: 'absolute',
                        top: -15,
                        //marginLeft: '-10%',
                        justifyContent: 'center',
                        alignItem: 'center',
                        alignSelf: 'center'
                    }}
                />
            </div>
        )
    }
}


export const renderXMarkForMap = (isXMark = true) => {
    if (isXMark) {
        return (
            <div className='page_monitoring_blank_box'
                 style={{zIndex: 999999999999, position: 'absolute', top: '1%', left: '1%'}}>
                <Lottie
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: require('../../../../lotties/x-marks'),
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice'
                        }
                    }}
                    speed={3}
                    height={50}
                    width={50}
                    isStopped={false}
                    isPaused={false}
                    //style={{position: 'absolute', top: 20,}}
                />
            </div>
        )
    } else {
        return (
            <div className='page_monitoring_blank_box'
                 style={{zIndex: 999999999999, position: 'absolute', top: '1%', left: '1%'}}>
                <Lottie
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: require('../../../../lotties/6698-location-pin22222'),
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice'
                        }
                    }}
                    speed={2.9}
                    height={220}
                    width={220}
                    isStopped={false}
                    isPaused={false}
                />
            </div>
        )
    }


}

export const renderPlaceHolderLottiePinJump = (type: string = '') => {
    return (
        <div className='page_monitoring_blank_box'
             style={{zIndex: 999999999999, position: 'absolute', top: '1%', left: '1%'}}>
            <Lottie
                options={{
                    loop: true,
                    autoplay: true,
                    animationData: require('../../../../lotties/pinjump'),
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                }}
                speed={20}
                height={100}
                width={100}
                isStopped={false}
                isPaused={false}
            />
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

export const convertByteToMegaGigaByte = (bytes) => {
    let marker = 1024; // Change to 1000 if required
    let decimal = 0; // Change as required
    let kiloBytes = marker; // One Kilobyte is 1024 bytes
    let megaBytes = marker * marker; // One MB is 1024 KB
    let gigaBytes = marker * marker * marker; // One GB is 1024 MB
    let teraBytes = marker * marker * marker * marker; // One TB is 1024 GB
    // return bytes if less than a KB
    if (bytes < kiloBytes) return bytes + " Bytes";
    // return KB if less than a MB
    else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
    // return MB if less than a GB
    else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
    // return GB if less than a TB
    else return (bytes / gigaBytes).toFixed(decimal) + " GB";
}

export const convertToMegaGigaForNumber = (bytes) => {
    let marker = 1024; // Change to 1000 if required
    let decimal = 0; // Change as required
    let kilo = marker; // One Kilobyte is 1024 bytes
    let mega = marker * marker; // One MB is 1024 KB
    let giga = marker * marker * marker; // One GB is 1024 MB
    let tera = marker * marker * marker * marker; // One TB is 1024 GB
    if (bytes < kilo) return bytes;
    else if (bytes < mega) return (bytes / kilo).toFixed(decimal) + " K";
    else if (bytes < giga) return (bytes / mega).toFixed(decimal) + " M";
    else return (bytes / giga).toFixed(decimal) + " G";
}


export const convertMegaToGiGa = (value, isShowUnit = true) => {
    try {
        if (value > 1000) {
            return isShowUnit ? (value / 1000).toFixed(0) + ' GB' : (value / 1000).toFixed(0)
        } else {
            return value + ' MB';
        }
    } catch (e) {

    }
}


export const renderLineChartCore = (paramLevelTypeNameList, usageSetList, newDateTimeList, hardwareType, isGradientColor = false) => {

    const lineChartData = (canvas) => {
        let gradientList = makeGradientColor(canvas, height);
        let finishedSeriesDataSets = [];
        for (let i in usageSetList) {
            //@todo: top5 만을 추린다
            if (i < 5) {
                let datasetsOne = {
                    label: paramLevelTypeNameList[i],
                    backgroundColor: gradientList[i],//todo: 리전드box area fill True/false
                    //fill: isGradientColor,//todo: 라인차트 area fill True/false
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

export const renderUsageByType = (usageOne, hardwareType, _this) => {

    if (hardwareType === HARDWARE_TYPE.CPU) {
        return usageOne.sumCpuUsage
    } else if (hardwareType === HARDWARE_TYPE.MEM) {
        return usageOne.sumMemUsage
    } else if (hardwareType === HARDWARE_TYPE.DISK) {
        return usageOne.sumDiskUsage
    } else if (hardwareType === HARDWARE_TYPE.TCPCONNS) {
        return usageOne.sumTcpConns;
    } else if (hardwareType === HARDWARE_TYPE.TCPRETRANS) {
        return usageOne.sumTcpRetrans;
    } else if (hardwareType === HARDWARE_TYPE.UDPRECV) {
        return usageOne.sumUdpRecv;
    } else if (hardwareType === HARDWARE_TYPE.UDPSENT) {
        return usageOne.sumUdpSent;
    } else if (hardwareType === HARDWARE_TYPE.NET_SEND) {
        return usageOne.avgNetSend;
    } else if (hardwareType === HARDWARE_TYPE.NET_RECV) {
        return usageOne.avgNetRecv;
    } else if (hardwareType === HARDWARE_TYPE.BYTESRECVD) {
        return usageOne.sumRecvBytes
    } else if (hardwareType === HARDWARE_TYPE.BYTESSENT) {
        return usageOne.sumSendBytes
    } else if (hardwareType === HARDWARE_TYPE.ACTIVE_CONNECTION) {
        return usageOne.sumActiveConnection
    } else if (hardwareType === HARDWARE_TYPE.HANDLED_CONNECTION) {
        return usageOne.sumHandledConnection
    } else if (hardwareType === HARDWARE_TYPE.ACCEPTS_CONNECTION) {
        return usageOne.sumAcceptsConnection
    }

    ////Cloudlet
    else if (hardwareType === HARDWARE_TYPE.VCPU_USED) {
        return usageOne.usedVCpuCount
    } else if (hardwareType === HARDWARE_TYPE.MEM_USED) {
        return usageOne.usedMemUsage //+ 'MB'
    } else if (hardwareType === HARDWARE_TYPE.DISK_USED) {
        return usageOne.usedDiskUsage //+ "GB"
    } else if (hardwareType === HARDWARE_TYPE.FLOATING_IP_USED) {
        return usageOne.usedFloatingIpsUsage
    } else if (hardwareType === HARDWARE_TYPE.IPV4_USED) {
        return usageOne.usedIpv4Usage
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
                loader={<div><CircularProgress style={{color: '#1cecff',}}/></div>}
                data={chartDataList}
                options={graphType === GRID_ITEM_TYPE.BAR ? barChartOption(hardwareType) : columnChartOption(hardwareType)}
            />
        </div>
    );
}


export const makeFormForClusterLevelMatric = (dataOne, valid = "*", token, fetchingDataNo = 20, pStartTime = '', pEndTime = '') => {

    let dataForm = {
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

    console.log('makeFormForClusterLevelMatric===>', dataForm);

    return dataForm;
}

export const makeFormForCloudletLevelMatric = (dataOne, valid = "*", token, dateLimitCount = 20, pStartTime = '', pEndTime = '') => {
    let formBody = {};
    if (pStartTime === '' && pEndTime === '') {

        formBody = {
            "token": token,
            "params": {
                "region": dataOne.Region,
                "cloudlet": {
                    "organization": dataOne.Operator,
                    "name": dataOne.CloudletName,
                },
                "last": dateLimitCount,
                "selector": "*"
            }
        }
    } else {
        formBody = {
            "token": token,
            "params": {
                "region": dataOne.Region,
                "cloudlet": {
                    "organization": dataOne.Operator,
                    "name": dataOne.CloudletName,
                },
                "last": dateLimitCount,
                "selector": "*",
                "starttime": pStartTime,
                "endtime": pEndTime,
            }
        }
    }
    return formBody;
}

export function  convertFullAppInstJsonToStr(fullAppInstJson: TypeAppInstLowerCase) {
    let fullAppInstStr = fullAppInstJson.appName + " | " + fullAppInstJson.cloudletName + " | " + fullAppInstJson.clusterName
        + " | " + fullAppInstJson.version + " | " + fullAppInstJson.region + " | " + fullAppInstJson.healthCheck
        + " | " + fullAppInstJson.operatorName + " | " + JSON.stringify(fullAppInstJson.cloudletLocation)
    return fullAppInstStr
}


export const getOneYearStartEndDatetime = () => {

    let arrDateTime = []
    let startTime = makeCompleteDateTime(dateUtil.utcTime(dateUtil.FORMAT_DATE_24_HH_mm, dateUtil.subtractDays(364)));
    let endTime = makeCompleteDateTime(dateUtil.utcTime(dateUtil.FORMAT_DATE_24_HH_mm, dateUtil.subtractDays(0)));
    arrDateTime.push(startTime)
    arrDateTime.push(endTime)

    return arrDateTime;
}


/**
 *
 * @param title
 * @param time
 * @param isSuccessToast
 */
export const showToast = (title: string, time = 3, isSuccessToast = true) => {
    if (isSuccessToast) {
        notification.success({
            placement: 'bottomLeft',
            duration: time,
            message: title,
        });
    } else {
        notification.warning({
            placement: 'bottomLeft',
            duration: time,
            message: title,
        });
    }
}

export const hardwareTypeToUsageKey = (hwType: string) => {
    if (hwType === HARDWARE_TYPE.CPU.toUpperCase()) {
        return USAGE_TYPE.SUM_CPU_USAGE
    } else if (hwType === HARDWARE_TYPE.MEM.toUpperCase()) {
        return USAGE_TYPE.SUM_MEM_USAGE
    } else if (hwType === HARDWARE_TYPE.DISK.toUpperCase()) {
        return USAGE_TYPE.SUM_DISK_USAGE
    } else if (hwType === HARDWARE_TYPE.TCPCONNS.toUpperCase()) {
        return USAGE_TYPE.SUM_TCP_CONNS
    } else if (hwType === HARDWARE_TYPE.TCPRETRANS.toUpperCase()) {
        return USAGE_TYPE.SUM_TCP_RETRANS
    } else if (hwType === HARDWARE_TYPE.UDPRECV.toUpperCase()) {
        return USAGE_TYPE.SUM_UDP_RECV
    } else if (hwType === HARDWARE_TYPE.UDPSENT.toUpperCase()) {
        return USAGE_TYPE.SUM_UDP_SENT
    } else if (hwType === HARDWARE_TYPE.BYTESRECVD.toUpperCase()) {
        return USAGE_TYPE.SUM_RECV_BYTES
    } else if (hwType === HARDWARE_TYPE.BYTESSENT.toUpperCase()) {
        return USAGE_TYPE.SUM_SEND_BYTES
    }


}


/**
 *
 * @param usageList
 * @param pHardwareType
 * @param chartColorList
 * @param classification
 * @returns {[]}
 */
export const makeClusterBubbleChartData = (usageList, pHardwareType, chartColorList, classification = '') => {

    try {
        let bubbleChartData = []
        usageList.map((item, index) => {
            let usageValue: number = item[hardwareTypeToUsageKey(pHardwareType)]
            usageValue = usageValue.toFixed(2)

            let clusterCloudletFullLabel = item.cluster.toString() + ' [' + item.cloudlet.toString().trim() + "]";

            bubbleChartData.push({
                type: pHardwareType,
                index: index,
                label: clusterCloudletFullLabel.toString().substring(0, 17) + "...",
                value: usageValue,
                favor: usageValue,
                fullLabel: item.cluster.toString() + ' [' + item.cloudlet.toString().trim().substring(0, 15) + "]",
                cluster_cloudlet: item.cluster.toString() + ' | ' + item.cloudlet.toString(),
                color: usageList.length === 1 ? chartColorList[item.colorCodeIndex] : chartColorList[item.colorCodeIndex],
            })
        })

        return bubbleChartData;
    } catch (e) {
        //throw new Error(e)
    }
}

