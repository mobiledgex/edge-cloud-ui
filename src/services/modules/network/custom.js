import { connectionType } from "../../../helper/formatter/label"
import { localFields } from "../../fields"

export const customize = (request, value, self) => {
    value[localFields.connectionType] = connectionType(value[localFields.connectionType])
    return value
}