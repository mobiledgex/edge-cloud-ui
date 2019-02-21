import React from 'react';
import Plot from 'react-plotly.js';
import ContainerDimensions from 'react-container-dimensions';

import {connect} from "react-redux";
import './styles.css';
import * as actions from "../../actions";

//https://plot.ly/python/#layout-options
//https://plot.ly/javascript/axes/#tick-placement-color-and-style
//https://plot.ly/javascript/streaming/
var trace1 = {
    x: ['2019-02-23', '2019-02-24', '2019-02-25', '2019-02-26', '2019-02-27', '2019-02-28', '2019-02-29'],
    y: [20, 14, 23, 25, 12, 16, 34 ],
    name: 'Cluster A',
    marker: {
        color: 'rgb(34, 204, 204)',
        opacity: 1,
        line: {
            color: 'rgba(255,255,255,.5)',
            width: 1
        }
    },
    type: 'bar'
};

var trace2 = {
    x: ['2019-02-23', '2019-02-24', '2019-02-25', '2019-02-26', '2019-02-27', '2019-02-28', '2019-02-29'],
    y: [12, 18, 29, 21, 14, 29, 22],
    name: 'Cluster B',
    marker: {
        color: 'rgb(102, 153, 255)',
        opacity: 1,
        line: {
            color: 'rgba(255,255,255,.5)',
            width: 1
        }
    },
    type: 'bar'
};
class HistoricalColumn extends React.Component {
    constructor() {
        super();
        this.state = {
            vWidth: 600,
            vHeight: 300,
            data:[trace1, trace2],
            chartData:[trace1, trace2],
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
            //this.reloadChart(nextProps.chartData, nextProps.series[0], nextProps.lineLimit);
        }


    }
    reloadChart(data, series, lineLimit) {
        let xaxis = series;
        let seriesData = data.map((item, i) => (
            {
                type: 'scatter',
                x: series,
                y: item,
                line: {color: this.colors[i],width:0},
                marker:{size:1}
            }
        ))
        this.setState({
            //chartData:seriesData
        })


        this.setState({ revision: this.state.revision + 1 });
    }

    render() {
        return (
            <ContainerDimensions>
                { ({ width, height }) =>
                    <div  className="plotContainer" style={{width:width, height:height, display:'flex', overflowY:'auto', overflowX:'auto'}}>
                        <Plot style={{backgroundColor:'transparent', overflow:'auto'}}
                            data={this.state.chartData}
                              responsive={true}
                            layout={{
                                barmode:'group',
                                title: null,
                                autosize: false,
                                width:width,
                                height:height-30,
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
                                }

                            }}
                              revision={this.state.revision}
                        />
                    </div>

                }
            </ContainerDimensions>



        );
    }
}
HistoricalColumn.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchProps)(HistoricalColumn);
