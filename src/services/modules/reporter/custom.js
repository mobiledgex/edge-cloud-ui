import { reporterInterval } from "../../../helper/formatter/label"
import { localFields } from "../../fields"

export const customize = (request, value) => {
    value[localFields.schedule] = reporterInterval(value[localFields.schedule])
    return value
}