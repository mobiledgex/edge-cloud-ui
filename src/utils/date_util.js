import * as moment from 'moment'

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

const makeUTC = (time) => {
    return moment(convertToUnix(time)).utc().format("YYYY-MM-DDTHH:mm:ss")
}

export const time = (format, date) => {
    return moment(date).format(format)
}

export const unixTime = (format, date, isUTC) => {
    return moment(convertToUnix(date)).format(format)
}

export const currentUTCTime = (format) => {
    return moment().utc().format(format)
}

export const currentTime = (format) => {
    return moment().format(format)
}

export const utcTime = (date, format) => {
    return moment(date).utc().format(format)
}

export const compareUTCTimeInMilli = (from, to) =>
{
    return convertToUnix(from) === currentTimeInMilli()
}


