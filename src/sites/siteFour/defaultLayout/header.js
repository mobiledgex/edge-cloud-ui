import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import HeaderGlobalMini from '../../../container/headerGlobalMini';

import PublicOutlinedIcon from '@material-ui/icons/PublicOutlined';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';

import { Image } from 'semantic-ui-react';
import { Button } from '@material-ui/core';

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

    return (

        <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
                [classes.appBarShift]: props.open,
            })}
        >
            <Toolbar style={{ backgroundColor: '#3B3F47' }}>
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
                <Typography variant="h6" noWrap>
                    <Image wrapped size='small' src='/assets/brand/logo_mex.svg' />
                </Typography>
                <div className={classes.grow} />
                <div className={classes.sectionDesktop}>
                    <IconButton aria-label="show 4 new mails" color="inherit" onClick={(e)=>props.gotoUrl('/site1', 'pg=0')}>
                        <PublicOutlinedIcon fontSize='large'/>
                    </IconButton>
                    <IconButton aria-label="show 17 new notifications" color="inherit" onClick={(e)=>props.helpClick()}>
                        <HelpOutlineOutlinedIcon fontSize='large'/>
                    </IconButton>
                    <HeaderGlobalMini email={props.email} data={props.data}/>
                </div>
            </Toolbar>
        </AppBar>
    );
}
