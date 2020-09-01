import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
//redux
import { IconButton, Drawer, Grid, Paper } from '@material-ui/core';
import EventNoteIcon from '@material-ui/icons/EventNote';
import EventLog from './EventLog'
import { showClusterInsts } from '../../../../services/model/clusterInstance'
import { showAppInsts } from '../../../../services/model/appInstance'
import { clusterEventLogs } from '../../../../services/model/clusterEvent'
import { appInstEventLogs } from '../../../../services/model/appInstEvent'
import { fields } from '../../../../services/model/format';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import MexCalendar from './MexCalendar'
import { showSyncMultiData } from '../../../../services/model/serverData';
import { SHOW_CLUSTER_INST } from '../../../../services/model/endPointTypes';

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
            isOpen: false,
            liveData: {},
            fullscreen: false,
        }
        this.action = '';
        this.data = {};
    }

    /*Action menu block*/

    fullScreenView = (flag) => {
        this.setState({ fullscreen: flag })
    }

    handleOpen = () => {
        this.setState({ isOpen: true, isOrg: false });
    }

    handleClose = () => {
        this.setState({ isOpen: false });
    }

    render() {
        const { classes } = this.props;
        const { isOpen, liveData, fullscreen } = this.state
        return (
            <React.Fragment>
                <IconButton style={{ backgroundColor: 'transparent' }} color='inherit' onClick={this.handleOpen}>
                    <EventNoteIcon fontSize='default' />
                </IconButton>
                <Drawer className={clsx(fullscreen ? classes.drawer_full : classes.drawer, {
                    [fullscreen ? classes.drawerOpen_full : classes.drawerOpen]: isOpen,
                    [classes.drawerClose]: !isOpen,
                })}
                    classes={{
                        paper: clsx({
                            [fullscreen ? classes.drawerOpen_full : classes.drawerOpen]: isOpen,
                            [classes.drawerClose]: !isOpen,
                        }),
                    }} anchor={'right'} open={isOpen}>
                    <EventLog close={this.handleClose} liveData={liveData} fullScreenView={this.fullScreenView} />
                </Drawer>
            </React.Fragment>
        )
    }

    updateData = (eventData) => {
        let keys = Object.keys(eventData)
        let oldEventData = this.state.liveData
        keys.map(key => {
            if (eventData[key]) {
                if (oldEventData[key]) {
                    oldEventData[key].values.push(eventData[key].values)
                }
                else {
                    let colorType = eventData[key].colorType
                    let columns = eventData[key].columns
                    let values = eventData[key].values
                    oldEventData = {}
                    oldEventData[key] = { columns: columns, colorType: colorType, values: [values] } 
                }
                this.setState({ liveData: oldEventData })
            }
        })
    }

    eventLogData = async () => {
        let data = {}
        data[fields.region] = 'EU'
        let requestList = []
        requestList.push(showClusterInsts(data))
        requestList.push(showAppInsts(data))
        let mcRequestList = await showSyncMultiData(this, requestList)
        if(mcRequestList && mcRequestList.length>0)
        {
            let eventRequestList = []
            mcRequestList.map((mcRequest)=>{
                let request = mcRequest.request
                if(mcRequest.response && mcRequest.response.data)
                {
                    let dataList = mcRequest.response.data
                    if(request.method === SHOW_CLUSTER_INST)
                    {
                        dataList.map(item=>{
                            eventRequestList.push(clusterEventLogs(item))
                        }) 
                    }
                }
            })
            if (eventRequestList.length > 0) {

                let eventResponseList = await showSyncMultiData(this, eventRequestList)
                if (eventResponseList && eventResponseList.length > 0) {
                    eventResponseList.map((mcRequest)=>{
                        if(mcRequest.response && mcRequest.response.data)
                        {
                            let data = mcRequest.response.data
                            this.updateData(data)
                        }
                    })
                }
            }
        }
    }

    componentDidMount() {
        let organization = localStorage.getItem('selectOrg')
        if (organization) {
            this.eventLogData()
        }
        window.addEventListener('SelectOrgChangeEvent', () => {
            this.eventLogData()
        })
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(withStyles(styles)(GlobalEventLogs)));