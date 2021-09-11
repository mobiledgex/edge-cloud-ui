import React from 'react'
import { connect } from 'react-redux'
import { cloudletFlavorUsageMetrics } from '../../../../../services/modules/cloudletMetrics'
import LineChart from '../../charts/linechart/MexLineChart'
import MexWorker from '../../services/flavor.worker.js'
import { Card, ImageListItem } from '@material-ui/core'
import { timezonePref } from '../../../../../utils/sharedPreferences_util'
import {redux_org} from '../../../../../helper/reduxData'
import { authSyncRequest } from '../../../../../services/service'
const metric = { field: 'count', serverField: 'count', serverHead: 'cloudlet-flavor-usage', header: 'Flavor Usage', position: 4, steppedLine:'after' }
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
        const { filter, style, rowSelected, range } = this.props
        return (
            chartData && chartData.datasets && filter.metricType.includes(chartData.metric.field) ?
                <ImageListItem cols={1} style={style}>
                    <Card style={{ height: 300 }}>
                        <LineChart id={'cloudlet-flavor-usage'} rowSelected={rowSelected} disableRowSelectedFilter={true} data={chartData} avgData={this.avgData} globalFilter={filter} range={range} />
                    </Card>
                </ImageListItem> : null
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
                organization: redux_org.isAdmin(this) ? this.props.org : redux_org.nonAdminOrg(this),
            },
            starttime: range.starttime,
            endtime: range.endtime,
            selector: 'flavorusage',
        }
        if (this._isMounted) {
            this.updateState({ loading: true })
            let mc = await authSyncRequest(this, { ...cloudletFlavorUsageMetrics(requestData), format: false })
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

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default connect(mapStateToProps, null)(CloudletFlavorUsage);