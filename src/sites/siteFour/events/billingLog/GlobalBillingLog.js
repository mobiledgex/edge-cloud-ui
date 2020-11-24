import React, { Suspense, lazy } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
//redux
import { Drawer } from '@material-ui/core';
import { clusterEventLogs } from '../../../../services/model/clusterEvent'
import { appInstEventLogs } from '../../../../services/model/appInstEvent'
import { cloudletEventLogs } from '../../../../services/model/cloudletEvent'
import { sendRequest, sendRequests } from '../../../../services/model/serverWorker'
import { showOrganizations } from '../../../../services/model/organization'

import { fields, getOrganization, getUserRole, isAdmin } from '../../../../services/model/format';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import * as dateUtil from '../../../../utils/date_util'
import cloneDeep from 'lodash/cloneDeep'
import * as constant from '../../../../constant'
import sortBy from 'lodash/sortBy';
import './style.css'

const BillingLog = lazy(() => import('./BillingLog'));
const drawerWidth = 450

const styles = theme => ({
    root: {
        display: 'flex',
        width: '100%',
        height: '100%'
    },
    grid_root: {
        flexGrow: 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawer_full: {
        width: '100%',
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        backgroundColor: 'transparent',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerOpen_full: {
        backgroundColor: 'transparent',
        width: '100%',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        backgroundColor: 'transparent',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(7) + 1,
        },
    },
})
class GlobalBillingLog extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            isOpen: props.open,
            liveData: {},
            loading: false,
        }
        this.action = '';
        this.data = {};
        this.intervalId = undefined;
        this.endRange = dateUtil.currentUTCTime()
        this.startRange = dateUtil.subtractDays(30, dateUtil.startOfDay()).valueOf()
        this.organizationList = []
    }

    /*Action menu block*/

    handleClose = () => {
        this.props.close()
        this.setState({ isOpen: false });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.open && !state.isOpen) {
            return { isOpen: props.open }
        }
        return null
    }

    render() {
        const { classes } = this.props;
        const { isOpen, liveData, loading } = this.state
        return (
            <React.Fragment>
                <Drawer className={clsx(classes.drawer_full, {
                    [classes.drawerOpen_full]: isOpen,
                    [classes.drawerClose]: !isOpen,
                })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen_full]: isOpen,
                            [classes.drawerClose]: !isOpen,
                        }),
                    }} anchor={'right'} open={isOpen}>
                    <Suspense fallback={<div>loading</div>}>
                        <BillingLog close={this.handleClose} liveData={liveData} loading={loading} endRange={this.endRange} organizationList={this.organizationList} onOrgChange={this.onOrganizationChange} selectedOrg={this.selectedOrg} />
                    </Suspense>
                </Drawer>
            </React.Fragment>
        )
    }

    updateData = (eventData) => {
        let liveData = cloneDeep(this.state.liveData)
        Object.keys(eventData).map(key => {
            if (liveData[key]) {
                let values = eventData[key].values
                Object.keys(values).map(dataKey => {
                    let oldValues = liveData[key].values[dataKey]
                    if (oldValues && oldValues.length > 0) {
                        liveData[key].values[dataKey] = [...values[dataKey], ...oldValues]
                    }
                    else {
                        liveData[key].values[dataKey] = values[dataKey]
                    }
                })
            }
            else {
                liveData[key] = eventData[key]
            }
        })
        if (this._isMounted) {
            this.setState({ liveData })
        }
    }

    serverResponse = (mcList) => {
        if (mcList && mcList.length > 0) {
            mcList.map(mc => {
                if (mc && mc.response && mc.response.status === 200) {
                    let data = mc.response.data
                    if (data && data.length > 0) {
                        if (Object.keys(data[0]).length > 0) {
                            this.updateData(data[0])
                        }
                    }
                }
            })
        }
        if (this._isMounted) { this.setState({ loading: false }) }
    }

    onOrganizationChange = (form, value) => {
        this.setState({ liveData: {} })
        clearInterval(this.intervalId)
        this.endRange = dateUtil.currentUTCTime()
        this.startRange = dateUtil.subtractDays(30, dateUtil.startOfDay()).valueOf()
        this.selectedOrg = value
        this.eventLogData(this.startRange, this.endRange, true)
    }

    eventLogData = async (starttime, endtime, isInit) => {
        let regions = localStorage.regions ? localStorage.regions.split(",") : [];
        let userRole = getUserRole()
        if (userRole && regions && regions.length > 0) {
            let requestList = []
            regions.map(region => {
                let data = {}
                let org = getOrganization() ? getOrganization() : this.selectedOrg
                data[fields.region] = region
                data[fields.starttime] = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
                data[fields.endtime] = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
                if (userRole.includes(constant.ADMIN) || userRole.includes(constant.DEVELOPER)) {
                    requestList.push(clusterEventLogs(cloneDeep(data), org))
                    requestList.push(appInstEventLogs(cloneDeep(data), org))
                }
                if (userRole.includes(constant.ADMIN) || userRole.includes(constant.OPERATOR)) {
                    requestList.push(cloudletEventLogs(cloneDeep(data), org))
                }
            })
            if (this._isMounted) { this.setState({ loading: true }) }
            sendRequests(this, requestList, this.serverResponse)


            if (isInit) {
                if (this.intervalId) {
                    clearInterval(this.intervalId)
                }
                this.intervalId = setInterval(() => {
                    if (this._isMounted && this.state.isOpen) {
                        this.startRange = cloneDeep(this.endRange)
                        this.endRange = dateUtil.currentUTCTime()
                        this.eventLogData(this.startRange, this.endRange)
                    }
                }, 60 * 1000);
            }
        }
    }

    componentDidUpdate(prePros, preState) {
        if (this.props.userRole && prePros.userRole !== this.props.userRole) {
            if (this.props.userRole.includes(constant.ADMIN)) {
                sendRequest(this, showOrganizations(), this.orgResponse)
            }
            else {
                this.endRange = dateUtil.currentUTCTime()
                this.startRange = dateUtil.subtractDays(30, dateUtil.startOfDay()).valueOf()
                this.setState({ liveData: {} })
                this.eventLogData(this.startRange, this.endRange)
            }
        }

        //enable interval only when billing log is visible
        if (preState.isOpen !== this.state.isOpen) {
            if (this._isMounted && this.state.isOpen) {
                this.startRange = cloneDeep(this.endRange)
                this.endRange = dateUtil.currentUTCTime()
                this.eventLogData(this.startRange, this.endRange, true)
            }
            else {
                clearInterval(this.intervalId)
            }
        }
    }

    orgResponse = (mc) => {
        if (mc && mc.response && mc.response.status === 200) {
            this.organizationList = sortBy(mc.response.data, [item => item[fields.organizationName]], ['asc']);
            this.selectedOrg = this.organizationList[0][fields.organizationName]
            this.endRange = dateUtil.currentUTCTime()
            this.startRange = dateUtil.subtractDays(30, dateUtil.startOfDay()).valueOf()
            this.setState({ liveData: {} })
            this.eventLogData(this.startRange, this.endRange)
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if (getOrganization()) {
            this.eventLogData(this.startRange, this.endRange)
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this.intervalId);
    }
};

const mapStateToProps = (state) => {
    return {
        userRole: state.showUserRole ? state.showUserRole.role : null,
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(withStyles(styles)(GlobalBillingLog)));