import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';

import { Card } from '@material-ui/core'

import * as constant from './helper/montconstant'
import * as dateUtil from '../../../utils/date_util'
import { fields } from '../../../services/model/format';
import { redux_org, redux_private } from '../../../helper/reduxData';

import MonitoringToolbar from './toolbar/MonitoringToolbar'

import { HELP_MONITORING } from '../../../tutorial';

import MonitoringList from './list/MonitoringList'
import AppInstMonitoring from './modules/app/AppMonitoring'
import AppSkeleton from './modules/app/AppSkeleton'
import ClusterMonitoring from './modules/cluster/ClusterMonitoring'
import ClusterSkeleton from './modules/cluster/ClusterSkeleton'
import CloudletMonitoring from './modules/cloudlet/CloudletMonitoring'
import CloudletSkeleton from './modules/cloudlet/CloudletSkeleton'
import DragButton from './list/DragButton'
//services
import { showOrganizations } from '../../../services/modules/organization';
import ShowWorker from './services/show.worker.js'
import { processWorker } from '../../../services/worker/interceptor'

import './common/PageMonitoringStyles.css'
import './style.css'

import sortBy from 'lodash/sortBy'
import { Skeleton } from '@material-ui/lab';
import { monitoringPref, PREF_M_APP_VISIBILITY, PREF_M_CLOUDLET_VISIBILITY, PREF_M_CLUSTER_VISIBILITY, PREF_M_REGION } from '../../../utils/sharedPreferences_util';
import isEqual from 'lodash/isEqual';
import { authSyncRequest, multiAuthSyncRequest } from '../../../services/service';
import { LS_LINE_GRAPH_FULL_SCREEN, PARENT_APP_INST, PARENT_CLOUDLET, PARENT_CLUSTER_INST } from '../../../helper/constant/perpetual';
import isEmpty from 'lodash/isEmpty';
import { NoData } from '../../../helper/formatter/ui';

const defaultParent = (self) => {
    return constant.metricParentTypes()[redux_org.isOperator(self) ? 2 : 0]
}

const defaultMetricType = (self, parent) => {
    let id = parent.id
    let metricTypeKeys = constant.visibility(parent.id)
    let pref = id === PARENT_CLOUDLET ? PREF_M_CLOUDLET_VISIBILITY : id === PARENT_CLUSTER_INST ? PREF_M_CLUSTER_VISIBILITY : PREF_M_APP_VISIBILITY
    let monitoringPrefs = monitoringPref(self, pref)
    return monitoringPrefs ? metricTypeKeys.map(data => { if (monitoringPrefs.includes(data.header)) { return data.field } }) : metricTypeKeys.map(metricType => { return metricType.field })
}

const timeRangeInMin = (range) => {
    let endtime = dateUtil.currentUTCTime()
    let starttime = dateUtil.subtractMins(range, endtime).valueOf()
    starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
    endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
    return { starttime, endtime }
}

const defaultRegion = (self, regions) => {
    return monitoringPref(self, PREF_M_REGION) ? monitoringPref(self, PREF_M_REGION) : regions
}

