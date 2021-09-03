import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
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
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import About from './About'
import RoleLegend from './RoleLegend'

import { Collapse, LinearProgress, Tooltip } from '@material-ui/core';
import { Icon } from '../../../hoc/mexui';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { role } from '../../../helper/constant';

//Header
import Header from './Header'
import EventMenu from './EventMenu';
import { lightGreen } from '@material-ui/core/colors';

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
        width: `calc(100% - ${drawerWidth + 2}px)`,
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
        height:'calc(100vh - 2px)',
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        height:'calc(100vh - 2px)',
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(8) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'right',
        justifyContent: 'flex-end',
        padding: theme.spacing(0.7, 0, 0, 1),
        boxShadow:'0px 1px 5px #000'
    },
    content: {
        flexGrow: 1,
        padding: 2,
        marginTop: 51,
        overflow: 'auto'
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
    fab: {
        position: 'absolute',
        top: theme.spacing(0.7),
        right: -20,
        borderRadius: '200px 0px 0px 200px',
        border:'none',
        height:40,
        width: 25,
        backgroundColor: lightGreen['600'],
        boxShadow: 'default',
        cursor:'pointer'
    },
    sub: {
        backgroundColor: props => props.sub ? '#1E2123' : 'default',
        boxShadow: props => props.sub ? '0px 2px 8px #1E2123' : 'none',
        borderRadius: props => props.sub ? '0 0 5px 5px' : 0,
        "&:hover": {
            backgroundColor: 'default'
        }
    }
}));

const LogsButton = (props) => {
    const classes = useStyles()
    const { open } = props

    return (
        <Tooltip title={<strong>Logs</strong>}>
            <button className={classes.fab} size="small" aria-label="add" onClick={props.onClick}>
                <Icon style={{ color: 'white', marginTop:4 }}>{open ? 'chevron_right' : 'event_note'}</Icon>
            </button>
        </Tooltip>
    )
}


const Options = (props) => {
    const { options, sub, drawerOpen } = props
    const classes = useStyles({ sub });
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const [pageId, setPageId] = React.useState(0)
    const childRef = React.createRef(null)
    let { url } = useRouteMatch();
    const history = useHistory()
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

    const renderItem = (item) => {
        const isSVG = item.icon.includes('.svg')
        return (
            <ListItem button onClick={() => { optionClick(item) }} className={classes.sub}>
                <ListItemIcon>
                    {isSVG ? <img src='/assets/icons/gpu.svg' width={24}/> : <Icon outlined={true}>{item.icon}</Icon>}
                </ListItemIcon>
                <ListItemText primary={item.label} />
                {item.sub ? pageId === item.id ? <ExpandLess /> : <ExpandMore /> : null}
            </ListItem>
        )
    }

    const renderPopover = (item) => {
        // if (!drawerOpen && item.sub) {
        //     return (
        //         <List component='div' disablePadding>
        //             {item.options.map(option => (
        //                 <React.Fragment key={option.id}>
        //                     {renderItem(option)}
        //                 </React.Fragment>
        //             ))}
        //         </List>
        //     )
        // }
        return drawerOpen ? '' : item.label
    }

    return (
        <List component={sub ? 'div' : 'nav'} disablePadding={sub}>
            {options.map((item, i) => (
                item.visible ? <React.Fragment key={i}>
                    {
                        item.divider ?
                            <Divider /> :
                            role.validateRole(item.roles, orgInfo) ? <React.Fragment>
                                <Tooltip title={renderPopover(item)} interactive placement="right" arrow>
                                    {renderItem(item)}
                                </Tooltip>
                                {item.sub ?
                                    <Collapse in={pageId === item.id} timeout="auto" unmountOnExit ref={childRef}>
                                        <Options options={item.options} sub={true} drawerOpen={drawerOpen} />
                                    </Collapse> : null}
                            </React.Fragment> : null
                    }
                </React.Fragment> : null
            ))
            }
        </List >
    )
}

const SideNav = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const [hardOpen, setHardOpen] = React.useState(true);
    const [openLogs, setOpenLogs] = React.useState(true);
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const loading = useSelector(state => state.loadingSpinner.loading)

    const handleDrawerOpen = () => {
        setHardOpen(true)
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setHardOpen(false)
        setOpen(false);
    };

    const onHoverDrawer = (flag) => {
        if(hardOpen === false)
        {
            setOpen(flag)
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                {loading ? <LinearProgress style={{ postion: 'absolute', width: '100%' }} /> : null}
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
                    <LogsButton onClick={()=>{setOpenLogs(!openLogs)}} open={openLogs}/>
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
                onMouseEnter={()=>{onHoverDrawer(true)}}
                onMouseLeave={()=>{onHoverDrawer(false)}}
            >
                <div className={classes.toolbar}>
                    <About className={classes.logo} src='/assets/brand/logo_mex.svg' />
                    <IconButton onClick={handleDrawerClose} aria-label='drawer-control'>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                {open ? <Divider /> : null}
                <RoleLegend drawerOpen={open} />
                {orgInfo ? <Options options={props.data} drawerOpen={open} /> : null}
            </Drawer>
            <main className={classes.content}>
                {props.children}
            </main>
            <EventMenu open={openLogs}/>
        </div>
    );
}

export default SideNav