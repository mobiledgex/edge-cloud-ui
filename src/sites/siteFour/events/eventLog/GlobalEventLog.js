import React, { Suspense, lazy } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
//redux
import { Drawer } from '@material-ui/core';
import { clusterEventLogs } from '../../../../services/model/clusterEvent'
import { appInstEventLogs } from '../../../../services/model/appInstEvent'
import { cloudletEventLogs } from '../../../../services/model/cloudletEvent'
import { fields, getOrganization, getUserRole } from '../../../../services/model/format';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import { showSyncMultiData } from '../../../../services/model/serverData';
import * as dateUtil from '../../../../utils/date_util'
import cloneDeep from 'lodash/cloneDeep'
import * as constant from '../../../../constant'
const EventLog = lazy(() => import('./EventLog'));
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
class GlobalEventLogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: props.open,
            liveData: {},
            loading: false,
        }
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
        this.action = '';
        this.data = {};
        this.intervalId = undefined;
        this.endRange = dateUtil.currentUTCTime()
        this.startRange = dateUtil.subtractDays(30, dateUtil.startOfDay()).valueOf()
    }

    /*Action menu block*/

    handleClose = () => {
        this.props.close()
        this.setState({ isOpen: false });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.open) {
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
                        <EventLog close={this.handleClose} liveData={liveData} loading={loading} endRange={this.endRange}/>
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
        this.setState({ liveData })
    }

    eventLogData = async (starttime, endtime, enableInterval) => {
        let userRole = getUserRole()
        if (userRole && this.regions && this.regions.length > 0) {
            let eventRequestList = []
            this.regions.map(region => {
                let data = {}
                data[fields.region] = region
                data[fields.starttime] = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, starttime)
                data[fields.endtime] = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, endtime)
                if (userRole.includes(constant.DEVELOPER)) {
                    eventRequestList.push(clusterEventLogs(data))
                    eventRequestList.push(appInstEventLogs(data))
                }
                else if (userRole.includes(constant.OPERATOR)) {
                    eventRequestList.push(cloudletEventLogs(data))
                }
            })

            this.setState({ loading: true })
            let eventResponseList = await showSyncMultiData(this, eventRequestList)

            this.setState({ loading: false })

            if (eventResponseList && eventResponseList.length > 0) {
                eventResponseList.map((mcRequest) => {
                    if (mcRequest.response && mcRequest.response.data) {
                        let data = mcRequest.response.data
                        if (data && data.length > 0) {
                            if (Object.keys(data[0]).length > 0) {
                                this.updateData(data[0])
                            }
                        }
                    }
                })
            }

            if (enableInterval) {
                if (this.intervalId) {
                    clearInterval(this.intervalId)
                }
                this.intervalId = setInterval(() => {
                    if (this.state.isOpen) {
                        this.startRange = cloneDeep(this.endRange)
                        this.endRange = dateUtil.currentUTCTime()
                        this.eventLogData(this.startRange, this.endRange)
                    }
                }, 10 * 2000);
            }
        }
    }

    componentDidUpdate(prePros, preState)
    {
        //enable interval only when billing log is visible
        if(preState.isOpen !== this.state.isOpen)
        {
            if(this.state.isOpen)
            {
                this.startRange = cloneDeep(this.endRange)
                this.endRange = dateUtil.currentUTCTime()
                this.eventLogData(this.startRange, this.endRange, true)
            }
            else
            {
                clearInterval(this.intervalId)
            }
        }
    }

    componentDidMount() {
        // default request made when organization is available
        if (getOrganization()) {
            this.eventLogData(this.startRange, this.endRange)
        }
        //Live data is reset when end user changes organization and timer is reset back to one month
        window.addEventListener('SelectOrgChangeEvent', () => {
            this.endRange = dateUtil.currentUTCTime()
            this.startRange = dateUtil.subtractDays(30, dateUtil.startOfDay()).valueOf()
            this.setState({ liveData: {} })
            this.eventLogData(this.startRange, this.endRange)
        })
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(withStyles(styles)(GlobalEventLogs)));