import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import EventList from '../../list/EventList'
import { orgEvents } from '../../../../../services/modules/audit'
import {redux_org} from '../../../../../helper/reduxData'
import randomColor from 'randomcolor'
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IconButton, Tooltip } from '@material-ui/core'
import { authSyncRequest } from '../../../../../services/service'

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
        this._isMounted = false
        this.regions = props.regions
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
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

    filterData = (filter, dataList) => {
        let search = filter.search
        let valid = []
        return dataList.filter(data => {
            let mtags = data.mtags
            appEventKeys.map(key => {
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
                <EventList eventData={this.filterData(filter, eventData)} filter={filter} colors={colors} keys={appEventKeys} header={this.header} itemSize={105} itemExpandSize={350} showMore={showMore} />
                {showMore ? <div className='event-list-more' align="center">
                    {loading ? <CircularProgress size={20} /> :
                        <Tooltip title='More' onClick={this.loadMore}>
                            <IconButton>
                                <ExpandMoreIcon />
                            </IconButton>
                        </Tooltip>}
                </div> : null}
            </div>
        )
    }

    event = async (range, more) => {
        if (this._isMounted) {
            this.updateState({ loading: true })
            const requestData = orgEvents({
                match: {
                    orgs: [redux_org.isAdmin(this) ? this.props.org : redux_org.nonAdminOrg(this)],
                    types: ["event"],
                    tags: { app: "*" }
                },
                starttime: range.starttime,
                endtime: range.endtime,
                more: more,
                limit: 10
            })
            let mc = await authSyncRequest(this, { ...requestData, format: false })
            if (mc && mc.response && mc.response.status === 200) {
                let more = mc.request.data.more
                let dataList = mc.response.data
                let showMore = dataList.length === 10
                let colors = randomColor({ count: dataList.length, })
                if (more) {
                    dataList = [...this.state.eventData, ...dataList]
                    colors = [...this.state.colors, ...colors]
                }

                this.updateState({ eventData: dataList, colors, showMore })
            }
            this.updateState({loading: false})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.org !== this.props.org) {
            if (this._isMounted) {
                this.setState({ eventData: [] }, () => {
                    this.event(this.props.range)
                })
            }
        }
        if (prevProps.range !== this.props.range) {
            this.event(this.props.range)
        }
    }

    componentDidMount() {
        this._isMounted = true
        if (!redux_org.isAdmin(this) || this.props.org) {
            this.event(this.props.range)
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default withRouter(connect(mapStateToProps, null)(MexAppEvent));