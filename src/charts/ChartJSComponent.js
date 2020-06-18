import React from "react";
import { Line, Bar, HorizontalBar, Chart } from "react-chartjs-2";
import { sumBy, isEqual, sortBy } from "lodash";
import Popper from "@material-ui/core/Popper";
import { generateUniqueId } from "../services/serviceMC";
import { removeDuplicate } from "../utils";
import randomColor from "../libs/randomColor";

export const valueAsPercentage = (value, total) => `${(value / total) * 100}%`;
let myRef = null;
const getRandomColors = (_count, _alpha) => {
    const colors = randomColor({ hue: "blue", count: _count, alpha: _alpha, format: "rgba" });
    return colors;
};
/* chart : https://codepen.io/jamiecalder/pen/NrROeB */

const columnDataColors = [{
    backgroundColor: "rgba(181, 185, 193, 1)",
    hoverBackgroundColor: "rgba(181, 185, 193, .7)",
    borderColor: "rgba(181, 185, 193, 1)",
}, {
    backgroundColor: "rgb(65,180,211,1)",
    hoverBackgroundColor: "rgb(65,180,211,.7)",
    borderColor: "rgb(65,180,211,1)",
}];
// const testdata = [{
//     data: [3, 2, 2, 2],
//     backgroundColor: "rgba(63,103,126,1)",
//     hoverBackgroundColor: "rgba(50,90,100,1)"
// }, {
//     data: [0, 1, 0, 1],
//     backgroundColor: "rgba(63,203,226,1)",
//     hoverBackgroundColor: "rgba(46,185,235,1)"
// }]


const listItemStyle = {
    color: "#fff",
    listStyle: "none",
    textAlign: "left",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "10px 20px",
    cursor: "pointer"
};

const getOptions = params => ({
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: false
            }
        }],
        xAxes: [{
            type: "time",
            distribution: "linear",
            time: {
                displayFormats: {
                    second: "hh:mm:ss"
                },
                stepSize: 2
            }
        }]
    },
    layout: {
        padding: {
            left: 0,
            right: 0,
            top: 10,
            bottom: 0
        }
    },
    legend: {
        display: false
    },
    responsive: true,
    redraw: true,
    maintainAspectRatio: false,
    animation: {
        onComplete() {
            const { chartInstance } = myRef;
            const { ctx } = chartInstance;
            ctx.textAlign = "left";
            ctx.font = "11px Open Sans";
            ctx.fillStyle = "#dcdcdc";
            ctx.fillText("GBs", 40, 5);

        }
    },
});
const getOptionsBar = params => ({
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: false
            }
        }]
    },
    legend: {
        display: false
    },
    responsive: true,
    redraw: true,
    maintainAspectRatio: false,
});
/** stacked horizontal bar chart * */
const getOptionsStackBar = params => (
    {
        tooltips: {
            enabled: false
        },
        hover: {
            animationDuration: 0
        },
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontFamily: "'Open Sans Bold', sans-serif",
                    fontSize: 11
                },
                scaleLabel: {
                    display: false
                },
                gridLines: {
                    display: true,
                    color: "rgba(255,255,255,.2)",
                    zeroLineColor: "rgba(255,255,255,.2)",
                    zeroLineWidth: 1
                },
                stacked: true
            }],
            yAxes: [{
                gridLines: {
                    display: false,
                    color: "rgba(255,255,255,.2)",
                    zeroLineColor: "rgba(255,255,255,.2)",
                    zeroLineWidth: 0
                },
                ticks: {
                    fontFamily: "'Open Sans Bold', sans-serif",
                    fontSize: 11
                },
                stacked: true
            }]
        },
        legend: {
            display: false
        },

        // animation: {
        //     onComplete() {
        //         const { chartInstance } = myRef;
        //         const { ctx } = chartInstance;
        //         ctx.textAlign = "left";
        //         ctx.font = "11px Open Sans";
        //         ctx.fillStyle = "#fff";
        //
        //         Chart.helpers.each(params.forEach(function (dataset, i) {
        //             const meta = chartInstance.controller.getDatasetMeta(i);
        //             let data = {};
        //             Chart.helpers.each(meta.data.forEach(function (bar, index) {
        //                 data = dataset.data[index];
        //                 if (i === 0) {
        //                     if (data > 0) ctx.fillText(data, bar._model.x + 5, bar._model.y + 4);
        //                 } else {
        //                     if (data > 0) ctx.fillText(data, bar._model.x - 10, bar._model.y + 4);
        //                 }
        //             }), this);
        //         }), this);
        //     }
        // },
        pointLabelFontFamily: "Quadon Extra Bold",
        scaleFontFamily: "Quadon Extra Bold",
    }
);


