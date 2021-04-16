import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Popover from '@material-ui/core/Popover';
import { Badge, IconButton } from '@material-ui/core';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { showAlerts } from '../../../services/model/alerts'
import * as constant from '../../../constant'
import Alerts from './alerts/Alerts'
import './style.css'
import { getOrganization } from '../../../services/model/format';

import notificationWorker from './services/notifcation.worker.js'
import { getToken } from '../monitoring/services/service';

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
        this.worker = new notificationWorker()
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
                <IconButton onClick={this.handleClick} aria-label="alert-menu" aria-haspopup="true">
                    {
                        showDot ?
                            <Badge color="secondary" variant="dot">
                                <NotificationsNoneIcon />
                            </Badge> :
                            <NotificationsNoneIcon />
                    }
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
                        <Alerts data={dataList} handleClose={this.handleClose} />
                    </div>
                </Popover>
            </div>
        );
    }

    workerListener = () => {
        this.worker.addEventListener('message', (event) => {
            let response = event.data
            if (response.status === 200) {
                let data = response.data
                localStorage.setItem('LatestAlert', data.activeAt)
                let showDot = data.showDot
                if (this._isMounted) {
                    this.setState(prevState => {
                        let dataList = prevState.dataList
                        dataList[data.region] = data.data
                        return { dataList, showDot }
                    })
                }
            }
        })
    }

    sendRequest = (region) => {
        this.worker.postMessage({ token: getToken(this), request: showAlerts({ region }) })
    }

    fetchdata = () => {
        this.regions.map(region => {
            this.sendRequest(region)
        })

        this.intervalId = setInterval(() => {
            this.regions.map(region => {
                this.sendRequest(region)
            })
        }, 10 * 60 * 1000);
    }

    componentDidMount() {
        this.workerListener()
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
        this.worker.removeEventListener('message', () => { })
        this.worker.terminate()
    }
}



function mapStateToProps(state) {
    return {
        userRole: state.showUserRole ? state.showUserRole.role : null,
    }
}

export default withRouter(connect(mapStateToProps, null)(AlertGlobal));