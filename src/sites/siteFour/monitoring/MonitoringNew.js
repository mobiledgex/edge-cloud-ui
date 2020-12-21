import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';

import { Card, LinearProgress } from '@material-ui/core'

import * as constant from './helper/Constant'
import * as dateUtil from '../../../utils/date_util'
import { getUserRole, isAdmin } from '../../../services/model/format';

import MexWorker from '../../../services/worker/mex.worker.js'
import { sendRequest, sendRequests } from '../../../services/model/serverWorker'

import MonitoringToolbar from './toolbar/MonitoringToolbar'

import './style.css'
import { HELP_MONITORING } from '../../../tutorial';
import { WORKER_MONITORING_SHOW } from '../../../services/worker/constant';
import MonitoringList from './list/MonitoringList'

const defaultParent = () => {
    return constant.metricParentTypes[getUserRole().includes(constant.OPERATOR) ? 2 : 0]
}

const timeRangeInMin = (range) => {
    let endtime = dateUtil.currentUTCTime()
    let starttime = dateUtil.subtractMins(range, endtime).valueOf()
    starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
    endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
    return { starttime, endtime }
}

class Monitoring extends React.Component {
    constructor(props) {
        super(props)
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.state = {
            loading: false,
            minimize: false,
            duration: constant.relativeTimeRanges[0],
            range: timeRangeInMin(constant.relativeTimeRanges[0].duration),
            organizations: [],
            filter: { region: this.regions, search: '', parent: defaultParent() },
            avgData: {}
        }
    }

    onCellClick = (region, value, key) => {

    }

    onToolbar = async (action, value) => {

    }

    render() {
        const { loading, minimize, filter, range, duration, organizations, avgData} = this.state
        const avgDataParent = avgData[filter.parent.id] ? avgData[filter.parent.id] : {}
        return (
            <div style={{ flexGrow: 1 }} mex-test="component-monitoring">
                <Card>
                    {loading ? <LinearProgress /> : null}
                    <MonitoringToolbar regions={this.regions} organizations={organizations} range={range} duration={duration} filter={filter} onChange={this.onToolbar} />\
                    <MonitoringList data={avgDataParent} filter={filter} onCellClick={this.onCellClick} minimize={minimize} />
                </Card>

            </div>
        )
    }

    showResponse = (parent, region, mcList) => {
        const worker = new MexWorker();
        let avgData = this.state.avgData
        let parentId = parent.id
        worker.postMessage({ type: WORKER_MONITORING_SHOW, parentId, region, data: mcList, avgData })
        worker.addEventListener('message', event => {
            let avgData = event.data.avgData
            this.setState(prevState => {
                let preAvgData = prevState.avgData
                preAvgData[parentId][region] = avgData[parentId][region]
                return { preAvgData }
            }, () => {
                console.log('Rahul1234', this.state.avgData)
            })
        });
    }

    fetchShowData = () => {
        const { filter } = this.state
        if (this.regions && this.regions.length > 0) {
            {
                let count = this.regions.length
                constant.metricParentTypes.map(parent => {
                    let parentId = parent.id
                    if (constant.validateRole(parent.role) && parentId === filter.parent.id) {
                        this.regions.map(region => {
                            let showRequests = parent.showRequest
                            let requestList = []
                            requestList = showRequests.map(showRequest => {
                                return showRequest({ region })
                            })
                            this.setState({ loading: true })
                            sendRequests(this, requestList).addEventListener('message', event => {
                                count = count - 1
                                if (count === 0) {
                                    this.setState({ loading: false })
                                }
                                if (event.data.status && event.data.status !== 200) {
                                    this.props.handleAlertInfo(event.data.message)
                                }
                                else {
                                    this.showResponse(parent, region, event.data)
                                }
                            });
                        })
                    }
                })
            }
        }
    }

    orgResponse = (mc) => {
        if (mc && mc.response && mc.response.status === 200) {
            let organizations = sortBy(mc.response.data, [item => item[fields.organizationName].toLowerCase()], ['asc']);
            this.setState({ organizations })
        }
    }

    defaultStructure = () => {
        let avgData = {}
        constant.metricParentTypes.map(parent => {
            let parentId = parent.id
            if (constant.validateRole(parent.role)) {
                avgData[parentId] = {}
                this.regions.map((region) => {
                    avgData[parentId][region] = {}
                })
            }
        })
        this.setState({ avgData })
    }

    componentDidMount() {
        this.props.handleViewMode(HELP_MONITORING)
        this.defaultStructure()
        if (isAdmin()) {
            sendRequest(this, showOrganizations(), this.orgResponse)
        }
        else {
            this.fetchShowData()
        }
    }

    componentWillUnmount() {

    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(Monitoring));