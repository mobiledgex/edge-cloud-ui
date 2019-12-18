import React from 'react';
import {Dropdown, Grid, Menu} from 'semantic-ui-react';
import {Chart} from "react-google-charts";
import CircularProgress from "@material-ui/core/CircularProgress";
import FlexBox from "flexbox-react";
import Plot from "react-plotly.js";

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

export const renderBarGraph2 = () => {

    return (
        <Chart
            width={'430px'}
            height={'250px'}
            chartType="BarChart"
            loader={<div><CircularProgress style={{color: 'red', zIndex: 999999}}/></div>}
            data={[
                ["Element", "CPU USAGE", {role: "style"}],
                ["cpu 10", 10, "color: red",],
                ["cpu 20", 14, "color: #76A7FA",],
                ["cpu 30", 56, "color: blue",],
                ["cpu 412", 99, "color: green",],
                ["cpu 2030", 55, "color: yellow",],
            ]}
            options={{
                is3D: true,
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
                        fontName: "Times",
                        fontSize: 25,
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
                    baselineColor: 'grey'
                },
                //Y축
                vAxis: {
                    title: '',
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
        <div className="App">
            <Chart
                width={'455px'}
                height={'250px'}
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
                            color: "#d91e48"
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
                        top: 0,
                        width: "100%",
                        height: "80%"
                    },
                    fontName: "Roboto",
                    fontColor: 'white',
                    backgroundColor: '#404040',
                }}
                graph_id="PieChart"
                legend_toggle
            />
        </div>
    );
}


export const renderGrid = () => {
    let boxWidth = window.innerWidth / 10 * 2.55;
    return (
        <FlexBox style={{
            flexDirection: 'column',
            height: 260,
            width: boxWidth,
            backgroundColor: 'blue'
        }}>
            <FlexBox style={{flex: 50, height: 120}}>
                <FlexBox style={{
                    flex: 33,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    margin: 5,
                    backgroundColor: '#292929',
                    flexDirection: 'column',

                }}>
                    <FlexBox style={{
                        fontSize: 15,
                        color: '#fff',
                        marginTop: 10,
                    }}>
                        고경준App1
                    </FlexBox>
                    <FlexBox style={{
                        marginTop: 20,
                        fontSize: 50,
                        color: '#29a1ff',
                    }}>
                        1
                    </FlexBox>

                </FlexBox>
                <FlexBox style={{
                    flex: 33,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    margin: 5,
                    backgroundColor: '#292929',

                    flexDirection: 'column',

                }}>
                    <FlexBox style={{
                        fontSize: 15,
                        color: '#fff',
                        marginTop: 10,
                    }}>
                        고경준App2
                    </FlexBox>
                    <FlexBox style={{
                        marginTop: 20,
                        fontSize: 50,
                        color: '#29a1ff',
                    }}>
                        2
                    </FlexBox>

                </FlexBox>
                <FlexBox style={{
                    flex: 33,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    margin: 5,
                    backgroundColor: '#292929',

                    flexDirection: 'column',

                }}>
                    <FlexBox style={{
                        fontSize: 15,
                        color: '#fff',
                        marginTop: 10,
                    }}>
                        고경준App23
                    </FlexBox>
                    <FlexBox style={{
                        marginTop: 20,
                        fontSize: 50,
                        color: '#29a1ff',
                    }}>
                        3
                    </FlexBox>
                </FlexBox>
            </FlexBox>
            <FlexBox style={{flex: 50}}>
                <FlexBox style={{
                    flex: 33,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    margin: 5,
                    backgroundColor: '#292929',

                    flexDirection: 'column',

                }}>
                    <FlexBox style={{
                        fontSize: 15,
                        color: '#fff',
                        marginTop: 10,
                    }}>
                        고경준App4
                    </FlexBox>
                    <FlexBox style={{
                        marginTop: 20,
                        fontSize: 50,
                        color: '#29a1ff',
                    }}>
                        5
                    </FlexBox>

                </FlexBox>
                <FlexBox style={{
                    flex: 33,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    margin: 5,
                    backgroundColor: '#292929',

                    flexDirection: 'column',

                }}>
                    <FlexBox style={{
                        fontSize: 15,
                        color: '#fff',
                        marginTop: 10,
                    }}>
                        고경준App5
                    </FlexBox>
                    <FlexBox style={{
                        marginTop: 20,
                        fontSize: 50,
                        color: '#fff',
                    }}>
                        0
                    </FlexBox>

                </FlexBox>
                <FlexBox style={{
                    flex: 33,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    margin: 5,
                    backgroundColor: '#292929',

                    flexDirection: 'column',

                }}>
                    <FlexBox style={{
                        fontSize: 15,
                        color: '#fff',
                        marginTop: 10,
                    }}>
                        asdas213123
                    </FlexBox>
                    <FlexBox style={{
                        marginTop: 20,
                        fontSize: 50,
                        color: '#fff',
                    }}>
                        0
                    </FlexBox>
                </FlexBox>
            </FlexBox>
        </FlexBox>
    )
}

export const renderLineGraph_Plot = () => {
    let boxWidth = window.innerWidth / 10 * 2.55;

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
                marginTop: 0

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
                margin: {
                    l: 50,
                    r: 15,
                    b: 35,
                    t: 5,
                    pad: 0
                },
                height: 250,
                width: boxWidth,
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





