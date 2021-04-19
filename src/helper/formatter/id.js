import * as constant from "../../constant"

export const powerState = (label) => {
    switch (label) {
        case constant.UNKNOWN:
            return 0
        case constant.POWER_STATE_POWER_ON_REQUESTED:
            return 1
        case constant.POWER_STATE_POWERING_ON:
            return 2
        case constant.POWER_STATE_POWER_ON:
            return 3
        case constant.POWER_STATE_POWER_OFF_REQUESTED:
            return 4
        case constant.POWER_STATE_POWERING_OFF:
            return 5
        case constant.POWER_STATE_POWER_OFF:
            return 6
        case constant.POWER_STATE_REBOOT_REQUESTED:
            return 7
        case constant.POWER_STATE_REBOOTING:
            return 8
        case constant.POWER_STATE_REBOOT:
            return 9
        case constant.POWER_STATE_ERROR:
            return 10
    }
}

export const maintainance = (label) => {
    switch (label) {
        case constant.MAINTENANCE_STATE_NORMAL_OPERATION:
            return 0
        case constant.MAINTENANCE_STATE_MAINTENANCE_START:
            return 1
        case constant.MAINTENANCE_STATE_MAINTENANCE_START_NO_FAILOVER:
            return 5
    }
}

export const platformType = (label) => {
    switch (label) {
        case constant.PLATFORM_TYPE_FAKE:
            return 0
        case constant.PLATFORM_TYPE_DIND:
            return 1
        case constant.PLATFORM_TYPE_OPEN_STACK:
            return 2
        case constant.PLATFORM_TYPE_AZURE:
            return 3
        case constant.PLATFORM_TYPE_OPEN_GCP:
            return 4
        case constant.PLATFORM_TYPE_EDGEBOX:
            return 5
        case constant.PLATFORM_TYPE_FAKEINFRA:
            return 6
        case constant.PLATFORM_TYPE_VSPHERE:
            return 7
        case constant.PLATFORM_TYPE_AWS_EKS:
            return 8
        case constant.PLATFORM_TYPE_VMPOOL:
            return 9
        case constant.PLATFORM_TYPE_AWS_EC2:
            return 10
        case constant.PLATFORM_TYPE_VCD:
            return 11
        case constant.PLATFORM_TYPE_K8S_BARE_METAL:
            return 12
        case constant.PLATFORM_TYPE_KIND:
            return 13
        default:
            return label
    }
}

export const infraApiAccess = (label) => {
    switch (label) {
        case constant.INFRA_API_ACCESS_DIRECT:
            return 0
        case constant.INFRA_API_ACCESS_RESTRICTED:
            return 1
        default:
            return label
    }
}

export const ipSupport = (label) => {
    switch (label) {
        case constant.IP_SUPPORT_STATIC:
            return 1
        case constant.IP_SUPPORT_DYNAMIC:
            return 2
        default:
            return label
    }
}

export const ipAccess = (label) => {
    switch (label) {
        case constant.UNKNOWN:
            return 0
        case constant.IP_ACCESS_DEDICATED:
            return 1
        case constant.IP_ACCESS_SHARED:
            return 3
        default:
            return label
    }
}

export const imageType = (label) => {
    switch (label) {
        case constant.IMAGE_TYPE_DOCKER:
            return 1
        case constant.IMAGE_TYPE_QCOW:
            return 2
        case constant.IMAGE_TYPE_HELM:
            return 3
        default:
            return label
    }
}

export const accessType = (label) => {
    switch (label) {
        case constant.ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT:
            return 0
        case constant.ACCESS_TYPE_DIRECT:
            return 1
        case constant.ACCESS_TYPE_LOAD_BALANCER:
            return 2
        default:
            return label
    }
}

export const kind = (label) => {
    switch (label) {
        case constant.CONFIG_HELM_CUST:
            return 'helmCustomizationYaml'
        case constant.CONFIG_ENV_VAR:
            return 'envVarsYaml'
        default:
            return label
    }
}