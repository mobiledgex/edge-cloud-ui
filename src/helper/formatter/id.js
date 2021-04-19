import * as constant from "../../constant"

export const powerState = (label)=>{
    switch(label)
    {
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