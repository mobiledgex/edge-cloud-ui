import React from 'react'
import { sendAuthRequest } from '../../../../../services/model/serverWorker'
import { cloudletFlavorUsageMetrics } from '../../../../../services/model/cloudletMetrics'
import { getOrganization, isAdmin } from '../../../../../services/model/format'
import LineChart from '../../charts/linechart/MexLineChart'
import MexWorker from '../../../../../services/worker/mex.worker.js'
import { WORKER_MONITORING_FLAVOR_USAGE } from '../../../../../services/worker/constant'
import { Card, GridListTile } from '@material-ui/core'

const metric = { field: 'count', serverField: 'count', serverHead: 'cloudlet-flavor-usage', header: 'Flavor Usage', position: 4 }
class CloudletFlavorUsage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            chartData: undefined,
            colors: [],
            loading: false
        }
        this.orgData = []
        this.avgData = {}
    }

    loadMore = () => {
        let starttime = this.props.range.starttime
        let eventData = this.state.eventData
        let endtime = eventData[eventData.length - 1]['timestamp']
        this.event({ starttime, endtime }, true)
    }

    render() {
        const { chartData } = this.state
        const { filter, id, style } = this.props
        return (
            chartData &&  filter.metricType.includes(chartData.metric.field) ?
                <GridListTile cols={1} style={style}>
                    <Card style={{ height: 300 }}>
                        <LineChart id={'cloudlet-flavor-usage'} rowSelected={0} data={chartData} avgDataRegion={this.avgData} globalFilter={filter} range={this.props.range} labelPosition={5} steppedLine={true} />
                    </Card>
                </GridListTile> : null
        )
    }

    /*
     * 
     */
    formatData = (calAvgData) => {
        if (this.metricList) {
            const worker = new MexWorker();
            worker.postMessage({ type: WORKER_MONITORING_FLAVOR_USAGE, metricList: this.metricList, avgData: this.props.avgData, rowSelected: this.props.rowSelected, metric, region: this.props.region, avgFlavorData: this.avgData, calAvgData })
            worker.addEventListener('message', event => {
                this.avgData = event.data.avgData
                this.setState({ chartData: event.data.chartData })
            })
        }
    }

    serverResponse = (mc) => {
        if (mc && mc.response && mc.response.data) {
            let metricList = mc.response.data
            if (metricList.length > 0) {
                this.metricList = metricList[0]['cloudlet-flavor-usage']
                this.formatData(true)
            }
            else {
                this.setState({ chartData: undefined })
            }
        }
        else {
            this.setState({ chartData: undefined })
        }
    }

    fetchData = async (range, region) => {
        let requestData = {
            region: region,
            cloudlet: {
                organization: isAdmin() ? this.props.org : getOrganization(),
            },
            starttime: range.starttime,
            endtime: range.endtime,
            selector: 'flavorusage',
        }
        this.setState({ loading: true }, () => {
            sendAuthRequest(this, cloudletFlavorUsageMetrics(requestData), this.serverResponse)
        })
    }

    defaultStructure = () => {
        let region = this.props.region
        let range = this.props.range
        this.setState({
            chartData: { metric, region }
        }, () => {
            this.fetchData(range, region)
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.rowSelected !== this.props.rowSelected) {
            this.formatData(false)
        }
        else if (prevProps.org !== this.props.org) {
            this.defaultStructure()
        }
        else if (prevProps.range !== this.props.range) {
            this.defaultStructure()
        }
    }

    componentDidMount() {
        this.defaultStructure()
    }
}

export default CloudletFlavorUsage