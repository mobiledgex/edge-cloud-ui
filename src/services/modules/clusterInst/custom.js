import * as perpetual from "../../../helper/constant/perpetual"
import { ipAccess } from "../../../helper/formatter/label"
import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.ipAccess] = ipAccess(value[localFields.ipAccess])
    value[localFields.reservable] = value[localFields.reservable] ? value[localFields.reservable] : false
    value[localFields.numberOfNodes] = value[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES ? value[localFields.numberOfNodes] ? value[localFields.numberOfNodes] : 0 : undefined
    value[localFields.sharedVolumeSize] = value[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES ? value[localFields.sharedVolumeSize] ? value[localFields.sharedVolumeSize] : 0 : undefined
    value[localFields.createdAt] = value[localFields.createdAt] ? value[localFields.createdAt] : undefined
    value[localFields.updatedAt] = value[localFields.updatedAt] ? value[localFields.updatedAt] : undefined
    value[localFields.cloudlet_name_operator] = `${value[localFields.cloudletName]} [${value[localFields.operatorName]}]`
    return value
}