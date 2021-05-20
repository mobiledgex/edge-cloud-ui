import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import About from './About'
import RoleLegend from './RoleLegend'

import { Collapse, Icon, Tooltip } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';

//Header
import Header from './Header'
import { PAGE_APP_INSTANCES, PAGE_CLUSTER_INSTANCES } from '../../../constant';
import { getUserRole } from '../../../services/model/format';
import { useSelector } from 'react-redux';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
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
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
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
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(8) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(0.5),
        marginTop:51,
        overflow:'auto'
    },
    xLogo: {
        width: 40,
        marginRight: 20,
        marginTop: 6,
        marginLeft: -15
    },
    logo: {
        width: 160,
        marginTop: 5,
        marginRight: 10
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

export const validateRole = (item, isPrivate) => {
    let roles = item.roles
    let valid = true
    if (roles) {
        valid = false
        for (let role of roles) {
            if (getUserRole().includes(role)) {
                valid = true
                break;
            }
        }
    }
    if((item.id === PAGE_CLUSTER_INSTANCES || item.id === PAGE_APP_INSTANCES) && isPrivate)
    {
        valid = true
    }
    return valid
}


const Options = (props) => {
    const { options, sub, drawerOpen } = props
    const [pageId, setPageId] = React.useState(0)
    const childRef = React.createRef(null)
    let { url } = useRouteMatch();
    const history = useHistory()
    const isPrivate = useSelector(state =>  state.privateAccess.data ? state.privateAccess.data.isPrivate : false)
    useEffect(() => {
        setPageId(0)
    }, [drawerOpen])

    const optionClick = (item) => {
        if (item.sub) {
            if (drawerOpen) {
                setPageId(pageId === item.id ? undefined : item.id)
            }
        }
        else {
            history.push(`${url}/${item.path}`)
        }
    }

    const renderItem = (item) => (
        <ListItem button onClick={() => { optionClick(item) }}>
            <ListItemIcon>
                <Icon className='material-icons-outlined'>{item.icon}</Icon>
            </ListItemIcon>
            <ListItemText primary={item.label} />
            {item.sub ? pageId === item.id ? <ExpandLess /> : <ExpandMore /> : null}
        </ListItem>
    )

    const renderPopover = (item) => {
        if (!drawerOpen && item.sub) {
            return (
                <List component='div' disablePadding>
                    {item.options.map(option => (
                        <React.Fragment key={option.id}>
                            {renderItem(option)}
                        </React.Fragment>
                    ))}
                </List>
            )
        }
        return drawerOpen ? '' : item.label
    }

    return (
        <List component={sub ? 'div' : 'nav'} disablePadding={sub}>
            {options.map((item, i) => (
                <React.Fragment key={i}>
                    {
                        item.divider ?
                            <Divider /> :
                            validateRole(item, isPrivate) ? <React.Fragment>
                                <Tooltip title={renderPopover(item)} interactive placement="right" arrow>
                                    {renderItem(item)}
                                </Tooltip>
                                {item.sub ?
                                    <Collapse in={pageId === item.id} timeout="auto" unmountOnExit ref={childRef}>
                                        <Options options={item.options} sub={true} drawerOpen={drawerOpen} />
                                    </Collapse> : null}
                            </React.Fragment> : null
                    }
                </React.Fragment>
            ))
            }
        </List >
    )
}

const SideNav = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar style={{ backgroundColor: '#3B3F47' }}>
                    <About className={clsx(classes.xLogo, { [classes.hide]: open, })} src='/assets/brand/X_Logo_green.svg' />
                    <IconButton
                        color="inherit"
                        aria-label="open-drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Header />
                </Toolbar>
            </AppBar>
            <Drawer
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
                <div className={classes.toolbar}>
                    <About className={classes.logo} src='/assets/brand/logo_mex.svg' />
                    <IconButton onClick={handleDrawerClose} aria-label='drawer-control'>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                {open ? <Divider /> : null}
                <RoleLegend drawerOpen={open}/>
                {getUserRole() ? <Options options={props.data} drawerOpen={open} /> : null}
            </Drawer>
            <main className={classes.content}>
                {props.children}
            </main>
        </div>
    );
}

export default SideNav