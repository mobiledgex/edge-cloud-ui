import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Popover from '@material-ui/core/Popover';
import { Badge, IconButton } from '@material-ui/core';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { showAlerts } from '../../../services/model/alerts'
import { sendAuthRequest } from '../../../services/model/serverWorker'
import * as constant from '../../../constant'
import AlertLocal from './AlertLocal'
import './style.css'
import { getOrganization } from '../../../services/model/format';

class AlertGlobal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            dataList: {},
            showDot: false
        }
        this._isMounted = false
        this.intervalId = undefined
        this.regions = constant.regions()
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    handleClick = (event) => {
        this.updateState({ anchorEl: event.currentTarget, showDot: false })
    };

    handleClose = () => {
        this.updateState({ anchorEl: null })
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
            if (data && data.length > 0) {
                let region = mc.request.data.region
                if (this._isMounted) {
                    this.setState(prevState => {
                        let dataList = prevState.dataList
                        let latestData = data[data.length - 1]
                        let activeAt = localStorage.getItem('LatestAlert')
                        let showDot = false
                        if (activeAt) {
                            showDot = latestData.activeAt > activeAt
                        }
                        else {
                            showDot = true
                        }
                        localStorage.setItem('LatestAlert', latestData.activeAt)
                        dataList[region] = data
                        return { dataList, showDot }
                    })
                }
            }
        }
    }

    fetchdata = () => {
        this.regions.map(region => {
            sendAuthRequest(this, showAlerts({ region }), this.serverResponse)
        })

        this.intervalId = setInterval(() => {
            this.regions.map(region => {
                sendAuthRequest(this, showAlerts({ region }), this.serverResponse)
            })
        }, 60 * 1000);
    }

    componentDidMount() {
        this._isMounted = true
        let userRole = this.props.userRole
        if (getOrganization() || (userRole && userRole.includes(constant.ADMIN))) {
            this.fetchdata()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.userRole && prevProps.userRole !== this.props.userRole) {
            if (this.props.userRole.includes(constant.ADMIN)) {
                this.fetchdata()
            }
            else {
                clearInterval(this.intervalId)
                this.updateState({ dataList: {} })
                this.fetchdata()
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false
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