import { liveness, ipAccess } from "../../../helper/formatter/label"
import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.liveness] = liveness(value[fields.liveness])
    value[fields.createdAt] = value[fields.createdAt] ? value[fields.createdAt][fields.seconds] : undefined
    value[fields.updatedAt] = value[fields.updatedAt] ? value[fields.updatedAt][fields.seconds] : undefined
    value[fields.ipAccess] = value[fields.ipAccess] ? ipAccess(value[fields.ipAccess]) : undefined
    value[fields.revision] = value[fields.revision] ? value[fields.revision] : '0'
    value[fields.healthCheck] = value[fields.healthCheck] ? value[fields.healthCheck] : 0
    value[fields.sharedVolumeSize] = value[fields.autoClusterInstance] ? value[fields.sharedVolumeSize] ? value[fields.sharedVolumeSize] : 0 : undefined
    value[fields.cloudlet_name_operator] = `${value[fields.cloudletName]} [${value[fields.operatorName]}]`
    value[fields.app_name_version] = `${value[fields.appName]} [${value[fields.version]}]`
    return value
}