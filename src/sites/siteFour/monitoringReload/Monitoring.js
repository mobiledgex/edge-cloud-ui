import React from 'react'
import * as dateUtil from '../../../utils/date_util'
import { fields, getUserRole } from '../../../services/model/format'
import { Card, LinearProgress } from '@material-ui/core'
import MonitoringList from './list/MonitoringList'
import MonitoringToolbar from './toolbar/MonitoringToolbar'
import * as constant from './helper/Constant'
import AppInstMonitoring from './modules/app/AppMonitoring'
import ClusterMonitoring from './modules/cluster/ClusterMonitoring'
import CloudletMonitoring from './modules/cloudlet/CloudletMonitoring'
import './style.css'
import MexWorker from '../../../services/worker/mex.worker.js'
import {WORKER_METRIC} from '../../../services/worker/constant'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../../../actions';
import {sendRequests} from '../../../services/model/serverWorker'

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
        this.defaultMetricParentTypes = constant.metricParentTypes[getUserRole().includes(constant.OPERATOR) ? 2 : 0]
        this.state = {
            loading: false,
            chartData: {},
            avgData: {},
            rowSelected: 0,
            filter: { region: this.regions, search: '', metricType: fetchMetricTypeField(this.defaultMetricParentTypes.metricTypeKeys), summary: constant.summaryList[0], parent: this.defaultMetricParentTypes },
            duration:constant.relativeTimeRanges[0],
            range : timeRangeInMin(constant.relativeTimeRanges[0].duration)
        }
        this.refreshId = undefined;
        this.requestCount = 0
    }

    validateRegionFilter = (region) => {
        let regionFilter = this.state.filter[fields.region]
        return regionFilter.includes(region)
    }

    onCellClick = (region, value, key) => {
        let avgData = this.state.avgData
        let rowSelected = this.state.rowSelected
        avgData[this.state.filter.parent.id][region][key]['selected'] = !value['selected']
        rowSelected = avgData[this.state.filter.parent.id][region][key]['selected'] ? rowSelected + 1 : rowSelected - 1
        this.setState({ avgData, rowSelected })
    }

    onRefreshChange = (value) => {
        let interval = value.duration
        if (this.refreshId) {
            clearInterval(this.refreshId)
        }
        if (interval > 0) {
            this.refreshId = setInterval(() => {
                this.setState({ range: timeRangeInMin(this.state.duration.duration) }, () => {
                
                    this.fetchMetricData()
                })
            }, interval * 1000);
        }
    }

    onTimeRange = (value) => {
        if (this.refreshId) {
            clearInterval(this.refreshId)
        }
        this.setState({range : value}, ()=>{
            this.fetchMetricData()
        })
    }

    onRelativeTime = (duration) => {
        this.setState({ duration, range: timeRangeInMin(duration.duration) }, () => {
            this.fetchMetricData()
        })
    }

    onRefresh = () =>{
        this.setState({ range: timeRangeInMin(this.state.duration.duration) }, () => {
            this.fetchMetricData()
        })
    }

    onParentChange = () =>{
        this.fetchMetricData()
    }
    
    onToolbar = async (action, value) => {
        if (action === constant.ACTION_REFRESH_RATE || action === constant.ACTION_TIME_RANGE || action === constant.ACTION_RELATIVE_TIME  || action === constant.ACTION_REFRESH) {
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
            }, ()=>{
                if(action === constant.ACTION_METRIC_PARENT_TYPE)
                {
                    this.onParentChange()
                }
            })
        }
    }

    onAction = (data) => {
        this.setState({ rowSelected: data })
    }

    render() {
        const { chartData, avgData, loading, filter, rowSelected, range, duration } = this.state
        const chartDataParent = chartData[filter.parent.id]
        const avgDataParent = avgData[filter.parent.id] ? avgData[filter.parent.id] : {}
        return (
            <div style={{ flexGrow: 1 }} mex-test="component-monitoring">
                <Card>
                    {loading ? <LinearProgress/> : null}
                    <MonitoringToolbar defaultParent={this.defaultMetricParentTypes} regions={this.regions} metricTypeKeys={this.defaultMetricParentTypes.metricTypeKeys} onChange={this.onToolbar} range={range} duration={duration} />
                    <MonitoringList data={avgDataParent} filter={filter} onCellClick={this.onCellClick} onAction={this.onAction} />
                </Card>
                <AppInstMonitoring chartData={chartDataParent} avgData={avgDataParent} filter={filter} rowSelected={rowSelected} range={range} />
                <ClusterMonitoring chartData={chartDataParent} avgData={avgDataParent} filter={filter} rowSelected={rowSelected} range={range} />
                <CloudletMonitoring chartData={chartDataParent} avgData={avgDataParent} filter={filter} rowSelected={rowSelected} range={range} />
            </div>

        )
    }

    metricKeyGenerator = (parentTypeId, region, metric) => {
        return `${parentTypeId}-${metric.serverField}${metric.subId ? `-${metric.subId}` : ''}-${region}`
    }

    processMetricData = (parent, serverField, region, metricDataList, showList) => {
        const worker = new MexWorker();
        let avgData = this.state.avgData
        worker.postMessage({ type: WORKER_METRIC, metric: metricDataList, show: showList, parentId: parent.id, region: region, metricTypeKeys: parent.metricTypeKeys, avgData:avgData })
        worker.addEventListener('message', event => {
            let chartData = event.data.chartData
            let avgData = event.data.avgData
            this.setState(prevState => {
                let preChartData = prevState.chartData
                let preAvgData = prevState.avgData
                preChartData[parent.id][region] = chartData[parent.id][region]
                preAvgData[parent.id][region] = avgData[parent.id][region]
                return { preChartData, preAvgData }
            })
        });
    }

    serverRequest = (parent, serverField, mcRequestList, region) => {
        let showList = []
        let metricData = {}
        if (mcRequestList && mcRequestList.length > 0) {
            mcRequestList.map(mcRequest => {
                if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
                    let request = mcRequest.request
                    let method = request.method
                    let data = mcRequest.response.data
                    if (method === parent.request({}).method) {
                        metricData = data
                    }
                    else if (method === parent.showRequest({}).method) {
                        showList = data
                    }
                }
            })
            this.processMetricData(parent, serverField, region, metricData, showList)
        }
    }

    fetchMetricData = () => {
        let count = this.regions.length
        if (this.regions && this.regions.length > 0) {
            constant.metricParentTypes.map(parent => {
                if (getUserRole() && getUserRole().includes(parent.role) && parent === this.state.filter.parent) {
                    this.regions.map(region => {
                        parent.metricTypeKeys.map(metric => {
                            if (metric.serverRequest) {
                                let data = {}
                                data[fields.region] = region
                                data[fields.starttime] = this.state.range.starttime
                                data[fields.endtime] = this.state.range.endtime
                                data[fields.selector] = '*'

                                let metricRequest = parent.request(data)
                                let showRequest = parent.showRequest({region})

                                this.setState({ loading: true })
                                sendRequests(this, [metricRequest, showRequest]).addEventListener('message', event => {
                                    count = count - 1
                                    if (count === 0) {
                                        this.setState({ loading: false })
                                    }
                                    if (event.data.status && event.data.status !== 200) {
                                        this.props.handleAlertInfo(event.data.message)
                                    }
                                    else {
                                        this.serverRequest(parent, metric.serverField, event.data, region)
                                    }
                                });
                            }
                        })
                    })
                }
            })
        }
    }

    defaultDataStructure = () => {
        let chartData = {}
        let avgData = {}
        constant.metricParentTypes.map(parent => {
            if (getUserRole() && getUserRole().includes(parent.role)) {
                chartData[parent.id] = {}
                avgData[parent.id] = {}
                this.regions.map((region) => {
                    chartData[parent.id][region] = {}
                    avgData[parent.id][region] = {}
                    parent.metricTypeKeys.map(metric => {
                        let metricData = {}
                        metricData[fields.region] = region
                        metricData[fields.metric] = metric
                        chartData[parent.id][region][this.metricKeyGenerator(parent.id, region, metric)] = metricData
                    })
                })
            }
        })
        this.setState({ chartData, avgData })
    }

    componentDidMount() {
        this.defaultDataStructure()
        this.fetchMetricData()
    }

    componentWillUnmount(){
        clearInterval(this.refreshId)
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(Monitoring));