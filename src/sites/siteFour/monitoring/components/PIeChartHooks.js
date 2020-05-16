import React, {useEffect, useState} from 'react';
import '../common/MonitoringStyles.css'
import {DonutChart} from "@carbon/charts-react";
import "./CarbonChart.css";

export default function PIeChartHooks(props) {
    const [eventLogList, setEventLogList] = useState([]);

    useEffect(() => {
    }, []);
    const colors = ["#CC0000", "#009900", "#0000FF", "#FFFF00"];
    let data = [
        {
            "group": "vCpu",
            "value": 20000,
            "fillColors": ["#CC0000"],
        },
    ]


    const chartData = {
        labels: ["Red", "Green", "Blue", "Yellow"],
        datasets: [
            {
                label: "Dataset 1",
                fillColors: colors,
                // data: [14, 74, 29, 20]
                data: [301, 64, 295, 20]
            }
        ]
    };


    return (
        <>
            <div style={{backgroundColor: 'black'}}>

                <div style={{display: 'flex', marginRight: 10,}}>
                    <DonutChart
                        data={chartData}
                        options={{
                            "title": "Donut",
                            "resizable": true,
                            "donut": {
                                "center": {
                                    "label": "고경준 천재님"
                                }
                            },
                            "height": "250px",
                            'legend': {
                                enabled: false,
                            },
                            accessibility: false,
                            getIsFilled: true,
                            legendClickable: true,
                            containerResizable: true,
                            colors: colors,
                            center: {
                                number: 123,
                                label: "Color test"
                            }
                        }}>
                    </DonutChart>
                </div>

            </div>
        </>
    )

}
