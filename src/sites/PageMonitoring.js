import 'react-hot-loader'
import React from 'react';
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import './siteThree.css';
import FlexBox from "flexbox-react";
import {hot} from "react-hot-loader/root";
import Plot from 'react-plotly.js';
import {Button, Dropdown, Grid, Item,} from "semantic-ui-react";

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

export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageMonitoring extends React.Component {
        constructor(props) {
            super(props);
        }

        componentDidMount() {


            console.log('itemeLength===>');
            console.log('itemeLength===>');
            console.log('itemeLength===>');
            console.log('itemeLength===>');
            console.log('itemeLength===>');
            console.log('itemeLength===>');
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
                                marginTop: 10,
                            }}>
                                고경준App1
                            </FlexBox>
                            <FlexBox style={{
                                marginTop: 20,
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
                                marginTop: 10,
                            }}>
                                고경준App2
                            </FlexBox>
                            <FlexBox style={{
                                marginTop: 20,
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
                                marginTop: 10,
                            }}>
                                고경준App23
                            </FlexBox>
                            <FlexBox style={{
                                marginTop: 20,
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
                                marginTop: 10,
                            }}>
                                고경준App4
                            </FlexBox>
                            <FlexBox style={{
                                marginTop: 20,
                                fontSize: 50,
                                color: '#29a1ff',
                            }}>
                                5
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
                                marginTop: 10,
                            }}>
                                고경준App5
                            </FlexBox>
                            <FlexBox style={{
                                marginTop: 20,
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
                                marginTop: 10,
                            }}>
                                고경준App6
                            </FlexBox>
                            <FlexBox style={{
                                marginTop: 20,
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

            let options1 = [
                {key: '24', value: '24', flag: '24', text: 'Last 24 hours'},
                {key: '18', value: '18', flag: '18', text: 'Last 18 hours'},
                {key: '12', value: '12', flag: '12', text: 'Last 12 hours'},
                {key: '6', value: '6', flag: '6', text: 'Last 6 hours'},
                {key: '1', value: '1', flag: '1', text: 'Last hour'},

            ]

            return (

                <Grid.Row className='view_contents'>


                    {/*FIXME: contents_body 스타일 영역이 좀 이상하게 잡혀있는듯*/}
                    {/*FIXME: contents_body 스타일 영역이 좀 이상하게 잡혀있는듯*/}
                    {/*FIXME: contents_body 스타일 영역이 좀 이상하게 잡혀있는듯*/}
                    <Grid.Column className='contents_body'>
                        {/*#######################*/}
                        {/*컨텐츠 해더 부분...*/}
                        {/*#######################*/}
                        <FlexBox className='' style={{}}>
                            <Grid.Column className='content_title2'
                                         style={{lineHeight: '36px', fontSize: 30,}}>Monitoring
                            </Grid.Column>
                            <Grid.Column className='content_title2' style={{marginLeft: -10}}>
                                <button className="ui circular icon button"><i aria-hidden="true"
                                                                               className="info icon"></i>
                                </button>
                            </Grid.Column>
                            <FlexBox style={{width: 150,}}/>
                            <FlexBox style={{justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%'}}>
                                <FlexBox style={{backgroundColor: 'red'}}
                                         style={{lineHeight: '36px', marginLeft: 10, cursor: 'pointer'}}
                                         onClick={() => {
                                             alert('Reset All')
                                         }}
                                >
                                    Reset All
                                </FlexBox>
                                {/*###########*/}
                                {/* COLUMN ONe*/}
                                {/*###########*/}
                                <Grid.Column className='' style={{lineHeight: '36px', marginLeft: 30,}}>
                                    <div style={{marginTop: 10}}>
                                        <Dropdown
                                            placeholder='REGION'
                                            selection
                                            options={options1

                                            }
                                            defaultValue={options1[0].value}
                                            style={{width: 200}}
                                        />
                                    </div>
                                </Grid.Column>
                                {/*###########*/}
                                {/* COLUMN TWO*/}
                                {/*###########*/}
                                <Grid.Column className='' style={{lineHeight: '36px', marginLeft: 10,}}>
                                    <div style={{marginTop: 10}}>
                                        <Dropdown
                                            placeholder='CloudLet'
                                            selection
                                            options={
                                                [
                                                    {key: '24', value: '24', flag: '24', text: 'Last 24 hours'},
                                                    {key: '18', value: '18', flag: '18', text: 'Last 18 hours'},
                                                    {key: '12', value: '12', flag: '12', text: 'Last 12 hours'},
                                                    {key: '6', value: '6', flag: '6', text: 'Last 6 hours'},
                                                    {key: '1', value: '1', flag: '1', text: 'Last hour'},

                                                ]

                                            }
                                            style={{width: 200}}
                                        />
                                    </div>
                                </Grid.Column>
                                {/*###########*/}
                                {/* COLUMN 333*/}
                                {/*###########*/}
                                <Grid.Column className='' style={{lineHeight: '36px', marginLeft: 10,}}>
                                    <div style={{marginTop: 10}}>
                                        <Dropdown
                                            placeholder='Cluster'
                                            selection
                                            options={
                                                [
                                                    {key: '24', value: '24', flag: '24', text: 'Last 24 hours'},
                                                    {key: '18', value: '18', flag: '18', text: 'Last 18 hours'},
                                                    {key: '12', value: '12', flag: '12', text: 'Last 12 hours'},
                                                    {key: '6', value: '6', flag: '6', text: 'Last 6 hours'},
                                                    {key: '1', value: '1', flag: '1', text: 'Last hour'},

                                                ]

                                            }
                                            style={{width: 200}}
                                        />
                                    </div>
                                </Grid.Column>
                                {/*###########*/}
                                {/* COLUMN 4444*/}
                                {/*###########*/}
                                <Grid.Column className='' style={{lineHeight: '36px', marginLeft: 10,}}>
                                    <div style={{marginTop: 10}}>
                                        <Dropdown
                                            placeholder='2018/11/01'
                                            selection
                                            options={
                                                [
                                                    {key: '24', value: '24', flag: '24', text: 'Last 24 hours'},
                                                    {key: '18', value: '18', flag: '18', text: 'Last 18 hours'},
                                                    {key: '12', value: '12', flag: '12', text: 'Last 12 hours'},
                                                    {key: '6', value: '6', flag: '6', text: 'Last 6 hours'},
                                                    {key: '1', value: '1', flag: '1', text: 'Last hour'},

                                                ]

                                            }
                                            style={{width: 200}}
                                        />
                                    </div>
                                </Grid.Column>
                            </FlexBox>

                        </FlexBox>
                        {/*#######################*/}
                        {/*@fixme 컨텐츠 BODY 부분...*/}
                        {/*#######################*/}
                        <Grid.Row className='site_content_body'>
                            <div className="page_audit">
                                <div style={{marginTop: 0, marginLeft: -40}}>
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
                                        <FlexBox style={{flexDirection: 'column', marginLeft: 20,}}>
                                            <FlexBox style={{
                                                fontSize: 22,
                                                justifyContent: 'flex-start',
                                                marginLeft: 60,
                                                color: 'white'
                                            }}>
                                                Top 5 of CPU Usage
                                            </FlexBox>
                                            {this.renderBarGraph()}
                                        </FlexBox>
                                        <FlexBox style={{flexDirection: 'column', marginLeft: -100}}>
                                            <FlexBox style={{
                                                fontSize: 22,
                                                justifyContent: 'flex-start',
                                                marginLeft: 60,
                                                color: 'white'
                                            }}>
                                                Transition OF CPU
                                            </FlexBox>
                                            {this.renderLineGraph()}
                                        </FlexBox>
                                    </FlexBox>

                                    {/*2nd row*/}
                                    {/*2nd row*/}
                                    {/*2nd row*/}
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
                                        <FlexBox style={{flexDirection: 'column', marginLeft: 20,}}>
                                            <FlexBox style={{
                                                fontSize: 22,
                                                justifyContent: 'flex-start',
                                                marginLeft: 60,
                                                color: 'white'
                                            }}>
                                                Top 5 of MEM Usage
                                            </FlexBox>
                                            {this.renderBarGraph()}
                                        </FlexBox>
                                        <FlexBox style={{flexDirection: 'column', marginLeft: -100}}>
                                            <FlexBox style={{
                                                fontSize: 22,
                                                justifyContent: 'flex-start',
                                                marginLeft: 60,
                                                color: 'white'
                                            }}>
                                                Transition OF MEM
                                            </FlexBox>
                                            {this.renderLineGraph()}
                                        </FlexBox>
                                    </FlexBox>

                                </div>
                            </div>
                        </Grid.Row>
                    </Grid.Column>
                </Grid.Row>


            );
        }

    }
))));

