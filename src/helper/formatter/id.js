import * as perpetual from "../constant/perpetual"

export const powerState = (label) => {
    switch (label) {
        case perpetual.UNKNOWN:
            return 0
        case perpetual.POWER_STATE_POWER_ON_REQUESTED:
            return 1
        case perpetual.POWER_STATE_POWERING_ON:
            return 2
        case perpetual.POWER_STATE_POWER_ON:
            return 3
        case perpetual.POWER_STATE_POWER_OFF_REQUESTED:
            return 4
        case perpetual.POWER_STATE_POWERING_OFF:
            return 5
        case perpetual.POWER_STATE_POWER_OFF:
            return 6
        case perpetual.POWER_STATE_REBOOT_REQUESTED:
            return 7
        case perpetual.POWER_STATE_REBOOTING:
            return 8
        case perpetual.POWER_STATE_REBOOT:
            return 9
        case perpetual.POWER_STATE_ERROR:
            return 10
    }
}

export const maintainance = (label) => {
    switch (label) {
        case perpetual.MAINTENANCE_STATE_NORMAL_OPERATION:
            return 0
        case perpetual.MAINTENANCE_STATE_MAINTENANCE_START:
            return 1
        case perpetual.MAINTENANCE_STATE_MAINTENANCE_START_NO_FAILOVER:
            return 5
    }
}

export const platformType = (label) => {
    switch (label) {
        case perpetual.PLATFORM_TYPE_FAKE:
            return 0
        case perpetual.PLATFORM_TYPE_DIND:
            return 1
        case perpetual.PLATFORM_TYPE_OPEN_STACK:
            return 2
        case perpetual.PLATFORM_TYPE_AZURE:
            return 3
        case perpetual.PLATFORM_TYPE_OPEN_GCP:
            return 4
        case perpetual.PLATFORM_TYPE_EDGEBOX:
            return 5
        case perpetual.PLATFORM_TYPE_FAKEINFRA:
            return 6
        case perpetual.PLATFORM_TYPE_VSPHERE:
            return 7
        case perpetual.PLATFORM_TYPE_AWS_EKS:
            return 8
        case perpetual.PLATFORM_TYPE_VMPOOL:
            return 9
        case perpetual.PLATFORM_TYPE_AWS_EC2:
            return 10
        case perpetual.PLATFORM_TYPE_VCD:
            return 11
        case perpetual.PLATFORM_TYPE_K8S_BARE_METAL:
            return 12
        case perpetual.PLATFORM_TYPE_KIND:
            return 13
        default:
            return label
    }
}

export const infraApiAccess = (label) => {
    switch (label) {
        case perpetual.INFRA_API_ACCESS_DIRECT:
            return 0
        case perpetual.INFRA_API_ACCESS_RESTRICTED:
            return 1
        default:
            return label
    }
}

export const ipSupport = (label) => {
    switch (label) {
        case perpetual.IP_SUPPORT_STATIC:
            return 1
        case perpetual.IP_SUPPORT_DYNAMIC:
            return 2
        default:
            return label
    }
}

export const ipAccess = (label) => {
    switch (label) {
        case perpetual.UNKNOWN:
            return 0
        case perpetual.IP_ACCESS_DEDICATED:
            return 1
        case perpetual.IP_ACCESS_SHARED:
            return 3
        default:
            return label
    }
}

export const imageType = (label) => {
    switch (label) {
        case perpetual.IMAGE_TYPE_DOCKER:
            return 1
        case perpetual.IMAGE_TYPE_QCOW:
            return 2
        case perpetual.IMAGE_TYPE_HELM:
            return 3
        default:
            return label
    }
}

export const accessType = (label) => {
    switch (label) {
        case perpetual.ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT:
            return 0
        case perpetual.ACCESS_TYPE_DIRECT:
            return 1
        case perpetual.ACCESS_TYPE_LOAD_BALANCER:
            return 2
        default:
            return label
    }
}

export const kind = (label) => {
    switch (label) {
        case perpetual.CONFIG_HELM_CUST:
            return 'helmCustomizationYaml'
        case perpetual.CONFIG_ENV_VAR:
            return 'envVarsYaml'
        default:
            return label
    }
}

export const reportInterval = (label) => {
    switch (label) {
        case perpetual.REPORTER_SCHEDULE_WEEKLY:
            return 0
        case perpetual.REPORTER_SCHEDULE_15_DAYS:
            return 1
        case perpetual.REPORTER_SCHEDULE_MONTHLY:
            return 2
        default:
            return 0
    }
}

export const vmAppOS = (label) => {
    switch (label) {
        case perpetual.VM_APP_OS_UNKNOWN:
            return 0
        case perpetual.VM_APP_OS_LINUX:
            return 1
        case perpetual.VM_APP_OS_WINDOWS_10:
            return 2
        case perpetual.VM_APP_OS_WINDOWS_2012:
            return 3
        case perpetual.VM_APP_OS_WINDOWS_2016:
            return 4
        case perpetual.VM_APP_OS_WINDOWS_2019:
            return 5
    }
}