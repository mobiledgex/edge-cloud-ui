import { fields } from "../.."

export const customize = (request, value) => {
    value[fields.zonesRegistered] = value[fields.zonesRegistered] ? true : false
    return value
}