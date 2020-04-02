import React from 'react';
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
import AlbumOutlinedIcon from '@material-ui/icons/AlbumOutlined';
import FeaturedPlayListOutlinedIcon from '@material-ui/icons/FeaturedPlayListOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AdjustOutlinedIcon from '@material-ui/icons/AdjustOutlined';

import SiteFourPageOrganization from '../organization/organizationList';
import SiteFourPageAccount from '../accounts/accountList';
import SiteFourPageUser from '../userRole/userList';
import SiteFourPageCloudlet from '../cloudlets/cloudletList';
import SiteFourPageCloudletPool from '../cloudletPool/cloudletPoolList';
import SiteFourPageFlavor from '../flavors/flavorList';
import SiteFourPageApps from '../apps/appList';
import SiteFourPageAppInst from '../appInst/appInstList';
import SiteFourPageClusterInst from '../clusterInst/clusterInstList';
import SiteFourPageAudits from '../audits/auditLogs';
import AutoProvPolicy from '../policies/autoProvPolicyList/autoProvPolicyList';
import PrivacyPolicy from '../policies/privacyPolicy/privacyPolicyList';
import PageMonitoringMain from '../monitoring/PageMonitoringMain'

import {Collapse, Tooltip} from '@material-ui/core';
import {Image} from 'semantic-ui-react';
import PopLegendViewer from '../../../container/popLegendViewer';
import * as actions from "../../../actions";
import {connect} from "react-redux";

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
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
    },
    content: {
        flexGrow: 1,
        margin: 5
    },
}));


const options = [
    {
        label: 'Organizations',
        icon: <SupervisorAccountOutlinedIcon/>,
        pg: 0,
        page: <SiteFourPageOrganization/>,
        roles: ['AdminManager', 'DeveloperManager', 'OperatorManager']
    },
    {
        label: 'Users & Roles',
        icon: <AssignmentIndOutlinedIcon/>,
        pg: 1,
        page: <SiteFourPageUser/>,
        roles: ['AdminManager']
    },
    {label: 'Accounts', icon: <DvrOutlinedIcon/>, pg: 101, page: <SiteFourPageAccount/>, roles: ['AdminManager']},
    {divider: true},
    {
        label: 'Cloudlets',
        icon: <CloudQueueOutlinedIcon/>,
        pg: 2,
        page: <SiteFourPageCloudlet/>,
        roles: ['AdminManager', 'DeveloperManager', 'OperatorManager']
    },
    {
        label: 'Cloudlet Pools',
        icon: <CloudCircleOutlinedIcon/>,
        pg: 7,
        page: <SiteFourPageCloudletPool/>,
        roles: ['AdminManager', 'DeveloperManager']
    },
    {
        label: 'Flavors',
        icon: <FreeBreakfastOutlinedIcon/>,
        pg: 3,
        page: <SiteFourPageFlavor/>,
        roles: ['AdminManager', 'DeveloperManager']
    },
    {
        label: 'Cluster Instances',
        icon: <StorageOutlinedIcon/>,
        pg: 4,
        page: <SiteFourPageClusterInst/>,
        roles: ['AdminManager', 'DeveloperManager']
    },
    {
        label: 'Apps',
        icon: <AppsOutlinedIcon/>,
        pg: 5,
        page: <SiteFourPageApps/>,
        roles: ['AdminManager', 'DeveloperManager']
    },
    {
        label: 'App Instances',
        icon: <GamesOutlinedIcon/>,
        pg: 6,
        page: <SiteFourPageAppInst/>,
        roles: ['AdminManager', 'DeveloperManager']
    },
    {
        label: 'Monitoring',
        icon: <TvOutlinedIcon/>,
        pg: 'Monitoring',
        page: <PageMonitoringMain/>,
        roles: ['AdminManager', 'DeveloperManager', 'OperatorManager']
    },
    {
        label: 'Policies', icon: <AlbumOutlinedIcon/>, roles: ['AdminManager', 'DeveloperManager'], subOptions: [
            {
                label: 'Auto Provisioning Policy',
                icon: <AdjustOutlinedIcon/>,
                pg: 8,
                page: <AutoProvPolicy/>,
                roles: ['AdminManager', 'DeveloperManager']
            },
            {
                label: 'Privacy Policy',
                icon: <AdjustOutlinedIcon/>,
                pg: 9,
                page: <PrivacyPolicy/>,
                roles: ['AdminManager', 'DeveloperManager']
            },
        ]
    },
    {
        label: 'Audit Logs',
        icon: <FeaturedPlayListOutlinedIcon/>,
        pg: 'audits',
        page: <SiteFourPageAudits/>,
        roles: ['AdminManager', 'DeveloperManager', 'OperatorManager']
    }
]

