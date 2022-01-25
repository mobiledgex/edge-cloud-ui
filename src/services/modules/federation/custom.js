import { fields } from "../../model/format"
export const customize = (request, value) => {
    value[fields.partnerRoleShareZoneWithSelf] = value[fields.partnerRoleShareZoneWithSelf] ? true : false
    return value
}