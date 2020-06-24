
import {timezoneName } from './date_util'
import moment from 'moment'

export const getMexTimezone = () => {
    return localStorage.getItem('mextimezone') ? localStorage.getItem('mextimezone') : timezoneName()
}

export const setMexTimezone = (value) => {
    var event = new Event('MexTimezoneChangeEvent');
    localStorage.setItem('mextimezone', value)
    moment.tz.setDefault(getMexTimezone())
    window.dispatchEvent(event);
}