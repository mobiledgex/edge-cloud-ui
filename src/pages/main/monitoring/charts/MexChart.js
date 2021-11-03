import React from 'react'
import { connect } from 'react-redux'
import LineChart from './linechart/MexLineChart'
import { metricRequest } from '../helper/montconstant'
import { Card, ImageListItem } from '@material-ui/core'
import { timezonePref } from '../../../../utils/sharedPreferences_util'
//services
import { fields } from '../../../../services/model/format'
import { redux_org, redux_private } from '../../../../helper/reduxData';
import { processWorker } from '../../../../services/worker/interceptor'
import MetricWorker from '../services/metric.worker.js'
import { authSyncRequest, responseValid } from '../../../../services/service'
class MexChart extends React.Component {
    constructor(props) {
        super()
        this.state = {
            dataList: undefined
        }
        this._isMounted = false;
        this.metricWorker = new MetricWorker();
    }

    updateData = (dataList) => {
        if (this._isMounted) {
            this.setState({ dataList })
        }
    }

    /**
     * Check if rawData exist in avgData
     */
    validateData = (rawData, avgData) => {
        let values = rawData ? rawData.values : {}
        let count = 0
        if (values) {
            let keys = Object.keys(values)
            let length = keys.length
            for (let i = 0; i < length; i++) {
                let key = keys[i]
                if (avgData[key]) {
                    count++;
                }
            }
        }
        return count > 0
    }

    metricKeyGenerator = (filter, region, metric) => {
        return `${filter.parent.id}-${metric.serverField}${metric.subId ? `-${metric.subId}` : ''}-${region}`
    }

    render() {
        const { dataList } = this.state
        const { region, avgData, filter, rowSelected, style, range } = this.props
        return (
            filter.region.includes(region) && dataList && dataList.length > 0 ?
                dataList.map(data => {
                    let key = this.metricKeyGenerator(filter, region, data.metric)
                    return (
                        filter.metricType.includes(data.metric.field) ?
                            <ImageListItem key={key} cols={1} style={style}>
                                <Card style={{ height: 300 }}>
                                    <LineChart id={key} rowSelected={rowSelected} data={data} avgData={avgData[region]} globalFilter={filter} range={range} />
                                </Card>
                            </ImageListItem> : null
                    )
                }) : null
        )
    }

    /**
     * 1. Fetch metric raw data
     * 2. Pass fetched data to metric worker to process the data and generate line chart dataset
     */
    fetchMetricData = async () => {
        const { metric, region, filter, avgData } = this.props
        let parent = filter.parent
        let filterList = avgData.filterList[region]
        if (metric.serverRequest && filterList && filterList.length > 0) {
            let data = {}
            data[fields.region] = region
            data[fields.starttime] = this.props.range.starttime
            data[fields.endtime] = this.props.range.endtime
            data[fields.selector] = metric.serverField
            data['numsamples'] = 50
            let org = redux_org.isAdmin(this) ? this.props.org : redux_org.nonAdminOrg(this)
            let request = metricRequest(this, metric.serverRequest, data, filterList, org)
            let mc = await authSyncRequest(this, { ...request, format: false })
            if (responseValid(mc)) {
                let response = await processWorker(this.metricWorker, {
                    response: { data: mc.response.data },
                    request: request,
                    parentId: parent.id,
                    metricKeys: filter.parent.metricListKeys,
                    region: region,
                    metric,
                    avgData: avgData[region],
                    timezone: timezonePref()
                })
                if (responseValid(mc)) {
                    let chartData = response.data
                    chartData.forEach(data => {
                        this.props.updateAvgData(region, data.metric, data.avgData)
                    })
                    this.updateData(chartData)
                    return
                }
            }
        }
        this.updateData(undefined)
    }

    defaultContainer = () => {
        setTimeout(() => {
            let metric = this.props.metric
            let dataList = []
            if (metric.serverRequest) {
                if (metric.keys) {
                    metric.keys.map(child => {
                        dataList.push({ region: this.props.region, metric: child })
                    })
                }
                else {
                    dataList.push({ region: this.props.region, metric })
                }
            }
            if (this._isMounted) {
                this.setState({ dataList }, () => {
                    this.fetchMetricData()
                })
            }
        }, 1100)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.org !== this.props.org) {
            if (this._isMounted) {
                this.setState({ dataList: undefined }, () => {
                    this.defaultContainer()
                })
            }
        }
        if (prevProps.range !== this.props.range) {
            if (this._isMounted) {
                this.setState({ dataList: undefined }, () => {
                    this.defaultContainer()
                })
            }
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.defaultContainer()
    }

    componentWillUnmount() {
        this._isMounted = false
        this.metricWorker.terminate()
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data,
        privateAccess: state.privateAccess.data,
    }
};

export default connect(mapStateToProps, null)(MexChart);