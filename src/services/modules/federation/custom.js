import { fields } from "../../model/format"
import * as perpetual from "../../../helper/constant/perpetual"
export const customize = (request, value) => {
    value[fields.partnerRoleShareZoneWithSelf] = value[fields.partnerRoleShareZoneWithSelf] ? perpetual.YES : perpetual.NO
    return value
}