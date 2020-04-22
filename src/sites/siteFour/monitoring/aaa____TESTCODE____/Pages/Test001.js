import React from 'react';
import {Bar, HorizontalBar, Line} from 'react-chartjs-2';
import 'chartjs-plugin-streaming';

import {Modal as AModal} from 'antd';
import {demoLineChartData, simpleGraphOptions} from "../../dev/PageDevMonitoringService";
import {CHART_COLOR_LIST} from "../../../../../shared/Constants";
import {Center2, ClusterCluoudletLable} from "../../PageMonitoringStyledComponent";
import {Dropdown} from "semantic-ui-react";
import {PageMonitoringStyles} from "../../PageMonitoringCommonService";


type Props = {};
type State = {};

const datas = {
    "labels": [
        "02:09:05",
        "02:08:54",
        "02:08:43",
        "02:08:32",
        "02:08:21",
        "02:08:10",
        "02:07:59",
        "02:07:48",
        "02:07:37",
        "02:07:25"
    ],
    "datasets": [
        {
            "label": "kyungjoncluster\n[mexplat-stage-frankfurt-cloudlet]",
            "radius": 0,
            "borderWidth": 3,
            "fill": true,
            "backgroundColor": {},
            "borderColor": 'blue',
            "lineTension": 0.5,
            "data": [
                11.864406773975695,
                0,
                1.6666666666666667,
                13.793103449314048,
                1.6666666595523971,
                18.33333334238786,
                1.6393442629208028,
                0,
                0,
                1.66666666796017
            ],
            "borderCapStyle": "round",
            "borderDash": [],
            "borderDashOffset": 0,
            "borderJoinStyle": "miter",
            "pointBorderColor": "transparent",
            "pointBackgroundColor": "white",
            "pointBorderWidth": 3,
            "pointHoverRadius": 1,
            "pointHoverBackgroundColor": "transparent",
            "pointHoverBorderColor": "transparent",
            "pointHoverBorderWidth": 1,
            "pointRadius": 1,
            "pointHitRadius": 1
        },
        {
            "label": "autoclustermobiledgexsdkdemo\n[berlin-test]",
            "radius": 0,
            "borderWidth": 3,
            //"fill": true,
            //"backgroundColor": 'red',
            "borderColor": 'red',
            "lineTension": 0.5,
            "data": [
                4.41,
                4.34,
                4.30,
                4.05,
                4.09,
                4.29,
                4.26,
                4.31,
                4.06,
                4.33,
            ],
            "borderCapStyle": "round",
            "borderDash": [],
            "borderDashOffset": 0,
            "borderJoinStyle": "miter",
            "pointBorderColor": "transparent",
            "pointBackgroundColor": "white",
            "pointBorderWidth": 3,
            "pointHoverRadius": 1,
            "pointHoverBackgroundColor": "transparent",
            "pointHoverBorderColor": "transparent",
            "pointHoverBorderWidth": 1,
            "pointRadius": 1,
            "pointHitRadius": 1
        },
        {
            "label": "autoclustermobiledgexsdkdemo\n[mexplat-stage-hamburg-cloudlet]",
            "radius": 0,
            "borderWidth": 3,
            "borderColor": 'green',
            "lineTension": 0.5,
            "data": [
                4.008507440653472,
                3.9099741319619934,
                3.964383495539593,
                3.8000007130947018,
                3.9775501725992015,
                4.010905227961133,
                4.176379323860045,
                4.079435168046737,
                3.9666762914461433,
                4.045433176264381
            ],
            "borderCapStyle": "round",
            "borderDash": [],
            "borderDashOffset": 0,
            "borderJoinStyle": "miter",
            "pointBorderColor": "transparent",
            "pointBackgroundColor": "white",
            "pointBorderWidth": 3,
            "pointHoverRadius": 1,
            "pointHoverBackgroundColor": "transparent",
            "pointHoverBorderColor": "transparent",
            "pointHoverBorderWidth": 1,
            "pointRadius": 1,
            "pointHitRadius": 1
        }
    ]
}


export default class Test001 extends React.Component<Props, State> {

    state = {
        type: 'line'
    }

    renderChart() {


        if (this.state.type === 'line') {
            return (
                <Line
                    width={window.innerWidth * 0.9}
                    ref="chart"
                    height={window.innerHeight * 0.35}
                    data={datas}
                    options={{
                        scales: {
                            yAxes: [{
                                id: 'A',
                                type: 'linear',
                                position: 'left',
                            }, {
                                id: 'B',
                                type: 'linear',
                                display: false,
                                scaleShowLabels: false,
                                ticks: {
                                    max: 1,
                                    min: 0
                                }

                            }]
                        }
                    }}
                />
            )
        }

        if (this.state.type === 'horizontal_bar') {

            return (
                <HorizontalBar
                    width={window.innerWidth * 0.9}
                    ref="chart"
                    height={window.innerHeight * 0.35}
                    data={demoLineChartData}
                    options={simpleGraphOptions}
                />
            )
        }

        if (this.state.type === 'bar') {
            return (
                <Bar
                    width={window.innerWidth * 0.9}
                    ref="chart"
                    height={window.innerHeight * 0.35}
                    data={demoLineChartData}
                    options={simpleGraphOptions}
                />
            )
        }
    }


    render() {
        return (

            <div style={{flex: 1, display: 'flex'}}>
                <AModal
                    mask={false}
                    visible={true}
                    onOk={() => {
                        //this.closePopupWindow();
                    }}
                    //maskClosable={true}
                    onCancel={() => {
                        //this.closePopupWindow();

                    }}
                    closable={true}
                    bodyStyle={{
                        height: window.innerHeight * 0.95,
                        marginTop: 0,
                        marginLeft: 0,
                        backgroundColor: 'rgb(41, 44, 51)'
                    }}
                    width={'100%'}
                    style={{padding: '10px', top: 0, minWidth: 1200}}
                    footer={null}
                >
                    <div style={{height: 1000}}>
                        <h2>Line Example</h2>
                        <div style={{display: 'flex', marginBottom: 15, marginLeft: 10,}}>
                            {CHART_COLOR_LIST.map((item, index) => {
                                if (index < 5) {
                                    return (
                                        <Center2>
                                            <div style={{
                                                backgroundColor: item,
                                                width: 15,
                                                height: 15,
                                                borderRadius: 50,
                                                marginTop: 3
                                            }}>
                                            </div>
                                            <ClusterCluoudletLable
                                                style={{
                                                    marginLeft: 4,
                                                    marginRight: 15,
                                                    marginBottom: 0
                                                }}>
                                                appInst{index}

                                            </ClusterCluoudletLable>
                                        </Center2>
                                    )
                                }
                            })}

                        </div>
                        <div style={{backgroundColor: 'black'}}>
                            {this.renderChart()}
                        </div>
                        <div style={{marginTop: 30}}>
                            <div style={{marginBottom: 10}}>
                                CharT Type
                            </div>
                            <Dropdown
                                selectOnBlur={false}
                                value={this.state.type}
                                selection
                                // style={PageMonitoringStyles.dropDown}
                                options={[
                                    {
                                        text: 'line',
                                        value: 'line',
                                    },
                                    {
                                        text: 'bar',
                                        value: 'bar',
                                    },
                                    {
                                        text: 'horizontal_bar',
                                        value: 'horizontal_bar',
                                    }
                                ]}
                                onChange={async (e, {value}) => {
                                    this.setState({
                                        type: value,
                                    })
                                }}
                                style={PageMonitoringStyles.dropDownForAppInst}
                            />
                        </div>
                    </div>
                </AModal>

            </div>
        )
    }
}




