import React from 'react'
import EventList from '../../list/EventList'
import * as serverData from '../../../../../services/model/serverData'
import { orgEvents } from '../../../../../services/model/events'
import { getOrganization } from '../../../../../services/model/format'
import randomColor from 'randomcolor'

class MexAppEvent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            eventData:[],
            colors:[]
        }
        this.regions = props.regions
    }

    render() {
        const { eventData, colors } = this.state
        const { filter } = this.props
        return eventData.length > 0 ? <EventList header='Events' eventData={eventData} filter={filter} colors={colors}/> : null
    }

    event = async (range) => {
        let mc = await serverData.sendRequest(this, orgEvents({
            match: {
                orgs: [getOrganization()],
                types: ["event"],
                tags: { app: "*" },
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

    componentDidMount() {
        this.event(this.props.range)
    }
}

export default MexAppEvent