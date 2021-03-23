import React from 'react'
import { sendRequest } from '../../services/service'
import { cloudletFlavorUsageMetrics } from '../../../../../services/model/cloudletMetrics'
import { getOrganization, isAdmin } from '../../../../../services/model/format'
import LineChart from '../../charts/linechart/MexLineChart'
import MexWorker from '../../services/flavor.worker.js'
import { Card, GridListTile } from '@material-ui/core'
import { timezonePref } from '../../../../../utils/sharedPreferences_util'

const metric = { field: 'count', serverField: 'count', serverHead: 'cloudlet-flavor-usage', header: 'Flavor Usage', position: 4 }
class CloudletFlavorUsage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            chartData: undefined,
            colors: [],
            loading: false
        }
        this._isMounted = false
        this.worker = new MexWorker();
        this.orgData = []
        this.avgData = {}
        this.mc = undefined
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    render() {
        const { chartData } = this.state
        const { filter, style, rowSelected } = this.props
        return (
            chartData && filter.metricType.includes(chartData.metric.field) ?
                <GridListTile cols={1} style={style}>
                    <Card style={{ height: 300 }}>
                        <LineChart id={'cloudlet-flavor-usage'} rowSelected={rowSelected} disableRowSelectedFilter={true} data={chartData} avgData={this.avgData} globalFilter={filter} range={this.props.range} />
                    </Card>
                </GridListTile> : null
        )
    }

    /*
     * 
     */
    formatData = (calAvgData) => {
        this.worker.postMessage({
            response: this.mc.response,
            request: this.mc.request,
            avgData: this.props.avgData,
            rowSelected: this.props.rowSelected,
            metric,
            region: this.props.region,
            avgFlavorData: this.avgData,
            calAvgData,
            timezone: timezonePref()
        })
        this.worker.addEventListener('message', event => {
            this.avgData = event.data.avgData
            this.updateState({ chartData: event.data.chartData })
        })
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
        if (this._isMounted) {
            this.updateState({ loading: true })
            let mc = await sendRequest(this, cloudletFlavorUsageMetrics(requestData))
            if (mc && mc.response && mc.response.status === 200) {
                this.mc = mc
                this.formatData(true)
            }
            this.updateState({ loading: false })
        }
    }

    defaultStructure = () => {
        let region = this.props.region
        let range = this.props.range
        if (this._isMounted) {
            this.setState({
                chartData: { metric, region }
            }, () => {
                this.fetchData(range, region)
            })
        }
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
        this._isMounted = true
        this.defaultStructure()
    }

    componentWillUnmount() {
        this._isMounted = false
        this.worker.terminate()
    }
}

export default CloudletFlavorUsage