import { fields } from "../.."
import { tpeState } from "../../../helper/formatter/label"

export const customize = (request, value, self) => {
    value[fields.state] = value[fields.state] ? tpeState(value[fields.state]) : undefined
    return value
}