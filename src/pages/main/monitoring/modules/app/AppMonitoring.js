/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../../../../../actions';
import { Card, ImageList, ImageListItem } from '@material-ui/core'

import Legend from '../../common/legend/Legend'
import Module from '../../common/Module'
import Map from '../../common/map/Map'
import VerticalSliderBtn from '../../../../../hoc/verticalSlider/VerticalSliderButton'
import AppClient from './AppClient'
import AppEvent from './AppEvent'
import DMEMetrics from '../../dme/DMEMetrics'
import AppInstClientMap from './AppInstClientMap'

import { requestLantency } from '../../services/service'
import { perpetual } from '../../../../../helper/constant'
import { localFields } from '../../../../../services/fields';

export const actionMenu = [
    { id: perpetual.ACTION_LATENCY_METRICS, label: 'Show Latency Metrics', roles: [perpetual.ADMIN, perpetual.DEVELOPER], group: true },
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
            let actionView = { id: action.id, data, group: action.group }
            this.setState({ actionView })
        }
    }

    render() {
        const { actionView } = this.state
        const { tools, legends, metricRequestData, loading, selection, handleDataStateChange, handleSelectionStateChange } = this.props
        const { moduleId, regions, search, range, organization, visibility } = tools
        return (
            <React.Fragment>
                <Legend id={moduleId} tools={tools} data={legends} loading={loading} handleAction={this.handleAction} actionMenu={actionMenu} handleSelectionStateChange={handleSelectionStateChange} groupBy={[localFields.region, localFields.appName, localFields.version]} />
                <div className='legend-drag-btn'>
                    <VerticalSliderBtn height={400} selector='block-1'/>
                </div>
                <div id='resource-block' className="block-2">
                    <ImageList cols={4} rowHeight={300} >
                        {
                            visibility.includes(localFields.client) ?
                                <ImageListItem cols={1}>
                                    <Card className='app-client'>
                                        <AppClient regions={regions} range={range} search={search} organization={organization} />
                                    </Card>
                                </ImageListItem> : null
                        }
                        {
                            visibility.includes(localFields.map) ? <ImageListItem cols={2}>
                                <Map moduleId={moduleId} search={search} regions={regions} data={legends} selection={selection} zoom={2} />
                            </ImageListItem> : null
                        }
                        {
                            visibility.includes(localFields.event) ?
                                <ImageListItem cols={1}>
                                    <Card className='window-height-300'>
                                        <AppEvent regions={regions} tools={tools} search={search} range={range} organization={organization} />
                                    </Card>
                                </ImageListItem> : null
                        }
                        {regions.map(region => (
                            legends && legends[region] ? <Module key={region} region={region} legends={legends[region]} metricRequestData={metricRequestData[region]} moduleId={moduleId} visibility={visibility} search={search} range={range} orgInfo={organization} selection={selection} handleDataStateChange={handleDataStateChange} /> : null
                        ))}
                    </ImageList>
                    {actionView && actionView.id === perpetual.ACTION_LATENCY_METRICS ? <DMEMetrics group={Boolean(actionView.group)} id={moduleId} onClose={() => { this.setState({ actionView: undefined }) }} data={[actionView.data]} /> : null}
                    {actionView && actionView.id === perpetual.ACTION_TRACK_DEVICES ? <AppInstClientMap onClose={() => { this.setState({ actionView: undefined }) }} data={actionView.data} /> : null}
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