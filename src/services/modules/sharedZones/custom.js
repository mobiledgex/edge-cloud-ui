import { fields } from "../.."

export const customize = (request, value) => {
    value[fields.register] = value[fields.register] ? true : false
    return value
}