import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import UserMenu from '../userSetting/userMenu';
import EventMenu from './eventMenu'
import HelpMenu from './helpMenu'
import BusinessIcon from '@material-ui/icons/Business';
import { Button, Image } from 'semantic-ui-react';
import { Dialog, DialogActions, List, ListItem, ListItemText, Menu, MenuItem } from '@material-ui/core';
import MexTimezone from './timezone/MexTimezone'
import { timezones } from '../../../utils/date_util'
import AlertReceiver from '../alerts/AlertGlobal'
import { getUserRole } from '../../../services/model/format';

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
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

export default function Header(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onAbout = () => {
        setOpen(true);
        setAnchorEl(null);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const visible = () => {
        return getUserRole() !== undefined
    }

    return (

        <AppBar
            position="absolute"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: props.open,
            })}
            style={{ zIndex: 10 }}
        >
            <Toolbar style={{ backgroundColor: '#3B3F47' }}>

                {props.open ? null :
                    <Typography variant="h6" noWrap style={{ marginLeft: -14, marginRight: 20 }}>
                        <Image size='mini' src='/assets/brand/X_Logo_green.svg' onClick={handleClickListItem} />
                        <Menu
                            id="lock-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={onAbout}>
                                About
                            </MenuItem>
                        </Menu>
                        <Dialog
                            open={open}
                            onClose={handleDialogClose}
                            fullWidth={true}
                            maxWidth={'xs'}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <List>
                                <ListItem>
                                    <ListItemText align="center">
                                        <p>
                                            <Image size='medium' src='/assets/brand/MobiledgeX_Logo_tm_white.svg'/>
                                        </p>
                                        <p>
                                            <strong>{process.env.REACT_APP_BUILD_VERSION ? process.env.REACT_APP_BUILD_VERSION : 'version 0.0.0'}</strong>
                                        </p>
                                        <p>
                                            <a href="https://mobiledgex.com/" target="_blank" style={{color:'#69A228'}}>www.mobiledgex.com</a>
                                        </p>
                                    </ListItemText>
                                </ListItem>
                            </List>
                            <DialogActions>
                                <Button onClick={handleDialogClose}>
                                    OK
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Typography>

                }
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={props.handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, {
                        [classes.hide]: props.open,
                    })}
                >
                    <MenuIcon />
                </IconButton>
                <div className={classes.grow} />
                <div className={classes.sectionDesktop}>
                    <MexTimezone data={timezones()} header={'Select Timezone'} />
                    {localStorage.selectRole === 'AdminManager' || localStorage.selectOrg ?
                        <IconButton disabled={true} className="orgName">
                            <BusinessIcon fontSize='default' />&nbsp;
                            <h5>
                                {localStorage.selectRole === 'AdminManager' ? "Mexadmin" : localStorage.selectOrg}
                            </h5>
                        </IconButton> : null}
                    <EventMenu/>
                    <HelpMenu viewMode={props.viewMode} helpClick={props.helpClick}/>
                    {visible() ? <AlertReceiver/> : null}
                    <UserMenu email={props.email} data={props.data} />
                </div>
            </Toolbar>
        </AppBar>
    );

}
