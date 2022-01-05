import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MexTimezone from './timezone/MexTimezone'
import HelpMenu from './help/HelpMenu'
import Notifications from '../notifications/Notifications'
import UserMenu from '../userSetting/UserMenu';
import Organization from './Organization'

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
        marginRight: 5
    }
}));

const Header = (props) => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
                <MexTimezone />
                <Organization />
                <HelpMenu />
                <Notifications />
                <UserMenu />
            </div>
        </React.Fragment>
    );
}

export default Header