const ChartJSComponent = defaultProps => {
    const [id, setId] = React.useState();
    const [idx, setIdx] = React.useState(generateUniqueId());
    const [data, setData] = React.useState([]);
    const [initData, setInitData] = React.useState(false);
    const [vWidth, setVWidth] = React.useState(defaultProps.width);
    const [vHeight, setVHeight] = React.useState(defaultProps.height);
    const [type, setType] = React.useState(defaultProps.type);
    const [options, setOptions] = React.useState();
    const [legendDisplay, setLegendDisplay] = React.useState(false);
    const [legendList, setLegendList] = React.useState({});
    const [legendId, setLegendId] = React.useState("");
    const [legendOpen, setLegendOpen] = React.useState(false);
    const [randomColors, setRandomColors] = React.useState(getRandomColors(200, 0.7));
    const [randomColorsB, setRandomColorsB] = React.useState(getRandomColors(200, 1));
    const [legend, setLegend] = React.useState({ legend: <>no legend</> });
    const [anchorEl, setAnchorEl] = React.useState(null);

    const getInterpolate = (items, series) => {
        const interpoldata = [];
        series.map((sers, i) => {
            interpoldata[i] = null;
            const searched = items.x.indexOf(sers);
            if (searched > -1) interpoldata[i] = items.y[searched];
        });
        return interpoldata;
    };

    const getDataSet = (data, series, type) => (
        data.map((item, i) => ({
            label: item.name,
            data: getInterpolate(item, series),
            // backgroundColor: randomColors[i],
            backgroundColor: (type === "scatter") ? "transparent" : randomColors[i],
            // borderColor: randomColorsB[i],
            borderColor: randomColors[i],
            borderWidth: 1
        }))
    );

    const getSeriesLabels = data => {
        let compositSeries = [];
        data.map(series => {
            compositSeries = compositSeries.concat(series.x);
        });
        const removedDupl = removeDuplicate(compositSeries);
        return removedDupl;
    };

    const setChartRef = element => {
        myRef = element;
    };

    const handleLegendClick = datasetIndex => {
        const chart = myRef.chartInstance;
        chart.getDatasetMeta(datasetIndex).hidden = chart.getDatasetMeta(datasetIndex).hidden === null ? true : !chart.getDatasetMeta(datasetIndex).hidden;
        chart.update(); // re-draw chart to hide dataset
    };

    const makeColumnDataset = (_data) => {
        const dataset = _data.y.map((item, i) => (
            {
                label: i === 0 ? "OFF" : "ON",
                data: item,
                backgroundColor: columnDataColors[i].backgroundColor,
                hoverBackgroundColor: columnDataColors[i].hoverBackgroundColor,
                borderColor: columnDataColors[i].borderColor,
            }
        ));
        return dataset;
    };

    const initialize = (_id, _data, _type) => {
        setRandomColors(getRandomColors(_data.length, 0.7));
        setRandomColorsB(getRandomColors(_data.length, 1));
        let myChart = null;
        if (_type === "column") {
            myChart = {
                type: _type,
                data: {
                    labels: _data[0].x,
                    datasets: makeColumnDataset(_data[0])
                },
                options: getOptionsStackBar(makeColumnDataset(_data[0]))
            };
        } else {
            myChart = {
                type: (_type === "scatter") ? "line" : "bar",
                cubicInterpolationMode: "monotone",
                data: {
                    labels: getSeriesLabels(_data),
                    datasets: getDataSet(_data, getSeriesLabels(_data), _type)
                },
                options: (_type === "scatter") ? getOptions({ displayLegend: legendDisplay }) : getOptionsBar({ displayLegend: legendDisplay })
            };
        }

        console.log("20200617 color", myChart.data);
        setOptions(myChart.options);
        setData(myChart.data);
    };

    React.useEffect(() => {
        setId(defaultProps.id);
        setType(defaultProps.type);
        setInitData(false);
        if (isEqual(defaultProps.legendShow, legendDisplay) === false) {
            //
            setTimeout(() => {
                setLegendDisplay(defaultProps.legendShow);
                // const leg = generateLegend();
                // setLegend({ legend: leg });
                const legend = myRef.chartInstance.legend.legendItems;
                console.log("20200618 legend", legend);
                setLegend(legend);
                setLegendOpen(defaultProps.legendShow);
                setAnchorEl(defaultProps.legendShow ? defaultProps.legendInfo.target : null);
            }, 100);
        }
        //
    }, [defaultProps.id, defaultProps.type, defaultProps.legendShow, defaultProps.legendInfo]);

    React.useEffect(() => {
        const propData = defaultProps.data && defaultProps.data[defaultProps.id];
        console.log("20200618 props data in chartJScomponent = ", propData);
        if ((propData && propData.length > 0)) {
            // if (propData[0].x.length > 0 && !initData) {
            if (propData[0].x.length > 0) {
                setTimeout(() => {
                    initialize(defaultProps.id, propData, defaultProps.type);
                    setInitData(true);
                }, 200);
            }
        }
    }, [defaultProps.id, defaultProps.data]);

    React.useEffect(() => {
        if (!isNaN(defaultProps.width) && !isNaN(defaultProps.height)) {
            setVWidth(defaultProps.width);
            setVHeight(defaultProps.height);
            const chart = myRef.chartInstance;
            chart.canvas.id = defaultProps.id;
            chart.canvas.parentNode.width = defaultProps.width;
            chart.canvas.parentNode.height = defaultProps.height;
            chart.canvas.parentNode.style.width = `${defaultProps.width}px`;
            chart.canvas.parentNode.style.height = `${defaultProps.height - 30}px`;
        }
    }, [defaultProps.width, defaultProps.height]);

    const idLegend = legendOpen ? "legend-popper-" + legendId : undefined;

    return (
        <div className="chatContainer" style={{ position: "relative", height: vHeight, width: vWidth }}>
            {(type === "bar")
                ? <Bar
                    id="typeisBar"
                    ref={element => setChartRef(element)}
                    data={data}
                    width={null}
                    height={null}
                    options={options || { maintainAspectRatio: false }}
                />
                : (type === "column")
                    ? <HorizontalBar
                        id="typeisColumn"
                        ref={element => setChartRef(element)}
                        data={data}
                        width={null}
                        height={null}
                        options={options || { maintainAspectRatio: false }}
                    />
                    : <Line
                        id="typeisLine"
                        ref={element => setChartRef(element)}
                        data={data}
                        width={null}
                        height={null}
                        options={options || { maintainAspectRatio: false }}
                    />}
            <Popper
                className="chart_legend"
                id={idLegend}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
            >
                <div className="mt-8">
                    {legend.length
                        && legend.map(item => (
                            <div
                                key={item.datasetIndex}
                                className="chart_legend_item"
                                // style={listItemStyle}
                                onClick={() => handleLegendClick(item.datasetIndex)}
                            >
                                <div
                                    className="chart_legend_item_color"
                                    style={{
                                        backgroundColor: item.strokeStyle
                                    }}
                                />
                                {item.text}
                            </div>
                        ))}
                </div>
            </Popper>
        </div>
    );
};
export default ChartJSComponent;


/*
const backgroundColor = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)"
];
const borderColor = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)"
];
*/
