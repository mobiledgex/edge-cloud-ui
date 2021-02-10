import React from 'react'
import { fields, getOrganization, isAdmin } from '../../../../services/model/format'
import LineChart from './linechart/MexLineChart'
import { sendAuthRequest } from '../../../../services/model/serverWorker'
import { WORKER_METRIC } from '../../../../services/worker/constant'
import MexWorker from '../../../../services/worker/mex.worker.js'
class MexChart extends React.Component {
    constructor(props) {
        super()
        this.state = {
            dataList: undefined
        }
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
                        <React.Fragment key={key}>
                            {data.values ?
                                <LineChart id={key} rowSelected={rowSelected} data={data} avgDataRegion={avgData[region]} globalFilter={filter} tags={[2, 3]} tagFormats={['', '[']} style={style} range={range} />
                                :
                                null}
                        </React.Fragment>
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
                    this.setState({ dataList: event.data })
                })
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
            let metricRequest = parent.request(data, org)
            sendAuthRequest(this, metricRequest).addEventListener('message', event => {
                if (event.data.status && event.data.status !== 200) {
                    // this.props.handleAlertInfo(event.data.message)
                }
                else {
                    this.metricResponse(parent, metric, region, event.data)
                }
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.org !== this.props.org) {
            this.setState({ dataList: undefined }, () => {
                this.fetchMetricData()
            })
        }
        if (prevProps.range !== this.props.range) {
            this.setState({ dataList: undefined }, () => {
                this.fetchMetricData()
            })
        }
    }

    componentDidMount() {
        this.fetchMetricData()
    }
}

export default MexChart