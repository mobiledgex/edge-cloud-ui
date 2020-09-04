import * as moment from 'moment'
import {getMexTimezone} from './sharedPreferences_util'

export const FORMAT_FULL_DATE = 'YYYY-MM-DD'
export const FORMAT_FULL_TIME = 'HH:mm:ss'
export const FORMAT_TIME_HH_mm = 'HH:mm'
export const FORMAT_AM_PM = 'A'
export const FORMAT_DAY = 'D'
export const FORMAT_FULL_DATE_TIME = `${FORMAT_FULL_DATE} ${FORMAT_FULL_TIME}`
export const FORMAT_DATE_24_HH_mm = `${FORMAT_FULL_DATE} ${FORMAT_TIME_HH_mm}`
export const FORMAT_FULL_T_Z = `${FORMAT_FULL_DATE}T${FORMAT_FULL_TIME}Z`
export const FORMAT_FULL_T = `${FORMAT_FULL_DATE}T${FORMAT_FULL_TIME}`

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

export const timeInMilli = (date) =>
{
    return moment.tz(date, getMexTimezone()).valueOf()
}

export const convertToUnix = (date) =>
{
    return moment(date).unix()
}

export const convertToTimezone = (date)=>
{
    return date ? moment.tz(date, getMexTimezone()) : moment.tz(getMexTimezone())
}

export const time = (format, date) => {
    return convertToTimezone(date).format(format)
}

export const unixTime = (format, date) => {
    return convertToTimezone(convertToUnix(date)).format(format)
}

export const currentUTCTime = (format) => {
    return moment().utc().format(format)
}

export const currentTime = (format) => {
    return convertToTimezone().format(format)
}

export const utcTime = (format, date) => {
    return moment(date).utc().format(format)
}

export const subtractDays = (value, date) => {
    let obj = date ? moment(date) : moment()
    return value ? obj.subtract(value, 'days') : obj.subtract('days')
}

export const isAfter = (start, end) =>
{
    return moment(start).isAfter(end)
}

export const subtractMins = (mins) => {
    return mins ? moment().subtract(mins, 'minutes') : moment().subtract('minutes')
}

export const subtractMonth = (value) => {
    return value ? moment().subtract(value, 'month') : moment().subtract('month')
}

export const startOfMonth = (value) => {
    return value ? moment().startOf(value, 'month') : moment().startOf('month')
}

export const startOfDay = (value) => {
    return value ? moment().startOf(value, 'day') : moment().startOf('day')
}

export const endOfDay = (value) => {
    return value ? moment().endOf(value, 'day') : moment().endOf('day')
}

export const endOfMonth = (value) => {
    return value ? moment().endOf(value, 'month') : moment().endOf('month')
}


