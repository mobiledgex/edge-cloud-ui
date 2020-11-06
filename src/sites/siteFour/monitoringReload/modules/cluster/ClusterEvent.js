import React from 'react'
import EventList from '../../list/EventList'
import * as serverData from '../../../../../services/model/serverData'
import { orgEvents } from '../../../../../services/model/events'
import { getOrganization } from '../../../../../services/model/format'
import randomColor from 'randomcolor'

const clusterEventKeys = [
    { label: 'Cluster', serverField: 'cluster', summary: false, filter:true },
    { label: 'Cluster Developer', serverField: 'clusterorg', summary: false, filter:true },
    { label: 'Cloudlet', serverField: 'cloudlet', summary: true, filter:true },
    { label: 'Operator', serverField: 'cloudletorg', summary: true, filter:true },
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
            eventData:[],
            colors:[]
        }
        this.regions = props.regions
    }

    header = (data) => {
        let cluster = data['cluster']
        return (
            <React.Fragment>
                {cluster}
            </React.Fragment>
        )
    }

    render() {
        const { eventData, colors } = this.state
        const { filter } = this.props
        return eventData.length > 0 ? <EventList header='Events' eventData={eventData} filter={filter} colors={colors} keys={clusterEventKeys} header={this.header}/> : 
        <div className="event-list-main" align="center" style={{textAlign:'center', verticalAlign:'middle'}}>
            <div align="left" className="event-list-header">
                <h3>Events</h3>
            </div>
            <h3 style={{marginTop:'16vh'}}><b>No Data</b></h3>
        </div>
    }

    event = async (range) => {
        let mc = await serverData.sendRequest(this, orgEvents({
            match: {
                orgs: [getOrganization()],
                types: ["event"],
                tags: { cluster: "*" },
                names: ["*cluster*", "*Cluster*"],
                starttime: range.starttime,
                endtime: range.endtime,
            },
            limit: 10
        }))
        if (mc && mc.response && mc.response.data) {
            let dataList = mc.response.data
            let colors = randomColor({ count: dataList.length, })
            this.setState({ eventData: dataList, colors })
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.range !== this.props.range)
        {
            this.event(this.props.range)
        }
    }

    componentDidMount() {
        this.event(this.props.range)
    }
}

export default MexAppEvent