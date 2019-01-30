import React from 'react';
import Plot from 'react-plotly.js';
import ContainerDimensions from 'react-container-dimensions';

import {connect} from "react-redux";
import './styles.css';
import * as actions from "../../actions";

//https://plot.ly/python/#layout-options
//https://plot.ly/javascript/axes/#tick-placement-color-and-style
//https://plot.ly/javascript/streaming/

class TimeSeriesFlow extends React.Component {
    constructor() {
        super();
        this.state = {
            vWidth: 600,
            vHeight: 300,
            data:[],
            chartData:null,
            layout: {
                datarevision: 0,
            },
            currentKey:'',
            revision: 0,
        }
        this.colors = ['#22cccc', '#6699ff', '#ffce03', '#ff710a'];
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.chartData && nextProps.series[0]) {
            this.reloadChart(nextProps.chartData, nextProps.series[0], nextProps.lineLimit);
        }




    }
    reloadChart(data, series, lineLimit) {
        let xaxis = series;
        let seriesData = data.map((item, i) => (
            {
                type: 'scatter',
                x: series,
                y: item,
                line: {color: this.colors[i],width:1},
                marker:{size:5}
            }
        ))
        this.setState({
            chartData:seriesData
        })

        // this.setState({
        //     data:seriesData
        // })

        this.setState({ revision: this.state.revision + 1 });
    }

    render() {
        return (
            <ContainerDimensions>
                { ({ width, height }) =>
                    <div  className="plotContainer" style={{width:width, height:height, display:'flex', overflowY:'auto', overflowX:'auto'}}>
                        <Plot style={{backgroundColor:'transparent', overflow:'auto'}}
                            data={this.state.chartData}
                            layout={{
                                title: null,
                                autosize: false,
                                width:width,
                                height:height,
                                margin: {
                                    l: 40,
                                    r: 20,
                                    b: 40,
                                    t: 5,
                                    pad: 0
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
                                    width: 1
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
TimeSeriesFlow.defaultProps = {
        width:300, height:150
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

export default connect(mapStateToProps, mapDispatchProps)(TimeSeriesFlow);
