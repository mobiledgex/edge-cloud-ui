import { fields } from "../.."

export const customize = (request, value) => {
    value[fields.register] = value['Registered'] ? true : false
    return value
}