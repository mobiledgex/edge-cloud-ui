import React from 'react';
import sizeMe from 'react-sizeme';
import {withRouter} from 'react-router-dom';

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

let _self = null;
let rgn = ['US', 'KR', 'EU'];

class SiteFourPageMonitoring extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
        };
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
        this.setState({bodyHeight: (window.innerHeight - this.headerH)})
        this.setState({contHeight: (window.innerHeight - this.headerH) / 2 - this.hgap})
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps, nextContext) {

        this.setState({bodyHeight: (window.innerHeight - this.headerH)})
        this.setState({contHeight: (nextProps.size.height - this.headerH) / 2 - this.hgap})

    }

    render() {

        return (


            <div style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                padding: "20px",
                background: "#292c33"}}>
                <StatusOfLaunch title={'StatusOfLaunch'}></StatusOfLaunch>
                <PerformanceOfApp title={'PerformanceOfApp'}></PerformanceOfApp>
                <CPUGraph title={'CPU'}></CPUGraph>
                <CPUChart title={'CPU'}></CPUChart>
                <MemoryGraph title={'Memory'}></MemoryGraph>
                <MemoryChart title={'Memory'}></MemoryChart>
                <PerformanceOfAppTable title={'PerformanceOfAppTable'}></PerformanceOfAppTable>

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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({monitorHeight: true})(SiteFourPageMonitoring)));