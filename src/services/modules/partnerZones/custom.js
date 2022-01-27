import { fields } from "../.."

export const customize = (request, value) => {
    console.log(value)
    value[fields.register] = value[fields.register] ? true : false
    return value
}