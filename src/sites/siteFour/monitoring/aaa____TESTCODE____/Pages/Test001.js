import React from 'react';
import {Bar, HorizontalBar, Line} from 'react-chartjs-2';
import 'chartjs-plugin-streaming';

import {Modal as AModal} from 'antd';
import {barChartOptions2, demoLineChartData, GradientBarChartOptions1, makeGradientColorList, simpleGraphOptions} from "../../dev/PageDevMonitoringService";
import {CHART_COLOR_LIST} from "../../../../../shared/Constants";
import {Center2, ClusterCluoudletLable} from "../../PageMonitoringStyledComponent";
import {Dropdown} from "semantic-ui-react";
import {PageMonitoringStyles} from "../../PageMonitoringCommonService";


type Props = {};
type State = {};


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
                    data={demoLineChartData}
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




