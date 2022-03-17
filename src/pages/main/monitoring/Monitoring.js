import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
import { redux_org } from '../../../helper/reduxData';

import Toolbar from './toolbar/MonitoringToolbar'

import { LS_LINE_GRAPH_FULL_SCREEN, } from '../../../helper/constant/perpetual';
import { HELP_MONITORING } from '../../../tutorial';

import { fetchOrgList } from './services/service';
import { equal } from '../../../helper/constant/operators';
import Show from './Show';
import { NoData } from '../../../helper/formatter/ui';
import './style.css'



class Monitoring extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tools: undefined,
            legends: undefined,
            selection: { count: 0 },
            refresh: false,
            organizations: [],
            loading: false
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

    handleToolbarChange = (tools) => {
        let preTools = this.state.tools
        let refresh = this.state.refresh
        let wait = 0
        if (preTools) {
            if (preTools.moduleId !== tools.moduleId || !equal(preTools.organization, tools.organization)) {
                //reset components if moduleId change
                this.updateState({ tools: undefined, legends: {} })
                wait = 100
            }
            else if (preTools.search !== tools.search || preTools.stats !== tools.stats || !equal(preTools.visibility, tools.visibility)) {
                refresh = !refresh
            }
        }
        setTimeout(() => { this.updateState({ tools, refresh }) }, wait)
    }

    render() {
        const { tools, organizations, loading } = this.state
        return (
            <div mex-test="component-monitoring" style={{ position: 'relative' }}>
                <Toolbar onChange={this.handleToolbarChange} organizations={organizations} />
                <div className="outer" style={{ height: 'calc(100vh - 106px)' }}>
                    {
                        tools && tools.organization ? (
                            <Show tools={tools} />
                        ) : <NoData loading={loading} />
                    }
                </div>
            </div>
        )
    }

    initOrgList = async () => {
        this.updateState({ loading: true })
        if (redux_org.isAdmin(this)) {
            let organizations = await fetchOrgList()
            this.updateState({ organizations, loading: false })
        }
    }

    componentDidUpdate() {

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