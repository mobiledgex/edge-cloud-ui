/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Dialog } from '@material-ui/core';
import { lightGreen } from '@material-ui/core/colors';
import UsageLog from '../events/usageLog/UsageLog';
import AuditLog from '../events/auditLog/AuditLog';
import { AUDIT, EVENT } from '../../../helper/constant/perpetual';
import { useSelector, useDispatch } from 'react-redux';
import { showAuditLog } from '../../../actions';

const AUDIT_LOG = 1
const EVENT_LOG = 2
const USAGE_LOG = 3

const drawerWidth = 25

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
        height:'calc(100vh - 2px)',
        overflow: 'hidden',
        backgroundColor:'#292C33',
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
        backgroundColor:'#292C33',
        border: 'none',
        width: 0
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
        float:'right',
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
    const { open, onClose } = props
    const [pageId, setPageId] = React.useState(undefined);
    const classes = useStyles();
    const showAugitLogs = useSelector(state => state.showAuditLog.audit)
    const dispatch = useDispatch();

    useEffect(() => {
        if (Boolean(showAugitLogs)) {
            setPageId(AUDIT_LOG)
        }
    }, [showAugitLogs]);

    const handleClose = () => {
        dispatch(showAuditLog(undefined))
        setPageId(undefined)
    }

    const onMenuClick = (id) => {
        setPageId(id)
    };

    const renderPage = () => {
        switch (pageId) {
            case USAGE_LOG:
                return <UsageLog close={handleClose} />
            case AUDIT_LOG:
                return <AuditLog type={AUDIT} close={handleClose} data={showAugitLogs}/>
            case EVENT_LOG:
                return <AuditLog type={EVENT} close={handleClose} />
        }
    }

    return (
        <React.Fragment>
            <div className={classes.root}>
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