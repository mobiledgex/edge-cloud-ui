import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.decision] = value[fields.decision] ? value[fields.decision] : 'pending'
    return value
}