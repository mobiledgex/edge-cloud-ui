
import React from "react";
import Chart from "chart.js";

// Hook
const usePrevious = (value) => {
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

const RateOfMethods = defaultProps => {
    const [data, setData] = React.useState();
    const makeSpark = () => {
        const ctx = document.getElementById('myChart').getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 60);

        // Add three color stops
        gradient.addColorStop(0, '#7ed8ff');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        data: [435, 321, 532, 801, 1231, 1098, 732, 321, 451, 482, 513, 397],
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
                        borderColor: '#7ed8ff',
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

    }


    React.useEffect(() => {
        // Get the previous value (was passed into hook on last render)
        // const prevData = usePrevious(data);
        console.log("20200604 rate of method = ", defaultProps.data, ":", data);
        if (defaultProps.data !== data) {
            makeSpark();
        }
        setData(defaultProps.data);
    }, [defaultProps]);
    return (
        <div style={{ width: "100%", height: "100%", overflow: 'auto' }}>
            <div className='page-monitoring_circle-chart'>
                <div className='page-monitoring_circle-chart_item'>
                    <div>Method Name</div>
                    <div>00</div>
                    <canvas id="myChart" width="90" height="50" />
                </div>
            </div>
        </div>
    );
};

export default RateOfMethods;
