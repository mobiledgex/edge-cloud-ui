
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
    const [name, setName] = React.useState('Method');
    const [count, setCount] = React.useState(0);
    const [size, setsize] = React.useState({width:90, height:50});

    const makeSpark = () => {
        const ctx = document.getElementById(`myChart_${defaultProps.method.key}`).getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 60);

        // Add three color stops
        gradient.addColorStop(0, '#6498FF');
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
                        borderColor: '#6498FF',
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


        let countData = defaultProps.data ? defaultProps.data[0] : null;
        let countKeys = countData && countData.methods? countData.methods : [];

        let countMethodData = [];
        countKeys.map( key => {
            let methodData = countData[key][0];
            if (methodData[Object.keys(methodData)[0]].y) {
                const countValue = methodData[Object.keys(methodData)[0]].y;
                countMethodData.push({key: key, value: countValue});
            }
        })

        let countMethod = countMethodData[defaultProps.method.key]? countMethodData[defaultProps.method.key] : null;
        setName(countMethod && countMethod.key? countMethod.key : 'No Method')
        setCount(countMethod && countMethod.value[0]? countMethod.value[0] : 0)


        // Get the previous value (was passed into hook on last render)
        // const prevData = usePrevious(data);
        if (defaultProps.data !== data) {
            makeSpark();
        }
        setData(defaultProps.data);


    }, [defaultProps]);

    return (
        <div className='page_monitoring_rate_grid_contain'>
            <div className='page_monitoring_rate_label'>{name}</div>
            <div className='page_monitoring_rate_count'>{count}</div>
            <div className='page_monitoring_rate_chart'>
                <canvas id={`myChart_${defaultProps.method.key}`} color="#6498FF" width="90" height="50" />
            </div>
        </div>
    );
};

export default RateOfMethods;
