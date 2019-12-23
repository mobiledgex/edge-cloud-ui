import React from 'react';
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import Plot from "../../node_modules/react-plotly.js/react-plotly";
import axios from "axios";
import qs from "qs";
import FormatComputeInst from "./formatter/formatComputeInstance";
import '../sites/PageMonitoring.css';
import {getAppInstanceHealth, makeFormForAppInstance} from "./SharedService";
import {CHART_COLOR_LIST, HARDWARE_TYPE, RECENT_DATA_LIMIT_COUNT, REGION} from "../shared/Constants";
import {Line as ReactChartJs} from 'react-chartjs-2';
import FlexBox from "flexbox-react";
import Lottie from "react-lottie";
import BubbleChart from "@weknow/react-bubble-chart-d3";
import {notification} from "antd";
import PageMonitoring2 from "../sites/PageMonitoring2";
import type {TypeAppInstance} from "../shared/Types";

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


export const filterCpuOrMemUsageByCloudLet = (cpuOrMemUsageList, pCloudLet) => {

    let filteredCpuOrMemUsageList = cpuOrMemUsageList.filter((item) => {
        if (item.instance.Cloudlet === pCloudLet) {
            return item;
        }
    });

    return filteredCpuOrMemUsageList
}


export const filterAppInstanceListByCloudLet = (appInstanceList, pCloudLet = '') => {

    let instanceListFilteredByCloudlet = []
    appInstanceList.map(item => {
        if (item.Cloudlet === pCloudLet) {
            instanceListFilteredByCloudlet.push(item);
        }
    })


    return instanceListFilteredByCloudlet;
}


