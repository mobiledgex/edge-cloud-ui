import { fields } from "../.."

export const customize = (request, value) => {
    value[fields.zoneCount] =  value[fields.zoneCount] ? value[fields.zoneCount] : 0
    return value
}