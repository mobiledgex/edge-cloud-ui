import React from 'react';
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import Plot from "../../node_modules/react-plotly.js/react-plotly";
import axios from "axios";
import qs from "qs";
import FormatComputeInst from "./formatter/formatComputeInstance";
import '../sites/PageMonitoring.css';
import {getAppInstanceHealth, makeFormForAppInstance} from "./SharedService";
import {HARDWARE_TYPE} from "../shared/Constants";
import CanvasJSReact from '../assets/canvasjs.react';
import {Brush, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, Legend} from "recharts";
import {Line as ReactChartJs} from 'react-chartjs-2';
import FlexBox from "flexbox-react";

const {CanvasJSChart} = CanvasJSReact


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

export const renderBarGraph_Google = (usageList: any, hardwareType: string = 'cpu') => {

    console.log('cpuUsageList===>', usageList);

    let colorList = ["color: #79BF14", "color: yellow", "color: red", "color: green", "color: blue"];

    let chartDataList = [];
    chartDataList.push(["Element", "CPU USAGE", {role: "style"}])
    //for (let index in cpuUsageList) {
    for (let index = 0; index < 5; index++) {
        let barDataOne = [usageList[index].instance.AppName.toString().substring(0, 10) + "...", hardwareType === 'cpu' ? usageList[index].sumCpuUsage : usageList[index].sumMemUsage, colorList[index]]
        chartDataList.push(barDataOne);
    }


    return (
        <Chart
            width={window.innerWidth * 0.33}
            height={window.innerHeight * 0.33 + 50}
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
                chartArea: {width: '50%',},
                legend: {position: 'none'},//우측 Data[0]번째 텍스트를 hide..
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

export const renderPieChart2_Google = () => {

    return (
        <div className="pieChart">
            <Chart
                width={window.innerWidth * 0.33}
                height={window.innerHeight * 0.33 + 50}
                chartType="PieChart"
                data={[
                    ["Age", "Weight"], ["a", 30], ["b", 40], ['c', 30]
                ]}
                options={{
                    title: "",
                    pieHole: 1.0,
                    slices: [
                        {
                            color: "#2BB673"
                        },
                        {
                            color: "red"
                        },
                        {
                            color: "#007fad"
                        },
                        {
                            color: "#e9a227"
                        }
                    ],
                    legend: {
                        position: "bottom",
                        alignment: "center",
                        textStyle: {
                            color: "233238",
                            fontSize: 14
                        }
                    },
                    tooltip: {
                        showColorCode: true
                    },
                    chartArea: {
                        left: 0,
                        top: 25,
                        width: "100%",
                        height: "65%"
                    },
                    fontName: "Roboto",
                    fontColor: 'white',
                    backgroundColor: 'black',
                }}
                graph_id="PieChart"
                legend_toggle
            />
        </div>
    );
}

function toChunkArray(myArray: any, chunkSize: any): any {
    let results = [];
    while (myArray.length) {
        results.push(myArray.splice(0, chunkSize));
    }
    return results;
}

export const renderPlaceHolder = () => {

    let boxWidth = window.innerWidth / 10 * 4.55;
    return (
        <div className='page_monitoring_grid_box_blank2'>
            <CircularProgress style={{zIndex: 999999999, color: '#79BF14'}}/>
        </div>
    )
}

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

export const renderLineChart_react_chartjs = (cpuUsageListPerInstanceSortByUsageDesc, hardwareType: string) => {

    console.log('itemeLength===>', cpuUsageListPerInstanceSortByUsageDesc);


    console.log('itemeLength===>', cpuUsageListPerInstanceSortByUsageDesc);

    console.log('itemeLength===>', cpuUsageListPerInstanceSortByUsageDesc);

    let instanceAppName = ''
    let instanceNameList = [];
    let cpuUsageSetList = []
    let dateList = []
    for (let i in cpuUsageListPerInstanceSortByUsageDesc) {
        let values = cpuUsageListPerInstanceSortByUsageDesc[i].values

        instanceAppName = cpuUsageListPerInstanceSortByUsageDesc[i].instance.AppName
        let usageList = [];

        for (let j in values) {

            let usageOne = 0;
            if (hardwareType === HARDWARE_TYPE.CPU) {
                usageOne = values[j]["4"];
            } else {
                usageOne = values[j]["5"];
            }

            usageList.push(usageOne);
            dateList.push(values[j]["0"]);
        }

        instanceNameList.push(instanceAppName)
        cpuUsageSetList.push(usageList);
    }


    console.log('instanceNameList===>', instanceNameList);
    console.log('cpuUsageSetList===>', cpuUsageSetList);

    let colorList = ['red', 'blue', 'green', 'orange', 'pink']

    let finalDataSets = [];

    for (let i in cpuUsageSetList) {
        //@todo: top5 만을 추린다
        if (i < 5) {
            let datasetsOne = {
                label: instanceNameList[i],
                fill: false,
                lineTension: 0.1,
                backgroundColor: colorList[i],
                borderColor: colorList[i],
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

            finalDataSets.push(datasetsOne)
        }

    }

    //@todo: last를 100개로 (최근데이타100개)  설정 했으므로 날짜를 100개로 잘라준다
    let newDateList = []
    for (let i in dateList) {
        if (i < 100) {
            newDateList.push(dateList[i])
        }

    }

    const data = {
        labels: newDateList, //todo:하단(X)축에 랜더링 되는 DateList.(LabelList)
        datasets: finalDataSets //todo: 렌더링할 데이터셋
    };


    console.log('cpuUsageList===>', cpuUsageListPerInstanceSortByUsageDesc);

    let width = window.innerWidth * 0.33
    let height = 500 + 50;
    return (
        <div>
            <ReactChartJs width={width} height={height} data={data} options={{}}/>
        </div>
    );
}


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


//param1 -->ALl
//param2 --> [EU,US]
/**
 * @todo : fetch App Instance List
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

        /*//
        let recentDataLimitCount = 100;*/

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

    //console.log('cpuUsageList====>', cpuUsageListPerOneInstance);
    let newCpuOrMemUsageListPerOneInstance = [];
    //for (let i in cpuUsageListPerOneInstance) {

    for (let index = 0; index < cpuUsageListPerOneInstance.length; index++) {
        if (cpuUsageListPerOneInstance[index].appInstanceHealth.data[0].Series != null) {
            //console.log('itemeLength===>', cpuUsageListPerOneInstance[i].appInstanceHealth.data[0].Series[0].values);

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
    } else {
        newCpuOrMemUsageListPerOneInstance.sort((a, b) => {
            return b.sumMemUsage - a.sumMemUsage;
        });
    }

    return newCpuOrMemUsageListPerOneInstance;
}
