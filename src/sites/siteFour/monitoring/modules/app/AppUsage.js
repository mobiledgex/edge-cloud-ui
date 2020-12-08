import React from 'react'
import UsageList from '../../list/UsageList'
import { fields, getOrganization, isAdmin } from '../../../../../services/model/format'
import { appInstUsageLogs, appUsageKeys } from '../../../../../services/model/appInstUsage'
import { sendRequest } from '../../../../../services/model/serverWorker'
import { withRouter } from 'react-router-dom'

class MexAppUsage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            usageData: {}
        }
        this.regions = props.regions
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
        return <UsageList data={usageData} keys={appUsageKeys} filter={filter} regions={regions} header='App Usage'/>
    }

    serverResponse = (mc) => {
        if (mc && mc.response && mc.response.data) {
            let request = mc.request
            let region = request.data[fields.region]
            let dataList = mc.response.data
            this.setState(prevState=>{
                let usageData = prevState.usageData
                usageData[region] = dataList
                return {usageData}
            })
        }
    }

    event = async (range) => {
        this.regions.map(region => {
            sendRequest(this, appInstUsageLogs({
                region: region,
                starttime: range.starttime,
                endtime: range.endtime
            }, isAdmin() ? this.props.org : getOrganization()), this.serverResponse)
        })
        
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.org !== this.props.org)
        {
            this.setState({usageData: {}}, ()=>{
                this.event(this.props.range)
            })
        }
        if (prevProps.range !== this.props.range) {
            this.event(this.props.range)
        }
    }

    componentDidMount() {
        if (!isAdmin() || this.props.org) {
            this.event(this.props.range)
        }
    }
}
export default withRouter(MexAppUsage);