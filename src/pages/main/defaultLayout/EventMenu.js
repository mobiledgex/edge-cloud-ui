import React from 'react';
import clsx from 'clsx';
<<<<<<< HEAD
import { makeStyles } from '@material-ui/core/styles';
=======
import { makeStyles, useTheme } from '@material-ui/core/styles';
>>>>>>> 59e3b0f29441f45ed8d9ba7d17f3da5025094b0a
import Drawer from '@material-ui/core/Drawer';
import { Icon } from '../../../hoc/mexui';
import { Fab, Tooltip, Dialog } from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';
import UsageLog from '../events/usageLog/UsageLog';
<<<<<<< HEAD
import AuditLog from '../events/auditLog/AuditLog';
import { AUDIT, EVENT } from '../../../helper/constant/perpetual';

const AUDIT_LOG = 1
const EVENT_LOG = 2
const USAGE_LOG = 3

=======

const AUDIT_LOG = 1
const EVENT_LOG = 2
const USAGE_LOG = 3

>>>>>>> 59e3b0f29441f45ed8d9ba7d17f3da5025094b0a
const drawerWidth = 20

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        border: 'none',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflow: 'hidden',
        backgroundColor: 'transparent',
        border: 'none',
        width: 0
    },
    fab: {
        position: 'absolute',
        top: theme.spacing(0.7),
        right: theme.spacing(0),
        borderRadius: '30px 0px 0px 30px',
        zIndex: 9999,
        width: 30,
        backgroundColor: lightGreen['600'],
        boxShadow: 'default'
    },
    tip: {
        fontSize: 13
    },
    content: {
        marginTop: '35vh',
    },
    verticalbtn: {
        fontWeight: 900,
        padding: '10px 2px',
        backgroundColor: lightGreen['600'],
        writingMode: 'vertical-lr',
        cursor: 'pointer',
        marginBottom: 10,
        width: 20,
        borderRadius: '5px 0px 0px 5px',
    }
}));

const menuOptions = [
    { id: AUDIT_LOG, label: 'Audit Logs' },
    { id: EVENT_LOG, label: 'Event Logs' },
    { id: USAGE_LOG, label: 'Usage Logs' }
]

const EventMenu = (props) => {
    const [open, setOpen] = React.useState(false);
    const [pageId, setPageId] = React.useState(undefined);
    const classes = useStyles();

    const handleClose = () => {
        setPageId(undefined)
    }

    const handleClick = () => {
        setOpen(!open);
        handleClose()
    }

    const onMenuClick = (id) => {
        setPageId(id)
    };

    const renderPage = () => {
        switch (pageId) {
            case USAGE_LOG:
                return <UsageLog close={handleClose} />
<<<<<<< HEAD
            case AUDIT_LOG:
                return <AuditLog type={AUDIT} close={handleClose} />
            case EVENT_LOG:
                return <AuditLog type={EVENT} close={handleClose} />
=======
>>>>>>> 59e3b0f29441f45ed8d9ba7d17f3da5025094b0a
        }
    }

    return (
        <React.Fragment>
            <div className={classes.root}>
<<<<<<< HEAD
                {pageId ? null : <Tooltip title={<strong className={classes.tip}>Logs</strong>}>
=======
                {pageId ? null : <Tooltip title={<strong className={classes.tip}>Events</strong>}>
>>>>>>> 59e3b0f29441f45ed8d9ba7d17f3da5025094b0a
                    <Fab className={classes.fab} size="small" aria-label="add" onClick={handleClick}>
                        <Icon style={{ color: 'white', marginLeft: 5 }}>{open ? 'chevron_right' : 'event_note'}</Icon>
                    </Fab>
                </Tooltip>}
                <Drawer
                    anchor={'right'}
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.content}>
                        {menuOptions.map(option => (
                            <div key={option.id} className={classes.verticalbtn} onClick={() => { onMenuClick(option.id) }}>{option.label}</div>
                        ))}
                    </div>
                </Drawer>
            </div>
            <Dialog open={pageId !== undefined} fullScreen>
                {renderPage()}
            </Dialog>
        </React.Fragment>
    );
}

export default EventMenu