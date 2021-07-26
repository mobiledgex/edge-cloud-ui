import { ipSupport, platformType, infraApiAccess } from "../../../helper/formatter/label"
import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.cloudletStatus] = value[fields.maintenanceState] && value[fields.maintenanceState] !== 0 ? 999 : 4
    value[fields.ipSupport] = ipSupport(value[fields.ipSupport])
    value[fields.platformType] = platformType(value[fields.platformType])
    value[fields.infraApiAccess] = infraApiAccess(value[fields.infraApiAccess] ? value[fields.infraApiAccess] : 0)
    value[fields.createdAt] = value[fields.createdAt] ? value[fields.createdAt][fields.seconds] : undefined
    value[fields.updatedAt] = value[fields.updatedAt] ? value[fields.updatedAt][fields.seconds] : undefined
    value[fields.updatedAt] = value[fields.updatedAt] ? value[fields.updatedAt][fields.seconds] : undefined
    value[fields.trusted] = value[fields.trustPolicyName] !== undefined
    return value
}

export const gpuDriverCustomize = (request, value) => {
    value[fields.gpuConfig] = `${value[fields.name]}${value[fields.operatorName] ? '' : '[MobiledgeX]'}`
    value[fields.operatorName] = value[fields.operatorName] ? value[fields.operatorName] : 'MobiledgeX'
    return value
}