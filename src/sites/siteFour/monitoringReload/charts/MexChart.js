import React from 'react'
import AppInstLineChart from './linechart/MexLineChart'
import { appInstMetrics } from '../../../../services/model/appMetrics'
import * as serverData from '../../../../services/model/serverData'
import * as dateUtil from '../../../../utils/date_util'
import { convertByteToMegaGigaByte } from '../../../../utils/math_util'
import { fields } from '../../../../services/model/format'
import { Grid, Card, Box, Tabs, Tab, Typography, TextField } from '@material-ui/core'
import randomColor from 'randomcolor'
import { Icon } from 'semantic-ui-react'

const appInstMetricKeys = [
    { serverField: 'connections', subId: 'active', header: 'Active Connections', position: 10 },
    { serverField: 'network', subId: 'recvBytes', header: 'Network Received', position: 11, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) } },
    { serverField: 'network', subId: 'sendBytes', header: 'Network Sent', position: 10, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) } },
    { serverField: 'disk', header: 'Disk Usage', position: 10, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) } },
    { serverField: 'mem', header: 'Memory', position: 10, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) } },
    { serverField: 'cpu', header: 'CPU', position: 10, unit: (value) => { return value.toFixed(3) + " %" } },
]

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={1}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

class MexChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chartData: {},
            chartFilter: {},
            tabValue: 0,

        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.filter = props.filter
        this.tempFilter = []
    }

    validateRegionFilter = (region) => {
        let regionFilter = this.filter[fields.region]
        return regionFilter === 'ALL' || region === regionFilter
    }

    tabChange = (event, tabValue) => {
        this.setState({ tabValue });
    };

    legendClick = (filterKey) => {
        let chartFilter = this.state.chartFilter
        chartFilter[filterKey]['selected'] = !chartFilter[filterKey]['selected']
        this.setState({ chartFilter })
    }

    render() {
        const { chartData, chartFilter, tabValue } = this.state

        return (
            <div style={{ flexGrow: 1, marginTop: 10 }}>
                <Tabs
                    variant="fullWidth"
                    value={tabValue}
                    onChange={this.tabChange}
                    aria-label="Vertical tabs example"
                    textColor="primary"
                    TabIndicatorProps={{
                        style: { background: "#68DB01"}
                    }}
                >
                    {appInstMetricKeys.map((appInstMetricKey, i) => {
                        return <Tab style={{ textAlign: 'left' }} key={i} label={appInstMetricKey.header} />
                    })}
                </Tabs>
                <div style={{ marginTop: 10 }}>
                    <Grid container spacing={1}>
                        {Object.keys(chartData).map((region, i) => {
                            if (this.validateRegionFilter(region)) {
                                let chartDataRegion = chartData[region]
                                return (
                                    <Grid item xs={6} key={i}>
                                        <Card style={{padding:10}}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={3}>
                                                    <div className="grid-charts-header">
                                                        <div>
                                                            <TextField/>
                                                        </div>
                                                        <br/>
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
                                                                                <Box order={2} style={{marginLeft:10}}>
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
                                                            return (
                                                                <TabPanel key={j} value={tabValue} index={j}>
                                                                    <AppInstLineChart id={key} data={chartDataRegion[key]} filter={chartFilter} tags={[2, 3, 4]} tagFormats={['', '[', '[']} />
                                                                </TabPanel>
                                                            )
                                                        })}
                                                    </div>
                                                </Grid>
                                            </Grid></Card>
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



    serverRequest = async (metric, requestData) => {
        let mcRequest = await serverData.sendRequest(this, requestData)
        if (mcRequest && mcRequest.response && mcRequest.response.data) {
            let requestData = mcRequest.request.data
            let region = requestData.region
            let data = mcRequest.response.data
            let chartData = this.state.chartData

            let objectId = `appinst-${metric.serverField}`
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

            chartData[region][this.metricKeyGenerator(region, metric)] = data[objectId]
            this.setState({ chartData, chartFilter: chartFilter })
        }
    }

    fetchDefaultData = () => {
        let range = this.timeRangeInMin(20)
        if (this.regions && this.regions.length > 0) {
            this.regions.map(region => {
                appInstMetricKeys.map(metric => {
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
            appInstMetricKeys.map(metric => { chartData[region][this.metricKeyGenerator(region, metric)] = { region, metric } })
        })
        this.setState({ chartData })
        this.fetchDefaultData()
    }
}

export default MexChart