export const filterAppInstanceListByClusterInst = (appInstanceList, pCluster = '') => {

    let instanceListFilteredByClusterInst = []
    appInstanceList.map(item => {
        if (item.ClusterInst === pCluster) {
            instanceListFilteredByClusterInst.push(item);
        }
    })
    return instanceListFilteredByClusterInst;
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


    console.log('cpuUsageList22===>', usageList);

    let chartDataList = [];
    chartDataList.push(["Element", hardwareType.toUpperCase() + " USAGE", {role: "style"}])
    for (let index = 0; index < usageList.length; index++) {

        if (index < 5) {
            let barDataOne = [usageList[index].instance.AppName.toString().substring(0, 10) + "...", hardwareType === 'cpu' ? usageList[index].sumCpuUsage : usageList[index].sumMemUsage, CHART_COLOR_LIST[index]]
            chartDataList.push(barDataOne);
        }

    }

    let _height = window.innerHeight * 0.33 + 50

    return (
        <Chart
            width={window.innerWidth * 0.31}
            height={250}
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
                chartArea: {left: 100, right: 150, top: 20, width: "50%", height: "80%"},
                legend: {position: 'none'},//우측 Data[0]번째 텍스트를 hide..
                //xc춧
                hAxis: {
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
                    format: hardwareType === HARDWARE_TYPE.CPU ? '#\'%\'' : '#\' byte\'',
                    baselineColor: 'grey',
                    //out', 'in', 'none'.
                },
                //Y축
                vAxis: {
                    title: '',
                    titleTextStyle: {
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
                width={165}
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
            <FlexBox style={{
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
            </FlexBox>
            <FlexBox AlignItems={'center'} alignSelf={'flex-start'}
                     style={{flexDirection: 'column', marginTop: 10, marginLeft: -3}}>


                {/*todo: disk usage 표시 부분*/}
                {/*<div style={{color: 'white', textAlign: 'center', }}>900/1000MB</div>*/}

                <div style={{color: 'white', textAlign: 'center', fontSize: 12}}>{appInstanceOne.AppName}</div>

                {/*__row__1*/}
                <FlexBox style={{marginTop: 15, height: 21,}}>
                    <FlexBox style={{
                        marginLeft: 5,
                        backgroundColor: 'black',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 10
                    }}>
                        <div style={{color: 'white', textAlign: 'center', marginLeft: 10}}>DISK</div>
                    </FlexBox>
                    <FlexBox style={{
                        marginLeft: 0,
                        backgroundColor: 'grey',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 10
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
                        fontSize: 10
                    }}>
                        <div style={{color: 'white', textAlign: 'center', marginLeft: 10}}>vCPU</div>
                    </FlexBox>
                    <FlexBox style={{
                        marginLeft: 0,
                        backgroundColor: 'grey',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 10
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
                        fontSize: 10
                    }}>
                        <div style={{color: 'white', textAlign: 'center', marginLeft: 10}}>Regions</div>
                    </FlexBox>
                    <FlexBox style={{
                        marginLeft: 0,
                        backgroundColor: 'grey',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 10
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
                        fontSize: 10
                    }}>
                        <div style={{color: 'white', textAlign: 'center', marginLeft: 10}}>Cloutlet</div>
                    </FlexBox>
                    <FlexBox style={{
                        marginLeft: 0,
                        backgroundColor: 'grey',
                        flex: .5,
                        alignItems: 'center',
                        fontSize: 10
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
 * @todo: toChunkArray for TopLeftGrid
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
 * @todo : app instance SPEC 더 낳은것이 (큰것이) priorityValue가 높다....
 * @param flavor
 * @returns {number}
 */
export const instanceFlavorToPriorityValue = (flavor: string) => {
    let priorityValue = 0;
    if (flavor === 'm4.medium') {
        priorityValue = 1
    } else if (flavor === 'x1.medium') {
        priorityValue = 2
    } else if (flavor === 'x1.large') {
        priorityValue = 3
    } else {
        priorityValue = 0
    }
    return priorityValue;
}


/**
 * todo: @weknow/react-bubble-chart-d3로 버블차트를 그린다..
 * todo: render a bubble chart with https://github.com/weknowinc/react-bubble-chart-d3
 * @returns {*}
 */
export const renderBubbleChart = (_this: PageMonitoring2) => {

    /*[
        {label: 'app1', value: 1},
        {label: 'app2', value: 5},
        {label: 'app3', value: 12},
        {label: 'app4', value: 3},
        {label: 'app5', value: 12},
        {label: 'app6', value: 3},
        {label: 'app7', value: 12},
        {label: 'app8', value: 3},
        {label: 'app9', value: 3},
        {label: 'app10', value: 3},
        {label: 'app11', value: 3},

    ]*/

    let appInstanceList = _this.state.appInstanceList


    console.log('appInstanceList2222====>', appInstanceList)

    let chartData = [];
    appInstanceList.map((item: TypeAppInstance) => {

        console.log('Flavor222====>', item.Flavor);
        chartData.push({
            //label: item.Flavor+ "-"+ item.AppName.substring(0,5),
            label: item.AppName.toString().substring(0, 10) + "...",
            value: instanceFlavorToPriorityValue(item.Flavor),
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
                        zoom: appInstanceList.length <= 4 ? 0.60 : 0.75,
                        offsetX: 0.10,
                        offsetY: appInstanceList.length <= 4 ? 0.05 : -0.02,
                    }}
                    width={355}
                    height={243}
                    padding={0} // optional value, number that set the padding between bubbles
                    showLegend={false} // optional value, pass false to disable the legend.
                    legendPercentage={30} // number that represent the % of with that legend going to use.
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
                        size: 8,
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
 * @param cpuUsageListPerInstanceSortByUsage
 * @param hardwareType
 * @returns {*}
 */
export const renderLineChart_react_chartjs = (cpuUsageListPerInstanceSortByUsage, hardwareType: string) => {
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
            dateTimeList.push(seriesValues[j]["0"]);
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
                fill: false,
                lineTension: 0.1,
                backgroundColor: CHART_COLOR_LIST[i],
                borderColor: CHART_COLOR_LIST[i],
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
                data: cpuUsageSetList[i],
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

    let width = window.innerWidth * 0.255
    let height = 500 + 50;

    let options = {
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
 * @todo: PlotJS를 이용해서 라인차트를 랜더링
 * @returns {*}
 */
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
                    {colSizeArray.map((item) =>
                        <div className='page_monitoring_grid_box'>
                            <FlexBox style={{
                                fontSize: 15,
                                color: '#fff',
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
export const fetchAppInstanceList = async (paramRegionArrayList: any = ['EU', 'US']): Array<TypeAppInstance> => {
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
 * @desc : Using the app instance list, create a list of total cpu usage for the instance.
 * @param appInstanceList
 * @returns {Promise<Array>}
 */
export const makeCpuOrMemUsageListPerInstance = async (appInstanceList: any, paramCpuOrMem: HARDWARE_TYPE = HARDWARE_TYPE.CPU, recentDataLimitCount: number) => {

    let cpuUsageListPerOneInstance = []
    for (let index = 0; index < appInstanceList.length; index++) {

        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;

        //todo: 레퀘스트를 요청할 데이터 FORM형식을 만들어 준다.
        let instanceInfoOneForm = makeFormForAppInstance(appInstanceList[index], paramCpuOrMem, store.userToken, recentDataLimitCount)

        //console.log('formOne====>', instanceInfoOneForm);
        //console.log('appInstanceList===>', appInstanceList[index]);

        let appInstanceHealth = await getAppInstanceHealth(instanceInfoOneForm);
        //console.log(`appInstanceHealth====>${index}`,)

        cpuUsageListPerOneInstance.push({
            instanceData: appInstanceList[index],
            appInstanceHealth: appInstanceHealth,
        });

    }

    let newCpuOrMemUsageListPerOneInstance = [];

    for (let index = 0; index < cpuUsageListPerOneInstance.length; index++) {
        if (cpuUsageListPerOneInstance[index].appInstanceHealth.data[0].Series != null) {

            let columns = cpuUsageListPerOneInstance[index].appInstanceHealth.data[0].Series[0].columns;
            let values = cpuUsageListPerOneInstance[index].appInstanceHealth.data[0].Series[0].values;

            let sumCpuUsage = 0;
            let sumMemUsage = 0;
            for (let jIndex = 0; jIndex < values.length; jIndex++) {
                //console.log('itemeLength===>',  values[i][4]);

                if (paramCpuOrMem === 'cpu') {
                    sumCpuUsage = sumCpuUsage + values[jIndex][4];
                } else {
                    sumMemUsage = sumCpuUsage + values[jIndex][5];
                }

            }

            //todo: CPU/MEM 사용량 평균값을 계산한다.....
            sumCpuUsage = sumCpuUsage / cpuUsageListPerOneInstance.length;
            sumMemUsage = Math.ceil(sumMemUsage / cpuUsageListPerOneInstance.length);

            console.log('sumMemUsage===>', sumMemUsage);

            newCpuOrMemUsageListPerOneInstance.push({
                instance: cpuUsageListPerOneInstance[index].instanceData,
                columns: columns,
                values: values,
                sumCpuUsage: sumCpuUsage,
                sumMemUsage: sumMemUsage,
            });
        } else {
            newCpuOrMemUsageListPerOneInstance.push({
                instance: cpuUsageListPerOneInstance[index].instanceData,
                columns: '',
                values: '',
                sumCpuUsage: 0,
                sumMemUsage: 0,
            });
        }

    }
    //@todo :##################################
    //@todo : Sort cpu usage in reverse order.
    //@todo :##################################
    if (paramCpuOrMem === 'cpu') {
        newCpuOrMemUsageListPerOneInstance.sort((a, b) => {
            return b.sumCpuUsage - a.sumCpuUsage;
        });
    } else {//mem
        newCpuOrMemUsageListPerOneInstance.sort((a, b) => {
            return b.sumMemUsage - a.sumMemUsage;
        });
    }

    return newCpuOrMemUsageListPerOneInstance;
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
