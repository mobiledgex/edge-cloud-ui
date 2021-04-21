import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';

import { Card, LinearProgress } from '@material-ui/core'

import * as constant from './helper/Constant'
import * as dateUtil from '../../../utils/date_util'
import { fields, getUserRole, isAdmin, getOrganization } from '../../../services/model/format';

import MonitoringToolbar from './toolbar/MonitoringToolbar'

import { HELP_MONITORING } from '../../../tutorial';

import MonitoringList from './list/MonitoringList'
import AppInstMonitoring from './modules/app/AppMonitoring'
import AppSkeleton from './modules/app/AppSkeleton'
import ClusterMonitoring from './modules/cluster/ClusterMonitoring'
import ClusterSkeleton from './modules/cluster/ClusterSkeleton'
import CloudletMonitoring from './modules/cloudlet/CloudletMonitoring'
import CloudletSkeleton from './modules/cloudlet/CloudletSkeleton'

//services
import { showOrganizations } from '../../../services/model/organization';
import ShowWorker from './services/show.worker.js'
import { processWorker } from '../../../services/worker/interceptor'
import { sendRequest, sendMultiRequest } from './services/service'

import './common/PageMonitoringStyles.css'
import './style.css'

import sortBy from 'lodash/sortBy'
import { Skeleton } from '@material-ui/lab';
import { monitoringPref, PREF_M_APP_VISIBILITY, PREF_M_CLOUDLET_VISIBILITY, PREF_M_CLUSTER_VISIBILITY, PREF_M_REGION } from '../../../utils/sharedPreferences_util';
import { OPERATOR } from '../../../constant';
import isEqual from 'lodash/isEqual';

const defaultParent = () => {
    return constant.metricParentTypes()[getUserRole().includes(constant.OPERATOR) ? 2 : 0]
}

const defaultMetricType = (parent) => {
    let id = parent.id
    let metricTypeKeys = constant.visibility(parent.id)
    let pref = id === constant.PARENT_CLOUDLET ? PREF_M_CLOUDLET_VISIBILITY : id === constant.PARENT_CLUSTER_INST ? PREF_M_CLUSTER_VISIBILITY : PREF_M_APP_VISIBILITY
    let monitoringPrefs = monitoringPref(pref)
    return monitoringPrefs ? metricTypeKeys.map(data => { if (monitoringPrefs.includes(data.header)) { return data.field } }) : metricTypeKeys.map(metricType => { return metricType.field })
}

const timeRangeInMin = (range) => {
    let endtime = dateUtil.currentUTCTime()
    let starttime = dateUtil.subtractMins(range, endtime).valueOf()
    starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
    endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
    return { starttime, endtime }
}

