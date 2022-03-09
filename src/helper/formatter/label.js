import {perpetual} from "../constant"
import * as serverFields from "./serverFields"

export const kind = (id) => {
    switch (id) {
        case serverFields.HELM_CUSTOMIZATION_YAML:
            return perpetual.CONFIG_HELM_CUST
        case serverFields.ENV_VARS_YAML:
            return perpetual.CONFIG_ENV_VAR
        default:
            return id
    }
}

export const imageType = (id) => {
    switch (id) {
        case serverFields.DOCKER:
            return perpetual.IMAGE_TYPE_DOCKER
        case serverFields.QCOW:
            return perpetual.IMAGE_TYPE_QCOW
        case serverFields.HELM:
            return perpetual.IMAGE_TYPE_HELM
        default:
            return id
    }
}

export const accessType = (id) => {
    switch (id) {
        case 0:
        case serverFields.DEFAULT_FOR_DEPLOYMENT:
            return perpetual.ACCESS_TYPE_DEFAULT_FOR_DEPLOYMENT
        case 1:
        case serverFields.DIRECT:
            return perpetual.ACCESS_TYPE_DIRECT
        case 2:
        case serverFields.LOAD_BALANCER:
            return perpetual.ACCESS_TYPE_LOAD_BALANCER
        default:
            return id
    }
}

export const ipSupport = (id) => {
    switch (id) {
        case 0:
        case perpetual.UNKNOWN:
            return perpetual.UNKNOWN
        case 1:
        case serverFields.STATIC:
            return perpetual.IP_SUPPORT_STATIC
        case 2:
        case serverFields.DYNAMIC:
            return perpetual.IP_SUPPORT_DYNAMIC
        default:
            return id
    }
}

export const platformType = (id) => {
    switch (id) {
         case 0:
        case serverFields.FAKE:
            return perpetual.PLATFORM_TYPE_FAKE
        case 1:
        case serverFields.DIND:
            return perpetual.PLATFORM_TYPE_DIND
        case 2:
        case serverFields.OPENSTACK:
            return perpetual.PLATFORM_TYPE_OPEN_STACK
        case 3:
        case serverFields.AZURE:
            return perpetual.PLATFORM_TYPE_AZURE
        case 4:
        case serverFields.OPEN_GCP:
            return perpetual.PLATFORM_TYPE_OPEN_GCP
        case 5:
        case serverFields.EDGEBOX:
            return perpetual.PLATFORM_TYPE_EDGEBOX
        case 6:
        case serverFields.FAKEINFRA:
            return perpetual.PLATFORM_TYPE_FAKEINFRA
        case 7:
        case serverFields.VSPHERE:
            return perpetual.PLATFORM_TYPE_VSPHERE
        case 8:
        case serverFields.AWS_EKS:
            return perpetual.PLATFORM_TYPE_AWS_EKS
        case 9:
        case serverFields.VMPOOL:
            return perpetual.PLATFORM_TYPE_VMPOOL
        case 10:
        case serverFields.AWS_EC2:
            return perpetual.PLATFORM_TYPE_AWS_EC2
        case 11:
        case serverFields.VCD:
            return perpetual.PLATFORM_TYPE_VCD
        case 12:
        case serverFields.K8S_BARE_METAL:
            return perpetual.PLATFORM_TYPE_K8S_BARE_METAL
        case 13:
        case serverFields.KIND:
            return perpetual.PLATFORM_TYPE_KIND
        case serverFields.FEDERATION:
            return perpetual.PLATFORM_TYPE_FEDERATION
        default:
            return id
    }
}

export const infraApiAccess = (id) => {
    switch (id) {
        case 0:
        case serverFields.DIRECT_ACCESS:
            return perpetual.INFRA_API_ACCESS_DIRECT
        case 1:
        case serverFields.RESTRICTED_ACCESS:
            return perpetual.INFRA_API_ACCESS_RESTRICTED
        default:
            return id
    }
}

export const liveness = (id) => {
    switch (id) {
        case 0:
        case serverFields.UNKNOWN:
            return perpetual.UNKNOWN
        case 1:
        case serverFields.STATIC:
            return perpetual.LIVENESS_STATIC
        case 2:
        case serverFields.DYNAMIC:
            return perpetual.LIVENESS_DYNAMIC
        case 3:
        case serverFields.AUTO_PROV:
            return perpetual.LIVENESS_AUTOPROV
        default:
            return id
    }
}

export const ipAccess = (id) => {
    switch (id) {
        case 0:
        case serverFields.UNKNOWN:
            return perpetual.UNKNOWN
        case 1:
        case serverFields.DEDICATED:
            return perpetual.IP_ACCESS_DEDICATED
        case 3:
        case serverFields.SHARED:
            return perpetual.IP_ACCESS_SHARED
        default:
            return id
    }
}

