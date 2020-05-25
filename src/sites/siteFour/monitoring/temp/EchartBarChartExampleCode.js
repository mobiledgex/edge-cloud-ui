import 'react-hot-loader'
import React, {PureComponent} from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts'
import '../common/PageMonitoringStyles.css'
import {hot} from "react-hot-loader/root";
import {CHART_COLOR_BRIGHT_AND_FRUITY, CHART_COLOR_LIST} from "../../../../shared/Constants";

echarts.registerTheme('my_theme', { // theme object
    backgroundColor: 'black',
    color: ['red', 'blue', 'green']
});


export default hot(
    class EchartBarChartExampleCode extends PureComponent {
        getOption = () => {
            return;
        };

        render() {

            const seires = [
                {
                    name: '2012年',
                    type: 'bar',
                    data: [19325, 23438, 31000, 121594, 134141, 681807]
                }
            ]

            return (
                <div className='examples'>
                    <div className='parent'>
                        <div style={{width: '33%'}}>
                            <ReactEcharts
                                //theme={'my_theme'}
                                option={{
                                    //color: ['red', 'blue', 'green', '#5BCB00', '#0096FF', '#66D9EF', '#E38B9E', '#8591FF', '#BB1924', '#98D259', '#E3A88B', '#D11AC6', '#7DD11A', '#D1521A', '#008CF8', '#521AD1', '#7D0000', '#EB155C', '#EBEE04', '#1CA41F', '#FF0037', '#C092FF', '#999900', '#E8FFAA', '#FFBA99'],
                                    textStyle: {
                                        color: 'white',
                                    },
                                    backgroundColor: '#2a2a2a',
                                    dataset: {
                                        source: [
                                            ['score', 'amount', 'product'],
                                            [89.3, 58212, 'Matcha Latte'],
                                            [57.1, 78254, 'Milk Tea'],
                                            [74.4, 41032, 'Cheese Cocoa'],
                                            [50.1, 12755, 'Cheese Brownie'],
                                            [89.7, 20145, 'Matcha Cocoa'],
                                            [68.1, 79146, 'Tea'],
                                            [19.6, 91852, 'Orange Juice'],
                                            [10.6, 101852, 'Lemon Juice'],
                                            [32.7, 20112, 'Walnut Brownie']
                                        ]
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '3%',
                                        bottom: '5%',
                                        top: '5%',
                                        containLabel: true
                                    },
                                    xAxis: {
                                        name: 'utilization',
                                        nameLocation: 'middle',
                                        nameTextStyle: {
                                            height: 100,
                                            color: '#2a2a2a'
                                        },
                                        axisLabel: {
                                            show: true,
                                        },
                                        nameGap: 50,

                                    },
                                    yAxis: {type: 'category'},
                                    visualMap: {
                                        //type: 'piecewise',
                                        show: false,
                                        orient: 'horizontal',
                                        left: 'center',
                                        /*min: 10,
                                        max: 100,*/
                                        textStyle: {
                                            color: 'white',
                                        },
                                        // Map the score column to color
                                        dimension: 0,
                                        color: CHART_COLOR_LIST,
                                        inRange: {
                                            color: CHART_COLOR_LIST,
                                            opacity: 1,
                                            colorAlpha: 1,
                                        }
                                    },
                                    series: [
                                        {
                                            type: 'bar',
                                            encode: {
                                                // Map the "amount" column to X axis.
                                                x: 'amount',
                                                // Map the "product" column to Y axis
                                                y: 'product'
                                            },
                                            label: {
                                                normal: {
                                                    position: 'right',
                                                    show: true
                                                }
                                            },
                                        }
                                    ]
                                }}
                                style={{height: '350px', width: '100%', color: 'white'}}
                                className='react_for_echarts'
                                onEvents={{
                                    'click': (param, echarts) => {
                                        console.log(`echarts====>`, param.value);
                                        alert(`${param.value[2]} ==> ${param.value[1]}`)
                                    },
                                }}
                            />
                        </div>

                    </div>
                </div>
            );
        }
    }
)


