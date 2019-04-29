import React from 'react';
import Plot from 'react-plotly.js';
import ContainerDimensions from 'react-container-dimensions';

import {connect} from "react-redux";
import './styles.css';
import * as actions from "../../actions";
import * as aggregation from "../../utils";
import * as moment from 'moment';
//https://plot.ly/python/#layout-options
//https://plot.ly/javascript/axes/#tick-placement-color-and-style
//https://plot.ly/javascript/streaming/


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


class MethodCallChart extends React.Component {
    constructor() {
        super();
        this.state = {
            vWidth: 600,
            vHeight: 300,
            data:[],
            chartData:[trace1, trace2],
            layout: {
                datarevision: 0,
            },
            currentKey:'',
            revision: 10,
            fromToDate:'09:27:23 ~ 09:28:23 '
        }
        this.colors = ['#6699ff','#22cccc', '#aa77ff', '#ffce03' ];
        this.colorsErr = ['#22cccc','#ff3355', '#6699ff', '#ffce03' ];
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.chartData && nextProps.chartData.methodCall) {
            this.reloadChart(nextProps.chartData, nextProps.lineLimit);
        }

    }
    reloadChart(data, lineLimit) {
        let methodName = ['FindCloudlet', 'RegisterClient', 'GetFqdnList']
        let mthData = data.methodCall;
        let groupDev = aggregation.groupBy(mthData, 'dev')
        let groupTime = aggregation.groupBy(mthData, 'time')
        let timeKeys = Object.keys(groupTime);
        let dataComp = [];
        let devKeys = Object.keys(groupDev); // samsung, neon2...
        methodName.map((name, i) => {
            let item = {
                x: [],
                y: [],
                text: '',
                textposition: 'auto',
                name: '',
                type: 'bar',
                marker: {
                    color: this.colors[i]
                }
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

            item.text = item.y.map(String)

            dataComp.push(item);
        })
        this.setState({
            chartData:dataComp,
            fromToDate:moment(timeKeys[0], 'YYYYMMDD HH:mm:ss').format('HH:mm:ss') +'  ~  '+ moment(timeKeys[timeKeys.length-1] , 'YYYYMMDD HH:mm:ss').format('HH:mm:ss')
            //fromToDate:timeKeys[0] +'  ~  '+ timeKeys[timeKeys.length-1]
        })


        this.setState({ revision: this.state.revision + 1 });
    }

    render() {
        let {error} = this.props;
        return (
            <ContainerDimensions>
                { ({ width, height }) =>
                    <div className="plotContainer" style={{width:width, height:height-2, display:'flex', flexDirection:'column', overflowY:'hidden', overflowX:'auto'}}>
                        <div style={{width:'100%'}}>{`Range of date ::: ${this.state.fromToDate}`}</div>
                        <Plot style={{backgroundColor:'transparent', overflow:'hidden', width:width, height:height}}
                            data={this.state.chartData}
                            layout={{
                                barmode:'group',
                                title: null,
                                autosize: false,
                                width:width-this.props.marginRight,
                                height:height,
                                margin:this.props.margin,
                                paper_bgcolor: 'transparent',
                                plot_bgcolor: 'transparent',
                                legend: {
                                    x: 1,
                                    y: 1
                                },
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
                                    color: 'rgba(255,255,255,.4)',
                                    domain: [0, 0.94],
                                    wrap: true,
                                    tickangle: 13,

                                    // domain: [0, 0.94]
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
                                yaxis2:{
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
                                    color: 'rgba(255,255,255,.4)',
                                    overlaying: 'y',
                                    side: 'right',
                                    position:this.props.y2Position,
                                    range:this.props.y2Range
                                },
                                yaxis3:{
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
                                    color: 'rgba(255,255,255,.4)',
                                    overlaying: 'y',
                                    side: 'right',
                                    position:this.props.y3Position,
                                    range:this.props.y3Range
                                },
                                bargap: 0.2,
                                bargroupgap: 0.1,
                                showlegend: this.props.showLegend,
                                points: {
                                    width: 0.5
                                },
                                hoverlabel: {
                                    bordercolor: 'rgba(255,255,255,.3)',
                                    font: {color:'rgba(255,255,255,.7)'},
                                },
                                datarevision: this.state.datarevision + 1

                            }}
                              revision={this.state.revision}
                        />
                    </div>

                }
            </ContainerDimensions>



        );
    }
}
MethodCallChart.defaultProps = {
    margin: {
        l: 40,
        r: 20,
        b: 70,
        t: 5,
        pad: 0
    },
    marginRight:0,
    showLegend:false,
    y2Range:null,
    y3Range:null,
    y2Position:null,
    y3Position:null
}


//
const mapStateToProps = (state, ownProps) => {
    return {
        currentKey: state.cityChanger.city
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeCity: (data) => { dispatch(actions.changeCity(data)) },
        handleInjectData: (data) => { dispatch(actions.injectNetworkData(data))},
    };
};

export default connect(mapStateToProps, mapDispatchProps)(MethodCallChart);
