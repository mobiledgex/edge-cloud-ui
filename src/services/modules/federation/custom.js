import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.zoneCount] =  value[localFields.zoneCount] ? value[localFields.zoneCount] : 0
    return value
}