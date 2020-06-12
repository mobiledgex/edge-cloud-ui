import moment from "moment";

const makeUTC = time => moment(time).utc();
export const selectedTimeRange = "today"; // TODO: selected time form toolbar
export const yesterdayWithCurrent = moment().subtract(1, "days").toString();
export const yesterdayOfStartDay = moment().subtract(1, "days").startOf("day").toString();
export const yesterdayOfEndDay = moment().subtract(1, "days").endOf("day").toString();
export const today = moment().format();
// UTC
export const yesterdayWithCurrentUTC = makeUTC(moment().subtract(1, "days").toString());
export const yesterdayOfStartDayUTC = makeUTC(moment().subtract(1, "days").startOf("day").toString());
export const yesterdayOfEndDayUTC = makeUTC(moment().subtract(1, "days").endOf("day").toString());
export const todayUTC = makeUTC(moment().format());
