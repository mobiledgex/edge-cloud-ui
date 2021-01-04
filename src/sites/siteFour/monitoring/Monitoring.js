import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';

import { Card, LinearProgress } from '@material-ui/core'

import * as constant from './helper/Constant'
import * as dateUtil from '../../../utils/date_util'
import { fields, getUserRole, isAdmin, getOrganization } from '../../../services/model/format';

import MexWorker from '../../../services/worker/mex.worker.js'
import { sendRequest, sendRequests } from '../../../services/model/serverWorker'

import MonitoringToolbar from './toolbar/MonitoringToolbar'

import { HELP_MONITORING } from '../../../tutorial';
import { WORKER_MONITORING_SHOW } from '../../../services/worker/constant';

import MonitoringList from './list/MonitoringList'
import AppInstMonitoring from './modules/app/AppMonitoring'
import AppSkeleton from './modules/app/AppSkeleton'
import ClusterMonitoring from './modules/cluster/ClusterMonitoring'
import ClusterSkeleton from './modules/cluster/ClusterSkeleton'
import CloudletMonitoring from './modules/cloudlet/CloudletMonitoring'
import CloudletSkeleton from './modules/cloudlet/CloudletSkeleton'

import './common/PageMonitoringStyles.css'
import './style.css'
import { showOrganizations } from '../../../services/model/organization';

import sortBy from 'lodash/sortBy'
import { Skeleton } from '@material-ui/lab';

const defaultParent = () => {
    return constant.metricParentTypes[getUserRole().includes(constant.OPERATOR) ? 2 : 0]
}

