import { fields } from "./services/model/format"
import { time } from './utils/date_util'

export const LOCAL_STRAGE_KEY = 'PROJECT_INIT'
export const LS_USER_META_DATA = 'usermetadata'

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
export const PLATFORM_TYPE_FAKE = 'Fake'
export const PLATFORM_TYPE_DIND = 'DIND'
export const PLATFORM_TYPE_OPEN_STACK = 'Openstack'
export const PLATFORM_TYPE_AZURE = 'Azure'
export const PLATFORM_TYPE_OPEN_GCP = 'GCP'
export const PLATFORM_TYPE_EDGEBOX = 'Edgebox'
export const PLATFORM_TYPE_FAKEINFRA = 'Fakeinfra'
export const PLATFORM_TYPE_VSPHERE = 'vSphere (alpha feature)'
export const PLATFORM_TYPE_AWS = 'AWS'
export const PLATFORM_TYPE_VMPOOL = 'VM Pool'
export const IP_SUPPORT_DYNAMIC = 'Dynamic'
export const LIVENESS_STATIC = 'Static'
export const APP = 'App'
export const YES = 'Yes'
export const NO = 'No'
export const RUN_COMMAND = 'Run Command';
export const SHOW_LOGS = 'Show Logs';
export const RECEIVER_TYPE_EMAIL = 'Email'
export const RECEIVER_TYPE_SLACK = 'Slack'

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

export const ADMIN = 'Admin'
export const OPERATOR = 'Operator'
export const DEVELOPER = 'Developer'
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

export const CONFIG_ENV_VAR = 'Environment Variables'
export const CONFIG_HELM_CUST = 'Helm Customization'

export const CRM_OVERRIDE_NO_OVERRIDE = 0
export const CRM_OVERRIDE_IGNORE_CRM_ERRORS = 1
export const CRM_OVERRIDE_IGNORE_CRM = 2
export const CRM_OVERRIDE_IGNORE_TRANSIENT_STATE = 3
export const CRM_OVERRIDE_IGNORE_CRM_AND_TRANSIENT_STATE = 4

export const POWER_STATE_POWER_STATE_UNKNOWN = 'Unknown'
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
export const HEALTH_CHECK_UNKNOWN = 'Unknown'
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
export const PAGE_FLAVORS = 'Flavors'
export const PAGE_CLUSTER_INSTANCES = 'ClusterInstances'
export const PAGE_APPS = 'Apps'
export const PAGE_APP_INSTANCES = 'AppInstances'
export const PAGE_AUTO_PROVISIONING_POLICY = 'AutoProvisioningPolicy'
export const PAGE_TRUST_POLICY = 'TrustPolicy'
export const PAGE_AUTO_SCALE_POLICY = 'AutoScalePolicy'
export const PAGE_MONITORING = 'Monitoring'
export const PAGE_MONITORING_RELOAD = 'Reload'
export const PAGE_ALERTS = 'AlertReceivers'

const dataFormatter = (type, value) => {
    switch (type) {
        case HEALTH_CHECK:
            return healthCheck(value)
    }
}

export const formatData = (key, value) => {
    if (key.formatDate) {
        return time(key.formatDate, parseInt(value + '000'))
    }
    else if (key.formatData) {
        return dataFormatter(key.formatData, value)
    }
    return value
}

export const MaintenanceState = (id) => {
    switch (id) {
        case 0:
            return MAINTENANCE_STATE_NORMAL_OPERATION
        case 1:
            return MAINTENANCE_STATE_MAINTENANCE_START
        case 2:
            return MAINTENANCE_STATE_FAILOVER_REQUESTED
        case 3:
            return MAINTENANCE_STATE_FAILOVER_DONE
        case 4:
            return MAINTENANCE_STATE_FAILOVER_ERROR
        case 5:
            return MAINTENANCE_STATE_MAINTENANCE_START_NO_FAILOVER
        case 6:
            return MAINTENANCE_STATE_CRM_REQUESTED
        case 7:
            return MAINTENANCE_STATE_CRM_UNDER_MAINTENANCE
        case 8:
            return MAINTENANCE_STATE_CRM_ERROR
        case 31:
            return MAINTENANCE_STATE_UNDER_MAINTENANCE
        case MAINTENANCE_STATE_NORMAL_OPERATION:
            return 0
        case MAINTENANCE_STATE_MAINTENANCE_START:
            return 1
        case MAINTENANCE_STATE_MAINTENANCE_START_NO_FAILOVER:
            return 5
        default:
            return MAINTENANCE_STATE_NORMAL_OPERATION
    }
}

export const PowerState = (id) => {
    switch (id) {
        case 0:
            return POWER_STATE_POWER_STATE_UNKNOWN
        case 1:
            return POWER_STATE_POWER_ON_REQUESTED
        case 2:
            return POWER_STATE_POWERING_ON
        case 3:
            return POWER_STATE_POWER_ON
        case 4:
            return POWER_STATE_POWER_OFF_REQUESTED
        case 5:
            return POWER_STATE_POWERING_OFF
        case 6:
            return POWER_STATE_POWER_OFF
        case 7:
            return POWER_STATE_REBOOT_REQUESTED
        case 8:
            return POWER_STATE_REBOOTING
        case 9:
            return POWER_STATE_REBOOT
        case 10:
            return POWER_STATE_ERROR
        case POWER_STATE_POWER_STATE_UNKNOWN:
            return 0
        case POWER_STATE_POWER_ON_REQUESTED:
            return 1
        case POWER_STATE_POWERING_ON:
            return 2
        case POWER_STATE_POWER_ON:
            return 3
        case POWER_STATE_POWER_OFF_REQUESTED:
            return 4
        case POWER_STATE_POWERING_OFF:
            return 5
        case POWER_STATE_POWER_OFF:
            return 6
        case POWER_STATE_REBOOT_REQUESTED:
            return 7
        case POWER_STATE_REBOOTING:
            return 8
        case POWER_STATE_REBOOT:
            return 9
        case POWER_STATE_ERROR:
            return 10
    }
}

