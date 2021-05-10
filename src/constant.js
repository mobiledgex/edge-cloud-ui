import { fields } from "./services/model/format"
import { accessGranted } from "./services/model/privateCloudletAccess"
import { sendRequest } from "./sites/main/monitoring/services/service"
import { redux_org } from "./helper/reduxData"

export const COLOR_GREEN = '#388E3C'
export const COLOR_RED = '#ab2424'

export const LOCAL_STRAGE_KEY = 'PROJECT_INIT'
export const LS_USER_META_DATA = 'usermetadata'
export const LS_REGIONS = 'regions'

export const CLOUDLET_COMPAT_VERSION_2_4 = 0
export const CLOUDLET_COMPAT_VERSION_2_4_1 = 1

export const UNKNOWN = 'Unknown'
export const ADD = 'Add'
export const UPDATE = 'Update'
export const TYPE_JSON = 'JSON'
export const TYPE_STRING = 'String'
export const TYPE_YAML = 'YAML'
export const TYPE_ARRAY = 'Array'
export const TYPE_DATE = 'DATE'
export const TYPE_URL = 'URL'
export const ADD_CLOUDLET = 'AddCloudlet'
export const DELETE_CLOUDLET = 'DeleteCloudlet'
export const ADD_ORGANIZATION = 'AddOrganization'
export const DELETE_ORGANIZATION = 'DeleteOrganization'
export const DEPLOYMENT_TYPE_DOCKER = 'docker';
export const DEPLOYMENT_TYPE_KUBERNETES = 'kubernetes';
export const DEPLOYMENT_TYPE_VM = 'vm';
export const DEPLOYMENT_TYPE_HELM = 'helm';
export const ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT = 'Default For Deployment';
export const ACCESS_TYPE_DIRECT = 'Direct';
export const ACCESS_TYPE_LOAD_BALANCER = 'Load Balancer';
export const IMAGE_TYPE_DOCKER = 'Docker';
export const IMAGE_TYPE_QCOW = 'Qcow';
export const IMAGE_TYPE_HELM = 'Helm';
export const IP_ACCESS_DEDICATED = 'Dedicated';
export const IP_ACCESS_SHARED = 'Shared';
export const DELETE = 'Delete'
export const SELECT = 'Select'
export const CLOUDLET = 'Cloudlet'
export const CLUSTER_INST = 'ClusterInst'
export const APP_INST = 'AppInst'
export const IP_SUPPORT_STATIC = 'Static'
export const IP_SUPPORT_DYNAMIC = 'Dynamic'
export const YES = 'Yes'
export const NO = 'No'
export const RUN_COMMAND = 'Run Command';
export const SHOW_LOGS = 'Show Logs';
export const RECEIVER_TYPE_EMAIL = 'Email'
export const RECEIVER_TYPE_SLACK = 'Slack'
export const RECEIVER_TYPE_PAGER_DUTY = 'PagerDuty'


export const PLATFORM_TYPE_FAKE = 'Fake'
export const PLATFORM_TYPE_DIND = 'DIND'
export const PLATFORM_TYPE_OPEN_STACK = 'Openstack'
export const PLATFORM_TYPE_AZURE = 'Azure'
export const PLATFORM_TYPE_OPEN_GCP = 'GCP'
export const PLATFORM_TYPE_EDGEBOX = 'Edgebox'
export const PLATFORM_TYPE_FAKEINFRA = 'Fakeinfra'
export const PLATFORM_TYPE_VSPHERE = 'vSphere'
export const PLATFORM_TYPE_AWS_EKS = 'AWS EKS'
export const PLATFORM_TYPE_VMPOOL = 'VM Pool'
export const PLATFORM_TYPE_AWS_EC2 = 'AWS EC2'
export const PLATFORM_TYPE_VCD = 'VCD'
export const PLATFORM_TYPE_K8S_BARE_METAL = 'K8S Bare Metal'
export const PLATFORM_TYPE_KIND = 'Kind'

