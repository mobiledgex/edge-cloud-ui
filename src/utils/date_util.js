import * as moment from 'moment'
import {getMexTimezone} from './sharedPreferences_util'

export const FORMAT_FULL_DATE = 'YYYY-MM-DD'
export const FORMAT_FULL_TIME = 'hh:mm:ss'
export const FORMAT_FULL_DATE_TIME = `${FORMAT_FULL_DATE} ${FORMAT_FULL_TIME}`
export const FORMAT_AM_PM = 'A'
export const FORMAT_DAY = 'D'

export const timezoneName = ()=>
{
    return moment.tz.guess()
}

export const timezoneOffset = ()=>
{
    return moment().utcOffset()
}

export const timezones = ()=>
{
    return moment.tz.names()
}

export const currentTimeInMilli = () =>
{
    return moment().valueOf()
}

export const convertToUnix = (date) =>
{
    return moment(date).unix()
}

export const time = (format, date) => {
    return moment.tz(date, getMexTimezone()).format(format)
}

export const unixTime = (format, date) => {
    return moment.tz(convertToUnix(date), getMexTimezone()).format(format)
}

export const currentUTCTime = (format) => {
    return moment().utc().format(format)
}

export const currentTime = (format) => {
    return moment.tz(getMexTimezone()).format(format)
}

export const utcTime = (date, format) => {
    return moment(date).utc().format(format)
}

export const compareUTCTimeInMilli = (from, to) =>
{
    return convertToUnix(from) === currentTimeInMilli()
}


