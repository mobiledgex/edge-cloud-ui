import React from 'react';
import { useSelector } from "react-redux";
import SideNav from './defaultLayout/SideNav'
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

//Pages
import Organization from './organization/organizationList'
import Account from './accounts/accountList';
import User from './userRole/userList';
import Cloudlet from './cloudlets/cloudletList';
import CloudletPool from './cloudletPool/cloudletPoolList';
import PoolAccess from './poolAccess/PoolAccess';
import Flavor from './flavors/flavorList';
import App from './apps/appList';
import AppInst from './appInst/appInstList';
import ClusterInst from './clusterInst/clusterInstList';
import AutoProvPolicy from './policies/autoProvPolicyList/autoProvPolicyList';
import TrustPolicy from './policies/trustPolicy/trustPolicyList';
import AutoScalePolicy from './policies/autoScalePolicy/autoScalePolicyList';
import Monitoring from './monitoring/Monitoring';
import AlertReceiver from './notifications/alerts/receiver/AlertReceiver';
import BillingOrg from './billing/billingOrg/BillingOrgList';

import * as constant from '../../constant';
import { validateRole } from '../../constant/role';



const renderPage = (id) => {
    switch (id) {
        case constant.PAGE_ORGANIZATIONS:
            return Organization
        case constant.PAGE_USER_ROLES:
            return User
        case constant.PAGE_ACCOUNTS:
            return Account
        case constant.PAGE_CLOUDLETS:
            return Cloudlet
        case constant.PAGE_CLOUDLET_POOLS:
            return CloudletPool
        case constant.PAGE_FLAVORS:
            return Flavor
        case constant.PAGE_CLUSTER_INSTANCES:
            return ClusterInst
        case constant.PAGE_APPS:
            return App
        case constant.PAGE_APP_INSTANCES:
            return AppInst
        case constant.PAGE_AUTO_PROVISIONING_POLICY:
            return AutoProvPolicy
        case constant.PAGE_TRUST_POLICY:
            return TrustPolicy
        case constant.PAGE_AUTO_SCALE_POLICY:
            return AutoScalePolicy
        case constant.PAGE_MONITORING:
            return Monitoring
        case constant.PAGE_ALERTS:
            return AlertReceiver
        case constant.PAGE_BILLING_ORG:
            return BillingOrg
        case constant.PAGE_POOL_ACCESS:
            return PoolAccess
    }
}

const Pages = (props) => {
    const path = useRouteMatch()
    const orgInfo = useSelector(state => state.organizationInfo.data)
    let pages = props.data
    return (
        pages.map(page => (
            page.id ?
                page.sub ?
                    <Pages key={page.id} data={page.options} /> :
                    validateRole(page.roles, orgInfo) ? <Route key={page.id} exact path={`${path.path}/${page.path}`} component={renderPage(page.id)} /> : null : null
        ))
    )
}

const Menu = (props) => { 
    const { roles } = props
    return (
        <SideNav data={constant.pages} roles={roles}>
            <Switch>
                <Pages data={constant.pages} />
            </Switch>
        </SideNav>
    )
}

export default Menu