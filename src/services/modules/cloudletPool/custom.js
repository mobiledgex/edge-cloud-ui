import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.cloudletCount] = value[fields.cloudlets] ? value[fields.cloudlets].length : 0
    value[fields.createdAt] = value[fields.createdAt] ? value[fields.createdAt] : undefined
    value[fields.updatedAt] = value[fields.updatedAt] ? value[fields.updatedAt] : undefined
    value[fields.organizationCount] = 0
    return value
}