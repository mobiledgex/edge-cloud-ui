import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.cloudletCount] = value[localFields.cloudlets] ? value[localFields.cloudlets].length : 0
    value[localFields.createdAt] = value[localFields.createdAt] ? value[localFields.createdAt] : undefined
    value[localFields.updatedAt] = value[localFields.updatedAt] ? value[localFields.updatedAt] : undefined
    value[localFields.organizationCount] = 0
    return value
}