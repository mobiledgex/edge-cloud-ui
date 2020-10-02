import React from 'react'
import AppInstLineChart from './linechart/MexLineChart'
import { appInstMetrics, appInstMetricTypeKeys, appMetricsListKeys, appMetricsKeys, summaryList } from '../../../../services/model/appMetrics'
import * as serverData from '../../../../services/model/serverData'
import * as dateUtil from '../../../../utils/date_util'
import { fields } from '../../../../services/model/format'
import { Grid, Card, LinearProgress } from '@material-ui/core'
import MexChartList from './MexChartList'
import randomColor from 'randomcolor'
import meanBy from 'lodash/meanBy'
import maxBy from 'lodash/maxBy'
import minBy from 'lodash/minBy'
import MonitoringToolbar from '../MonitoringToolbar'
class MexChart extends React.Component {
    constructor(props) {
        super(props)
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.state = {
            loading:false,
            chartData: {},
            avgData: {},
            filter:{region: this.regions, search: '', metricType: appInstMetricTypeKeys, summary:summaryList[0] }
        }
        this.requestCount = 0
    }

    validateRegionFilter = (region) => {
        let regionFilter = this.state.filter[fields.region]
        return regionFilter.includes(region)
    }

    onRowClick = (region, value, key)=>{
        let avgData = this.state.avgData
        avgData[region][key]['selected'] = !value['selected']
        this.setState({avgData})
    }

    onToolbar = (filter)=>{
        this.setState({filter})
    }

    render() {
        const { chartData, avgData, loading, filter } = this.state
        let xs = filter.region.length > 1
        return (
            <div style={{ flexGrow: 1}}>
                <Card>
                    {loading ? <LinearProgress /> : null}
                    <MonitoringToolbar regions={this.regions} metricKeys={appInstMetricTypeKeys} onUpdateFilter={this.onToolbar}/>
                    <MexChartList data={avgData} rows={appMetricsListKeys} filter={filter} onRowClick={this.onRowClick} />
                </Card>
                <div style={{ marginTop: 10 }} className='grid-charts'>
                    <Grid container spacing={1}>
                        {Object.keys(chartData).map((region, i) => {
                            if (this.validateRegionFilter(region)) {
                                let chartDataRegion = chartData[region]
                                let avgDataRegion = avgData[region] ? avgData[region] : {}

                                return (
                                    <Grid item xs={xs ? 6 : 12} key={i}>
                                        <Grid container spacing={1}>
                                            {Object.keys(chartDataRegion).map((key, j) => {
                                                return filter.metricType.includes(chartDataRegion[key].metric) ?
                                                    <Grid  key={j} item xs={xs ? 12 : 6}>
                                                        <Card style={{ padding: 10, marginTop: 10, height: '100%' }}>
                                                            <AppInstLineChart id={key} data={chartDataRegion[key]} avgDataRegion={avgDataRegion} globalFilter={filter} tags={[2, 3, 4]} tagFormats={['', '[', '[']} />
                                                        </Card>
                                                    </Grid> : null
                                            })}
                                        </Grid>
                                    </Grid>
                                )
                            }
                        })}
                    </Grid>
                </div>
            </div>

        )
    }

    metricKeyGenerator = (region, metric) => {
        return `appinst-${metric.serverField}${metric.subId ? `-${metric.subId}` : ''}-${region}`
    }

    timeRangeInMin = (range) => {
        let endtime = dateUtil.currentUTCTime()
        let starttime = dateUtil.subtractMins(range, endtime).valueOf()
        starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
        endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
        return { starttime, endtime }
    }

    avgCalculator = async (data, region, metricType, metric) => {
        setTimeout(() => {
            let avgData = this.state.avgData
            let avgDataList = avgData[region]
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
            avgData[region] = avgDataList
            this.setState({ avgData })
        }, 100)
    }

    serverRequest = async (metric, requestData) => {
        this.setState({ loading: true })
        let mcRequest = await serverData.sendRequest(this, requestData)
        this.requestCount -= 1
        if (this.requestCount === 0) {
            this.setState({ loading: false })
        }
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            let requestData = mcRequest.request.data
            let region = requestData.region
            let data = mcRequest.response.data
            let chartData = this.state.chartData

            let objectId = `appinst-${metric.serverField}`
            if (data[objectId]) {
                data[objectId].region = region
                data[objectId].metric = metric

            
                let metricKey = this.metricKeyGenerator(region, metric)
                chartData[region][metricKey] = data[objectId]
                this.avgCalculator(chartData[region][metricKey], region, metricKey, metric)
                this.setState({ chartData })
            }
        }
    }

    fetchDefaultData = () => {
        this.requestCount = appInstMetricTypeKeys.length * this.regions.length
        let range = this.timeRangeInMin(20)
        if (this.regions && this.regions.length > 0) {
            this.regions.map(region => {
                appInstMetricTypeKeys.map(metric => {
                    let data = {}
                    data[fields.region] = region
                    data[fields.starttime] = range.starttime
                    data[fields.endtime] = range.endtime
                    data[fields.selector] = metric.serverField
                    this.serverRequest(metric, appInstMetrics(data))
                })
            })
        }
    }

    componentDidMount() {
        let chartData = {}
        let avgData = {}
        this.regions.map((region) => {
            chartData[region] = {}
            avgData[region] = {}
            appInstMetricTypeKeys.map(metric => {
                chartData[region][this.metricKeyGenerator(region, metric)] = { region, metric }
            })
        })
        this.setState({ chartData, avgData })
        this.fetchDefaultData()
    }
}

export default MexChart