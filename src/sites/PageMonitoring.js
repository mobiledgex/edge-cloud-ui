import 'react-hot-loader'
import React from 'react';
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import FlexBox from "flexbox-react";
import {hot} from "react-hot-loader/root";
import Plot from 'react-plotly.js';
import {Dropdown, Grid,} from "semantic-ui-react";
import {DatePicker} from 'antd';
import {formatDate, getTodayDate} from "../utils";
import {Chart} from "react-google-charts";
import './PageMonitoring.css';
import CircularProgress from "@material-ui/core/CircularProgress";
import {renderBarGraph2, renderGrid, renderLineChart2, renderPieChart2} from "../shared/MonitoringService";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'


const {Column, Row} = Grid;


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

type Props = {
    handleLoadingSpinner: Function,
    toggleLoading: Function,
    history: any,
    onSubmit: any,
    sendingContent: any,
    loading: boolean,
    isLoading: boolean,
}

type State = {
    date: string,
    time: string,
    dateTime: string,
    datesRange: string

}

let boxWidth = window.innerWidth / 10 * 2.77;

export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageMonitoring extends React.Component<Props, State> {


        constructor(props) {
            super(props);
            this.state = {
                date: '',
                time: '',
                dateTime: '',
                datesRange: ''
            };
        }

        componentDidMount() {

            let todayDate = getTodayDate()
            /*  this.setState({
                  date: todayDate,
              })*/
        }

        componentWillUnmount() {

        }

        componentWillReceiveProps(nextProps, nextContext) {

        }


        renderLineGraph() {
            return (
                <Plot
                    style={{
                        //backgroundColor: 'transparent',
                        backgroundColor: '#373737',
                        overflow: 'hidden',
                        color: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginTop: 0

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
                        height: 300,
                        width: boxWidth,
                        paper_bgcolor: 'transparent',
                        plot_bgcolor: 'red',
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
                            backgroundColor: '#373737',
                            overflow: 'hidden',
                            color: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginTop: 0
                        }}
                        data={[{
                            values: [30, 40, 30],
                            labels: ['Residential', 'Non-Residential', 'Utility'],
                            type: 'pie'
                        }]}
                        layout={{
                            height: 350,
                            width: boxWidth,
                            paper_bgcolor: 'transparent',
                            plot_bgcolor: 'transparent',
                            color: 'white',

                        }}
                    />
                </div>
            )
        }



        renderHightCharts(){
            const options = {
                title: {
                    text: 'My chart'
                },
                series: [{
                    data: [1, 2, 3]
                }]
            }

            return (
                <div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                    />
                </div>
            )
        }

        renderHeader(){

            let options1 = [
                {key: '24', value: '24', flag: '24', text: 'Last 24 hours'},
                {key: '18', value: '18', flag: '18', text: 'Last 18 hours'},
                {key: '12', value: '12', flag: '12', text: 'Last 12 hours'},
                {key: '6', value: '6', flag: '6', text: 'Last 6 hours'},
                {key: '1', value: '1', flag: '1', text: 'Last hour'},

            ]

            return (
                <FlexBox className='' style={{marginRight: 23}}>
                    <Grid.Column className='content_title'
                                 style={{lineHeight: '36px', fontSize: 30, marginTop: 5,}}>Monitoring
                    </Grid.Column>
                    <Grid.Column className='content_title2' style={{marginLeft: -10}}>
                        <button className="ui circular icon button"><i aria-hidden="true"
                                                                       className="info icon"></i>
                        </button>
                    </Grid.Column>
                    <FlexBox style={{justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%'}}>
                        <Grid.Column

                            style={{lineHeight: '36px', marginLeft: 10, cursor: 'pointer', color: 'white'}}
                            onClick={() => {
                                alert('Reset All')
                            }}
                        >
                            Reset All
                        </Grid.Column>
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
                        {/*######################*/}
                        {/* DATE CALENDAR 4444*/}
                        {/*###########*###########*/}
                        <Grid.Column className=''
                                     style={{lineHeight: '36px', marginLeft: 10, cursor: 'pointer'}}>
                            <FlexBox style={{marginBottom: -0.5,}}>


                                <DatePicker
                                    onChange={(date) => {
                                        let __date = formatDate(date);
                                        this.setState({
                                            date: __date,
                                        })
                                    }}
                                    placeholder="Start Date"
                                    style={{cursor: 'pointer'}}

                                />
                                <FlexBox style={{fontSize: 25, marginLeft: 3, marginRight: 3,}}>
                                    -
                                </FlexBox>
                                <DatePicker
                                    onChange={(date) => {
                                        let __date = formatDate(date);
                                        this.setState({
                                            date: __date,
                                        })
                                    }}
                                    placeholder="End Date"
                                    style={{cursor: 'pointer'}}

                                />

                            </FlexBox>
                        </Grid.Column>
                    </FlexBox>

                </FlexBox>
            )
        }

        render() {


            return (

                <Grid.Row className='view_contents'>
                    <Grid.Column className='contents_body'>
                        {/*#######################*/}
                        {/*컨텐츠 해더 부분        ..*/}
                        {/*#######################*/}
                        {this.renderHeader()}
                        {/*#######################*/}
                        {/*@todo 컨텐츠 BODY 부분...*/}
                        {/*#######################*/}
                        <div className="page_monitoring">

                            <FlexBox style={{flexDirection: 'column'}}>

                                {/*_____row____1111*/}
                                <FlexBox style={{marginTop: 25,}}>
                                    {/* ___col___1*/}
                                    {/* ___col___1*/}
                                    {/* ___col___1*/}
                                    <FlexBox style={Styles.box001}>
                                        <FlexBox style={{width: '100%', backgroundColor: 'transparent'}}>
                                            <FlexBox style={Styles.box002}>
                                                State of Launuch #2
                                            </FlexBox>
                                            <FlexBox style={{flex: 30}}>
                                                {/*dummy____dummy*/}
                                            </FlexBox>
                                        </FlexBox>
                                        <FlexBox style={{marginTop: 0}}>
                                            {renderGrid()}
                                        </FlexBox>

                                    </FlexBox>
                                    {/* ___col___2*/}
                                    {/* ___col___2*/}
                                    {/* ___col___2*/}
                                    <FlexBox style={Styles.box001}>
                                        <FlexBox style={{width: '100%', backgroundColor: 'transparent'}}>
                                            <FlexBox style={Styles.box002}>
                                                State of Cpu Usage
                                            </FlexBox>
                                            <FlexBox style={{flex: 30}}>
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
                                            </FlexBox>
                                        </FlexBox>
                                        <FlexBox style={{marginTop: 0, backgroundColor: 'red'}}>
                                            {renderBarGraph2()}
                                        </FlexBox>

                                    </FlexBox>
                                    {/* ___col___3*/}
                                    {/* ___col___3*/}
                                    {/* ___col___3*/}
                                    <FlexBox style={Styles.box001}>
                                        <FlexBox style={{width: '100%', backgroundColor: 'transparent'}}>
                                            <FlexBox style={Styles.box002}>
                                                State of Cpu Usage #2
                                            </FlexBox>
                                            <FlexBox style={{flex: 30}}>
                                                {/*dummy____dummy*/}
                                            </FlexBox>
                                        </FlexBox>
                                        <FlexBox style={{marginTop: 0}}>
                                            {this.renderLineGraph()}
                                        </FlexBox>

                                    </FlexBox>
                                </FlexBox>

                                {/*row_____22222222*/}
                                {/*row_____22222222*/}
                                {/*row_____22222222*/}
                                <FlexBox style={{marginTop: 80,}}>

                                    {/* ___col___4*/}
                                    {/* ___col___4*/}
                                    {/* ___col___4*/}
                                    <FlexBox style={Styles.box001}>
                                        <FlexBox style={{width: '100%', backgroundColor: 'transparent'}}>
                                            <FlexBox style={Styles.box002}>
                                                State of Launuch #2
                                            </FlexBox>
                                            <FlexBox style={{flex: 30}}>
                                                {/*dummy____dummy*/}
                                            </FlexBox>
                                        </FlexBox>

                                        <FlexBox style={{marginTop: 10}}>
                                            {renderPieChart2()}
                                        </FlexBox>


                                    </FlexBox>
                                    {/* ___col___5*/}
                                    {/* ___col___5*/}
                                    {/* ___col___5*/}
                                    <FlexBox style={Styles.box001}>
                                        <FlexBox style={{width: '100%', backgroundColor: 'transparent'}}>
                                            <FlexBox style={Styles.box002}>
                                                State of MEM Usage
                                            </FlexBox>
                                            <FlexBox style={{flex: 30}}>
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
                                            </FlexBox>
                                        </FlexBox>
                                        <FlexBox style={{marginTop: 0}}>
                                            {renderBarGraph2()}
                                        </FlexBox>

                                    </FlexBox>
                                    {/* ___col___6*/}
                                    {/* ___col___6*/}
                                    {/* ___col___6*/}
                                    <FlexBox style={Styles.box001}>
                                        <FlexBox style={{width: '100%', backgroundColor: 'transparent'}}>
                                            <FlexBox style={Styles.box002}>
                                                State of MEM Usage #2
                                            </FlexBox>
                                            <FlexBox style={{flex: 30}}>
                                                {/*dummy____dummy*/}
                                            </FlexBox>
                                        </FlexBox>
                                        <FlexBox style={{marginTop: 0}}>
                                            {renderLineChart2()}
                                        </FlexBox>

                                    </FlexBox>
                                </FlexBox>
                            </FlexBox>
                        </div>
                    </Grid.Column>

                </Grid.Row>


            );
        }

    }
))));


const Styles = {
    box001: {
        flexDirection: 'column',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 25,
        backgroundColor: 'blue',
        marginTop: -50
    },
    box002: {
        fontSize: 22,
        marginLeft: 10,
        flex: 70,
        justifyContent: 'flex-start',
        color: 'white'
    }
}
