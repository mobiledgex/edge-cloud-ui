
import {timezoneName } from './date_util'

export const getMexTimezone = () => {
    return localStorage.getItem('mextimezone') ? localStorage.getItem('mextimezone') : timezoneName()
}

export const setMexTimezone = (value) => {
    var event = new Event('MexTimezoneChangeEvent');
    window.dispatchEvent(event);
    return localStorage.setItem('mextimezone', value)
}