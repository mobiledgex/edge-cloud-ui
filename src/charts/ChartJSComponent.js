import React from "react";
import Chart from "chart.js";
import { generateUniqueId } from "../services/serviceMC";

const ChartJSComponent = defaultProps => {
    const [id, setId] = React.useState();
    const [idx, setIdx] = React.useState(generateUniqueId());
    const [data, setData] = React.useState();
    const [vWidth, setVWidth] = React.useState(defaultProps.width);
    const [vHeight, setVHeight] = React.useState(defaultProps.height);
    const [type, setType] = React.useState(defaultProps.type);

    const initialize = (_id, _data) => {
        const chartData = [];
        const ctx = document.getElementById("chartCanv_" + idx).getContext("2d");
        const myChart = new Chart(ctx, {
            type: type === "scatter" ? "line" : type,
            data: {
                labels: _data[0].x,
                datasets: [{
                    label: "# of Votes",
                    data: _data[0].y,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(255, 159, 64, 0.2)"
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)"
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
            }
        });
    };

    React.useEffect(() => {
        console.log("20200607 defaultProps.type =", defaultProps.type, ":    id = ", id, ":w=", defaultProps.width, ":h=", defaultProps.height);
        if (defaultProps.data !== data) {
            setData(defaultProps.data);
            setTimeout(() => initialize(defaultProps.id, defaultProps.data, defaultProps.type), 500);
        }
        // setVWidth(defaultProps.width);
        // setVHeight(defaultProps.height);
        setId(defaultProps.id);
        setType(defaultProps.type);
    }, [defaultProps]);

    return (
        <canvas id={`chartCanv_${idx}`} width={vWidth} height={vHeight} />
    );
};
export default ChartJSComponent;
