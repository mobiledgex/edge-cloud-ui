import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Popover from '@material-ui/core/Popover';
import { Badge } from '@material-ui/core';
import {IconButton} from '../../../hoc/mexui'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { showAlerts } from '../../../services/modules/alerts'
import { redux_org } from '../../../helper/reduxData'
import * as constant from '../../../constant'
import Alerts from './alerts/Alerts'
import sortBy from 'lodash/sortBy'
import './style.css'

import notificationWorker from './services/notifcation.worker.js';
import { operators } from '../../../helper/constant';
import { fetchToken } from '../../../services/service';
import { fields } from '../../../services/model/format';
import { LS_NOTIFICATION } from '../../../helper/constant/perpetual';
import isEmpty from 'lodash/isEmpty';

const alertStatus = () => {
    try {
        let item = localStorage.getItem(LS_NOTIFICATION)
        item = item ? JSON.parse(item) : undefined
        return item
    }
    catch (e) {
        return undefined
    }
}

const setAlertStatus = (data) => {
    localStorage.setItem(LS_NOTIFICATION, data ? JSON.stringify(data) : undefined)
}
class AlertGlobal extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            anchorEl: null,
            dataList: [],
            showDot: alertStatus() ? alertStatus().showDot : false
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
        let storedStatus = alertStatus()
        let showDot = false
        if (storedStatus) {
            storedStatus.showDot = showDot
            setAlertStatus(storedStatus)
        }
        this.updateState({ anchorEl: event.currentTarget, showDot })
    };

    handleClose = () => {
        this.updateState({ anchorEl: null })
    };

    render() {
        const { anchorEl, dataList, showDot } = this.state
        return (
            <div style={{ marginTop: 5 }}>
                <IconButton onClick={this.handleClick} tooltip='Notifications'>
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

    processDot = (newDate) => {
        let showDot = this.state.showDot
        let storedStatus = alertStatus()
        if (storedStatus === undefined || isEmpty(storedStatus)) {
            if (newDate) {
                showDot = true
                setAlertStatus({ date: newDate, showDot })
            }
        }
        else {
            const date = storedStatus.date
            showDot = storedStatus.showDot
            if (date && newDate) {
                showDot = date < newDate ? true : showDot
                setAlertStatus({ date: newDate, showDot })
            }
        }
        return showDot
    }

    workerListener = () => {
        this.worker.addEventListener('message', (event) => {
            let response = event.data
            if (response.status === 200) {
                let responseData = response.data.data
                const region = response.data.region
                if (responseData.length > 0) {
                    let newDataList = sortBy(responseData, [fields.activeAt]).reverse()
                    let newActiveDate = newDataList[0][fields.activeAt]
                    const showDot = this.processDot(newActiveDate)
                    if (this._isMounted) {
                        this.setState(prevState => {
                            let dataList = prevState.dataList
                            dataList = [...dataList, ...newDataList]
                            return { dataList, showDot }
                        })
                    }
                }
            }
        })
    }

    sendRequest = (region) => {
        this.worker.postMessage({ token: fetchToken(this), request: showAlerts(this, { region }) })
    }

    fetchdata = () => {
        this.regions.map(region => {
            this.sendRequest(region)
        })

        this.intervalId = setInterval(() => {
            this.regions.map(region => {
                this.sendRequest(region)
            })
        }, 3 * 10 * 1000);
    }

    componentDidMount() {
        this.workerListener()
        this._isMounted = true
        if (redux_org.orgName(this) || redux_org.isAdmin(this)) {
            this.fetchdata()
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.organizationInfo && !operators.equal(this.props.organizationInfo, prevProps.organizationInfo)) {
            if (redux_org.isAdmin(this)) {
                this.fetchdata()
            }
            else {
                clearInterval(this.intervalId)
                this.updateState({ dataList: [] })
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

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
}

export default withRouter(connect(mapStateToProps, null)(AlertGlobal));