export const MAINTENANCE_STATE_NORMAL_OPERATION = 'Normal Operation'
export const MAINTENANCE_STATE_MAINTENANCE_START = 'Maintenance Start'
export const MAINTENANCE_STATE_FAILOVER_REQUESTED = 'Failover Requested'
export const MAINTENANCE_STATE_FAILOVER_DONE = 'Failover Done'
export const MAINTENANCE_STATE_FAILOVER_ERROR = 'Failover Error'
export const MAINTENANCE_STATE_MAINTENANCE_START_NO_FAILOVER = 'Maintenance Start No Failover'
export const MAINTENANCE_STATE_CRM_REQUESTED = 'CRM Requested'
export const MAINTENANCE_STATE_CRM_UNDER_MAINTENANCE = 'CRM Under Maintenance'
export const MAINTENANCE_STATE_CRM_ERROR = 'CRM Error'
export const MAINTENANCE_STATE_UNDER_MAINTENANCE = 'Under Maintenance'

export const INFRA_API_ACCESS_DIRECT = 'Direct'
export const INFRA_API_ACCESS_RESTRICTED = 'Restricted'


export const LIVENESS_STATIC = 'Static'
export const LIVENESS_DYNAMIC = 'Dynamic'
export const LIVENESS_AUTOPROV = 'Auto Prov'

export const ALL = 'ALL'
export const ADMIN = 'admin'
export const OPERATOR = 'operator'
export const DEVELOPER = 'developer'
export const VIEWER = 'Viewer'
export const ADMIN_MANAGER = 'AdminManager'
export const ADMIN_CONTRIBUTOR = 'AdminContributor'
export const ADMIN_VIEWER = 'AdminViewer'
export const OPERATOR_MANAGER = 'OperatorManager'
export const OPERATOR_CONTRIBUTOR = 'OperatorContributor'
export const OPERATOR_VIEWER = 'OperatorViewer'
export const DEVELOPER_MANAGER = 'DeveloperManager'
export const DEVELOPER_CONTRIBUTOR = 'DeveloperContributor'
export const DEVELOPER_VIEWER = 'DeveloperViewer'

export const CONFIG_ENV_VAR = 'Environment Variables Yaml'
export const CONFIG_HELM_CUST = 'Helm Customization Yaml'

export const CRM_OVERRIDE_NO_OVERRIDE = 0
export const CRM_OVERRIDE_IGNORE_CRM_ERRORS = 1
export const CRM_OVERRIDE_IGNORE_CRM = 2
export const CRM_OVERRIDE_IGNORE_TRANSIENT_STATE = 3
export const CRM_OVERRIDE_IGNORE_CRM_AND_TRANSIENT_STATE = 4

export const POWER_STATE_POWER_ON_REQUESTED = 'Power On Requested'
export const POWER_STATE_POWERING_ON = 'Powering On'
export const POWER_STATE_POWER_ON = 'Power On'
export const POWER_STATE_POWER_OFF_REQUESTED = 'Power Off Requested'
export const POWER_STATE_POWERING_OFF = 'Powering Off'
export const POWER_STATE_POWER_OFF = 'Power Off'
export const POWER_STATE_REBOOT_REQUESTED = 'Reboot Requested'
export const POWER_STATE_REBOOTING = 'Rebooting'
export const POWER_STATE_REBOOT = 'Reboot'
export const POWER_STATE_ERROR = 'Error'

export const HEALTH_CHECK = 'HEALTH_CHECK'
export const HEALTH_CHECK_FAIL_ROOTLB_OFFLINE = 'Rootlb Offline'
export const HEALTH_CHECK_FAIL_SERVER_FAIL = 'Server Fail'
export const HEALTH_CHECK_OK = 'OK'

export const OFFLINE = 'Offline'
export const ONLINE = 'Online'

export const PAGE_ORGANIZATIONS = 'Organizations'
export const PAGE_USER_ROLES = 'UserRoles'
export const PAGE_ACCOUNTS = 'Accounts'
export const PAGE_CLOUDLETS = 'Cloudlets'
export const PAGE_CLOUDLET_POOLS = 'CloudletPools'
export const PAGE_POOL_ACCESS = 'PoolAccess'
export const PAGE_FLAVORS = 'Flavors'
export const PAGE_CLUSTER_INSTANCES = 'ClusterInstances'
export const PAGE_APPS = 'Apps'
export const PAGE_APP_INSTANCES = 'AppInstances'
export const PAGE_POLICIES = 'Policies'
export const PAGE_AUTO_PROVISIONING_POLICY = 'AutoProvisioningPolicy'
export const PAGE_TRUST_POLICY = 'TrustPolicy'
export const PAGE_AUTO_SCALE_POLICY = 'AutoScalePolicy'
export const PAGE_MONITORING = 'Monitoring'
export const PAGE_MONITORING_RELOAD = 'Reload'
export const PAGE_ALERTS = 'AlertReceivers'
export const PAGE_BILLING_ORG = 'BillingOrg'
export const PAGE_INVOICES = 'Invoices'

