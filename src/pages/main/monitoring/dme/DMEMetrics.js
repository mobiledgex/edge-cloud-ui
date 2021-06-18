import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fields } from '../../../../services/model/format'
import { primaryKeys as appInstKeys } from '../../../../services/modules/appInst'
import { appInstUsageMetrics } from '../../../../services/modules/appInstUsageMetrics/appInstUsageMetrics'
import { authSyncRequest, responseValid } from '../../../../services/service'
import MexWorker from '../services/metricUsage.worker.js'

class DMEMetrics extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this._isMounted = false
        this.worker = new MexWorker()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }

    render() {
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }

    fetchData = async () => {
        const { data } = this.props
        const request = appInstUsageMetrics(this, {
            appInst: appInstKeys(data),
            region: data[fields.region],
            selector: 'latency'
        })
        let mc = await authSyncRequest(this, request)
        if (responseValid(mc)) {
            this.worker.postMessage({
                selections: [data],
                ...mc
            })
            this.worker.addEventListener('message', event => {
                if (this._isMounted) {
                    console.log(event.data)
                }
            })
        }
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchData()
    }

    componentWillUnmount() {
        this._isMounted = false
        this.worker.terminate()
    }
}

export default withRouter(connect(null, null)(DMEMetrics))