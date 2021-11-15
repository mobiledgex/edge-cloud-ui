import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';

import { Card, ImageList } from '@material-ui/core'

import Module from './modules/Module'
import DragButton from './list/DragButton'

import Toolbar from './toolbar/MonitoringToolbar'
import Legend from './list/Legend';
import Map from './common/map/Map'

import './common/PageMonitoringStyles.css'
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
        this.tableRef = React.createRef()
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
                this.setState({ tools: undefined, legends:{} })
                wait = 100
            }
        }
        setTimeout(()=>{this.setState({ tools, refresh })}, wait)
        
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
                        <div id='legend-block' className="block block-1" ref={this.tableRef}>
                            <Legend tools={tools} data={legends} handleSelectionStateChange={this.handleSelectionStateChange} refresh={refresh}/>
                        </div>
                        <div style={{ position: 'relative', height: 4 }}>
                            <DragButton height={400} />
                        </div>
                        <div id='resource-block' className="block block-2">
                            <ImageList cols={4} rowHeight={300} >
                                <Map tools={tools} regions={tools.regions} data={legends} refresh={refresh}/>
                            </ImageList>
                            <ImageList cols={4} rowHeight={300}>
                                {tools.regions.map(region => (
                                    <Module key={region} region={region} moduleId={tools.moduleId} tools={tools} selection={selection} handleDataStateChange={this.handleDataStateChange} />
                                ))}
                            </ImageList>
                        </div>
                    </div>
                ) : null}
            </div>
        )
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