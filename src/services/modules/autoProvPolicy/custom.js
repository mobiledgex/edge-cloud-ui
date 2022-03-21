import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.cloudletCount] = value[localFields.cloudlets].length;
    return value
}