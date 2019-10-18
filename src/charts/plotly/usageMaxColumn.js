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
    x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    y: [20, 14, 25, 16, 18, 22, 19, 15, 12, 16, 14, 17],
    type: 'bar',
    name: 'Primary Product',
    marker: {
        color: 'rgb(49,130,189)',
        opacity: 0.7,
    }
};

var trace2 = {
    x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    y: [19, 14, 22, 14, 16, 19, 15, 14, 10, 12, 12, 16],
    type: 'bar',
    name: 'Secondary Product',
    marker: {
        color: 'rgb(204,204,204)',
        opacity: 0.5
    }
};


class UsageMaxColumn extends React.Component {
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
        if(nextProps.chartData) {
            this.reloadChart(nextProps.chartData, nextProps.series);
        }

    }
    reloadChart(data, series) {
        let maxData = {
            x: [],
            y: [],
            text: '',
            textposition: 'auto',
            name: 'MAX',
            type: 'bar',
            marker:{color:'indianred'}
        }
        let usageData = {
            x: [],
            y: [],
            text: '',
            textposition: 'auto',
            name: 'USED',
            type: 'bar',
            marker:{color:'lightsalmon'}
        }
        if(series && series[0].length === 0) {
            return;
        }
        data.map((item, i) => {
            //console.log('20191007 item..', item)
            if(i === 0) {
                usageData.y = item;

            } else {
                data[0].map((itm, i) => {
                    maxData.y.push(data[1][i]);
                })
            }

        })


        usageData.x = series[0];
        maxData.x = series[0];

        let dataComp = [usageData, maxData]
        //console.log('20191007 dataComp == ', dataComp)
        this.setState({
            chartData:dataComp,
            fromToDate:moment(series[0][0]).format('YYYYMMDD HH:mm:ss') +'  ~  '+ moment(series[0][series[0].length-1] , 'YYYYMMDD HH:mm:ss').format('HH:mm:ss')
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
UsageMaxColumn.defaultProps = {
    margin: {
        l: 50,
        r: 15,
        b: 35,
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

export default connect(mapStateToProps, mapDispatchProps)(UsageMaxColumn);
