import 'react-hot-loader'
import React from 'react';
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
//redux
import {connect} from 'react-redux';
import * as actions from '../actions';
import * as services from '../services/service_audit_api';
import './siteThree.css';
import FlexBox from "flexbox-react";
import {hot} from "react-hot-loader/root";
import {Button} from "semantic-ui-react";
import Plot from 'react-plotly.js';
import TimeSeries from "../charts/plotly/timeseries";

let _self = null;
let rgn = ['US', 'KR', 'EU'];

class Audits2 extends React.Component {
    constructor(props) {
        super(props);
        this._cloudletDummy = [];
    }


    componentDidMount() {


    }

    componentWillUnmount() {


    }


    componentWillReceiveProps(nextProps, nextContext) {


    }

    renderBarGraph() {

        let xSavings = [16, 15, 20, 30, 100]
        let ySavings = ['cpu1', 'cpu1 3498598', 'cpu13', 'cpu14', 'zzzzz'];

        return (
            <Plot
                style={{
                    backgroundColor: 'transparent',
                    overflow: 'hidden',
                    color: 'white',
                    height: 350,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: -80
                }}
                data={
                    [

                        {
                            x: xSavings,
                            y: ySavings,
                            xaxis: 'x1',
                            yaxis: 'y1',
                            type: 'bar',
                            marker: {
                                color: 'rgba(50,171,96,0.6)',
                                line: {
                                    color: 'rgba(50,171,96,1.0)',
                                    width: 1
                                }
                            },
                            name: 'Household savings, percentage of household disposable income',
                            orientation: 'h'
                        }

                    ]

                }
                layout={{
                    height: 400,
                    width: 500,
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    color: 'white',
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
                        ticklen: 5,
                        tickcolor: 'rgba(0,0,0,0)',
                        gridcolor: 'rgba(255,255,255,.05)',
                        gridwidth: 1,
                        zerolinecolor: 'rgba(255,255,255,0)',
                        zerolinewidth: 1,
                        linecolor: 'rgba(255,255,255,.2)',
                        linewidth: 1,
                        color: 'rgba(255,255,255,.4)',
                        //rangemode: 'tozero'
                    },
                }}
            />
        )
    }

    renderLineGraph() {
        return (
            <Plot
                style={{
                    backgroundColor: 'transparent',
                    overflow: 'hidden',
                    color: 'white',
                    height: 350,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: -80
                }}
                data={
                    [
                        {
                            x: [1, 2, 3, 4],
                            y: [10, 15, 13, 17],
                            type: 'scatter'
                        },
                        {
                            x: [1, 2, 3, 4],
                            y: [16, 5, 11, 9],
                            type: 'scatter'
                        },
                        {
                            x: [1, 2, 3, 4],
                            y: [4, 3, 13, 19],
                            type: 'scatter'
                        },
                        {
                            x: [1, 2, 3, 4],
                            y: [5, 4, 7, 29],
                            type: 'scatter'
                        },
                        {
                            x: [1, 2, 3, 4],
                            y: [5, 5, 6, 9],
                            type: 'scatter'
                        },

                    ]

                }
                layout={{
                    height: 400,
                    width: 500,
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    color: 'white',
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
                        ticklen: 5,
                        tickcolor: 'rgba(0,0,0,0)',
                        gridcolor: 'rgba(255,255,255,.05)',
                        gridwidth: 1,
                        zerolinecolor: 'rgba(255,255,255,0)',
                        zerolinewidth: 1,
                        linecolor: 'rgba(255,255,255,.2)',
                        linewidth: 1,
                        color: 'rgba(255,255,255,.4)',
                        //rangemode: 'tozero'
                    },
                }}
            />
        )
    }


    renderPieGraph() {
        return (
            <div style={{backgroundColor: 'transparent',}}>
                <Plot
                    style={{
                        backgroundColor: 'transparent',
                        overflow: 'hidden',
                        color: 'white',
                        height: 350,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginTop: -80
                    }}
                    data={[{
                        values: [30, 40, 30],
                        labels: ['Residential', 'Non-Residential', 'Utility'],
                        type: 'pie'
                    }]}
                    layout={{
                        height: 400,
                        width: 380,
                        paper_bgcolor: 'transparent',
                        plot_bgcolor: 'transparent',
                        color: 'white',

                    }}
                />
            </div>
        )
    }


    renderGrid() {

        return (
            <FlexBox style={{flexDirection: 'column', width: 380, height: 240, backgroundColor: 'transparent'}}>
                <FlexBox style={{flex: 50}}>
                    <FlexBox style={{
                        flex: 33,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        margin: 5,
                        backgroundColor: '#292929',

                        flexDirection: 'column',

                    }}>
                        <FlexBox style={{
                            fontSize: 15,
                            color: '#fff',
                            marginTop:10,
                        }}>
                            sldkflsdkf
                        </FlexBox>
                        <FlexBox style={{
                            marginTop:20,
                            fontSize: 50,
                            color: '#29a1ff',
                        }}>
                            1
                        </FlexBox>

                    </FlexBox>
                    <FlexBox style={{
                        flex: 33,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        margin: 5,
                        backgroundColor: '#292929',

                        flexDirection: 'column',

                    }}>
                        <FlexBox style={{
                            fontSize: 15,
                            color: '#fff',
                            marginTop:10,
                        }}>
                            sldkflsdkf
                        </FlexBox>
                        <FlexBox style={{
                            marginTop:20,
                            fontSize: 50,
                            color: '#29a1ff',
                        }}>
                            2
                        </FlexBox>

                    </FlexBox>
                    <FlexBox style={{
                        flex: 33,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        margin: 5,
                        backgroundColor: '#292929',

                        flexDirection: 'column',

                    }}>
                        <FlexBox style={{
                            fontSize: 15,
                            color: '#fff',
                            marginTop:10,
                        }}>
                            sldkflsdkf
                        </FlexBox>
                        <FlexBox style={{
                            marginTop:20,
                            fontSize: 50,
                            color: '#29a1ff',
                        }}>
                            3
                        </FlexBox>
                    </FlexBox>
                </FlexBox>
                <FlexBox style={{flex: 50}}>
                    <FlexBox style={{
                        flex: 33,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        margin: 5,
                        backgroundColor: '#292929',

                        flexDirection: 'column',

                    }}>
                        <FlexBox style={{
                            fontSize: 15,
                            color: '#fff',
                            marginTop:10,
                        }}>
                            sldkflsdkf
                        </FlexBox>
                        <FlexBox style={{
                            marginTop:20,
                            fontSize: 50,
                            color: '#29a1ff',
                        }}>
                            14
                        </FlexBox>

                    </FlexBox>
                    <FlexBox style={{
                        flex: 33,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        margin: 5,
                        backgroundColor: '#292929',

                        flexDirection: 'column',

                    }}>
                        <FlexBox style={{
                            fontSize: 15,
                            color: '#fff',
                            marginTop:10,
                        }}>
                            sldkflsdkf
                        </FlexBox>
                        <FlexBox style={{
                            marginTop:20,
                            fontSize: 50,
                            color: '#fff',
                        }}>
                            0
                        </FlexBox>

                    </FlexBox>
                    <FlexBox style={{
                        flex: 33,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        margin: 5,
                        backgroundColor: '#292929',

                        flexDirection: 'column',

                    }}>
                        <FlexBox style={{
                            fontSize: 15,
                            color: '#fff',
                            marginTop:10,
                        }}>
                            sldkflsdkf
                        </FlexBox>
                        <FlexBox style={{
                            marginTop:20,
                            fontSize: 50,
                            color: '#fff',
                        }}>
                            0
                        </FlexBox>
                    </FlexBox>
                </FlexBox>
            </FlexBox>
        )
    }


    render() {


        return (
            <div style={{marginTop: 30}}>
                <FlexBox style={{width: '100%'}}>
                    <FlexBox style={{
                        flexDirection: 'column',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 25,
                    }}>
                        <FlexBox style={{
                            fontSize: 22,
                            justifyContent: 'flex-start',
                            marginLeft: -210,
                            marginTop: -10,
                            color: 'white'
                        }}>
                            State of Launch
                        </FlexBox>
                        <div style={{marginTop: 15}}>
                            {this.renderGrid()}
                        </div>

                    </FlexBox>
                    <FlexBox style={{flexDirection: 'column', marginLeft: 50,}}>
                        <FlexBox style={{fontSize: 22, justifyContent: 'flex-start', marginLeft: 60, color: 'white'}}>
                            Top 5 of CPU Usage
                        </FlexBox>
                        {this.renderBarGraph()}
                    </FlexBox>
                    <FlexBox style={{flexDirection: 'column', marginLeft: -50}}>
                        <FlexBox style={{fontSize: 22, justifyContent: 'flex-start', marginLeft: 60, color: 'white'}}>
                            Transition OF CPU
                        </FlexBox>
                        {this.renderLineGraph()}
                    </FlexBox>
                </FlexBox>
                <FlexBox style={{marginTop: 15,}}>
                    <FlexBox style={{
                        flexDirection: 'column',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: 25,
                        marginTop: 10,
                    }}>
                        <FlexBox style={{
                            fontSize: 22,
                            justifyContent: 'flex-start',
                            marginLeft: -160,
                            marginTop: -10,
                            color: 'white'
                        }}>
                            Performance of App
                        </FlexBox>
                        {this.renderPieGraph()}
                    </FlexBox>
                    <FlexBox style={{flexDirection: 'column', marginLeft: 50,}}>
                        <FlexBox style={{fontSize: 22, justifyContent: 'flex-start', marginLeft: 60, color: 'white'}}>
                            Top 5 of MEM Usage
                        </FlexBox>
                        {this.renderBarGraph()}
                    </FlexBox>
                    <FlexBox style={{flexDirection: 'column', marginLeft: -50}}>
                        <FlexBox style={{fontSize: 22, justifyContent: 'flex-start', marginLeft: 60, color: 'white'}}>
                            Transition OF MEM
                        </FlexBox>
                        {this.renderLineGraph()}
                    </FlexBox>
                </FlexBox>

            </div>

        );
    }

};

const mapStateToProps = (state) => {
    let viewMode = null;
    let detailData = null;

    if (state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    return {
        computeRefresh: (state.computeRefresh) ? state.computeRefresh : null,
        changeRegion: state.changeRegion.region ? state.changeRegion.region : null,
        viewMode: viewMode, detailData: detailData,
        isLoading: state.LoadingReducer.isLoading,
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => {
            dispatch(actions.changeSite(data))
        },
        handleInjectData: (data) => {
            dispatch(actions.injectData(data))
        },
        handleInjectDeveloper: (data) => {
            dispatch(actions.registDeveloper(data))
        },
        handleComputeRefresh: (data) => {
            dispatch(actions.computeRefresh(data))
        },
        handleLoadingSpinner: (data) => {
            dispatch(actions.loadingSpinner(data))
        },
        handleAlertInfo: (mode, msg) => {
            dispatch(actions.alertInfo(mode, msg))
        },
        handleDetail: (data) => {
            dispatch(actions.changeDetail(data))
        },
        handleAuditCheckCount: (data) => {
            dispatch(actions.setCheckedAudit(data))
        },
        toggleLoading: (data) => {
            dispatch(actions.toggleLoading(data))
        }
    };
};

export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(Audits2))));
