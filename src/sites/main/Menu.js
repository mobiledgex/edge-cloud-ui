import React from 'react';
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

const pages = [
    { label: 'Organizations', icon: 'supervisor_account', id: constant.PAGE_ORGANIZATIONS, path: 'organizations' },
    { label: 'Users & Roles', icon: 'assignment_ind', id: constant.PAGE_USER_ROLES, path: 'user-roles' },
    { label: 'Accounts', icon: 'dvr', id: constant.PAGE_ACCOUNTS, path: 'accounts', roles: [constant.ADMIN] },
    { divider: true },
    { label: 'Cloudlets', icon: 'cloud_queue', id: constant.PAGE_CLOUDLETS, path: 'cloudlets' },
    { label: 'Cloudlet Pools', icon: 'cloud_circle', id: constant.PAGE_CLOUDLET_POOLS, path: 'cloudlet-pools', roles: [constant.ADMIN, constant.OPERATOR] },
    { label: 'Cloudlet Pools', icon: 'cloud_circle', id: constant.PAGE_POOL_ACCESS, path: 'pool-access', roles: [constant.DEVELOPER_MANAGER] },
    { label: 'Flavors', icon: 'free_breakfast', id: constant.PAGE_FLAVORS, path: 'flavors', roles: [constant.ADMIN, constant.DEVELOPER] },
    { label: 'Cluster Instances', icon: 'storage', id: constant.PAGE_CLUSTER_INSTANCES, path: 'cluster-insts', roles: [constant.ADMIN, constant.DEVELOPER] },
    { label: 'Apps', icon: 'apps', id: constant.PAGE_APPS, path: 'apps', roles: [constant.ADMIN, constant.DEVELOPER] },
    { label: 'App Instances', icon: 'games', id: constant.PAGE_APP_INSTANCES, path: 'app-insts', roles: [constant.ADMIN, constant.DEVELOPER] },
    {
        label: 'Policies', icon: 'track_changes', id: constant.PAGE_POLICIES, sub: true, options: [
            { label: 'Auto Provisioning Policy', icon: 'group_work', id: constant.PAGE_AUTO_PROVISIONING_POLICY, path: 'auto-prov-policy', roles: [constant.ADMIN, constant.DEVELOPER] },
            { label: 'Trust Policy', icon: 'policy', id: constant.PAGE_TRUST_POLICY, path: 'trust-policy' },
            { label: 'Auto Scale Policy', icon: 'landscape', id: constant.PAGE_AUTO_SCALE_POLICY, path: 'auto-scale-policy', roles: [constant.ADMIN, constant.DEVELOPER] },
        ]
    },
    { label: 'Monitoring', icon: 'tv', id: constant.PAGE_MONITORING, path: 'monitoring' },
    { label: 'Alert Receivers', icon: 'notification_important', id: constant.PAGE_ALERTS, path: 'alerts' },
    { label: 'Billing', icon: 'payment', id: constant.PAGE_BILLING_ORG, path: 'billing-org', roles: [constant.ADMIN] },
]

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
    let pages = props.data
    return (
        pages.map(page => (
            page.id ?
                page.sub ?
                    <Pages key={page.id} data={page.options} /> :
                    <Route key={page.id} exact path={`${path.path}/${page.path}`} component={renderPage(page.id)} /> : null
        ))
    )
}

const Menu = (props) => {
    return (
        <SideNav data={pages}>
            <Switch>
                <Pages data={pages} />
            </Switch>
        </SideNav>
    )
}

export default Menu