import React from 'react';
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import {formatData} from "../../../services/formatter/formatComputeInstance";
import './PageMonitoring.css';
import {makeFormForAppInstance, numberWithCommas, requestAppLevelMetrics} from "../../../services/SharedService";
import {CHART_COLOR_LIST, HARDWARE_TYPE, RECENT_DATA_LIMIT_COUNT, REGION} from "../../../shared/Constants";
import {HorizontalBar, Line as ReactChartJs} from 'react-chartjs-2';
import FlexBox from "flexbox-react";
import Lottie from "react-lottie";
import BubbleChart from "../../../components/BubbleChart";
import {TypeAppInstance} from "../../../shared/Types";
import {Bar as RBar, BarChart, BarLabel, BarSeries, LinearXAxis, LinearYAxis, LinearYAxisTickSeries} from "reaviz";

/**
 * todo: 클라우드렛위에 올라와 있는 인스턴스 리스트를 flitering by pCloudlet.
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
 * @fixme : 리펙토링 필요 (below method와 함꼐 merge)
 * @todo: 그래프 데이터를 필터링 BY Cloudlet
 * @param cpuOrMemUsageList
 * @param pCloudLet
 * @returns {*}
 */
export const filterUsageByCloudLet = (cpuOrMemUsageList, pCloudLet) => {
    let filteredCpuOrMemUsageList = cpuOrMemUsageList.filter((item) => {
        if (item.instance.Cloudlet === pCloudLet) {
            return item;
        }
    });
    return filteredCpuOrMemUsageList
}

export const filterCpuOrMemUsageByCloudLetByType = (cpuOrMemUsageList, pCloudLet, pType) => {
    let filteredUsageList = cpuOrMemUsageList.filter((item) => {
        if (item.instance[pType] === pCloudLet) {
            return item;
        }
    });
    return filteredUsageList
}

/**
 * @fixme : 리펙토링 필요
 * @todo: 그래프 데이터를 clusterinst에 맞게 필터링
 * @param cpuOrMemUsageList
 * @param pCluster
 * @returns {*}
 */
export const filterUsageByCluster = (cpuOrMemUsageList, pCluster) => {
    let filteredCpuOrMemUsageList = cpuOrMemUsageList.filter((item) => {
        if (item.instance.ClusterInst === pCluster) {
            return item;
        }
    });
    return filteredCpuOrMemUsageList
}

export const filterUsageByAppInst = (cpuOrMemUsageList, pAppInst) => {
    let filteredList = cpuOrMemUsageList.filter((item) => {
        if (item.instance.AppName === pAppInst) {
            return item;
        }
    });
    return filteredList
}


/**
 * todo: Fliter app instace list by cloudlet Value
 * fixme: (하단 메소드와 함께 공용으로 쓰도록 리펙토링 필요)
 * * fixme: (하단 메소드와 함께 공용으로 쓰도록 리펙토링 필요)
 * * fixme: (하단 메소드와 함께 공용으로 쓰도록 리펙토링 필요)
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

export const filterAppInstanceListByAppInst = (appInstanceList, pAppInst = '') => {
    let filteredList = []
    appInstanceList.map(item => {
        if (item.AppName === pAppInst) {
            filteredList.push(item);
        }
    })
    return filteredList;
}


/**
 * @todo: arrayList에서 중복값을 제거.
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
 * @todo : 클러스터렛 리스트를 셀렉트 박스 형태로 가공
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
 * @todo: Bar Graph Rendering By Google Chart
 * @todo: 바그래프 랜더링 By Google Chart
 * @param usageList
 * @param hardwareType
 * @returns {*}
 */
