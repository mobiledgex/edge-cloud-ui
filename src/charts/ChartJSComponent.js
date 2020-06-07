import React from "react";
import { Line, Bar } from 'react-chartjs-2';
import { generateUniqueId } from "../services/serviceMC";

const ChartJSComponent = defaultProps => {
    const [id, setId] = React.useState();
    const [idx, setIdx] = React.useState(generateUniqueId());
    const [data, setData] = React.useState();
    const [vWidth, setVWidth] = React.useState(defaultProps.width);
    const [vHeight, setVHeight] = React.useState(defaultProps.height);
    const initialize = (_idx, id) => {
        console.log("20200607 idx=", _idx, ": id=", id);
        const myChart = {
            type: "bar",
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: "# of Votes",
                    data: [12, 19, 3, 5, 2, 3],
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
        };
        setData(myChart.data);
    };

    React.useEffect(() => {
        if (defaultProps.data !== data) {
            // setVHeight(defaultProps.height);
            // setVWidth(defaultProps.width);
            setTimeout(() => initialize(idx, defaultProps.id, defaultProps.data), 1000);
        }
        setId(defaultProps.data);
    }, [defaultProps]);

    return (
        <Bar
            data={data}
            width={vWidth}
            height={vHeight}
            options={{ maintainAspectRatio: false }}
        />
    );
};
export default ChartJSComponent;
