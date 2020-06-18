
import React from "react";
import Chart from "chart.js";

// Hook
const usePrevious = value => {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = React.useRef();

    // Store current value in ref
    React.useEffect(() => {
        ref.current = value;
    }, [value]); // Only re-run if value changes

    // Return previous value (happens before update in useEffect above)
    return ref.current;
};
const makeSpark = (_data, _time, props) => {
    const ctx = document.getElementById(`myChart_${props.method.key}`).getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 60);
    console.log("20200617 graph", _data, _time, ctx);

    // Add three color stops
    gradient.addColorStop(0, "#6498FF");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: _time,
            datasets: [
                {
                    data: _data,
                    backgroundColor: gradient
                }
            ]
        },
        options: {
            responsive: false,
            legend: {
                display: false
            },
            elements: {
                line: {
                    borderColor: "#6498FF",
                    borderWidth: 1
                },
                point: {
                    radius: 0
                }
            },
            tooltips: {
                enabled: false
            },
            scales: {
                yAxes: [
                    {
                        display: false
                    }
                ],
                xAxes: [
                    {
                        display: false
                    }
                ]
            }
        }
    });
};

const RateOfMethods = defaultProps => {
    const [data, setData] = React.useState([0, 0, 0]);
    const [time, setTime] = React.useState([0, 0, 0]);
    const [name, setName] = React.useState("No Method");
    const [count, setCount] = React.useState(0);
    const [size, setsize] = React.useState({ width: 90, height: 50 });

    React.useEffect(() => {
        if (defaultProps.data && defaultProps.data.length > 0) {
            const countData = defaultProps.data[0];
            const countKeys = countData && countData.methods ? countData.methods : [];

            const countMethodData = [];
            countKeys.map(key => {
                const methodData = countData[key][0];
                if (methodData[Object.keys(methodData)[0]].y) {
                    const countValue = methodData[Object.keys(methodData)[0]].y;
                    const countTime = methodData[Object.keys(methodData)[0]].x;
                    countMethodData.push({ key, time: countTime, value: countValue });
                }
            });

            const countMethod = countMethodData[defaultProps.method.key] ? countMethodData[defaultProps.method.key] : null;
            setName((countMethod && countMethod.key) ? countMethod.key : "No Method");
            // ( countMethod && countMethod.key ) && setName(countMethod.key)
            setCount((countMethod && countMethod.value[0]) ? countMethod.value[0] : 0);
            // ( countMethod && countMethod.value[0] ) && setCount(countMethod.value[0])

            const graphData = (countMethod && countMethod.value) ? countMethod.value.reverse() : [0, 0, 0];
            const graphTime = (countMethod && countMethod.time) ? countMethod.time.reverse() : [0, 0, 0];

            makeSpark(graphData, graphTime, defaultProps);
        }

        if (defaultProps.data !== data) {
            // makeSpark();
        }
        setData(defaultProps.data);

        // setData(defaultProps.data);

        // Get the previous value (was passed into hook on last render)
        // const prevData = usePrevious(data);
    }, [defaultProps]);


    return (
        <div className="page_monitoring_rate_grid_contain">
            <div className="page_monitoring_rate_label">{name}</div>
            <div className="page_monitoring_rate_count">{count}</div>
            <div className="page_monitoring_rate_chart">
                <canvas id={`myChart_${defaultProps.method.key}`} color="#6498FF" width="90" height="50" />
            </div>
        </div>
    );
};

export default RateOfMethods;