const defaultRegion = (regions) => {
    return monitoringPref(PREF_M_REGION) ? monitoringPref(PREF_M_REGION) : regions
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
            filter: { region: defaultRegion(this.regions), search: '', parent, metricType: defaultMetricType(parent), summary: constant.summaryList[0] },
            avgData: {},
            rowSelected: 0,
            selectedOrg: undefined,
            showLoaded: false,
            listAction: undefined,
            isPrivate: false
        }
        this._isMounted = false
        this.selectedRow = undefined
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    onCellClick = (region, value, key) => {
        if (this._isMounted) {
            this.setState(prevState => {
                let avgData = prevState.avgData
                let rowSelected = prevState.rowSelected
                avgData[region][key]['selected'] = !value['selected']
                rowSelected = avgData[region][key]['selected'] ? rowSelected + 1 : rowSelected - 1
                this.selectedRow = avgData[region][key]
                return { avgData, rowSelected }
            })
        }
    }

    onListToolbarClick = (action) => {
        this.updateState({ listAction: { action: action, data: this.selectedRow } })
    }

    onListToolbarClear = () => {
        this.updateState({ listAction: undefined })
    }

    onRefreshChange = (value) => {
        let interval = value.duration
        if (this.refreshId) {
            clearInterval(this.refreshId)
        }
        if (interval > 0) {
            this.refreshId = setInterval(() => {
                this.updateState({ range: timeRangeInMin(this.state.duration.duration) })
            }, interval * 1000);
        }
    }

    onTimeRange = (value) => {
        if (this.refreshId) {
            clearInterval(this.refreshId)
        }
        this.updateState({ range: value })
    }

    onRelativeTime = (duration) => {
        this.updateState({ duration, range: timeRangeInMin(duration.duration) })
    }

    onRefresh = () => {
        this.updateState({ range: timeRangeInMin(this.state.duration.duration) })
    }

    onParentChange = async () => {
        if (getUserRole().includes(OPERATOR) && this.state.filter.parent.id !== constant.PARENT_CLOUDLET) {
            this.regions = this.privateRegions
        }
        else {
            this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        }
        this.setState(prevState => {
            let filter = prevState.filter
            filter.region = this.regions
            return { filter }
        }, () => {
            this.fetchShowData()
        })
    }

    onOrgChange = (value) => {
        let selectedOrg = value[fields.organizationName]
        this.orgType = value[fields.type]
        if (this._isMounted) {
            this.setState({ loading: true, showLoaded: false, selectedOrg }, () => {
                this.setState({ avgData: this.defaultStructure() }, () => {
                    this.fetchShowData()
                })
            })
        }
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
            if (this._isMounted) {
                this.setState(prevState => {
                    let filter = prevState.filter
                    switch (action) {
                        case constant.ACTION_REGION:
                            filter.region = value
                            break;
                        case constant.ACTION_METRIC_PARENT_TYPE:
                            filter.parent = value
                            filter.metricType = defaultMetricType(value)
                            return { filter, showLoaded: false, avgData: this.defaultStructure() }
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
                    return { filter }
                }, () => {
                    if (action === constant.ACTION_METRIC_PARENT_TYPE) {
                        this.onParentChange()
                    }
                })
            }
        }
    }

    updateAvgData = (region, metric, data) => {
        if (this._isMounted) {
            this.setState(prevState => {
                let avgData = prevState.avgData
                Object.keys(data).map(dataKey => {
                    let avgDataRegion = avgData[region]
                    if (avgDataRegion[dataKey]) {
                        avgDataRegion[dataKey][metric.field] = data[dataKey][metric.field]
                    }
                })
                return { avgData }
            })
        }
    }

    renderMonitoringParent = () => {
        const { minimize, filter, range, avgData, rowSelected, selectedOrg, listAction, isPrivate } = this.state
        let parentId = filter.parent.id
        if (parentId === constant.PARENT_APP_INST) {
            return <AppInstMonitoring avgData={avgData} regions={this.regions} updateAvgData={this.updateAvgData} filter={filter} rowSelected={rowSelected} range={range} minimize={minimize} selectedOrg={selectedOrg} listAction={listAction} onListToolbarClear={this.onListToolbarClear} isPrivate={isPrivate} />
        }
        else if (parentId === constant.PARENT_CLUSTER_INST) {
            return <ClusterMonitoring avgData={avgData} regions={this.regions} updateAvgData={this.updateAvgData} filter={filter} rowSelected={rowSelected} range={range} minimize={minimize} selectedOrg={selectedOrg} isPrivate={isPrivate} />
        }
        else if (parentId === constant.PARENT_CLOUDLET) {
            return <CloudletMonitoring avgData={avgData} updateAvgData={this.updateAvgData} filter={filter} rowSelected={rowSelected} range={range} minimize={minimize} selectedOrg={selectedOrg} onListToolbarClear={this.onListToolbarClear} />
        }
    }

    render() {
        const { loading, minimize, filter, range, duration, organizations, avgData, rowSelected, showLoaded, isPrivate } = this.state
        return (
            <div style={{ flexGrow: 1 }} mex-test="component-monitoring">
                <Card>
                    {loading ? <LinearProgress /> : null}
                    <MonitoringToolbar regions={this.regions} organizations={organizations} range={range} duration={duration} filter={filter} onChange={this.onToolbar} isPrivate={isPrivate} />
                </Card>
                <React.Fragment>
                    <div style={{ margin: 1 }}></div>
                    {showLoaded ?
                        <React.Fragment>
                            <MonitoringList data={avgData} filter={filter} onCellClick={this.onCellClick} minimize={minimize} rowSelected={rowSelected} onToolbarClick={this.onListToolbarClick} />
                            {this.renderMonitoringParent()}
                        </React.Fragment> :
                        <React.Fragment>
                            <Skeleton variant="rect" height={180} />
                            <AppSkeleton filter={filter} />
                            <ClusterSkeleton filter={filter} />
                            <CloudletSkeleton filter={filter} />
                        </React.Fragment>
                    }
                </React.Fragment>
            </div>
        )
    }

    fetchShowData = async () => {
        const { filter, isPrivate } = this.state
        let parent = filter.parent
        let parentId = parent.id
        if (this.regions && this.regions.length > 0 && constant.validateRole(parent.role)) {
            let count = this.regions.length
            this.updateState({ loading: true })
            this.regions.forEach(async (region) => {
                let showRequests = parent.showRequest
                let requestList = []
                requestList = showRequests.map(showRequest => {
                    let org = isAdmin() ? this.state.selectedOrg : getOrganization()
                    return showRequest({ region, org, type: this.orgType, isPrivate })
                })
                let mcList = await sendMultiRequest(this, requestList)
                if (mcList && mcList.length > 0) {
                    count = count - 1
                    let worker = ShowWorker()
                    let response = await processWorker(worker, {
                        requestList,
                        parentId,
                        region,
                        mcList,
                        metricListKeys: parent.metricListKeys
                    })
                    worker.terminate()
                    if (response.status === 200) {
                        if (this._isMounted) {
                            this.setState(prevState => {
                                let avgData = prevState.avgData
                                avgData[region] = response.data
                                return { avgData }
                            }, () => {
                                if (count === 0) {
                                    this.updateState({ loading: false, showLoaded: true })
                                }
                            })
                        }
                    }
                }
            })
        }
    }

    fetchOrgList = async () => {
        let mc = await sendRequest(this, showOrganizations(), true)
        if (mc && mc.response && mc.response.status === 200) {
            let organizations = sortBy(mc.response.data, [item => item[fields.organizationName].toLowerCase()], ['asc']);
            this.updateState({ organizations })
        }
    }

    defaultStructure = () => {
        let avgData = {}
        let parent = this.state.filter.parent
        if (constant.validateRole(parent.role)) {
            this.regions.map((region) => {
                avgData[region] = {}
            })
        }
        return avgData
    }

    componentDidUpdate(preProps, preState) {
        let privateAccess = this.props.privateAccess
        if (privateAccess && !isEqual(preProps.privateAccess, privateAccess)) {
            this.isAccessPrivate(privateAccess)
        }
    }

    isAccessPrivate = (privateAccess) => {
        if (privateAccess) {
            let isPrivate = privateAccess.isPrivate
            if (isPrivate) {
                this.privateRegions = privateAccess.regions
            }
            this.setState({ isPrivate })
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.isAccessPrivate(this.props.privateAccess)
        this.props.handleViewMode(HELP_MONITORING)
        if (this._isMounted) {
            this.setState({ avgData: this.defaultStructure() }, () => {
                if (isAdmin()) {
                    this.fetchOrgList()
                }
                else {
                    this.fetchShowData()
                }
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapStateToProps = (state) => {
    return {
        privateAccess: state.privateAccess.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(Monitoring));