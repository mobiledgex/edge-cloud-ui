import React from 'react'
import { fields, getOrganization, isAdmin } from '../../../../services/model/format'
import LineChart from './linechart/MexLineChart'
import { sendAuthRequest } from '../../../../services/model/serverWorker'
import { WORKER_METRIC } from '../../../../services/worker/constant'
import MexWorker from '../../../../services/worker/mex.worker.js'
import { metricRequest } from '../helper/Constant'
import { Card, GridListTile } from '@material-ui/core'
class MexChart extends React.Component {
    constructor(props) {
        super()
        this.state = {
            dataList: undefined
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
            dataList && dataList.length > 0 ?
                dataList.map(data => {
                    let key = this.metricKeyGenerator(filter, region, data.metric)
                    return (
                        filter.metricType.includes(data.metric.field) ?
                            <GridListTile key={key} cols={1} style={style}>
                                <Card style={{ height: 300 }}>
                                    <LineChart id={key} rowSelected={rowSelected} data={data} avgDataRegion={avgData[region]} globalFilter={filter} range={range} />
                                </Card>
                            </GridListTile> : null
                    )
                }) : null
        )
    }

    metricResponse = (parent, metric, region, mc) => {
        if (mc && mc.response && mc.response.status === 200) {
            let metricList = mc.response.data
            if (metricList && metricList.length > 0) {
                const worker = new MexWorker();
                worker.postMessage({ type: WORKER_METRIC, metricList, parentId: parent.id, region: region, metric })
                worker.addEventListener('message', event => {
                    let chartData = event.data
                    chartData.map(data => {
                        this.props.updateAvgData(region, data.metric, data.avgData)
                    })
                    if (this.validateData(chartData[0], this.props.avgData[region])) {
                        this.setState({ dataList: chartData })
                    }
                    else {
                        this.setState({ dataList: undefined })
                    }
                })
            }
            else {
                this.setState({ dataList: undefined })
            }
        }
    }

    fetchMetricData = () => {
        let parent = this.props.filter.parent
        let metric = this.props.metric
        let region = this.props.region
        if (metric.serverRequest) {
            let data = {}
            data[fields.region] = region
            data[fields.starttime] = this.props.range.starttime
            data[fields.endtime] = this.props.range.endtime
            data[fields.selector] = metric.serverField
            let org = isAdmin() ? this.props.org : getOrganization()
            let request = metricRequest(metric.serverRequest, data, org)
            sendAuthRequest(this, request).addEventListener('message', event => {
                if (event.data.status && event.data.status !== 200) {
                    this.setState({ dataList: undefined })
                }
                else {
                    this.metricResponse(parent, metric, region, event.data)
                }
            });
        }
    }

    defaultContainer = () => {
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
        this.setState({ dataList }, () => {
            this.fetchMetricData()
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.org !== this.props.org) {
            this.setState({ dataList: undefined }, () => {
                this.defaultContainer()
            })
        }
        if (prevProps.range !== this.props.range) {
            this.setState({ dataList: undefined }, () => {
                this.defaultContainer()
            })
        }
    }

    componentDidMount() {
        this.defaultContainer()
    }
}

export default MexChart