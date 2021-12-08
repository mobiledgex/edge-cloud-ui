import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { Card } from '@material-ui/core'
import * as actions from '../../../actions';
import { redux_org } from '../../../helper/reduxData';

import Toolbar from './toolbar/MonitoringToolbar'
import AppMonitoring from './modules/app/AppMonitoring';
import CloudletMonitoring from './modules/cloudlet/CloudletMonitoring';
import ClusterMonitoring from './modules/cluster/ClusterMonitoring';

import { LS_LINE_GRAPH_FULL_SCREEN, PARENT_APP_INST, PARENT_CLOUDLET, PARENT_CLUSTER_INST } from '../../../helper/constant/perpetual';
import { HELP_MONITORING } from '../../../tutorial';

import './PageMonitoringStyles.css'
import './style.css'
import { fetchOrgList } from './services/service';
import { equal } from '../../../helper/constant/operators';
import { NoData } from '../../../helper/formatter/ui';

class Monitoring extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tools: undefined,
            legends: {},
            selection: { count: 0 },
            refresh: false,
            organizations: [],
            loading:true
        }
        this._isMounted = false
        this.count = 0
        //filter resources based on legendList
        this.legendList = {}
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    handleSelectionStateChange = (selection) => {
        this.updateState({ selection })
    }

    handleDataStateChange = (data, init) => {
        if(init)
        {
            this.count = this.count + 1
            if(this.count === this.state.tools.regions.length)
            {
                this.count = 0
                this.updateState({loading:false})
            }
        }
        if (this._isMounted) {
            this.setState(prevState => {
                let legends = { ...prevState.legends }
                let refresh = !prevState.refresh
                let dataKeys = Object.keys(data)
                dataKeys.forEach(key => {
                    legends[key] = data[key]
                })
                return { legends, refresh }
            })
        }
    }

    handleToolbarChange = (tools) => {
        let preTools = this.state.tools
        let refresh = this.state.refresh
        let wait = 0
        if (preTools) {
            if (preTools.moduleId !== tools.moduleId || !equal(preTools.organization, tools.organization)) {
                //reset components if moduleId change
                this.updateState({ tools: undefined, legends: {}, loading: true })
                wait = 100
            }
            else if (preTools.search !== tools.search || preTools.stats !== tools.stats || !equal(preTools.visibility, tools.visibility)) {
                refresh = !refresh
            }
        }
        setTimeout(() => { this.updateState({ tools, refresh }) }, wait)

    }

    render() {
        const { tools, legends, selection, refresh, organizations, loading } = this.state
        return (
            <div mex-test="component-monitoring" style={{ position: 'relative' }}>
                <Card style={{ height: 50, marginBottom: 2 }}>
                    <Toolbar onChange={this.handleToolbarChange} organizations={organizations} />
                </Card>
                {
                    !loading && Object.keys(legends).length === 0 ? <div className="outer" style={{ height: 'calc(100vh - 106px)' }}><NoData /></div> : <React.Fragment>
                        {tools && tools.organization ? (
                            <div className="outer" style={{ height: 'calc(100vh - 106px)' }}>
                                {
                                    tools.moduleId === PARENT_CLOUDLET ? <CloudletMonitoring tools={tools} legends={legends} selection={selection} refresh={refresh} handleDataStateChange={this.handleDataStateChange} handleSelectionStateChange={this.handleSelectionStateChange} /> :
                                        tools.moduleId === PARENT_CLUSTER_INST ? <ClusterMonitoring tools={tools} legends={legends} selection={selection} refresh={refresh} handleDataStateChange={this.handleDataStateChange} handleSelectionStateChange={this.handleSelectionStateChange} /> :
                                            tools.moduleId === PARENT_APP_INST ? <AppMonitoring tools={tools} legends={legends} selection={selection} refresh={refresh} handleDataStateChange={this.handleDataStateChange} handleSelectionStateChange={this.handleSelectionStateChange} /> :
                                                null
                                }
                            </div>
                        ) : null
                        }
                    </React.Fragment>}
            </div>
        )
    }

    initOrgList = async () => {
        if (redux_org.isAdmin(this)) {
            let organizations = await fetchOrgList()
            this.updateState({ organizations })
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.props.handleViewMode(HELP_MONITORING)
        this.initOrgList()
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