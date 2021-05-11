import * as constant from "../../constant"

export const kind = (id) => {
    switch (id) {
        case 'helmCustomizationYaml':
            return constant.CONFIG_HELM_CUST
        case 'envVarsYaml':
            return constant.CONFIG_ENV_VAR
        default:
            return id
    }
}

export const imageType = (id) => {
    switch (id) {
        case 1:
            return constant.IMAGE_TYPE_DOCKER
        case 2:
            return constant.IMAGE_TYPE_QCOW
        case 3:
            return constant.IMAGE_TYPE_HELM
        default:
            return id
    }
}

export const accessType = (id) => {
    switch (id) {
        case 0:
            return constant.ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT
        case 1:
            return constant.ACCESS_TYPE_DIRECT
        case 2:
            return constant.ACCESS_TYPE_LOAD_BALANCER
        default:
            return id
    }
}

export const ipSupport = (id) => {
    switch (id) {
        case 0:
            return constant.UNKNOWN
        case 1:
            return constant.IP_SUPPORT_STATIC
        case 2:
            return constant.IP_SUPPORT_DYNAMIC
        default:
            return id
    }
}

export const platformType = (id) => {
    switch (id) {
        case 0:
            return constant.PLATFORM_TYPE_FAKE
        case 1:
            return constant.PLATFORM_TYPE_DIND
        case 2:
            return constant.PLATFORM_TYPE_OPEN_STACK
        case 3:
            return constant.PLATFORM_TYPE_AZURE
        case 4:
            return constant.PLATFORM_TYPE_OPEN_GCP
        case 5:
            return constant.PLATFORM_TYPE_EDGEBOX
        case 6:
            return constant.PLATFORM_TYPE_FAKEINFRA
        case 7:
            return constant.PLATFORM_TYPE_VSPHERE
        case 8:
            return constant.PLATFORM_TYPE_AWS_EKS
        case 9:
            return constant.PLATFORM_TYPE_VMPOOL
        case 10:
            return constant.PLATFORM_TYPE_AWS_EC2
        case 11:
            return constant.PLATFORM_TYPE_VCD
        case 12:
            return constant.PLATFORM_TYPE_K8S_BARE_METAL
        case 13:
            return constant.PLATFORM_TYPE_KIND
        default:
            return id
    }
}

export const infraApiAccess = (id) => {
    switch (id) {
        case 0:
            return constant.INFRA_API_ACCESS_DIRECT
        case 1:
            return constant.INFRA_API_ACCESS_RESTRICTED
        default:
            return id
    }
}

export const liveness = (id) => {
    switch (id) {
        case 0:
            return constant.UNKNOWN
        case 1:
            return constant.LIVENESS_STATIC
        case 2:
            return constant.LIVENESS_DYNAMIC
        case 3:
            return constant.LIVENESS_AUTOPROV
        default:
            return id
    }
}

export const ipAccess = (id) => {
    switch (id) {
        case 0:
            return constant.UNKNOWN
        case 1:
            return constant.IP_ACCESS_DEDICATED
        case 3:
            return constant.IP_ACCESS_SHARED
        default:
            return id
    }
}

export const powerState = (id) => {
    switch (id) {
        case 0:
            return constant.UNKNOWN
        case 1:
            return constant.POWER_STATE_POWER_ON_REQUESTED
        case 2:
            return constant.POWER_STATE_POWERING_ON
        case 3:
            return constant.POWER_STATE_POWER_ON
        case 4:
            return constant.POWER_STATE_POWER_OFF_REQUESTED
        case 5:
            return constant.POWER_STATE_POWERING_OFF
        case 6:
            return constant.POWER_STATE_POWER_OFF
        case 7:
            return constant.POWER_STATE_REBOOT_REQUESTED
        case 8:
            return constant.POWER_STATE_REBOOTING
        case 9:
            return constant.POWER_STATE_REBOOT
        case 10:
            return constant.POWER_STATE_ERROR
        default:
            return id
    }
}

export const healthCheck = (id) => {
    switch (parseInt(id)) {
        case 0:
            return constant.UNKNOWN
        case 1:
            return constant.HEALTH_CHECK_FAIL_ROOTLB_OFFLINE
        case 2:
            return constant.HEALTH_CHECK_FAIL_SERVER_FAIL
        case 3:
            return constant.HEALTH_CHECK_OK
        default:
            return id
    }
}

export const showYesNo = (data) => {
    return data ? constant.YES : constant.NO
}

export const decision = (id) =>{
    switch (id) {
        case 'pending':
            return 'Pending'
        case 'accept':
            return 'Accepted'
        case 'reject':
            return 'Rejected'

    }
}