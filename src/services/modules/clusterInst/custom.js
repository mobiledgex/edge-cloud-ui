import * as perpetual from "../../../helper/constant/perpetual"
import { ipAccess } from "../../../helper/formatter/label"
import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.ipAccess] = ipAccess(value[fields.ipAccess])
    value[fields.reservable] = value[fields.reservable] ? value[fields.reservable] : false
    value[fields.numberOfNodes] = value[fields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES ? value[fields.numberOfNodes] ? value[fields.numberOfNodes] : 0 : undefined
    value[fields.sharedVolumeSize] = value[fields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES ? value[fields.sharedVolumeSize] ? value[fields.sharedVolumeSize] : 0 : undefined
    value[fields.createdAt] = value[fields.createdAt] ? value[fields.createdAt][fields.seconds] : undefined
    value[fields.updatedAt] = value[fields.updatedAt] ? value[fields.updatedAt][fields.seconds] : undefined
    value[fields.cloudlet_name_operator] = `${value[fields.cloudletName]} [${value[fields.operatorName]}]`
    return value
}