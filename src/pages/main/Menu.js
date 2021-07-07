import React from 'react';
import { useSelector } from "react-redux";
import SideNav from './defaultLayout/SideNav'
import { Switch, Route, useRouteMatch } from 'react-router-dom';

//Pages
import Organization from './organization/organizationList'
import Account from './accounts/accountList';
import User from './userRole/userList';
import Cloudlet from './cloudlets/cloudletList';
import CloudletPool from './cloudletPool/cloudletPoolList';
import PoolAccess from './poolAccess/PoolAccess';
import Flavor from './flavors/flavorList';
import App from './apps/AppList';
import AppInst from './appInst/AppInstList';
import ClusterInst from './clusterInst/clusterInstList';
import AutoProvPolicy from './policies/autoProvPolicyList/autoProvPolicyList';
import TrustPolicy from './policies/trustPolicy/trustPolicyList';
import AutoScalePolicy from './policies/autoScalePolicy/autoScalePolicyList';
import Monitoring from './monitoring/Monitoring';
import AlertReceiver from './notifications/alerts/receiver/AlertReceiver';
import BillingOrg from './billing/billingOrg/BillingOrgList';
import Invoices from './billing/invoices/Invoices';
import Reporter from './reporter/Reporter';
import * as constant from '../../constant';
import { perpetual, role } from '../../helper/constant';

const renderPage = (id) => {
    switch (id) {
        case perpetual.PAGE_ORGANIZATIONS:
            return Organization
        case perpetual.PAGE_USER_ROLES:
            return User
        case perpetual.PAGE_ACCOUNTS:
            return Account
        case perpetual.PAGE_CLOUDLETS:
            return Cloudlet
        case perpetual.PAGE_CLOUDLET_POOLS:
            return CloudletPool
        case perpetual.PAGE_FLAVORS:
            return Flavor
        case perpetual.PAGE_CLUSTER_INSTANCES:
            return ClusterInst
        case perpetual.PAGE_APPS:
            return App
        case perpetual.PAGE_APP_INSTANCES:
            return AppInst
        case perpetual.PAGE_AUTO_PROVISIONING_POLICY:
            return AutoProvPolicy
        case perpetual.PAGE_TRUST_POLICY:
            return TrustPolicy
        case perpetual.PAGE_AUTO_SCALE_POLICY:
            return AutoScalePolicy
        case perpetual.PAGE_MONITORING:
            return Monitoring
        case perpetual.PAGE_ALERTS:
            return AlertReceiver
        case perpetual.PAGE_BILLING_ORG:
            return BillingOrg
        case perpetual.PAGE_POOL_ACCESS:
            return PoolAccess
        case perpetual.PAGE_INVOICES:
            return Invoices
        case perpetual.PAGE_REPORTER:
            return Reporter
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
                    role.validateRole(page.roles, orgInfo) ? <Route key={page.id} exact path={`${path.path}/${page.path}`} component={renderPage(page.id)} /> : null : null
        ))
    )
}

const Menu = (props) => {
    return (
        <SideNav data={constant.pages}>
            <Switch>
                <Pages data={constant.pages} />
            </Switch>
        </SideNav>
    )
}

export default Menu