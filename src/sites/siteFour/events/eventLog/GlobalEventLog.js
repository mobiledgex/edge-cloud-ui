import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
//redux
import { IconButton, Drawer, Grid, Paper } from '@material-ui/core';
import EventNoteIcon from '@material-ui/icons/EventNote';
import EventLog from './EventLog'
import { clusterEventLogs } from '../../../../services/model/clusterEvent'
import { appInstEventLogs } from '../../../../services/model/appInstEvent'
import { fields } from '../../../../services/model/format';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import MexCalendar from './MexCalendar'

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
        console.log('Rahul1234', eventData)
        let keys = Object.keys(eventData)
        let liveData = this.state.liveData
        keys.map(key => {
            if (liveData[key]) {
                liveData[key].push(eventData)
            }
            else {
                this.setState({ liveData: eventData })
            }
        })
    }

    eventLogData = async () => {
        let data = {}
        data[fields.region] = 'EU'
        data[fields.organizationName] = localStorage.getItem('selectOrg')
        let eventData = await clusterEventLogs(this, data)
        this.updateData(eventData)
        //eventData = await appInstEventLogs(this, data)
        //this.updateData(eventData)

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