export const renderBarGraph = (usageList, hardwareType = HARDWARE_TYPE.CPU, _this) => {

    function renderUsageByType(usageOne, hardwareType) {
        if (hardwareType === HARDWARE_TYPE.CPU) {
            return usageOne.sumCpuUsage
        }
        if (hardwareType === HARDWARE_TYPE.MEM) {
            return usageOne.sumMemUsage
        }
        if (hardwareType === HARDWARE_TYPE.DISK) {
            return usageOne.sumDiskUsage
        }
        if (hardwareType === HARDWARE_TYPE.NETWORK) {
            //usageOne.sumSendBytes
            return usageOne.sumRecvBytes
        }
    }

    function renderUsageLabelByType(usageOne, hardwareType) {
        if (hardwareType === HARDWARE_TYPE.CPU) {
            return usageOne.sumCpuUsage.toFixed(2) + " %"
        }

        if (hardwareType === HARDWARE_TYPE.MEM) {
            return numberWithCommas(usageOne.sumMemUsage) + " Byte"
        }

        if (hardwareType === HARDWARE_TYPE.DISK) {
            return numberWithCommas(usageOne.sumDiskUsage) + " Byte"
        }

        if (hardwareType === HARDWARE_TYPE.NETWORK) {
            return numberWithCommas(usageOne.sumRecvBytes) + " Byte"
        }
    }

    let chartDataList = [];
    chartDataList.push(["Element", hardwareType.toUpperCase() + " USAGE", {role: "style"}, {role: 'annotation'}])
    for (let index = 0; index < usageList.length; index++) {
        if (index < 5) {
            let barDataOne = [usageList[index].instance.AppName.toString().substring(0, 10) + "...",
                renderUsageByType(usageList[index], hardwareType),
                CHART_COLOR_LIST[index],
                renderUsageLabelByType(usageList[index], hardwareType)]
            chartDataList.push(barDataOne);
        }
    }

    return (
        <Chart
            width={window.innerWidth * 0.25}
            height={330}
            chartType="BarChart"
            loader={<div><CircularProgress style={{color: 'red', zIndex: 999999}}/></div>}
            data={chartDataList}
            options={{
                annotations: {
                    style: 'line',
                    textStyle: {
                        fontName: 'Righteous',
                        fontSize: 20,
                        bold: true,
                        italic: true,
                        // The color of the text.
                        color: '#fff',
                        // The color of the text outline.
                        auraColor: 'black',
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
                    fontSize: 20,
                    italic: true,
                    bold: true,
                    /*fontName: <string>, // i.e. 'Times New Roman'
                    fontSize: <number>, // 12, 18 whatever you want (don't specify px)
                     bold: <boolean>,    // true or false
                      // true of false*/
                },
                //titlePosition: 'out',
                chartArea: {left: 100, right: 150, top: 50, bottom: 25, width: "50%", height: "100%",},
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
                        color: "none"
                    },
                    format: hardwareType === HARDWARE_TYPE.CPU ? '#\'%\'' : '0.##\' byte\'',
                    baselineColor: 'grey',
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
                        fontSize: 15,
                    },

                },
                //colors: ['#FB7A21'],
                fontColor: 'white',
                backgroundColor: {
                    fill: 'black'
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

export const renderBar3333 = (usageList, hardwareType = HARDWARE_TYPE.CPU, _this) => {

    /* var speedData = {
         labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
         datasets: [{
             label: "Car Speed",
             data: [5, 59, 75, 20, 20, 55, 40],
             backgroundColor: 'red',
         }]
     };*/

    let LabelList = [];
    let DataList = [];
    for (let index = 0; index < usageList.length; index++) {

        if (index < 5) {
            let labelOne = usageList[index].instance.AppName.toString().substring(0, 10) + "...";
            let dataOne = hardwareType === 'cpu' ? usageList[index].sumCpuUsage : usageList[index].sumMemUsage
            LabelList.push(labelOne)
            DataList.push(dataOne)
        }

    }


    const data = (canvas) => {
        const ctx = canvas.getContext("2d");

        let height = 500;
        let gradientList = []
        const gradient = ctx.createLinearGradient(0, 0, 0, height);

        //rgba(255, 0, 10, 0.25)
        // rgba(255,94,29,0.25)
        // rgba(227,220,57,0.25)
        // rgba(18,135,2,0.25)
        // rgba(28,34,255,0.25)
        gradient.addColorStop(0, 'rgba(112,0,28,1.0)');
        gradient.addColorStop(1, 'rgba(112,0,28, 0)');

        const gradient2 = ctx.createLinearGradient(0, 0, 0, height);
        gradient2.addColorStop(0, 'rgba(255,72,0,1)');
        gradient2.addColorStop(1, 'rgba(255,72,0,0)');

        const gradient3 = ctx.createLinearGradient(0, 0, 0, height);
        gradient3.addColorStop(0, 'rgb(237,255,42)');
        gradient3.addColorStop(1, 'rgba(255,5,0,0)');

        const gradient4 = ctx.createLinearGradient(0, 0, 0, height);
        gradient4.addColorStop(0, 'rgba(18,135,2,1)');
        gradient4.addColorStop(1, 'rgba(18,135,2,0)');

        const gradient5 = ctx.createLinearGradient(0, 0, 0, height);
        gradient5.addColorStop(0, 'rgba(28,34,255,1)');
        gradient5.addColorStop(1, 'rgba(28,34,255,0)');

        gradientList.push(gradient)
        gradientList.push(gradient2)
        gradientList.push(gradient3)
        gradientList.push(gradient4)
        gradientList.push(gradient5)

        var speedData = {
            labels: LabelList,
            datasets: [{
                barPercentage: 0.5,
                barThickness: 48,
                maxBarThickness: 48,
                minBarLength: 17,
                label: "Usage",
                data: DataList,
                backgroundColor: gradientList,
            }]
        };


        return speedData;
    }


    var chartOptions = {
        legend: {
            display: false,
            position: 'right',
            labels: {
                boxWidth: 80,
                fontColor: 'white'
            }
        },
        title: {
            display: true,
            position: 'top',
        },
        scales: {
            yAxes: [{
                /*scaleLabel: {
                    display: true,
                    labelString: 'Y text'
                },*/
                ticks: {
                    beginAtZero: true,
                    fontColor: 'white'
                },
                gridLines: {
                    color: "#505050",
                },
            }],
            xAxes: [{
                /* scaleLabel: {
                     display: true,
                     labelString: 'Usage'
                 },*/
                ticks: {
                    beginAtZero: true,
                    fontColor: 'white'
                },
                gridLines: {
                    color: "#505050",
                },
            }],
        }
    };
    return (
        <div>
            <HorizontalBar
                displayTitle={true}
                DisplayLegend={true}
                type='verticalBar'
                width={550}
                height={325}
                data={data}
                options={chartOptions}
            />
        </div>
    )

}


export const renderBarGraph002 = (usageList, hardwareType = HARDWARE_TYPE.CPU, _this) => {


    const data = [
        {key: "cpu1", data: 14},
        {key: "cpu12cpu1", data: 5},
        {key: "cpu13", data: 1},
        {key: "cpu14", data: 3},
        {key: "cpu15", data: 7},
    ]

    let chartDataList = [];
    for (let index = 0; index < usageList.length; index++) {

        if (index < 5) {
            let barDataOne = {
                key: usageList[index].instance.AppName.toString().substring(0, 10) + "...",
                data: hardwareType === 'cpu' ? usageList[index].sumCpuUsage : usageList[index].sumMemUsage,
            }

            chartDataList.push(barDataOne);
        }

        console.log('chartDataList===>', chartDataList);

    }

    chartDataList.sort((a, b) => {
        return a.data - b.data;
    });


    let colorCodes = ['rgba(112,0,28,1)', 'rgba(255,72,0,1)', 'rgb(237,255,42)', 'rgba(18,135,2,1)', 'rgba(28,34,255,1)']
    colorCodes.reverse()

    return (
        <div>
            <BarChart
                width={540}
                height={340}
                data={chartDataList}
                series={
                    <BarSeries
                        colorScheme={colorCodes}
                        layout={'horizontal'}
                        bar={
                            <RBar
                                tooltip={null}
                                isCategorical={true}
                                minHeight={50}
                                animated={true}
                                rounded={true}
                                label={<BarLabel fontSize={20} fill={'white'} position={'center'}/>}

                            />
                        }
                    />

                }
                gridlines={null}
                center
                //brush={<ChartBrush/>}
                //children={"children"}
                //className="barchart-exmaple"
                //zoomPan={<ChartZoomPan/>}
                xAxis={<LinearXAxis type="value"/>}
                yAxis={
                    <LinearYAxis
                        type="category"

                        tickSeries={<LinearYAxisTickSeries tickSize={30}/>}
                    />
                }
            />
        </div>
    );

}


export const renderBarGraphForInfo = (appInstanceListOnCloudlet, _this) => {

    console.log('appInstanceListOnCloudlet===>', appInstanceListOnCloudlet);

    let chartDataList = [];
    chartDataList.push(["Element", " Instance Count On Cloudlet", {role: "style"}, {
        calc: "stringify",
        sourceColumn: 1,
        type: "string",
        role: "annotation"
    }])
    let index = 0;
    for (let [key, value] of Object.entries(appInstanceListOnCloudlet)) {
        //filterInstanceCountOnCloutLetOne.push(value)

        console.log('key111===>', key)
        console.log('key111..value===>', value.length)

        let barDataOne = [
            key,
            value.length,
            CHART_COLOR_LIST[index],
            value.length.toString(),
        ]
        chartDataList.push(barDataOne);
        index++;
    }


    return (
        <Chart
            width={window.innerWidth * 0.45}
            height={540}
            chartType="BarChart"
            loader={<div><CircularProgress style={{color: 'red', zIndex: 999999}}/></div>}
            data={chartDataList}
            options={{
                annotations: {
                    alwaysOutside: true,
                    textStyle: {
                        // fontName: 'Times-Roman',
                        fontSize: 30,
                        bold: true,
                        italic: true,
                        color: 'white',     // The color of the text.
                        auraColor: 'black', // The color of the text outline.
                        opacity: 1.0          // The transparency of the text.
                    },
                    /* boxStyle: {
                         // Color of the box outline.
                         stroke: 'blue',
                         // Thickness of the box outline.
                         strokeWidth: 43,
                         // x-radius of the corner curvature.
                         rx: 0,
                         // y-radius of the corner curvature.
                         ry: 0,
                         // Attributes for linear gradient fill.
                         gradient: {
                             // Start color for gradient.
                             color1: 'white',
                             // Finish color for gradient.
                             color2: 'white',
                             // Where on the boundary to start and
                             // end the color1/color2 gradient,
                             // relative to the upper left corner
                             // of the boundary.
                             x1: '150%', y1: '100%',
                             x2: '150%', y2: '100%',
                             // If true, the boundary for x1,
                             // y1, x2, and y2 is the box. If
                             // false, it's the entire chart.
                             useObjectBoundingBoxUnits: true
                         }
                     }*/
                },
                is3D: false,
                title: '',
                titleTextStyle: {
                    color: 'red'
                },
                titlePosition: 'out',
                chartArea: {
                    left: 100,
                    right: 150,
                    top: 20,
                    width: "50%",
                    height: "80%",
                    backgroundColor: {
                        //  'fill': '#F4F4F4',
                        'opacity': 0.5
                    },
                },
                legend: {position: 'none'},//우측 Data[0]번째 텍스트를 hide..
                //xAxis
                hAxis: {
                    textPosition: 'none',//HIDE xAxis
                    title: '',
                    titleTextStyle: {
                        //fontName: "Times",
                        fontSize: 12,
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
                    fill: 'black'
                }
                //colors: ['green']
            }}

            // For tests
            rootProps={{'data-testid': '1'}}
        />
    );

}


const Styles = {
    cell000: {
        marginLeft: 0,
        backgroundColor: '#a3a3a3',
        flex: .4,
        alignItems: 'center',
        fontSize: 13,
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


/**
 * @todo: toChunkArray for TopLeftGrid
 * @todo: toChunkArray for TopLeftGrid
 * @param myArray
 * @param chunkSize
 * @returns {Array}
 */
export const toChunkArray = (myArray, chunkSize) => {
    let results = [];
    while (myArray.length) {
        results.push(myArray.splice(0, chunkSize));
    }
    return results;
}


/**
 * @todo: 로딩이 완료 되기전에 placeholder를 보여준다..
 * @returns {*}
 */
export const renderPlaceHolder = () => {
    let boxWidth = window.innerWidth / 3 - 50;
    return (
        <div className='page_monitoring_grid_box_blank2' style={{width: boxWidth}}>
            {/*<CircularProgress style={{zIndex: 999999999, color: '#79BF14', marginTop:-50}}/>*/}
            <div style={{marginTop: -50}}>
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
        </div>
    )
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
                        animationData: require('../../../lotties/loader001'),
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

    let filteredAppInstOnCloudlet = []
    CloudLetOneList.map(item => {
        if (item.ClusterInst === pCluster) {
            filteredAppInstOnCloudlet.push(item);
        }
    })
    return filteredAppInstOnCloudlet;
}

/**
 * todo: @weknow/react-bubble-chart-d3로 버블차트를 그린다..
 * todo: render a bubble chart with https://github.com/weknowinc/react-bubble-chart-d3
 * @returns {*}
 */
export const renderBubbleChart = (_this) => {
    let appInstanceList = _this.state.appInstanceList

    console.log('appInstanceList2222====>', appInstanceList)

    let chartData = [];
    appInstanceList.map((item, index) => {

        //console.log('Flavor222====>', item.Flavor);
        chartData.push({
            //label: item.Flavor+ "-"+ item.AppName.substring(0,5),
            index: index,
            label: item.AppName.toString().substring(0, 10) + "...",
            value: instanceFlavorToPerformanceValue(item.Flavor),
            favor: item.Flavor,
            fullLabel: item.AppName.toString(),
        })
    })

    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {/* <div style={{                marginLeft: 1,                marginRight: 1,                width: 80,            }}>                <FlexBox style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>                    {appInstanceList.map((item: TypeAppInstance) => {                        return (                            <FlexBox>                                {item.AppName}                            </FlexBox>                        )                    })}                </FlexBox>            </div>            */}
            <div style={{
                //backgroundColor: 'blue',
                backgroundColor: 'black',
                marginLeft: 0, marginRight: 0, marginBottom: 10,
            }}>
                {/* {_this.state.loading777 &&
                <div className='loaderDiv'>
                    <CircularProgress style={{marginLeft: 80, marginTop: 120, color: 'green'}}/>
                </div>
                }*/}
                <BubbleChart
                    className='bubbleChart'
                    graph={{
                        zoom: appInstanceList.length <= 4 ? 0.45 : 0.70,
                        offsetX: 0.15,
                        offsetY: appInstanceList.length <= 4 ? 0.03 : -0.00,
                    }}
                    width={690}
                    height={315}
                    padding={-5} // optional value, number that set the padding between bubbles
                    showLegend={true} // optional value, pass false to disable the legend.
                    legendPercentage={35} // number that represent the % of with that legend going to use.
                    legendFont={{
                        //family: 'Candal',
                        size: 12,
                        color: 'yellow',
                        weight: 'bold',
                    }}
                    valueFont={{
                        //family: 'Righteous',
                        size: 8,
                        color: '#404040',
                        //weight: 'bold',
                        fontStyle: 'italic',
                    }}
                    labelFont={{
                        //family: 'Righteous',
                        size: 12,
                        color: 'black',
                        weight: 'bold',
                    }}
                    //Custom bubble/legend click functions such as searching using the label, redirecting to other page
                    bubbleClickFun={async (label, index) => {

                        await _this.setState({
                            currentAppInst: label,
                            currentGridIndex: index,
                        })
                        await _this.handleSelectBoxChanges(_this.state.currentRegion, _this.state.currentCloudLet, _this.state.currentCluster, label)

                        /*
                            if (index >= 0 && index < 4) {
                                setTimeout(() => {
                                    _this.scrollToUp()
                                }, 250)
                            } else {
                                setTimeout(() => {
                                    _this.scrollToBottom()
                                }, 250)
                            }
                        */

                    }}

                    legendClickFun={async (label, index) => {

                        await _this.setState({
                            currentAppInst: label,
                            currentGridIndex: index,
                        })
                        await _this.handleSelectBoxChanges(_this.state.currentRegion, _this.state.currentCloudLet, _this.state.currentCluster, label)

                     /*   if (index >= 0 && index < 4) {
                            setTimeout(() => {
                                _this.scrollToUp()
                            }, 250)
                        } else {
                            setTimeout(() => {
                                _this.scrollToBottom()
                            }, 250)
                        }*/


                    }}
                    data={chartData}
                />

            </div>

        </div>
    )
}


/**
 *
 * @todo: 구글차트를 이용해서 pie차트를 랜더링
 * @todo: Render pie charts using Google charts
 * @returns {*}
 */
export const renderPieChart2AndAppStatus = (appInstanceOne, _this) => {
    let colorList = CHART_COLOR_LIST;
    let newColorList = []
    for (let i in colorList) {

        let itemOne = {
            color: colorList[i],
        }
        newColorList.push(itemOne)
    }

    function renderDiskUsage() {

        if (_this.state.currentUtilization[3] !== undefined) {
            return _this.state.currentUtilization[3] + " / " + _this.state.currentUtilization[2];
        }

    }


    let diskMax = -1;
    let diskUsed = -1;
    if (_this.state.currentUtilization[3] !== undefined) {
        diskUsed = _this.state.currentUtilization[3]
        diskMax = _this.state.currentUtilization[2];
    }

    return (
        <div className="pieChart">
            {diskUsed !== -1 ?
                <div className='popupTop'>
                    <Chart
                        width={210}
                        height={122}

                        chartType="PieChart"
                        data={[
                            ["Age", "Weight"], ["diskUsed", diskUsed], ["diskMax", diskMax]
                        ]}

                        options={{
                            // pieHole: 0.65,
                            //is3D: true,
                            title: "",
                            sliceVisibilityThreshold: .2,
                            chartArea: {left: 0, right: 20, top: 5, width: "30%", height: "80%"},
                            slices: [

                                {
                                    color: "#ff54ae"
                                },
                                {
                                    color: "#2c77ff"
                                },

                            ],
                            pieSliceBorderColor: 'blue',
                            pieSliceText: 'none',
                            legend: {
                                position: "none",
                                /*  alignment: "center",
                                  textStyle: {
                                      color: "white",
                                      fontSize: 14
                                  }*/
                            },
                            pieHole: 0.7,
                            pieSliceTextStyle: {
                                color: 'black',
                            },
                            tooltip: {
                                //textStyle: {color: 'black', backgroundColor: 'black'},
                                //text: 'both',
                                trigger: 'none',
                            },
                            fontName: "Roboto",
                            fontColor: 'black',
                            //backgroundColor: 'grey',
                            backgroundColor: {
                                strokeWidth: 0,
                                fill: 'transparent',
                            },
                            borderColor: 'red',
                        }}
                        graph_id="PieChart"
                        legend_toggle
                    >
                    </Chart>
                </div>
                :
                <div className=''>
                    <FlexBox style={{marginTop: 0, display: 'flex', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', height: 127, backgroundColor: 'black'}}>
                        No Data
                    </FlexBox>
                </div>

            }
            {/*todo:파이그래프 중앙의 앱네임*/}
            {/*todo:파이그래프 중앙의 앱네임*/}
            {/*todo:파이그래프 중앙의 앱네임*/}
            <div className='popup'>
                <div className=''>
                    {/*todo:파이그래프 하단의 utilisze 정보*/}
                    {/*todo:파이그래프 하단의 utilisze 정보*/}
                    {/*todo:파이그래프 하단의 utilisze 정보*/}
                    <FlexBox AlignItems={'center'} alignSelf={'flex-start'}
                             style={{flexDirection: 'column', marginTop: 0, marginLeft: 0, backgroundColor: 'transparent'}}>

                        {/*todo: disk usage 표시 부분*/}
                        <FlexBox
                            style={Styles.cell003}>
                            {_this.state.loading777 ?
                                <CircularProgress color={'green'} size={15}
                                                  style={{color: 'green'}}/> : <div style={{}}>{renderDiskUsage()}</div>}

                        </FlexBox>

                        <FlexBox style={Styles.cell004}>
                            {appInstanceOne.AppName}
                        </FlexBox>

                        {/*__row__1*/}
                        <div>
                            <FlexBox style={Styles.cpuDiskCol001}>
                                <FlexBox className='cellHeader'>
                                    <div style={{color: 'white', textAlign: 'center', marginLeft: 5}}>DISK</div>
                                </FlexBox>
                                <FlexBox style={Styles.cell001}>
                                    <div style={{color: 'white', textAlign: 'center', marginLeft: 15}}>
                                        {_this.state.loading777 ? <CircularProgress color={'green'} size={15}
                                                                                    style={{color: 'green'}}/> : _this.state.currentUtilization[3]}
                                    </div>
                                </FlexBox>
                            </FlexBox>

                            {/*__row__2*/}
                            <FlexBox style={Styles.cpuDiskCol001}>
                                <FlexBox className='cellHeader'>
                                    <div style={{color: 'white', textAlign: 'center', marginLeft: 5}}>vCPU</div>
                                </FlexBox>
                                <FlexBox style={Styles.cell001}>
                                    <div style={{
                                        color: 'white',
                                        textAlign: 'center',
                                        marginLeft: 15,
                                    }}>


                                        {_this.state.loading777 ? <CircularProgress color={'green'} size={15}
                                                                                    style={{color: 'green'}}/> : _this.state.currentUtilization[7]}
                                    </div>
                                </FlexBox>
                            </FlexBox>

                            {/*__row__3*/}
                            <FlexBox style={Styles.cpuDiskCol001}>
                                <FlexBox className='cellHeader'>
                                    <div style={{color: 'white', textAlign: 'center', marginLeft: 5}}>Operator</div>
                                </FlexBox>
                                <FlexBox style={Styles.cell001}>
                                    <div style={{color: 'white', textAlign: 'center', marginLeft: 15}}>
                                        {appInstanceOne.Operator}
                                    </div>
                                </FlexBox>
                            </FlexBox>

                            {/*__row__4*/}
                            <FlexBox style={Styles.cpuDiskCol001}>
                                <FlexBox className='cellHeader'>
                                    <div style={{color: 'white', textAlign: 'center', marginLeft: 5}}>Cloutlet</div>
                                </FlexBox>
                                <FlexBox style={Styles.cell001}>
                                    <div
                                        style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            marginLeft: 5
                                        }}>{appInstanceOne.Cloudlet !== '' ? appInstanceOne.Cloudlet.toString().substring(0, 18) + "..." : ''}</div>
                                </FlexBox>
                            </FlexBox>
                        </div>

                    </FlexBox>

                </div>
            </div>

        </div>
    );
}


export const getMetricsUtilizationAtAppLevel_TEST = async (appInstanceOne) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    console.log('appInstanceOne====>', appInstanceOne);
    let responseRslt = await axios({
        url: '/api/v1/auth/metrics/app',
        method: 'post',
        data: {
            "region": "EU",
            "appinst": {
                "app_key": {
                    "developer_key": {
                        "name": "MobiledgeX"
                    },
                    "name": "bicTestApp1112-01",
                    "version": "1.0"
                },
                "cluster_inst_key": {
                    "cluster_key": {
                        "name": "qqqaaa"
                    },
                    "cloudlet_key": {
                        "operator_key": {
                            "name": ""
                        }
                    }
                }
            },
            "starttime": "2019-09-11T21:26:04Z",
            "endtime": "2020-01-02T21:26:10Z",
            "last": 1,
            "selector": "cpu"
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


export const getMetricsUtilizationAtAtClusterLevel = async (appInstanceOne) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

    console.log('appInstanceOne====>', appInstanceOne);
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
 * @TODO: react_chartjs를 이용해서 라인 차트를 랜더링.
 * @desc : React wrapper for Chart.js 2 Open for PRs and contributions!
 * @desc : https://github.com/jerairrest/react-chartjs-2
 * @param hardwareUsageList
 * @param hardwareType
 * @returns {*}
 */
export const renderLineChart = (hardwareUsageList, hardwareType) => {
    console.log('itemeLength===>', hardwareUsageList);

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
            } else if (hardwareType === HARDWARE_TYPE.NETWORK) {
                usageOne = seriesValues[j]["12"]; //sendBytes
                //usageOne = seriesValues[j]["13"];//receivceBytes
            } else if (hardwareType === HARDWARE_TYPE.MEM) {
                usageOne = seriesValues[j]["10"]; //mem usage
            } else if (hardwareType === HARDWARE_TYPE.DISK) {
                usageOne = seriesValues[j]["8"];
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

    const data = (canvas) => {

        let gradientList= makeGradientColor(canvas, height);

        let finalSeriesDataSets = [];
        for (let i in usageSetList) {
            //@todo: top5 만을 추린다
            if (i < 5) {
                let datasetsOne = {
                    label: instanceNameList[i],
                    backgroundColor: hardwareType === HARDWARE_TYPE.CPU ? gradientList[i] : '',
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


        return {
            labels: newDateTimeList,
            datasets: finalSeriesDataSets,
        }
    }


    console.log('cpuUsageList===>', hardwareUsageList);

    let width = window.innerWidth * 0.28
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
        maintainAspectRatio: true,
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
            }]
        }

    }

    //todo :#######################
    //todo : chart rendering part
    //todo :#######################
    return (
        <div>
            <ReactChartJs
                width={width}
                height={320}
                data={data}
                options={options}
            />
        </div>
    );


}


/**
 *
 * @param canvas
 * @param height
 * @returns {[]}
 */
export const makeGradientColor = (canvas, height)=>{
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


/**
 * @desc: Render the number of instances on the cloudlet at the top left of the monitoring page ...
 * @param appInstanceListSortByCloudlet
 * @returns {*}
 */
export const renderInstanceOnCloudletGrid = (appInstanceListSortByCloudlet, _this) => {
    // let boxWidth = window.innerWidth / 10 * 2.55;

    let cloudletCountList = []
    for (let i in appInstanceListSortByCloudlet) {
        console.log('renderGrid===title>', appInstanceListSortByCloudlet[i][0].Cloudlet);
        console.log('renderGrid===length>', appInstanceListSortByCloudlet[i].length);
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

    console.log('chunkedArraysOfColSize_length===>', chunkedArraysOfColSize.length);
    //console.log('chunkedArraysOfColSize[0]===>', chunkedArraysOfColSize[0].length);

    return (
        <div style={{display: 'flex', flexDirection: 'column', width: '90%'}}>
            {chunkedArraysOfColSize.map((colSizeArray, index) =>
                <div className='page_monitoring_grid' key={index.toString()}>
                    {colSizeArray.map((item, index) =>
                        <div className='page_monitoring_grid_box'
                             style={{flex: colSizeArray.length === 1 && index === 0 ? .318 : .33}}
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
                            <FlexBox style={{
                                fontSize: 15,
                                marginTop: 10,

                            }}>
                                {item.name.toString().substring(0, 19) + "..."}
                            </FlexBox>
                            <FlexBox style={{
                                marginTop: 0,
                                fontSize: 50,
                                color: '#29a1ff',
                            }}>
                                {item.length}
                            </FlexBox>

                        </div>
                    )}
                </div>
            )}

            {/*@todo:first row만 존재할경우 2nd row를 공백으로 채워주는 로직*/}
            {/*@todo:first row만 존재할경우 2nd row를 공백으로 채워주는 로직*/}
            {/*@todo:first row만 존재할경우 2nd row를 공백으로 채워주는 로직*/}
            {chunkedArraysOfColSize.length === 1 &&
            <div className='page_monitoring_grid_box_blank2'>
                {[1, 2, 3].map((item, index) =>
                    <div key={index} className='page_monitoring_grid_box_blank2'
                         style={{backgroundColor: 'transprent'}}>
                        <FlexBox style={{
                            fontSize: 15,
                            color: '#fff',
                            marginTop: 10,
                        }}>
                            {/*blank*/}
                        </FlexBox>
                        <FlexBox style={{
                            marginTop: 0,
                            fontSize: 50,
                            color: 'transprent',
                        }}>
                            {/*blank*/}
                        </FlexBox>

                    </div>
                )}
            </div>

            }

        </div>
    );
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
 * @param memOrCpuUsageList
 * @returns {*}
 */
export const filterUsageListByRegion = (pRegion, memOrCpuUsageList) => {
    if (pRegion === REGION.ALL) {
        return memOrCpuUsageList;
    } else {
        let filteredUsageListByRegion = memOrCpuUsageList.filter((item) => {
            if (item.instance.Region === pRegion) {
                return item;
            }
        });
        return filteredUsageListByRegion;
    }
}

export const filterCpuOrMemUsageListByType = (pRegion, memOrCpuUsageList, type) => {
    if (pRegion === REGION.ALL) {
        return memOrCpuUsageList;
    } else {
        let filteredUsageListByRegion = memOrCpuUsageList.filter((item) => {
            if (item.instance.Region === pRegion) {
                return item;
            }
        });
        return filteredUsageListByRegion;
    }
}


/**
 * @todo 현재 선택된 지역의 인스턴스 리스트를 가지고 온다...
 * @todo : fetch App Instance List BY region
 * @param pArrayRegion
 * @returns {Promise<[]>}
 */
export const requestShowAppInstanceList = async (pArrayRegion = ['EU', 'US']) => {
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
            let finalizedJSON = formatData(parseData, serviceBody)
            return finalizedJSON;
        }).catch(e => {
            throw new Error(e)
        })

        let mergedList = mergedAppInstanceList.concat(responseResult);
        mergedAppInstanceList = mergedList;
    }
    return mergedAppInstanceList;
}


export const getUsageList = async (appInstanceList, pHardwareType, recentDataLimitCount) => {

    let instanceBodyList = []
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;
    for (let index = 0; index < appInstanceList.length; index++) {
        //todo: Create a data FORM format for requests
        let instanceInfoOneForm = makeFormForAppInstance(appInstanceList[index], pHardwareType, store.userToken, recentDataLimitCount)
        instanceBodyList.push(instanceInfoOneForm);
    }

    let promiseList = []
    for (let index = 0; index < instanceBodyList.length; index++) {
        promiseList.push(requestAppLevelMetrics(instanceBodyList[index]))
    }
    //todo: Bring health check list(cpu,mem,network,disk..) to the number of apps instance, by parallel request
    let appInstanceHealthCheckList = await Promise.all(promiseList);

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
    let matrixedUsageList = []
    usageListForAllInstance.map((item, index) => {
        let appName = item.instanceData.AppName;
        let sumMemUsage = 0;
        let sumDiskUsage = 0;
        let sumRecvBytes = 0;
        let sumSendBytes = 0;
        let sumCpuUsage = 0;
        let series = item.appInstanceHealth.data["0"].Series;

        if (series !== null) {
            let cpuSeries = series["3"]

            //@todo###########################
            //@todo makeCpuSeriesList
            //@todo###########################
            cpuSeries.values.map(item => {
                let cpuUsage = item[6];//cpuUsage..index
                sumCpuUsage += cpuUsage;
            })

            cpuUsageList.push({
                instance: item.instanceData,
                columns: cpuSeries.columns,
                sumCpuUsage: sumCpuUsage,
                values: cpuSeries.values,
                appName: appName,

            })
            //@todo###########################
            //@todo MemSeriesList
            //@todo###########################
            let memSeries = series["1"]
            memSeries.values.map(item => {
                let usageOne = item[10];//memUsage..index
                sumMemUsage += usageOne;
            })

            memUsageList.push({
                instance: item.instanceData,
                columns: memSeries.columns,
                sumMemUsage: sumMemUsage,
                values: memSeries.values,
                appName: appName,
            })

            //@todo###########################
            //@todo DiskSeriesList
            //@todo###########################
            let diskSeries = series["2"]
            diskSeries.values.map(item => {
                let usageOne = item[8];//diskUsage..index
                sumDiskUsage += usageOne;
            })

            diskUsageList.push({
                instance: item.instanceData,
                columns: diskSeries.columns,
                sumDiskUsage: sumDiskUsage,
                values: diskSeries.values,
                appName: appName,
            })

            //@todo###############################
            //@todo NetworkUSageList
            //@todo##############################
            let networkSeries = series["0"]
            networkSeries.values.map(item => {
                let recvBytesOne = item[12];//memUsage
                sumRecvBytes += recvBytesOne;

                let sendBytesOne = item[13];//memUsage
                sumSendBytes += sendBytesOne;
            })

            networkUsageList.push({
                instance: item.instanceData,
                columns: networkSeries.columns,
                sumRecvBytes: sumRecvBytes,
                sumSendBytes: sumSendBytes,
                values: networkSeries.values,
                appName: appName,
            })
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
        }

    })

    //@todo :##################################
    //@todo : Sort usage in reverse order.
    //@todo :##################################
    cpuUsageList.sort((a, b) => b.sumCpuUsage - a.sumCpuUsage);
    memUsageList.sort((a, b) => b.sumMemUsage - a.sumMemUsage);
    networkUsageList.sort((a, b) => b.sumRecvBytes - a.sumRecvBytes)
    diskUsageList.sort((a, b) => b.sumDiskUsage - a.sumDiskUsage);
    matrixedUsageList.push(cpuUsageList)
    matrixedUsageList.push(memUsageList)
    matrixedUsageList.push(networkUsageList)
    matrixedUsageList.push(diskUsageList)
    return matrixedUsageList;
}



