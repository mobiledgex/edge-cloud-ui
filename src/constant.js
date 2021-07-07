import { fields } from "./services/model/format"
import { accessGranted } from "./services/modules/poolAccess"
import { perpetual } from "./helper/constant"
import { authSyncRequest } from "./services/service"

export const pages = [
    { label: 'Organizations', icon: 'supervisor_account', id: perpetual.PAGE_ORGANIZATIONS, path: 'organizations', visible: true },
    { label: 'Users & Roles', icon: 'assignment_ind', id: perpetual.PAGE_USER_ROLES, path: 'user-roles', visible: true },
    { label: 'Accounts', icon: 'dvr', id: perpetual.PAGE_ACCOUNTS, path: 'accounts', roles: [perpetual.ADMIN], visible: true },
    { divider: true },
    { label: 'Cloudlets', icon: 'cloud_queue', id: perpetual.PAGE_CLOUDLETS, path: 'cloudlets', visible: true },
    { label: 'Cloudlet Pools', icon: 'cloud_circle', id: perpetual.PAGE_CLOUDLET_POOLS, path: 'cloudlet-pools', roles: [perpetual.ADMIN, perpetual.OPERATOR], visible: true },
    { label: 'Cloudlet Pools', icon: 'cloud_circle', id: perpetual.PAGE_POOL_ACCESS, path: 'pool-access', roles: [perpetual.DEVELOPER_MANAGER], visible: true },
    { label: 'Flavors', icon: 'free_breakfast', id: perpetual.PAGE_FLAVORS, path: 'flavors', roles: [perpetual.ADMIN, perpetual.DEVELOPER], visible: true },
    { label: 'Cluster Instances', icon: 'storage', id: perpetual.PAGE_CLUSTER_INSTANCES, path: 'cluster-insts', roles: [perpetual.ADMIN, perpetual.DEVELOPER, perpetual.OPERATOR], visible: true },
    { label: 'Apps', icon: 'apps', id: perpetual.PAGE_APPS, path: 'apps', roles: [perpetual.ADMIN, perpetual.DEVELOPER], visible: true },
    { label: 'App Instances', icon: 'games', id: perpetual.PAGE_APP_INSTANCES, path: 'app-insts', roles: [perpetual.ADMIN, perpetual.DEVELOPER, perpetual.OPERATOR], visible: true },
    {
        label: 'Policies', icon: 'track_changes', id: perpetual.PAGE_POLICIES, sub: true, visible: true, options: [
            { label: 'Auto Provisioning Policy', icon: 'group_work', id: perpetual.PAGE_AUTO_PROVISIONING_POLICY, path: 'auto-prov-policy', roles: [perpetual.ADMIN, perpetual.DEVELOPER], visible: true },
            { label: 'Trust Policy', icon: 'policy', id: perpetual.PAGE_TRUST_POLICY, path: 'trust-policy', visible: true },
            { label: 'Auto Scale Policy', icon: 'landscape', id: perpetual.PAGE_AUTO_SCALE_POLICY, path: 'auto-scale-policy', roles: [perpetual.ADMIN, perpetual.DEVELOPER], visible: true },
        ]
    },
    { label: 'Monitoring', icon: 'tv', id: perpetual.PAGE_MONITORING, path: 'monitoring', visible: true },
    { label: 'Alert Receivers', icon: 'notification_important', id: perpetual.PAGE_ALERTS, path: 'alerts', visible: true },
    { label: 'Billing', icon: 'payment', id: perpetual.PAGE_BILLING_ORG, path: 'billing-org', roles: [perpetual.ADMIN], visible: true },
    { label: 'Invoices', icon: 'payment', id: perpetual.PAGE_INVOICES, path: 'invoices', roles: [perpetual.DEVELOPER_MANAGER] },
    { label: 'Reports', icon: 'assessment', id: perpetual.PAGE_REPORTER, path: 'reporter', roles: [perpetual.ADMIN, perpetual.OPERATOR_MANAGER], visible: true },
]

export const getHeight = (height) => {
    return window.innerHeight - (height ? height : 85)
}

export const getTip = (field) => {
    switch (field) {
        case fields.region:
            return 'Select region where you want to deploy.'
        case fields.organizationName:
            return 'The name of the organization you are currently managing.'
        case fields.appName:
            return 'The name of the application to deploy.'
        case fields.version:
            return 'The version of the application to deploy.'
        case fields.operatorName:
            return 'Which operator do you want to deploy this applicaton? Please select one.'
        case fields.cloudletName:
            return 'Which cloudlet(s) do you want to deploy this application ?'
        case fields.autoClusterInstance:
            return 'If you have yet to create a cluster, you can select this to auto create cluster instance.'
        case fields.clusterName:
            return 'Name of cluster instance to deploy this application.'
        default:
            return null
    }
}

