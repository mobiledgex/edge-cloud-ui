import React from 'react'
import EventList from '../../list/EventList'
import * as serverData from '../../../../../services/model/serverData'
import { orgEvents } from '../../../../../services/model/events'
import { getOrganization, isAdmin } from '../../../../../services/model/format'
import randomColor from 'randomcolor'

const cloudletEventKeys = [
    { label: 'Cloudlet', serverField: 'cloudlet', summary: true, filter:true },
    { label: 'Operator', serverField: 'cloudletorg', summary: true, filter:true },
    { label: 'Hostname', serverField: 'hostname', summary: true },
    { label: 'Line no', serverField: 'lineno', summary: true },
    { label: 'Span ID', serverField: 'spanid', summary: true },
    { label: 'State', serverField: 'state', summary: true },
    { label: 'Trace ID', serverField: 'traceid', summary: true },
]

class CloudletEvent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventData:[],
            colors:[]
        }
        this.regions = props.regions
    }

    header = (data) => {
        let cloudlet = data['cloudlet']
        return (
            <React.Fragment>
                {cloudlet}
            </React.Fragment>
        )
    }

    render() {
        const { eventData, colors } = this.state
        const { filter } = this.props
        return eventData.length > 0 ? <EventList header='Events' eventData={eventData} filter={filter} colors={colors} keys={cloudletEventKeys} header={this.header}/> : 
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
                orgs: [isAdmin() ? this.props.org : getOrganization()],
                types: ["event"],
                tags: { cloudlet: "*" },
                names: ["*cloudlet*", "*Cloudlet*"],
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
        if(prevProps.org !== this.props.org)
        {
            this.setState({eventData: []}, ()=>{
                this.event(this.props.range)
            })
        }
        if(prevProps.range !== this.props.range)
        {
            this.event(this.props.range)
        }
    }

    componentDidMount() {
        if (!isAdmin()) {
            this.event(this.props.range)
        }
    }
}

export default CloudletEvent