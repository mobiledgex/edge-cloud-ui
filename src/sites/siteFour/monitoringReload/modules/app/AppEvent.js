import React from 'react'
import EventList from '../../list/EventList'
import * as serverData from '../../../../../services/model/serverData'
import { orgEvents } from '../../../../../services/model/events'
import { getOrganization } from '../../../../../services/model/format'

class MexAppEvent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventData:[]
        }
        this.regions = props.regions
    }

    render() {
        const { eventData } = this.state
        return eventData.length > 0 ? <EventList header='Events' eventData={eventData} /> : null
    }

    event = async (range) => {
        let mc = await serverData.sendRequest(this, orgEvents({
            // starttime: range.starttime,
            // endtime: range.endtime,
            match: {
                orgs: [getOrganization()],
                types: ["event"],
                tags: { app: "*" }
            },
            limit: 10
        }))
        if (mc && mc.response && mc.response.data) {
            let dataList = mc.response.data
            this.setState({ eventData: dataList })
        }
    }

    componentDidMount() {
        this.event()
    }
}

export default MexAppEvent