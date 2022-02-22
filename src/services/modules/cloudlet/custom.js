import { ipSupport, platformType, infraApiAccess } from "../../../helper/formatter/label"
import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.cloudletStatus] = value[fields.maintenanceState] && value[fields.maintenanceState] !== 0 ? 999 : 4
    value[fields.ipSupport] = ipSupport(value[fields.ipSupport])
    value[fields.platformType] = value[fields.platformType] ? platformType(value[fields.platformType]) : 'Fake'
    value[fields.infraApiAccess] = infraApiAccess(value[fields.infraApiAccess] ? value[fields.infraApiAccess] : 0)
    value[fields.createdAt] = value[fields.createdAt] ? value[fields.createdAt]: undefined
    value[fields.updatedAt] = value[fields.updatedAt] ? value[fields.updatedAt] : undefined
    value[fields.gpuConfig] = value[fields.gpuDriverName] ? `${value[fields.gpuDriverName]}${value[fields.gpuORG] ? '' : ' [MobiledgeX]'}` : undefined
    value[fields.gpuExist] = value[fields.gpuConfig] ? true : false
    value[fields.trusted] = value[fields.trustPolicyName] !== undefined
    return value
}