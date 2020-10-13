import React from 'react'
import * as serverData from '../../../services/model/serverData'
import * as dateUtil from '../../../utils/date_util'
import { fields, getUserRole } from '../../../services/model/format'
import {Card, LinearProgress } from '@material-ui/core'
import MonitoringList from './list/MonitoringList'
import randomColor from 'randomcolor'
import meanBy from 'lodash/meanBy'
import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'
import MonitoringToolbar from './toolbar/MonitoringToolbar'
import { summaryList, metricParentTypes, OPERATOR } from './helper/Constant'
import AppInstMonitoring from './modules/app/AppMonitoring'
import ClusterMonitoring from './modules/cluster/ClusterMonitoring'
import CloudletMonitoring from './modules/cloudlet/CloudletMonitoring'
import './style.css'
class Monitoring extends React.Component {
    constructor(props) {
        super(props)
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        let defaultMetricParentTypes = metricParentTypes[getUserRole().includes(OPERATOR) ? 2 : 0]
        this.state = {
            loading: false,
            chartData: {},
            avgData: {},
            rowSelected:undefined,
            filter: { region: this.regions, search: '', metricType: defaultMetricParentTypes.metricTypeKeys, summary: summaryList[0], parent: defaultMetricParentTypes }
        }
        this.requestCount = 0
    }

    validateRegionFilter = (region) => {
        let regionFilter = this.state.filter[fields.region]
        return regionFilter.includes(region)
    }

    onCellClick = (region, value, key) => {
        let avgData = this.state.avgData
        avgData[this.state.filter.parent.id][region][key]['selected'] = !value['selected']
        this.setState({ avgData })
    }

    onToolbar = (filter) => {
        this.setState({ filter })
    }

    

    onAction = (data) => {
        this.setState({rowSelected:data})
    }

    render() {
        const { chartData, avgData, loading, filter, rowSelected } = this.state
        const chartDataParent = chartData[filter.parent.id]
        const avgDataParent = avgData[filter.parent.id] ? avgData[filter.parent.id] : {}
        return (
            <div style={{ flexGrow: 1 }} mex-test="component-monitoring">
                <Card>
                    {loading ? <LinearProgress /> : null}
                    <MonitoringToolbar regions={this.regions} metricTypeKeys={filter.parent.metricTypeKeys} onUpdateFilter={this.onToolbar}/>
                    <MonitoringList data={avgDataParent} filter={filter} onCellClick={this.onCellClick} onAction={this.onAction}/>
                </Card>
                <AppInstMonitoring chartData={chartDataParent} avgData={avgDataParent} filter={filter} row={rowSelected}/>
                <ClusterMonitoring chartData={chartDataParent} avgData={avgDataParent} filter={filter}/>
                <CloudletMonitoring chartData={chartDataParent} avgData={avgDataParent} filter={filter}/>
            </div>

        )
    }

    metricKeyGenerator = (parentTypeId, region, metric) => {
        return `${parentTypeId}-${metric.serverField}${metric.subId ? `-${metric.subId}` : ''}-${region}`
    }

    timeRangeInMin = (range) => {
        let endtime = dateUtil.currentUTCTime()
        let starttime = dateUtil.subtractMins(range, endtime).valueOf()
        starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
        endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
        return { starttime, endtime }
    }

    avgCalculator = async (parent, data, region, metricType, metric) => {
        setTimeout(() => {
            let avgData = this.state.avgData
            let avgDataList = avgData[parent.id][region]
            avgDataList = avgDataList ? avgDataList : []
            Object.keys(data.values).map(key => {
                let value = data.values[key][0]

                let avg = meanBy(data.values[key], v => (v[metric.position]))
                let max = maxBy(data.values[key], v => (v[metric.position]))[metric.position]
                let min = minBy(data.values[key], v => (v[metric.position]))[metric.position]

                let avgKey = ''
                data.columns.map((column, i) => {
                    if (i !== 0) {
                        avgKey += i === 1 ? value[i] : `_${value[i]}`
                    }
                })

                let avgValues = avgDataList[key]

                if (avgValues === undefined) {
                    avgValues = {}
                    data.columns.map((column, i) => {
                        avgValues[column.serverField] = value[i]
                    })
                    avgValues['color'] = randomColor({
                        count: 1,
                    })[0]
                    avgValues['selected'] = false
                }

                let avgUnit = metric.unit ? metric.unit(avg) : avg
                let maxUnit = metric.unit ? metric.unit(max) : max
                let minUnit = metric.unit ? metric.unit(min) : min
                avgValues[metric.field] = [avgUnit, minUnit, maxUnit]
                avgDataList[key] = avgValues
            })
            avgData[parent.id][region] = avgDataList
                
            this.setState({ avgData })
        }, 100)
    }

    serverRequest = async (parent, serverField, requestData) => {
        this.setState({ loading: true })
        let mcRequest = await serverData.sendRequest(this, requestData)
        this.requestCount -= 1
        if (this.requestCount === 0) {
            this.setState({ loading: false })
        }
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            parent.metricTypeKeys.map(metric => {
                if (metric.serverField === serverField) {
                    let requestData = mcRequest.request.data
                    let region = requestData.region
                    let data = mcRequest.response.data
                    let chartData = this.state.chartData
                    let objectId = `${parent.id}-${serverField}`
                    if (data[objectId]) {
                        let newData = {}
                        newData.region = region
                        newData.metric = metric
                        newData.values = data[objectId].values
                        newData.columns = data[objectId].columns
                        let metricKey = this.metricKeyGenerator(parent.id, region, metric)
                        chartData[parent.id][region][metricKey] = newData
                        this.avgCalculator(parent, chartData[parent.id][region][metricKey], region, metricKey, metric)
                        console.log('Rahul1234', chartData)
                        this.setState({ chartData })
                    }
                }
            })

        }
    }

    fetchDefaultData = () => {
        metricParentTypes.map(parent => {
            if (getUserRole() && getUserRole().includes(parent.role)) {
                this.regions.map(region => {
                    parent.metricTypeKeys.map(metric => {
                        if (metric.serverRequest) {
                            this.requestCount += 1
                        }
                    })
                })
            }
        })
        let range = this.timeRangeInMin(2)

        if (this.regions && this.regions.length > 0) {
            metricParentTypes.map(parent => {
                if (getUserRole() && getUserRole().includes(parent.role)) {
                    this.regions.map(region => {
                        parent.metricTypeKeys.map(metric => {
                            if (metric.serverRequest) {
                                let data = {}
                                data[fields.region] = region
                                data[fields.starttime] = range.starttime
                                data[fields.endtime] = range.endtime
                                data[fields.selector] = metric.serverField
                                this.serverRequest(parent, metric.serverField, parent.request(data))
                            }
                        })
                    })
                }
            })
        }
    }

    componentDidMount() {
        let chartData = {}
        let avgData = {}
        metricParentTypes.map(parent => {
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
        this.fetchDefaultData()
    }
}

export default Monitoring