import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';

import { Card, ImageList } from '@material-ui/core'

import { PARENT_CLOUDLET } from '../../../helper/constant/perpetual';

import Module from './modules/Module'

import * as dateUtil from '../../../utils/date_util'
import { relativeTimeRanges } from './helper/montconstant';
import './common/PageMonitoringStyles.css'
import './style.css'
import Legend from './list/Legend';

const timeRangeInMin = (range) => {
    let endtime = dateUtil.currentUTCTime()
    let starttime = dateUtil.subtractMins(range, endtime).valueOf()
    starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
    endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
    return { starttime: '2021-11-08T18:31:00+00:00', endtime: '2021-11-09T18:04:00+00:00' }
}

class Monitoring extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            moduleId: PARENT_CLOUDLET,
            tools: { regions: this.props.regions, range: timeRangeInMin(relativeTimeRanges[3].duration) },
            legends: {}
        }
        //filter resources based on legendList
        this.legendList = {}
    }

    handleDataStateChange = (region, data) => {
        this.setState(prevState => {
            let legends = prevState.legends
            legends[region] = data
            return { legends }
        })
    }

    render() {
        const { moduleId, tools, legends } = this.state
        const { regions } = tools
        return (
            <div mex-test="component-monitoring" style={{ position: 'relative' }}>
                <Card style={{ height: 50, marginBottom: 2 }}>
                </Card>
                <div className="outer" style={{ height: 'calc(100vh - 106px)' }}>
                    <Legend data={legends} regions={regions}/>
                    <ImageList cols={4} rowHeight={300}>
                        {regions.map(region => (
                            <Module key={region} region={region} moduleId={moduleId} tools={tools} handleDataStateChange={this.handleDataStateChange} />
                        ))}
                    </ImageList>
                </div>
            </div>
        )
    }

    componentDidMount() {
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