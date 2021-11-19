import React from 'react'
import HorizontalBar from '../../charts/horizontalBar/MexHorizontalBar'
import { clientMetrics } from '../../../../../services/modules/clientMetrics'
import MexWorker from '../../services/client.worker.js'
import { authSyncRequest, responseValid } from '../../../../../services/service'
import { equal } from '../../../../../helper/constant/operators'
import { Skeleton } from '@material-ui/lab'
import { fields } from '../../../../../services/model/format'

class MexAppClient extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            stackedData: {},
            loading: true,
        }
        this._isMounted = false
        this.init = true
    }

    render() {
        const { stackedData, loading } = this.state
        const { search, regions } = this.props
        return (this.init ? <Skeleton variant='rect' height={300} /> :
            stackedData ? <HorizontalBar loading={loading} header='Client API Usage Count' chartData={stackedData} search={search} regions={regions} /> :
                <div className="event-list-main" align="center" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <div align="left" className="event-list-header">
                        <h3 className='chart-header'>Client API Usage Count</h3>
                    </div>
                    <h3 style={{ padding: '90px 0px' }} className='chart-header'><b>No Data</b></h3>
                </div>)
    }

    fetchData = async (region) => {
        const { range, organization } = this.props
        this.setState({ loading: true })
        const requestData = clientMetrics(this, {
            region,
            selector: "api",
            numsamples: 1,
            starttime: range.starttime,
            endtime: range.endtime
        }, organization[fields.organizationName])

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
                this.init = false
                worker.terminate()
            })
        }
    }

    client = () => {
        this.setState({ stackedData: {} })
        this.props.regions.map(region => {
            this.fetchData(region)
        })
    }

    componentDidUpdate(preProps, preState) {
        const { range } = this.props
        //fetch data on range change
        if (!equal(range, preProps.range)) {
            this.client()
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.client()
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

export default MexAppClient