export const BILLING_TYPE_SELF = 'Self'
export const BILLING_TYPE_PARENT = 'Parent'
export const CLOUDLET_STATUS_READY = 2
export const CLOUDLET_STATUS_UNKNOWN = 0

export const pages = [
    { label: 'Organizations', icon: 'supervisor_account', id: PAGE_ORGANIZATIONS, path: 'organizations' },
    { label: 'Users & Roles', icon: 'assignment_ind', id: PAGE_USER_ROLES, path: 'user-roles' },
    { label: 'Accounts', icon: 'dvr', id: PAGE_ACCOUNTS, path: 'accounts', roles: [ADMIN] },
    { divider: true },
    { label: 'Cloudlets', icon: 'cloud_queue', id: PAGE_CLOUDLETS, path: 'cloudlets' },
    { label: 'Cloudlet Pools', icon: 'cloud_circle', id: PAGE_CLOUDLET_POOLS, path: 'cloudlet-pools', roles: [ADMIN, OPERATOR] },
    { label: 'Cloudlet Pools', icon: 'cloud_circle', id: PAGE_POOL_ACCESS, path: 'pool-access', roles: [DEVELOPER_MANAGER] },
    { label: 'Flavors', icon: 'free_breakfast', id: PAGE_FLAVORS, path: 'flavors', roles: [ADMIN, DEVELOPER] },
    { label: 'Cluster Instances', icon: 'storage', id: PAGE_CLUSTER_INSTANCES, path: 'cluster-insts', roles: [ADMIN, DEVELOPER] },
    { label: 'Apps', icon: 'apps', id: PAGE_APPS, path: 'apps', roles: [ADMIN, DEVELOPER] },
    { label: 'App Instances', icon: 'games', id: PAGE_APP_INSTANCES, path: 'app-insts', roles: [ADMIN, DEVELOPER] },
    {
        label: 'Policies', icon: 'track_changes', id: PAGE_POLICIES, sub: true, options: [
            { label: 'Auto Provisioning Policy', icon: 'group_work', id: PAGE_AUTO_PROVISIONING_POLICY, path: 'auto-prov-policy', roles: [ADMIN, DEVELOPER] },
            { label: 'Trust Policy', icon: 'policy', id: PAGE_TRUST_POLICY, path: 'trust-policy' },
            { label: 'Auto Scale Policy', icon: 'landscape', id: PAGE_AUTO_SCALE_POLICY, path: 'auto-scale-policy', roles: [ADMIN, DEVELOPER] },
        ]
    },
    { label: 'Monitoring', icon: 'tv', id: PAGE_MONITORING, path: 'monitoring' },
    { label: 'Alert Receivers', icon: 'notification_important', id: PAGE_ALERTS, path: 'alerts' },
    { label: 'Billing', icon: 'payment', id: PAGE_BILLING_ORG, path: 'billing-org', roles: [ADMIN] },
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

export const operatorRoles = [ADMIN_MANAGER, OPERATOR_MANAGER, OPERATOR_CONTRIBUTOR]


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

export const validatePrivateAccess = async (self) => {
    let privateAccess = undefined
    if (redux_org.isOperator(self)) {
        let mc = await sendRequest(self, accessGranted(self))
        if (mc.response && mc.response.status === 200) {
            let dataList = mc.response.data
            if (dataList.length > 0) {
                let regions = new Set()
                dataList.forEach(data => {
                    regions.add(data.Region)
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
    }
    return privateAccess
}

export const toFirstUpperCase = (data) => {
    if(data)
    {
    return data.charAt(0).toUpperCase() + data.slice(1)
    }
}