const fetchMetricTypeField = (metricTypeKeys) => {
    return metricTypeKeys.map(metricType => { return metricType.field })
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
        let parent = defaultParent()
        this.state = {
            loading: false,
            minimize: false,
            duration: constant.relativeTimeRanges[0],
            range: timeRangeInMin(constant.relativeTimeRanges[0].duration),
            organizations: [],
            filter: { region: this.regions, search: '', parent, metricType: fetchMetricTypeField(parent.metricTypeKeys), summary: constant.summaryList[0] },
            avgData: {},
            rowSelected: 0,
            selectedOrg: undefined,
            showLoaded: false,
            listAction : {}
        }
        this.selectedRow = undefined
    }

    onCellClick = (region, value, key) => {
        this.setState(prevState => {
            let avgData = prevState.avgData
            let rowSelected = prevState.rowSelected
            avgData[region][key]['selected'] = !value['selected']
            rowSelected = avgData[region][key]['selected'] ? rowSelected + 1 : rowSelected - 1
            this.selectedRow = avgData[region][key]
            return { avgData, rowSelected}
        })
    }

    onToolbarClick = (action) =>{
        this.setState({listAction:{action:action, data:this.selectedRow}})
    }

    onRefreshChange = (value) => {
        let interval = value.duration
        if (this.refreshId) {
            clearInterval(this.refreshId)
        }
        if (interval > 0) {
            this.refreshId = setInterval(() => {
                this.setState({ range: timeRangeInMin(this.state.duration.duration) })
            }, interval * 1000);
        }
    }

    onTimeRange = (value) => {
        if (this.refreshId) {
            clearInterval(this.refreshId)
        }
        this.setState({ range: value })
    }

    onRelativeTime = (duration) => {
        this.setState({ duration, range: timeRangeInMin(duration.duration) })
    }

    onRefresh = () => {
        this.setState({ range: timeRangeInMin(this.state.duration.duration) })
    }

    onParentChange = () => {
        this.fetchShowData()
    }

    onOrgChange = (value) => {
        let selectedOrg = value[fields.organizationName]
        this.setState({ selectedOrg }, () => {
            this.defaultStructure()
            this.fetchShowData()
        })
    }

    onToolbar = async (action, value) => {
        if (action === constant.ACTION_ORG || action === constant.ACTION_MINIMIZE || action === constant.ACTION_REFRESH_RATE || action === constant.ACTION_TIME_RANGE || action === constant.ACTION_RELATIVE_TIME || action === constant.ACTION_REFRESH) {
            switch (action) {
                case constant.ACTION_REFRESH_RATE:
                    this.onRefreshChange(value)
                    break;
                case constant.ACTION_TIME_RANGE:
                    this.onTimeRange(value)
                    break;
                case constant.ACTION_RELATIVE_TIME:
                    this.onRelativeTime(value)
                    break;
                case constant.ACTION_REFRESH:
                    this.onRefresh()
                    break;
                case constant.ACTION_MINIMIZE:
                    this.setState(prevState => ({ minimize: !prevState.minimize }))
                    break;
                case constant.ACTION_ORG:
                    this.onOrgChange(value)
                    break;
            }
        }
        else {
            this.setState(prevState => {
                let filter = prevState.filter
                switch (action) {
                    case constant.ACTION_REGION:
                        filter.region = value
                        break;
                    case constant.ACTION_METRIC_PARENT_TYPE:
                        filter.parent = value
                        break;
                    case constant.ACTION_METRIC_TYPE:
                        filter.metricType = value
                        break;
                    case constant.ACTION_SUMMARY:
                        filter.summary = value
                        break;
                    case constant.ACTION_SEARCH:
                        filter.search = value
                        break;
                }
                return filter
            }, () => {
                if (action === constant.ACTION_METRIC_PARENT_TYPE) {
                    this.onParentChange()
                }
            })
        }
    }

    updateAvgData = (avgData) => {
        this.setState({ avgData })
    }

    render() {
        const { loading, minimize, filter, range, duration, organizations, avgData, rowSelected, selectedOrg, showLoaded, listAction } = this.state
        return (
            <div style={{ flexGrow: 1 }} mex-test="component-monitoring">
                <Card>
                    {loading ? <LinearProgress /> : null}
                    <MonitoringToolbar regions={this.regions} organizations={organizations} range={range} duration={duration} filter={filter} onChange={this.onToolbar} />
                </Card>
                <div style={{margin:1}}></div>
                {showLoaded ? <React.Fragment>
                    <MonitoringList data={avgData} filter={filter} onCellClick={this.onCellClick} minimize={minimize} rowSelected={rowSelected} onToolbarClick={this.onToolbarClick}/>
                    <AppInstMonitoring avgData={avgData} updateAvgData={this.updateAvgData} filter={filter} rowSelected={rowSelected} range={range} minimize={minimize} selectedOrg={selectedOrg} listAction={listAction}/>
                    <ClusterMonitoring avgData={avgData} updateAvgData={this.updateAvgData} filter={filter} rowSelected={rowSelected} range={range} minimize={minimize} selectedOrg={selectedOrg} />
                    <CloudletMonitoring avgData={avgData} updateAvgData={this.updateAvgData} filter={filter} rowSelected={rowSelected} range={range} minimize={minimize} selectedOrg={selectedOrg} />
                </React.Fragment> :
                    <React.Fragment>
                        <Skeleton variant="rect" height={170}/>
                        <AppSkeleton filter={filter} />
                        <ClusterSkeleton filter={filter} />
                        <CloudletSkeleton filter={filter}/>
                    </React.Fragment>}

            </div>
        )
    }

    showResponse = (parent, region, mcList) => {
        const worker = new MexWorker();
        let avgData = this.state.avgData
        let parentId = parent.id
        worker.postMessage({ type: WORKER_MONITORING_SHOW, parentId, region, data: mcList, avgData, metricListKeys: parent.metricListKeys })
        worker.addEventListener('message', event => {
            let avgData = event.data.avgData
            this.setState(prevState => {
                let preAvgData = prevState.avgData
                preAvgData[region] = avgData[region]
                return { preAvgData }
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
                                return showRequest({ region, org: isAdmin() ? this.state.selectedOrg : getOrganization() })
                            })
                            this.setState({ loading: true })
                            sendRequests(this, requestList).addEventListener('message', event => {
                                count = count - 1
                                if (count === 0) {
                                    this.setState({ loading: false, showLoaded: true })
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
            if (constant.validateRole(parent.role) && parentId === this.state.filter.parent.id) {
                this.regions.map((region) => {
                    avgData[region] = {}
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