import React from "react";
import { Line, Bar } from "react-chartjs-2";
import { generateUniqueId } from "../services/serviceMC";
import { removeDuplicate } from "../utils";

const randomColors = [];
const getRandomColorHex = (count) => {
    const hex = "0123456789ABCDEF";
    let color = "#";
    for (let i = 1; i <= count; i++) {
        color += hex[Math.floor(Math.random() * 16)];
        randomColors.push(color);
    }
    console.log("20200608 random colors = ", randomColors);
    return color;
};
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

const getOptions = (params) => ({
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
        display: params.displayLegend
    }
});


const ChartJSComponent = defaultProps => {
    const [id, setId] = React.useState();
    const [idx, setIdx] = React.useState(generateUniqueId());
    const [data, setData] = React.useState();
    const [vWidth, setVWidth] = React.useState(defaultProps.width);
    const [vHeight, setVHeight] = React.useState(defaultProps.height);
    const [type, setType] = React.useState(defaultProps.type);
    const [options, setOptions] = React.useState();
    const [legendDisplay, setLegendDisplay] = React.useState(false);

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
            backgroundColor: backgroundColor[i],
            borderColor: borderColor[i],
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

    const initialize = (_id, _data, _type) => {
        console.log("20200607 _id = ", _id, ": _data = ", _data);
        getRandomColorHex(_data.length);
        const myChart = {
            type: "bar",
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
        if (defaultProps.data !== data) {
            console.log("20200608 defaultProps.data = ", defaultProps.data, ":", defaultProps.data[0], ": x length = ", defaultProps.data[0].x.length);
            if (defaultProps.data[0].x.length > 0) {
                setData(defaultProps.data);
                setTimeout(() => initialize(defaultProps.id, defaultProps.data, defaultProps.type), 500);
            }
        }
        setId(defaultProps.id);
        setType(defaultProps.type);
        setLegendDisplay(defaultProps.legendShow);
    }, [defaultProps]);

    return (
        <Line
            data={data}
            width={vWidth}
            height={vHeight}
            options={options || { maintainAspectRatio: false }}
        />
    );
};
export default ChartJSComponent;
