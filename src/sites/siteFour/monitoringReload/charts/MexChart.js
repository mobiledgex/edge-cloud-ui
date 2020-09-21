import React from 'react'
import AppInstLineChart from './linechart/MexLineChart'
import { appMetricsKeys, appInstMetrics } from '../../../../services/model/appMetrics'

import { APP_INST_METRICS_ENDPOINT } from '../../../../services/endPointTypes'
import * as serverData from '../../../../services/model/serverData'
import * as dateUtil from '../../../../utils/date_util'
import { convertByteToMegaGigaByte } from '../../../../utils/math_util'
import { fields } from '../../../../services/model/format'
import { Grid } from '@material-ui/core'

const METRIC_APPINST_CPU = 'appinst-cpu'
const METRIC_APPINST_MEM = 'appinst-mem'
const METRIC_APPINST_DISK = 'appinst-disk'

const metricType = ['cpu', 'mem', 'disk']

const convertUnit = (key, value) => {
    if (key.includes(METRIC_APPINST_CPU)) {
        return value.toFixed(3) + " %"
    }
    else if (key.includes(METRIC_APPINST_MEM) || key.includes(METRIC_APPINST_DISK)) {
        return convertByteToMegaGigaByte(value.toFixed(1))
    }
}

const label = (key) => {
    if (key.includes(METRIC_APPINST_CPU)) {
        return 'CPU'
    }
    else if (key.includes(METRIC_APPINST_MEM)) {
        return 'MEMORY'
    }
    else if (key.includes(METRIC_APPINST_DISK)) {
        return 'DISK'
    }
    else
    {
        return 'Line Chart'
    }
}

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
                    {Object.keys(chartData).map((key, i) => {
                        return <Grid item xs={6} key={i} ><AppInstLineChart id={key} label={label} data={chartData[key]} keys={appMetricsKeys} convertUnit={convertUnit} /></Grid>
                    })}
                </Grid>
            </div>
        )
    }

    timeRangeInMin = (range) => {
        let endtime = dateUtil.currentUTCTime()
        let starttime = dateUtil.subtractMins(range, endtime).valueOf()
        starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
        endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
        return { starttime, endtime }
    }

    serverResponse = (mcRequestList) => {
        if (mcRequestList && mcRequestList.length > 0) {
            mcRequestList.map(mcRequest => {
                let request = mcRequest.request
                let data = mcRequest.response.data
                let chartData = this.state.chartData
                Object.keys(data).map(item => {
                    data[item].starttime = request.data.starttime
                    data[item].endtime = request.data.endtime
                    data[item].region = request.data.region
                    chartData[`${item}_${request.data.region}`] = data[item]
                })
                this.setState({ chartData })
            })
        }
    }

    fetchDefaultData = async () => {
        let showRequestList = []
        let range = this.timeRangeInMin(20)
        if (this.regions && this.regions.length > 0) {
            this.regions.map(region => {
                metricType.map(metric => {
                    let data = {}
                    data[fields.region] = region
                    data[fields.starttime] = range.starttime
                    data[fields.endtime] = range.endtime
                    data[fields.selector] = metric
                    showRequestList.push(appInstMetrics(data))
                })
            })

            this.setState({ loading: true })
            let mcRequestList = await serverData.showSyncMultiData(this, showRequestList)
            this.setState({ loading: false })

            this.serverResponse(mcRequestList)
        }
    }

    componentDidMount() {
        this.fetchDefaultData()
    }
}

export default MexChart