class Monitoring extends React.Component {
    constructor(props) {
        super(props)
        this.regions = this.props.regions
        let parent = defaultParent(this)
        this.state = {
            maxHeight: 0,
            duration: constant.relativeTimeRanges[3],
            range: timeRangeInMin(constant.relativeTimeRanges[3].duration),
            organizations: [],
            filter: { region: defaultRegion(this, this.regions), search: '', parent, metricType: defaultMetricType(this, parent), summary: constant.summaryList[0] },
            avgData: {},
            rowSelected: 0,
            selectedOrg: undefined,
            showLoaded: false,
            listAction: undefined
        }
        this._isMounted = false
        this.tableRef = React.createRef()
        this.selectedRow = undefined

    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    onCellClick = (value) => {
        const { region, key, selected } = value
        if (this._isMounted) {
            this.setState(prevState => {
                let avgData = prevState.avgData
                let rowSelected = prevState.rowSelected
                avgData[region][key]['selected'] = !selected
                rowSelected = avgData[region][key]['selected'] ? rowSelected + 1 : rowSelected - 1
                this.selectedRow = avgData[region][key]
                return { avgData, rowSelected }
            })
        }
    }

    onListToolbarClick = (action) => {
        this.updateState({ listAction: { action: action, data: this.selectedRow } })
    }

    onActionClick = (action, data) => {
        this.updateState({ listAction: { ...action, data } })
    }

    onActionClose = () => {
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
        if (redux_org.isOperator(this) && this.state.filter.parent.id !== PARENT_CLOUDLET) {
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
            this.setState({ showLoaded: false, selectedOrg, rowSelected: 0 }, () => {
                this.setState({ avgData: this.defaultStructure() }, () => {
                    this.fetchShowData()
                })
            })
        }
    }

    onToolbar = async (action, value) => {
        if (action === constant.ACTION_ORG || action === constant.ACTION_REFRESH_RATE || action === constant.ACTION_TIME_RANGE || action === constant.ACTION_RELATIVE_TIME || action === constant.ACTION_REFRESH) {
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
                            filter.metricType = defaultMetricType(this, value)
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
                        let metricInfo = avgDataRegion[dataKey][metric.field]
                        let newMetricInfo = data[dataKey][metric.field]
                        avgDataRegion[dataKey][metric.field] = metricInfo ? { ...metricInfo, ...newMetricInfo } : newMetricInfo
                    }
                })
                return { avgData }
            })
        }
    }

    showAlert = (type, message) => {
        this.props.handleAlertInfo(type, message)
    }

    renderMonitoringParent = () => {
        const { filter, range, avgData, rowSelected, selectedOrg, listAction } = this.state
        const { organizationInfo, privateAccess } = this.props
        let parentId = filter.parent.id
        if (parentId === PARENT_APP_INST) {
            return <AppInstMonitoring orgInfo={organizationInfo} privateAccess={privateAccess} showAlert={this.showAlert} avgData={avgData} regions={this.regions} updateAvgData={this.updateAvgData} filter={filter} rowSelected={rowSelected} range={range} selectedOrg={selectedOrg} listAction={listAction} onActionClose={this.onActionClose} />
        }
        else if (parentId === PARENT_CLUSTER_INST) {
            return <ClusterMonitoring avgData={avgData} regions={this.regions} updateAvgData={this.updateAvgData} filter={filter} rowSelected={rowSelected} range={range} selectedOrg={selectedOrg} />
        }
        else if (parentId === PARENT_CLOUDLET) {
            return <CloudletMonitoring avgData={avgData} regions={this.regions} updateAvgData={this.updateAvgData} filter={filter} rowSelected={rowSelected} range={range} selectedOrg={selectedOrg} listAction={listAction} onActionClose={this.onActionClose} />
        }
    }

    render() {
        const { filter, range, duration, organizations, avgData, rowSelected, showLoaded, selectedOrg, maxHeight } = this.state
        return (
            <div mex-test="component-monitoring" style={{ position: 'relative' }}>
                <Card style={{ height: 50, marginBottom: 2 }}>
                    <MonitoringToolbar selectedOrg={selectedOrg} regions={this.regions} organizations={organizations} range={range} duration={duration} filter={filter} onChange={this.onToolbar} />
                </Card>
                <React.Fragment>
                    {showLoaded ?
                        <div className="outer" style={{ height: 'calc(100vh - 106px)' }}>
                            {
                                !isEmpty(avgData) ?
                                    <React.Fragment>
                                        <div className="block block-1" ref={this.tableRef}>
                                            <MonitoringList id={filter.parent.id} data={avgData} filter={filter} onCellClick={this.onCellClick} onActionClick={this.onActionClick} rowSelected={rowSelected} onToolbarClick={this.onListToolbarClick} />
                                        </div>
                                        <div style={{ position: 'relative', height: 4 }}>
                                            <DragButton height={maxHeight} />
                                        </div>
                                        <div className="block block-2">
                                            {this.renderMonitoringParent()}
                                        </div>
                                    </React.Fragment> :
                                    <NoData />
                            }
                        </div> :
                        <React.Fragment>
                            <div className="outer" style={{ height: 'calc(100vh - 106px)' }}>
                                <Skeleton variant="rect" height={'25%'} style={{ marginBottom: 3 }} />
                                <AppSkeleton filter={filter} />
                                <ClusterSkeleton filter={filter} />
                                <CloudletSkeleton filter={filter} />
                            </div>
                        </React.Fragment>
                    }
                </React.Fragment>
            </div>
        )
    }

    fetchShowData = async () => {
        const { filter } = this.state
        let parent = filter.parent
        let parentId = parent.id
        if (this.regions && this.regions.length > 0 && constant.validateRole(parent.role, redux_org.roleType(this))) {
            let count = this.regions.length
            this.regions.forEach(async (region) => {
                let showRequests = parent.showRequest
                let requestList = []
                requestList = showRequests.map(showRequest => {
                    let org = redux_org.isAdmin(this) ? this.state.selectedOrg : redux_org.nonAdminOrg(this)
                    return showRequest(this, { region, org, type: this.orgType, isPrivate: redux_private.isPrivate(this) })
                })
                let mcList = await multiAuthSyncRequest(this, requestList, false)
                if (mcList && mcList.length > 0) {
                    count = count - 1
                    let worker = ShowWorker()
                    let response = await processWorker(worker, {
                        requestList,
                        parentId,
                        region,
                        mcList,
                        metricListKeys: parent.metricListKeys,
                        isOperator: redux_org.isOperator(this)
                    })
                    worker.terminate()
                    if (response.status === 200 && response.list && response.data) {
                        if (this._isMounted) {
                            this.setState(prevState => {
                                let avgData = prevState.avgData
                                avgData[region] = response.data
                                avgData['filterList'] = avgData['filterList'] ? avgData['filterList'] : {}
                                avgData['filterList'][region] = response.list
                                return { avgData }
                            }, () => {
                                if (count === 0) {
                                    this.updateState({ showLoaded: true })
                                }
                            })
                        }
                    }
                }
                else {
                    this.updateState({ showLoaded: true, avgData: {} })
                }
            })
        }
    }

    fetchOrgList = async () => {
        let mc = await authSyncRequest(this, showOrganizations())
        if (mc && mc.response && mc.response.status === 200) {
            let organizations = sortBy(mc.response.data, [item => item[fields.organizationName].toLowerCase()], ['asc']);
            this.updateState({ organizations })
        }
    }

    defaultStructure = () => {
        let avgData = {}
        let parent = this.state.filter.parent
        if (constant.validateRole(parent.role, redux_org.roleType(this))) {
            this.regions.map((region) => {
                avgData[region] = {}
            })
        }
        return avgData
    }

    componentDidUpdate(preProps, preState) {
        let privateAccess = this.props.privateAccess
        if (this.tableRef.current && this.state.maxHeight !== this.tableRef.current.scrollHeight) {
            this.setState({ maxHeight: this.tableRef.current.scrollHeight })
        }
        if (privateAccess && !isEqual(preProps.privateAccess, privateAccess)) {
            this.isAccessPrivate()
        }
        else if (this.props.organizationInfo && !isEqual(this.props.organizationInfo, preProps.organizationInfo)) {
            let parent = defaultParent(this)
            this.setState(prevState => {
                let filter = prevState.filter
                filter.metricType = defaultMetricType(this, parent)
                filter.parent = parent
                return { avgData: this.defaultStructure(), filter, showLoaded: false }
            }, () => {
                if (redux_org.isAdmin(this)) {
                    this.fetchOrgList()
                }
                else {
                    this.fetchShowData()
                }
            })
        }
    }

    isAccessPrivate = () => {
        if (redux_private.isPrivate(this)) {
            this.privateRegions = this.props.privateAccess.regions
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.isAccessPrivate()
        this.props.handleViewMode(HELP_MONITORING)
        if (this._isMounted) {
            this.setState({ avgData: this.defaultStructure() }, () => {
                if (redux_org.isAdmin(this)) {
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