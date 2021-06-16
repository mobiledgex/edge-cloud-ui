import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.cloudletCount] = value[fields.cloudlets].length;
    return value
}