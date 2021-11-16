import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { Card } from '@material-ui/core'
import * as actions from '../../../actions';

import Toolbar from './toolbar/MonitoringToolbar'
import AppMonitoring from './modules/app/AppMonitoring';
import CloudletMonitoring from './modules/cloudlet/CloudletMonitoring';
import ClusterMonitoring from './modules/cluster/ClusterMonitoring';

import { LS_LINE_GRAPH_FULL_SCREEN, PARENT_APP_INST, PARENT_CLOUDLET, PARENT_CLUSTER_INST } from '../../../helper/constant/perpetual';
import { HELP_MONITORING } from '../../../tutorial';

import './PageMonitoringStyles.css'
import './style.css'
class Monitoring extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tools: undefined,
            legends: {},
            selection: { count: 0 },
            refresh: false
        }
        this._isMounted = false
        //filter resources based on legendList
        this.legendList = {}
    }

    handleSelectionStateChange = (selection) => {
        this.setState({ selection })
    }

    handleDataStateChange = (region, data) => {
        this.setState(prevState => {
            let legends = prevState.legends
            let refresh = !prevState.refresh
            let dataKeys = Object.keys(data)
            dataKeys.forEach(key => {
                legends[key] = data[key]
            })
            return { legends, refresh }
        })
    }

    handleToolbarChange = (tools) => {
        let preTools = this.state.tools
        let refresh = this.state.refresh
        let wait = 0
        if (preTools) {
            if (preTools.search !== tools.search || preTools.stats !== tools.stats) {
                refresh = !refresh
            }
            else if (preTools.moduleId !== tools.moduleId) {
                //reset components if moduleId change
                this.setState({ tools: undefined, legends: {} })
                wait = 100
            }
        }
        setTimeout(() => { this.setState({ tools, refresh }) }, wait)

    }

    render() {
        const { tools, legends, selection, refresh } = this.state
        return (
            <div mex-test="component-monitoring" style={{ position: 'relative' }}>
                <Card style={{ height: 50, marginBottom: 2 }}>
                    <Toolbar onChange={this.handleToolbarChange} />
                </Card>
                {tools ? (
                    <div className="outer" style={{ height: 'calc(100vh - 106px)' }}>
                        {
                            tools.moduleId === PARENT_CLOUDLET ? <CloudletMonitoring tools={tools} legends={legends} selection={selection} refresh={refresh} handleDataStateChange={this.handleDataStateChange} handleSelectionStateChange={this.handleSelectionStateChange} /> :
                                tools.moduleId === PARENT_CLUSTER_INST ? <ClusterMonitoring tools={tools} legends={legends} selection={selection} refresh={refresh} handleDataStateChange={this.handleDataStateChange} handleSelectionStateChange={this.handleSelectionStateChange} /> :
                                    tools.moduleId === PARENT_APP_INST ? <AppMonitoring tools={tools} legends={legends} selection={selection} refresh={refresh} handleDataStateChange={this.handleDataStateChange} handleSelectionStateChange={this.handleSelectionStateChange}/> :
                                        null
                        }
                    </div>
                ) : null}
            </div>
        )
    }

    componentDidMount(){
        this.props.handleViewMode(HELP_MONITORING)
    }

    componentWillUnmount() {
        this._isMounted = false
        localStorage.removeItem(LS_LINE_GRAPH_FULL_SCREEN)
    }
}

const mapStateToProps = (state) => {
    return {
        privateAccess: state.privateAccess.data,
        organizationInfo: state.organizationInfo.data,
        regions: state.regionInfo.region
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(Monitoring));