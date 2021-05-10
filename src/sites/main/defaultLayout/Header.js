import React from 'react';
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import MexTimezone from './timezone/MexTimezone'
import HelpMenu from './help/HelpMenu'
import EventMenu from './EventMenu'
import Notifications from '../notifications/Notifications'
import UserMenu from '../userSetting/userMenu';
import Organization from './Organization'
import { fields } from '../../../services/model/format';
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

const Header = (props) => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
                <MexTimezone />
                <Organization roles={props.roles} />
                <EventMenu />
                <HelpMenu />
                <Notifications />
                <UserMenu />
            </div>
        </React.Fragment>
    );
}

export default Header
