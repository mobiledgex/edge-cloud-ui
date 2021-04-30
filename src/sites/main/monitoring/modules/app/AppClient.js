import React from 'react'
import HorizontalBar from '../../charts/horizontalBar/MexHorizontalBar'
import { clientMetrics } from '../../../../../services/model/clientMetrics'
import { sendRequest } from '../../services/service'
import { withRouter } from 'react-router-dom'
import { getOrganization, isAdmin } from '../../../../../services/model/format'
import MexWorker from '../../services/client.worker.js'

class MexAppClient extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            stackedData: {}
        }
        this._isMounted = false
        this.regions = props.regions
    }

    validatData = (data) => {
        let valid = false
        this.regions.map(region => {
            if (!valid && data[region]) {
                [
                    valid = data[region].length > 0
                ]
            }
        })
        return valid
    }

    render() {
        const { stackedData } = this.state
        const { filter } = this.props
        return this.validatData(stackedData) ? <HorizontalBar header='Client API Usage Count' chartData={stackedData} filter={filter} /> :
            <div className="event-list-main" align="center" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <div align="left" className="event-list-header">
                    <h3 className='chart-header'>Client API Usage Count</h3>
                </div>
                <h3 style={{ padding: '90px 0px' }} className='chart-header'><b>No Data</b></h3>
            </div>
    }

    fetchData = async (region, range) => {
        let mc = await sendRequest(this, clientMetrics({
            region: region,
            selector: "api",
            starttime: range.starttime,
            endtime: range.endtime
        }, isAdmin() ? this.props.org : getOrganization(), this.props.isPrivate))
        if (mc && mc.response && mc.response.status === 200) {
            let worker = new MexWorker();
            worker.postMessage({
                response: mc.response,
                request: mc.request,
                region: region
            })
            worker.addEventListener('message', event => {
                if (this._isMounted) {
                    this.setState(prevState => {
                        let stackedData = prevState.stackedData
                        stackedData[region] = event.data.data
                        return { stackedData }
                    })
                }
                worker.terminate()
            })
        }
    }

    client = (range) => {
        this.regions.map(region => {
            this.fetchData(region, range)
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.org !== this.props.org) {
            this.setState({ stackedData: {} }, () => {
                this.client(this.props.range)
            })
        }
        if (prevProps.range !== this.props.range) {
            this.client(this.props.range)
        }
    }

    componentDidMount() {
        this._isMounted = true
        if (!isAdmin() || this.props.org) {
            this.client(this.props.range)
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

export default withRouter(MexAppClient);