import { connectionType } from "../../../helper/formatter/label"
import { fields } from "../../model/format"

export const customize = (request, value, self) => {
    value[fields.connectionType] = connectionType(value[fields.connectionType])
    return value
}