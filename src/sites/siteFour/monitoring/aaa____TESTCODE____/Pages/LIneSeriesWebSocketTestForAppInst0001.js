import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import {hot} from "react-hot-loader/root";

const data2222 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            fill: false,
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
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My First dataset2',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(192,7,9,0.4)',
            borderColor: 'rgb(192,7,9)',
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
            data: [15, 12, 39, 40, 56, 55, 40]
        }
    ]
};

const data = {
    datasets: [
        {
            label: "Dataset 1",
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            lineTension: 0,
            borderDash: [8, 4],
            data: [15, 12, 39, 40, 56, 55, 40]

        }
    ]
};

const options = {
    scales: {
        xAxes: [
            {
                type: "realtime",
                realtime: {
                    onRefresh: function() {
                        data2222.datasets[0].data.push({
                            x: Date.now(),
                            y: Math.random() * 100
                        });
                    },
                    delay: 500
                }
            }
        ]
    }
};

export default hot(
    class LIneSeriesWebSocketTestForAppInst0001 extends Component {

        componentDidMount() {
            /*const {datasets} = this.refs.chart.chartInstance.data
            console.log(datasets[0].data);*/

            //this.getGrapHData();
        }

        getGrapHData(){
            let prefixUrl = (process.env.REACT_APP_API_ENDPOINT).replace('http', 'ws');
            console.log("onmessage==REACT_APP_API_ENDPOINT==>", prefixUrl)

            const webSocket = new WebSocket(`${prefixUrl}/ws/api/v1/auth/metrics/app`)

            let showAppInstClientRequestForm =  {
                "region": "EU",
                "appinst": {
                    "app_key": {
                        "organization": "MobiledgeX",
                        "name": "MEXPrometheusAppName",
                        "version": "1.0"
                    },
                    "cluster_inst_key": {
                        "cluster_key": {
                            "name": "mexdemo-stage"
                        },
                        "cloudlet_key": {
                            "name": "mexplat-stage-frankfurt-cloudlet",
                            "organization": "TDG"
                        }
                    }
                },
                "selector": "*",
                "last": 10,
                "starttime": "2019-04-02T13:44:00Z",
                "endtime": "2020-03-31T13:44:00Z"
            }

            let store = JSON.parse(localStorage.PROJECT_INIT);
            let token = store ? store.userToken : 'null';


            webSocket.onopen = () => {
                try{
                    webSocket.send(JSON.stringify({token: token}))
                    webSocket.send(JSON.stringify(showAppInstClientRequestForm))
                }catch (e) {
                    alert(e)
                }
            }


            webSocket.onmessage = async (event) => {

                let data = JSON.parse(event.data);

                console.log("onmessage===>", data);
            }


            webSocket.onclose = function (event) {
                //alert(event.toString())
                alert('onclose')
            };
        }


        render() {
            return (
                <div style={{backgroundColor:'white'}}>
                    <h2>Line Example</h2>
                    <div style={{width: 1500, height: 1500}}>
                        <Line data={data2222} options={options}  />
                    </div>

                </div>
            );
        }


    }
)
