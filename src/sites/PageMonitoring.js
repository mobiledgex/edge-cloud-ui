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
import './PageMonitoring.css';
import {
    fetchAppInstanceList,
    renderBarGraph2_Google,
    renderLineGraph_Plot,
    renderPieChart2_Google, renderPlaceHolder
} from "../services/PageMonitoringService";
import axios from "axios";

import * as reducer from '../utils'
import {CircularProgress} from "@material-ui/core";
import {GridLoader} from "react-spinners";

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
    datesRange: string,
    appInstanceListSortByCloudlet: any,
    loading: boolean,
    loading0: boolean,

}

let boxWidth = window.innerWidth / 10 * 2.77;

export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(
    class PageMonitoring extends React.Component<Props, State> {
        state = {
            date: '',
            time: '',
            dateTime: '',
            datesRange: '',
            appInstanceListSortByCloudlet: [],
            loading: false,
            loading0: false,
        };

        constructor(props) {
            super(props);
        }

        componentDidMount = async () => {
            this.setState({
                loading: true,
                loading0: true,
            })

            let appInstanceList = await fetchAppInstanceList();
            let appInstanceListSortByCloudlet = reducer.groupBy(appInstanceList, 'Cloudlet');
            await this.setState({
                appInstanceListSortByCloudlet,
            })
            setTimeout(() => {
                this.setState({
                    loading: false,
                    loading0: false,
                })
            }, 350)

        }

        componentWillUnmount() {

        }

        componentWillReceiveProps(nextProps, nextContext) {

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

        async handleRegionChanges(value){
            let arrayRegions = [];
            if (value === 'ALL') {
                arrayRegions.push('EU')
                arrayRegions.push('US')
            } else {
                arrayRegions.push(value);
            }

            this.setState({
                loading0: true,
                appInstanceListSortByCloudlet: [],
            })
            let appInstanceList = await fetchAppInstanceList(arrayRegions);
            let appInstanceListSortByCloudlet = reducer.groupBy(appInstanceList, 'Cloudlet');
            await this.setState({
                appInstanceListSortByCloudlet,
                loading0: false,
            })
        }

        renderHeader() {

            let options1 = [
                {value: 'ALL', text: 'ALL'},
                {value: 'EU', text: 'EU'},
                {value: 'US', text: 'US'},

            ]

            return (

                <FlexBox className='' style={{marginRight: 23}}>
                    {this.state.loading &&
                    <FlexBox style={{position: 'absolute', top: '2%', left: '15%'}}>
                        <CircularProgress style={{color: '#79BF14'}}/>
                    </FlexBox>
                    }
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
                                    options={options1}
                                    defaultValue={options1[0].value}
                                    style={{width: 200}}
                                    onChange={async (e, {value}) => {
                                        this.handleRegionChanges(value)
                                    }}
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

        renderGrid = (appInstanceListSortByCloudlet: any) => {
            let boxWidth = window.innerWidth / 10 * 2.55;

            let cloudletCountList = []
            for (let i in appInstanceListSortByCloudlet) {
                console.log('renderGrid===title>', appInstanceListSortByCloudlet[i][0].Cloudlet);
                console.log('renderGrid===length>', appInstanceListSortByCloudlet[i].length);
                cloudletCountList.push({
                    name: appInstanceListSortByCloudlet[i][0].Cloudlet,
                    length: appInstanceListSortByCloudlet[i].length,
                })
            }

            function toChunkArray(myArray: any, chunkSize: any): any {
                let results = [];
                while (myArray.length) {
                    results.push(myArray.splice(0, chunkSize));
                }
                return results;
            }

            let chunkedArraysOfColSize = toChunkArray(cloudletCountList, 3);

            return (
                <div style={{}}>
                    {chunkedArraysOfColSize.map((colSizeArray, index) =>
                        <FlexBox style={{backgroundColor: 'black', width: boxWidth}} key={index.toString()}>
                            {colSizeArray.map((item) =>
                                <FlexBox style={{
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    margin: 5,
                                    backgroundColor: '#292929',
                                    flexDirection: 'column',
                                    width: (boxWidth) * 0.32,
                                    height: 115,

                                }}>
                                    <FlexBox style={{
                                        fontSize: 13,
                                        color: '#fff',
                                        marginTop: 10,
                                    }}>
                                        {item.name.toString().substring(0, 13) + "..."}
                                    </FlexBox>
                                    <FlexBox style={{
                                        marginTop: 0,
                                        fontSize: 50,
                                        color: '#29a1ff',
                                    }}>
                                        {item.length}
                                    </FlexBox>

                                </FlexBox>
                            )}
                        </FlexBox>
                    )}

                </div>
            );
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
                                <FlexBox style={{marginTop: 35,}}>
                                    {/* ___col___1*/}
                                    {/* ___col___1*/}
                                    {/* ___col___1*/}
                                    <FlexBox style={Styles.box001}>
                                        <FlexBox style={{width: '100%', backgroundColor: 'transparent'}}>
                                            <FlexBox style={Styles.box002}>
                                                Status Of Launch
                                            </FlexBox>
                                            <FlexBox style={{flex: 30}}>
                                                {/*alksdaskdlaksdlka*/}
                                            </FlexBox>
                                        </FlexBox>
                                        <FlexBox style={{marginTop: 0, backgroundColor: 'red'}}>
                                            {this.state.loading0 ? renderPlaceHolder() : this.renderGrid(this.state.appInstanceListSortByCloudlet)}
                                        </FlexBox>

                                    </FlexBox>
                                    {/* ___col___2*/}
                                    {/* ___col___2*/}
                                    {/* ___col___2*/}
                                    <FlexBox style={Styles.box001}>
                                        <FlexBox style={{width: '100%', backgroundColor: 'transparent'}}>
                                            <FlexBox style={Styles.box002}>
                                                Top 5 of CPU Usage
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
                                            {this.state.loading ? renderPlaceHolder() : renderBarGraph2_Google()}
                                        </FlexBox>

                                    </FlexBox>
                                    {/* ___col___3*/}
                                    {/* ___col___3*/}
                                    {/* ___col___3*/}
                                    <FlexBox style={Styles.box001}>
                                        <FlexBox style={{width: '100%', backgroundColor: 'transparent'}}>
                                            <FlexBox style={Styles.box002}>
                                                Transition Of CPU
                                            </FlexBox>
                                            <FlexBox style={{flex: 30}}>
                                                {/*dummy____dummy*/}
                                            </FlexBox>
                                        </FlexBox>
                                        <FlexBox style={{marginTop: 0}}>
                                            {this.state.loading ? renderPlaceHolder() : renderLineGraph_Plot()}
                                        </FlexBox>

                                    </FlexBox>
                                </FlexBox>

                                {/*row_____22222222*/}
                                {/*row_____22222222*/}
                                {/*row_____22222222*/}
                                <FlexBox style={{marginTop: 70,}}>

                                    {/* ___col___4*/}
                                    {/* ___col___4*/}
                                    {/* ___col___4*/}
                                    <FlexBox style={Styles.box001}>
                                        <FlexBox style={{width: '100%', backgroundColor: 'transparent'}}>
                                            <FlexBox style={Styles.box002}>
                                                Perfomance Of Apps
                                            </FlexBox>
                                            <FlexBox style={{flex: 30}}>
                                                {/*dummy____dummy*/}
                                            </FlexBox>
                                        </FlexBox>

                                        <FlexBox style={{marginTop: 10}}>
                                            {this.state.loading ? renderPlaceHolder() : renderPieChart2_Google()}
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
                                            {this.state.loading ? renderPlaceHolder() : renderBarGraph2_Google()}
                                        </FlexBox>

                                    </FlexBox>
                                    {/* ___col___6*/}
                                    {/* ___col___6*/}
                                    {/* ___col___6*/}
                                    <FlexBox style={Styles.box001}>
                                        <FlexBox style={{width: '100%', backgroundColor: 'transparent'}}>
                                            <FlexBox style={Styles.box002}>
                                                Transition Of Mem
                                            </FlexBox>
                                            <FlexBox style={{flex: 30}}>
                                                {/*dummy____dummy*/}
                                            </FlexBox>
                                        </FlexBox>
                                        <FlexBox style={{marginTop: 0}}>
                                            {this.state.loading ? renderPlaceHolder() : renderLineGraph_Plot()}
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
        //backgroundColor: 'blue',
        backgroundColor: 'transparent',
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
