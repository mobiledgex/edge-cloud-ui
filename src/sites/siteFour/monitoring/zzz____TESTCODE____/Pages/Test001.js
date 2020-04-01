import {hot} from "react-hot-loader/root";
import React from 'react';
import {Bubble} from 'react-chartjs-2';
import 'chartjs-plugin-streaming';


type Props = {};
type State = {};


export default hot(
    class Test001 extends React.Component<Props, State> {

        render() {
            return (

                <div style={{height: 500, width: 1000}}>
                    <Bubble
                        data={{
                            datasets: [{
                                label: 'demo',
                                backgroundColor: 'rgba(75,192,192,1)',
                                data: []
                            }]
                        }}
                        options={{
                            plugins: {
                                streaming: {
                                    onRefresh: function (chart) {
                                        chart.data.datasets[0].data.push({
                                            x: Date.now(),
                                            y: Math.random() * 100,
                                            r: 5
                                        });
                                    },
                                    delay: 500,
                                    refresh: 1000,
                                    frameRate: 30,
                                    duration: 3600000 // 3600000 = 1hour
                                }
                            },
                            scales: {
                                xAxes: [{
                                    type: 'realtime'
                                }]
                            }
                        }}
                    />
                </div>
            )
        }
    }
)




