import 'react-hot-loader'
import React from 'react';
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import FlexBox from "flexbox-react";
import {hot} from "react-hot-loader/root";
import Plot from 'react-plotly.js';
import {Dropdown, Grid, Input,} from "semantic-ui-react";
import {DatePicker} from 'antd';
import {formatDate, getTodayDate} from "../utils";
// import './PageMonitoring.css';
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

        async handleRegionChanges(value) {
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

            return (
                <Grid.Row className='content_title'
                          style={{width: 'fit-content', display: 'inline-block'}}>
                    <Grid.Column className='title_align'
                                 style={{lineHeight: '36px'}}>Monitoring</Grid.Column>
                    <div style={{marginLeft: '10px'}}>
                        <button className="ui circular icon button"><i aria-hidden="true"
                                                                       className="info icon"></i></button>
                    </div>

                </Grid.Row>


            )
        }

        renderSelectBox(){

            let options1 = [
                {value: 'ALL', text: 'ALL'},
                {value: 'EU', text: 'EU'},
                {value: 'US', text: 'US'},

            ]

            return (

                <div className='page_monitoring_select_row'>
                    <div className='page_monitoring_select_area'>
                        <label className='page_monitoring_select_reset'
                               onClick={() => {
                                   alert('Reset All')
                               }}>Reset All</label>
                        <Dropdown
                            placeholder='REGION'
                            selection
                            options={options1}
                            defaultValue={options1[0].value}
                            onChange={async (e, {value}) => {
                                this.handleRegionChanges(value)
                            }}
                        />
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
                        />
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
                        />
                        <div className='page_monitoring_datepicker_area'>
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
                            <div style={{fontSize: 25, marginLeft: 3, marginRight: 3,}}>
                                -
                            </div>
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
                        </div>

                    </div>
                </div>

            )
        }

        renderGrid = (appInstanceListSortByCloudlet: any) => {
            // let boxWidth = window.innerWidth / 10 * 2.55;

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

            console.log('chunkedArraysOfColSize_length===>', chunkedArraysOfColSize.length);
            //console.log('chunkedArraysOfColSize[0]===>', chunkedArraysOfColSize[0].length);

            return (
                <div style={{display:'flex', flexDirection:'column', width:'100%'}}>
                    {chunkedArraysOfColSize.map((colSizeArray, index) =>
                        <div className='page_monitoring_grid' key={index.toString()}>
                            {colSizeArray.map((item) =>
                                <div className='page_monitoring_grid_box_layout'>
                                    <div className='page_monitoring_grid_box'>
                                        <div className='page_monitoring_grid_box_name'>
                                            {item.name}
                                            {/*{item.name.toString().substring(0, 17) + "..."}*/}
                                        </div>
                                        <div className='page_monitoring_grid_box_num'>
                                            {item.length}
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/*@todo:first row만 존재할경우 2nd row를 공백으로 채워주는 로직*/}
                    {/*@todo:first row만 존재할경우 2nd row를 공백으로 채워주는 로직*/}
                    {/*@todo:first row만 존재할경우 2nd row를 공백으로 채워주는 로직*/}
                    {chunkedArraysOfColSize.length === 1 &&
                    <div className='page_monitoring_grid'>
                        {[1, 2, 3].map((item) =>
                            <div>
                                <div style={{
                                    fontSize: 15,
                                    color: '#fff',
                                    marginTop: 10,
                                }}>
                                    {/*blank*/}
                                </div>
                                <div style={{
                                    marginTop: 0,
                                    fontSize: 50,
                                    color: 'transprent',
                                }}>
                                    {/*blank*/}
                                </div>

                            </div>
                        )}
                    </div>

                    }

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

                        <Grid.Row className='site_content_body'>
                            <Grid.Column>
                                <div className="table-no-resized"
                                     style={{height: '100%', display: 'flex', overflow: 'hidden'}}>


                                    <div className="page_monitoring">
                                        {this.renderSelectBox()}
                                        <div className='page_monitoring_dashboard'>
                                            {/*_____row____1111*/}
                                            <div className='page_monitoring_row'>
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                {/* ___col___1*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Status Of Launch
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading0 ? renderPlaceHolder() : this.renderGrid(this.state.appInstanceListSortByCloudlet)}
                                                    </div>
                                                </div>
                                                {/* ___col___2*/}
                                                {/* ___col___2*/}
                                                {/* ___col___2*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Top 5 of CPU Usage
                                                        </div>
                                                        <div className='page_monitoring_column_select'>
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
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderBarGraph2_Google()}
                                                    </div>
                                                </div>
                                                {/* ___col___3*/}
                                                {/* ___col___3*/}
                                                {/* ___col___3*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Transition Of CPU
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderLineGraph_Plot()}
                                                    </div>
                                                </div>
                                            </div>

                                            {/*row_____22222222*/}
                                            {/*row_____22222222*/}
                                            {/*row_____22222222*/}
                                            <div className='page_monitoring_row'>

                                                {/* ___col___4*/}
                                                {/* ___col___4*/}
                                                {/* ___col___4*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Perfomance Of Apps
                                                        </div>
                                                    </div>

                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderPieChart2_Google()}
                                                    </div>

                                                </div>
                                                {/* ___col___5*/}
                                                {/* ___col___5*/}
                                                {/* ___col___5*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            State of MEM Usage
                                                        </div>
                                                        <div className='page_monitoring_column_select'>
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
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderBarGraph2_Google()}
                                                    </div>

                                                </div>
                                                {/* ___col___6*/}
                                                {/* ___col___6*/}
                                                {/* ___col___6*/}
                                                <div className='page_monitoring_column'>
                                                    <div className='page_monitoring_title_area'>
                                                        <div className='page_monitoring_title'>
                                                            Transition Of Mem
                                                        </div>
                                                    </div>
                                                    <div className='page_monitoring_container'>
                                                        {this.state.loading ? renderPlaceHolder() : renderLineGraph_Plot()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid.Column>

                </Grid.Row>


            );
        }

    }
))));
