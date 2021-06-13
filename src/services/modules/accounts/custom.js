import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.emailVerified] = value[fields.emailVerified] ? value[fields.emailVerified] : false
    value[fields.locked] = value[fields.locked] ? value[fields.locked] : false
    return value
}