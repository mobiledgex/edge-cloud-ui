import { fields } from "../.."

export const customize = (request, value) => {
    value[fields.registered] = value[fields.registered] ? true : false
    return value
}