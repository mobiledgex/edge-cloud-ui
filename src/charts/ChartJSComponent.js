import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { sumBy, isEqual, sortBy } from "lodash";
import { generateUniqueId } from "../services/serviceMC";
import { removeDuplicate } from "../utils";
import randomColor from "../libs/randomColor";

export const valueAsPercentage = (value, total) => `${(value / total) * 100}%`;

const getRandomColors = (_count, _alpha) => {
    const colors = randomColor({ hue: "blue", count: _count, alpha: _alpha });
    console.log("20200608 random colors = ", colors);
    return colors;
};

const listItemStyle = {
    color: "#333",
    listStyle: "none",
    textAlign: "left",
    display: "flex",
    flexDirection: "row",
    margin: "8px",
    cursor: "pointer"
};
const getOptions = params => ({
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
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
    const [randomColors, setRandomColors] = React.useState(getRandomColors(200, 0.5));
    const [randomColorsB, setRandomColorsB] = React.useState(getRandomColors(200, 1));
    const [legend, setLegend] = React.useState({ legend: <>no legend</> });

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

    const handleLegendClick = (datasetIndex) => {
        const chart = myRef.chartInstance;
        chart.getDatasetMeta(datasetIndex).hidden =
            chart.getDatasetMeta(datasetIndex).hidden === null ? true : !chart.getDatasetMeta(datasetIndex).hidden;
        chart.update(); // re-draw chart to hide dataset
    };

    const initialize = (_id, _data, _type) => {
        console.log("20200607 _id = ", _id, ": _data = ", _data);
        setRandomColors(getRandomColors(_data.length, 0.5));
        setRandomColorsB(getRandomColors(_data.length, 1));
        const myChart = {
            type: (_type === "scatter") ? "line" : "bar",
            cubicInterpolationMode: "monotone",
            data: {
                labels: getSeriesLabels(_data),
                datasets: getDataSet(_data, getSeriesLabels(_data))
            },
            options: getOptions({ displayLegend: legendDisplay })
        };
        setData(myChart.data);
        setOptions(myChart.options);
    };

    React.useEffect(() => {
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

        setId(defaultProps.id);
        setType(defaultProps.type);
        setLegendDisplay(defaultProps.legendShow);
    }, [defaultProps.id, defaultProps.type, defaultProps.legendShow]);

    React.useEffect(() => {
        console.log("20200608 propData defaultProps.data isEqual == == ==  = default data = ", defaultProps.data, ": id = ", defaultProps.id);
        const propData = defaultProps.data && defaultProps.data[defaultProps.id];
        if ((propData && propData.length > 0)) {
            console.log("20200608 propData = ", propData);
            if (propData[0].x.length > 0 && !initData) {
                setData(propData);
                setInitData(true);
                setTimeout(() => {
                    initialize(defaultProps.id, propData, defaultProps.type);
                }, 2000);
            }
        }
    }, [defaultProps.id, defaultProps.data]);

    return (
        <>
            {(type === "bar")
                ?
                <Bar
                    ref={element => setChartRef(element)}
                    data={data}
                    width={vWidth}
                    height={vHeight}
                    options={options || { maintainAspectRatio: false }}
                />
                :
                <Line
                    ref={element => setChartRef(element)}
                    data={data}
                    width={vWidth}
                    height={vHeight}
                    options={options || { maintainAspectRatio: false }}
                />
            }
            {legendDisplay
                ? <div style={{ position: "absolute", left: 20, backgroundColor: "#4c4c4cdd", height: "300px" }}>
                    <ul className="mt-8">
                        {legend.length
                            && legend.map(item => (
                                <li
                                    key={item.datasetIndex}
                                    style={listItemStyle}
                                    onClick={() => handleLegendClick(item.datasetIndex)}>
                                    <div
                                        style={{
                                            marginRight: "8px",
                                            width: "20px",
                                            height: "20px",
                                            backgroundColor: item.fillStyle
                                        }}
                                    />
                                    {item.text}
                                </li>
                            ))}
                    </ul>
                </div>
                : null}
        </>
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