export const CLOUDLET_STATUS_READY = 2
export const CLOUDLET_STATUS_UNKNOWN = 0

export const getHeight = (height) => {
    return window.innerHeight - (height ? height : 85)
}

export const showYesNo = (data, isDetailView) => {
    if (isDetailView) {
        return data ? YES : NO
    }
}

export const IPAccessLabel = (id) => {
    switch (id) {
        case 1:
            return 'Dedicated'
        case 3:
            return 'Shared'
        case 'Dedicated':
            return 1
        case 'Shared':
            return 3
        default:
            return id
    }
}

export const accessType = (id) => {
    switch (id) {
        case 0:
            return ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT
        case 1:
            return ACCESS_TYPE_DIRECT
        case 2:
            return ACCESS_TYPE_LOAD_BALANCER
        case ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT:
            return 0
        case ACCESS_TYPE_DIRECT:
            return 1
        case ACCESS_TYPE_LOAD_BALANCER:
            return 2
        default:
            return id
    }
}

export const infraApiAccess = (id) => {
    switch (id) {
        case 0:
            return INFRA_API_ACCESS_DIRECT
        case 1:
            return INFRA_API_ACCESS_RESTRICTED
        case INFRA_API_ACCESS_DIRECT:
            return 0
        case INFRA_API_ACCESS_RESTRICTED:
            return 1
        default:
            return id
    }
}

export const healthCheck = (id) => {
    switch (parseInt(id)) {
        case 0:
            return HEALTH_CHECK_UNKNOWN
        case HEALTH_CHECK_UNKNOWN:
            return 0
        case 1:
            return HEALTH_CHECK_FAIL_ROOTLB_OFFLINE
        case HEALTH_CHECK_FAIL_ROOTLB_OFFLINE:
            return 1
        case 2:
            return HEALTH_CHECK_FAIL_SERVER_FAIL
        case HEALTH_CHECK_FAIL_SERVER_FAIL:
            return 2
        case 3:
            return HEALTH_CHECK_OK
        case HEALTH_CHECK_OK:
            return 3
        default:
            return id
    }
}

export const imageType = (id) => {
    switch (id) {
        case 1:
            return IMAGE_TYPE_DOCKER
        case IMAGE_TYPE_DOCKER:
            return 1
        case 2:
            return IMAGE_TYPE_QCOW
        case IMAGE_TYPE_QCOW:
            return 2
        case 3:
            return IMAGE_TYPE_HELM
        case IMAGE_TYPE_HELM:
            return 3
        default:
            return id
    }
}

export const configType = (id) => {
    switch (id) {
        case CONFIG_HELM_CUST:
            return 'helmCustomizationYaml'
        case CONFIG_ENV_VAR:
            return 'envVarsYaml'
        case 'helmCustomizationYaml':
            return CONFIG_HELM_CUST
        case 'envVarsYaml':
            return CONFIG_ENV_VAR
        default:
            return id
    }
}


export const IPSupport = (id) => {
    switch (id) {
        case 2:
            return IP_SUPPORT_DYNAMIC
        case IP_SUPPORT_DYNAMIC:
            return 2
        default:
            return id
    }
}


export const PlatformType = (id) => {
    switch (id) {
        case 0:
            return PLATFORM_TYPE_FAKE
        case 1:
            return PLATFORM_TYPE_DIND
        case 2:
            return PLATFORM_TYPE_OPEN_STACK
        case 3:
            return PLATFORM_TYPE_AZURE
        case 4:
            return PLATFORM_TYPE_OPEN_GCP
        case 5:
            return PLATFORM_TYPE_EDGEBOX
        case 6:
            return PLATFORM_TYPE_FAKEINFRA
        case 7:
            return PLATFORM_TYPE_VSPHERE
        case 8:
            return PLATFORM_TYPE_AWS
        case 9:
            return PLATFORM_TYPE_VMPOOL
        case PLATFORM_TYPE_FAKE:
            return 0
        case PLATFORM_TYPE_DIND:
            return 1
        case PLATFORM_TYPE_OPEN_STACK:
            return 2
        case PLATFORM_TYPE_AZURE:
            return 3
        case PLATFORM_TYPE_OPEN_GCP:
            return 4
        case PLATFORM_TYPE_EDGEBOX:
            return 5
        case PLATFORM_TYPE_FAKEINFRA:
            return 6
        case PLATFORM_TYPE_VSPHERE:
            return 7
        case PLATFORM_TYPE_AWS:
            return 8
        case PLATFORM_TYPE_VMPOOL:
            return 9
        default:
            return id
    }
}

export const liveness = (id) => {
    switch (id) {
        case 1:
            return LIVENESS_STATIC
        case LIVENESS_STATIC:
            return 1
        default:
            return id
    }
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