export const powerState = (id) => {
    switch (id) {
        case 0:
        case serverFields.UNKNOWN:
            return perpetual.UNKNOWN
        case 1:
        case serverFields.POWER_ON_REQUESTED:
            return perpetual.POWER_STATE_POWER_ON_REQUESTED
        case 2:
        case serverFields.POWERING_ON:
            return perpetual.POWER_STATE_POWERING_ON
        case 3:
        case serverFields.POWER_ON:
            return perpetual.POWER_STATE_POWER_ON
        case 4:
        case serverFields.POWER_OFF_REQUESTED:
            return perpetual.POWER_STATE_POWER_OFF_REQUESTED
        case 5:
        case serverFields.POWERING_OFF:
            return perpetual.POWER_STATE_POWERING_OFF
        case 6:
        case serverFields.POWER_OFF:
            return perpetual.POWER_STATE_POWER_OFF
        case 7:
        case serverFields.REBOOT_REQUESTED:
            return perpetual.POWER_STATE_REBOOT_REQUESTED
        case 8:
        case serverFields.REBOOTING:
            return perpetual.POWER_STATE_REBOOTING
        case 9:
        case serverFields.REBOOT:
            return perpetual.POWER_STATE_REBOOT
        case 10:
        case serverFields.ERROR:
            return perpetual.POWER_STATE_ERROR
        default:
            return id
    }
}

export const healthCheck = (id) => {
    switch (id) {
        case 0:
        case serverFields.UNKNOWN:
            return perpetual.UNKNOWN
        case 1:
        case serverFields.FAIL_ROOTLB_OFFLINE:
            return perpetual.HEALTH_CHECK_FAIL_ROOTLB_OFFLINE
        case 2:
        case serverFields.SERVER_FAIL:
            return perpetual.HEALTH_CHECK_FAIL_SERVER_FAIL
        case 3:
        case serverFields.OK:
            return perpetual.HEALTH_CHECK_OK
        case 4:
        case serverFields.CLOUDLET_OFFFLINE:
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
        case serverFields.EVERY_WEEK:
            return perpetual.REPORTER_SCHEDULE_WEEKLY
        case 1:
        case serverFields.EVERY_15_DAYS:
            return perpetual.REPORTER_SCHEDULE_15_DAYS
        case 2:
        case serverFields.EVERY_MONTH:
            return perpetual.REPORTER_SCHEDULE_MONTHLY
        default:
            return perpetual.REPORTER_SCHEDULE_WEEKLY
    }
}

export const vmAppOS = (label) => {
    switch (label) {
        case 0:
        case serverFields.UNKNOWN:
            return perpetual.UNKNOWN
        case 1:
        case serverFields.LINUX:
            return perpetual.OS_LINUX
        case 2:
        case serverFields.WINDOWS_10:
            return perpetual.OS_WINDOWS_10
        case 3:
        case serverFields.WINDOWS_2012:
            return perpetual.OS_WINDOWS_2012
        case 4:
        case serverFields.WINDOWS_2016:
            return perpetual.OS_WINDOWS_2016
        case 5:
        case serverFields.WINDOWS_2019:
            return perpetual.OS_WINDOWS_2019
    }
}

export const connectionType = (id) => {
    switch (id) {
        case serverFields.CONNECTION_UNDEFINED:
            return perpetual.CONNECTION_UNDEFINED
        case serverFields.CONNECT_TO_LOAD_BALANCER:
            return perpetual.CONNECT_TO_LOAD_BALANCER
        case serverFields.CONNECT_TO_CLUSTER_NODES:
            return perpetual.CONNECT_TO_CLUSTER_NODES
        case serverFields.CONNECT_TO_ALL:
            return perpetual.CONNECT_TO_ALL
        default:
            return id
    }
}

export const qosProfile = (label) => {
    switch (label) {
        case serverFields.LOW_LATENCY:
            return perpetual.QOS_LOW_LATENCY
        case serverFields.NO_PRIORITY:
            return perpetual.QOS_NO_PRIORITY
        case serverFields.THROUGHPUT_DOWN_S:
            return perpetual.QOS_THROUGHPUT_DOWN_S
        case serverFields.THROUGHPUT_DOWN_M:
            return perpetual.QOS_THROUGHPUT_DOWN_M
        case serverFields.THROUGHPUT_DOWN_L:
            return perpetual.QOS_THROUGHPUT_DOWN_L
        default:
            return label
    }
}

export const tpeState = (label) => {
    switch (label) {
        case serverFields.APPROVAL_REQUESTED:
            return perpetual.APPROVAL_REQUESTED
        case serverFields.ACTIVE:
            return perpetual.APPROVE
        case serverFields.REJECTED:
            return perpetual.REJECT
        default:
            return label
    }
}