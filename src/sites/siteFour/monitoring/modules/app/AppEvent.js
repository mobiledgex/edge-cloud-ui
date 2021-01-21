import React from 'react'
import EventList from '../../list/EventList'
import { orgEvents } from '../../../../../services/model/events'
import { getOrganization, isAdmin } from '../../../../../services/model/format'
import { sendAuthRequest } from '../../../../../services/model/serverWorker'
import randomColor from 'randomcolor'
import { withRouter } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IconButton, Tooltip } from '@material-ui/core'

const appEventKeys = [
    { label: 'Name', serverField: 'name', summary: false, filter: true },
    { label: 'App', serverField: 'app', summary: false, filter: true, mtags: true },
    { label: 'App Developer', serverField: 'apporg', summary: false, filter: true, mtags: true },
    { label: 'Version', serverField: 'appver', summary: false, mtags: true },
    { label: 'Cluster', serverField: 'cluster', summary: false, filter: true, mtags: true },
    { label: 'Cluster Developer', serverField: 'clusterorg', summary: false, filter: true, mtags: true },
    { label: 'Cloudlet', serverField: 'cloudlet', summary: true, filter: true, mtags: true },
    { label: 'Operator', serverField: 'cloudletorg', summary: true, filter: true, mtags: true },
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
            colors: [],
            showMore: false,
            loading: false
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

    loadMore = () => {
        let starttime = this.props.range.starttime
        let eventData = this.state.eventData
        let endtime = eventData[eventData.length - 1]['timestamp']
        this.event({ starttime, endtime }, true)
    }

    filterData = (filter, dataList)=>{
        let search = filter.search
        let valid = []
        return dataList.filter(data=>{
            let mtags = data.mtags
            appEventKeys.map(key=>{
                let filterData = key.mtags ? mtags[key.serverField] : data[key.serverField]
                if (key.filter && filterData) {
                    valid.push(filterData.toLowerCase().includes(search.toLowerCase()))
                } 
            })
            return valid.includes(true)
        })
    }

    render() {
        const { eventData, colors, showMore, loading } = this.state
        const { filter } = this.props
        return (
            <div>
                <EventList eventData={this.filterData(filter, eventData)} filter={filter} colors={colors} keys={appEventKeys} header={this.header} itemSize={105} itemExpandSize={350} showMore={showMore}/>
                {showMore ? <div className='event-list-more' align="center">
                    {loading ? <CircularProgress size={20}/> :
                        <Tooltip title='More' onClick={this.loadMore}>
                            <IconButton>
                                <ExpandMoreIcon />
                            </IconButton>
                        </Tooltip>}
                </div> : null}
            </div>
        )
    }

    serverResponse = (mc) => {
        if (mc && mc.response && mc.response.data) {
            let more = mc.request.data.more
            let dataList = mc.response.data
            let showMore = dataList.length === 10
            let colors = randomColor({ count: dataList.length, })
            if (more) {
                dataList = [...this.state.eventData, ...dataList]
                colors = [...this.state.colors, ...colors]
            }
            
            this.setState({ eventData: dataList, colors, showMore, loading: false })
        }
    }

    event = async (range, more) => {
        this.setState({ loading: true }, () => {
            sendAuthRequest(this, orgEvents({
                match: {
                    orgs: [isAdmin() ? this.props.org : getOrganization()],
                    types: ["event"],
                    tags: { app: "*" }
                },
                starttime: range.starttime,
                endtime: range.endtime,
                more: more,
                limit: 10
            }), this.serverResponse)
        })
    }



    componentDidUpdate(prevProps, prevState) {
        if (prevProps.org !== this.props.org) {
            this.setState({ eventData: [] }, () => {
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