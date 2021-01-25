import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import clsx from 'clsx';
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
import { getUserRole } from '../../../services/model/format'
import * as constant from '../../../constant'
import * as actions from '../../../actions';

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
import NotificationsNoneOutlined from '@material-ui/icons/NotificationsNoneOutlined';
import PaymentOutlinedIcon from '@material-ui/icons/PaymentOutlined';

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
import TrustPolicy from '../policies/trustPolicy/trustPolicyList';
import AutoScalePolicy from '../policies/autoScalePolicy/autoScalePolicyList';
import Monitoring from '../monitoring/Monitoring';
import Alerts from '../alerts/receiver/AlertReceiver';
import BillingOrg from '../billingOrg/BillingOrgList';

import { Collapse, Tooltip } from '@material-ui/core';
import { Image } from 'semantic-ui-react';
import PopLegendViewer from '../../../container/popLegendViewer';

import { DndProvider } from 'react-dnd';
import { HTML5Backend, } from 'react-dnd-html5-backend'
import { withStyles } from '@material-ui/styles';

const drawerWidth = 250;

const useStyles = theme => ({
    root: {
        display: 'flex',
        width: '100%',
        height: '100%'
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
        marginLeft: 5,
        marginRight: 5,
        marginBottom:3,
        marginTop: 53 /* header height(48) + margin(5) */
    },
});

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

const options = [
    { label: 'Organizations', icon: <SupervisorAccountOutlinedIcon />, pg: 0, pageId: constant.PAGE_ORGANIZATIONS, page: <SiteFourPageOrganization />, roles: [constant.ADMIN_MANAGER, constant.DEVELOPER_MANAGER, constant.OPERATOR_MANAGER] },
    { label: 'Users & Roles', icon: <AssignmentIndOutlinedIcon />, pg: 1, pageId: constant.PAGE_USER_ROLES, page: <SiteFourPageUser />, roles: [constant.ADMIN_MANAGER, constant.DEVELOPER_MANAGER, constant.OPERATOR_MANAGER] },
    { label: 'Accounts', icon: <DvrOutlinedIcon />, pg: 101, pageId: constant.PAGE_ACCOUNTS, page: <SiteFourPageAccount />, roles: [constant.ADMIN_MANAGER] },
    { divider: true },
    { label: 'Cloudlets', icon: <CloudQueueOutlinedIcon />, pg: 2, pageId: constant.PAGE_CLOUDLETS, page: <SiteFourPageCloudlet />, roles: [constant.ADMIN_MANAGER, constant.DEVELOPER_MANAGER, constant.OPERATOR_MANAGER] },
    { label: 'Cloudlet Pools', icon: <CloudCircleOutlinedIcon />, pg: 7, pageId: constant.PAGE_CLOUDLET_POOLS, page: <SiteFourPageCloudletPool />, roles: [constant.ADMIN_MANAGER, constant.OPERATOR_MANAGER, constant.OPERATOR_CONTRIBUTOR] },
    { label: 'Flavors', icon: <FreeBreakfastOutlinedIcon />, pg: 3, pageId: constant.PAGE_FLAVORS, page: <SiteFourPageFlavor />, roles: [constant.ADMIN_MANAGER, constant.DEVELOPER_MANAGER] },
    { label: 'Cluster Instances', icon: <StorageOutlinedIcon />, pg: 4, pageId: constant.PAGE_CLUSTER_INSTANCES, page: <SiteFourPageClusterInst />, roles: [constant.ADMIN_MANAGER, constant.DEVELOPER_MANAGER] },
    { label: 'Apps', icon: <AppsOutlinedIcon />, pg: 5, pageId: constant.PAGE_APPS, page: <SiteFourPageApps />, roles: [constant.ADMIN_MANAGER, constant.DEVELOPER_MANAGER] },
    { label: 'App Instances', icon: <GamesOutlinedIcon />, pg: 6, pageId: constant.PAGE_APP_INSTANCES, page: <SiteFourPageAppInst />, roles: [constant.ADMIN_MANAGER, constant.DEVELOPER_MANAGER] },
    {
        label: 'Policies', icon: <TrackChangesIcon />, roles: [constant.ADMIN_MANAGER, constant.DEVELOPER_MANAGER], subOptions: [
            { label: 'Auto Provisioning Policy', icon: <GroupWorkIcon />, pg: 8, pageId: constant.PAGE_AUTO_PROVISIONING_POLICY, page: <AutoProvPolicy />, roles: [constant.ADMIN_MANAGER, constant.DEVELOPER_MANAGER] },
            { label: 'Trust Policy', icon: <PolicyIcon />, pg: 9, pageId: constant.PAGE_TRUST_POLICY, page: <TrustPolicy /> },
            { label: 'Auto Scale Policy', icon: <LandscapeOutlinedIcon />, pg: 10, pageId: constant.PAGE_AUTO_SCALE_POLICY, page: <AutoScalePolicy />, roles: [constant.ADMIN_MANAGER, constant.DEVELOPER_MANAGER] },
        ]
    },
    { label: 'Monitoring', icon: <TvOutlinedIcon />, pg: 'Monitoring', pageId: constant.PAGE_MONITORING, page: <Monitoring />, roles: [constant.ADMIN_MANAGER, constant.DEVELOPER_MANAGER, constant.OPERATOR_MANAGER] },
    { label: 'Alert Receivers', icon: <NotificationsNoneOutlined />, pg: 'AlertReceivers', pageId: constant.PAGE_ALERTS, page: <Alerts />, roles: [constant.ADMIN_MANAGER, constant.DEVELOPER_MANAGER, constant.OPERATOR_MANAGER] },
    { label: 'Billing', icon: <PaymentOutlinedIcon />, pg: 'BillingOrg', pageId: constant.PAGE_BILLING_ORG, page: <BillingOrg />, roles: [constant.ADMIN_MANAGER] }
]

