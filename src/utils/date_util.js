import * as moment from 'moment'
import { timezonePref } from './sharedPreferences_util'
import momentTimezone from "moment-timezone";

export const FORMAT_FULL_DATE = 'YYYY-MM-DD'
export const FORMAT_FULL_TIME = 'HH:mm:ss'
export const FORMAT_FULL_TIME_12 = 'hh:mm:ss'
export const FORMAT_TIME_HH_mm = 'HH:mm'
export const FORMAT_AM_PM = 'A'
export const FORMAT_DAY = 'D'
export const FORMAT_WD_TIME_HH_mm = `ddd, ${FORMAT_TIME_HH_mm}`
export const FORMAT_FULL_DATE_TIME = `${FORMAT_FULL_DATE} ${FORMAT_FULL_TIME}`
export const FORMAT_FULL_TIME_12_A = `${FORMAT_FULL_TIME_12} ${FORMAT_AM_PM}`
export const FORMAT_DATE_24_HH_mm = `${FORMAT_FULL_DATE} ${FORMAT_TIME_HH_mm}`
export const FORMAT_FULL_T_Z = `${FORMAT_FULL_DATE}T${FORMAT_FULL_TIME}Z`
export const FORMAT_FULL_T = `${FORMAT_FULL_DATE}T${FORMAT_FULL_TIME}`
export const ONE_DAY = 86400000

export const timezoneName = () => {
    return moment.tz.guess()
}

export const timezoneOffset = () => {
    return moment().utcOffset()
}

export const dateToOffset = (date) =>{
    return moment().utcOffset(date).format('Z')
}

export const timezones = () => {
    return moment.tz.names()
}

export const currentTimeInMilli = () => {
    return moment().valueOf()
}

export const timeInMilli = (date) => {
    return moment.tz(date, timezonePref()).valueOf()
}

export const convertToUnix = (date) => {
    return moment(date).unix()
}

export const convertToTimezone = (date, timezoneName) => {
    const timezone = timezoneName ? timezoneName : timezonePref()
    return date ? moment.tz(date, timezone) : moment.tz(timezone)
}

export const time = (format, date, timezoneName) => {
    return convertToTimezone(date, timezoneName).format(format)
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

export const currentDate = () => {
    return convertToTimezone().toDate()
}

export const utcTime = (format, date) => {
    return moment(date).utc().format(format)
}

export const subtractDays = (value, date) => {
    let obj = date ? moment(date) : moment()
    return value ? obj.subtract(value, 'days') : obj.subtract('days')
}

export const isAfter = (start, end) => {
    return moment(start).isAfter(end)
}

export const diff = (start, end, type) => {
    return moment(end).diff(start, type)
}

export const subtractMins = (value, date, isUtc) => {
    let obj = date ? isUtc ? moment.utc(date) : moment(date) : moment()
    return value ? obj.subtract(value, 'minutes') : obj.subtract('minutes')
}

export const addSeconds = (value, date) => {
    let obj = date ? moment(date) : moment()
    return value ? obj.add(value, 'seconds') : obj.add('seconds')
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

export const startOf = (type, value) => {
    return value ? moment(value).startOf(type) : moment().startOf(type)
}

export const endOf = (type, value) => {
    return value ? moment(value).endOf(type) : moment().endOf(type)
}