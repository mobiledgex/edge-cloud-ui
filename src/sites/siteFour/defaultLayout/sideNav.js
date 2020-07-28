import React, { useEffect } from 'react';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MexHeader from './header'
import {getUserRole} from '../../../services/model/format'
import * as constant from '../../../constant'

import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';
import AssignmentIndOutlinedIcon from '@material-ui/icons/AssignmentIndOutlined';
import DvrOutlinedIcon from '@material-ui/icons/DvrOutlined';
import CloudQueueOutlinedIcon from '@material-ui/icons/CloudQueueOutlined';
import CloudCircleOutlinedIcon from '@material-ui/icons/CloudCircleOutlined';
import FreeBreakfastOutlinedIcon from '@material-ui/icons/FreeBreakfastOutlined';
import StorageOutlinedIcon from '@material-ui/icons/StorageOutlined';
import AppsOutlinedIcon from '@material-ui/icons/AppsOutlined';
import GamesOutlinedIcon from '@material-ui/icons/GamesOutlined';
import TvOutlinedIcon from '@material-ui/icons/TvOutlined'; 
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PolicyIcon from '@material-ui/icons/Policy';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import LandscapeOutlinedIcon from '@material-ui/icons/LandscapeOutlined';

import SiteFourPageOrganization from '../organization/organizationList';
import SiteFourPageAccount from '../accounts/accountList';
import SiteFourPageUser from '../userRole/userList';
import SiteFourPageCloudlet from '../cloudlets/cloudletList';
import SiteFourPageCloudletPool from '../cloudletPool/cloudletPoolList';
import SiteFourPageFlavor from '../flavors/flavorList';
import SiteFourPageApps from '../apps/appList';
import SiteFourPageAppInst from '../appInst/appInstList';
import SiteFourPageClusterInst from '../clusterInst/clusterInstList';
import AutoProvPolicy from '../policies/autoProvPolicyList/autoProvPolicyList';
import PrivacyPolicy from '../policies/privacyPolicy/privacyPolicyList';
import AutoScalePolicy from '../policies/autoScalePolicy/autoScalePolicyList';
import PageMonitoringMain from '../monitoring/common/PageMonitoringMain'

import {Collapse, Tooltip} from '@material-ui/core';
import {Image} from 'semantic-ui-react';
import PopLegendViewer from '../../../container/popLegendViewer';


const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width:'100%',
        height:'100%'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        backgroundColor: 'transparent',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        backgroundColor: 'transparent',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(7) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        backgroundColor: '#292c33',
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        minHeight: '48px !important',
    },
    content: {
        flexGrow: 1,
        overflowX: 'auto',
        margin: 5,
        marginTop: 53 /* header height(48) + margin(5) */
    },
}));

const defaultPage = (options) => {
    let page = <SiteFourPageOrganization />
    let path = window.location + '';
    let currentPage = path.substring(path.indexOf('pg='))
    for (let i = 0; i < options.length; i++) {
        let option = options[i]
        if (option.subOptions) {
            page = defaultPage(option.subOptions)
        }
        else if (currentPage.includes('pg=' + option.pageId)) {
            page = option.page
            break;
        }
    }
    return page
}

const navstate = () => {
    if (localStorage.getItem('navigation')) {
        return parseInt(localStorage.getItem('navigation'))
    }
    return 1
}

const setNavState = (flag) => {
    return localStorage.setItem('navigation', flag)
}

