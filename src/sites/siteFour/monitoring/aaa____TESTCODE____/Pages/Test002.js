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

const datas001 = {
    "labels": [
        "02:39:19",
        "02:38:39",
        "02:38:31",
        "02:38:24",
        "02:38:16",
        "02:38:08",
        "02:38:00",
        "02:37:52",
        "02:37:44",
        "02:37:36"
    ],
    "datasets": [
        {
            "label": "autoclustermobiledgexsdkdemo\n[berlin-test]",
            "radius": 0,
            "borderWidth": 3,
            "fill": true,
            "backgroundColor": {},
            "borderColor": {},
            "lineTension": 0.5,
            "data": [
                39.49012598562198,
                39.48582562893952,
                39.487061363618395,
                39.4823655718387,
                39.47826293270486,
                39.47930094983511,
                39.47747206251038,
                39.47638461599298,
                39.477669780059,
                39.45962805374754
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
            "fill": true,
            "backgroundColor": {},
            "borderColor": {},
            "lineTension": 0.5,
            "data": [
                37.65876719154085,
                37.65387368221254,
                37.66346298332055,
                37.65604857524735,
                37.64986990185301,
                37.648485879012675,
                37.642554352554114,
                37.71580870431736,
                37.76143202866113,
                37.714523540251335
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
            "label": "kyungjoncluster\n[mexplat-stage-frankfurt-cloudlet]",
            "radius": 0,
            "borderWidth": 3,
            "fill": true,
            "backgroundColor": {},
            "borderColor": {},
            "lineTension": 0.5,
            "data": [
                20.484427765870787,
                20.557583258859722,
                20.530001660827406,
                20.547499663880167,
                20.53613090483459,
                20.54057954967851,
                20.554419778081822,
                20.541963572518842,
                20.57666300230143,
                20.549674556914972
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
                    data={datas001}
                    options={simpleGraphOptions}
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




