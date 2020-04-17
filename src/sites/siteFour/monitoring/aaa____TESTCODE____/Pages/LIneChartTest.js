import {hot} from "react-hot-loader/root";
import React from 'react';
import {Line} from 'react-chartjs-2';
import 'chartjs-plugin-streaming';


type Props = {};
type State = {};
const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            fill: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [65, 59, 80, 81, 56, 55, 40, 12, 15, 19, 20]
        }
    ]
};


export default hot(
    class LIneChartTest extends React.Component<Props, State> {

        render() {
            return (

                <div style={{height: 500, width: 1000}}>
                    <Line ref="chart" data={data}
                         /* options={{
                              plugins: {
                                  streaming: {
                                      onRefresh: function (chart) {
                                          chart.data.labels.push('sdkjf');
                                          chart.data.datasets[0].data.push(50);
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
                        */
                    />
                    {/*<Bubble
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
                    />*/}
                </div>
            )
        }
    }
)




