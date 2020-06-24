import * as moment from 'moment'
import {getMexTimezone} from './sharedPreferences_util'

export const FORMAT_FULL_DATE = 'YYYY-MM-DD'
export const FORMAT_FULL_TIME = 'HH:mm:ss'
export const FORMAT_TIME_HH_mm = 'HH:mm'
export const FORMAT_AM_PM = 'A'
export const FORMAT_DAY = 'D'
export const FORMAT_FULL_DATE_TIME = `${FORMAT_FULL_DATE} ${FORMAT_FULL_TIME}`
export const FORMAT_DATE_24_HH_mm = `${FORMAT_FULL_DATE} ${FORMAT_TIME_HH_mm}`

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

export const compareUTCTimeInMilli = (from, to) =>
{
    return convertToUnix(from) === currentTimeInMilli()
}

export const subtractDays = (value) => {
    return value ? moment().subtract(value, 'days') : moment().subtract('days')
}

export const startOfMonth = (value) => {
    return value ? moment().startOf(value, 'month') : moment().startOf('month')
}

export const endOfMonth = (value) => {
    return value ? moment().endOf(value, 'month') : moment().endOf('month')
}


