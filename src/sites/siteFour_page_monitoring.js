import React from 'react';
import {withRouter} from 'react-router-dom';
import {Grid} from 'semantic-ui-react';
//redux
import {connect} from 'react-redux';
import * as actions from '../actions';
import './siteThree.css';

import StatusOfLaunch from '../container/monitoring/statusOfLaunch';
import PerformanceOfApp from '../container/monitoring/performanceOfApp';
import CPUGraph from '../container/monitoring/cpuGraph';
import CPUChart from '../container/monitoring/cpuChart';
import MemoryGraph from '../container/monitoring/memoryGraph';
import MemoryChart from '../container/monitoring/memoryChart';
import PerformanceOfAppTable from '../container/monitoring/performanceOfAppTable';
import * as AppinstCloudletService from './methods/appinstCloudletService'

let _self = null;
let rgn = ['US', 'KR', 'EU'];

class SiteFourPageMonitoring extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            devData:[],
            stateLaunchData:[]
        };
        this._AppInstDummy = [];
        this._diffRev = []
    }

    gotoUrl(site, subPath) {
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;

    }

    //go to
    gotoPreview(site) {
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = 'pg=0';
        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: {some: 'state'}
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath: mainPath, subPath: subPath})

    }


    componentWillMount() {
        //this.setState({bodyHeight: (window.innerHeight - this.headerH)})
        //this.setState({contHeight: (window.innerHeight - this.headerH) / 2 - this.hgap})
    }

    componentDidMount() {
        // get data of appinst


    }

    receiveCloudletData (result) {
        console.log('20191220 receive cloudlet data -- ', result)
        _self.setState({stateLaunchData:result})
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.regionInfo.region.length) {
            //AppinstCloudletService.setProps(nextProps.regionInfo.region, nextProps, this.receiveCloudletData);
            AppinstCloudletService.getDataofAppinst(nextProps.changeRegion,nextProps.regionInfo.region);
        }
    }

    render() {
        let {stateLaunchData} = this.state;
        return (


            <Grid style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                padding: "20px",
                background: "#292c33"}}
                columns='equal'
            >

                <Grid.Row>
                    <Grid.Column>
                        <StatusOfLaunch title={'StatusOfLaunch'} data={stateLaunchData} rgn={this.props.regionInfo.region}></StatusOfLaunch>
                    </Grid.Column>
                    <Grid.Column>
                        <CPUGraph title={'Top5 of CPU'}></CPUGraph>
                    </Grid.Column>
                    <Grid.Column>
                        <CPUChart title={'Transition of CPU'}></CPUChart>
                    </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                    <Grid.Column>
                        <PerformanceOfApp title={'PerformanceOfApp'}></PerformanceOfApp>
                    </Grid.Column>
                    <Grid.Column>
                        <MemoryGraph title={'Memory'}></MemoryGraph>
                    </Grid.Column>
                    <Grid.Column>
                        <MemoryChart title={'Memory'}></MemoryChart>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <PerformanceOfAppTable title={'PerformanceOfAppTable'}></PerformanceOfAppTable>
                    </Grid.Column>
                </Grid.Row>

            </Grid>

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
    let regionInfo = (state.regionInfo)?state.regionInfo:null;
    return {
        computeRefresh: (state.computeRefresh) ? state.computeRefresh : null,
        changeRegion: state.changeRegion.region ? state.changeRegion.region : null,
        regionInfo: regionInfo,
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteFourPageMonitoring));
