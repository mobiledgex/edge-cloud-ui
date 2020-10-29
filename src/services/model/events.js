import * as formatter from './format'
import { EVENTS_SHOW } from './endPointTypes'

export const orgEvents = (data) => {
    return { method: EVENTS_SHOW, data: data, showSpinner: false }
}

export const getData = (response, body) => {
    return response && response.data ? response.data : []
}