import * as perpetual from "../constant/perpetual"

export const kind = (id) => {
    switch (id) {
        case 'helmCustomizationYaml':
            return perpetual.CONFIG_HELM_CUST
        case 'envVarsYaml':
            return perpetual.CONFIG_ENV_VAR
        default:
            return id
    }
}

export const imageType = (id) => {
    switch (id) {
        case 1:
            return perpetual.IMAGE_TYPE_DOCKER
        case 2:
            return perpetual.IMAGE_TYPE_QCOW
        case 3:
            return perpetual.IMAGE_TYPE_HELM
        default:
            return id
    }
}

export const accessType = (id) => {
    switch (id) {
        case 0:
            return perpetual.ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT
        case 1:
            return perpetual.ACCESS_TYPE_DIRECT
        case 2:
            return perpetual.ACCESS_TYPE_LOAD_BALANCER
        default:
            return id
    }
}

export const ipSupport = (id) => {
    switch (id) {
        case 0:
            return perpetual.UNKNOWN
        case 1:
            return perpetual.IP_SUPPORT_STATIC
        case 2:
            return perpetual.IP_SUPPORT_DYNAMIC
        default:
            return id
    }
}

export const platformType = (id) => {
    switch (id) {
        case 0:
            return perpetual.PLATFORM_TYPE_FAKE
        case 1:
            return perpetual.PLATFORM_TYPE_DIND
        case 2:
            return perpetual.PLATFORM_TYPE_OPEN_STACK
        case 3:
            return perpetual.PLATFORM_TYPE_AZURE
        case 4:
            return perpetual.PLATFORM_TYPE_OPEN_GCP
        case 5:
            return perpetual.PLATFORM_TYPE_EDGEBOX
        case 6:
            return perpetual.PLATFORM_TYPE_FAKEINFRA
        case 7:
            return perpetual.PLATFORM_TYPE_VSPHERE
        case 8:
            return perpetual.PLATFORM_TYPE_AWS_EKS
        case 9:
            return perpetual.PLATFORM_TYPE_VMPOOL
        case 10:
            return perpetual.PLATFORM_TYPE_AWS_EC2
        case 11:
            return perpetual.PLATFORM_TYPE_VCD
        case 12:
            return perpetual.PLATFORM_TYPE_K8S_BARE_METAL
        case 13:
            return perpetual.PLATFORM_TYPE_KIND
        default:
            return id
    }
}

export const infraApiAccess = (id) => {
    switch (id) {
        case 0:
            return perpetual.INFRA_API_ACCESS_DIRECT
        case 1:
            return perpetual.INFRA_API_ACCESS_RESTRICTED
        default:
            return id
    }
}

export const liveness = (id) => {
    switch (id) {
        case 0:
            return perpetual.UNKNOWN
        case 1:
            return perpetual.LIVENESS_STATIC
        case 2:
            return perpetual.LIVENESS_DYNAMIC
        case 3:
            return perpetual.LIVENESS_AUTOPROV
        default:
            return id
    }
}

export const ipAccess = (id) => {
    switch (id) {
        case 0:
            return perpetual.UNKNOWN
        case 1:
            return perpetual.IP_ACCESS_DEDICATED
        case 3:
            return perpetual.IP_ACCESS_SHARED
        default:
            return id
    }
}

export const powerState = (id) => {
    switch (id) {
        case 0:
            return perpetual.UNKNOWN
        case 1:
            return perpetual.POWER_STATE_POWER_ON_REQUESTED
        case 2:
            return perpetual.POWER_STATE_POWERING_ON
        case 3:
            return perpetual.POWER_STATE_POWER_ON
        case 4:
            return perpetual.POWER_STATE_POWER_OFF_REQUESTED
        case 5:
            return perpetual.POWER_STATE_POWERING_OFF
        case 6:
            return perpetual.POWER_STATE_POWER_OFF
        case 7:
            return perpetual.POWER_STATE_REBOOT_REQUESTED
        case 8:
            return perpetual.POWER_STATE_REBOOTING
        case 9:
            return perpetual.POWER_STATE_REBOOT
        case 10:
            return perpetual.POWER_STATE_ERROR
        default:
            return id
    }
}

export const healthCheck = (id) => {
    switch (parseInt(id)) {
        case 0:
            return perpetual.UNKNOWN
        case 1:
            return perpetual.HEALTH_CHECK_FAIL_ROOTLB_OFFLINE
        case 2:
            return perpetual.HEALTH_CHECK_FAIL_SERVER_FAIL
        case 3:
            return perpetual.HEALTH_CHECK_OK
        case 4:
            return perpetual.HEALTH_CLOUDLET_OFFLINE
        default:
            return id
    }
}

export const showYesNo = (data) => {
    return data ? perpetual.YES : perpetual.NO
}

export const decision = (id) => {
    switch (id) {
        case 'pending':
            return 'Pending'
        case 'accept':
            return 'Accepted'
        case 'reject':
            return 'Rejected'

    }
}


export const reporterInterval = (id) => {
    switch (id) {
        case 0:
            return perpetual.REPORTER_SCHEDULE_WEEKLY
        case 1:
            return perpetual.REPORTER_SCHEDULE_15_DAYS
        case 2:
            return perpetual.REPORTER_SCHEDULE_MONTHLY
        default:
            return perpetual.REPORTER_SCHEDULE_WEEKLY
    }
}

export const vmAppOS = (label) => {
    switch (label) {
        case 0:
            return perpetual.VM_APP_OS_UNKNOWN
        case 1:
            return perpetual.VM_APP_OS_LINUX
        case 2:
            return perpetual.VM_APP_OS_WINDOWS_10
        case 3:
            return perpetual.VM_APP_OS_WINDOWS_2012
        case 4:
            return perpetual.VM_APP_OS_WINDOWS_2016
        case 5:
            return perpetual.VM_APP_OS_WINDOWS_2019
    }
}