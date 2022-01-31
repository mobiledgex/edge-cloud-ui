import { fields } from "../.."
import * as perpetual from "../../../helper/constant/perpetual"

export const customize = (request, value) => {
    value[fields.register] = value[fields.register] ? perpetual.YES : perpetual.NO
    return value
}