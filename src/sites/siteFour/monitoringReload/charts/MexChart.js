import React from 'react'
import AppInstLineChart from './linechart/MexLineChart'
import { appMetricsKeys, appInstMetrics } from '../../../../services/model/appMetrics'
import * as serverData from '../../../../services/model/serverData'
import * as dateUtil from '../../../../utils/date_util'
import { convertByteToMegaGigaByte } from '../../../../utils/math_util'
import { fields } from '../../../../services/model/format'
import { Grid } from '@material-ui/core'

const appInstMetricKeys = [
    { serverField: 'connections', subId: 'active', header: 'Active Connections', position: 10 },
    { serverField: 'network', subId: 'recvBytes', header: 'Network Received', position: 11, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) } },
    { serverField: 'network', subId: 'sendBytes', header: 'Network Sent', position: 10, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) } },
    { serverField: 'disk', header: 'Disk Usage', position: 10, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) } },
    { serverField: 'mem', header: 'Memory', position: 10, unit: (value) => { return convertByteToMegaGigaByte(value.toFixed(1)) } },
    { serverField: 'cpu', header: 'CPU', position: 10, unit: (value) => { return value.toFixed(3) + " %" } },
]

class MexChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chartData: {}
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }

    static getDerivedStateFromProps(props, state) {
        return null
    }

    render() {
        const { chartData } = this.state
        return (
            <div style={{ marginTop: 10 }}>
                <Grid container spacing={1}>
                    {Object.keys(chartData).map((region, i) => {
                        let chartDataRegion = chartData[region]
                        return (
                            <Grid item xs={6} key={i}>
                                <Grid container spacing={1} direction="column-reverse">
                                    {Object.keys(chartDataRegion).map((key, j) => {
                                        return <Grid item xs={12} key={j}><AppInstLineChart id={key} data={chartDataRegion[key]} keys={appMetricsKeys} tags={[2, 3, 4]} tagFormats={['', '[', '[']} /></Grid>
                                    })}
                                </Grid>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
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

            chartData[region][this.metricKeyGenerator(region, metric)] = data[objectId]
            this.setState({ chartData })
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
        this.regions.map((region)=>{
            chartData[region] = {}
            appInstMetricKeys.map(metric=>{ chartData[region][this.metricKeyGenerator(region, metric)] = {region, metric}})
        })
        this.setState({chartData})
        this.fetchDefaultData()
    }
}
 
export default MexChart