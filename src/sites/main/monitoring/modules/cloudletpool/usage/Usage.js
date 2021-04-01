import React from 'react'
import UsageList from '../../../list/UsageList'
import { fields, getOrganization, isAdmin } from '../../../../../../services/model/format'
import { processWorker } from '../../../../../../services/worker/interceptor'
import UsageWorker from '../../../services/usage.worker.js'
import { cloudletPoolUsage } from '../../../../../../services/model/cloudletPoolUsage'
import { sendRequest } from '../../../services/service'
import { withRouter } from 'react-router-dom'
import isEqual from 'lodash/isEqual'

class MexAppUsage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            usageData: {}
        }
        this.regions = props.regions
        this.usageWorker = new UsageWorker()
    }

    header = (data) => {
        let cluster = data['cluster']
        return (
            <React.Fragment>
                {`${data['app']} [${data['appver']}]`}
                {cluster ? <code style={{ color: '#74B724' }}><br />{`${cluster}`}</code> : null}
            </React.Fragment>
        )
    }

    render() {
        const { usageData } = this.state
        const { regions, filter } = this.props
        return <div></div>
        // return <UsageList data={usageData} keys={appUsageKeys} filter={filter} regions={regions} header='App Usage' />
    }

    fetchData = async () => {
        const {filter, range} = this.props
        let mc = await sendRequest(this, cloudletPoolUsage(filter.pool, range))
        if(mc && mc.response && mc.response.status === 200)
        {
            let response = await processWorker(this.usageWorker, {
                response: mc.response,
                request: mc.request
            })
            if (response && response.status === 200) {
            }
        }
    }

    event = async (range) => {
        this.fetchData()
    }

    componentDidUpdate(prevProps, prevState) {
        
        if (prevProps.range !== this.props.range || !isEqual(prevProps.filter.pool, this.props.pool)) {
            this.event()
        }
    }

    componentDidMount() {
        if (!isAdmin() || this.props.org) {
            this.event()
        }
    }

    componentWillUnmount(){
        this.usageWorker.terminate()
    }
}
export default withRouter(MexAppUsage);