import { ipSupport, platformType, infraApiAccess } from "../../../helper/formatter/label"
import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.cloudletStatus] = value[localFields.maintenanceState] && value[localFields.maintenanceState] !== 0 ? 999 : 4
    value[localFields.ipSupport] = ipSupport(value[localFields.ipSupport])
    value[localFields.platformType] = value[localFields.platformType] ? platformType(value[localFields.platformType]) : 'Fake'
    value[localFields.infraApiAccess] = infraApiAccess(value[localFields.infraApiAccess] ? value[localFields.infraApiAccess] : 0)
    value[localFields.createdAt] = value[localFields.createdAt] ? value[localFields.createdAt]: undefined
    value[localFields.updatedAt] = value[localFields.updatedAt] ? value[localFields.updatedAt] : undefined
    value[localFields.gpuConfig] = value[localFields.gpuDriverName] ? `${value[localFields.gpuDriverName]}${value[localFields.gpuORG] ? '' : ' [MobiledgeX]'}` : undefined
    value[localFields.gpuExist] = value[localFields.gpuConfig] ? true : false
    value[localFields.trusted] = value[localFields.trustPolicyName] !== undefined
    return value
}