import { Skeleton } from '@material-ui/lab'
import React from 'react'
import { withRouter } from 'react-router-dom'

import { fields, getOrganization, isAdmin } from '../../../../services/model/format'
import { sendRequest } from '../../../../services/model/serverWorker'
import { WORKER_METRIC } from '../../../../services/worker/constant'
import MexWorker from '../../../../services/worker/mex.worker.js'
import GraphicEqOutlinedIcon from '@material-ui/icons/GraphicEqOutlined';

import MexChart from '../charts/MexChart'


class MexMetric extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chartData: {},
            dataLoaded: false
        }
        this.regions = this.props.regions
    }

    render() {
        const { chartData, dataLoaded } = this.state
        const { avgData, filter, rowSelected, style } = this.props
        return (
            dataLoaded ? <MexChart chartData={chartData} avgData={avgData} filter={filter} regions={this.regions} rowSelected={rowSelected} style={style} /> :
                <React.Fragment>
                    <Skeleton variant="rect" style={{ height: '59vh', width: '100%' }} />
                </React.Fragment>

        )
    }

    metricKeyGenerator = (parentId, region, metric) => {
        return `${parentId}-${metric.serverField}${metric.subId ? `-${metric.subId}` : ''}-${region}`
    }

    metricResponse = (parent, region, mc) => {
        if (mc && mc.response && mc.response.status === 200) {
            let metric = mc.response.data
            if (metric && metric.length > 0) {
                const worker = new MexWorker();
                worker.postMessage({ type: WORKER_METRIC, metric, parentId: parent.id, region: region, metricTypeKeys: parent.metricTypeKeys, avgData: this.props.avgData })
                worker.addEventListener('message', event => {
                    let chartData = event.data.chartData
                    let avgData = event.data.avgData
                    this.props.updateAvgData(avgData)
                    this.setState(prevState => {
                        let preChartData = prevState.chartData
                        preChartData[region] = chartData[region]
                        return { preChartData }
                    }, () => {
                        this.setState({ dataLoaded: true })
                    })
                });
            }
        }
    }

    fetchMetricData = () => {
        this.setState({ chartData: this.metricStructure(), dataLoaded: false }, () => {
            let parent = this.props.filter.parent
            this.regions.map(region => {
                parent.metricTypeKeys.map(metric => {
                    if (metric.serverRequest) {
                        let data = {}
                        data[fields.region] = region
                        data[fields.starttime] = this.props.range.starttime
                        data[fields.endtime] = this.props.range.endtime
                        data[fields.selector] = '*'
                        let org = isAdmin() ? this.props.org : getOrganization()
                        let metricRequest = parent.request(data, org)

                        sendRequest(this, metricRequest).addEventListener('message', event => {
                            if (event.data.status && event.data.status !== 200) {
                                // this.props.handleAlertInfo(event.data.message)
                            }
                            else {
                                this.metricResponse(parent, region, event.data)
                            }
                        });
                    }
                })
            })
        })
    }

    metricStructure = () => {
        let chartData = {}
        let parent = this.props.filter.parent
        this.regions.map((region) => {
            chartData[region] = {}
            parent.metricTypeKeys.map(metric => {
                let metricData = {}
                metricData[fields.region] = region
                metricData[fields.metric] = metric
                chartData[region][this.metricKeyGenerator(parent.id, region, metric)] = metricData
            })
        })
        return chartData
    }

    componentDidMount() {
        this.fetchMetricData()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.org !== this.props.org) {
            this.setState({ eventData: [] }, () => {
                this.fetchMetricData(this.props.range)
            })
        }
        if (prevProps.range !== this.props.range) {
            this.fetchMetricData(this.props.range)
        }
    }

    componentWillUnmount() {

    }
}

export default withRouter(MexMetric);