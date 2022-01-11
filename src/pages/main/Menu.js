import React from 'react';
import { useSelector } from "react-redux";
import SideNav from './defaultLayout/SideNav'
import { Switch, Route, useRouteMatch } from 'react-router-dom';

//Pages
import Organization from './organization/Organization'
import Account from './accounts/Account';
import User from './userRole/UserRole';
import Cloudlet from './cloudlets/Cloudlet';
import CloudletPool from './cloudletPool/CloudletPool';
import PoolAccess from './poolAccess/PoolAccess';
import Flavor from './flavors/Flavor';
import App from './apps/App';
import AppInst from './appInst/AppInst';
import ClusterInst from './clusterInst/ClusterInst';
import AutoProvPolicy from './policies/autoProvPolicy/AutoProvPolicy';
import TrustPolicy from './policies/trustPolicy/TrustPolicy';
import AutoScalePolicy from './policies/autoScalePolicy/AutoScalePolicy';
import AlertPolicy from './policies/alertPolicy/AlertPolicy';
import Monitoring from './monitoring/Monitoring';
import AlertReceiver from './notifications/alerts/receiver/AlertReceiver';
import BillingOrg from './billing/billingOrg/BillingOrg';
import Invoices from './billing/invoices/Invoices';
import Reporter from './reporter/Reporter';
import GPUDriver from './gpudriver/GPUDriver';
import Networks from './networks/Networks';
import Federation from './federation/Federation';
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
        case perpetual.PAGE_ALERT_POLICY:
            return AlertPolicy
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
        case perpetual.PAGE_GPU_DRIVER:
            return GPUDriver
        case perpetual.PAGE_NETWORKS:
            return Networks
        case perpetual.PAGE_PARTNER_FEDERATION:
            return Federation
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