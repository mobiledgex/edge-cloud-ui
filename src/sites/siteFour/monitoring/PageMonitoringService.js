import React from 'react';
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import {formatData} from "../../../services/formatter/formatComputeInstance";
import './PageMonitoring.css';
import {CHART_COLOR_LIST, HARDWARE_TYPE, NETWORK_TYPE, RECENT_DATA_LIMIT_COUNT, REGION} from "../../../shared/Constants";
import {HorizontalBar, Line as ReactChartJs} from 'react-chartjs-2';
import FlexBox from "flexbox-react";
import Lottie from "react-lottie";
import BubbleChart from "../../../components/BubbleChart";
import {TypeAppInstance} from "../../../shared/Types";
import {Bar as RBar, BarChart, BarLabel, BarSeries, LinearXAxis, LinearYAxis, LinearYAxisTickSeries} from "reaviz";
import Plot from "react-plotly.js";
import PageMonitoring from "./PageMonitoring";
import {showToast} from "./MonitoringChartService";


export const getIPAddress = () => {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        console.log('ifce=', iface)
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            console.log('add = ', alias.address)
            if (alias.family === 'IPv4' && !alias.internal || alias.address === '127.0.0.1')
                return alias.address;
        }
    }

    return '0.0.0.0';
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


export const covertToComparableDate = (paramDate) => {
    let arrayDate = paramDate.toString().split("-");
    let compareableFullDate = arrayDate[0] + arrayDate[1] + arrayDate[2]
    return compareableFullDate

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


export const makeFormForAppInstance = (instanceDataOne, valid = "*", token, fetchingDataNo = 20) => {

    return (
        {
            "token": token,
            "params": {
                "region": instanceDataOne.Region,
                "appinst": {
                    "app_key": {
                        "developer_key": {"name": instanceDataOne.OrganizationName},
                        "name": instanceDataOne.AppName.toLowerCase().replace(/\s+/g, ''),
                        "version": instanceDataOne.Version
                    },
                    "cluster_inst_key": {
                        "cluster_key": {"name": instanceDataOne.ClusterInst},
                        "cloudlet_key": {
                            "name": instanceDataOne.Cloudlet,
                            "operator_key": {"name": instanceDataOne.Operator}
                        }
                    }
                },
                "selector": valid,
                //"last": 25
                "last": fetchingDataNo,
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


export const renderPieGraph = () => {
    return (

        <div style={{backgroundColor: 'transparent',}}>
            <Plot
                style={{
                    backgroundColor: '#373737',
                    overflow: 'hidden',
                    color: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: 0
                }}
                data={[{
                    values: [30, 40, 30],
                    labels: ['Residential', 'Non-Residential', 'Utility'],
                    type: 'pie'
                }]}
                layout={{
                    height: 350,
                    width: 300,
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    color: 'white',

                }}
            />
        </div>
    )
}


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
 *
 * @param usageOne
 * @param hardwareType
 * @returns {string}
 */
export const renderUsageLabelByType = (usageOne, hardwareType) => {
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
}

export const renderUsageByType = (usageOne, hardwareType) => {
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
        //usageOne.sumSendBytes
        return usageOne.sumRecvBytes
    }

    if (hardwareType === HARDWARE_TYPE.SEND_BYTE) {
        //usageOne.sumSendBytes
        return usageOne.sumSendBytes
    }
}

/**
 * @todo: Bar Graph Rendering By Google Chart
 * @todo: 바그래프 랜더링 By Google Chart
 * @param usageList
 * @param hardwareType
 * @returns {*}
 */
export const renderBarGraph = (usageList, hardwareType, _this) => {
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

    console.log('chartDataList===>', chartDataList);

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


export const renderBarGraphForNetwork = (_this) => {

    console.log('networkBarChartData===>', _this.state.networkBarChartData);

    return (
        <Chart
            width={window.innerWidth * 0.25}
            height={330}
            chartType="BarChart"
            loader={<div><CircularProgress style={{color: 'red', zIndex: 999999}}/></div>}
            data={_this.state.networkBarChartData}
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
                    format: '0.##\' byte\'',
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
export const renderBubbleChart = (_this: PageMonitoring, hardwareType: string, pBubbleChartData: any) => {
    let appInstanceList = _this.state.appInstanceList;

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
                        zoom: appInstanceList.length <= 4 ? 0.45 : 0.75,
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
                        color: 'black',
                        weight: 'bold',
                    }}
                    valueFont={{
                        //family: 'Righteous',
                        size: 12,
                        color: '#525252',
                        //weight: 'bold',
                        fontStyle: 'italic',
                    }}
                    labelFont={{
                        //family: 'Righteous',
                        size: 14,
                        color: 'black',
                        weight: 'bold',
                    }}
                    //Custom bubble/legend click functions such as searching using the label, redirecting to other page
                    bubbleClickFun={async (label, index) => {

                        /*  await _this.setState({
                              currentAppInst: label,
                              currentGridIndex: index,
                          })
                          await _this.handleSelectBoxChanges(_this.state.currentRegion, _this.state.currentCloudLet, _this.state.currentCluster, label)*/

                    }}

                    legendClickFun={async (label, index) => {

                        await _this.setState({
                            currentAppInst: label,
                            currentGridIndex: index,
                        })
                        await _this.handleSelectBoxChanges(_this.state.currentRegion, _this.state.currentCloudLet, _this.state.currentCluster, label)

                    }}
                    data={pBubbleChartData}
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
export const renderLineChart = (_this: PageMonitoring, hardwareUsageList: Array, hardwareType: string) => {
    console.log('hardwareType===>', hardwareType);

    let instanceAppName = ''
    let instanceNameList = [];
    let usageSetList = []
    let dateTimeList = []
    for (let i in hardwareUsageList) {
        let seriesValues = hardwareUsageList[i].values

        instanceAppName = hardwareUsageList[i].instance.AppName
        let usageList = [];

        console.log('seriesValues===>', seriesValues);

        for (let j in seriesValues) {

            let usageOne = 0;
            if (hardwareType === HARDWARE_TYPE.CPU) {
                usageOne = seriesValues[j]["6"];
            } else if (hardwareType === HARDWARE_TYPE.RECV_BYTE) {
                usageOne = seriesValues[j]["13"];//receivceBytes
            } else if (hardwareType === HARDWARE_TYPE.SEND_BYTE) {
                usageOne = seriesValues[j]["12"]; //sendBytes
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

    const lineChartData = (canvas) => {

        let gradientList = makeGradientColor(canvas, height);

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
                height={331}
                data={lineChartData}
                options={options}
            />
        </div>
    );


}

export const makeNetworkBarData = (networkUsageList, hwType) => {
    let chartDataList = [];
    chartDataList.push(["Element", hwType + " USAGE", {role: "style"}, {role: 'annotation'}])

    for (let index = 0; index < networkUsageList.length; index++) {
        if (index < 5) {
            let barDataOne = [
                networkUsageList[index].instance.AppName.toString().substring(0, 10) + "...",
                hwType === HARDWARE_TYPE.RECV_BYTE ? networkUsageList[index].sumRecvBytes : networkUsageList[index].sumSendBytes,
                CHART_COLOR_LIST[index],
                hwType === HARDWARE_TYPE.RECV_BYTE ? networkUsageList[index].sumRecvBytes : networkUsageList[index].sumSendBytes,
            ]
            chartDataList.push(barDataOne);
        }
    }

    console.log('BarchartDataList===>', chartDataList);

    return chartDataList;

}

export const makeNetworkLineChartData = (filteredNetworkUsageList, pHardwareType = HARDWARE_TYPE.RECV_BYTES) => {
    let instanceAppName = ''
    let instanceNameList = [];
    let usageSetList = []
    let dateTimeList = []


    for (let i in filteredNetworkUsageList) {
        let seriesValues = filteredNetworkUsageList[i].values

        console.log('seriesValues===>', seriesValues);

        instanceAppName = filteredNetworkUsageList[i].instance.AppName
        let usageList = [];

        for (let j in seriesValues) {

            let usageOne = 0;
            if (pHardwareType === HARDWARE_TYPE.RECV_BYTES) {
                console.log('pHardwareType===>', pHardwareType);
                usageOne = seriesValues[j]["12"];//receivceBytes -> index12

            } else {
                usageOne = seriesValues[j]["13"]; //sendBytes -> index13
                console.log('usageOne===>', usageOne);
            }
            usageList.push(usageOne);
            let dateOne = seriesValues[j]["0"];
            dateOne = dateOne.toString().split("T")

            dateTimeList.push(dateOne[1]);
        }

        instanceNameList.push(instanceAppName)
        usageSetList.push(usageList);
    }

    console.log('makeNetworkLineChartDatausageList===>', usageSetList);


    //@todo: CUST LIST INTO RECENT_DATA_LIMIT_COUNT
    let newDateTimeList = []
    for (let i in dateTimeList) {
        if (i < RECENT_DATA_LIMIT_COUNT) {
            let splitDateTimeArrayList = dateTimeList[i].toString().split(".");
            let timeOne = splitDateTimeArrayList[0].replace("T", "T");
            newDateTimeList.push(timeOne.toString())//.substring(3, timeOne.length))
        }

    }
    let finalSeriesDataSets = [];
    for (let i in usageSetList) {
        //@todo: top5 만을 추린다
        if (i < 5) {
            let datasetsOne = {
                label: instanceNameList[i],
                borderColor: CHART_COLOR_LIST[i],
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

    let lineChartData = {
        labels: newDateTimeList,
        datasets: finalSeriesDataSets,
    }

    console.log('instanceNameList===>', instanceNameList);
    console.log('finalSeriesDataSets===>', finalSeriesDataSets);

    return lineChartData;

}


export const renderLineChartForNetWork = (_this: PageMonitoring, networkType: string) => {

    let width = window.innerWidth * 0.28


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
    //todo :#############################
    //todo : networkChartData rendering
    //todo :############################

    return (
        <div>
            <ReactChartJs
                width={width}
                height={320}
                data={_this.state.networkChartData}
                options={options}
                redraw={true}
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
export const makeGradientColor = (canvas, height) => {
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
export const renderSixGridInstanceOnCloudletGrid = (appInstanceListSortByCloudlet, _this) => {
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
 * @param usageList
 * @returns {*}
 */
export const filterUsageListByRegion = (pRegion, usageList) => {
    if (pRegion === REGION.ALL) {
        return usageList;
    } else {
        let filteredUsageListByRegion = usageList.filter((item) => {
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

/**
 *
 * @param serviceBodyForAppInstanceOneInfo
 * @returns {Promise<AxiosResponse<any>>}
 */
export const requestAppLevelMetrics = async (serviceBodyForAppInstanceOneInfo: any) => {
    let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    let result = await axios({
        url: '/api/v1/auth/metrics/app',
        method: 'post',
        data: serviceBodyForAppInstanceOneInfo['params'],
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
    return result;
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
                sumCpuUsage: sumCpuUsage / RECENT_DATA_LIMIT_COUNT,
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
                sumMemUsage: Math.ceil(sumMemUsage / RECENT_DATA_LIMIT_COUNT),
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
                sumDiskUsage: Math.ceil(sumDiskUsage / RECENT_DATA_LIMIT_COUNT),
                values: diskSeries.values,
                appName: appName,
            })

            //@todo###############################
            //@todo NetworkUSageList
            //@todo##############################
            let networkSeries = series["0"]
            networkSeries.values.map(item => {
                let recvBytesOne = item[12];//recvBytesOne
                sumRecvBytes += recvBytesOne;
                let sendBytesOne = item[13];//sendBytesOne
                sumSendBytes += sendBytesOne;
            })

            networkUsageList.push({
                instance: item.instanceData,
                columns: networkSeries.columns,
                sumRecvBytes: Math.ceil(sumRecvBytes / RECENT_DATA_LIMIT_COUNT),
                sumSendBytes: Math.ceil(sumSendBytes / RECENT_DATA_LIMIT_COUNT),
                values: networkSeries.values,
                appName: appName,
            })

            console.log('networkSeries===>', networkSeries.values)

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


    console.log('networkUsageList===>', networkUsageList);

    return matrixedUsageList;
}


export const Styles = {
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
    header00001:{
        fontSize: 21,
        marginLeft:5,
        color: 'white',
    },
    div001: {
        fontSize: 25,
        color: 'white',
    },
    dropDown: {
        //minWidth: 150,
        width: 190,
    },
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

