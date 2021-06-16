import { reporterInterval } from "../../../helper/formatter/label"
import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.schedule] = reporterInterval(value[fields.schedule])
    return value
}