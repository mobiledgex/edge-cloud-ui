import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { sumBy, isEqual, sortBy } from "lodash";
import Popper from "@material-ui/core/Popper";
import { generateUniqueId } from "../services/serviceMC";
import { removeDuplicate } from "../utils";
import randomColor from "../libs/randomColor";

export const valueAsPercentage = (value, total) => `${(value / total) * 100}%`;

const getRandomColors = (_count, _alpha) => {
    const colors = randomColor({ hue: "blue", count: _count, alpha: _alpha });
    return colors;
};

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
    legend: {
        display: false
    },
    responsive: true,
    redraw: true,
    maintainAspectRatio: false,
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

let myRef = null;
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
    const [legendId, setLegendId] = React.useState('');
    const [legendOpen, setLegendOpen] = React.useState(false);
    const [randomColors, setRandomColors] = React.useState(getRandomColors(200, 0.5));
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

    const getDataSet = (data, series) => (
        data.map((item, i) => ({
            label: item.name,
            data: getInterpolate(item, series),
            backgroundColor: randomColors[i],
            borderColor: randomColorsB[i],
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

    const initialize = (_id, _data, _type) => {

        setRandomColors(getRandomColors(_data.length, 0.5));
        setRandomColorsB(getRandomColors(_data.length, 1));
        const myChart = {
            type: (_type === "scatter") ? "line" : "bar",
            cubicInterpolationMode: "monotone",
            data: {
                labels: getSeriesLabels(_data),
                datasets: getDataSet(_data, getSeriesLabels(_data))
            },
            options: (_type === "scatter") ? getOptions({ displayLegend: legendDisplay }) : getOptionsBar({ displayLegend: legendDisplay })
        };
        console.log("20200607 make chart data  = ", myChart);
        setOptions(myChart.options);
        setData(myChart.data);

    };

    React.useEffect(() => {
        setId(defaultProps.id);
        setType(defaultProps.type);

        if (isEqual(defaultProps.legendShow, legendDisplay) === false) {
            //
            setTimeout(() => {
                setLegendDisplay(defaultProps.legendShow);
                // const leg = generateLegend();
                // setLegend({ legend: leg });
                const legend = myRef.chartInstance.legend.legendItems;
                setLegend(legend);
            }, 500);
        }
        //
    }, [defaultProps.id, defaultProps.type, defaultProps.legendShow]);

    React.useEffect(() => {
        setLegendId(defaultProps.legendInfo.id);
        if (id === legendId) {
            setLegendOpen(defaultProps.legendInfo.open);
            setAnchorEl(legendOpen ? defaultProps.legendInfo.target : null)
            console.log('20200610 legend', legendId, legendOpen, anchorEl)
        }

    }, [defaultProps.legendInfo]);

    React.useEffect(() => {
        console.log("20200608 propData defaultProps.data isEqual == == ==  = default data = ", defaultProps.data, ": id = ", defaultProps.id);
        const propData = defaultProps.data && defaultProps.data[defaultProps.id];
        if ((propData && propData.length > 0)) {
            console.log("20200608 propData = ", propData);
            if (propData[0].x.length > 0 && !initData) {
                setInitData(true);
                setTimeout(() => {
                    initialize(defaultProps.id, propData, defaultProps.type);
                }, 2000);
            }
        }
    }, [defaultProps.id, defaultProps.data]);

    React.useEffect(() => {
        console.log("20200613 canvas size = ", defaultProps, isNaN(defaultProps.width), isNaN(defaultProps.height));
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
                                        backgroundColor: item.fillStyle
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


const testdata = {
    labels: ['January'],
    datasets: [
        {
            label: 'January',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [65]
        }
    ]
};
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
