import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Popover from '@material-ui/core/Popover';
import { Badge } from '@material-ui/core';
import { IconButton } from '../../../hoc/mexui'
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { showAlerts } from '../../../services/modules/alerts'
import { redux_org } from '../../../helper/reduxData'
import Alerts from './alerts/Alerts'
import sortBy from 'lodash/sortBy'
import './style.css'

import NotificationWorker from './services/notifcation.worker.js';
import { operators } from '../../../helper/constant';
import { localFields } from '../../../services/fields';
import { LS_NOTIFICATION, RESPONSE_STATUS_SUCCESS } from '../../../helper/constant/perpetual';
import { processWorker } from "../../../services/worker/interceptor";
import isEmpty from 'lodash/isEmpty';
import { fetchToken } from '../../../services/config';

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
        this.regions = props.regions
        this.worker = undefined
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

    terminateWorker = (worker) => {
        if (Boolean(worker)) {
            worker.removeEventListener('message', () => { })
            worker.terminate()
        }
    }

    fetchdata = async () => {
        this.terminateWorker(this.worker)
        this.worker = new NotificationWorker()
        let requestList = []
        this.regions.map(region => {
            requestList.push(showAlerts(this, { region }))
        })
        let response = await processWorker(this, this.worker, {
            token: fetchToken(this),
            requestList: requestList
        })
        if (response?.status === RESPONSE_STATUS_SUCCESS) {
            let dataList = response.data?.alertList
            if (dataList?.length > 0) {
                dataList = sortBy(dataList, [localFields.activeAt]).reverse()
                let newActiveDate = dataList[0][localFields.activeAt]
                const showDot = this.processDot(newActiveDate)
                this.updateState({ dataList, showDot })
            }
        }
    }

    componentDidMount() {
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
                this.updateState({ dataList: [] })
                this.fetchdata()
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false
        this.terminateWorker(this.worker)
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data,
        regions: state.regionInfo.region
    }
}

export default withRouter(connect(mapStateToProps, null)(AlertGlobal));