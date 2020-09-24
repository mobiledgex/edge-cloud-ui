import React from 'react'
import AppInstLineChart from './linechart/MexLineChart'
import { appMetricsKeys, appInstMetrics } from '../../../../services/model/appMetrics'
import * as serverData from '../../../../services/model/serverData'
import * as dateUtil from '../../../../utils/date_util'
import { convertByteToMegaGigaByte } from '../../../../utils/math_util'
import { fields } from '../../../../services/model/format'
import { Grid, Card, Box, Chip, Tabs, Tab, Typography } from '@material-ui/core'
import randomColor from 'randomcolor'
import uniq from 'lodash/uniq'
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
            chartSelectiveFilter : {},
            tabValue :0,
            legendFilter:{}

        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.filter = props.filter
        this.tempFilter = []
    }

    validateRegionFilter = (region)=>
    {
        let regionFilter = this.filter[fields.region]
        return regionFilter === 'ALL' || region === regionFilter
    }

    tabChange = (event, tabValue) => {
        this.setState({tabValue});
    };

    legendClick = (value, region)=>
    {
        let legendFilter = this.state.legendFilter
        if(legendFilter[region].includes(value))
        {
            legendFilter[region] = legendFilter[region].filter(legend=>{
                return legend !== value
            })
        }
        else
        {
            legendFilter[region].push(value)
        }
        this.setState({legendFilter})
    }

    render() {
        const { chartData, chartSelectiveFilter, tabValue, legendFilter } = this.state

        return (
            <Card style={{flexGrow: 1, marginTop:10}}>
                <Tabs
                    variant="fullWidth"
                    value={tabValue}
                    onChange={this.tabChange}
                    aria-label="Vertical tabs example"
                >
                    {appInstMetricKeys.map((appInstMetricKey, i) => {
                        return <Tab style={{textAlign:'left'}} key={i} label={appInstMetricKey.header} />
                    })}
                </Tabs>
                    <div style={{ marginTop: 10 }}>
                        <Grid container spacing={1}>
                            {Object.keys(chartData).map((region, i) => {
                                if (this.validateRegionFilter(region)) {
                                    let chartDataRegion = chartData[region]
                                    let chartSelectiveFilterRegion = chartSelectiveFilter[region]
                                    let regionMetricsColor = randomColor({
                                        count: chartSelectiveFilterRegion ? chartSelectiveFilterRegion.length : 0,
                                    });
                                    let chartDataFilter = chartSelectiveFilterRegion ? chartSelectiveFilterRegion.map((chartSelective, l) => {
                                        return { key: chartSelective, color: regionMetricsColor[l] }
                                    }) : []
                                    return (
                                        <Grid item xs={6} key={i}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={3}>
                                                    <div className="grid-charts-header">
                                                        <div align="center">
                                                            {
                                                                chartDataFilter.map((data, k) => {
                                                                    return <div key={k} onClick={()=>{this.legendClick(data.key, region)}}style={{cursor:'pointer', marginRight: 10, marginBottom:10, textAlign:'left' }}><Icon name='circle' style={{color:data.color}}/>{data.key}</div>
                                                                })
                                                            }
                                                        </div>
                                                    </div></Grid>
                                                <Grid item xs={9}>
                                                    <div className="grid-charts">
                                                        {Object.keys(chartDataRegion).map((key, j) => {
                                                            return <TabPanel key={j} value={tabValue} index={j}>
                                                                <AppInstLineChart id={key} data={chartDataRegion[key]} legendFilter={legendFilter[region]} filter={chartDataFilter} keys={appMetricsKeys} tags={[2, 3, 4]} tagFormats={['', '[', '[']} />
                                                            </TabPanel>
                                                        })}
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    )
                                }
                            })}
                        </Grid>
                    </div>
              
            </Card>
            
        )
    }

    metricKeyGenerator = (region, metric)=>
    {
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
            data[objectId].starttime = requestData.starttime
            data[objectId].endtime = requestData.endtime
            data[objectId].region = region
            data[objectId].metric = metric
            let chartSelectiveFilter = this.state.chartSelectiveFilter
            Object.keys(data[objectId].values).map(key=>{
                let value = data[objectId].values[key][0]
                chartSelectiveFilter[region].push(`${value[2]}_${value[3]}_${value[4]}`)
            })
            chartSelectiveFilter[region] = uniq(chartSelectiveFilter[region])
            chartData[region][this.metricKeyGenerator(region, metric)] = data[objectId]
            this.setState({ chartData, chartSelectiveFilter })
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
        let legendFilter = {}
        let chartData = {}
        let chartSelectiveFilter = {}
        this.regions.map((region)=>{
            chartData[region] = {}
            chartSelectiveFilter[region] = []
            legendFilter[region] = []
            appInstMetricKeys.map(metric=>{ chartData[region][this.metricKeyGenerator(region, metric)] = {region, metric}})
        })
        this.setState({chartData, chartSelectiveFilter, legendFilter})
        this.fetchDefaultData()
    }
}
 
export default MexChart