/**
 * Filter Data
 * remove data which are in selectedDatas
 */
export const filterData = (selectedDatas, dataList, field) => {
    if (selectedDatas && selectedDatas.length > 0) {
        for (let i = 0; i < selectedDatas.length; i++) {
            let selectedData = selectedDatas[i];
            for (let j = 0; j < dataList.length; j++) {
                let filterData = dataList[j]
                if (selectedData[field] === filterData[field]) {
                    dataList.splice(j, 1)
                    break;
                }
            }
        }
    }
    return dataList
}

export const regions = () => {
    return localStorage.regions ? localStorage.regions.split(",") : [];
}

export const regionLocation = (region) => {
    switch (region) {
        case 'US':
            return { center: [39, -100], zoom: 4 }
        case 'EU':
            return { center: [47, 19], zoom: 4 }
        case 'KR':
            return { center: [36, 127], zoom: 4 }
        case 'JP':
            return { center: [36, 138], zoom: 5 }
        default:
            return { center: [43.4, 51.7], zoom: 2 }
    }
}

export const validatePhone = (form) => {
    if (!/^\+?(?:[0-9] ?){6,14}[0-9]$/.test(form.value) && !/^\d{3}-\d{3}-\d{4}$/.test(form.value)) {
        form.error = 'Phone should only contain "+" and 7~15 digits.'
        return false;
    }
    else {
        form.error = undefined
        return true;
    }
}

export const operatorRoles = [perpetual.ADMIN_MANAGER, perpetual.OPERATOR_MANAGER, perpetual.OPERATOR_CONTRIBUTOR]


export const legendRoles =
{
    developer: {
        Manager: {
            'Users & Roles': 'Manage',
            'Cloudlets': 'View',
            'Cloudlet Pools': 'Manage',
            'Flavors': 'View',
            'Cluster Instances': 'Manage',
            'Apps': 'Manage',
            'App Instances': 'Manage',
            'Policies': 'View',
            'Monitoring': 'View',
            'Audit Logs': 'View'
        },
        Contributor: {
            'Users & Roles': 'View',
            'Cloudlets': 'View',
            'Cloudlet Pools': 'disabled',
            'Flavors': 'View',
            'Cluster Instances': 'Manage',
            'Apps': 'Manage',
            'App Instances': 'Manage',
            'Policies': 'View',
            'Monitoring': 'View',
            'Audit Logs': 'View'
        },
        Viewer: {
            'Users & Roles': 'View',
            'Cloudlets': 'View',
            'Cloudlet Pools': 'disabled',
            'Flavors': 'View',
            'Cluster Instances': 'View',
            'Apps': 'View',
            'App Instances': 'View',
            'Policies': 'View',
            'Monitoring': 'View',
            'Audit Logs': 'View'
        }
    },
    operator: {
        Manager: {
            'Users & Roles': 'Manage',
            'Cloudlets': 'Manage',
            'Cloudlet Pools': 'Manage',
            'Flavors': 'disabled',
            'Cluster Instances': 'disabled',
            'Apps': 'disabled',
            'App Instances': 'disabled',
            'Policies': 'disabled',
            'Monitoring': 'View',
            'Audit Logs': 'View'
        },
        Contributor: {
            'Users & Roles': 'View',
            'Cloudlets': 'Manage',
            'Cloudlet Pools': 'Manage',
            'Flavors': 'disabled',
            'Cluster Instances': 'disabled',
            'Apps': 'disabled',
            'App Instances': 'disabled',
            'Policies': 'disabled',
            'Monitoring': 'View',
            'Audit Logs': 'View'
        },
        Viewer: {
            'Users & Roles': 'View',
            'Cloudlets': 'View',
            'Cloudlet Pools': 'disabled',
            'Flavors': 'disabled',
            'Cluster Instances': 'disabled',
            'Apps': 'disabled',
            'App Instances': 'disabled',
            'Policies': 'disabled',
            'Monitoring': 'View',
            'Audit Logs': 'View'
        },
    }
}

export const validatePrivateAccess = async (self, orgInfo) => {
    let privateAccess = undefined
    let mc = await authSyncRequest(self, accessGranted(self, orgInfo))
    if (mc.response && mc.response.status === 200) {
        let dataList = mc.response.data
        if (dataList.length > 0) {
            let regions = new Set()
            dataList.forEach(data => {
                regions.add(data[fields.region])
            })
            privateAccess = { isPrivate: true, regions: Array.from(regions) }
        }
        else {
            privateAccess = { isPrivate: false }
        }
    }
    else {
        privateAccess = { isPrivate: false }
    }
    return privateAccess
}