class SideNav extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            open: navstate() === 1 ? true : false,
            expand: undefined,
            openLegend: false,
            page: defaultPage(options)
        }
    }
    // const classes = useStyles();
    // const theme = useTheme();

    handleDrawerOpen = () => {
        setNavState(1)
        this.setState({ open: true })
    };

    handleDrawerClose = () => {
        setNavState(0)
        this.setState(prevState => ({ open: !prevState.open }))
    };

    expandOptions = (option) => {
        this.setState(prevState => ({ expand: prevState.expand === option.label ? undefined : option.label }))
    }

    onOptionClick = (option) => {
        if (this.props.history.location.pathname !== `/site4/pg=${option.pageId}`) {
            this.setState({ page: null })
        }
        this.props.history.push({
            pathname: `/site4/pg=${option.pageId}`
        });
        setTimeout(() => { this.setState({ page: option.page }) }, 1)
    }

    showOptionForm = (i, option) => {
        const { expand } = this.state
        return (
            <ListItem button key={option.label} onClick={() => {
                option.pg !== undefined ? this.onOptionClick(option) : this.expandOptions(option)
            }}>
                <Tooltip title={option.label} aria-label="add">
                    <ListItemIcon style={{ color: '#B1B2B4' }}>{option.icon}
                    </ListItemIcon>
                </Tooltip>
                <ListItemText style={{ color: '#B1B2B4' }} primary={option.label} />
                {option.subOptions ? expand === option.label ? <ExpandLess style={{ color: '#B1B2B4' }} /> : <ExpandMore style={{ color: '#B1B2B4' }} /> : null}
            </ListItem>
        )
    }


    roleInfo = (open) => {
        return (
            <ListItem
                onClick={(e) => {
                    this.setState({ openLegend: localStorage.selectRole && localStorage.selectRole != 'null' })
                }}
            >
                {
                    localStorage.selectRole && localStorage.selectRole !== 'null' ?
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
                    <strong style={{ color: '#BFC0C2', fontSize: 14 }}>
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

    getRoleInfo = (role) => {
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

    menuList = (expand) => {
        if (getUserRole()) {
            return options.map((option, i) => (
                option.divider ?
                    <Divider key={i} /> :
                    option.roles && option.roles.includes(this.getRoleInfo(getUserRole())) ?
                        <div key={i}>
                            {this.showOptionForm(i, option)}
                            {option.subOptions ?
                                <Collapse in={expand === option.label} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {option.subOptions.map((subOption, j) => (
                                            this.showOptionForm(j, subOption)
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

    closeLegend = () => {
        this.setState({ openLegend: false })
    }

    render() {
        const { classes, isShowHeader, email, data, viewMode, helpClick } = this.props;
        const { open, expand, page, openLegend } = this.state;
        return (
            <div className={classes.root}>
                {isShowHeader &&
                    <React.Fragment>
                        <CssBaseline />
                        <MexHeader handleDrawerOpen={this.handleDrawerOpen} open={open} email={email} data={data}
                            helpClick={helpClick} viewMode={viewMode} />
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
                    style={{ zIndex: 1 }}
                >
                    <div className={classes.toolbar}>
                        <Image wrapped size='small' src='/assets/brand/logo_mex.svg' />
                        <IconButton style={{ color: '#B1B2B4' }} onClick={this.handleDrawerClose}>
                            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <List className='side-nav-list'>
                        {this.roleInfo(open)}
                        {this.menuList(expand)}
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <DndProvider backend={HTML5Backend}>
                        <div className='contents_body' style={{ marginTop: 3, height: 'calc(100% - 3px)' }}>
                            {page}
                        </div>
                    </DndProvider>
                </main>
                <PopLegendViewer dimmer={false} open={openLegend} close={this.closeLegend}></PopLegendViewer>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.redirectPage && prevProps.redirectPage !== this.props.redirectPage) {
            options.map(option=>{
                if(option.pageId === this.props.redirectPage)
                {
                    this.onOptionClick(option)
                }
            })
            this.props.handlePageRedirect(null)
        }
    }
}

function mapStateToProps(state) {
    return {
        redirectPage: state.redirectPage.page,
        userRole: state.showUserRole ? state.showUserRole.role : null,
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handlePageRedirect: (mode, msg) => { dispatch(actions.redirectPage(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(withStyles(useStyles)(SideNav)))
