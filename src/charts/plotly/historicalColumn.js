import React from 'react';
import Plot from 'react-plotly.js';
import ContainerDimensions from 'react-container-dimensions';

import {connect} from "react-redux";
import './styles.css';
import * as actions from "../../actions";
import * as aggregation from "../../utils";

//https://plot.ly/python/#layout-options
//https://plot.ly/javascript/axes/#tick-placement-color-and-style
//https://plot.ly/javascript/streaming/

var colors = ['#22cccc', '#6699ff','#aa77ff', '#ff8e06' ];
var fontColor = 'rgba(255,255,255,.5)' ;
var trace1 = {
    x: ['giraffes', 'orangutans', 'monkeys'],
    y: [20, 14, 23],
    name: 'SF Zoo',
    type: 'bar'
};

var trace2 = {
    x: ['giraffes', 'orangutans', 'monkeys'],
    y: [12, 18, 29],
    name: 'LA Zoo',
    type: 'bar'
};

let _self = null;
class HistoricalColumn extends React.Component {
    constructor() {
        super();
        this.state = {
            vWidth: 600,
            vHeight: 300,
            chartData:[],
            layout: {
                datarevision: 0,

            },
            currentKey:'',
            revision: 0,
            changeState:0
        }
        _self = this;
        this.colors = ['#22cccc', '#6699ff', '#ffce03', '#ff710a'];
    }
    componentWillReceiveProps(nextProps, nextContext) {
        let dataComp = [];
        let methodCounts = [];
        let self = this;
        if(nextProps.data && nextProps.data.methodCall) {

            let methodName = ['FindCloudlet', 'RegisterClient', 'GetFqdnList']
            let mthData = nextProps.data.methodCall;
            let groupDev = aggregation.groupBy(mthData, 'dev')

            let devKeys = Object.keys(groupDev); // samsung, neon2...
            methodName.map((name, i) => {
                let item = {
                    x: [],
                    y: [],
                    name: '',
                    type: 'bar'
                }

                //method 이름별 디벨로퍼들의 3가지 메소스 호출 카운트
                // 1. name
                item.name = name;
                // x array : dev 이름들
                item.x = devKeys;
                // y array : method 당 호출 카운드
                let mthCount = 0;
                devKeys.map(dName => {
                    groupDev[dName].map(obj => {
                        if(obj.method === name) mthCount ++;
                    })

                    item.y.push(mthCount)
                })


                dataComp.push(item);
            })

            this.reloadChart(nextProps.data)


        }
        this.setState({chartData: [trace2]})

    }

    reloadChart(data) {
        let methodName = ['FindCloudlet', 'RegisterClient', 'GetFqdnList']
        let mthData = data.methodCall;
        let groupDev = aggregation.groupBy(mthData, 'dev')
        let dataComp = [];
        let devKeys = Object.keys(groupDev); // samsung, neon2...
        methodName.map((name, i) => {
            let item = {
                x: [],
                y: [],
                name: '',
                type: 'bar'
            }

            //method 이름별 디벨로퍼들의 3가지 메소스 호출 카운트
            // 1. name
            item.name = name;
            // x array : dev 이름들
            item.x = devKeys;
            // y array : method 당 호출 카운드
            let mthCount = 0;
            devKeys.map(dName => {
                groupDev[dName].map(obj => {
                    if(obj.method === name) mthCount ++;
                })

                item.y.push(mthCount)
            })


            dataComp.push(item);
        })


        this.setState({ revision: this.state.revision + 1 });
    }


    render() {
        const { width, height, data } = this.props;
        const { chartData, changeState } = this.state;
        return (
            <div>
                <div>{changeState}</div>
                        <Plot style={{backgroundColor:'transparent', overflow:'auto', width:width, height:height}} ref={ref=>this.plotCh=ref}
                            data={chartData}
                              responsive={true}
                            layout={{
                                barmode:'group',
                                title: null,
                                autosize: false,
                                width:width,
                                height:height,
                                margin: {
                                    l: 40,
                                    r: 20,
                                    b: 50,
                                    t: 5,
                                    pad: 0,
                                    autoexpand: true
                                },
                                paper_bgcolor: 'transparent',
                                plot_bgcolor: 'transparent',
                                xaxis: {
                                    showgrid: false,
                                    zeroline: true,
                                    showline: true,
                                    mirror: 'ticks',
                                    gridcolor: 'rgba(255,255,255,.05)',
                                    gridwidth: 1,
                                    zerolinecolor: 'rgba(255,255,255,0)',
                                    zerolinewidth: 1,
                                    linecolor: 'rgba(255,255,255,.2)',
                                    linewidth: 1,
                                    color: 'rgba(255,255,255,.4)'
                                },
                                yaxis: {
                                    showgrid: true,
                                    zeroline: false,
                                    showline: true,
                                    mirror: 'ticks',
                                    ticklen: 3,
                                    tickcolor: 'rgba(0,0,0,0)',
                                    gridcolor: 'rgba(255,255,255,.05)',
                                    gridwidth:1,
                                    zerolinecolor: 'rgba(255,255,255,0)',
                                    zerolinewidth: 1,
                                    linecolor: 'rgba(255,255,255,.2)',
                                    linewidth: 1,
                                    color: 'rgba(255,255,255,.4)'
                                },
                                showlegend: false,

                                points: {
                                    width:0.5
                                },
                                font: {
                                    size: 12
                                },
                                bargap: 0.3,
                                bargroupgap: 0.2,
                                hoverlabel: {
                                    bordercolor: 'rgba(255,255,255,.3)',
                                    font: {color:'rgba(255,255,255,.7)'},
                                },
                                datarevision: this.state.datarevision + 1

                            }}
                              revision={this.state.revision}
                        />

            </div>


        );
    }
}
HistoricalColumn.defaultProps = {
        width:300, height:150
}



export default HistoricalColumn;
