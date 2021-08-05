import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import HorizontalBar from '../../charts/horizontalBar/MexHorizontalBar'
import { clientMetrics } from '../../../../../services/modules/clientMetrics'
import { redux_org, redux_private } from '../../../../../helper/reduxData'
import MexWorker from '../../services/client.worker.js'
import { authSyncRequest, responseValid } from '../../../../../services/service'

class MexAppClient extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            stackedData: {},
            loading: true
        }
        this._isMounted = false
    }

    validatData = (data) => {
        let valid = false
        this.props.regions.map(region => {
            if (!valid && data[region]) {
                [
                    valid = data[region].length > 0
                ]
            }
        })
        return valid
    }

    render() {
        const { stackedData, loading } = this.state
        const { filter, regions } = this.props
        return stackedData ? <HorizontalBar loading={loading} header='Client API Usage Count' chartData={stackedData} filter={filter} regions={regions} /> :
            <div className="event-list-main" align="center" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <div align="left" className="event-list-header">
                    <h3 className='chart-header'>Client API Usage Count</h3>
                </div>
                <h3 style={{ padding: '90px 0px' }} className='chart-header'><b>No Data</b></h3>
            </div>
    }

    fetchData = async (region, range) => {
        this.setState({ loading: true })
        const {orgInfo, privateAccess} = this.props
        const requestData = clientMetrics({
            region: region,
            selector: "api",
            numsamples: 1,
            starttime: range.starttime,
            endtime: range.endtime
        }, redux_org.isAdmin(orgInfo) ? this.props.org : redux_org.nonAdminOrg(orgInfo), redux_private.isPrivate(privateAccess))

        let mc = await authSyncRequest(this, { ...requestData, format: false })
        if (responseValid(mc)) {
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
                        return { stackedData, loading: false }
                    })
                }
                worker.terminate()
            })
        }
    }

    client = (range) => {
        this.setState({ stackedData: {} })
        this.props.regions.map(region => {
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
        if (!redux_org.isAdmin(this.props.orgInfo) || this.props.org) {
            this.client(this.props.range)
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

export default MexAppClient