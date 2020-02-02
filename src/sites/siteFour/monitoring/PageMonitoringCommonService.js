import React from 'react';
import './PageMonitoring.css';
import {toast} from "react-semantic-toasts";
import {HARDWARE_TYPE, HARDWARE_TYPE_FOR_CLOUDLET, USAGE_TYPE,} from "../../../shared/Constants";
import Lottie from "react-lottie";
import {makeGradientColor, removeDuplication} from "./dev/PageDevMonitoringService";
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import PageMonitoringForDeveloper from "./dev/PageDevMonitoring";
import {makeCompleteDateTime} from "./admin/PageAdminMonitoringService";
import moment from "moment";
import {Line as ReactChartJs} from "react-chartjs-2";

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

export const renderPlaceHolder3 = (type: string = '') => {
    // let boxWidth = window.innerWidth / 3 - 50;
    return (
        <div className='page_monitoring_blank_box' style={{height: type === 'network' ? window.innerHeight / 3 - 10 : '100%'}}>
            <CircularProgress style={{color: '#77BD25', zIndex: 9999999, fontSize: 20}}/>

        </div>
    )
}


export const renderLineChartCore = (paramLevelTypeNameList, usageSetList, newDateTimeList, hardwareType) => {


    const lineChartData = (canvas) => {

        let gradientList = makeGradientColor(canvas, height);

        let finalSeriesDataSets = [];
        for (let i in usageSetList) {
            //@todo: top5 만을 추린다
            if (i < 5) {
                let datasetsOne = {
                    label: paramLevelTypeNameList[i],
                    backgroundColor: gradientList[i],//todo: 리전드box area fill True/false
                    fill: false,//todo: 라인차트 area fill True/false
                    //backgroundColor: '',
                    borderColor: gradientList[i],
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


        console.log('finalSeriesDataSets====>', finalSeriesDataSets);

        return {
            labels: newDateTimeList,
            datasets: finalSeriesDataSets,
        }
    }

    let height = 500 + 100;
    let options = {
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'y'
                },
                zoom: {
                    enabled: true,
                    mode: 'xy'
                }
            }
        },
        maintainAspectRatio: false,//@todo
        responsive: true,
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
                        return numberWithCommas(value);

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


    let chartWidth = ((window.innerWidth - 300) * 2 / 3 - 50) / 2
    let chartHeight = window.innerWidth > 1700 ? ((window.innerHeight - 320) / 2 - 80) - 10 : ((window.innerHeight - 370) / 2 - 80) - 10 //(height 사이즈)-(여유공백)
    // let chartNetHeight = window.innerWidth > 1782 ? (window.innerHeight-320)/2-50 : (window.innerHeight-370)/2-50
    //todo :#######################
    //todo : chart rendering part
    //todo :#######################
    return (
        <div style={{
            position: 'relative',
            width: '99%',
            height: '96%'
        }}>
            <ReactChartJs
                //width={'100%'}
                //height={hardwareType === "recv_bytes" || hardwareType === "send_bytes" ? chartHeight + 20 : chartHeight}
                //height={'100%'}
                data={lineChartData}
                options={options}

            />
        </div>
    );
}


export const renderLineChartCore00002 = (paramLevelTypeNameList, usageSetList, newDateTimeList, hardwareType) => {

    console.log('usageSetList===>', usageSetList);

    let hwType = 'CPU';

    let nameList = [
        "autoclusterbicapp\n[hamburg-stage]",
        "autoclusterbicapp\n[Rah123]",
        "autoclusterbicapp\n[frankfurt-eu]",
        "Rah-Clust-8\n[frankfurt-eu]"
    ]

    let datetimeList2 = [
        "08:53:00",
        "08:52:52",
        "08:52:44",
        "08:52:36",
        "08:52:28",
        "08:52:20",
        "08:52:12",
        "08:52:04",
        "08:51:56",
        "08:51:48"
    ]

    let usageSetList2 = [
        [
            0,
            0,
            0,
            0,
            29.999999994179234,
            0,
            25.423728815210573,
            0,
            1.639344262353743,
            0
        ],
        [
            0,
            39.99999999997726,
            0,
            0,
            0,
            0,
            3.278688524584054,
            0,
            0,
            0
        ],
        [
            8.47457626148795,
            0,
            0,
            0,
            0,
            0,
            0,
            29.508196703947725,
            0,
            0
        ],
        [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ]
    ]

    let chartDataList = []

    let titleArray = [];

    titleArray.push("time")

    titleArray.concat(nameList)
    datetimeList2.map((item, index) => {


    })

    const data = [
        ["Year", "Sales", "Expenses"],
        ["2004", 1000, 400],
        ["2005", 1170, 460],
        ["2006", 660, 1120],
        ["2007", 1030, 540],
        ["2008", 1035, 545],
        ["2009", 1037, 518],
        ["2010", 1040, 550],
        ["2011", 1050, 570],
    ];
    const options = {
        //title: "Company Performance",
        curveType: "function",
        backgroundColor: {
            fill: '#1e2124'
        },
        chartArea: {left: 60, top: 40, width: '90%', height: '75%'},
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
        animation: {
            startup: true,
            duration: 850,
            /*'linear' - Constant speed.
            'in' - Ease in - Start slow and speed up.
            'out' - Ease out - Start fast and slow down.
            'inAndOut' - Ease in and out - Start slow, speed up, then slow down.*/
            easing: 'inAndOut',
        },
        explorer: {
            actions: ['dragToPan', 'rightClickToReset'],
        },
        tooltip: {textStyle: {color: '#FF0000'}, showColorCode: true},
        legend: {position: 'top', textStyle: {color: 'white', fontSize: 16}},
        vAxis: {//y축
            gridlines: {color: '#333', minSpacing: 20},
            textStyle: {
                color: 'green',
                fontSize: 15,
                bold: true,
            },
            viewWindowMode: 'maximized'
        },
        titlePosition: 'none',
        hAxis: {//x축
            //gridlines: {color: '#333', minSpacing: 20},
            textStyle: {
                color: 'white',
                fontSize: 12,
                bold: true,
            }
        }
    };

    return (
        <div className="App">
            <Chart
                chartType="LineChart"
                width={700}
                height={'100%'}
                data={data}
                options={options}
            />
        </div>
    )
}

export const renderUsageByType = (usageOne, hardwareType, role = '',) => {

    if (hardwareType === HARDWARE_TYPE.VCPU) {
        return usageOne.avgVCpuUsed;
    }

    if (hardwareType === HARDWARE_TYPE.MEM_USED) {
        return usageOne.avgMemUsed;
    }

    if (hardwareType === HARDWARE_TYPE.DISK_USED) {
        return usageOne.avgDiskUsed;
    }

    if (hardwareType === HARDWARE_TYPE.FLOATING_IPS_USED) {
        return usageOne.avgFloatingIpsUsed;
    }

    if (hardwareType === HARDWARE_TYPE.TCPCONNS) {
        return usageOne.sumTcpConns;
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

    if (hardwareType === HARDWARE_TYPE.CPU) {
        return usageOne.sumCpuUsage
    }
    if (hardwareType === HARDWARE_TYPE.MEM) {
        return usageOne.sumMemUsage
    }
    if (hardwareType === HARDWARE_TYPE.DISK) {
        return usageOne.sumDiskUsage
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

export const getOneYearStartEndDatetime = () => {

    let arrDateTime = []
    let startTime = makeCompleteDateTime(moment().subtract(364, 'd').format('YYYY-MM-DD HH:mm'));
    let endTime = makeCompleteDateTime(moment().subtract(0, 'd').format('YYYY-MM-DD HH:mm'));

    arrDateTime.push(startTime)
    arrDateTime.push(endTime)

    return arrDateTime;
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

    if (hardwareType === HARDWARE_TYPE.CPU) {
        return numberWithCommas(usageOne.sumCpuUsage) + " Byte"
    }

    if (hardwareType === HARDWARE_TYPE.MEM) {
        return numberWithCommas(usageOne.sumMemUsage) + " Byte"
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

export const hardwareTypeToUsageKey = (hwType: string) => {
    if (hwType === HARDWARE_TYPE.CPU.toUpperCase()) {
        return USAGE_TYPE.SUM_CPU_USAGE
    }

    if (hwType === HARDWARE_TYPE.MEM.toUpperCase()) {
        return "sumMemUsage"
    }

    if (hwType === HARDWARE_TYPE.DISK.toUpperCase()) {
        return "sumDiskUsage"
    }

    if (hwType === HARDWARE_TYPE.TCPCONNS.toUpperCase()) {
        return "sumTcpConns"
    }

}
export const NumberToFixed = (value: number, fixedLength: number) => {
    try {
        Number(value).toFixed(fixedLength)
    } catch (e) {
        return 0;
    }
}

export const makeBubbleChartDataForCluster = (usageList: any, paramHWType) => {

    console.log('makeBubbleChartDataForCluster===>', usageList)

    let bubbleChartData = []
    usageList.map((item, index) => {

        let usageValue: number = item[hardwareTypeToUsageKey(paramHWType)]
        usageValue = usageValue.toFixed(2)

        bubbleChartData.push({
            index: index,
            label: item.cluster.toString().substring(0, 10) + "...",
            value: usageValue,
            favor: usageValue,
            fullLabel: item.cluster.toString(),
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
                value: (item.sumCpuUsage * 1).toFixed(0),
                favor: (item.sumCpuUsage * 1).toFixed(0),
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.MEM.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cluster.toString().substring(0, 10) + "...",
                value: item.sumMemUsage.toFixed(0),
                favor: item.sumMemUsage.toFixed(0),
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.DISK.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cluster.toString().substring(0, 10) + "...",
                value: item.sumDiskUsage.toFixed(0),
                favor: item.sumDiskUsage.toFixed(0),
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.RECVBYTES.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cluster.toString().substring(0, 10) + "...",
                value: item.sumRecvBytes,
                favor: item.sumRecvBytes,
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.SENDBYTES.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cluster.toString().substring(0, 10) + "...",
                value: item.sumNetSend,
                favor: item.sumNetSend,
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.TCPCONNS.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cluster.toString().substring(0, 10) + "...",
                value: item.sumTcpConns.toFixed(0),
                favor: item.sumTcpConns.toFixed(0),
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.UDPSENT.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cluster.toString().substring(0, 10) + "...",
                value: item.sumUdpSent,
                favor: item.sumUdpSent,
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.SENDBYTES.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cluster.toString().substring(0, 10) + "...",
                value: item.sumSendBytes,
                favor: item.sumSendBytes,
                fullLabel: item.cluster,
            })
        })
    } else if (hwType === HARDWARE_TYPE.RECVBYTES.toUpperCase()) {
        allUsageList.map((item, index) => {
            bubbleChartData.push({
                index: index,
                label: item.cluster.toString().substring(0, 10) + "...",
                value: item.sumRecvBytes,
                favor: item.sumRecvBytes,
                fullLabel: item.cluster,
            })
        })
    }


    await _this.setState({
        bubbleChartData: bubbleChartData,
    });
}







