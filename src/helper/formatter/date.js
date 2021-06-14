import { time } from "../../utils/date_util"

export const formatDate = (format, date, timezoneName) => {
    return time(format, date, timezoneName)
}