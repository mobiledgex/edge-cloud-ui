import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import Popover from '@material-ui/core/Popover';
import { Badge, IconButton } from '@material-ui/core';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { showAlerts } from '../../../services/model/alerts'
import { sendRequest } from '../../../services/model/serverWorker'
import * as constant from '../../../constant'
import AlertLocal from './AlertLocal'
import './style.css'

class AlertGlobal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            dataList: [],
            showDot: false
        }
        this.intervalId = undefined
        this.regions = constant.regions()
    }

    handleClick = (event) => {
        this.setState({ anchorEl: event.currentTarget, showDot: false })
    };

    handleClose = () => {
        this.setState({ anchorEl: null })
    };

    render() {
        const { anchorEl, dataList, showDot } = this.state
        return (
            <div style={{ marginTop: 5 }}>
                <IconButton onClick={this.handleClick}>
                    {showDot ? <Badge color="secondary" variant="dot">
                        <NotificationsNoneIcon />
                    </Badge> : <NotificationsNoneIcon />}

                </IconButton>
                <Popover
                    id={'Alert Receiver'}
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <div style={{ width: 500 }}>
                        <AlertLocal data={dataList} handleClose={this.handleClose} />
                    </div>
                </Popover>
            </div>
        );
    }

    serverResponse = (mc) => {
        if (mc && mc.response && mc.response.status === 200) {
            let data = mc.response.data
            this.setState(prevState => {
                let dataList = prevState.dataList
                dataList = data
                let latestData = dataList[dataList.length - 1]
                let activeAt = localStorage.getItem('LatestAlert')
                let showDot = false
                if (activeAt) {
                    showDot = latestData.activeAt > activeAt
                }
                else {
                    showDot = true
                }

                localStorage.setItem('LatestAlert', latestData.activeAt)
                return { dataList, showDot }
            })
        }
    }

    fetchdata = ()=>{
        this.regions.map(region => {
            sendRequest(this, showAlerts({ region }), this.serverResponse)
        })

        this.intervalId = setInterval(() => {
            this.regions.map(region => {
                sendRequest(this, showAlerts({ region }), this.serverResponse)
            })
        }, 60 * 1000);
    }

    componentDidMount() {
        this.fetchdata()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.userRole && prevProps.userRole !== this.props.userRole) {
            clearInterval(this.intervalId)
            this.setState({dataList : []})
            this.fetchdata()
        }
    }

    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId)
        }
    }
}



function mapStateToProps(state) {
    return {
        userRole: state.showUserRole ? state.showUserRole.role : null,
    }
}

export default withRouter(connect(mapStateToProps, null)(AlertGlobal));