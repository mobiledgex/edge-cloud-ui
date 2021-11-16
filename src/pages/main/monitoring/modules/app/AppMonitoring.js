import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../../../../../actions';
import { Card, ImageList, ImageListItem } from '@material-ui/core'

import Legend from '../../common/legend/Legend'
import Module from '../../common/Module'
import Map from '../../common/map/Map'
import DragButton from '../../list/DragButton'
import AppClient from './AppClient'
import AppEvent from './AppEvent'
import DMEMetrics from '../../dme/DMEMetrics'

import { requestLantency } from '../../services/service'
import { perpetual } from '../../../../../helper/constant'

export const actionMenu = [
    { id: perpetual.ACTION_LATENCY_METRICS, label: 'Show Latency Metrics', group: true },
    { id: perpetual.ACTION_REQUEST_LATENCY, label: 'Request Latency Metrics', roles: [perpetual.ADMIN, perpetual.DEVELOPER] },
    { id: perpetual.ACTION_TRACK_DEVICES, label: 'Track Devices', roles: [perpetual.ADMIN, perpetual.DEVELOPER] }
]
class AppMonitoring extends React.Component {
    constructor(props) {
        super()
        this.state = {
            actionView: {}
        }
    }

    handleAction = (action, data) => {
        if (action.id === perpetual.ACTION_REQUEST_LATENCY) {
            requestLantency(this, data)
        }
        else {
            let actionView = { id: action.id, data }
            this.setState({ actionView })
        }
    }

    render() {
        const { actionView } = this.state
        const { tools, legends, selection, refresh, handleDataStateChange, handleSelectionStateChange } = this.props
        const { moduleId, regions, range } = tools
        return (
            <React.Fragment>
                <Legend tools={tools} data={legends} handleAction={this.handleAction} actionMenu={actionMenu} handleSelectionStateChange={handleSelectionStateChange} refresh={refresh} />
                <div style={{ position: 'relative', height: 4 }}>
                    <DragButton height={400} />
                </div>
                <div id='resource-block' className="block block-2">
                    <ImageList cols={4} rowHeight={300} >
                        <ImageListItem cols={1}>
                            <Card style={{ height: 300, width: '100%' }}>
                                {/* <AppClient regions={regions} filter={tools} range={range} org={selectedOrg} privateAccess={privateAccess} orgInfo={orgInfo} /> */}
                            </Card>
                        </ImageListItem>
                        <ImageListItem cols={2}>
                            <Map tools={tools} regions={regions} data={legends} selection={selection} refresh={refresh} />
                        </ImageListItem>
                        <ImageListItem cols={1}>
                            <Card style={{ height: 300 }}>
                                {/* <AppEvent regions={regions} filter={filter} range={range} org={selectedOrg} avgData={avgData} orgInfo={orgInfo} /> */}
                            </Card>
                        </ImageListItem>
                        {regions.map(region => (
                            <Module key={region} region={region} moduleId={moduleId} tools={tools} selection={selection} handleDataStateChange={handleDataStateChange} />
                        ))}
                    </ImageList>
                    {actionView && actionView.id === perpetual.ACTION_LATENCY_METRICS ? <DMEMetrics group={false} id={moduleId} onClose={() => { this.setState({ actionView: undefined }) }} data={[actionView.data]} /> : null}
                </div>
            </React.Fragment>
        )
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(AppMonitoring));