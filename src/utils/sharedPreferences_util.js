
import {timezoneName } from './date_util'

export const getMexTimezone = () => {
    return localStorage.getItem('mextimezone') ? localStorage.getItem('mextimezone') : timezoneName()
}

export const setMexTimezone = (value) => {
    return localStorage.setItem('mextimezone', value)
}