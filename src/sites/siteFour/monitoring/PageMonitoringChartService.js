import React from 'react';
import '../../../css/pages/PageMonitoring.css';
import {toast} from "react-semantic-toasts";
import {CHART_COLOR_LIST, HARDWARE_TYPE} from "../../../shared/Constants";
import {HorizontalBar} from "react-chartjs-2";
import {Bar as RBar, BarChart, BarLabel, BarSeries, LinearXAxis, LinearYAxis, LinearYAxisTickSeries} from "reaviz";
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import FlexBox from "flexbox-react";
import {Styles} from "./PageMonitoringService";
import Plot from "react-plotly.js";

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




