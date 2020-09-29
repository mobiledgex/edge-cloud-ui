import React from 'react'
import AppInstLineChart from './linechart/MexLineChart'
import { appInstMetrics, appInstMetricTypeKeys, appMetricsListKeys } from '../../../../services/model/appMetrics'
import * as serverData from '../../../../services/model/serverData'
import * as dateUtil from '../../../../utils/date_util'
import { fields } from '../../../../services/model/format'
import { Grid, Card, Box, Typography, TextField } from '@material-ui/core'
import MexListViewer from '../../../../hoc/listView/ListViewer';
import randomColor from 'randomcolor'
import { Icon } from 'semantic-ui-react'
import meanBy from 'lodash/meanBy'
import cloneDeep from 'lodash/cloneDeep'
class MexChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chartData: {},
            chartFilter: {},
            avgDataList: []
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.filter = props.filter
        this.tempFilter = []
    }

    validateRegionFilter = (region) => {
        let regionFilter = this.filter[fields.region]
        return regionFilter === 'ALL' || region === regionFilter
    }

    legendClick = (filterKey) => {
        let chartFilter = this.state.chartFilter
        chartFilter[filterKey]['selected'] = !chartFilter[filterKey]['selected']
        this.setState({ chartFilter })
    }

    render() {
        const { chartData, chartFilter, avgDataList } = this.state

        return (
            <div style={{ flexGrow: 1, marginTop: 10 }}>
                <Card>
                    <MexListViewer keys={appMetricsListKeys} dataList={avgDataList} requestInfo={{}} selected={[]} style={{height:250, overflow: 'auto', marginTop:-40}}/>
                </Card>
                <div style={{ marginTop: 10 }}>
                    <Grid container spacing={1}>
                        {Object.keys(chartData).map((region, i) => {
                            if (this.validateRegionFilter(region)) {
                                let chartDataRegion = chartData[region]
                                return (
                                    <Grid item xs={6} key={i}>
                                        <Card style={{ padding: 10, height: '100%' }}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={3}>
                                                    <div className="grid-charts-header">
                                                        <div className="grid-charts-header-legend">
                                                            {
                                                                Object.keys(chartFilter).map((filterKey, j) => {
                                                                    let filter = chartFilter[filterKey]
                                                                    return filter.regions.includes(region) ?

                                                                        <div key={j} onClick={() => { this.legendClick(filterKey) }} className="grid-charts-legend" style={{ color: '#FFF' }}>

                                                                            <Box display="flex" p={1}>
                                                                                <Box order={1}>
                                                                                    <h4 className="grid-charts-legend-label">
                                                                                        <Icon name='circle' style={{ color: filter.color }} />{filter.label}
                                                                                    </h4>
                                                                                </Box>
                                                                                <Box order={2} style={{ marginLeft: 10 }}>
                                                                                    {filter.selected ? <Icon name='check' style={{ display: 'inline' }} /> : null}
                                                                                </Box>
                                                                            </Box>

                                                                        </div> : null
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={9}>
                                                    <div className="grid-charts">
                                                        {Object.keys(chartDataRegion).map((key, j) => {
                                                            return this.filter.metricType.includes(chartDataRegion[key].metric) ?
                                                                <AppInstLineChart key={j} id={key} data={chartDataRegion[key]} filter={chartFilter} tags={[2, 3, 4]} tagFormats={['', '[', '[']} /> : null
                                                        })}
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Card>
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

    avgCalculator = async (data, metric) => {
        let avgDataList = this.state.avgDataList
        Object.keys(data.values).map(key => {
            let value = data.values[key][0]

            let avg = meanBy(data.values[key], v => (v[metric.position]))

            let avgKey = ''
            data.columns.map((column, i) => {
                if (i !== 0) {
                    avgKey += i === 1 ? value[i] : `_${value[i]}`
                }
            })

            let avgValues = undefined
            let position = avgDataList.length
            for (let i = 0; i < avgDataList.length; i++) {
                if (avgDataList[i]['key'] === avgKey) {
                    avgValues = avgDataList[i]
                    position = i
                    break;
                }
            }

            if (avgValues === undefined) {
                avgValues = {}
                avgValues['key'] = avgKey
                data.columns.map((column, i) => {
                    avgValues[column.serverField] = value[i]
                })
            }

            avgValues[metric.field] = metric.unit ? metric.unit(avg) : avg
            avgDataList[position] = avgValues
        })
        this.setState({ avgDataList })
    }

    serverRequest = async (metric, requestData) => {
        let mcRequest = await serverData.sendRequest(this, requestData)
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            let requestData = mcRequest.request.data
            let region = requestData.region
            let data = mcRequest.response.data
            let chartData = this.state.chartData

            let objectId = `appinst-${metric.serverField}`
            if (data[objectId]) {
                data[objectId].region = region
                data[objectId].metric = metric

                let chartFilter = this.state.chartFilter
                Object.keys(data[objectId].values).map(key => {
                    let value = data[objectId].values[key][0]
                    chartFilter[key] = chartFilter[key] ? chartFilter[key] : {
                        label: `${value[2]}_${value[3]}_${value[4]}_${value[5]}`,
                        regions: [region],
                        color: randomColor({
                            count: 1,
                        })[0], selected: false
                    }
                    let legendRegions = chartFilter[key]['regions']
                    if (!legendRegions.includes(region)) {
                        legendRegions.push(region)
                    }
                })
                let metricKey = this.metricKeyGenerator(region, metric)
                chartData[region][metricKey] = data[objectId]
                this.avgCalculator(chartData[region][metricKey], metric)
                this.setState({ chartData, chartFilter: chartFilter })
            }
        }
    }

    fetchDefaultData = () => {
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
        this.regions.map((region) => {
            chartData[region] = {}
            appInstMetricTypeKeys.map(metric => {
                chartData[region][this.metricKeyGenerator(region, metric)] = { region, metric }
            })
        })
        this.setState({ chartData })
        this.fetchDefaultData()
    }
}

export default MexChart