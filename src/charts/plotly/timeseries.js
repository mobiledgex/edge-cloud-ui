import React from 'react';
import Plot from 'react-plotly.js';
import ContainerDimensions from 'react-container-dimensions';

import {connect} from "react-redux";
import './styles.css';
import * as actions from "../../actions";

//https://plot.ly/python/#layout-options
//https://plot.ly/javascript/axes/#tick-placement-color-and-style
//https://plot.ly/javascript/streaming/





class TimeSeries extends React.Component {
    constructor() {
        super();
        this.state = {
            vWidth: 600,
            vHeight: 300,
            data:[],
            chartData:[{
                x: [1, 2, 3, 4, 5],
                y: [1, 2, 4, 8, 16] }],
            layout: {
                datarevision: 0,
            },
            currentKey:'',
            revision: 10,
        }
        this.colors = ['#22cccc', '#6699ff','#ff710a', '#ffce03' ];
        this.colorsErr = ['#22cccc','#ff3355', '#6699ff', '#ffce03' ];
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.chartData && nextProps.series[0]) {
            this.reloadChart(nextProps.chartData, nextProps.series[0], nextProps.label, nextProps.single);
        }

    }
    reloadChart(data, series,names, dataId) {
        let xaxis = series;

        let _data = dataId ? data[parseInt(dataId)] : data;

        let seriesData = null;

        if(!dataId) {
            seriesData = data.map((item, i) => (
                {
                    type: 'scatter',
                    x: series,
                    y: item,
                    yaxis:(i === 0)?'y':(i === 1)?'y2':(i === 2)?'y3':'y',
                    name:(names && names.length>0)?names[i]:'',
                    line: {color: (this.props.error)?this.colorsErr[i]:this.colors[i],width:1},
                    marker:{size:5}
                }
            ))
        }  else {
            let sData = [];

            _data.map((dt) => {
                sData.push(Number(dt))
            })
            seriesData = [{
                type: 'scatter',
                x: series,
                y: sData,
                yaxis:'y',
                name:(names && names.length>0)?names[parseInt(dataId)]:'',
                line: {color: (this.props.error)?this.colorsErr[parseInt(dataId)]:this.colors[parseInt(dataId)],width:1},
                marker:{size:5}
            }];

        }

        this.setState({
            chartData:seriesData
        })


        this.setState({ revision: this.state.revision + 1 });
    }

    render() {
        let {error} = this.props;
        return (
            <ContainerDimensions>
                { ({ width, height }) =>
                    <div  className="plotContainer" style={{ display:'flex', overflowY:'hidden', overflowX:'auto'}}>
                        <Plot style={{backgroundColor:'transparent', overflow:'hidden'}}
                            data={this.state.chartData}
                            layout={{
                                title: null,
                                autosize: true,
                                width:width-this.props.marginRight,
                                height:350,
                                margin:this.props.margin,
                                paper_bgcolor: 'transparent',
                                plot_bgcolor: 'transparent',
                                legend: {
                                    x: 1.05,
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
                                    domain: [0, 0.94]
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
                                    color: 'rgba(255,255,255,.4)',
                                    //rangemode: 'tozero'
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
                                    range:this.props.y2Range,
                                    //rangemode: 'tozero'
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
                                showlegend: this.props.showLegend,
                                points: {
                                    width: 1
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
TimeSeries.defaultProps = {
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
        handleChangeCity: (data) => { dispatch(actions.changeCity(data)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(TimeSeries);
