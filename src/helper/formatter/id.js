import * as perpetual from "../constant/perpetual"
import * as serverFields from './serverFields'

export const powerState = (label) => {
    switch (label) {
        case perpetual.UNKNOWN:
            return serverFields.UNKNOWN
        case perpetual.POWER_STATE_POWER_ON_REQUESTED:
            return serverFields.POWER_ON_REQUESTED
        case perpetual.POWER_STATE_POWERING_ON:
            return serverFields.POWERING_ON
        case perpetual.POWER_STATE_POWER_ON:
            return serverFields.POWER_ON
        case perpetual.POWER_STATE_POWER_OFF_REQUESTED:
            return serverFields.POWER_OFF_REQUESTED
        case perpetual.POWER_STATE_POWERING_OFF:
            return serverFields.POWERING_OFF
        case perpetual.POWER_STATE_POWER_OFF:
            return serverFields.POWER_OFF
        case perpetual.POWER_STATE_REBOOT_REQUESTED:
            return serverFields.REBOOT_REQUESTED
        case perpetual.POWER_STATE_REBOOTING:
            return serverFields.REBOOTING
        case perpetual.POWER_STATE_REBOOT:
            return serverFields.REBOOT
        case perpetual.POWER_STATE_ERROR:
            return serverFields.ERROR
    }
}

export const maintainance = (label) => {
    switch (label) {
        case perpetual.MAINTENANCE_STATE_NORMAL_OPERATION:
            return serverFields.NORMAL_OPERATION
        case perpetual.MAINTENANCE_STATE_MAINTENANCE_START:
            return serverFields.MAINTENANCE_START
        case perpetual.MAINTENANCE_STATE_MAINTENANCE_START_NO_FAILOVER:
            return serverFields.MAINTENANCE_START_NO_FAILOVER
    }
}

export const platformType = (label) => {
    switch (label) {
        case perpetual.PLATFORM_TYPE_FAKE:
            return serverFields.FAKE
        case perpetual.PLATFORM_TYPE_DIND:
            return serverFields.DIND
        case perpetual.PLATFORM_TYPE_OPEN_STACK:
            return serverFields.OPENSTACK
        case perpetual.PLATFORM_TYPE_AZURE:
            return serverFields.AZURE
        case perpetual.PLATFORM_TYPE_OPEN_GCP:
            return serverFields.OPEN_GCP
        case perpetual.PLATFORM_TYPE_EDGEBOX:
            return serverFields.EDGEBOX
        case perpetual.PLATFORM_TYPE_FAKEINFRA:
            return serverFields.FAKEINFRA
        case perpetual.PLATFORM_TYPE_VSPHERE:
            return serverFields.VSPHERE
        case perpetual.PLATFORM_TYPE_AWS_EKS:
            return serverFields.AWS_EKS
        case perpetual.PLATFORM_TYPE_VMPOOL:
            return serverFields.VMPOOL
        case perpetual.PLATFORM_TYPE_AWS_EC2:
            return serverFields.AWS_EC2
        case perpetual.PLATFORM_TYPE_VCD:
            return serverFields.VCD
        case perpetual.PLATFORM_TYPE_K8S_BARE_METAL:
            return serverFields.K8S_BARE_METAL
        case perpetual.PLATFORM_TYPE_KIND:
            return serverFields.KIND
        default:
            return label
    }
}

export const infraApiAccess = (label) => {
    switch (label) {
        case perpetual.INFRA_API_ACCESS_DIRECT:
            return serverFields.DIRECT
        case perpetual.INFRA_API_ACCESS_RESTRICTED:
            return serverFields.RESTRICTED
        default:
            return label
    }
}

export const ipSupport = (label) => {
    switch (label) {
        case perpetual.IP_SUPPORT_STATIC:
            return serverFields.STATIC
        case perpetual.IP_SUPPORT_DYNAMIC:
            return serverFields.DYNAMIC
        default:
            return label
    }
}

export const ipAccess = (label) => {
    switch (label) {
        case perpetual.UNKNOWN:
            return serverFields.UNKNOWN
        case perpetual.IP_ACCESS_DEDICATED:
            return serverFields.DEDICATED
        case perpetual.IP_ACCESS_SHARED:
            return serverFields.SHARED
        default:
            return label
    }
}

export const imageType = (label) => {
    switch (label) {
        case perpetual.IMAGE_TYPE_DOCKER:
            return serverFields.DOCKER
        case perpetual.IMAGE_TYPE_QCOW:
            return serverFields.QCOW
        case perpetual.IMAGE_TYPE_HELM:
            return serverFields.HELM
        default:
            return label
    }
}

export const accessType = (label) => {
    switch (label) {
        case perpetual.ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT:
            return serverFields.DEFAULT_FOR_DEPLOYMENT
        case perpetual.ACCESS_TYPE_DIRECT:
            return serverFields.DIRECT
        case perpetual.ACCESS_TYPE_LOAD_BALANCER:
            return serverFields.LOAD_BALANCER
        default:
            return label
    }
}

export const kind = (label) => {
    switch (label) {
        case perpetual.CONFIG_HELM_CUST:
            return serverFields.HELM_CUSTOMIZATION_YAML
        case perpetual.CONFIG_ENV_VAR:
            return serverFields.ENV_VARS_YAML
        default:
            return label
    }
}

export const reportInterval = (label) => {
    switch (label) {
        case perpetual.REPORTER_SCHEDULE_WEEKLY:
            return serverFields.EVERY_WEEK
        case perpetual.REPORTER_SCHEDULE_15_DAYS:
            return serverFields.EVERY_15_DAYS
        case perpetual.REPORTER_SCHEDULE_MONTHLY:
            return serverFields.EVERY_MONTH
        default:
            return serverFields.UNKNOWN
    }
}

export const vmAppOS = (label) => {
    switch (label) {
        case perpetual.OS_UNKNOWN:
            return serverFields.UNKNOWN
        case perpetual.OS_LINUX:
            return serverFields.LINUX
        case perpetual.OS_WINDOWS_10:
            return serverFields.WINDOWS_10
        case perpetual.OS_WINDOWS_2012:
            return serverFields.WINDOWS_2012
        case perpetual.OS_WINDOWS_2016:
            return serverFields.WINDOWS_2016
        case perpetual.OS_WINDOWS_2019:
            return serverFields.WINDOWS_2019
    }
}

export const connectionType = (label) => {
    switch (label) {
        case perpetual.CONNECTION_UNDEFINED:
            return serverFields.CONNECTION_UNDEFINED
        case perpetual.CONNECT_TO_LOAD_BALANCER:
            return serverFields.CONNECT_TO_LOAD_BALANCER
        case perpetual.CONNECT_TO_CLUSTER_NODES:
            return serverFields.CONNECT_TO_CLUSTER_NODES
        case perpetual.CONNECT_TO_ALL:
            return serverFields.CONNECT_TO_ALL
        default:
            return label
    }
}