import { reporterInterval } from "../../../helper/formatter/label"
import { fields } from "../../model/format"

export const customize = (request, value) => {
    value[fields.schedule] = reporterInterval(value[fields.schedule])
    value[fields.startdate] = time(FORMAT_FULL_DATE, value[fields.startdate])
    value[fields.nextDate] = time(FORMAT_FULL_DATE, value[fields.nextDate])
    return value
}