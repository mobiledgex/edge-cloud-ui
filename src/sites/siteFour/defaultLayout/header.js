import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HeaderGlobalMini from '../../../container/headerGlobalMini';
import HeaderGlobalAudit from '../../../container/headerGlobalAudit';

import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';

import { Image, Button } from 'semantic-ui-react';
import { Menu, MenuItem, DialogContent, DialogContentText, Dialog, DialogActions } from '@material-ui/core';

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
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    <Image size='small' src='/assets/brand/MobiledgeX_Logo_tm_white.svg' />
                                </DialogContentText>
                                <DialogContentText>
                                    <div align="center" style={{ fontSize: 13 }}><strong>{process.env.REACT_APP_BUILD_VERSION ? process.env.REACT_APP_BUILD_VERSION : 'version 0.0.0'}</strong></div>
                                </DialogContentText>
                                <DialogContentText>
                                    <div align="center"><a href="https://mobiledgex.com/" target="_blank">www.mobiledgex.com</a></div>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleDialogClose} color="primary">
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
                    <IconButton disabled={true} className="orgName">
                        {
                            localStorage.selectRole === 'AdminManager' || localStorage.selectOrg ?
                                <h5>
                                    <strong>Organization: </strong>
                                    {localStorage.selectRole === 'AdminManager' ? "Mexadmin" : localStorage.selectOrg}
                                </h5> :
                                null
                        }
                    </IconButton>
                    <HeaderGlobalAudit />
                    <IconButton aria-label="show 17 new notifications" color="inherit"
                        onClick={(e) => props.helpClick()} disabled={props.viewMode !== null ? false : true}>
                        <HelpOutlineOutlinedIcon fontSize='default' />
                    </IconButton>
                    <HeaderGlobalMini email={props.email} data={props.data} />
                </div>
            </Toolbar>
        </AppBar>
    );
}