export default function MiniDrawer(props) {

    const options = [
        { label: 'Organizations', icon: <SupervisorAccountOutlinedIcon />, pg: 0, pageId: constant.PAGE_ORGANIZATIONS, page: <SiteFourPageOrganization/>, roles: ['AdminManager', 'DeveloperManager', 'OperatorManager'] },
        { label: 'Users & Roles', icon: <AssignmentIndOutlinedIcon />, pg: 1, pageId: constant.PAGE_USER_ROLES, page: <SiteFourPageUser />, roles: ['AdminManager', 'DeveloperManager', 'OperatorManager'] },
        { label: 'Accounts', icon: <DvrOutlinedIcon />, pg: 101, pageId: constant.PAGE_ACCOUNTS, page: <SiteFourPageAccount />, roles: ['AdminManager'] },
        { divider: true },
        { label: 'Cloudlets', icon: <CloudQueueOutlinedIcon />, pg: 2, pageId: constant.PAGE_CLOUDLETS, page: <SiteFourPageCloudlet />, roles: ['AdminManager', 'DeveloperManager', 'OperatorManager'] },
        { label: 'Cloudlet Pools', icon: <CloudCircleOutlinedIcon />, pg: 7, pageId: constant.PAGE_CLOUDLET_POOLS, page: <SiteFourPageCloudletPool />, roles: [constant.ADMIN_MANAGER] },
        { label: 'Flavors', icon: <FreeBreakfastOutlinedIcon />, pg: 3, pageId: constant.PAGE_FLAVORS, page: <SiteFourPageFlavor />, roles: ['AdminManager', 'DeveloperManager'] },
        { label: 'Cluster Instances', icon: <StorageOutlinedIcon />, pg: 4, pageId: constant.PAGE_CLUSTER_INSTANCES, page: <SiteFourPageClusterInst />, roles: ['AdminManager', 'DeveloperManager'] },
        { label: 'Apps', icon: <AppsOutlinedIcon />, pg: 5, pageId: constant.PAGE_APPS, page: <SiteFourPageApps />, roles: ['AdminManager', 'DeveloperManager'] },
        { label: 'App Instances', icon: <GamesOutlinedIcon />, pg: 6, pageId: constant.PAGE_APP_INSTANCES, page: <SiteFourPageAppInst />, roles: ['AdminManager', 'DeveloperManager'] },
        {
            label: 'Policies', icon: <TrackChangesIcon />, roles: ['AdminManager', 'DeveloperManager'], subOptions: [
                { label: 'Auto Provisioning Policy', icon: <GroupWorkIcon />, pg: 8, pageId: constant.PAGE_AUTO_PROVISIONING_POLICY, page: <AutoProvPolicy />, roles: ['AdminManager', 'DeveloperManager'] },
                { label: 'Privacy Policy', icon: <PolicyIcon />, pg: 9, pageId: constant.PAGE_PRIVACY_POLICY, page: <PrivacyPolicy />, roles: ['AdminManager', 'DeveloperManager'] },
                { label: 'Auto Scale Policy', icon: <LandscapeOutlinedIcon />, pg: 10, pageId: constant.PAGE_AUTO_SCALE_POLICY, page: <AutoScalePolicy />, roles: ['AdminManager', 'DeveloperManager'] },
            ]
        },
        { label: 'Monitoring', icon: <TvOutlinedIcon />, pg: 'Monitoring', pageId: constant.PAGE_MONITORING, page: <PageMonitoringMain />, roles: ['AdminManager', 'DeveloperManager', 'OperatorManager'] }
    ]


    

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(navstate() === 1 ? true : false);
    const [expand, setExpand] = React.useState(false);
    const [openLegend, setOpenLegend] = React.useState(false);
    const [page, setPage] = React.useState(defaultPage(options));

    const handleDrawerOpen = () => {
        setNavState(1)
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setNavState(0)
        setOpen(!open);
    };

    const expandOptions = () => {
        setExpand(!expand)
    }

    const onOptionClick = (option, i) => {
        if(props.history.location.pathname !== `/site4/pg=${option.pageId}`)
        {
          setPage(null)
        }
        props.history.push({
            pathname: `/site4/pg=${option.pageId}`
        });
        setTimeout(()=>{setPage(option.page)}, 1)
    }

    const showOptionForm = (i, option) => {
        return (
            <ListItem button key={option.label} onClick={() => {
                option.pg !== undefined ? onOptionClick(option, i) : expandOptions(option)
            }}>
                <Tooltip title={option.label} aria-label="add">
                    <ListItemIcon style={{color: '#B1B2B4'}}>{option.icon}
                    </ListItemIcon>
                </Tooltip>
                <ListItemText style={{color: '#B1B2B4'}} primary={option.label}/>
                {option.subOptions ? expand ? <ExpandLess style={{color: '#B1B2B4'}}/> : <ExpandMore style={{color: '#B1B2B4'}}/> : null}
            </ListItem>
        )
    }


    const roleInfo = () => {
        return (
            <ListItem
                onClick={(e) => {
                    setOpenLegend(localStorage.selectRole && localStorage.selectRole != 'null')
                }}
            >
                {
                localStorage.selectRole && localStorage.selectRole!=='null'?
                    <ListItemIcon>
                            <div className="markBox">
                                {
                                    (localStorage.selectRole === 'AdminManager') ?
                                        <div className="mark markA markS">S</div>
                                        :
                                        (localStorage.selectRole === 'DeveloperManager') ?
                                            <div className="mark markD markM">M</div>
                                            :
                                            (localStorage.selectRole === 'DeveloperContributor') ?
                                                <div className="mark markD markC">C</div>
                                                :
                                                (localStorage.selectRole === 'DeveloperViewer') ?
                                                    <div className="mark markD markV">V</div>
                                                    :
                                                    (localStorage.selectRole === 'OperatorManager') ?
                                                        <div className="mark markO markM">M</div>
                                                        :
                                                        (localStorage.selectRole === 'OperatorContributor') ?
                                                            <div className="mark markO markC">C</div>
                                                            :
                                                            (localStorage.selectRole === 'OperatorViewer') ?
                                                                <div className="mark markO markV">V</div>
                                                                :
                                                                null
                                }
                            </div>
                    </ListItemIcon> :
                    open ?
                    null :
                    <ListItemIcon><div className="markBox"><div className="mark markA markS">?</div></div></ListItemIcon>
                }
                <ListItemText>
                    <strong style={{color: '#BFC0C2', fontSize: 14}}>
                        {
                            localStorage.selectRole && localStorage.selectRole != 'null' ? localStorage.selectRole :
                            open ? <div>
                                    <p>No Organization selected</p>
                                    <p>Click Manage to view and</p>
                                    <p>manage your Organization</p>
                                </div> : null
                        }
                    </strong>

                </ListItemText>
            </ListItem>

        )
    }

    const getRoleInfo = (role) => {
        switch (role) {
            case 'DeveloperViewer':
            case 'DeveloperContributor':
                return 'DeveloperManager'
            case 'OperatorViewer':
            case 'OperatorContributor':
                return 'OperatorManager'
            default:
                return role
        }
    }

    const menuList = () => {
        if (getUserRole()) {
            return options.map((option, i) => (
                option.divider ?
                    <Divider key={i} /> :
                    option.roles.includes(getRoleInfo(getUserRole())) ?
                        <div key={i}>
                            {showOptionForm(i, option)}
                            {option.subOptions ?
                                <Collapse in={expand} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {option.subOptions.map((subOption, j) => (
                                            showOptionForm(j, subOption)
                                        ))}
                                    </List>
                                </Collapse> : null}
                        </div> : null
            ))
        }
    }

    /**
     * Legend Block
     * * */

    const closeLegend = () => {
        setOpenLegend(false)
    }
    return (
        <div className={classes.root}>
            {props.isShowHeader &&
            <React.Fragment>
                <CssBaseline/>
                <MexHeader handleDrawerOpen={handleDrawerOpen} open={open} email={props.email} data={props.data}
                           helpClick={props.helpClick} viewMode={props.viewMode}/>
            </React.Fragment>
            }
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
                style={{zIndex: 1}}
            >
                <div className={classes.toolbar}>
                    <Image wrapped size='small' src='/assets/brand/logo_mex.svg'/>
                    <IconButton style={{color: '#B1B2B4'}} onClick={handleDrawerClose}>
                        {!open ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </div>
                <List style={{backgroundColor: '#292c33', height: '100%'}}>
                    {roleInfo()}
                    {menuList()}
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className='contents_body' style={{marginTop:6, height:'calc(100% - 6px)'}}>
                    {page}
                </div>
            </main>
            <PopLegendViewer dimmer={false} open={openLegend} close={closeLegend}></PopLegendViewer>
        </div>
    );
}
