import React from 'react'
import EventList from '../../list/EventList'
import { orgEvents } from '../../../../../services/model/events'
import { getOrganization, isAdmin } from '../../../../../services/model/format'
import { sendRequest } from '../../../../../services/model/serverWorker'
import randomColor from 'randomcolor'
import { withRouter } from 'react-router-dom'

const appEventKeys = [
    { label: 'App', serverField: 'app', summary: false, filter: true },
    { label: 'App Developer', serverField: 'apporg', summary: false, filter: true },
    { label: 'Version', serverField: 'appver', summary: false },
    { label: 'Cluster', serverField: 'cluster', summary: false, filter: true },
    { label: 'Cluster Developer', serverField: 'clusterorg', summary: false, filter: true },
    { label: 'Cloudlet', serverField: 'cloudlet', summary: true, filter: true },
    { label: 'Operator', serverField: 'cloudletorg', summary: true, filter: true },
    { label: 'Hostname', serverField: 'hostname', summary: true },
    { label: 'Line no', serverField: 'lineno', summary: true },
    { label: 'Span ID', serverField: 'spanid', summary: true },
    { label: 'State', serverField: 'state', summary: true },
    { label: 'Trace ID', serverField: 'traceid', summary: true },
]

class MexAppEvent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventData: [],
            colors: []
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
        const { eventData, colors } = this.state
        const { filter } = this.props
        return eventData.length > 0 ? <EventList eventData={eventData} filter={filter} colors={colors} keys={appEventKeys} header={this.header} /> :
            <div className="event-list-main" align="center" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <div align="left" className="event-list-header">
                    <h3>Events</h3>
                </div>
                <h3 style={{ marginTop: '16vh' }}><b>No Data</b></h3>
            </div>
    }

    serverResponse = (mc) => {
        if (mc && mc.response && mc.response.data) {
            let dataList = mc.response.data
            let colors = randomColor({ count: dataList.length, })
            this.setState({ eventData: dataList, colors })
        }
    }

    event = async (range) => {
        sendRequest(this, orgEvents({
            match: {
                orgs: [isAdmin() ? this.props.org : getOrganization()],
                types: ["event"],
                tags: { app: "*" },
                starttime: range.starttime,
                endtime: range.endtime,
            },
            limit: 10
        }), this.serverResponse)
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.org !== this.props.org)
        {
            this.setState({eventData: []}, ()=>{
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
export default withRouter(MexAppEvent);