import { localFields } from "../../fields"
import { tpeState } from "../../../helper/formatter/label"

export const customize = (request, value, self) => {
    value[localFields.state] = value[localFields.state] ? tpeState(value[localFields.state]) : undefined
    return value
}