const defaultPage = (options) => {
    let path = window.location + '';
    let currentPage = path.substring(path.indexOf('pg='))
    for (let i = 0; i < options.length; i++) {
        let option = options[i]
        if (option.subOptions) {
            return defaultPage(option.subOptions)
        } else if (currentPage === 'pg=' + option.pg) {
            return option.page
        }
    }
    return <SiteFourPageOrganization/>
}

const navstate = () => {
    if (localStorage.getItem('navigation')) {
        return parseInt(localStorage.getItem('navigation'))
    }
    return 0
}

const setNavState = (flag) => {
    return localStorage.setItem('navigation', flag)
}

const mapStateToProps = (state) => {
    return {
        isShowHeader: state.HeaderReducer.isShowHeader,
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        toggleHeader: (data) => {
            dispatch(actions.toggleHeader(data))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    function MiniDrawer(props) {
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
            setOpen(false);
        };

        const expandOptions = () => {
            setExpand(!expand)
        }

        const onOptionClick = (option, i) => {
            setPage(option.page)
            props.onOptionClick(i, option.label, option.pg, localStorage.selectRole)
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
                    {option.subOptions ? expand ? <ExpandLess style={{color: '#B1B2B4'}}/> :
                        <ExpandMore style={{color: '#B1B2B4'}}/> : null}
                </ListItem>
            )
        }


        const roleInfo = () => {
            return (
                <ListItem onClick={(e) => {
                    setOpenLegend(true)
                }}>
                    <ListItemIcon>
                        {localStorage.selectRole ?
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
                                                                <div className="mark markA markS">?</div>
                                }
                            </div> : null}
                    </ListItemIcon>
                    <ListItemText>
                        <strong style={{
                            color: '#BFC0C2',
                            fontSize: 15
                        }}> {localStorage.selectRole && localStorage.selectRole != 'null' ? localStorage.selectRole : 'Select Organization'}</strong>

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
            return options.map((option, i) => (
                option.divider ?
                    <Divider key={i}/> :
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

        const versionInfo = () => (
            <div style={{position: 'absolute', bottom: 5, marginLeft: 10, color: '#B1B2B4'}}>
                {process.env.REACT_APP_BUILD_VERSION ? 'v'+process.env.REACT_APP_BUILD_VERSION : 'v0.0.0'}
            </div>
        )

        /**
         * Legend Block
         * * */
        const closeLegend = () => {
            setOpenLegend(false)
        }


        return (
            <div className={classes.root} style={{height: 0}}>
                {props.isShowHeader &&
                <React.Fragment>
                    <CssBaseline/>
                    <MexHeader handleDrawerOpen={handleDrawerOpen} open={open} email={props.email} data={props.data}
                               helpClick={props.helpClick} gotoUrl={props.gotoUrl}/>
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
                            {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                        </IconButton>
                    </div>
                    <List style={{backgroundColor: '#292c33', height: '100%'}}>
                        {roleInfo()}
                        {menuList()}
                        {versionInfo()}
                    </List>
                </Drawer>
                <main className={classes.content}>
                    {props.isShowHeader && <div className={classes.toolbar}/>}
                    <div className='contents_body'>
                        {page}
                    </div>
                </main>
                <PopLegendViewer dimmer={false} open={openLegend} close={closeLegend}></PopLegendViewer>
            </div>
        );
    }
)

