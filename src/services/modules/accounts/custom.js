import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.emailVerified] = value[localFields.emailVerified] ? value[localFields.emailVerified] : false
    value[localFields.locked] = value[localFields.locked] ? value[localFields.locked] : false
    return value
}