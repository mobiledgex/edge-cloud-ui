import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.decision] = value[localFields.decision] ? value[localFields.decision] : 'pending'
    return value
}