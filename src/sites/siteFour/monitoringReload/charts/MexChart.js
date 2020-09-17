import React from 'react'
import AppInstLineChart from './linechart/MexLineChart'
import {appMetricsKeys, appInstMetrics} from '../../../../services/model/appMetrics'
import * as serverData from '../../../../services/model/serverData'
import * as dateUtil from '../../../../utils/date_util'
import { fields } from '../../../../services/model/format'
const METRIC_APPINST_CPU = 'appinst-cpu'

class MexChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chartData : {}
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }

    static getDerivedStateFromProps(props, state) {
        return null
    }

    render() {
        const {chartData} = this.state
        return (
            <React.Fragment>
                <AppInstLineChart label="CPU" data={chartData ? chartData[METRIC_APPINST_CPU] : {}} keys={appMetricsKeys}/>
                {/* <AppInstLineChart /> */}
            </React.Fragment>
        )
    }

    fetchDefaultData = async () => {
        let showRequestList = []
        let endtime = dateUtil.currentUTCTime()
        let starttime = dateUtil.subtractMins(20, endtime).valueOf()
        starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
        endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
        if (this.regions && this.regions.length > 0) {
            this.regions.map(region => {
                let data = {}
                data[fields.region] = region
                data[fields.starttime] = starttime
                data[fields.endtime] = endtime
                showRequestList.push(appInstMetrics(data))
            })
            this.setState({ loading: true })
            let mcRequestList = await serverData.showSyncMultiData(this, showRequestList)
            this.setState({ loading: false })
            if (mcRequestList && mcRequestList.length > 0) {
                let data = mcRequestList[0].response.data
                data[METRIC_APPINST_CPU].starttime = starttime
                data[METRIC_APPINST_CPU].endtime = endtime
                this.setState({chartData : data})
            }
        }
    }

    componentDidMount() {
        this.fetchDefaultData()
    }
}

export default MexChart