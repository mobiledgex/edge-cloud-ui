import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MexTimezone from './timezone/MexTimezone'
import HelpMenu from './help/HelpMenu'
import EventMenu from './EventMenu'
import Notifications from '../notifications/Notifications'
import UserMenu from '../userSetting/userMenu';
import { getOrganization, isAdmin } from '../../../services/model/format';
import BusinessIcon from '@material-ui/icons/Business';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
}));

const Organization = (props) => (
    isAdmin() || getOrganization() ?
        <IconButton disabled={true} style={{ marginTop: 4 }}>
            <BusinessIcon fontSize='default' />&nbsp;
            <h5>
                {isAdmin() ? "Mexadmin" : getOrganization()}
            </h5>
        </IconButton> : null
)

export default function Header(props) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
                <MexTimezone />
                <Organization />
                <EventMenu />
                <HelpMenu />
                <Notifications />
                <UserMenu />
            </div>
        </React.Fragment>
    );
}
