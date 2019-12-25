import React from 'react';
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import qs from "qs";
import FormatComputeInst from "./formatter/formatComputeInstance";
import '../sites/PageMonitoring.css';
import {getAppInstanceHealth, makeFormForAppInstance} from "./SharedService";
import {
    BORDER_CHART_COLOR_LIST,
    CHART_COLOR_LIST, CHART_COLOR_LIST2,
    HARDWARE_TYPE,
    RECENT_DATA_LIMIT_COUNT,
    REGION
} from "../shared/Constants";
import {Line as ReactChartJs} from 'react-chartjs-2';
import FlexBox from "flexbox-react";
import Lottie from "react-lottie";
import BubbleChart from "@weknow/react-bubble-chart-d3";
import PageMonitoring2 from "../sites/PageMonitoring2";
import type {TypeAppInstance} from "../shared/Types";


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
export const renderBarGraph = (usageList: any, hardwareType: string = HARDWARE_TYPE.CPU, _this) => {

    let chartDataList = [];
    chartDataList.push(["Element", hardwareType.toUpperCase() + " USAGE", {role: "style"}, {role: 'annotation'}])

    function renderUsageData(usageList: Array, index: number) {

        let usageDataOne = 0
        if (hardwareType === HARDWARE_TYPE.CPU) {
            usageDataOne = usageList[index].sumCpuUsage
        }

        if (hardwareType === HARDWARE_TYPE.MEM) {
            usageDataOne = usageList[index].sumMemUsage
        }

        if (hardwareType === HARDWARE_TYPE.DISK) {
            usageDataOne = usageList[index].sumDiskUsage
        }

        if (hardwareType === HARDWARE_TYPE.NETWORK) {
            usageDataOne = usageList[index].sumRecvBytes
        }

        return usageDataOne
    }

    function renderUsageAnnotation(usageList: Array, index: number) {

        let usageDataAnnotationOne = 0
        if (hardwareType === HARDWARE_TYPE.CPU) {
            usageDataAnnotationOne = usageList[index].sumCpuUsage.toFixed(2) + "%"
        }
        if (hardwareType === HARDWARE_TYPE.MEM) {
            usageDataAnnotationOne = usageList[index].sumMemUsage.toFixed(2) + "%"
        }
        if (hardwareType === HARDWARE_TYPE.DISK) {
            usageDataAnnotationOne = usageList[index].sumDiskUsage.toFixed(2) + "Byte"
        }

        if (hardwareType === HARDWARE_TYPE.NETWORK) {
            usageDataAnnotationOne = usageList[index].sumRecvBytes.toFixed(2) + "Byte"
        }

        return usageDataAnnotationOne;
    }

    for (let index = 0; index < usageList.length; index++) {

        if (index < 5) {
            let barDataOne = [
                usageList[index].instance.AppName,
                renderUsageData(usageList, index),
                CHART_COLOR_LIST[index],
                renderUsageAnnotation(usageList, index),
            ]
            chartDataList.push(barDataOne);
        }

    }

    return (
        <Chart
            width={window.innerWidth * 0.48}
            height={540}
            chartType="BarChart"
            loader={<div><CircularProgress style={{color: 'red', zIndex: 999999}}/></div>}
            data={chartDataList}
            options={{

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
                chartArea: {
                    left: 100,
                    right: 150,
                    top: 20,
                    width: "50%",
                    height: "80%",
                    backgroundColor: {
                        //  'fill': '#F4F4F4',
                        'opacity': 100
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
                        fontStyle: "italic",
                        color: 'white'
                    },
                    minValue: 0,
                    textStyle: {
                        color: "white"
                    },
                    gridlines: {
                        color: "transparent"
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
                animation: {
                    duration: 300,
                    easing: 'out',
                    startup: true
                }
                //colors: ['green']
            }}

            // For tests
            rootProps={{'data-testid': '1'}}
        />
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
                        fontStyle: "italic",
                        color: 'white'
                    },
                    minValue: 0,
                    textStyle: {
                        color: "white"
                    },
                    gridlines: {
                        color: "transparent"
                    },
                    //format: hardwareType === HARDWARE_TYPE.CPU ? '#\'%\'' : '#\' byte\'',
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
                animation: {
                    duration: 90,
                    easing: 'out',
                    startup: true
                }
                //colors: ['green']
            }}

            // For tests
            rootProps={{'data-testid': '1'}}
        />
    );

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


    return (
        <div className="pieChart">
            <Chart
                width={260}
                height={120}

                chartType="PieChart"
                data={[
                    ["Age", "Weight"], ["app_A", 80], ["", 20]
                ]}

                options={{
                    pieHole: 0.8,
                    //is3D: true,
                    title: "",
                    chartArea: {left: 20, right: 20, top: 10, width: "30%", height: "80%"},
                    /* slices: [
                         {
                             color: "red"
                         },
                         {
                             color: "blue"
                         },
                         {
                             color: "#007fad"
                         },
                         {
                             color: "#e9a227"
                         },
                         {
                             color: "grey"
                         }
                     ],
                     */
                    pieSliceTextStyle: {
                        color: 'black',
                        fontSize: 22,
                    },
                    pieSliceText: 'none',
                    slices: newColorList,
                    legend: {
                        position: "none",
                        alignment: "center",
                        textStyle: {
                            color: "black",
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        showColorCode: true
                    },
                    fontName: "Roboto",
                    fontColor: 'black',
                    //backgroundColor: 'grey',
                    backgroundColor: 'black',
                }}
                graph_id="PieChart"
                legend_toggle
            >
            </Chart>
            {/*todo:파이그래프 중앙의 앱네임*/}
            {/*todo:파이그래프 중앙의 앱네임*/}
            {/*todo:파이그래프 중앙의 앱네임*/}
            {/*  <FlexBox style={{
                marginTop: 0,
                color: 'white',
                top: '65.5%',
                left: '26.2%',
                position: 'absolute',
                fontSize: 9,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {appInstanceOne.AppName.substring(0, 12)}
            </FlexBox>*/}
            <FlexBox AlignItems={'center'} alignSelf={'flex-start'}
                     style={{flexDirection: 'column', marginTop: 10, marginLeft: -3}}>


                {/*todo: disk usage 표시 부분*/}
                {/*<div style={{color: 'white', textAlign: 'center', }}>900/1000MB</div>*/}

                <div style={{color: 'white', textAlign: 'center', fontSize: 19}}>{appInstanceOne.AppName}</div>

                {/*__row__1*/}
                <FlexBox style={{marginTop: 15, height: 21,}}>
                    <FlexBox style={{
                        marginLeft: 5,
                        backgroundColor: 'black',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 15
                    }}>
                        <div style={{color: 'white', textAlign: 'center', marginLeft: 10}}>DISK</div>
                    </FlexBox>
                    <FlexBox style={{
                        marginLeft: 0,
                        backgroundColor: 'grey',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 15
                    }}>
                        <div style={{color: 'white', textAlign: 'center', marginLeft: 5}}>80</div>
                    </FlexBox>
                </FlexBox>

                {/*__row__2*/}
                <FlexBox style={{marginTop: 0, height: 21,}}>
                    <FlexBox style={{
                        marginLeft: 5,
                        backgroundColor: 'black',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 15
                    }}>
                        <div style={{color: 'white', textAlign: 'center', marginLeft: 10}}>vCPU</div>
                    </FlexBox>
                    <FlexBox style={{
                        marginLeft: 0,
                        backgroundColor: 'grey',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 15
                    }}>
                        <div style={{color: 'white', textAlign: 'center', marginLeft: 5}}>80</div>
                    </FlexBox>
                </FlexBox>

                {/*__row__3*/}
                <FlexBox style={{marginTop: 0, height: 21,}}>
                    <FlexBox style={{
                        marginLeft: 5,
                        backgroundColor: 'black',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 15
                    }}>
                        <div style={{color: 'white', textAlign: 'center', marginLeft: 10}}>Regions</div>
                    </FlexBox>
                    <FlexBox style={{
                        marginLeft: 0,
                        backgroundColor: 'grey',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 15
                    }}>
                        <div style={{color: 'white', textAlign: 'center', marginLeft: 5}}>
                            {appInstanceOne.Region}
                        </div>
                    </FlexBox>
                </FlexBox>

                {/*__row__4*/}
                <FlexBox style={{marginTop: 0, height: 21,}}>
                    <FlexBox style={{
                        marginLeft: 5,
                        backgroundColor: 'black',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 15
                    }}>
                        <div style={{color: 'white', textAlign: 'center', marginLeft: 10}}>Cloutlet</div>
                    </FlexBox>
                    <FlexBox style={{
                        marginLeft: 0,
                        backgroundColor: 'grey',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 15
                    }}>
                        <div
                            style={{
                                color: 'white',
                                textAlign: 'center',
                                marginLeft: 5
                            }}>{appInstanceOne.Cloudlet.toString().substring(0, 15) + "..."}</div>
                    </FlexBox>
                </FlexBox>

            </FlexBox>


        </div>
    );
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


    console.log('appInstanceList2222====>', appInstanceList)

    let chartData = [];
    appInstanceList.map((item: TypeAppInstance) => {

        console.log('Flavor222====>', item.Flavor);
        chartData.push({
            //label: item.Flavor+ "-"+ item.AppName.substring(0,5),
            label: item.AppName.toString().substring(0, 10) + "...",
            value: instanceFlavorToPerformanceValue(item.Flavor),
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
                <BubbleChart
                    className={'bubbleChart'}
                    graph={{
                        zoom: 0.90,
                        offsetX: 0.07,
                        offsetY: 0.07,
                    }}
                    width={500}
                    height={550}
                    padding={0}
                    showLegend={false}
                    legendPercentage={30}
                    legendFont={{
                        family: 'Arial',
                        size: 9,
                        color: 'yellow',
                        weight: 'bold',
                    }}
                    valueFont={{
                        family: 'Arial',
                        size: 15,
                        color: 'black',
                        weight: 'bold',
                    }}
                    labelFont={{
                        //family: 'Arial',
                        size: 12,
                        color: 'black',
                        weight: 'bold',
                    }}
                    //Custom bubble/legend click functions such as searching using the label, redirecting to other page
                    bubbleClickFun={(label) => {
                        /*
                        notification.success({
                              duration: 0.5,
                              message: label,
                          });
                        */
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
 * @TODO: react_chartjs를 이용해서 라인 차트를 랜더링.
 * @desc : React wrapper for Chart.js 2 Open for PRs and contributions!
 * @desc : https://github.com/jerairrest/react-chartjs-2
 * @param cpuUsageListPerInstanceSortByUsage
 * @param hardwareType
 * @returns {*}
 */
export const renderLineChart_real = (cpuUsageListPerInstanceSortByUsage, hardwareType: string) => {
    console.log('itemeLength===>', cpuUsageListPerInstanceSortByUsage);

    function renderUsageData(seriesValues: Array, index: number) {

        let seriesValueOne = 0
        if (hardwareType === HARDWARE_TYPE.CPU) {
            seriesValueOne = seriesValues[index]["4"];
        }

        if (hardwareType === HARDWARE_TYPE.MEM) {
            seriesValueOne = seriesValues[index]["5"];
        }

        if (hardwareType === HARDWARE_TYPE.DISK) {
            seriesValueOne = seriesValues[index]["5"];
        }

        if (hardwareType === HARDWARE_TYPE.NETWORK) {
            seriesValueOne = seriesValues[index]["6"]; //revceive Byte
            //seriesValueOne = seriesValues[index]["7"];//send Btye
        }
        return seriesValueOne
    }


    let instanceAppName = ''
    let instanceNameList = [];
    let cpuUsageSetList = []
    let dateTimeList = []
    for (let i in cpuUsageListPerInstanceSortByUsage) {
        let seriesValues = cpuUsageListPerInstanceSortByUsage[i].values

        instanceAppName = cpuUsageListPerInstanceSortByUsage[i].instance.AppName
        let usageList = [];

        for (let jIndex in seriesValues) {

            let usageOne = renderUsageData(seriesValues, jIndex)

            usageList.push(usageOne);
            let dateOne = seriesValues[jIndex]["0"];
            let arraySplitDate = dateOne.toString().split("T")
            dateTimeList.push(arraySplitDate[1]);


        }

        instanceNameList.push(instanceAppName)
        cpuUsageSetList.push(usageList);
    }


    let finalSeriesDataSets = [];

    for (let i in cpuUsageSetList) {
        //@todo: top5 만을 추린다
        if (i < 5) {
            let datasetsOne = {
                label: instanceNameList[i],
                fill: true,
                lineTension: 0.1,
                backgroundColor: hardwareType === HARDWARE_TYPE.MEM ? 'transparent' : CHART_COLOR_LIST[i],
                borderColor: BORDER_CHART_COLOR_LIST[i],
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(220,220,220,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(220,220,220,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: cpuUsageSetList[i],
                /*fillColor: "#FF1717",
                pointColor: "#da3e2f",*/
            }

            finalSeriesDataSets.push(datasetsOne)
        }

    }

    //@todo: last를 RECENT_DATA_LIMIT_COUNT개로 (최근데이타 RECENT_DATA_LIMIT_COUNT 개)  설정 했으므로 날짜를 RECENT_DATA_LIMIT_COUNT 개로 잘라준다
    let newDateTimeList = []
    for (let i in dateTimeList) {
        if (i < RECENT_DATA_LIMIT_COUNT) {
            let splitDateTimeArrayList = dateTimeList[i].toString().split(".");
            newDateTimeList.push(splitDateTimeArrayList[0].replace("T", "T"))
        }

    }


    const data = {
        labels: newDateTimeList, //todo:하단(X)축에 랜더링 되는 DateList.(LabelList)
        datasets: finalSeriesDataSets //todo: 렌더링할 데이터셋
    };


    console.log('cpuUsageList===>', cpuUsageListPerInstanceSortByUsage);

    let width = window.innerWidth * 0.40
    let height = 500 + 50;

    let options = {
        bezierCurve: true,
        datasetFill: true,
        maintainAspectRatio: false,
        responsive: true,
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
            }],
            xAxes: [{
                ticks: {
                    fontColor: 'white'
                },
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
        <div style={{display: 'flex', flexDirection: 'column', width: '100%',}}>
            {chunkedArraysOfColSize.map((colSizeArray, index) =>
                <div className='page_monitoring_grid' key={index.toString()}>
                    {colSizeArray.map((item, index) =>
                        <div className='page_monitoring_grid_box' style={{flex: colSizeArray.length === 1 && index === 0 && .326}}>
                            <FlexBox style={{
                                fontSize: 19,
                                fontFamily: 'Encode Sans Condensed',
                                color: '#fff',
                                marginTop: 10,
                            }}>
                                {item.name}
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
                {[1, 2, 3].map((item) =>
                    <div className='page_monitoring_grid_box_blank2' style={{backgroundColor: 'transprent'}}>
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

export const getInstHealth = async () => {

    let ServerUrl = 'https://' + window.location.hostname + ':3030';

    axios({
        method: 'post', //you can set what request you want to be
        url: ServerUrl + '/api/v1/auth/metrics/app',
        data: {
            "region": "EU",
            "appinst": {
                "app_key": {
                    "developer_key": {
                        "name": "testaaa"
                    },
                    "name": "jjjkkk",
                    "version": "1.0"
                },
                "cluster_inst_key": {
                    "cluster_key": {
                        "name": "kkkkkkk"
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
            "last": 3
        },
        headers: {
            Authorization: 'Bearer ' + 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzcyNDkyMzAsImlhdCI6MTU3NzE2MjgzMCwidXNlcm5hbWUiOiJtZXhhZG1pbiIsImVtYWlsIjoibWV4YWRtaW5AbW9iaWxlZGdleC5uZXQiLCJraWQiOjJ9.mXNokQljXGEWiskwNVC7TRIV64FxkosPMpcmw7cs6aWx1XjxPJvoJ4D3NZKJjnl-WswPUHo2PD4QcAoKyy8J8g'
        }
    }).then(res => {
        console.log('sdlkfsldkflksdflksdlfk===>', res);
    }).catch(e => {
        alert(e)
    })


}


/**
 * @desc : 앱인스턴스 리스트 이용해서 인스턴스에 대한 total cpu usage 리스트를 만든다..
 * @desc : Using the app instance list, create a list of total cpu usage for the instance.
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
