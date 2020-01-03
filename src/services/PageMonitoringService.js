import React from 'react';
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import qs from "qs";
import FormatComputeInst from "./formatter/formatComputeInstance";
import '../sites/PageMonitoring.css';
import {getAppInstanceHealth, makeFormForAppInstance} from "./SharedService";
import {CHART_COLOR_LIST, HARDWARE_TYPE, RECENT_DATA_LIMIT_COUNT, REGION} from "../shared/Constants";
import {Line as ReactChartJs, Bar as Bar2, HorizontalBar} from 'react-chartjs-2';
import FlexBox from "flexbox-react";
import Lottie from "react-lottie";
import BubbleChart from "../components/BubbleChart";
import PageMonitoring2 from "../sites/PageMonitoring2";
import type {TypeAppInstance} from "../shared/Types";
import {
    Bar as RBar,
    BarChart,
    BarLabel,
    BarSeries,
    Line,
    LinearXAxis,
    LinearYAxis,
    LinearYAxisTickSeries,
    LineChart,
    LineSeries,
    StackedAreaChart,
    StackedAreaSeries, StackedNormalizedAreaChart,
    StackedNormalizedAreaSeries
} from "reaviz";

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
export const filterCpuOrMemUsageByCloudLet = (cpuOrMemUsageList, pCloudLet) => {
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
export const filterCpuOrMemUsageByCluster = (cpuOrMemUsageList, pCluster) => {
    let filteredCpuOrMemUsageList = cpuOrMemUsageList.filter((item) => {
        if (item.instance.ClusterInst === pCluster) {
            return item;
        }
    });
    return filteredCpuOrMemUsageList
}

export const filterCpuOrMemUsageByAppInst = (cpuOrMemUsageList, pAppInst) => {
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
export const makeClusterListSelectBox = (appInstanceList: Array, pCloudLet) => {

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
export const makeCloudletListSelectBox = (appInstanceList: Array) => {
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
export const renderBarGraphForCpuMem = (usageList: any, hardwareType: string = HARDWARE_TYPE.CPU, _this) => {

    let chartDataList = [];
    chartDataList.push(["Element", hardwareType.toUpperCase() + " USAGE", {role: "style"}, {role: 'annotation'}])
    for (let index = 0; index < usageList.length; index++) {

        if (index < 5) {
            let barDataOne = [usageList[index].instance.AppName.toString().substring(0, 10) + "...",
                hardwareType === 'cpu' ? usageList[index].sumCpuUsage : usageList[index].sumMemUsage,
                CHART_COLOR_LIST[index],
                hardwareType === 'cpu' ? usageList[index].sumCpuUsage.toFixed(2) + " %" : usageList[index].sumMemUsage + " Byte"]
            chartDataList.push(barDataOne);
        }

    }

    return (
        <Chart
            width={window.innerWidth * 0.31}
            height={320}
            chartType="BarChart"
            loader={<div><CircularProgress style={{color: 'red', zIndex: 999999}}/></div>}
            data={chartDataList}
            options={{
                annotations: {
                    style: 'line',
                    textStyle: {
                        //fontName: 'Times-Roman',
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
                        // Attributes for linear gradient fill.
                        /* gradient: {
                             // Start color for gradient.
                             color1: '#ffecbc',
                             // Finish color for gradient.
                             //color2: '#33b679',
                             // Where on the boundary to start and
                             // end the color1/color2 gradient,
                             // relative to the upper left corner
                             // of the boundary.
                             x1: '0%', y1: '0%',
                             x2: '100%', y2: '100%',
                             // If true, the boundary for x1,
                             // y1, x2, and y2 is the box. If
                             // false, it's the entire chart.
                             useObjectBoundingBoxUnits: false
                         }*/
                    }
                },
                is3D: false,
                title: '',
                titleTextStyle: {
                    color: 'red'
                    /*fontName: <string>, // i.e. 'Times New Roman'
                    fontSize: <number>, // 12, 18 whatever you want (don't specify px)
                     bold: <boolean>,    // true or false
                    italic: <boolean>   // true of false*/
                },
                titlePosition: 'out',
                chartArea: {left: 100, right: 150, top: 20, width: "50%", height: "80%"},
                legend: {position: 'none'},//우측 Data[0]번째 텍스트를 hide..
                //xc춧
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
                    format: hardwareType === HARDWARE_TYPE.CPU ? '#\'%\'' : '#\' byte\'',
                    baselineColor: 'grey',
                    //out', 'in', 'none'.
                },
                //Y축
                vAxis: {
                    title: '',
                    titleTextStyle: {
                        fontSize: 14,
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
                /* animation: {
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

export const renderBar3333 = (usageList: any, hardwareType: string = HARDWARE_TYPE.CPU, _this) => {

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


export const renderBarGraph002 = (usageList: any, hardwareType: string = HARDWARE_TYPE.CPU, _this) => {


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


/*

    function renderColorCode() {
        let colorCodes2 = ['rgba(222,0,0,1)', 'rgba(255,150,0,1)', 'rgba(255,246,0,1)', 'rgba(91,203,0,1)', 'rgba(0,150,255,1)'];

        if (chartDataList === 1) {
            colorCodes2 = ['rgba(222,0,0,1)'];
        }else{


        }
        return (
            colorCodes2
        )
    }
*/

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


export const renderBarGraphForInfo = (appInstanceListOnCloudlet: any, _this) => {

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
export const toChunkArray = (myArray: any, chunkSize: any): any => {
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
    let boxWidth = window.innerWidth / 10 * 4.55;
    return (
        <div className='page_monitoring_grid_box_blank2'>
            {/*<CircularProgress style={{zIndex: 999999999, color: '#79BF14', marginTop:-50}}/>*/}
            <div style={{marginTop: -50}}>
                <Lottie
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: require('../lotties/loader001'),
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
                        animationData: require('../lotties/loader001'),
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
export const instanceFlavorToPerformanceValue = (flavor: string) => {
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
export const filterAppInstOnCloudlet = (CloudLetOneList: Array, pCluster: string) => {

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
export const renderBubbleChart = (_this: PageMonitoring2) => {
    let appInstanceList = _this.state.appInstanceList


    //console.log('appInstanceList2222====>', appInstanceList)

    let chartData = [];
    appInstanceList.map((item: TypeAppInstance) => {

        //console.log('Flavor222====>', item.Flavor);
        chartData.push({
            //label: item.Flavor+ "-"+ item.AppName.substring(0,5),
            label: item.AppName.toString().substring(0, 10) + "...",
            value: instanceFlavorToPerformanceValue(item.Flavor),
            favor: item.Flavor,
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
                        zoom: appInstanceList.length <= 4 ? 0.80 : 0.98,
                        offsetX: 0.03,
                        offsetY: appInstanceList.length <= 4 ? 0.03 : -0.06,
                    }}
                    width={370}
                    height={315}
                    padding={0} // optional value, number that set the padding between bubbles
                    showLegend={false} // optional value, pass false to disable the legend.
                    legendPercentage={30} // number that represent the % of with that legend going to use.
                    legendFont={{
                        //family: 'Candal',
                        size: 12,
                        color: 'yellow',
                        weight: 'bold',
                    }}
                    valueFont={{
                        //family: 'Righteous',
                        size: 25,
                        color: 'black',
                        //weight: 'bold',
                        fontStyle: 'italic',
                    }}
                    labelFont={{
                        //family: 'Righteous',
                        size: 10,
                        color: '#000',
                        weight: 'bold',
                    }}
                    //Custom bubble/legend click functions such as searching using the label, redirecting to other page
                    bubbleClickFun={(label) => {

                        _this.setAppInstanceOne(label);
                    }}
                    //legendClickFun={this.legendClick.bind(this)}
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
export const renderPieChart2AndAppStatus = (appInstanceOne: TypeAppInstance, _this: PageMonitoring2) => {


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

    //alert(diskUsed.toString())

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


export const getMetricsUtilization = async (appInstanceOne: TypeAppInstance) => {
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
 * @param cpuUsageListPerInstanceSortByUsage
 * @param hardwareType
 * @returns {*}
 */
export const renderLineChart = (cpuUsageListPerInstanceSortByUsage, hardwareType: string) => {
    console.log('itemeLength===>', cpuUsageListPerInstanceSortByUsage);

    let instanceAppName = ''
    let instanceNameList = [];
    let cpuUsageSetList = []
    let dateTimeList = []
    for (let i in cpuUsageListPerInstanceSortByUsage) {
        let seriesValues = cpuUsageListPerInstanceSortByUsage[i].values

        instanceAppName = cpuUsageListPerInstanceSortByUsage[i].instance.AppName
        let usageList = [];

        for (let j in seriesValues) {

            let usageOne = 0;
            if (hardwareType === HARDWARE_TYPE.CPU) {
                usageOne = seriesValues[j]["4"];
            } else {
                usageOne = seriesValues[j]["5"];
            }

            usageList.push(usageOne);
            let dateOne = seriesValues[j]["0"];
            dateOne = dateOne.toString().split("T")

            dateTimeList.push(dateOne[1]);
        }

        instanceNameList.push(instanceAppName)
        cpuUsageSetList.push(usageList);
    }


    //@todo: last를 RECENT_DATA_LIMIT_COUNT개로 (최근데이타 RECENT_DATA_LIMIT_COUNT 개)  설정 했으므로 날짜를 RECENT_DATA_LIMIT_COUNT 개로 잘라준다
    let newDateTimeList = []
    for (let i in dateTimeList) {
        if (i < RECENT_DATA_LIMIT_COUNT) {
            let splitDateTimeArrayList = dateTimeList[i].toString().split(".");
            let timeOne = splitDateTimeArrayList[0].replace("T", "T");
            newDateTimeList.push(timeOne.toString().substring(3, timeOne.length))
        }

    }
    /*
    const data = {
          labels: newDateTimeList, //todo:하단(X)축에 랜더링 되는 DateList.(LabelList)
          datasets: finalSeriesDataSets //todo: 렌더링할 데이터셋
    };*/

    const data = (canvas) => {
        const ctx = canvas.getContext("2d");

        let gradientList = []
        const gradient = ctx.createLinearGradient(0, 0, 0, height);

        //rgba(255, 0, 10, 0.25)
        // rgba(255,94,29,0.25)
        // rgba(227,220,57,0.25)
        // rgba(18,135,2,0.25)
        // rgba(28,34,255,0.25)
        gradient.addColorStop(0, 'rgba(112,0,28,1)');
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

        let finalSeriesDataSets = [];
        for (let i in cpuUsageSetList) {
            //@todo: top5 만을 추린다
            if (i < 5) {
                let datasetsOne = {
                    label: instanceNameList[i],
                    backgroundColor: hardwareType === HARDWARE_TYPE.CPU ? gradientList[i] : '', // Put the gradient here as a fill color
                    //borderColor: gradientList[i],
                    borderWidth: 2,
                    pointColor: "#fff",
                    pointStrokeColor: 'white',
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: 'white',
                    data: cpuUsageSetList[i],
                    //pointRadius: 1,
                }

                finalSeriesDataSets.push(datasetsOne)
            }

        }


        return {
            labels: newDateTimeList,
            datasets: finalSeriesDataSets,
        }
    }


    console.log('cpuUsageList===>', cpuUsageListPerInstanceSortByUsage);

    let width = window.innerWidth * 0.255
    let height = 500 + 50;

    let options = {
        maintainAspectRatio: false,
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
                    fontColor: 'white'
                },
                gridLines: {
                    color: "#505050",
                },

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
                    maxRotation: 0.01,
                    padding: 10,
                    labelOffset: 0,
                    /* callback(value, index) {
                         if (index % 2 == 0) return '';
                         return value;
                     },*/
                },
                beginAtZero: true,
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
                height={300}
                data={data}
                options={options}
            />
        </div>
    );


}


export const renderLineChart002 = (cpuUsageListPerInstanceSortByUsage, hardwareType: string) => {


    console.log('cpuUsageListPerInstanceSortByUsage===>', cpuUsageListPerInstanceSortByUsage);

    let instanceAppName = ''
    let instanceNameList = [];
    let cpuOrMemUsageSetList = []
    for (let i in cpuUsageListPerInstanceSortByUsage) {
        let seriesValues = cpuUsageListPerInstanceSortByUsage[i].values

        instanceAppName = cpuUsageListPerInstanceSortByUsage[i].instance.AppName
        let usageListData = [];
        for (let j in seriesValues) {

            if (j < 5) {
                let usageOne = 0;
                if (hardwareType === HARDWARE_TYPE.CPU) {
                    usageOne = seriesValues[j]["4"];//CPU USAGE
                } else {
                    usageOne = seriesValues[j]["5"];//MEM USAGE
                }
                let dateOne = seriesValues[j]["0"];
                /*dateOne = dateOne.toString().split("T")
                console.log('dateOne===>', dateOne[1].toString().substring(0,8));
                let _dateOne= dateOne[1].toString().substring(0,8);*/
                usageListData.push({
                    key: new Date(dateOne),
                    data: usageOne,
                });
            }

        }

        instanceNameList.push(instanceAppName)
        cpuOrMemUsageSetList.push(usageListData);


    }

    console.log('11111===>', instanceNameList);
    console.log('11111===>', cpuOrMemUsageSetList);

    let reverse_cpuOrMemUsageSetList = []
    for (let i in cpuOrMemUsageSetList) {
        let tempList = cpuOrMemUsageSetList[i]  //100개임

        console.log('tempList===>', tempList)//100개

        tempList.sort((a, b) => {
            return a.key - b.key;
        });

        let tempList2 = []
        for (let j in tempList) {
            if (j < 4) {

                let date = new Date(tempList[j].key);
                tempList[j].key = date;
                tempList2.push(tempList[j])
            }


        }

        reverse_cpuOrMemUsageSetList.push(tempList)
    }

    let completeUsageList = []
    for (let i in instanceNameList) {
        if (i < 4) {
            completeUsageList.push({
                key: instanceNameList[i],
                data: reverse_cpuOrMemUsageSetList[i],
            })
        }
    }


    const multiDateData2 = [
        {
            key: "jjj kkk4",
            data: [
                {
                    "key": new Date("2019-10-19T22:45:23.888Z"),
                    "data": 0.3
                },
                {
                    "key": new Date("2019-10-19T22:45:40.737Z"),
                    "data": 0.5
                },
                {
                    "key": new Date("2019-10-19T22:45:49.220Z"),
                    "data": 0.9
                },
                {
                    "key": new Date("2019-10-19T22:45:57.687Z"),
                    "data": 0.124
                },
                {
                    "key": new Date("2019-10-19T22:46:14.707Z"),
                    "data": 0.555
                },
            ]
        },
        {
            key: "jjj kkk5",
            data: [
                {
                    "key": new Date("2019-10-19T22:45:23.888Z"),
                    "data": 0.3
                },
                {
                    "key": new Date("2019-10-19T22:45:40.737Z"),
                    "data": 0.5
                },
                {
                    "key": new Date("2019-10-19T22:45:49.220Z"),
                    "data": 2.9
                },
                {
                    "key": new Date("2019-10-19T22:45:57.687Z"),
                    "data": 5.13
                },
                {
                    "key": new Date("2019-10-19T22:46:14.707Z"),
                    "data": 3.555
                },
            ]
        },
        {
            key: "jjj kkk6",
            data: [
                {
                    "key": new Date("2019-10-19T22:45:23.888Z"),
                    "data": 7.3
                },
                {
                    "key": new Date("2019-10-19T22:45:40.737Z"),
                    "data": 2.5
                },
                {
                    "key": new Date("2019-10-19T22:45:49.220Z"),
                    "data": 0.9
                },
                {
                    "key": new Date("2019-10-19T22:45:57.687Z"),
                    "data": 0.124
                },
                {
                    "key": new Date("2019-10-19T22:46:14.707Z"),
                    "data": 0.555
                },
            ]
        },


    ];

    const multiDateData = [
        {
            key: 'Threat Intel',
            data: [
                {key: new Date("2019-02-01T06:00:00.000Z"), data: 0},
                {key: new Date("2019-02-01T06:00:01.030Z"), data: 0},
                {key: new Date("2019-02-01T06:00:02.000Z"), data: 2.98},
                {key: new Date("2019-02-01T06:00:03.000Z"), data: 1.78},
                {key: new Date("2019-02-01T06:00:04.000Z"), data: 0},
            ]
        },
        {
            key: 'Threat Intel2',
            data: [
                {key: new Date("2019-02-01T06:00:00.000Z"), data: 1},
                {key: new Date("2019-02-01T06:00:01.030Z"), data: 2},
                {key: new Date("2019-02-01T06:00:02.000Z"), data: 3},
                {key: new Date("2019-02-01T06:00:03.000Z"), data: 4},
                {key: new Date("2019-02-01T06:00:04.000Z"), data: 3},
            ]
        },
        {
            key: 'Threat Intel3',
            data: [
                {key: new Date("2019-02-01T06:00:00.000Z"), data: 11},
                {key: new Date("2019-02-01T06:00:01.030Z"), data: 25},
                {key: new Date("2019-02-01T06:00:02.000Z"), data: 35},
                {key: new Date("2019-02-01T06:00:03.000Z"), data: 45},
                {key: new Date("2019-02-01T06:00:04.000Z"), data: 3},
            ]
        },

    ];
    console.log('completeUsageList2===>', multiDateData);
    console.log('completeUsageList===>', completeUsageList);

    let complete = [
        {
            "key": "zzaaa",
            "data": [
                {
                    "key": new Date("2019-10-22T22:00:34.676Z"),
                    "data": 11
                },
                {
                    "key": new Date("2019-10-22T22:00:42.722Z"),
                    "data": 22
                },
                {
                    "key": new Date("2019-10-22T22:00:50.775Z"),
                    "data": 23
                },
                {
                    "key": new Date("2019-10-22T22:00:58.818Z"),
                    "data": 1
                },
                {
                    "key": new Date("2019-10-22T22:01:06.868Z"),
                    "data": 0
                }
            ]
        },
        {
            "key": "test111qq",
            "data": [
                {
                    "key": new Date("2019-11-14T15:12:54.639Z"),
                    "data": 1
                },
                {
                    "key": new Date("2019-11-14T15:13:02.732Z"),
                    "data": 2
                },
                {
                    "key": new Date("2019-11-14T15:13:10.820Z"),
                    "data": 33
                },
                {
                    "key": new Date("2019-11-14T15:13:18.903Z"),
                    "data": 44
                },
                {
                    "key": new Date("2019-11-14T15:13:26.988Z"),
                    "data": 55
                }
            ]
        },

    ]

    return (
        <StackedAreaChart
            data={completeUsageList}
            //'value' | 'time' | 'category' | 'duration';
            //xAxis={<LinearXAxis type="duration"/>}
            /*yAxis={
                <LinearYAxis
                    type="value"
                    tickSeries={<LinearYAxisTickSeries tickSize={30}/>}
                />
            }*/
            width={520}
            gridlines={null}
            height={330}
            series={
                <StackedAreaSeries
                    // isZoomed={true}
                    //animated={true}
                    type="grouped"
                    //area={null}
                    colorScheme={'cybertron'}
                    line={<Line strokeWidth={3}/>}
                />
            }

        />
    )


}


/**
 * @TODO: 모니터링Page 좌측 상단에 클라우드렛에 올라가있는 인스턴스 갯수를 랜더링...
 * @desc: Render the number of instances on the cloudlet at the top left of the monitoring page ...
 * @param appInstanceListSortByCloudlet
 * @returns {*}
 */
export const renderInstanceOnCloudletGrid = (appInstanceListSortByCloudlet: any) => {
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

    function toChunkArray(myArray: any, chunkSize: any): any {
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
        <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
            {chunkedArraysOfColSize.map((colSizeArray, index) =>
                <div className='page_monitoring_grid' key={index.toString()}>
                    {colSizeArray.map((item, index) =>
                        <div className='page_monitoring_grid_box'
                             style={{flex: colSizeArray.length === 1 && index === 0 ? .318 : .33}}>
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
export const filterAppInstanceListByRegion = (pRegion: string, appInstanceList: Array<TypeAppInstance>) => {
    if (pRegion === REGION.ALL) {
        return appInstanceList;
    } else {
        let filteredAppInstanceList = appInstanceList.filter((item: TypeAppInstance) => {
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
export const filterCpuOrMemUsageListByRegion = (pRegion: string, memOrCpuUsageList) => {
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

export const filterCpuOrMemUsageListByType = (pRegion: string, memOrCpuUsageList, type: string) => {
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
 * @param paramRegionArrayList
 * @returns {Promise<[]>}
 */
export const fetchAppInstanceList = async (paramRegionArrayList: any = ['EU', 'US']) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    let finalizedAppInstanceList = [];
    for (let index = 0; index < paramRegionArrayList.length; index++) {
        let serviceBody = {
            "token": store.userToken,
            "params": {
                "region": paramRegionArrayList[index],
                "appinst": {
                    "key": {
                        "app_key": {
                            "developer_key": {"name": localStorage.selectOrg},
                        }
                    }
                }
            }
        }

        let resource = 'ShowAppInsts';
        const hostname = window.location.hostname;
        let ServerUrl = 'https://' + hostname + ':3030';

        //https://mc.mobiledgex.net:9900/api/v1/auth/ctrl/ShowAppInst
        let responseResult = await axios.post(ServerUrl + '/' + resource, qs.stringify({
            service: resource,
            serviceBody: serviceBody,
            serviceId: Math.round(Math.random() * 10000)
        })).then((response) => {

            let parseData = JSON.parse(JSON.stringify(response));
            let finalizedJSON = FormatComputeInst(parseData, serviceBody)
            console.log('finalizedJSON===>', finalizedJSON);
            return finalizedJSON;
        })

        let mergedList = finalizedAppInstanceList.concat(responseResult);
        finalizedAppInstanceList = mergedList;
    }

    console.log('mergedAppInstanceList===>', finalizedAppInstanceList);
    return finalizedAppInstanceList;
}


/**
 * @desc : 앱인스턴스 리스트 이용해서 인스턴스에 대한 total cpu usage 리스트를 만든다..
 * @desc : Using the app instance list, create a list of TOTAL/AVERAGE CPU, MEM,NETWORK,DISK usage for the instance.
 * @param appInstanceList
 * @returns {Promise<Array>}
 */
export const makeHardwareUsageListPerInstance = async (appInstanceList: any, paramCpuOrMem: HARDWARE_TYPE = HARDWARE_TYPE.CPU, recentDataLimitCount: number) => {

    let usageListPerOneInstance = []
    for (let index = 0; index < appInstanceList.length; index++) {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;

        //todo: 레퀘스트를 요청할 데이터 FORM형식을 만들어 준다.
        let instanceInfoOneForm = makeFormForAppInstance(appInstanceList[index], paramCpuOrMem, store.userToken, recentDataLimitCount)

        //console.log('formOne====>', instanceInfoOneForm);
        //console.log('appInstanceList===>', appInstanceList[index]);

        let appInstanceHealth = await getAppInstanceHealth(instanceInfoOneForm);
        //console.log(`appInstanceHealth====>${index}`,)

        usageListPerOneInstance.push({
            instanceData: appInstanceList[index],
            appInstanceHealth: appInstanceHealth,
        });

    }

    let newHardwareUsageList = [];

    for (let index = 0; index < usageListPerOneInstance.length; index++) {
        if (usageListPerOneInstance[index].appInstanceHealth.data[0].Series != null) {

            let columns = usageListPerOneInstance[index].appInstanceHealth.data[0].Series[0].columns;
            let values = usageListPerOneInstance[index].appInstanceHealth.data[0].Series[0].values;

            let sumCpuUsage = 0;
            let sumMemUsage = 0;
            let sumDiskUsage = 0;
            let sumRecvBytes = 0;
            let sumSendBytes = 0;
            for (let jIndex = 0; jIndex < values.length; jIndex++) {
                //console.log('itemeLength===>',  values[i][4]);

                if (paramCpuOrMem === HARDWARE_TYPE.CPU) {
                    sumCpuUsage = sumCpuUsage + values[jIndex][4];
                } else if (paramCpuOrMem === HARDWARE_TYPE.MEM) {
                    sumMemUsage = sumMemUsage + values[jIndex][5];
                } else if (paramCpuOrMem === HARDWARE_TYPE.NETWORK) {
                    sumRecvBytes = sumRecvBytes + values[jIndex][6];
                    sumSendBytes = sumSendBytes + values[jIndex][7];
                } else if (paramCpuOrMem === HARDWARE_TYPE.DISK) {
                    sumDiskUsage = sumDiskUsage + values[jIndex][5];
                }

            }

            //todo: CPU/MEM 사용량 평균값을 계산한다.....
            sumCpuUsage = sumCpuUsage / usageListPerOneInstance.length;
            sumMemUsage = Math.ceil(sumMemUsage / usageListPerOneInstance.length);

            console.log('sumMemUsage===>', sumMemUsage);


            let body = {}
            if (paramCpuOrMem === 'cpu') {
                body = {
                    instance: usageListPerOneInstance[index].instanceData,
                    columns: columns,
                    values: values,
                    sumCpuUsage: sumCpuUsage,
                }

            } else if (paramCpuOrMem === 'mem') {
                body = {
                    instance: usageListPerOneInstance[index].instanceData,
                    columns: columns,
                    values: values,
                    sumMemUsage: sumMemUsage,
                }

            } else if (paramCpuOrMem === 'disk') {
                body = {
                    instance: usageListPerOneInstance[index].instanceData,
                    columns: columns,
                    values: values,
                    sumDiskUsage: sumDiskUsage,
                }
            } else {//network
                body = {
                    instance: usageListPerOneInstance[index].instanceData,
                    columns: columns,
                    values: values,
                    sumRecvBytes: sumRecvBytes,
                    sumSendBytes: sumSendBytes,
                }

            }

            newHardwareUsageList.push(body);

        } else {

            let body = {}
            if (paramCpuOrMem === 'cpu') {
                body = {
                    instance: usageListPerOneInstance[index].instanceData,
                    columns: '',
                    values: '',
                    sumCpuUsage: 0,
                }

            } else if (paramCpuOrMem === 'mem') {
                body = {
                    instance: usageListPerOneInstance[index].instanceData,
                    columns: '',
                    values: '',
                    sumMemUsage: 0,
                }

            } else if (paramCpuOrMem === 'disk') {
                body = {
                    instance: usageListPerOneInstance[index].instanceData,
                    columns: '',
                    values: '',
                    sumDiskUsage: 0,
                }
            } else {//network
                body = {
                    instance: usageListPerOneInstance[index].instanceData,
                    columns: '',
                    values: '',
                    sumRecvBytes: 0,
                    sumSendBytes: 0,
                }

            }
            newHardwareUsageList.push(body);
        }

    }
    //@todo :##################################
    //@todo : Sort usage in reverse order.
    //@todo :##################################
    if (paramCpuOrMem === HARDWARE_TYPE.CPU) {
        newHardwareUsageList.sort((a, b) => {
            return b.sumCpuUsage - a.sumCpuUsage;
        });
    } else if (paramCpuOrMem === HARDWARE_TYPE.MEM) {
        newHardwareUsageList.sort((a, b) => {
            return b.sumMemUsage - a.sumMemUsage;
        });
    } else if (paramCpuOrMem === HARDWARE_TYPE.NETWORK) {
        newHardwareUsageList.sort((a, b) => {
            return b.sumRecvBytes - a.sumRecvBytes;
        });
    } else if (paramCpuOrMem === HARDWARE_TYPE.DISK) {
        newHardwareUsageList.sort((a, b) => {
            return b.sumDiskUsage - a.sumDiskUsage;
        });
    }
    return newHardwareUsageList;
}


/*
export const getCpuMetricData = async () => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

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
                    "name": "zzaaa",
                    "version": "1"
                },
                "cluster_inst_key": {
                    "cluster_key": {
                        "name": "qqqaaa"
                    },
                    "cloudlet_key": {
                        "name": "frankfurt-eu",
                        "operator_key": {
                            "name": "TDG"
                        }
                    }
                }
            },
            "selector": "cpu",
            "last": 5
        },
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + store.userToken

        },
        timeout: 15 * 1000
    }).then(async response => {
        return response.data;
    }).catch(e => {
        alert(e)
    })

    return responseRslt;

}*/

/*


export const renderLineChart_recharts = (cpuUsageList, hardwareType: string) => {
    const data = [
        {name: '2019-01 ', cpu4: 40, cpu3: 24, cpu2: 54, cpu1: 12},
        {name: '2019-02 ', cpu4: 41, cpu3: 25, cpu2: 34, cpu1: 18},
        {name: '2019-03 ', cpu4: 42, cpu3: 22, cpu2: 24, cpu1: 32},
        {name: '2019-04 ', cpu4: 43, cpu3: 15, cpu2: 14, cpu1: 52},
    ];


    console.log('cpuUsageList===>', cpuUsageList);


    return (
        <div>
            <LineChart width={900} height={600} data={data}
                       style={{backgroundColor: 'black'}}
                       margin={{top: 30, right: 100, left: 20, bottom: 30}}>
                <XAxis dataKey="name" tick={{fill: 'white', fontSize: 20}}/>
                <YAxis tick={{fill: 'white', fontSize: 20}}/>
                <Tooltip/>
                <Legend/>
                <Line type="monotone" dataKey="cpu1" stroke="#8884d8" strokeWidth={5}
                      activeDot={{r: 10, strokeWidth: 5,}}/>
                <Line type="monotone" dataKey="cpu2" stroke="#82ca9d" strokeWidth={5}
                      activeDot={{r: 10, strokeWidth: 5,}}/>
                <Line type="monotone" dataKey="cpu3" stroke="red" strokeWidth={5} activeDot={{r: 10, strokeWidth: 5,}}/>
                <Line type="monotone" dataKey="cpu4" stroke="blue" strokeWidth={5}
                      activeDot={{r: 10, strokeWidth: 5,}}/>

            </LineChart>
        </div>
    );
}
*/


/*

export const renderLineChart2 = () => {
    return (
        <Chart
            className={'barChart'}
            chartType="Line"
            width={'450px'}
            height={'250px'}
            loader={<div>Loading Chart</div>}
            data={[
                ["Year", "CPUI1", "CPUI2", 'CPUI3', 'CPUI4', 'CPUI5'],
                ["2004", 1000, 400, 500, 700, 1500],
                ["2005", 1170, 460, 600, 700, 1200],
                ["2006", 660, 1120, 700, 800, 1500],
                ["2007", 1030, 540, 800, 900, 2500]
            ]}
            options={{
                chart: {
                    title: "  ",
                    subtitle: ""
                },
                //X
                hAxis: {
                    title: 'asdasdasd',
                    titleTextStyle: {
                        fontName: "Times",
                        fontSize: 30,
                        fontStyle: "normal",
                        color: 'white'
                    },
                    minValue: 0,
                    textStyle: {
                        color: "white"
                    },
                    gridlines: {
                        color: "grey"
                    },
                    baselineColor: 'grey',
                    textPosition: 'in',

                },
                //Y축
                vAxis: {
                    textPosition: 'in',
                    title: 'asdasdasdasd',
                    titleTextStyle: {
                        fontSize: 25,
                        fontStyle: "normal",
                        color: 'white'
                    },
                    textStyle: {
                        color: "white",
                        fontSize: 18,
                    },

                },

            }}
        />
    )
}
*/

/*

export const renderLineGraph_Plot = () => {
    let boxWidth = window.innerWidth / 10 * 2.8;

    return (
        <Plot
            style={{
                //backgroundColor: 'transparent',
                backgroundColor: 'black',
                overflow: 'hidden',
                color: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: -25

            }}
            data={
                [
                    {
                        x: [1, 2, 3, 4],
                        y: [10, 15, 13, 17],
                        type: 'scatter'
                    },
                    {
                        x: [1, 2, 3, 4],
                        y: [16, 5, 11, 9],
                        type: 'scatter'
                    },
                    {
                        x: [1, 2, 3, 4],
                        y: [4, 3, 13, 19],
                        type: 'scatter'
                    },
                    {
                        x: [1, 2, 3, 4],
                        y: [5, 4, 7, 29],
                        type: 'scatter'
                    },
                    {
                        x: [1, 2, 3, 4],
                        y: [5, 5, 6, 9],
                        type: 'scatter'
                    },

                ]

            }
            layout={{
                height: 360,
                width: boxWidth,
                margin: {
                    l: 50,
                    r: 15,
                    b: 35,
                    t: 30,
                    pad: 0
                },
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                color: 'white',
                xaxis: {
                    showgrid: false,
                    zeroline: true,
                    showline: true,
                    mirror: 'ticks',
                    gridcolor: 'rgba(255,255,255,.05)',
                    gridwidth: 1,
                    zerolinecolor: 'rgba(255,255,255,0)',
                    zerolinewidth: 1,
                    linecolor: 'rgba(255,255,255,.2)',
                    linewidth: 1,
                    color: 'rgba(255,255,255,.4)',
                    domain: [0, 0.94]
                },
                yaxis: {
                    showgrid: true,
                    zeroline: false,
                    showline: true,
                    mirror: 'ticks',
                    ticklen: 5,
                    tickcolor: 'rgba(0,0,0,0)',
                    gridcolor: 'rgba(255,255,255,.05)',
                    gridwidth: 1,
                    zerolinecolor: 'rgba(255,255,255,0)',
                    zerolinewidth: 1,
                    linecolor: 'rgba(255,255,255,.2)',
                    linewidth: 1,
                    color: 'rgba(255,255,255,.4)',
                    //rangemode: 'tozero'
                },
            }}
        />
    )
}
*/
